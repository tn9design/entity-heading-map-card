# Advanced Map Card 3,000

<p align="left">
  <a href="https://github.com/tn9design/entity-heading-map-card">
    <img src="https://img.shields.io/badge/version-v0.1.0-1e88e5?style=flat-square" alt="Version" />
  </a>
  <a href="https://www.hacs.xyz/">
    <img src="https://img.shields.io/badge/HACS-Default-fc8d3d?style=flat-square" alt="HACS Default" />
  </a>
</p>

<p align="left">
  A polished Home Assistant Lovelace map card for showing one or more tracked entities with a directional heading marker.
</p>

It is designed for tracked objects such as:

- vehicles
- people
- boats
- aircraft
- bikes
- anything else that exposes coordinates and an optional heading

The card uses Leaflet with CARTO light tiles by default, so there is no API key, account setup, or paid map provider required.

<p align="left">
  <img src="images/example_01.png" alt="Advanced Map Card 3000 preview" width="600" style="border-radius: 8px;" />
</p>

## Why This Card

- Built for vehicles, people, and anything else that exposes coordinates with an optional heading
- Looks native in Home Assistant instead of feeling like a bolted-on map widget
- Works with a single entity, split latitude/longitude sensors, or multi-entity map layouts
- Falls back gracefully to a blue dot when heading data is unavailable
- Includes a modern Home Assistant editor with device auto-discovery

## Features

- HACS-friendly frontend card
- No-key CARTO light map tiles by default
- Supports one or many entities
- Rotated heading arrow when heading is available
- Blue dot fallback when heading is not available
- Auto-fit bounds for multiple markers
- Home Assistant UI editor with device auto-discovery
- Works with either:
  - a single entity that exposes `latitude` and `longitude` as attributes
  - separate entities for latitude, longitude, and heading
- Optional header icon and subtitle
- Configurable tap action and icon tap action
- Configurable marker color, zoom, height, zoom controls, and tile layer

## Installation

[![Open your Home Assistant instance and open the Advanced Map Card 3000 repository inside HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=tn9design&repository=entity-heading-map-card)

The easiest path is to open the repository directly in HACS using the button above.

#### HACS Custom Repository

1. Open `HACS` -> `Custom repositories`.
2. Add:
   Repository: `tn9design/entity-heading-map-card`
   Type: `Dashboard`
3. Install `Advanced Map Card 3000`.

#### How HACS Installs This Card

HACS installs the repository under `www/community/entity-heading-map-card/`, and the dashboard file it uses is:

`entity-heading-map-card.js`

That file is selected by `hacs.json`:

```json
{
  "content_in_root": false,
  "filename": "entity-heading-map-card.js"
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
- subtitle
- optional icon
- tap behavior
- icon tap behavior
- zoom and marker sizing
- zoom button visibility and position

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

<img src="images/example_02.png" alt="Advanced Map Card 3000 editor options" width="550" align="right" style="border-radius: 8px;" />

The built-in editor is organized the same way the card is typically configured in Home Assistant.

#### Device

- `device_id`: Device selected in the editor. The card auto-discovers devices that expose latitude and longitude.
- Devices with heading render as arrows.
- Devices without heading render as blue dots.

#### Content

- `title`: Optional card title. If omitted, the selected device name is used.
- `subtitle`: Optional subtitle shown below the title.
- `icon`: Optional Home Assistant icon shown to the left of the header.

#### Interactions

- `tap_action`: Card tap action. Default: `more-info`.
- `icon_tap_action`: Icon tap action. Default: `none`.

#### Features

- `height`: Map height in pixels or CSS string. Default: `320px`.
- `zoom`: Default zoom for a single marker. Default: `16`.
- `marker_size`: Marker size in pixels. Default: `32`.
- `zoom_control_position`: `topleft`, `topright`, `bottomleft`, or `bottomright`.
- `show_zoom_controls`: Show or hide Leaflet zoom buttons. Default: `true`.
- `color`: Default marker color.

<div style="clear: both;"></div>

## Additional Options

#### YAML-Only Source Options

- `entity`: A single entity with `latitude` and `longitude` attributes.
- `latitude_entity`: Entity whose state is the latitude.
- `longitude_entity`: Entity whose state is the longitude.
- `heading_entity`: Optional entity whose state is the heading in degrees.
- `fit_bounds`: Fit all markers into view when more than one marker is present. Default: `true`.
- `entities`: Array of marker definitions for multi-marker layouts.

#### Advanced Tile Options

- `tile_url`: Tile URL template. Default: CARTO light tiles.
- `tile_attribution`: Attribution string for the tile layer.
- `tile_subdomains`: Tile subdomain string. Default: `abcd`.
- `show_attribution`: Show or hide map attribution. Default: `false`.

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
- For public or large-scale use, consider overriding the default tile layer with a provider appropriate for your usage.

## Planned Enhancements

The following enhancements are under consideration for future releases as the card continues to evolve.

- [ ] Manual entity mapping for latitude, longitude, and heading so users can combine values from multiple entities when no single compatible device exists.
- [ ] Multi-entity map support for showing several tracked objects on the same card at once.
- [ ] Richer subtitle options, including support for dynamic entity-driven values and custom labels.
- [ ] Header styling controls for icon, title, and subtitle colors.
- [ ] Optional header visibility for a cleaner map-only presentation.
- [ ] A recenter control that restores the default map view after the map has been moved or zoomed.
- [ ] Custom interactions for the map marker itself, including marker tap actions.
- [ ] Optional speed display for devices that expose motion or speed data, with support for conditional visibility while moving.
- [ ] Satellite tile support for advanced users who want to provide their own credentials or API keys.
- [ ] Custom SVG marker support for replacing the default arrow with a user-supplied icon.

## Compatibility

- Home Assistant Lovelace dashboard card
- HACS default repository
- Leaflet-based frontend card with no external API key required for the default setup

## Development

The current scaffold keeps the source file in `src/` and copies it to `dist/`:

```bash
npm run build
```
