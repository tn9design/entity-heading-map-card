# v0.3.0-beta.1 — Home Assistant maps

New cards can use Home Assistant vector maps without an account or map key. Headings, arrows, vehicle images, lights, tooltips, speedometers, tracking and Leaflet controls are preserved. Choose automatic/light/dark HA themes and optionally hide text labels.

Existing saved cards keep their CARTO/custom provider. Switching providers preserves inactive URLs and keys. Home Assistant 2026.9+ with the map service is required for HA maps. Tokens are obtained automatically and kept only in memory, with compatibility for URL and header token transports.

When vector rendering is unavailable, HA raster maps preserve markers and controls. Raster labels/styles are limited; dark mode uses a background-only filter. An unavailable HA map service leaves markers visible and explains compatibility. The card does not silently switch providers.

The renderer, worker and CSS are bundled into the usual single HACS JavaScript artifact. MapLibre 6.4.1 replaces the originally planned 5.24.0 because the older release has an attribution-sanitizer security advisory (GHSA-jrc7-96c5-q579); Leaflet adapter 0.1.4 is retained.

This remains an initial beta. The broader editor redesign and default HACS catalog submission are deferred. This file is a release draft; no public release or production replacement has been performed.
