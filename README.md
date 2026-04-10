# Entity Heading Map Card

`entity-heading-map-card` is a Home Assistant Lovelace card for showing one or more entities on a live map with a directional heading arrow.

It is designed for tracked objects such as:

- vehicles
- people
- boats
- aircraft
- bikes
- anything else that exposes coordinates and an optional heading

The card uses Leaflet with OpenStreetMap tiles by default, so there is no API key, account setup, or paid map provider required.

## Features

- HACS-friendly frontend card
- OpenStreetMap tiles by default
- Supports one or many entities
- Rotated heading arrow per entity
- Auto-fit bounds for multiple markers
- Works with either:
  - a single entity that exposes `latitude` and `longitude` as attributes
  - separate entities for latitude, longitude, and heading
- Configurable marker color, zoom, height, and tile layer

## Installation

### HACS Custom Repository

1. Add this repository to HACS as a `Dashboard` repository.
2. Install `Entity Heading Map Card`.
3. Add the resource if HACS does not add it automatically:

```yaml
url: /hacsfiles/entity-heading-map-card/dist/entity-heading-map-card.js
type: module
```

## Basic Usage

### Single Entity With Lat/Lon Attributes

```yaml
type: custom:entity-heading-map-card
title: Tracker
entity: device_tracker.my_tracker
heading_entity: sensor.my_tracker_heading
```

### One Marker Using Separate Entities

```yaml
type: custom:entity-heading-map-card
title: ONYX
latitude_entity: sensor.onyx_onyx_latitude
longitude_entity: sensor.onyx_onyx_longitude
heading_entity: sensor.onyx_onyx_heading
```

### Multiple Markers

```yaml
type: custom:entity-heading-map-card
title: Teslas
fit_bounds: true
entities:
  - name: ONYX
    latitude_entity: sensor.onyx_onyx_latitude
    longitude_entity: sensor.onyx_onyx_longitude
    heading_entity: sensor.onyx_onyx_heading
    color: "#3388ff"
  - name: BARB
    latitude_entity: sensor.barb_barb_latitude
    longitude_entity: sensor.barb_barb_longitude
    heading_entity: sensor.barb_barb_heading
    color: "#ff5a5f"
```

## Configuration

Top-level options:

- `title`: Optional card title
- `height`: Map height in pixels or CSS string. Default: `320px`
- `zoom`: Default zoom for a single marker. Default: `16`
- `fit_bounds`: Fit all markers into view when more than one marker is present. Default: `true`
- `entity`: A single entity with `latitude` and `longitude` attributes
- `latitude_entity`: Entity whose state is the latitude
- `longitude_entity`: Entity whose state is the longitude
- `heading_entity`: Entity whose state is the heading in degrees
- `color`: Default marker color
- `tile_url`: Tile URL template. Default: OpenStreetMap standard tile URL
- `tile_attribution`: Attribution string for the tile layer
- `entities`: Array of marker definitions

Per-marker options inside `entities`:

- `name`: Marker label
- `entity`: Entity with `latitude` and `longitude` attributes
- `latitude_entity`: Latitude entity
- `longitude_entity`: Longitude entity
- `heading_entity`: Heading entity
- `color`: Marker color override

## Notes

- The default heading arrow uses a simple SVG marker rotated clockwise in degrees.
- If no heading is available, the card still shows the marker without a rotated arrow.
- For public or large-scale use, consider overriding the default tile layer with a provider appropriate for your usage.

## Development

The current scaffold keeps the source file in `src/` and copies it to `dist/`:

```bash
npm run build
```
