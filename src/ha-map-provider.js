// HA map internals are capability-tested rather than imported from hashed frontend chunks.
const sessions = new WeakMap();
const REFRESH_MS = 20 * 60 * 1000;
export function mapInstanceUrl(hass) {
  return (hass.connection?.options?.auth?.data?.hassUrl || location.origin).replace(/\/+$/, "");
}
export function resolveMapUrl(path, origin) {
  return new URL(path, origin + "/").href.replaceAll("%7B", "{").replaceAll("%7D", "}");
}
export function mapRequest(url, session) {
  const resolved = new URL(url, session.origin + "/");
  if (resolved.origin !== new URL(session.origin).origin || !resolved.pathname.startsWith("/api/map_tiles/")) {
    return { url: resolved.href };
  }
  if (session.transport === "header") return { url: resolved.href, headers: { "X-Map-Tiles-Token": session.token } };
  resolved.searchParams.set("token", session.token);
  return { url: resolved.href };
}
export function prepareMapStyle(original, origin, labels = true) {
  const style = structuredClone(original);
  for (const source of Object.values(style.sources)) {
    if (source.url) source.url = resolveMapUrl(source.url, origin);
    if (source.tiles) source.tiles = source.tiles.map(url => resolveMapUrl(url, origin));
  }
  if (style.glyphs) style.glyphs = resolveMapUrl(style.glyphs, origin);
  if (typeof style.sprite === "string") style.sprite = resolveMapUrl(style.sprite, origin);
  else if (Array.isArray(style.sprite)) style.sprite = style.sprite.map(sprite => ({ ...sprite, url: resolveMapUrl(sprite.url, origin) }));
  if (!labels) for (const layer of style.layers) {
    if (layer.type === "symbol" && layer.layout?.["text-field"] !== undefined) {
      layer.paint = { ...layer.paint, "text-opacity": 0 };
    }
  }
  return style;
}
export function acquireMapSession(hass, fetcher = fetch, clock = globalThis) {
  const connection = hass.connection;
  if (!connection?.sendMessagePromise) throw new Error("Home Assistant map service unavailable.");
  let session = sessions.get(connection);
  if (!session) {
    session = { origin: mapInstanceUrl(hass), token: "", transport: null, metadata: null, refs: 0, listeners: new Set(), pending: null, interval: null };
    session.refresh = () => {
      if (session.pending) return session.pending;
      session.pending = (async () => {
        const result = await connection.sendMessagePromise({ type: "map_tiles/access_token" });
        if (!result?.token) throw new Error("Home Assistant map service unavailable.");
        const previousToken = session.token;
        session.token = result.token;
        const url = session.origin + "/api/map_tiles/tilejson.json";
        let response;
        if (session.transport !== "query") {
          response = await fetcher(url, { headers: { "X-Map-Tiles-Token": session.token } });
          if (response.ok) session.transport = "header";
          else if (![401, 403].includes(response.status)) throw new Error("Home Assistant map service unavailable.");
        }
        if (!response?.ok) {
          response = await fetcher(url + "?token=" + encodeURIComponent(session.token));
          if (!response.ok) throw new Error("Home Assistant map service unavailable.");
          session.transport = "query";
        }
        session.metadata = await response.json();
        if (!session.interval && session.refs) session.interval = clock.setInterval(() => session.refresh().catch(() => {}), REFRESH_MS);
        if (previousToken !== session.token) for (const listener of session.listeners) listener();
        return session;
      })().finally(() => { session.pending = null; });
      return session.pending;
    };
    session.onReady = () => {
      const previous = session.token;
      return session.refresh().then(() => {
        if (previous === session.token) for (const listener of session.listeners) listener();
      }).catch(() => {});
    };
    sessions.set(connection, session);
  }
  if (!session.refs++) connection.addEventListener?.("ready", session.onReady);
  let released = false;
  return { session, release() {
    if (released) return;
    released = true;
    if (!--session.refs) {
      clock.clearInterval(session.interval); session.interval = null;
      connection.removeEventListener?.("ready", session.onReady);
      session.listeners.clear(); sessions.delete(connection);
    }
  } };
}
// Probe worker creation and execution: some browsers emit asynchronous CSP errors.
async function probeWorker(signal) {
  const url = URL.createObjectURL(new Blob(["postMessage('ready')"], { type: "text/javascript" }));
  let worker;
  try {
    await new Promise((resolve, reject) => {
      const finish = error => {
        clearTimeout(timeout);
        signal.removeEventListener("abort", abort);
        error ? reject(error) : resolve();
      };
      const abort = () => finish(new Error("Map removed."));
      const timeout = setTimeout(() => finish(new Error("Map worker unavailable.")), 2000);
      signal.addEventListener("abort", abort, { once: true });
      try {
        worker = new Worker(url, { type: "module" });
        worker.onmessage = () => finish();
        worker.onerror = event => { event.preventDefault(); finish(new Error("Map worker unavailable.")); };
      } catch { finish(new Error("Map worker unavailable.")); }
    });
  } finally { worker?.terminate(); URL.revokeObjectURL(url); }
}
let vectorLibraries;
async function loadVectorLibraries() {
  vectorLibraries ||= Promise.all([import("maplibre-gl"), import("@maplibre/maplibre-gl-leaflet"), import("maplibre-gl/dist/maplibre-gl.css"), import("card-vector-worker")]).catch(error => { vectorLibraries = null; throw error; });
  const [gl, adapter, css, worker] = await vectorLibraries;
  const maplibre = gl.default || gl;
  if (!loadVectorLibraries.workerUrl) {
    loadVectorLibraries.workerUrl = URL.createObjectURL(new Blob([worker.default], { type: "text/javascript" }));
    maplibre.setWorkerUrl(loadVectorLibraries.workerUrl);
    maplibre.setWorkerCount(2);
  }
  return { maplibre, adapter, css: css.default };
}
export async function createHaBackground({ L, map, hass, dark, labels, onStatus, installCss }) {
  const abortController = new AbortController();
  const handle = acquireMapSession(hass);
  const session = handle.session;
  let disposed = false, layer = null, gl = null, contextTimer = null, startupTimer = null, retryTimer = null;
  let styleRequest = 0, lastRecovery = 0, currentDark = dark, currentLabels = labels, appliedStyle = null, contextLost = false;
  let attribution = "", mode = "loading", libraries;
  const status = message => { if (!disposed) onStatus(message); };
  const removeLayer = () => { clearTimeout(contextTimer); clearTimeout(startupTimer); try { layer?.remove(); } catch {} layer = null; gl = null; };
  const raster = () => {
    if (disposed || mode === "raster") return;
    removeLayer(); mode = "raster";
    layer = L.tileLayer(session.origin + "/api/map_tiles/raster/{z}/{x}/{y}.png?token={token}", { token: session.token, maxNativeZoom: 19, maxZoom: 20, attribution: "" }).addTo(map);
    layer.getContainer()?.classList.toggle("ha-raster-dark", currentDark);
    layer.on("tileerror", recover);
    status("Simpler HA map: vector rendering unavailable; labels and styles are limited.");
  };
  const loadStyle = async () => {
    const id = ++styleRequest;
    const response = await fetch(session.origin + `/static/map/${currentDark ? "dark" : "light"}.json`);
    if (!response.ok) throw new Error("HA map style unavailable.");
    const style = prepareMapStyle(await response.json(), session.origin, currentLabels);
    if (disposed || id !== styleRequest) return null;
    appliedStyle = style; return style;
  };
  const recover = async () => {
    if (disposed || Date.now() - lastRecovery < 30000) return;
    lastRecovery = Date.now();
    const previous = session.token;
    try { await session.refresh(); if (disposed) return; if (mode === "vector" && appliedStyle && previous === session.token) gl?.setStyle(structuredClone(appliedStyle)); }
    catch { status("HA map temporarily unavailable. Reconnecting…"); }
  };
  const tokenUpdated = () => {
    if (disposed) return;
    if (mode === "raster" && layer) { layer.options.token = session.token; layer.redraw(); }
    if (mode === "vector" && appliedStyle) gl?.setStyle(structuredClone(appliedStyle));
  };
  session.listeners.add(tokenUpdated);
  const visibility = () => { if (!document.hidden) { recover(); if (contextLost) scheduleContextFallback(); } };
  const scheduleContextFallback = () => { clearTimeout(contextTimer); if (!document.hidden) contextTimer = setTimeout(raster, 2000); };
  document.addEventListener("visibilitychange", visibility);
  const controller = {
    get mode() { return mode; },
    get glMap() { return gl; },
    async update(nextDark, nextLabels) {
      if (disposed || (nextDark === currentDark && nextLabels === currentLabels)) return;
      currentDark = nextDark; currentLabels = nextLabels;
      if (mode === "loading") { ++styleRequest; return; }
      if (mode === "raster") { layer?.getContainer()?.classList.toggle("ha-raster-dark", currentDark); return; }
      try { const style = await loadStyle(); if (style && mode === "vector") gl?.setStyle(style); } catch { status("Unable to change HA map style; keeping the current style."); }
    },
    dispose() {
      if (disposed) return; disposed = true; ++styleRequest; abortController.abort();
      clearTimeout(retryTimer); removeLayer();
      document.removeEventListener("visibilitychange", visibility);
      session.listeners.delete(tokenUpdated); handle.release();
      if (attribution) map.attributionControl?.removeAttribution(attribution);
    }
  };
  const initialize = async () => {
    try {
      await session.refresh(); if (disposed) return;
      attribution = session.metadata.attribution || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
      map.attributionControl ||= L.control.attribution({ prefix: false }).addTo(map);
      map.attributionControl.setPrefix(false); map.attributionControl.addAttribution(attribution);
      try {
        const canvas = document.createElement("canvas"), context = canvas.getContext("webgl2");
        if (!context) { raster(); return; }
        context.getExtension("WEBGL_lose_context")?.loseContext();
        await probeWorker(abortController.signal); if (disposed) return;
        libraries = await loadVectorLibraries(); if (disposed) return;
        installCss(libraries.css);
        let style;
        do { style = await loadStyle(); } while (!style && !disposed);
        if (disposed) return;
        layer = libraries.adapter.maplibreGL({ style, interactive: false, attributionControl: false, transformRequest: url => mapRequest(url, session), maxZoom: 20, pitch: 0, bearing: 0 }).addTo(map);
        mode = "vector"; gl = layer.getMaplibreMap();
        gl.on("load", () => { clearTimeout(startupTimer); status(""); });
        gl.on("error", event => { const code = event.error?.status; if (!code || [401,403,404].includes(code)) recover(); });
        gl.on("webglcontextlost", () => { contextLost = true; scheduleContextFallback(); });
        gl.on("webglcontextrestored", () => { contextLost = false; clearTimeout(contextTimer); });
        startupTimer = setTimeout(() => { if (!gl?.isStyleLoaded()) raster(); }, 20000);
        status("");
      } catch { raster(); }
    } catch {
      mode = "unavailable";
      status("Home Assistant maps unavailable. Requires HA 2026.9+ with the map service. Retrying; CARTO remains available.");
      if (!disposed) retryTimer = setTimeout(initialize, 30000);
    }
  };
  // Return ownership immediately, so pending initialization can be cancelled.
  initialize();
  return controller;
}
