const LEAFLET_JS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
const LEAFLET_CSS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
let leafletPromise;

const DEFAULT_TILE_URL = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const DEFAULT_TILE_ATTRIBUTION = "&copy; OpenStreetMap contributors &copy; CARTO";
const DEFAULT_MARKER_COLOR = "#3388ff";
const DEFAULT_CARD_HEIGHT = "320px";
const DEFAULT_MARKER_SIZE = 32;
const DEFAULT_ZOOM = 16;
const DEFAULT_TAP_ACTION = Object.freeze({ action: "more-info" });
const DEFAULT_ICON_TAP_ACTION = Object.freeze({ action: "none" });
const ZOOM_CONTROL_POSITIONS = new Set(["topleft", "topright", "bottomleft", "bottomright"]);
const DEVICE_FIELD_PATTERNS = {
  latitude: /(^|[\s_.-])(latitude|lat)($|[\s_.-])/i,
  longitude: /(^|[\s_.-])(longitude|lon|lng|long)($|[\s_.-])/i,
  heading: /(^|[\s_.-])(heading|bearing|course|direction)($|[\s_.-])/i,
};
const LEAFLET_BASE_CSS = `
  .leaflet-pane,
  .leaflet-tile,
  .leaflet-marker-icon,
  .leaflet-marker-shadow,
  .leaflet-tile-container,
  .leaflet-pane > svg,
  .leaflet-pane > canvas,
  .leaflet-zoom-box,
  .leaflet-image-layer,
  .leaflet-layer {
    position: absolute;
    left: 0;
    top: 0;
  }

  .leaflet-container {
    overflow: hidden;
    position: relative;
    outline: 0;
    font-family: inherit;
    background: #ddd;
  }

  .leaflet-map-pane,
  .leaflet-tile-pane,
  .leaflet-overlay-pane,
  .leaflet-shadow-pane,
  .leaflet-marker-pane,
  .leaflet-tooltip-pane,
  .leaflet-popup-pane {
    position: absolute;
    inset: 0;
  }

  .leaflet-tile,
  .leaflet-marker-icon,
  .leaflet-marker-shadow {
    user-select: none;
    -webkit-user-drag: none;
  }

  .leaflet-tile {
    visibility: inherit;
    max-width: none;
    max-height: none;
  }

  .leaflet-safari .leaflet-tile {
    image-rendering: -webkit-optimize-contrast;
  }

  .leaflet-container .leaflet-overlay-pane svg,
  .leaflet-container .leaflet-marker-pane img,
  .leaflet-container .leaflet-shadow-pane img,
  .leaflet-container .leaflet-tile-pane img,
  .leaflet-container img.leaflet-image-layer,
  .leaflet-container .leaflet-tile {
    max-width: none;
    max-height: none;
  }

  .leaflet-container.leaflet-touch-zoom {
    touch-action: pan-x pan-y;
  }

  .leaflet-container.leaflet-touch-drag {
    touch-action: none;
    touch-action: pinch-zoom;
  }

  .leaflet-container.leaflet-grab {
    cursor: grab;
  }

  .leaflet-container.leaflet-dragging {
    cursor: grabbing;
  }

  .leaflet-control {
    position: relative;
    z-index: 800;
    pointer-events: auto;
  }

  .leaflet-top,
  .leaflet-bottom {
    position: absolute;
    z-index: 1000;
    pointer-events: none;
  }

  .leaflet-top {
    top: 0;
  }

  .leaflet-right {
    right: 0;
  }

  .leaflet-bottom {
    bottom: 0;
  }

  .leaflet-left {
    left: 0;
  }

  .leaflet-top .leaflet-control,
  .leaflet-bottom .leaflet-control {
    float: left;
    clear: both;
  }

  .leaflet-right .leaflet-control {
    float: right;
  }

  .leaflet-left .leaflet-control {
    float: left;
  }

  .leaflet-control-zoom,
  .leaflet-control-attribution {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.35);
  }

  .leaflet-bar {
    border-radius: 8px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.35);
  }

  .leaflet-bar a {
    background-color: var(--card-background-color, #ffffff);
    border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    color: var(--primary-text-color, #111111);
    display: block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    text-decoration: none;
    font-weight: 600;
  }

  .leaflet-bar a:hover {
    background-color: var(--secondary-background-color, #f3f4f6);
  }

  .leaflet-bar a:last-child {
    border-bottom: 0;
  }

  .leaflet-control-zoom-in,
  .leaflet-control-zoom-out {
    font: 18px/30px system-ui, sans-serif;
    text-indent: 0;
  }

  .leaflet-top.leaflet-left .leaflet-control {
    margin: 12px 0 0 12px;
  }

  .leaflet-top.leaflet-right .leaflet-control {
    margin: 12px 12px 0 0;
  }

  .leaflet-bottom.leaflet-left .leaflet-control,
  .leaflet-bottom.leaflet-right .leaflet-control {
    margin: 0 12px 12px;
  }

  .leaflet-control-attribution {
    background: rgba(28, 30, 35, 0.8);
    color: rgba(255, 255, 255, 0.78);
    font-size: 11px;
    line-height: 1.4;
    padding: 4px 8px;
  }

  .leaflet-control-attribution a {
    color: #8cb4ff;
    text-decoration: none;
  }

  .leaflet-control-attribution a:hover {
    text-decoration: underline;
  }

  .leaflet-popup {
    position: absolute;
    text-align: center;
    margin-bottom: 20px;
  }

  .leaflet-popup-content-wrapper {
    background: #1c1e23;
    color: #f3f5f7;
    border-radius: 10px;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
  }

  .leaflet-popup-content {
    margin: 12px 14px;
    line-height: 1.4;
  }

  .leaflet-popup-tip {
    width: 10px;
    height: 10px;
    margin: -5px auto 0;
    background: #1c1e23;
    transform: rotate(45deg);
  }
`;

