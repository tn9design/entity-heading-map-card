const LEAFLET_JS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
const LEAFLET_CSS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
let leafletPromise;

const DEFAULT_TILE_URL = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const DEFAULT_DARK_TILE_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const DEFAULT_VOYAGER_TILE_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const DEFAULT_LIGHT_NOLABELS_TILE_URL = "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";
const DEFAULT_DARK_NOLABELS_TILE_URL = "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png";
const DEFAULT_VOYAGER_NOLABELS_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png";
const DEFAULT_TILE_ATTRIBUTION = "&copy; OpenStreetMap contributors &copy; CARTO";
const DEFAULT_MARKER_COLOR = "#3388ff";
const DEFAULT_CARD_HEIGHT = "320px";
const DEFAULT_MARKER_SIZE = 32;
const DEFAULT_ZOOM = 19;
const SPEED_ZOOM_STEP_MPH = 20;
const DEFAULT_TAP_ACTION = Object.freeze({ action: "more-info" });
const DEFAULT_ICON_TAP_ACTION = Object.freeze({ action: "none" });
const ZOOM_CONTROL_POSITIONS = new Set(["topleft", "bottomleft", "bottomright", "hidden"]);
const STYLE_PRESETS = new Set(["default", "mushroom"]);
const TILE_STYLE_PRESETS = new Set(["default", "dark", "voyager"]);
const TILE_STYLE_EDITOR_OPTIONS = new Set(["default", "dark", "voyager", "custom"]);
const SUBTITLE_MODES = new Set([
  "none",
  "custom_text",
  "smart",
  "coordinates",
  "address",
  "status",
  "speed",
  "speed_or_parked",
  "heading",
  "last_updated",
  "custom_entity",
]);
const DEVICE_FIELD_PATTERNS = {
  latitude: /(^|[\s_.-])(latitude|lat)($|[\s_.-])/i,
  longitude: /(^|[\s_.-])(longitude|lon|lng|long)($|[\s_.-])/i,
  heading: /(^|[\s_.-])(heading|bearing|course|direction)($|[\s_.-])/i,
  speed: /(^|[\s_.-])(speed|velocity|ground[\s_.-]?speed)($|[\s_.-])/i,
};
const ADDRESS_ATTRIBUTE_KEYS = [
  "address",
  "formatted_address",
  "location_name",
  "display_name",
  "street_address",
  "full_address",
];
const EMPTY_STATES = new Set(["", "unknown", "unavailable", "none", "null"]);
const MOVING_STATES = new Set(["drive", "driving", "moving", "in_transit", "reverse", "r"]);
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
    z-index: 4;
    pointer-events: auto;
  }

  .leaflet-top,
  .leaflet-bottom {
    position: absolute;
    z-index: 5;
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

const parsePixelHeight = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const pxMatch = trimmed.match(/^(\d+(?:\.\d+)?)px$/i);
  if (pxMatch) {
    return Number(pxMatch[1]);
  }

  if (/^\d+(?:\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }

  return null;
};

const inferTileStyleFromUrl = (tileUrl) => {
  const normalizedUrl = firstNonEmptyString(tileUrl) || "";

  if ([DEFAULT_VOYAGER_TILE_URL, DEFAULT_VOYAGER_NOLABELS_TILE_URL].includes(normalizedUrl)) {
    return "voyager";
  }

  if ([DEFAULT_DARK_TILE_URL, DEFAULT_DARK_NOLABELS_TILE_URL].includes(normalizedUrl)) {
    return "dark";
  }

  if ([DEFAULT_TILE_URL, DEFAULT_LIGHT_NOLABELS_TILE_URL].includes(normalizedUrl)) {
    return "default";
  }

  return null;
};

const inferShowMapLabelsFromUrl = (tileUrl) => {
  const normalizedUrl = firstNonEmptyString(tileUrl) || "";

  if (
    [DEFAULT_LIGHT_NOLABELS_TILE_URL, DEFAULT_DARK_NOLABELS_TILE_URL, DEFAULT_VOYAGER_NOLABELS_TILE_URL].includes(
      normalizedUrl
    )
  ) {
    return false;
  }

  if ([DEFAULT_TILE_URL, DEFAULT_DARK_TILE_URL, DEFAULT_VOYAGER_TILE_URL].includes(normalizedUrl)) {
    return true;
  }

  return null;
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

const formatCoordinates = (latitude, longitude) => `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

const parseTimestamp = (value) => {
  if (!value) {
    return null;
  }

  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatUpdatedLabel = (timestamp) => {
  if (!timestamp) {
    return null;
  }

  const deltaSeconds = Math.round((timestamp - Date.now()) / 1000);
  const absoluteDelta = Math.abs(deltaSeconds);
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

  if (absoluteDelta < 60) {
    return `Updated ${formatter.format(deltaSeconds, "second")}`;
  }

  if (absoluteDelta < 3600) {
    return `Updated ${formatter.format(Math.round(deltaSeconds / 60), "minute")}`;
  }

  if (absoluteDelta < 86400) {
    return `Updated ${formatter.format(Math.round(deltaSeconds / 3600), "hour")}`;
  }

  return `Updated ${formatter.format(Math.round(deltaSeconds / 86400), "day")}`;
};

const formatNumericValue = (value, decimals = 1) => {
  if (!Number.isFinite(value)) {
    return null;
  }

  return value
    .toFixed(decimals)
    .replace(/\.0+$/, "")
    .replace(/(\.\d*?)0+$/, "$1");
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

const hasSpeedAttributes = (state) =>
  asNumber(state?.attributes?.speed) !== null ||
  asNumber(state?.attributes?.speed_mph) !== null ||
  asNumber(state?.attributes?.speed_kmh) !== null ||
  asNumber(state?.attributes?.speed_ms) !== null ||
  asNumber(state?.attributes?.ground_speed) !== null ||
  asNumber(state?.attributes?.velocity) !== null;

const isSpeedLikeUnit = (value) => {
  const normalized = firstNonEmptyString(value)?.toLowerCase();
  if (!normalized) {
    return false;
  }

  return ["mph", "km/h", "kmh", "kph", "m/s", "kn", "knot", "knots", "ft/s"].includes(normalized);
};

const pickSpeedEntity = (entities, hass) => {
  const pattern = DEVICE_FIELD_PATTERNS.speed;
  const ranked = entities
    .filter((entry) => !entry.disabled_by)
    .map((entry) => {
      const state = hass?.states?.[entry.entity_id];
      const attrs = state?.attributes || {};
      const text = getEntitySearchText(entry);
      const matchesPattern = pattern.test(text);
      const hasSpeedData = hasSpeedAttributes(state);
      const hasSpeedUnit = isSpeedLikeUnit(attrs.unit_of_measurement) || isSpeedLikeUnit(attrs.unit);
      const numericState = asNumber(state?.state) !== null;

      if (!matchesPattern && !hasSpeedData && !(hasSpeedUnit && numericState)) {
        return null;
      }

      let score = 100;
      if (matchesPattern) {
        score += 50;
      }
      if (hasSpeedData) {
        score += 40;
      }
      if (hasSpeedUnit) {
        score += 30;
      }
      if (numericState) {
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
  const speedEntity = pickSpeedEntity(deviceEntities, hass);

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
    speedEntityId: speedEntity?.entity_id || null,
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

const normalizeCardConfig = (config = {}) => {
  const tileUrl = firstNonEmptyString(config.tile_url) || "";
  const inferredTileStyle = inferTileStyleFromUrl(tileUrl);
  const inferredShowMapLabels = inferShowMapLabelsFromUrl(tileUrl);

  return {
    ...config,
    zoom: asNumber(config.zoom) ?? DEFAULT_ZOOM,
    fit_bounds: config.fit_bounds !== false,
    height: normalizeHeight(config.height),
    color: normalizeHex(config.color),
    marker_size: asNumber(config.marker_size) ?? DEFAULT_MARKER_SIZE,
    tile_url: tileUrl,
    tile_attribution: config.tile_attribution || DEFAULT_TILE_ATTRIBUTION,
    tile_subdomains: config.tile_subdomains || "abcd",
    show_attribution: config.show_attribution === true,
    show_map_labels:
      typeof inferredShowMapLabels === "boolean" && config.show_map_labels === undefined
        ? inferredShowMapLabels
        : config.show_map_labels !== false,
    show_zoom_controls: config.zoom_control_position === "hidden" ? false : config.show_zoom_controls !== false,
    show_speedometer: config.show_speedometer === true,
    auto_zoom_by_speed: config.auto_zoom_by_speed === true,
    show_header: config.show_header !== false,
    zoom_control_position:
      config.show_zoom_controls === false
        ? "hidden"
        : normalizeSelectValue(config.zoom_control_position, ZOOM_CONTROL_POSITIONS, "topleft"),
    subtitle: firstNonEmptyString(config.subtitle, config.subtitle_text) || "",
    subtitle_mode: normalizeSelectValue(
      config.subtitle_mode,
      SUBTITLE_MODES,
      firstNonEmptyString(config.subtitle, config.subtitle_text) ? "custom_text" : "none"
    ),
    speed_entity: firstNonEmptyString(config.speed_entity) || "",
    subtitle_entity: firstNonEmptyString(config.subtitle_entity) || "",
    subtitle_label: firstNonEmptyString(config.subtitle_label) || "",
    subtitle_suffix: firstNonEmptyString(config.subtitle_suffix) || "",
    subtitle_fallback: firstNonEmptyString(config.subtitle_fallback) || "",
    icon: firstNonEmptyString(config.icon) || "",
    style_preset: normalizeSelectValue(config.style_preset, STYLE_PRESETS, "mushroom"),
    tile_style: normalizeSelectValue(
      config.tile_style,
      TILE_STYLE_EDITOR_OPTIONS,
      tileUrl && !isBuiltInTileUrl(tileUrl) ? "custom" : inferredTileStyle || "default"
    ),
  };
};

const isBuiltInTileUrl = (value) =>
  [
    DEFAULT_TILE_URL,
    DEFAULT_DARK_TILE_URL,
    DEFAULT_VOYAGER_TILE_URL,
    DEFAULT_LIGHT_NOLABELS_TILE_URL,
    DEFAULT_DARK_NOLABELS_TILE_URL,
    DEFAULT_VOYAGER_NOLABELS_TILE_URL,
  ].includes(firstNonEmptyString(value) || "");
const normalizeTileSubdomains = (value) =>
  Array.isArray(value) ? value.join("") : firstNonEmptyString(value, "") || "";
const getResolvedBuiltInTileUrl = (tileStyle, darkMode, showMapLabels) => {
  const normalizedStyle = normalizeSelectValue(tileStyle, TILE_STYLE_PRESETS, "default");
  const labelsEnabled = showMapLabels !== false;

  if (normalizedStyle === "dark") {
    return labelsEnabled ? DEFAULT_DARK_TILE_URL : DEFAULT_DARK_NOLABELS_TILE_URL;
  }

  if (normalizedStyle === "voyager") {
    return labelsEnabled ? DEFAULT_VOYAGER_TILE_URL : DEFAULT_VOYAGER_NOLABELS_TILE_URL;
  }

  if (darkMode) {
    return labelsEnabled ? DEFAULT_DARK_TILE_URL : DEFAULT_DARK_NOLABELS_TILE_URL;
  }

  return labelsEnabled ? DEFAULT_TILE_URL : DEFAULT_LIGHT_NOLABELS_TILE_URL;
};

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
          position: relative;
          z-index: 0;
          contain: paint;
        }

        ha-card {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          z-index: 0;
          border-radius: 24px;
          background: var(--ha-card-background, var(--card-background-color));
          box-shadow: none;
          border: 1px solid color-mix(in srgb, var(--divider-color, rgba(0, 0, 0, 0.12)) 80%, transparent);
          background-clip: padding-box;
        }

        ha-card.preset-default {
          border-radius: var(--ha-card-border-radius, 12px);
          border: 1px solid color-mix(in srgb, var(--divider-color, rgba(0, 0, 0, 0.12)) 80%, transparent);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          background-clip: border-box;
        }

        .wrapper {
          display: flex;
          flex-direction: column;
        }

        .header {
          display: flex;
          gap: 14px;
          align-items: center;
          padding: 16px 16px 12px;
        }

        .preset-default .header {
          gap: 12px;
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
          width: 44px;
          height: 44px;
          padding: 0;
          border: 0;
          border-radius: 14px;
          background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
          color: var(--primary-text-color);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        }

        .preset-default .icon-button {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: transparent;
          box-shadow: none;
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
          --mdc-icon-size: 24px;
          color: inherit;
        }

        .preset-default .header-icon {
          --mdc-icon-size: 22px;
        }

        .title {
          font-family: var(--ha-card-header-font-family, inherit);
          font-size: 1rem;
          font-weight: var(--ha-card-header-font-weight, 500);
          color: var(--primary-text-color);
          line-height: var(--ha-card-header-line-height, 1.3);
        }

        .subtitle {
          margin-top: 3px;
          color: var(--secondary-text-color);
          font-size: 0.83rem;
          line-height: 1.3;
        }

        .preset-default .subtitle {
          margin-top: 4px;
          font-size: 0.88rem;
          line-height: 1.35;
        }

        .map-shell {
          position: relative;
          isolation: isolate;
          z-index: 0;
          margin: 0 10px 10px;
          border-radius: 18px;
          overflow: hidden;
          background: var(--ha-card-background, var(--card-background-color, #fff));
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 8%, transparent);
        }

        .preset-default .map-shell {
          margin: 0;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
        }

        .map-shell.preview-mode {
          overflow: hidden;
          border-radius: inherit;
        }

        #card.header-hidden .map-shell {
          margin-top: 10px;
        }

        #card.header-hidden.preset-default .map-shell {
          margin-top: 0;
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
          z-index: 1;
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
          z-index: 2;
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
          z-index: 3;
        }

        .map-message[hidden] {
          display: none;
        }

        .speedometer {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 3;
          width: 56px;
          height: 56px;
          max-width: calc(100% - 24px);
          padding: 0;
          border-radius: 999px;
          background: var(--card-background-color, #ffffff);
          color: var(--primary-text-color, #111111);
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.35);
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1px;
          pointer-events: none;
        }

        .speedometer[hidden] {
          display: none;
        }

        .speedometer-value {
          font-size: 1.58rem;
          font-weight: 700;
          line-height: 0.95;
          letter-spacing: 0.01em;
          color: inherit;
        }

        .speedometer-unit {
          font-size: 0.42rem;
          font-weight: 600;
          line-height: 1;
          color: var(--secondary-text-color, rgba(17, 17, 17, 0.62));
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .speedometer-unit:empty {
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
          <div id="map-shell" class="map-shell">
            <div id="map"></div>
            <div id="preview-overlay" class="preview-overlay" hidden>
              <div class="preview-controls" aria-hidden="true">
                <div class="preview-control">+</div>
                <div class="preview-control">−</div>
              </div>
              <div id="preview-marker" class="preview-marker" aria-hidden="true"></div>
            </div>
            <div id="speedometer" class="speedometer" hidden aria-live="polite">
              <span id="speedometer-value" class="speedometer-value"></span>
              <span id="speedometer-unit" class="speedometer-unit"></span>
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
      previousConfig.speed_entity !== this._config.speed_entity ||
      previousConfig.zoom !== this._config.zoom ||
      previousConfig.fit_bounds !== this._config.fit_bounds ||
      previousConfig.auto_zoom_by_speed !== this._config.auto_zoom_by_speed
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
    const cardEl = this.shadowRoot.getElementById("card");
    const mapEl = this.shadowRoot.getElementById("map");
    const stylePreset = normalizeSelectValue(this._config?.style_preset, STYLE_PRESETS, "mushroom");

    cardEl.classList.toggle("preset-default", stylePreset === "default");
    cardEl.classList.toggle("preset-mushroom", stylePreset === "mushroom");
    mapEl.style.height = normalizeHeight(this._config.height);
    this._applyActionState();

    if (this._isPreviewMode()) {
      this._renderPreviewState();
      return;
    }

    this._clearPreviewState();
    this._syncTileLayer();
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

  _isEditorPreviewCard() {
    const selectors = [
      "hui-dialog-edit-card",
      "hui-dialog-edit-card-element",
      "hui-dialog-edit-card-editor",
      "hui-card-preview",
      "ha-dialog[open]",
      "dialog[open]",
      "mwc-dialog[open]",
      ".mdc-dialog--open",
    ];
    let node = this;

    while (node) {
      if (node instanceof Element && selectors.some((selector) => node.matches(selector))) {
        return true;
      }

      if (node.parentElement) {
        node = node.parentElement;
        continue;
      }

      const root = node.getRootNode?.();
      node = root?.host || null;
    }

    return false;
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
    if (this._config?.show_zoom_controls === false) {
      return "hidden";
    }

    return normalizeSelectValue(this._config?.zoom_control_position, ZOOM_CONTROL_POSITIONS, "topleft");
  }

  _syncZoomControl() {
    if (!this._map || !this._leafletReady) {
      return;
    }

    const zoomControlPosition = this._getZoomControlPosition();
    const showZoomControls = zoomControlPosition !== "hidden";

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

    this._syncTileLayer();

    requestAnimationFrame(() => {
      this._map?.invalidateSize(true);
      this._hasSizedMap = true;
    });

    this._syncZoomControl();
    this._map.on("zoom viewreset move resize", () => this._redrawMarkers());
  }

  _getResolvedTileUrl() {
    const configuredUrl = firstNonEmptyString(this._config?.tile_url);
    const tileStyle = normalizeSelectValue(this._config?.tile_style, TILE_STYLE_EDITOR_OPTIONS, "default");

    if (tileStyle === "custom" && configuredUrl) {
      return configuredUrl;
    }

    if (configuredUrl === DEFAULT_VOYAGER_TILE_URL) {
      return DEFAULT_VOYAGER_TILE_URL;
    }

    return getResolvedBuiltInTileUrl(
      this._config?.tile_style,
      this._hass?.themes?.darkMode === true,
      this._config?.show_map_labels
    );
  }

  _syncTileLayer() {
    if (!this._map || !this._leafletReady) {
      return;
    }

    const resolvedUrl = this._getResolvedTileUrl();
    const attribution = this._config.tile_attribution;
    const subdomains = this._config.tile_subdomains;
    const maxZoom = 20;
    const currentSubdomains = this._tileLayer ? normalizeTileSubdomains(this._tileLayer.options.subdomains) : "";
    const expectedSubdomains = normalizeTileSubdomains(subdomains);

    const shouldRecreate =
      !this._tileLayer ||
      this._tileLayer.options.attribution !== attribution ||
      currentSubdomains !== expectedSubdomains ||
      this._tileLayer.options.maxZoom !== maxZoom;

    if (shouldRecreate) {
      this._tileLayer?.remove();
      this._tileLayer = window.L.tileLayer(resolvedUrl, {
        attribution,
        maxZoom,
        subdomains,
      }).addTo(this._map);
      return;
    }

    if (this._tileLayer._url !== resolvedUrl) {
      this._tileLayer.setUrl(resolvedUrl, false);
    }
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
      entityState,
      latitudeState,
      longitudeState,
      headingState,
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
    if (!this._map || !this._map._loaded) {
      return;
    }

    for (const key of this._markers.keys()) {
      this._positionMarker(key);
    }
  }

  _positionMarker(key) {
    const point = this._markerPoints.get(key);
    const marker = this._markers.get(key);
    if (!point || !marker || !this._map || !this._map._loaded) {
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

  _getAddress(point) {
    const states = [point?.entityState, point?.latitudeState, point?.longitudeState, point?.headingState];

    for (const state of states) {
      const attrs = state?.attributes || {};

      for (const key of ADDRESS_ATTRIBUTE_KEYS) {
        const candidate = firstNonEmptyString(attrs[key]);
        if (candidate) {
          return candidate;
        }
      }

      const streetLine = firstNonEmptyString(
        [attrs.street_number, attrs.street].filter(Boolean).join(" "),
        [attrs.house_number, attrs.road].filter(Boolean).join(" "),
        attrs.road
      );
      const localityLine = firstNonEmptyString(
        [attrs.city, attrs.state].filter(Boolean).join(", "),
        [attrs.suburb, attrs.city].filter(Boolean).join(", "),
        attrs.city
      );
      const combined = firstNonEmptyString([streetLine, localityLine].filter(Boolean).join(", "));

      if (combined) {
        return combined;
      }
    }

    return null;
  }

  _getUpdatedTimestamp(point) {
    const timestamps = [point?.entityState, point?.latitudeState, point?.longitudeState, point?.headingState]
      .flatMap((state) => [parseTimestamp(state?.last_updated), parseTimestamp(state?.last_changed)])
      .filter((timestamp) => timestamp !== null);

    return timestamps.length > 0 ? Math.max(...timestamps) : null;
  }

  _getStatusLabel(point) {
    const rawState = firstNonEmptyString(point?.entityState?.state);
    if (!rawState || EMPTY_STATES.has(rawState.toLowerCase()) || asNumber(rawState) !== null) {
      return null;
    }

    return rawState;
  }

  _readSpeedState(state, { allowNumericStateFallback = false, suffixOverride = "" } = {}) {
    if (!state) {
      return null;
    }

    const speed =
      asNumber(state?.attributes?.speed) ??
      asNumber(state?.attributes?.speed_mph) ??
      asNumber(state?.attributes?.speed_kmh) ??
      asNumber(state?.attributes?.speed_ms) ??
      asNumber(state?.attributes?.ground_speed) ??
      asNumber(state?.attributes?.velocity) ??
      (allowNumericStateFallback ? asNumber(state?.state) : null);

    if (speed === null) {
      return null;
    }

    const unit =
      firstNonEmptyString(
        suffixOverride,
        state?.attributes?.unit_of_measurement,
        state?.attributes?.unit,
        state?.attributes?.speed_unit,
        state?.attributes?.velocity_unit
      ) || "";

    return { speed, unit };
  }

  _getConfiguredSpeedData() {
    return this._readSpeedState(this._getEntityState(this._config?.speed_entity), {
      allowNumericStateFallback: true,
    });
  }

  _getSpeedData(point) {
    const customState = this._getEntityState(this._config?.subtitle_entity);
    const customSpeed = this._readSpeedState(customState, {
      allowNumericStateFallback: true,
      suffixOverride: this._config?.subtitle_suffix,
    });
    if (customSpeed) {
      return customSpeed;
    }

    const candidateStates = [point?.entityState, point?.latitudeState, point?.longitudeState, point?.headingState].filter(Boolean);

    for (const state of candidateStates) {
      const speedData = this._readSpeedState(state, {
        allowNumericStateFallback: false,
        suffixOverride: this._config?.subtitle_suffix,
      });
      if (speedData) {
        return speedData;
      }
    }

    return null;
  }

  _isMoving(point) {
    const status = firstNonEmptyString(point?.entityState?.state)?.toLowerCase();
    if (status && MOVING_STATES.has(status)) {
      return true;
    }

    const speed = this._getSpeedData(point)?.speed;
    return Number.isFinite(speed) && Math.abs(speed) > 0;
  }

  _formatSpeed(point) {
    const speedData = this._getSpeedData(point);
    if (!speedData) {
      return null;
    }

    const formatted = formatNumericValue(speedData.speed, Math.abs(speedData.speed) >= 100 ? 0 : 1);
    if (!formatted) {
      return null;
    }

    return speedData.unit ? `${formatted} ${speedData.unit}` : formatted;
  }

  _isConfiguredMoving() {
    const speed = this._getConfiguredSpeedData()?.speed;
    return Number.isFinite(speed) && Math.abs(speed) > 0;
  }

  _formatConfiguredSpeed() {
    const speedData = this._getConfiguredSpeedData();
    if (!speedData) {
      return null;
    }

    const value = formatNumericValue(speedData.speed, Math.abs(speedData.speed) >= 100 ? 0 : 1);
    if (!value) {
      return null;
    }

    return {
      value,
      unit: speedData.unit || "",
      speed: speedData.speed,
    };
  }

  _getPreviewSpeedData() {
    return {
      value: "45",
      unit: "",
      speed: 45,
    };
  }

  _getEffectiveZoom(points) {
    const baseZoom = asNumber(this._config?.zoom) ?? DEFAULT_ZOOM;

    if (!this._config?.auto_zoom_by_speed || !this._config?.speed_entity || points.length !== 1) {
      return baseZoom;
    }

    const speed = this._getConfiguredSpeedData()?.speed;
    if (!Number.isFinite(speed)) {
      return baseZoom;
    }

    const zoomOffset = Math.max(0, Math.floor(Math.abs(speed) / SPEED_ZOOM_STEP_MPH));
    return Math.max(1, Math.min(20, baseZoom - zoomOffset));
  }

  _updateSpeedometer(points) {
    const speedometerEl = this.shadowRoot.getElementById("speedometer");
    const valueEl = this.shadowRoot.getElementById("speedometer-value");
    const unitEl = this.shadowRoot.getElementById("speedometer-unit");
    const showEditorPreview = this._isEditorPreviewCard() && this._config?.show_speedometer === true && points.length === 1;

    if (!speedometerEl || !valueEl || !unitEl) {
      return;
    }

    if ((!this._config?.show_speedometer && !showEditorPreview) || points.length !== 1) {
      speedometerEl.hidden = true;
      valueEl.textContent = "";
      unitEl.textContent = "";
      return;
    }

    const speedData = showEditorPreview ? this._getPreviewSpeedData() : this._formatConfiguredSpeed();
    if (!showEditorPreview && (!this._config?.speed_entity || !speedData || !this._isConfiguredMoving())) {
      speedometerEl.hidden = true;
      valueEl.textContent = "";
      unitEl.textContent = "";
      return;
    }

    speedometerEl.hidden = false;
    valueEl.textContent = speedData.value;
    unitEl.textContent = "";
  }

  _formatCustomEntitySubtitle() {
    const state = this._getEntityState(this._config?.subtitle_entity);
    const rawState = firstNonEmptyString(state?.state);
    if (!rawState || EMPTY_STATES.has(rawState.toLowerCase())) {
      return firstNonEmptyString(this._config?.subtitle_fallback);
    }

    const suffix =
      firstNonEmptyString(this._config?.subtitle_suffix, state?.attributes?.unit_of_measurement, state?.attributes?.unit) ||
      "";
    const label = firstNonEmptyString(this._config?.subtitle_label);
    const value = suffix ? `${rawState} ${suffix}` : rawState;
    return label ? `${label}: ${value}` : value;
  }

  _getSubtitle(points) {
    const mode = normalizeSelectValue(this._config?.subtitle_mode, SUBTITLE_MODES, "none");

    if (mode === "none") {
      return null;
    }

    if (mode === "custom_text") {
      return firstNonEmptyString(this._config?.subtitle);
    }

    if (mode === "custom_entity") {
      return this._formatCustomEntitySubtitle();
    }

    if (points.length !== 1) {
      return null;
    }

    const [point] = points;

    switch (mode) {
      case "coordinates":
        return formatCoordinates(point.latitude, point.longitude);
      case "address":
        return this._getAddress(point) || formatCoordinates(point.latitude, point.longitude);
      case "status":
        return this._getStatusLabel(point);
      case "speed":
        return this._formatSpeed(point) || firstNonEmptyString(this._config?.subtitle_fallback);
      case "speed_or_parked":
        return this._isMoving(point)
          ? this._formatSpeed(point) || this._getStatusLabel(point) || firstNonEmptyString(this._config?.subtitle_fallback, "Parked")
          : firstNonEmptyString(this._config?.subtitle_fallback, "Parked");
      case "heading":
        return point.heading !== null ? `Heading ${Math.round(point.heading)}°` : firstNonEmptyString(this._config?.subtitle_fallback);
      case "last_updated":
        return formatUpdatedLabel(this._getUpdatedTimestamp(point)) || firstNonEmptyString(this._config?.subtitle_fallback);
      case "smart":
        return (
          (this._isMoving(point) ? this._formatSpeed(point) : null) ||
          this._getStatusLabel(point) ||
          this._getAddress(point) ||
          formatCoordinates(point.latitude, point.longitude)
        );
      default:
        return null;
    }
  }

  _updateHeader(points) {
    const cardEl = this.shadowRoot.getElementById("card");
    const headerEl = this.shadowRoot.getElementById("header");
    const titleEl = this.shadowRoot.getElementById("title");
    const subtitleEl = this.shadowRoot.getElementById("subtitle");
    const iconButton = this.shadowRoot.getElementById("icon-button");
    const iconEl = this.shadowRoot.getElementById("icon");
    const title = this._getTitle(points);
    const subtitle = this._getSubtitle(points);
    const icon = firstNonEmptyString(this._config?.icon);
    const hasHeader = this._config?.show_header !== false && Boolean(icon || title || subtitle);
    const hasSubtitle = Boolean(subtitle);

    headerEl.hidden = !hasHeader;
    cardEl?.classList.toggle("header-hidden", !hasHeader);
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
      const effectiveZoom = this._getEffectiveZoom(points);
      const shouldEnforceZoom =
        this._config?.auto_zoom_by_speed === true &&
        Boolean(this._config?.speed_entity) &&
        this._isConfiguredMoving();
      const signature = shouldEnforceZoom
        ? `single:${point.latitude.toFixed(5)}:${point.longitude.toFixed(5)}:${effectiveZoom}`
        : `single:${point.latitude.toFixed(5)}:${point.longitude.toFixed(5)}`;
      if (!this._viewInitialized || !this._map._loaded) {
        this._map.setView([point.latitude, point.longitude], effectiveZoom);
        this._viewInitialized = true;
        this._lastViewSignature = signature;
        return;
      }

      let currentCenter;
      let currentZoom;
      try {
        currentCenter = this._map.getCenter();
        currentZoom = this._map.getZoom();
      } catch (_error) {
        this._map.setView([point.latitude, point.longitude], effectiveZoom);
        this._viewInitialized = true;
        this._lastViewSignature = signature;
        return;
      }

      const isOffCenter =
        !currentCenter ||
        Math.abs(currentCenter.lat - point.latitude) > 0.000001 ||
        Math.abs(currentCenter.lng - point.longitude) > 0.000001;

      if (this._lastViewSignature !== signature || isOffCenter || (shouldEnforceZoom && currentZoom !== effectiveZoom)) {
        const zoomToApply = shouldEnforceZoom ? effectiveZoom : currentZoom;
        this._map.setView([point.latitude, point.longitude], zoomToApply, { animate: false });
        this._lastViewSignature = signature;
      }

      return;
    }

    const bounds = window.L.latLngBounds(points.map((point) => [point.latitude, point.longitude]));
    const signature = `multi:${points
      .map((point) => `${point.latitude.toFixed(5)}:${point.longitude.toFixed(5)}`)
      .sort()
      .join("|")}`;

    if (!this._viewInitialized || !this._map._loaded || this._lastViewSignature !== signature) {
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
    this._syncTileLayer();
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
    this._updateSpeedometer(points);

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
      show_header: true,
      height: "286px",
      zoom: DEFAULT_ZOOM,
      show_zoom_controls: true,
      show_speedometer: false,
      auto_zoom_by_speed: false,
      zoom_control_position: "topleft",
      marker_size: DEFAULT_MARKER_SIZE,
      color: DEFAULT_MARKER_COLOR,
      style_preset: "mushroom",
      tile_style: "default",
      show_map_labels: true,
      subtitle_mode: "none",
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
          gap: 18px;
          padding: 10px 0 0;
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
          gap: 14px;
          padding: 16px 12px 12px;
        }

        .helper {
          color: var(--secondary-text-color);
          font-size: 0.82rem;
          line-height: 1.4;
          padding: 0 4px;
        }

        .row > *,
        ha-textfield,
        ha-select,
        ha-icon-picker,
        ha-selector,
        hui-action-editor {
          display: block;
          width: 100%;
        }

        .toggle-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          min-height: 68px;
          padding: 14px 16px;
          box-sizing: border-box;
          border-radius: 16px;
          background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 6%, transparent);
        }

        .toggle-copy {
          display: grid;
          gap: 4px;
          min-width: 0;
          flex: 1;
        }

        .toggle-label {
          color: var(--primary-text-color);
          font-size: 0.95rem;
          font-weight: 500;
          line-height: 1.25;
        }

        .toggle-description {
          color: var(--secondary-text-color);
          font-size: 0.8rem;
          line-height: 1.35;
        }

        .toggle-card ha-switch {
          flex: 0 0 auto;
        }

        .editor-toggle {
          margin: 0 2px;
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
        <div class="toggle-card editor-toggle">
          <div class="toggle-copy">
            <div class="toggle-label">Show header</div>
            <div class="toggle-description">Display the icon, title, and subtitle above the map.</div>
          </div>
          <ha-switch id="show_header"></ha-switch>
        </div>

        <ha-expansion-panel id="content_panel" header="Content" outlined expanded>
          <div class="panel-content">
            <div class="row">
              <ha-icon-picker id="icon" label="Icon"></ha-icon-picker>
              <ha-textfield id="title" label="Title"></ha-textfield>
            </div>
            <ha-select id="subtitle_mode" label="Subtitle Mode"></ha-select>
            <ha-textfield id="subtitle" label="Subtitle Text"></ha-textfield>
            <ha-selector id="subtitle_entity"></ha-selector>
            <ha-textfield id="subtitle_label" label="Subtitle Label"></ha-textfield>
            <ha-textfield
              id="subtitle_suffix"
              label="Subtitle Suffix"
              placeholder="e.g. mph, knots, ft"
            ></ha-textfield>
            <ha-textfield
              id="subtitle_fallback"
              label="Subtitle Fallback"
              placeholder="e.g. Parked or Unavailable"
            ></ha-textfield>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel id="interactions_panel" header="Interactions" outlined>
          <div class="panel-content">
            <div class="row">
              <hui-action-editor id="tap_action"></hui-action-editor>
              <hui-action-editor id="icon_tap_action"></hui-action-editor>
            </div>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel id="features_panel" header="Features" outlined>
          <div class="panel-content">
            <ha-selector id="speed_entity"></ha-selector>
            <div class="toggle-card">
              <div class="toggle-copy">
                <div class="toggle-label">Show speedometer</div>
                <div class="toggle-description">Show a speed badge when the selected speed entity is moving.</div>
              </div>
              <ha-switch id="show_speedometer"></ha-switch>
            </div>
            <div class="toggle-card">
              <div class="toggle-copy">
                <div class="toggle-label">Auto zoom by speed</div>
                <div class="toggle-description">Adjust zoom automatically in 20 mph bands using the speed entity.</div>
              </div>
              <ha-switch id="auto_zoom_by_speed"></ha-switch>
            </div>
            <div class="color-row">
              <input id="color_picker" class="color-picker" type="color" />
              <ha-textfield id="color" label="Marker Color"></ha-textfield>
            </div>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel id="advanced_map_panel" header="Advanced Map Settings" outlined>
          <div class="panel-content">
            <div class="row">
              <ha-selector id="height"></ha-selector>
              <ha-selector id="zoom"></ha-selector>
            </div>
            <div class="row">
              <ha-selector id="marker_size"></ha-selector>
              <ha-select id="zoom_control_position" label="Zoom In/Out buttons"></ha-select>
            </div>
            <div class="row">
              <ha-select id="tile_style" label="Map Style"></ha-select>
              <ha-select id="style_preset" label="Card Style"></ha-select>
            </div>
            <div id="map_labels_card" class="toggle-card">
              <div class="toggle-copy">
                <div class="toggle-label">Show map labels</div>
                <div class="toggle-description">Built-in map styles only. Turn street and place labels on or off.</div>
              </div>
              <ha-switch id="show_map_labels"></ha-switch>
            </div>
            <ha-textfield
              id="tile_url"
              label="Custom Tile URL"
              placeholder="e.g. https://tiles.example.com/{z}/{x}/{y}.png"
            ></ha-textfield>
          </div>
        </ha-expansion-panel>
      </div>
    `;

    this._rendered = true;
    this._refs = {
      device: this.shadowRoot.getElementById("device"),
      deviceHelper: this.shadowRoot.getElementById("device_helper"),
      showHeader: this.shadowRoot.getElementById("show_header"),
      title: this.shadowRoot.getElementById("title"),
      subtitleMode: this.shadowRoot.getElementById("subtitle_mode"),
      subtitle: this.shadowRoot.getElementById("subtitle"),
      subtitleEntity: this.shadowRoot.getElementById("subtitle_entity"),
      subtitleLabel: this.shadowRoot.getElementById("subtitle_label"),
      subtitleSuffix: this.shadowRoot.getElementById("subtitle_suffix"),
      subtitleFallback: this.shadowRoot.getElementById("subtitle_fallback"),
      icon: this.shadowRoot.getElementById("icon"),
      tapAction: this.shadowRoot.getElementById("tap_action"),
      iconTapAction: this.shadowRoot.getElementById("icon_tap_action"),
      height: this.shadowRoot.getElementById("height"),
      zoom: this.shadowRoot.getElementById("zoom"),
      markerSize: this.shadowRoot.getElementById("marker_size"),
      speedEntity: this.shadowRoot.getElementById("speed_entity"),
      zoomControlPosition: this.shadowRoot.getElementById("zoom_control_position"),
      tileStyle: this.shadowRoot.getElementById("tile_style"),
      mapLabelsCard: this.shadowRoot.getElementById("map_labels_card"),
      showMapLabels: this.shadowRoot.getElementById("show_map_labels"),
      tileUrl: this.shadowRoot.getElementById("tile_url"),
      stylePreset: this.shadowRoot.getElementById("style_preset"),
      showSpeedometer: this.shadowRoot.getElementById("show_speedometer"),
      autoZoomBySpeed: this.shadowRoot.getElementById("auto_zoom_by_speed"),
      color: this.shadowRoot.getElementById("color"),
      colorPicker: this.shadowRoot.getElementById("color_picker"),
    };

    this._refs.tapAction.label = "Tap behavior";
    this._refs.tapAction.defaultAction = "more-info";
    this._refs.iconTapAction.label = "Icon tap behavior";
    this._refs.iconTapAction.defaultAction = "none";
    this._refs.height.label = "Height";
    this._refs.height.selector = { number: { min: 160, max: 960, step: 1, mode: "box" } };
    this._refs.zoom.label = "Zoom";
    this._refs.zoom.selector = { number: { min: 1, max: 20, step: 1, mode: "box" } };
    this._refs.markerSize.label = "Marker Size";
    this._refs.markerSize.selector = { number: { min: 12, max: 96, step: 1, mode: "box" } };
    this._refs.subtitleEntity.label = "Subtitle Entity";
    this._refs.subtitleEntity.selector = { entity: {} };
    this._refs.speedEntity.label = "Speed Entity";
    this._refs.speedEntity.selector = { entity: {} };
    this._refs.subtitleMode.options = [
      { value: "none", label: "None" },
      { value: "custom_text", label: "Custom Text" },
      { value: "smart", label: "Smart" },
      { value: "coordinates", label: "Coordinates" },
      { value: "address", label: "Address / Place" },
      { value: "status", label: "Status" },
      { value: "speed", label: "Speed" },
      { value: "speed_or_parked", label: "Speed or Parked" },
      { value: "heading", label: "Heading" },
      { value: "last_updated", label: "Last Updated" },
      { value: "custom_entity", label: "Custom Entity Value" },
    ];

    this._refs.device.addEventListener("selected", (event) => this._handleDeviceSelection(event.detail.value));

    for (const field of [
      this._refs.title,
      this._refs.subtitle,
      this._refs.subtitleLabel,
      this._refs.subtitleSuffix,
      this._refs.subtitleFallback,
      this._refs.color,
      this._refs.tileUrl,
    ]) {
      field.addEventListener("change", (event) => this._handleFieldChange(event));
    }

    this._refs.showHeader.addEventListener("change", (event) =>
      this._updateConfigValue("show_header", event.target.checked)
    );
    this._refs.subtitleMode.addEventListener("selected", (event) =>
      this._updateConfigValue("subtitle_mode", normalizeSelectValue(event.detail.value, SUBTITLE_MODES, "none"))
    );
    this._refs.subtitleEntity.addEventListener("value-changed", (event) =>
      this._updateConfigValue("subtitle_entity", firstNonEmptyString(event.detail.value))
    );
    this._refs.speedEntity.addEventListener("value-changed", (event) =>
      this._updateConfigValue("speed_entity", firstNonEmptyString(event.detail.value))
    );

    this._refs.height.addEventListener("value-changed", (event) => {
      const numericValue = asNumber(event.detail.value);
      this._updateConfigValue("height", numericValue === null ? undefined : `${numericValue}px`);
    });
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
      this._commitConfig({
        ...this._config,
        zoom_control_position: normalizeSelectValue(event.detail.value, ZOOM_CONTROL_POSITIONS, "topleft"),
        show_zoom_controls:
          normalizeSelectValue(event.detail.value, ZOOM_CONTROL_POSITIONS, "topleft") !== "hidden",
      })
    );
    this._refs.tileStyle.addEventListener("selected", (event) => {
      const nextValue = normalizeSelectValue(event.detail.value, TILE_STYLE_EDITOR_OPTIONS, "default");
      const config = { ...this._config, tile_style: nextValue };

      if (nextValue !== "custom") {
        delete config.tile_url;
      }

      this._commitConfig(config);
    });
    this._refs.showMapLabels.addEventListener("change", (event) =>
      this._updateConfigValue("show_map_labels", event.target.checked)
    );
    this._refs.stylePreset.addEventListener("selected", (event) =>
      this._updateConfigValue("style_preset", normalizeSelectValue(event.detail.value, STYLE_PRESETS, "mushroom"))
    );

    this._refs.showSpeedometer.addEventListener("change", (event) => {
      const config = { ...this._config, show_speedometer: event.target.checked };
      if (event.target.checked) {
        config.auto_zoom_by_speed = true;
      }
      this._commitConfig(config);
    });
    this._refs.autoZoomBySpeed.addEventListener("change", (event) =>
      this._updateConfigValue("auto_zoom_by_speed", event.target.checked)
    );

    this._refs.colorPicker.addEventListener("change", (event) => {
      const value = normalizeHex(event.target.value);
      this._refs.color.value = value;
      this._updateConfigValue("color", value);
    });

    this._refs.zoomControlPosition.options = [
      { value: "topleft", label: "Top Left" },
      { value: "bottomleft", label: "Bottom Left" },
      { value: "bottomright", label: "Bottom Right" },
      { value: "hidden", label: "Hidden" },
    ];
    this._refs.tileStyle.options = [
      { value: "default", label: "Default (Auto light/dark)" },
      { value: "dark", label: "Dark" },
      { value: "voyager", label: "Voyager" },
      { value: "custom", label: "Custom URL" },
    ];
    this._refs.stylePreset.options = [
      { value: "default", label: "Default" },
      { value: "mushroom", label: "Mushroom-inspired" },
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
    this._refs.subtitleEntity.hass = this._hass;
    this._refs.speedEntity.hass = this._hass;
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
        device.speedEntityId,
      ])
    );
    const previousSignature = JSON.stringify(
      this._compatibleDevices.map((device) => [
        device.deviceId,
        device.entityId,
        device.latitudeEntityId,
        device.longitudeEntityId,
        device.headingEntityId,
        device.speedEntityId,
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
    if (!this._isControlFocused(this._refs.showHeader)) {
      this._refs.showHeader.checked = this._config.show_header !== false;
    }
    this._setControlValue(this._refs.title, this._config.title ?? defaultTitle);
    this._setControlValue(this._refs.subtitleMode, this._config.subtitle_mode || "none");
    this._setControlValue(this._refs.subtitle, this._config.subtitle || "");
    this._setControlValue(this._refs.subtitleEntity, this._config.subtitle_entity || "");
    this._setControlValue(this._refs.subtitleLabel, this._config.subtitle_label || "");
    this._setControlValue(this._refs.subtitleSuffix, this._config.subtitle_suffix || "");
    this._setControlValue(this._refs.subtitleFallback, this._config.subtitle_fallback || "");
    this._setControlValue(this._refs.icon, this._config.icon || "");
    this._refs.tapAction.config = this._config.tap_action;
    this._refs.iconTapAction.config = this._config.icon_tap_action;
    this._setControlValue(
      this._refs.height,
      parsePixelHeight(this._config.height) ?? parsePixelHeight(DEFAULT_CARD_HEIGHT) ?? 320
    );
    this._setControlValue(this._refs.zoom, this._config.zoom ?? DEFAULT_ZOOM);
    this._setControlValue(this._refs.markerSize, this._config.marker_size ?? DEFAULT_MARKER_SIZE);
    this._setControlValue(this._refs.speedEntity, this._config.speed_entity || "");
    this._setControlValue(
      this._refs.zoomControlPosition,
      this._config.show_zoom_controls === false
        ? "hidden"
        : normalizeSelectValue(this._config.zoom_control_position, ZOOM_CONTROL_POSITIONS, "topleft")
    );
    this._setControlValue(this._refs.tileStyle, this._getTileStyleSelection());
    if (!this._isControlFocused(this._refs.showMapLabels)) {
      this._refs.showMapLabels.checked = this._config.show_map_labels !== false;
    }
    this._setControlValue(this._refs.tileUrl, this._config.tile_url || "");
    this._setControlValue(this._refs.stylePreset, normalizeSelectValue(this._config.style_preset, STYLE_PRESETS, "mushroom"));
    if (!this._isControlFocused(this._refs.showSpeedometer)) {
      this._refs.showSpeedometer.checked = this._config.show_speedometer === true;
    }
    if (!this._isControlFocused(this._refs.autoZoomBySpeed)) {
      this._refs.autoZoomBySpeed.checked = this._config.auto_zoom_by_speed === true;
    }
    this._setControlValue(this._refs.color, normalizeHex(this._config.color));
    if (!this._isControlFocused(this._refs.colorPicker)) {
      this._refs.colorPicker.value = normalizeHex(this._config.color);
    }
    this._syncSubtitleEditorState();
    this._syncTileStyleEditorState();
    this._updateActionEditorContext();
  }

  _syncSubtitleEditorState() {
    if (!this._rendered) {
      return;
    }

    const mode = normalizeSelectValue(this._config.subtitle_mode, SUBTITLE_MODES, "none");
    const usesText = mode === "custom_text";
    const usesEntity = mode === "custom_entity" || mode === "speed" || mode === "speed_or_parked";
    const usesLabel = mode === "custom_entity";
    const usesSuffix = mode === "custom_entity" || mode === "speed" || mode === "speed_or_parked";
    const usesFallback = ["speed", "speed_or_parked", "heading", "last_updated", "custom_entity"].includes(mode);

    const applyVisibility = (control, visible) => {
      if (!control) {
        return;
      }

      control.hidden = !visible;
      control.style.display = visible ? "" : "none";
    };

    applyVisibility(this._refs.subtitle, usesText);
    applyVisibility(this._refs.subtitleEntity, usesEntity);
    applyVisibility(this._refs.subtitleLabel, usesLabel);
    applyVisibility(this._refs.subtitleSuffix, usesSuffix);
    applyVisibility(this._refs.subtitleFallback, usesFallback);
    this._syncTileStyleEditorState();
  }

  _syncTileStyleEditorState() {
    if (!this._rendered) {
      return;
    }

    const tileStyle = this._getTileStyleSelection();
    const showTileUrl = tileStyle === "custom";
    const showMapLabels = tileStyle !== "custom";

    this._refs.tileUrl.hidden = !showTileUrl;
    this._refs.tileUrl.style.display = showTileUrl ? "" : "none";
    this._refs.mapLabelsCard.hidden = !showMapLabels;
    this._refs.mapLabelsCard.style.display = showMapLabels ? "" : "none";
  }

  _getTileStyleSelection() {
    const configuredUrl = firstNonEmptyString(this._config?.tile_url);
    const configuredStyle = normalizeSelectValue(this._config?.tile_style, TILE_STYLE_EDITOR_OPTIONS, "default");

    if (configuredStyle === "custom") {
      return "custom";
    }

    if (configuredUrl && !isBuiltInTileUrl(configuredUrl)) {
      return "custom";
    }

    if (configuredUrl === DEFAULT_VOYAGER_TILE_URL) {
      return "voyager";
    }

    if (configuredUrl === DEFAULT_DARK_TILE_URL) {
      return "dark";
    }

    return normalizeSelectValue(configuredStyle, TILE_STYLE_EDITOR_OPTIONS, "default");
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
    delete config.subtitle_text;

    if (!deviceId) {
      delete config.device_id;
      delete config.entity;
      delete config.latitude_entity;
      delete config.longitude_entity;
      delete config.heading_entity;
      delete config.speed_entity;
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

    if (selectedMatch.speedEntityId) {
      config.speed_entity = selectedMatch.speedEntityId;
    } else {
      delete config.speed_entity;
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

    if (field === "subtitle_label") {
      this._updateConfigValue("subtitle_label", firstNonEmptyString(rawValue));
      return;
    }

    if (field === "subtitle_suffix") {
      this._updateConfigValue("subtitle_suffix", firstNonEmptyString(rawValue));
      return;
    }

    if (field === "subtitle_fallback") {
      this._updateConfigValue("subtitle_fallback", firstNonEmptyString(rawValue));
      return;
    }

    if (field === "color") {
      const normalizedColor = normalizeHex(rawValue);
      this._refs.colorPicker.value = normalizedColor;
      this._updateConfigValue("color", normalizedColor);
      return;
    }

    if (field === "tile_url") {
      const config = { ...this._config, tile_style: "custom" };
      const normalizedUrl = firstNonEmptyString(rawValue);

      if (normalizedUrl) {
        config.tile_url = normalizedUrl;
      } else {
        delete config.tile_url;
      }

      this._commitConfig(config);
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
  name: "Advanced Map Card 3000",
  preview: true,
  description: "Shows one or more entities on a map with a directional heading arrow.",
});
