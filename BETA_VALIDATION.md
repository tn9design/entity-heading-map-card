# HA vector beta validation — 2026-10-08

Implemented on `codex/ha-vector-map`, based on the published v0.2.0 baseline. Staged separately as `custom:entity-heading-map-card-beta`; production files and the original dashboard view were verified unchanged by file hashes and API read-back. No public release has been made.

## Verified

- HA 2026.9.4 authenticated map-token service, light/dark styles, TileJSON, sprites, glyphs and vector tiles; URL-token transport used live (header probe returns 403).
- Both real Tesla cards render on the staged HA view. Provider/theme controls render in the actual HA editor; dark preview works. The focused provider/theme value update was corrected.
- Node tests: legacy/new-card defaults, legacy Voyager and inactive custom URLs, CARTO key isolation, slider behavior, image selection, lighting rules, shared sessions, 20-minute scheduled refresh, reconnection, both authentication transports, release and style transforms.
- Browser fixtures with synthetic vehicle coordinates: headings 0/45/90/180/270/359/0, missing heading, moving coordinates, arrow/image rendering, day/night artwork, Park/Drive/Reverse/unknown-gear speed fallback, fixed image size at zoom 12/18/19.5/20, and background/marker projection within one pixel.
- Five custom/HA provider cycles, rapid themes/labels, four fresh-card recreations and removal/reattachment of the same elements: one canvas and one marker DOM node per card; two shared renderer workers in the fixture page.
- Actual CSP-blocked workers and forced WebGL context loss, absent-WebGL simulation and unavailable map-service fixture: raster/compatibility paths preserve markers. Restoration and recreation return to vector maps.
- Authentication-error burst across both cards triggers one shared refresh; pending theme/label changes settle on the latest selection.
- CARTO marker-update baseline compared using intercepted synthetic tiles; HA movement leaves its vector instances intact. Phone-sized 390×844 browser layout, pan/recenter, resize and zoom controls pass.
- Normal and beta builds, JavaScript syntax, `git diff --check`, and dependency audit pass. Dependency license notices are embedded in both artifacts.

## Remaining live checks

- Physical phone/WebView behavior, background/resume and a live session spanning token rotation. Timer/reconnect behavior has fixture coverage; that is not a completed live soak.
- Newer HA header-token behavior has fixture coverage, not live coverage on another HA version.
- Normal driving/GPS jitter has not been tested in a moving vehicle.

MapLibre 6.4.1 is used instead of the planned 5.24.0 because the latter is affected by GHSA-jrc7-96c5-q579. Adapter 0.1.4 is retained. The implementation remains beta, with production replacement, public release and catalog submission deferred.