const ensureLeaflet = async () => {
  if (window.L) {
    return window.L;
  }

  if (!leafletPromise) {
    leafletPromise = new Promise((resolve, reject) => {
      if (!document.querySelector(`link[href="${LEAFLET_CSS_URL}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = LEAFLET_CSS_URL;
        document.head.appendChild(link);
      }

      const existingScript = document.querySelector(`script[src="${LEAFLET_JS_URL}"]`);
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(window.L), { once: true });
        existingScript.addEventListener("error", () => reject(new Error("Failed to load Leaflet")), {
          once: true,
        });
        return;
      }

      const script = document.createElement("script");
      script.src = LEAFLET_JS_URL;
      script.async = true;
      script.onload = () => resolve(window.L);
      script.onerror = () => reject(new Error("Failed to load Leaflet"));
      document.head.appendChild(script);
    });
  }

  return leafletPromise;
};

const asNumber = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const firstNonEmptyString = (...values) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
};

const normalizeSelectValue = (value, allowedValues, fallback) =>
  allowedValues.has(value) ? value : fallback;

const normalizeHex = (value) =>
  /^#[0-9a-fA-F]{6}$/.test(value || "") ? value.toLowerCase() : DEFAULT_MARKER_COLOR;

const normalizeHeight = (value) => {
  if (value === undefined || value === null || value === "") {
    return DEFAULT_CARD_HEIGHT;
  }

  if (typeof value === "number") {
    return `${value}px`;
  }

  const trimmed = String(value).trim();
  if (!trimmed) {
    return DEFAULT_CARD_HEIGHT;
  }

  return /^\d+$/.test(trimmed) ? `${trimmed}px` : trimmed;
};

const normalizeActionConfig = (value, fallbackAction) => {
  if (!value || typeof value !== "object") {
    return { action: fallbackAction };
  }

  return {
    ...value,
    action: typeof value.action === "string" ? value.action : fallbackAction,
  };
};

const fireEvent = (node, type, detail = {}, options = {}) =>
  node.dispatchEvent(
    new CustomEvent(type, {
      detail,
      bubbles: options.bubbles !== false,
      composed: options.composed !== false,
      cancelable: Boolean(options.cancelable),
    })
  );

const getHeadingFromState = (state) => {
  const heading =
    asNumber(state?.attributes?.heading) ??
    asNumber(state?.attributes?.bearing) ??
    asNumber(state?.attributes?.course) ??
    asNumber(state?.state);

  if (heading === null) {
    return null;
  }

  return ((heading % 360) + 360) % 360;
};

const hasDirectCoordinates = (state) =>
  asNumber(state?.attributes?.latitude) !== null && asNumber(state?.attributes?.longitude) !== null;

const getDeviceLabel = (device) =>
  firstNonEmptyString(
    device?.name_by_user,
    device?.name,
    [device?.manufacturer, device?.model].filter(Boolean).join(" "),
    device?.id
  ) || "Device";

const getEntitySearchText = (entry) =>
  [
    entry?.entity_id,
    entry?.name,
    entry?.original_name,
    entry?.translation_key,
    entry?.platform,
    entry?.device_class,
    entry?.original_device_class,
  ]
    .filter(Boolean)
    .join(" ");

const pickDeviceFieldEntity = (entities, hass, kind) => {
  const pattern = DEVICE_FIELD_PATTERNS[kind];
  const ranked = entities
    .filter((entry) => !entry.disabled_by)
    .map((entry) => {
      const text = getEntitySearchText(entry);
      if (!pattern.test(text)) {
        return null;
      }

      const state = hass?.states?.[entry.entity_id];
      let score = 100;

      if (asNumber(state?.state) !== null) {
        score += 10;
      }

      if (!entry.hidden_by) {
        score += 5;
      }

      return { entry, score };
    })
    .filter(Boolean)
    .sort((left, right) => right.score - left.score || left.entry.entity_id.localeCompare(right.entry.entity_id));

  return ranked[0]?.entry || null;
};

const pickCoordinateEntity = (entities, hass) => {
  const ranked = entities
    .filter((entry) => !entry.disabled_by)
    .map((entry) => {
      const state = hass?.states?.[entry.entity_id];
      if (!hasDirectCoordinates(state)) {
        return null;
      }

      let score = 200;

      if (getHeadingFromState(state) !== null) {
        score += 25;
      }

      if (!entry.hidden_by) {
        score += 5;
      }

      return { entry, score };
    })
    .filter(Boolean)
    .sort((left, right) => right.score - left.score || left.entry.entity_id.localeCompare(right.entry.entity_id));

  return ranked[0]?.entry || null;
};

const resolveDeviceMapping = (device, deviceEntities, hass) => {
  const directEntity = pickCoordinateEntity(deviceEntities, hass);
  const latitudeEntity = directEntity ? null : pickDeviceFieldEntity(deviceEntities, hass, "latitude");
  const longitudeEntity = directEntity ? null : pickDeviceFieldEntity(deviceEntities, hass, "longitude");
  const headingEntity =
    directEntity && getHeadingFromState(hass?.states?.[directEntity.entity_id]) !== null
      ? null
      : pickDeviceFieldEntity(deviceEntities, hass, "heading");

  if (!directEntity && (!latitudeEntity || !longitudeEntity)) {
    return null;
  }

  const primaryEntityId =
    directEntity?.entity_id ||
    headingEntity?.entity_id ||
    latitudeEntity?.entity_id ||
    longitudeEntity?.entity_id ||
    null;

  return {
    deviceId: device.id,
    label: getDeviceLabel(device),
    entityId: primaryEntityId,
    latitudeEntityId: directEntity ? null : latitudeEntity?.entity_id || null,
    longitudeEntityId: directEntity ? null : longitudeEntity?.entity_id || null,
    headingEntityId: headingEntity?.entity_id || null,
    supportsHeading: Boolean(
      headingEntity || (directEntity && getHeadingFromState(hass?.states?.[directEntity.entity_id]) !== null)
    ),
  };
};

const buildCompatibleDevices = (devices, entities, hass) => {
  const entitiesByDeviceId = new Map();

  for (const entry of entities) {
    if (!entry?.device_id || !entry?.entity_id) {
      continue;
    }

    if (!entitiesByDeviceId.has(entry.device_id)) {
      entitiesByDeviceId.set(entry.device_id, []);
    }

    entitiesByDeviceId.get(entry.device_id).push(entry);
  }

  return devices
    .map((device) => resolveDeviceMapping(device, entitiesByDeviceId.get(device.id) || [], hass))
    .filter(Boolean)
    .sort((left, right) => left.label.localeCompare(right.label));
};

const normalizeCardConfig = (config = {}) => ({
  ...config,
  zoom: asNumber(config.zoom) ?? DEFAULT_ZOOM,
  fit_bounds: config.fit_bounds !== false,
  height: normalizeHeight(config.height),
  color: normalizeHex(config.color),
  marker_size: asNumber(config.marker_size) ?? DEFAULT_MARKER_SIZE,
  tile_url: config.tile_url || DEFAULT_TILE_URL,
  tile_attribution: config.tile_attribution || DEFAULT_TILE_ATTRIBUTION,
  tile_subdomains: config.tile_subdomains || "abcd",
  show_attribution: config.show_attribution === true,
  show_zoom_controls: config.show_zoom_controls !== false,
  zoom_control_position: normalizeSelectValue(config.zoom_control_position, ZOOM_CONTROL_POSITIONS, "topleft"),
  subtitle: firstNonEmptyString(config.subtitle, config.subtitle_text) || "",
  icon: firstNonEmptyString(config.icon) || "",
});

class EntityHeadingMapCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = normalizeCardConfig();
    this._hass = null;
    this._map = null;
    this._tileLayer = null;
    this._zoomControl = null;
    this._markers = new Map();
    this._markerPoints = new Map();
    this._leafletReady = false;
    this._leafletError = null;
    this._hasSizedMap = false;
    this._activePoint = null;
    this._viewInitialized = false;
    this._lastViewSignature = null;

    this.shadowRoot.innerHTML = `
      <style>
        ${LEAFLET_BASE_CSS}

        :host {
          display: block;
        }

        ha-card {
          position: relative;
          overflow: hidden;
          z-index: 0;
        }

        .wrapper {
          display: flex;
          flex-direction: column;
        }

        .header {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 16px 16px 12px;
        }

        .header.has-subtitle {
          align-items: flex-start;
        }

        .header[hidden] {
          display: none;
        }

        .header-copy {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
          flex: 1;
          min-height: 42px;
        }

        .header.has-subtitle .header-copy {
          justify-content: flex-start;
        }

        .header.actionable {
          cursor: pointer;
        }

        .icon-button {
          width: 42px;
          height: 42px;
          padding: 0;
          border: 0;
          border-radius: 12px;
          background: rgba(56, 102, 255, 0.12);
          color: var(--state-icon-color, var(--primary-text-color));
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
        }

        .icon-button[hidden] {
          display: none;
        }

        .icon-button.actionable {
          cursor: pointer;
        }

        .icon-button:not(.actionable) {
          cursor: default;
        }

        .header-icon {
          --mdc-icon-size: 22px;
        }

        .title {
          font-family: var(--ha-card-header-font-family, inherit);
          font-size: var(--ha-card-header-font-size, 1rem);
          font-weight: var(--ha-card-header-font-weight, 500);
          color: var(--primary-text-color);
          line-height: var(--ha-card-header-line-height, 1.3);
        }

        .subtitle {
          margin-top: 4px;
          color: var(--secondary-text-color);
          font-size: 0.88rem;
          line-height: 1.35;
        }

        .map-shell {
          position: relative;
          isolation: isolate;
          z-index: 0;
        }

        .map-shell.preview-mode {
          overflow: hidden;
          border-radius: inherit;
        }

        #map {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 240px;
          background:
            radial-gradient(circle at top left, rgba(40, 120, 180, 0.14), transparent 40%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.06));
        }

        .preview-overlay {
          position: absolute;
          inset: 0;
          z-index: 640;
          overflow: hidden;
          background:
            linear-gradient(90deg, transparent 0 18%, rgba(255, 255, 255, 0.92) 18% 20.4%, transparent 20.4% 100%),
            linear-gradient(0deg, transparent 0 73%, rgba(255, 255, 255, 0.92) 73% 75.8%, transparent 75.8% 100%),
            linear-gradient(90deg, transparent 0 57%, rgba(255, 255, 255, 0.88) 57% 59.2%, transparent 59.2% 100%),
            linear-gradient(33deg, transparent 0 78%, rgba(255, 255, 255, 0.86) 78% 80.2%, transparent 80.2% 100%),
            radial-gradient(circle at 22% 28%, rgba(208, 230, 202, 0.38), transparent 18%),
            radial-gradient(circle at 82% 18%, rgba(255, 255, 255, 0.35), transparent 18%),
            linear-gradient(180deg, #faf8f3, #f3efe8);
        }

        .preview-overlay[hidden] {
          display: none;
        }

        .preview-controls {
          position: absolute;
          top: 14px;
          left: 14px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-radius: 10px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
        }

        .preview-control {
          width: 30px;
          height: 30px;
          border: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--card-background-color, #ffffff);
          color: var(--primary-text-color);
          font: 600 24px/1 system-ui, sans-serif;
        }

        .preview-control + .preview-control {
          border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        }

        .preview-marker {
          position: absolute;
          left: 50%;
          top: 50%;
          width: max(38px, calc(var(--marker-size, 32px) * 1.2));
          height: max(38px, calc(var(--marker-size, 32px) * 1.2));
          transform: translate(-50%, -50%);
          filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.2));
        }

        .preview-marker svg {
          width: 100%;
          height: 100%;
          overflow: visible;
          transform: rotate(var(--heading, 72deg));
          transform-origin: 50% 50%;
        }

        .preview-marker .arrow-shape {
          fill: var(--marker-color, #3388ff);
          stroke: var(--marker-color, #3388ff);
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
          vector-effect: non-scaling-stroke;
          opacity: 1;
        }

        .marker-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 700;
          overflow: hidden;
        }

        .map-message {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          color: #f3f5f7;
          text-align: center;
          background: rgba(28, 30, 35, 0.38);
          backdrop-filter: blur(2px);
          z-index: 650;
        }

        .map-message[hidden] {
          display: none;
        }

        .dom-marker {
          position: absolute;
          left: 0;
          top: 0;
          width: var(--marker-size, 32px);
          height: var(--marker-size, 32px);
          transform: translate(-50%, -50%);
          pointer-events: none;
          filter: drop-shadow(0 3px 10px rgba(0, 0, 0, 0.28));
          will-change: left, top, transform;
        }

        .dom-marker svg {
          width: 100%;
          height: 100%;
          overflow: visible;
          transform-origin: 50% 50%;
        }

        .dom-marker[data-marker-kind="arrow"] svg {
          transform: rotate(var(--heading, 0deg));
        }

        .dom-marker[data-marker-kind="dot"] svg {
          transform: none;
        }

        .dom-marker .arrow-shape {
          fill: var(--marker-color, #3388ff);
          stroke: var(--marker-color, #3388ff);
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
          vector-effect: non-scaling-stroke;
          opacity: 1;
        }

        .dom-marker .dot-shape {
          fill: var(--marker-color, #3388ff);
          opacity: 0.96;
        }

      </style>
      <ha-card id="card">
        <div class="wrapper">
          <div id="header" class="header" hidden>
            <button id="icon-button" class="icon-button" type="button" hidden>
              <ha-icon id="icon" class="header-icon"></ha-icon>
            </button>
            <div class="header-copy">
              <div id="title" class="title" hidden></div>
              <div id="subtitle" class="subtitle" hidden></div>
            </div>
          </div>
          <div class="map-shell">
            <div id="map"></div>
            <div id="preview-overlay" class="preview-overlay" hidden>
              <div class="preview-controls" aria-hidden="true">
                <div class="preview-control">+</div>
                <div class="preview-control">−</div>
              </div>
              <div id="preview-marker" class="preview-marker" aria-hidden="true"></div>
            </div>
            <div id="message" class="map-message">Loading map…</div>
            <div id="marker-layer" class="marker-layer" aria-hidden="true"></div>
          </div>
        </div>
      </ha-card>
    `;

    this.shadowRoot.getElementById("card").addEventListener("click", (event) => this._handleCardTap(event));
    this.shadowRoot
      .getElementById("icon-button")
      .addEventListener("click", (event) => this._handleIconTap(event));
  }

  setConfig(config) {
    const previousConfig = this._config;
    this._config = normalizeCardConfig(config);

    if (
      !previousConfig ||
      previousConfig.device_id !== this._config.device_id ||
      previousConfig.entity !== this._config.entity ||
      previousConfig.latitude_entity !== this._config.latitude_entity ||
      previousConfig.longitude_entity !== this._config.longitude_entity ||
      previousConfig.heading_entity !== this._config.heading_entity ||
      previousConfig.zoom !== this._config.zoom ||
      previousConfig.fit_bounds !== this._config.fit_bounds
    ) {
      this._viewInitialized = false;
      this._lastViewSignature = null;
    }

    this._renderShell();

    if (this._isPreviewMode()) {
      return;
    }

    this._syncZoomControl();
    this._initLeaflet();

    if (this._hass && this._leafletReady) {
      this._updateMap();
    } else if (!this._hasConfiguredSource()) {
      this._setMessage("Select a compatible device.");
    }
  }

  set hass(hass) {
    this._hass = hass;

    if (this._isPreviewMode()) {
      return;
    }

    this._updateMap();
  }

  getCardSize() {
    return 4;
  }

  async _initLeaflet() {
    if (this._isPreviewMode()) {
      return;
    }

    try {
      await ensureLeaflet();
      this._leafletReady = true;
      this._leafletError = null;
      this._ensureMap();
      this._updateMap();
    } catch (error) {
      this._leafletError = error;
      this._setMessage("Unable to load map library.");
    }
  }

  _renderShell() {
    const mapEl = this.shadowRoot.getElementById("map");
    mapEl.style.height = normalizeHeight(this._config.height);
    this._applyActionState();

    if (this._isPreviewMode()) {
      this._renderPreviewState();
      return;
    }

    this._clearPreviewState();
    this._updateHeader([]);
  }

  _isPreviewMode() {
    return (
      this._config?.__preview === true &&
      !this._config?.entity &&
      !this._config?.device_id &&
      !this._config?.latitude_entity &&
      !this._config?.longitude_entity &&
      !(Array.isArray(this._config?.entities) && this._config.entities.length > 0)
    );
  }

  _renderPreviewState() {
    const cardEl = this.shadowRoot.getElementById("card");
    const mapShell = this.shadowRoot.querySelector(".map-shell");
    const previewOverlay = this.shadowRoot.getElementById("preview-overlay");
    const previewMarker = this.shadowRoot.getElementById("preview-marker");
    const markerLayer = this.shadowRoot.getElementById("marker-layer");
    const messageEl = this.shadowRoot.getElementById("message");
    const headerEl = this.shadowRoot.getElementById("header");

    cardEl.dataset.previewMode = "true";
    mapShell.classList.add("preview-mode");
    previewOverlay.hidden = false;
    markerLayer.hidden = true;
    messageEl.hidden = true;
    headerEl.hidden = true;
    previewMarker.innerHTML = this._getMarkerMarkup("arrow");
    previewMarker.style.setProperty("--marker-color", normalizeHex(this._config.color));
    previewMarker.style.setProperty("--heading", "72deg");
    previewMarker.style.setProperty(
      "--marker-size",
      `${Math.max(this._config.marker_size ?? DEFAULT_MARKER_SIZE, 32)}px`
    );
  }

  _clearPreviewState() {
    const cardEl = this.shadowRoot.getElementById("card");
    const mapShell = this.shadowRoot.querySelector(".map-shell");
    const previewOverlay = this.shadowRoot.getElementById("preview-overlay");
    const previewMarker = this.shadowRoot.getElementById("preview-marker");
    const markerLayer = this.shadowRoot.getElementById("marker-layer");

    delete cardEl.dataset.previewMode;
    mapShell.classList.remove("preview-mode");
    previewOverlay.hidden = true;
    previewMarker.innerHTML = "";
    markerLayer.hidden = false;
  }

  _hasConfiguredSource() {
    return (
      (Array.isArray(this._config.entities) && this._config.entities.length > 0) ||
      Boolean(this._config.entity) ||
      Boolean(this._config.latitude_entity && this._config.longitude_entity)
    );
  }

  _getZoomControlPosition() {
    return normalizeSelectValue(this._config?.zoom_control_position, ZOOM_CONTROL_POSITIONS, "topleft");
  }

  _syncZoomControl() {
    if (!this._map || !this._leafletReady) {
      return;
    }

    const showZoomControls = this._config?.show_zoom_controls !== false;
    const zoomControlPosition = this._getZoomControlPosition();

    if (!showZoomControls) {
      this._zoomControl?.remove();
      this._zoomControl = null;
      return;
    }

    if (!this._zoomControl) {
      this._zoomControl = window.L.control.zoom({ position: zoomControlPosition }).addTo(this._map);
      return;
    }

    this._zoomControl.setPosition(zoomControlPosition);
  }

  _ensureMap() {
    if (!this._leafletReady || this._map) {
      return;
    }

    const mapEl = this.shadowRoot.getElementById("map");
    this._map = window.L.map(mapEl, {
      zoomControl: false,
      attributionControl: this._config.show_attribution === true,
      dragging: true,
      touchZoom: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
    });

    this._tileLayer = window.L.tileLayer(this._config.tile_url, {
      attribution: this._config.tile_attribution,
      maxZoom: 20,
      subdomains: this._config.tile_subdomains,
    }).addTo(this._map);

    requestAnimationFrame(() => {
      this._map?.invalidateSize(true);
      this._hasSizedMap = true;
    });

    this._syncZoomControl();
    this._map.on("zoom viewreset move resize", () => this._redrawMarkers());
  }

  _getEntityState(entityId) {
    if (!entityId || !this._hass) {
      return null;
    }

    return this._hass.states[entityId] || null;
  }

  _resolveCoordinateSource(entry) {
    const entityState = this._getEntityState(entry.entity);
    const latitudeState = this._getEntityState(entry.latitude_entity);
    const longitudeState = this._getEntityState(entry.longitude_entity);
    const headingState = this._getEntityState(entry.heading_entity);
    const latFromEntity = asNumber(entityState?.attributes?.latitude);
    const lonFromEntity = asNumber(entityState?.attributes?.longitude);

    let latitude = latFromEntity;
    let longitude = lonFromEntity;

    if (latitude === null && latitudeState) {
      latitude = asNumber(latitudeState.state);
    }

    if (longitude === null && longitudeState) {
      longitude = asNumber(longitudeState.state);
    }

    let heading =
      asNumber(headingState?.state) ??
      asNumber(entityState?.attributes?.heading) ??
      asNumber(entityState?.attributes?.bearing) ??
      asNumber(entityState?.attributes?.course);

    if (heading !== null) {
      heading = ((heading % 360) + 360) % 360;
    }

    if (latitude === null || longitude === null) {
      return null;
    }

    const name =
      entry.name ||
      entityState?.attributes?.friendly_name ||
      this._getEntityState(entry.heading_entity)?.attributes?.friendly_name ||
      this._getEntityState(entry.latitude_entity)?.attributes?.friendly_name ||
      entry.entity ||
      entry.latitude_entity ||
      "Entity";

    return {
      key:
        entry.id ||
        entry.device_id ||
        entry.entity ||
        `${entry.latitude_entity || latitude}:${entry.longitude_entity || longitude}`,
      name,
      latitude,
      longitude,
      heading,
      color: entry.color || this._config.color,
      actionEntityId: entry.entity || entry.heading_entity || entry.latitude_entity || entry.longitude_entity || null,
    };
  }

  _getEntries() {
    if (!this._config) {
      return [];
    }

    if (Array.isArray(this._config.entities) && this._config.entities.length > 0) {
      return this._config.entities;
    }

    if (!this._hasConfiguredSource()) {
      return [];
    }

    return [
      {
        id: this._config.device_id || this._config.entity || this._config.latitude_entity,
        device_id: this._config.device_id,
        entity: this._config.entity,
        latitude_entity: this._config.latitude_entity,
        longitude_entity: this._config.longitude_entity,
        heading_entity: this._config.heading_entity,
        name: this._config.name,
        color: this._config.color,
      },
    ];
  }

  _getMarkerMarkup(kind) {
    if (kind === "dot") {
      return `
        <svg viewBox="-12 -12 24 24" role="presentation">
          <circle class="dot-shape" cx="0" cy="0" r="4.5"></circle>
        </svg>
      `;
    }

    return `
      <svg viewBox="-8 -10 16 16" role="presentation">
        <path class="arrow-shape" d="M0,-7.6 C1.2,-4.9 2.9,-0.9 5.35,5.55 C3.55,4.92 1.95,4.42 0,3.95 C-1.95,4.42 -3.55,4.92 -5.35,5.55 C-2.9,-0.9 -1.2,-4.9 0,-7.6 Z"></path>
      </svg>
    `;
  }

  _syncMarker(point) {
    let marker = this._markers.get(point.key);
    const markerKind = point.heading === null ? "dot" : "arrow";

    if (!marker) {
      marker = document.createElement("div");
      marker.className = "dom-marker";
      marker.dataset.markerKind = markerKind;
      marker.innerHTML = this._getMarkerMarkup(markerKind);
      this.shadowRoot.getElementById("marker-layer").appendChild(marker);
      this._markers.set(point.key, marker);
    } else if (marker.dataset.markerKind !== markerKind) {
      marker.dataset.markerKind = markerKind;
      marker.innerHTML = this._getMarkerMarkup(markerKind);
    }

    marker.style.setProperty("--marker-color", point.color);
    marker.style.setProperty("--marker-size", `${this._config.marker_size ?? DEFAULT_MARKER_SIZE}px`);
    marker.style.setProperty("--heading", `${point.heading ?? 0}deg`);
    marker.title = point.heading !== null ? `${point.name} (${Math.round(point.heading)}°)` : point.name;
    this._markerPoints.set(point.key, point);
    this._positionMarker(point.key);
  }

  _redrawMarkers() {
    if (!this._map) {
      return;
    }

    for (const key of this._markers.keys()) {
      this._positionMarker(key);
    }
  }

  _positionMarker(key) {
    const point = this._markerPoints.get(key);
    const marker = this._markers.get(key);
    if (!point || !marker || !this._map) {
      return;
    }

    const layerPoint = this._map.latLngToContainerPoint([point.latitude, point.longitude]);
    const size = this._map.getSize();
    const markerSize = this._config.marker_size ?? DEFAULT_MARKER_SIZE;
    const overflow = Math.max(24, markerSize / 2 + 8);
    const isVisible =
      layerPoint.x >= -overflow &&
      layerPoint.y >= -overflow &&
      layerPoint.x <= size.x + overflow &&
      layerPoint.y <= size.y + overflow;

    marker.style.display = isVisible ? "block" : "none";
    marker.style.left = `${layerPoint.x}px`;
    marker.style.top = `${layerPoint.y}px`;
  }

  _getTitle(points) {
    return firstNonEmptyString(
      this._config?.title,
      points.length === 1 ? points[0]?.name : null,
      points.length > 1 ? `${points.length} entities` : null
    );
  }

  _getSubtitle() {
    return firstNonEmptyString(this._config?.subtitle);
  }

  _updateHeader(points) {
    const headerEl = this.shadowRoot.getElementById("header");
    const titleEl = this.shadowRoot.getElementById("title");
    const subtitleEl = this.shadowRoot.getElementById("subtitle");
    const iconButton = this.shadowRoot.getElementById("icon-button");
    const iconEl = this.shadowRoot.getElementById("icon");
    const title = this._getTitle(points);
    const subtitle = this._getSubtitle();
    const icon = firstNonEmptyString(this._config?.icon);
    const hasHeader = Boolean(icon || title || subtitle);
    const hasSubtitle = Boolean(subtitle);

    headerEl.hidden = !hasHeader;
    headerEl.classList.toggle("has-subtitle", hasSubtitle);
    titleEl.hidden = !title;
    titleEl.textContent = title || "";
    subtitleEl.hidden = !subtitle;
    subtitleEl.textContent = subtitle || "";
    iconButton.hidden = !icon;

    if (icon) {
      iconEl.icon = icon;
    } else {
      iconEl.icon = "";
    }

    this._applyActionState();
  }

  _updateView(points) {
    if (!this._map || points.length === 0) {
      return;
    }

    if (points.length === 1 || this._config.fit_bounds === false) {
      const [point] = points;
      const signature = `single:${point.latitude.toFixed(5)}:${point.longitude.toFixed(5)}`;

      if (!this._viewInitialized) {
        this._map.setView([point.latitude, point.longitude], this._config.zoom);
        this._viewInitialized = true;
        this._lastViewSignature = signature;
        return;
      }

      if (this._lastViewSignature !== signature) {
        this._map.panTo([point.latitude, point.longitude]);
        this._lastViewSignature = signature;
      }

      return;
    }

    const bounds = window.L.latLngBounds(points.map((point) => [point.latitude, point.longitude]));
    const signature = `multi:${points
      .map((point) => `${point.latitude.toFixed(5)}:${point.longitude.toFixed(5)}`)
      .sort()
      .join("|")}`;

    if (!this._viewInitialized || this._lastViewSignature !== signature) {
      this._map.fitBounds(bounds, { padding: [24, 24], maxZoom: this._config.zoom });
      this._viewInitialized = true;
      this._lastViewSignature = signature;
    }
  }

  _getPrimaryActionEntityId() {
    return (
      this._activePoint?.actionEntityId ||
      this._config.entity ||
      this._config.heading_entity ||
      this._config.latitude_entity ||
      this._config.longitude_entity ||
      null
    );
  }

  _isMapInteractionTarget(event) {
    return event.composedPath().some((node) => {
      if (!(node instanceof HTMLElement)) {
        return false;
      }

      return (
        node.classList.contains("map-shell") ||
        node.classList.contains("leaflet-container") ||
        node.classList.contains("leaflet-control") ||
        node.classList.contains("leaflet-pane") ||
        node.classList.contains("leaflet-tile")
      );
    });
  }

  _runAction(actionConfig, entityId) {
    if (!this._hass) {
      return;
    }

    switch (actionConfig.action) {
      case "none":
        return;
      case "toggle":
        if (entityId) {
          this._hass.callService("homeassistant", "toggle", { entity_id: entityId });
        }
        return;
      case "navigate":
        if (actionConfig.navigation_path) {
          window.history.pushState(null, "", actionConfig.navigation_path);
          fireEvent(window, "location-changed", { replace: false });
        }
        return;
      case "url":
        if (actionConfig.url_path) {
          window.open(actionConfig.url_path, actionConfig.new_tab === false ? "_self" : "_blank", "noopener");
        }
        return;
      case "assist":
        if (actionConfig.pipeline_id || actionConfig.start_listening !== undefined) {
          fireEvent(this, "assist", {
            pipeline_id: actionConfig.pipeline_id,
            start_listening: actionConfig.start_listening,
          });
          return;
        }

        window.history.pushState(null, "", "/assist");
        fireEvent(window, "location-changed", { replace: false });
        return;
      case "perform-action":
        if (typeof actionConfig.perform_action === "string" && actionConfig.perform_action.includes(".")) {
          const [domain, service] = actionConfig.perform_action.split(".", 2);
          this._hass.callService(domain, service, actionConfig.data, actionConfig.target);
        }
        return;
      case "more-info":
      default:
        if (entityId) {
          fireEvent(this, "hass-more-info", { entityId });
        }
    }
  }

  _applyActionState() {
    const headerEl = this.shadowRoot.getElementById("header");
    const iconButton = this.shadowRoot.getElementById("icon-button");
    const cardAction = normalizeActionConfig(this._config?.tap_action, DEFAULT_TAP_ACTION.action);
    const iconAction = normalizeActionConfig(this._config?.icon_tap_action, DEFAULT_ICON_TAP_ACTION.action);
    const hasIcon = Boolean(firstNonEmptyString(this._config?.icon));

    headerEl.classList.toggle("actionable", cardAction.action !== "none");
    iconButton.classList.toggle("actionable", hasIcon && iconAction.action !== "none");
  }

  _handleCardTap(event) {
    if (this._isPreviewMode()) {
      return;
    }

    if (this._isMapInteractionTarget(event)) {
      return;
    }

    const actionConfig = normalizeActionConfig(this._config?.tap_action, DEFAULT_TAP_ACTION.action);
    this._runAction(actionConfig, this._getPrimaryActionEntityId());
  }

  _handleIconTap(event) {
    event.stopPropagation();

    if (this._isPreviewMode()) {
      return;
    }

    const actionConfig = normalizeActionConfig(this._config?.icon_tap_action, DEFAULT_ICON_TAP_ACTION.action);
    this._runAction(actionConfig, this._getPrimaryActionEntityId());
  }

  _updateMap() {
    if (this._isPreviewMode()) {
      this._renderPreviewState();
      return;
    }

    if (!this._config || !this._hass || !this._leafletReady) {
      return;
    }

    this._ensureMap();
    this._syncZoomControl();

    const points = this._getEntries()
      .map((entry) => this._resolveCoordinateSource(entry))
      .filter(Boolean);

    const activeKeys = new Set(points.map((point) => point.key));

    for (const [key, marker] of this._markers.entries()) {
      if (!activeKeys.has(key)) {
        marker.remove();
        this._markers.delete(key);
        this._markerPoints.delete(key);
      }
    }

    this._activePoint = points[0] || null;
    this._updateHeader(points);

    if (points.length === 0) {
      this._setMessage(this._hasConfiguredSource() ? "No valid coordinates available." : "Select a compatible device.");
      return;
    }

    if (!this._hasSizedMap) {
      requestAnimationFrame(() => {
        this._map?.invalidateSize(true);
        this._hasSizedMap = true;
      });
    }

    this._updateView(points);
    points.forEach((point) => this._syncMarker(point));
    this._redrawMarkers();
    requestAnimationFrame(() => this._map?.invalidateSize(true));
    this._setMessage("");
  }

  _setMessage(message) {
    const messageEl = this.shadowRoot.getElementById("message");
    const normalizedMessage = firstNonEmptyString(message);

    messageEl.hidden = !normalizedMessage;
    messageEl.textContent = normalizedMessage || "";
  }

  static getStubConfig() {
    return {
      type: "custom:entity-heading-map-card",
      __preview: true,
      height: "286px",
      zoom: DEFAULT_ZOOM,
      show_zoom_controls: true,
      zoom_control_position: "topleft",
      marker_size: DEFAULT_MARKER_SIZE,
      color: DEFAULT_MARKER_COLOR,
      tap_action: { action: "more-info" },
      icon_tap_action: { action: "none" },
    };
  }

  static async getConfigElement() {
    return document.createElement("entity-heading-map-card-editor");
  }
}

class EntityHeadingMapCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = normalizeCardConfig();
    this._hass = null;
    this._deviceRegistry = [];
    this._entityRegistry = [];
    this._compatibleDevices = [];
    this._registryPromise = null;
    this._registryError = null;
    this._rendered = false;
  }

  setConfig(config) {
    this._config = normalizeCardConfig(config);
    this._render();
    this._refreshCompatibleDevices();
    this._applyConfigToForm();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
    this._setHassOnControls();

    if (!this._registryPromise) {
      this._loadRegistryData();
    } else {
      this._refreshCompatibleDevices();
    }
  }

  _render() {
    if (this._rendered) {
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .form {
          display: grid;
          gap: 16px;
          padding: 8px 0 0;
        }

        .row {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }

        ha-expansion-panel {
          --expansion-panel-content-padding: 0;
        }

        .panel-content {
          display: grid;
          gap: 16px;
          padding-top: 16px;
        }

        .helper {
          color: var(--secondary-text-color);
          font-size: 0.82rem;
          line-height: 1.4;
        }

        .row > *,
        ha-textfield,
        ha-select,
        ha-icon-picker,
        hui-action-editor {
          width: 100%;
        }

        .switch-field {
          display: flex;
          align-items: center;
          min-height: 56px;
          padding: 0 4px;
        }

        .color-row {
          display: grid;
          grid-template-columns: 56px minmax(0, 1fr);
          gap: 12px;
          align-items: start;
        }

        .color-picker {
          appearance: none;
          width: 56px;
          height: 56px;
          border: 1px solid var(--divider-color);
          border-radius: 12px;
          background: none;
          padding: 4px;
          cursor: pointer;
        }

        .color-picker::-webkit-color-swatch-wrapper {
          padding: 0;
        }

        .color-picker::-webkit-color-swatch {
          border: 0;
          border-radius: 8px;
        }

        .color-picker::-moz-color-swatch {
          border: 0;
          border-radius: 8px;
        }
      </style>
      <div class="form">
        <ha-select id="device" label="Device"></ha-select>
        <div id="device_helper" class="helper"></div>

        <ha-expansion-panel id="content_panel" header="Content" outlined expanded>
          <div class="panel-content">
            <ha-textfield id="title" label="Title"></ha-textfield>
            <ha-textfield id="subtitle" label="Subtitle"></ha-textfield>
            <ha-icon-picker id="icon" label="Icon"></ha-icon-picker>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel id="interactions_panel" header="Interactions" outlined>
          <div class="panel-content">
            <hui-action-editor id="tap_action"></hui-action-editor>
            <hui-action-editor id="icon_tap_action"></hui-action-editor>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel id="features_panel" header="Features" outlined>
          <div class="panel-content">
            <div class="row">
              <ha-textfield id="height" label="Height" placeholder="320px"></ha-textfield>
              <ha-selector id="zoom"></ha-selector>
            </div>
            <div class="row">
              <ha-selector id="marker_size"></ha-selector>
              <ha-select id="zoom_control_position" label="Zoom Button Position"></ha-select>
            </div>
            <div class="row">
              <div class="switch-field">
                <ha-formfield label="Show zoom controls">
                  <ha-switch id="show_zoom_controls"></ha-switch>
                </ha-formfield>
              </div>
              <div class="color-row">
                <input id="color_picker" class="color-picker" type="color" />
                <ha-textfield id="color" label="Marker Color"></ha-textfield>
              </div>
            </div>
          </div>
        </ha-expansion-panel>
      </div>
    `;

    this._rendered = true;
    this._refs = {
      device: this.shadowRoot.getElementById("device"),
      deviceHelper: this.shadowRoot.getElementById("device_helper"),
      title: this.shadowRoot.getElementById("title"),
      subtitle: this.shadowRoot.getElementById("subtitle"),
      icon: this.shadowRoot.getElementById("icon"),
      tapAction: this.shadowRoot.getElementById("tap_action"),
      iconTapAction: this.shadowRoot.getElementById("icon_tap_action"),
      height: this.shadowRoot.getElementById("height"),
      zoom: this.shadowRoot.getElementById("zoom"),
      markerSize: this.shadowRoot.getElementById("marker_size"),
      zoomControlPosition: this.shadowRoot.getElementById("zoom_control_position"),
      showZoomControls: this.shadowRoot.getElementById("show_zoom_controls"),
      color: this.shadowRoot.getElementById("color"),
      colorPicker: this.shadowRoot.getElementById("color_picker"),
    };

    this._refs.tapAction.label = "Tap behavior";
    this._refs.tapAction.defaultAction = "more-info";
    this._refs.iconTapAction.label = "Icon tap behavior";
    this._refs.iconTapAction.defaultAction = "none";
    this._refs.zoom.label = "Zoom";
    this._refs.zoom.selector = { number: { min: 1, max: 20, step: 1, mode: "box" } };
    this._refs.markerSize.label = "Marker Size";
    this._refs.markerSize.selector = { number: { min: 12, max: 96, step: 1, mode: "box" } };

    this._refs.device.addEventListener("selected", (event) => this._handleDeviceSelection(event.detail.value));

    for (const field of [this._refs.title, this._refs.subtitle, this._refs.height, this._refs.color]) {
      field.addEventListener("change", (event) => this._handleFieldChange(event));
    }

    this._refs.zoom.addEventListener("value-changed", (event) => this._updateConfigValue("zoom", asNumber(event.detail.value)));
    this._refs.markerSize.addEventListener("value-changed", (event) =>
      this._updateConfigValue("marker_size", asNumber(event.detail.value))
    );

    this._refs.icon.addEventListener("value-changed", (event) =>
      this._updateConfigValue("icon", firstNonEmptyString(event.detail.value))
    );

    this._refs.tapAction.addEventListener("value-changed", (event) =>
      this._updateConfigValue("tap_action", event.detail.value)
    );
    this._refs.iconTapAction.addEventListener("value-changed", (event) =>
      this._updateConfigValue("icon_tap_action", event.detail.value)
    );

    this._refs.zoomControlPosition.addEventListener("selected", (event) =>
      this._updateConfigValue(
        "zoom_control_position",
        normalizeSelectValue(event.detail.value, ZOOM_CONTROL_POSITIONS, "topleft")
      )
    );

    this._refs.showZoomControls.addEventListener("change", (event) =>
      this._updateConfigValue("show_zoom_controls", event.target.checked)
    );

    this._refs.colorPicker.addEventListener("change", (event) => {
      const value = normalizeHex(event.target.value);
      this._refs.color.value = value;
      this._updateConfigValue("color", value);
    });

    this._refs.zoomControlPosition.options = [
      { value: "topleft", label: "Top Left" },
      { value: "topright", label: "Top Right" },
      { value: "bottomleft", label: "Bottom Left" },
      { value: "bottomright", label: "Bottom Right" },
    ];

    this._applyDeviceOptions();
    this._applyConfigToForm();
    this._setHassOnControls();
  }

  _setHassOnControls() {
    if (!this._hass || !this._rendered) {
      return;
    }

    this._refs.tapAction.hass = this._hass;
    this._refs.iconTapAction.hass = this._hass;
    this._refs.zoom.hass = this._hass;
    this._refs.markerSize.hass = this._hass;
    this._updateActionEditorContext();
  }

  async _loadRegistryData() {
    if (!this._hass || this._registryPromise) {
      return this._registryPromise;
    }

    this._registryPromise = Promise.all([
      this._hass.callWS({ type: "config/device_registry/list" }),
      this._hass.callWS({ type: "config/entity_registry/list" }),
    ])
      .then(([devices, entities]) => {
        this._deviceRegistry = devices;
        this._entityRegistry = entities;
        this._registryError = null;
        this._refreshCompatibleDevices();
      })
      .catch((error) => {
        this._registryError = error;
        this._applyDeviceOptions();
      });

    return this._registryPromise;
  }

  _refreshCompatibleDevices() {
    if (!this._hass || !this._deviceRegistry.length || !this._entityRegistry.length) {
      this._applyDeviceOptions();
      return;
    }

    const compatibleDevices = buildCompatibleDevices(this._deviceRegistry, this._entityRegistry, this._hass);
    const currentSignature = JSON.stringify(
      compatibleDevices.map((device) => [
        device.deviceId,
        device.entityId,
        device.latitudeEntityId,
        device.longitudeEntityId,
        device.headingEntityId,
      ])
    );
    const previousSignature = JSON.stringify(
      this._compatibleDevices.map((device) => [
        device.deviceId,
        device.entityId,
        device.latitudeEntityId,
        device.longitudeEntityId,
        device.headingEntityId,
      ])
    );

    this._compatibleDevices = compatibleDevices;

    if (!this._config.device_id) {
      const inferred = this._findSelectedDeviceMatch();
      if (inferred) {
        this._config = { ...this._config, device_id: inferred.deviceId, name: inferred.label };
      }
    }

    if (currentSignature !== previousSignature || !this._rendered) {
      this._applyDeviceOptions();
    } else {
      this._updateDeviceHelper();
    }

    if (this._rendered) {
      this._applyConfigToForm();
    }
  }

  _findSelectedDeviceMatch() {
    if (!this._compatibleDevices.length) {
      return null;
    }

    if (this._config.device_id) {
      return this._compatibleDevices.find((device) => device.deviceId === this._config.device_id) || null;
    }

    const configuredEntityIds = [
      this._config.entity,
      this._config.latitude_entity,
      this._config.longitude_entity,
      this._config.heading_entity,
    ].filter(Boolean);

    return (
      this._compatibleDevices.find((device) =>
        configuredEntityIds.some((entityId) =>
          [device.entityId, device.latitudeEntityId, device.longitudeEntityId, device.headingEntityId].includes(entityId)
        )
      ) || null
    );
  }

  _applyDeviceOptions() {
    if (!this._rendered) {
      return;
    }

    const selectedMatch = this._findSelectedDeviceMatch();
    const selectedId = selectedMatch?.deviceId || this._config.device_id || "";
    const options = [{ value: "", label: this._registryError ? "Unable to load devices" : "Select a device" }];

    for (const device of this._compatibleDevices) {
      options.push({ value: device.deviceId, label: device.label });
    }

    if (selectedId && !options.some((option) => option.value === selectedId)) {
      options.push({
        value: selectedId,
        label: firstNonEmptyString(this._config.name, "Selected device"),
      });
    }

    this._refs.device.options = options;
    this._refs.device.value = selectedId;
    this._refs.device.disabled =
      Boolean(this._registryError) ||
      (!this._compatibleDevices.length && Boolean(this._deviceRegistry.length || this._entityRegistry.length));
    this._updateDeviceHelper();
  }

  _updateDeviceHelper() {
    if (!this._rendered) {
      return;
    }

    if (this._registryError) {
      this._refs.deviceHelper.textContent = "Unable to discover compatible Home Assistant devices.";
      return;
    }

    if (!this._deviceRegistry.length && !this._entityRegistry.length) {
      this._refs.deviceHelper.textContent = "Loading devices with latitude and longitude values…";
      return;
    }

    if (!this._compatibleDevices.length) {
      this._refs.deviceHelper.textContent =
        "No compatible devices found. Devices need latitude and longitude. Heading is optional.";
      return;
    }

    const selectedMatch = this._findSelectedDeviceMatch();
    if (!selectedMatch) {
      this._refs.deviceHelper.textContent =
        "Compatible devices are discovered automatically. Devices without heading render as blue dots.";
      return;
    }

    this._refs.deviceHelper.textContent = selectedMatch.supportsHeading
      ? "Heading available. This device will render with a directional arrow."
      : "Heading not found. This device will render as a blue dot.";
  }

  _applyConfigToForm() {
    if (!this._rendered) {
      return;
    }

    const selectedMatch = this._findSelectedDeviceMatch();
    const defaultTitle = selectedMatch?.label || firstNonEmptyString(this._config.name) || "";

    this._setControlValue(this._refs.device, selectedMatch?.deviceId || this._config.device_id || "");
    this._setControlValue(this._refs.title, this._config.title ?? defaultTitle);
    this._setControlValue(this._refs.subtitle, this._config.subtitle || "");
    this._setControlValue(this._refs.icon, this._config.icon || "");
    this._refs.tapAction.config = this._config.tap_action;
    this._refs.iconTapAction.config = this._config.icon_tap_action;
    this._setControlValue(this._refs.height, this._config.height || DEFAULT_CARD_HEIGHT);
    this._setControlValue(this._refs.zoom, this._config.zoom ?? DEFAULT_ZOOM);
    this._setControlValue(this._refs.markerSize, this._config.marker_size ?? DEFAULT_MARKER_SIZE);
    this._setControlValue(
      this._refs.zoomControlPosition,
      normalizeSelectValue(this._config.zoom_control_position, ZOOM_CONTROL_POSITIONS, "topleft")
    );
    if (!this._isControlFocused(this._refs.showZoomControls)) {
      this._refs.showZoomControls.checked = this._config.show_zoom_controls !== false;
    }
    this._refs.zoomControlPosition.disabled = this._config.show_zoom_controls === false;
    this._setControlValue(this._refs.color, normalizeHex(this._config.color));
    if (!this._isControlFocused(this._refs.colorPicker)) {
      this._refs.colorPicker.value = normalizeHex(this._config.color);
    }
    this._updateActionEditorContext();
  }

  _isControlFocused(control) {
    if (!control) {
      return false;
    }

    return this.shadowRoot.activeElement === control || control.matches?.(":focus-within");
  }

  _setControlValue(control, value) {
    if (!control || this._isControlFocused(control)) {
      return;
    }

    control.value = value;
  }

  _updateActionEditorContext() {
    if (!this._rendered) {
      return;
    }

    const entityId =
      this._config.entity ||
      this._config.heading_entity ||
      this._config.latitude_entity ||
      this._config.longitude_entity ||
      this._findSelectedDeviceMatch()?.entityId ||
      undefined;

    this._refs.tapAction.context = entityId ? { entity_id: entityId } : undefined;
    this._refs.iconTapAction.context = entityId ? { entity_id: entityId } : undefined;
  }

  _handleDeviceSelection(deviceId) {
    const config = { ...this._config };

    delete config.entities;
    delete config.subtitle_mode;
    delete config.subtitle_text;

    if (!deviceId) {
      delete config.device_id;
      delete config.entity;
      delete config.latitude_entity;
      delete config.longitude_entity;
      delete config.heading_entity;
      delete config.name;
      this._commitConfig(config);
      return;
    }

    const selectedMatch = this._compatibleDevices.find((device) => device.deviceId === deviceId);
    if (!selectedMatch) {
      return;
    }

    config.device_id = selectedMatch.deviceId;
    config.name = selectedMatch.label;
    if (selectedMatch.entityId) {
      config.entity = selectedMatch.entityId;
    } else {
      delete config.entity;
    }

    if (selectedMatch.latitudeEntityId) {
      config.latitude_entity = selectedMatch.latitudeEntityId;
    } else {
      delete config.latitude_entity;
    }

    if (selectedMatch.longitudeEntityId) {
      config.longitude_entity = selectedMatch.longitudeEntityId;
    } else {
      delete config.longitude_entity;
    }

    if (selectedMatch.headingEntityId) {
      config.heading_entity = selectedMatch.headingEntityId;
    } else {
      delete config.heading_entity;
    }

    this._commitConfig(config);
  }

  _handleFieldChange(event) {
    const field = event.target.id;
    const rawValue = event.target.value;

    if (field === "title") {
      const defaultTitle = this._findSelectedDeviceMatch()?.label || firstNonEmptyString(this._config.name) || "";
      const normalizedTitle = firstNonEmptyString(rawValue);
      this._updateConfigValue("title", normalizedTitle && normalizedTitle !== defaultTitle ? normalizedTitle : undefined);
      return;
    }

    if (field === "subtitle") {
      this._updateConfigValue("subtitle", firstNonEmptyString(rawValue));
      return;
    }

    if (field === "height") {
      this._updateConfigValue("height", firstNonEmptyString(rawValue) ? normalizeHeight(rawValue) : undefined);
      return;
    }

    if (field === "color") {
      const normalizedColor = normalizeHex(rawValue);
      this._refs.colorPicker.value = normalizedColor;
      this._updateConfigValue("color", normalizedColor);
    }
  }

  _updateConfigValue(field, value) {
    const config = { ...this._config };

    if (value === undefined || value === null || value === "") {
      delete config[field];
    } else {
      config[field] = value;
    }

    this._commitConfig(config);
  }

  _commitConfig(config) {
    delete config.__preview;
    delete config.subtitle_mode;
    delete config.subtitle_text;

    for (const [key, value] of Object.entries(config)) {
      if (value === undefined) {
        delete config[key];
      }
    }

    this._config = normalizeCardConfig(config);
    this._applyConfigToForm();
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }
}

if (!customElements.get("entity-heading-map-card")) {
  customElements.define("entity-heading-map-card", EntityHeadingMapCard);
}

if (!customElements.get("entity-heading-map-card-editor")) {
  customElements.define("entity-heading-map-card-editor", EntityHeadingMapCardEditor);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "entity-heading-map-card",
  name: "Entity Heading Map Card",
  preview: true,
  description: "Shows one or more entities on a map with a directional heading arrow.",
});
