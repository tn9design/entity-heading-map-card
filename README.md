<h1>Advanced Map Heading Card 3000GT</h1>
<p class="product-meta"><strong>Public Beta</strong> · Custom Lovelace Card · Heading-Aware Markers</p>
<p><strong>See Where It Is. See Where It’s Going.</strong></p>
<p>A heading-aware map card for Home Assistant, designed primarily for vehicle entities that provide location, heading, and speed data. Your marker turns with your vehicle, with the map and controls styled to suit your dashboard.</p>

<img src="https://raw.githubusercontent.com/tn9design/entity-heading-map-card/main/images/showcase/heading-hero.gif" alt="Three actual map cards showing a simulated vehicle driving south and turning east; arrows rotate with the turn." width="788">
<p><sub>Actual card rendering with simulated data in Washington, DC. No real vehicle or household location data.</sub></p>
<h2>The Turn Tells The Story.</h2>
<p>A dot tells you where a vehicle is. A heading arrow also shows which way it’s facing. Connect a location entity and a heading sensor, and the marker follows the supplied direction as the location updates.</p>
<h2>Make It Yours.</h2>
<p>From a minimal map to a complete vehicle card, choose what belongs on your dashboard. Click any thumbnail to view a larger comparison.</p>
<table>
<tr><td width="170"><a href="https://raw.githubusercontent.com/tn9design/entity-heading-map-card/main/images/showcase/colors-large.png" title="View Larger Comparison"><img src="https://raw.githubusercontent.com/tn9design/entity-heading-map-card/main/images/showcase/colors.png" width="160" alt="Your marker. Your color."></a></td><td><strong>Your Marker. Your Color.</strong><br>Choose an arrow color and marker size that stand out on your dashboard.</td></tr>
<tr><td width="170"><a href="https://raw.githubusercontent.com/tn9design/entity-heading-map-card/main/images/showcase/styles-large.png" title="View Larger Comparison"><img src="https://raw.githubusercontent.com/tn9design/entity-heading-map-card/main/images/showcase/styles.png" width="160" alt="A map for every dashboard."></a></td><td><strong>A Map For Every Dashboard.</strong><br>Use Home Assistant maps without a separate map key, or choose CARTO light, dark, and Voyager styles.</td></tr>
<tr><td width="170"><a href="https://raw.githubusercontent.com/tn9design/entity-heading-map-card/main/images/showcase/night-large.png" title="View Larger Comparison"><img src="https://raw.githubusercontent.com/tn9design/entity-heading-map-card/main/images/showcase/night.png" width="160" alt="Day to night, automatically."></a></td><td><strong>Day To Night, Automatically.</strong><br>Let Home Assistant maps follow your dashboard’s theme, or configure separate day and night CARTO styles.</td></tr>
<tr><td width="170"><a href="https://raw.githubusercontent.com/tn9design/entity-heading-map-card/main/images/showcase/speed-large.png" title="View Larger Comparison"><img src="https://raw.githubusercontent.com/tn9design/entity-heading-map-card/main/images/showcase/speed.png" width="160" alt="Speed, at a glance."></a></td><td><strong>Speed, At A Glance.</strong><br>Pick a classic speed readout or a gauge, customize its appearance, or hide it entirely.</td></tr>
<tr><td width="170"><a href="https://raw.githubusercontent.com/tn9design/entity-heading-map-card/main/images/showcase/controls-large.png" title="View Larger Comparison"><img src="https://raw.githubusercontent.com/tn9design/entity-heading-map-card/main/images/showcase/controls.png" width="160" alt="Only the controls you want."></a></td><td><strong>Only The Controls You Want.</strong><br>Show or hide zoom and recenter buttons to keep the map as minimal as you like.</td></tr>
<tr><td width="170"><a href="https://raw.githubusercontent.com/tn9design/entity-heading-map-card/main/images/showcase/headers-large.png" title="View Larger Comparison"><img src="https://raw.githubusercontent.com/tn9design/entity-heading-map-card/main/images/showcase/headers.png" width="160" alt="Give it a name. Or keep it clean."></a></td><td><strong>Give It A Name. Or Keep It Clean.</strong><br>Customize the title and subtitle, or hide the header for an uninterrupted map.</td></tr>
</table>
<p><strong>Prefer A Custom Marker?</strong> Use your own top-down vehicle image, with separate day and night images, adjustable size, and optional nighttime headlight and rear-light effects.</p>
<h2>Built Around Your Entities.</h2>
<p>Use your existing Home Assistant location, heading, and speed entities. The card displays the data they provide; update frequency depends on your integration. Optional marker tooltips keep extra details close by.</p>
<h3>Tested With TeslaMate</h3>
<p>Developed and tested using TeslaMate location, heading, and speed entities. Other integrations can work when they expose equivalent data. <a href="https://docs.teslamate.org/docs/integrations/home_assistant/">TeslaMate Setup &amp; Documentation</a></p>
<h3>Tesla Fleet Compatibility</h3>
<p>Tesla Fleet provides vehicle location and optional speed data, but Home Assistant’s built-in integration currently doesn’t expose heading and polls every 10 minutes by default. Its location entity can be used, but it won’t provide the same heading-aware driving experience. <a href="https://www.home-assistant.io/integrations/tesla_fleet/">Tesla Fleet Integration Details</a></p>
<h2>Get Your First Map Running.</h2>
<ol>
<li><strong>Install The Card.</strong> Add <code>tn9design/entity-heading-map-card</code> as a custom Dashboard repository in HACS, install it, and reload your browser.</li>
<li><strong>Connect Your Entities.</strong> Add Advanced Map Heading Card 3000GT to a dashboard and select your location entity and heading sensor. Add a speed sensor if you want a speedometer.</li>
<li><strong>Choose Your Map Provider.</strong> New cards default to Home Assistant maps, with no separate account or map key required on Home Assistant 2026.9 or newer with the map service. Existing cards keep their saved CARTO/custom settings. For CARTO, get your own basemap key from <a href="https://carto.com/basemaps/apikey">CARTO</a> and save it in the card’s configuration. Keep map attribution visible.</li>
</ol>
<p><a href="https://github.com/tn9design/entity-heading-map-card#configuration">Configuration reference &amp; examples</a> · <a href="https://github.com/tn9design/entity-heading-map-card/issues">Report an issue</a> · <a href="https://github.com/tn9design/entity-heading-map-card/releases">Release notes</a></p>
<h2>A Beta Worth Helping Shape.</h2>
<p>The card is still in its initial beta. A simpler, better-organized visual editor is planned. If something feels confusing or doesn’t behave as expected, open an issue with your card version and a description of the problem.</p>
<p><sub>Maps © OpenStreetMap contributors © CARTO. Screenshots use the released card and synthetic demo data.</sub></p>


