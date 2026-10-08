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

## Follow-up live testing

- User tested the staged beta in the Home Assistant app on an iPhone: pan/zoom, recenter, approximately one minute in the background, reopen and repeat controls. User reported that all seemed fine. iOS and app versions were not recorded.
- Separate Chromium test browser was frozen for 55 seconds through CDP and resumed against the real HA map service: both original vector instances were retained, with one canvas and marker per card. This tests execution suspension, not a physical phone's OS lifecycle. The in-app browser and automated Chromium tab switches continued to report visible, so those tab switches are not counted as a real hidden/visible test.
- Live soak completed with two synthetic vehicles against the real HA map proxy. Initial token fetch: 2026-10-08 11:33:06.514 UTC; natural scheduled refresh: 11:53:06.735 UTC. The server token had changed. Fresh zoom-12 tiles subsequently loaded successfully, and the browser observed two distinct URL tokens without recording their values. Both original vector instances remained, with one canvas per card and two shared workers. The monitor recorded 24 sanitized samples. Brief tile-loading samples retained rendered features and alignment; no unexpected map-network failures occurred.
- A follow-up real HTTP-403 tile-failure fixture exposed a recovery defect: token refresh succeeded, but identical-style diffing retried no tiles and both maps had zero rendered features. The fix forces full style reload (`diff: false`) for token/reconnect/auth recovery. The regression test now verifies rejected tiles are retried and both maps regain rendered features, along with shared refresh throttling and pending style changes. The unchanged 20-minute schedule was verified before this targeted fix; a second full timed soak of the fix was not performed.

## Remaining live checks

- The iPhone background/resume check above passed by user report; a longer phone-background interval has not been tested.
- Newer HA header-token behavior has fixture coverage, not live coverage on another HA version.
- Normal driving/GPS jitter has not been tested in a moving vehicle.

MapLibre 6.4.1 is used instead of the planned 5.24.0 because the latter is affected by GHSA-jrc7-96c5-q579. Adapter 0.1.4 is retained. The implementation remains beta, with production replacement, public release and catalog submission deferred.