---

## Installation

[![Open your Home Assistant instance and open the Advanced Map Heading Card 3000GT repository inside HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=tn9design&repository=entity-heading-map-card)

The easiest path is to open the repository directly in HACS using the button above.

#### HACS Install

The card is currently available as a custom repository. Default-catalog listing is being prepared; it is not searchable in the default catalog yet.

1. Open `HACS` -> `Custom repositories`.
2. Add:
   Repository: `tn9design/entity-heading-map-card`
   Type: `Dashboard`
3. Install `Advanced Map Heading Card 3000GT`.

#### How HACS Installs This Card

HACS installs the repository under `www/community/entity-heading-map-card/`, and the dashboard file it uses is:

`dist/entity-heading-map-card.js`

That file is selected by `hacs.json`:

```json
{
  "content_in_root": false,
  "filename": "dist/entity-heading-map-card.js"
}
```

So it is normal to see supporting files like `README.md`, `src/`, `scripts/`, and `package.json` in the installed folder even though Home Assistant only loads the published JavaScript file at runtime.

## Quick Start

#### UI Editor

The built-in Home Assistant card editor can automatically discover compatible devices from the device and entity registries.

- Devices with latitude and longitude are selectable
- Devices with heading render as arrows
- Devices without heading render as blue dots

The editor also supports:

- custom title
- subtitle modes
- optional icon
- optional header visibility
- tap behavior
- icon tap behavior
- speedometer and speed-based auto zoom
- card and map style controls
- built-in map label toggle
- zoom and marker sizing
- zoom button placement
- custom tile URL entry in the visual editor

#### Single Entity With Lat/Lon Attributes

```yaml
type: custom:entity-heading-map-card
title: Tracker
entity: device_tracker.my_tracker
heading_entity: sensor.my_tracker_heading
```

#### One Marker Using Separate Entities

```yaml
type: custom:entity-heading-map-card
title: Tesla Model S
latitude_entity: sensor.tesla_model_s_latitude
longitude_entity: sensor.tesla_model_s_longitude
heading_entity: sensor.tesla_model_s_heading
```

#### Multiple Markers

```yaml
type: custom:entity-heading-map-card
title: Teslas
fit_bounds: true
entities:
  - name: Tesla Model S
    latitude_entity: sensor.tesla_model_s_latitude
    longitude_entity: sensor.tesla_model_s_longitude
    heading_entity: sensor.tesla_model_s_heading
    color: "#3388ff"
  - name: Tesla Model 3
    latitude_entity: sensor.tesla_model_3_latitude
    longitude_entity: sensor.tesla_model_3_longitude
    heading_entity: sensor.tesla_model_3_heading
    color: "#ff5a5f"
```

## Configuration

<img src="https://raw.githubusercontent.com/tn9design/entity-heading-map-card/main/images/example_02.png" alt="Advanced Map Heading Card 3000GT editor options" width="550" align="right" style="border-radius: 8px;" />

The built-in editor is organized the same way the card is typically configured in Home Assistant.

#### Device

- `device_id`: Device selected in the editor. The card auto-discovers devices that expose latitude and longitude.
- Devices with heading render as arrows.
- Devices without heading render as blue dots.

#### Content

- `title`: Optional card title. If omitted, the selected device name is used.
- `icon`: Optional Home Assistant icon shown to the left of the header.
- `show_header`: Show or hide the entire header area. Default: `true`.
- `subtitle_mode`: Controls how the subtitle is generated.
- `subtitle`: Custom subtitle text used by `custom_text` mode.
- `subtitle_entity`: Explicit entity source used by `custom_entity`, `speed`, and `speed_or_parked`.
- `subtitle_label`: Optional label prefix for `custom_entity`.
- `subtitle_suffix`: Optional value suffix such as `mph`, `knots`, or `ft`.
- `subtitle_fallback`: Fallback text when the selected subtitle mode has no value to show.

#### Interactions

- `tap_action`: Card tap action. Default: `more-info`.
- `icon_tap_action`: Icon tap action. Default: `none`.

#### Features

- `color`: Default marker color.
- `speed_entity`: Explicit Home Assistant entity used for the speedometer and speed-based auto zoom.
- `show_speedometer`: Show a speed badge while the selected speed entity is moving. Default: `false`.
- `auto_zoom_by_speed`: Adjust zoom smoothly with speed (one zoom level per 20 mph) while the selected speed entity is moving. Default: `false`.

<div style="clear: both;"></div>

## Additional Options

#### YAML-Only Source Options

- `entity`: A single entity with `latitude` and `longitude` attributes.
- `latitude_entity`: Entity whose state is the latitude.
- `longitude_entity`: Entity whose state is the longitude.
- `heading_entity`: Optional entity whose state is the heading in degrees.
- `fit_bounds`: Fit all markers into view when more than one marker is present. Default: `true`.
- `entities`: Array of marker definitions for multi-marker layouts.

## Getting a free CARTO key

The built-in map styles use CARTO raster tiles. CARTO now requires an API key; without one, tiles may show “API key required”. Each user should request their own key rather than reuse someone else's.

1. Visit [CARTO's Basemaps API-key page](https://www.carto.com/basemaps/apikey/).
2. For a personal Home Assistant dashboard, select **No — personal, hobby, academic, or non-profit**. Describe the project, for example: “Personal Home Assistant dashboard showing household and vehicle locations.”
3. Review and accept CARTO's terms and attribution requirement. CARTO emails the key; dashboard sign-in uses an emailed link rather than a password.
4. Open the card's visual editor, expand **Map Style & Layout**, paste the key into **CARTO API key**, and save. Keep your preferred built-in map style; no custom tile URL is needed.

As of October 2026, CARTO offers up to **5 million requests per calendar month for non-commercial use**, across your keys. Check the linked provider page for current terms and quotas. Website, app, and IP restrictions are optional; configure them to match all the ways you access HA, including its Companion app and remote access.

The key is stored in the dashboard configuration and sent to CARTO with tile requests. The password field hides it visually, but does not make it a server-side secret. Dashboard users can access it; do not post real keys in shared YAML, screenshots, issues, or repositories. The card only attaches this key to CARTO tile URLs, never to another provider.

YAML example (replace the placeholder locally):

```yaml
type: custom:entity-heading-map-card
entity: device_tracker.my_car
tile_style: default
carto_api_key: YOUR_OWN_CARTO_KEY
```

CARTO attribution is always shown for CARTO maps. Raster tiles are limited to native zoom 18; closer zoom levels enlarge those tiles instead of requesting unsupported zoom levels. If old watermarked tiles linger, refresh your browser. Custom providers still use `tile_url`, `tile_attribution`, and their own authentication requirements.

#### Advanced Tile Options

- `carto_api_key`: Your CARTO Basemaps key. Available in the visual editor; applied only to CARTO tile URLs.
- `tile_url`: Tile URL template. Used when `tile_style` is set to `custom`.
- `tile_attribution`: Attribution string for the tile layer.
- `tile_subdomains`: Tile subdomain string. Default: `abcd`.
- `attribution_opacity`: Opacity of the entire attribution strip (background and text), from `0` to `100`. Default: `100`. Available as a slider under **Map Style & Layout**. Keep provider credits readable as required by their terms.
- `show_attribution`: Show or hide map attribution. Default: `false` for custom non-CARTO providers; always visible for CARTO maps.

#### Advanced Map Settings

- `height`: Map height in pixels or CSS string. Default: `320px`.
- `zoom`: Default zoom for a single marker. Default: `19`.
- `marker_size`: Marker size in pixels. Default: `32`.
- `zoom_control_position`: `topleft`, `bottomleft`, `bottomright`, or `hidden`.
- `show_zoom_controls`: Legacy toggle support. The visual editor now uses `zoom_control_position: hidden`.
- `tile_style`: Built-in map style. Options: `default`, `dark`, `voyager`, or `custom`.
- `show_map_labels`: Show or hide map labels for built-in styles. Default: `true`.
- `style_preset`: Visual shell style. Options: `default`, `mushroom`.

#### Per-Marker Options

- `name`: Marker label
- `entity`: Entity with `latitude` and `longitude` attributes
- `latitude_entity`: Latitude entity
- `longitude_entity`: Longitude entity
- `heading_entity`: Optional heading entity
- `color`: Marker color override

## Notes

- The default heading marker uses a rounded SVG arrow rotated clockwise in degrees.
- If no heading is available, the card shows a blue dot instead of an arrow.
- The built-in `default` map style follows Home Assistant light/dark mode automatically.
- The built-in `dark` and `voyager` map styles can also be used explicitly, with labels optionally turned off in the visual editor.
- Choosing `Custom URL` in the visual editor exposes a tile URL field for third-party raster tile providers.
- For public or large-scale use, consider overriding the default tile layer with a provider appropriate for your usage.

## Planned Enhancements

The following enhancements are under consideration for future releases as the card continues to evolve.

- [ ] Header styling controls for icon, title, and subtitle colors.
- [x] A recenter control that restores the tracked map view after panning or zooming.
- [ ] Custom interactions for the map marker itself, including marker tap actions.
- [ ] Satellite tile support for advanced users who want to provide their own credentials or API keys.
- [ ] Custom SVG marker support for replacing the default arrow with a user-supplied icon.

## Compatibility

- Home Assistant Lovelace dashboard card
- Available through HACS as a custom repository; default-catalog submission pending
- Leaflet-based frontend card; built-in CARTO styles require a personal API key

## Development

The build bundles the source, vector renderer, worker and CSS into one JavaScript file in `dist/`:

```bash
npm run build
```

### Custom image markers

In **On-Map Display**, select **Custom image**, enter day and optional night image URLs, and set **Custom image size** (24–160 px). Size stays fixed on screen while zooming and includes transparent image margins. Images should point nose-up; the card rotates them using the reported heading. Without a heading, the image points north. Arrow size is stored separately.

**Automatic (sun)** uses the night image when `sun.sun` is below the horizon; otherwise it uses the day image. A missing night image falls back to the day image. Use Day or Night to preview either manually. Local files in `/config/www` are served at `/local/`.

```yaml
marker_type: image
marker_image: /local/car-map-markers/onyx-model-s-day.png
marker_image_night: /local/car-map-markers/onyx-model-s-night.png
marker_image_mode: auto
marker_image_size: 80
```

### Automatic vehicle lights

Custom image markers show the headlight wash and faint red rear glow after sunset (`sun.sun` below horizon). Set the optional **Gear entity** in On-Map Display: `P`/`Park`/`Parked` keeps lights off; `D`/`Drive`, `R`/`Reverse`, or `N`/`Neutral` turns them on even at zero speed. With absent, unavailable or unrecognized gear, lights use the configured speed entity (or source speed attributes) above zero. Unknown sun state keeps lights off. The **Show headlights at night** switch disables both effects. Night image artwork may include lit lamps even when these additional glows are off.

```yaml
show_headlights: true
gear_entity: sensor.onyx_onyx_shift_state
```

### Home Assistant maps — 0.3.0-beta.1

New cards use Home Assistant's vector maps without a CARTO account or API key. Requires Home Assistant 2026.9+ with the map service. Existing cards without `map_provider` keep their previous CARTO/custom provider and appearance. To opt in:

```yaml
map_provider: home_assistant
map_theme: auto # auto, light, dark
show_map_labels: true
```

Choose **Map Style & Layout → Map provider** in the visual editor. CARTO (`map_provider: carto`) retains its personal key and default/dark/voyager styles. Custom (`map_provider: custom`) retains its raster `tile_url`. Switching providers preserves inactive settings. HA automatic theme follows the interface theme; labels hide text while keeping other vector features. Heading markers, image size, lights, tooltips, tracking and controls continue to use Leaflet.

The single JavaScript artifact bundles MapLibre, its worker and CSS. No additional resource registration or credentials are needed. Tokens stay in memory, are refreshed every 20 minutes and after connection recovery, and are sent only to the connected instance's map proxy. Both legacy URL-token and newer header-token transports are supported.

Without WebGL or workers, or after unrecovered WebGL context loss, the card uses HA's raster proxy. It retains headings and controls, supports overzoom to 20, and applies dark filtering only to the background. Raster labels and styles are limited; the card displays a fallback notice. If HA's map service is unavailable, markers remain with a compatibility/retry message; the card does not switch to CARTO automatically.

`npm run build:beta` creates an isolated `entity-heading-map-card-beta.js`, registered as `custom:entity-heading-map-card-beta` with a separate editor. `npm run build` creates the normal HACS artifact. Both use esbuild; install dependencies with `npm ci` first. This release remains beta; default HACS catalog submission is deferred.

The deterministic browser fixture uses synthetic vehicle positions and a loopback relay to HA's map service. On this macOS test host, `npm run test:browser:serve` obtains the existing HA credential from Keychain without printing it. Open `http://127.0.0.1:8768/`; run the functions in `tests/vector-browser-*.js` with Playwright CLI `run-code`. Recovery tests reload the page; record their results before proceeding. The relay is for local testing only and does not change entities.

### Satellite Imagery

Choose **Satellite (MapTiler)** under **Map Style & Layout**, then enter your own [MapTiler API key](https://cloud.maptiler.com/). This uses the MapTiler satellite map with 256-pixel XYZ tiles, preserves vehicle markers and controls, and displays the provider credits and logo. The key is masked in the editor but stored in the dashboard configuration and accessible to its users. Account limits and origin restrictions apply. Satellite imagery does not use the HA map theme. **Show map labels** switches between plain satellite imagery (off) and imagery with streets, roads and place names (on). Native imagery requests stop at zoom 18 and are enlarged at higher card zoom levels. Satellite imagery has been verified in Home Assistant with an origin-restricted personal key.

#### Create Your MapTiler Key

In MapTiler Cloud, open **API Keys → New Key**. Use these examples:

| Field | Example / What To Enter |
| --- | --- |
| Name | `Home Assistant Map Card` — a label for your own reference. |
| Description | `Satellite imagery for Advanced Map Heading Card 3000GT` — a description for your own reference. |
| Allowed user-agent header | Leave blank so the key works across browsers and the Home Assistant app. |
| Allowed HTTP Origins | The hostnames or IP addresses you use to open Home Assistant, one per line. Replace the examples below with your own addresses. |

For example, if you open Home Assistant at `http://homeassistant.local:8123`, `http://192.168.1.100:8123`, and a remote Nabu Casa address, enter:

```text
homeassistant.local
192.168.1.100
your-instance.ui.nabu.casa
```

Include only addresses you actually use. Omit the protocol (`http://` or `https://`), port (`:8123`), and dashboard path. Replace `your-instance.ui.nabu.casa` with your actual remote hostname, or omit that line if you do not use remote access. Do not enter `?` to allow unknown origins. See [MapTiler's API key instructions](https://docs.maptiler.com/guides/credentials/api-key/) for restriction details.

Create the key, then open the card editor and select **Map Style & Layout → Map provider → Satellite (MapTiler)**. Paste the key into **MapTiler API Key** and save the card. If imagery fails to load, check that the key's allowed origins include the address currently used to access Home Assistant, and check the account's usage limits.
