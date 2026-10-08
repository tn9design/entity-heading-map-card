# v0.3.0-beta.1 — Home Assistant Maps

Heading-aware maps now work without a separate map account or API key!

## 🗺️ Maps Without A Separate API Key

New cards default to Home Assistant vector maps. Choose automatic, light, or dark themes, and show or hide map labels.

Requires Home Assistant 2026.9 or newer with the map service.

![Home Assistant vector maps with vehicle markers and nighttime lighting, using simulated locations](https://raw.githubusercontent.com/tn9design/entity-heading-map-card/main/images/release-ha-maps.png)

<sub>Example uses simulated vehicle locations.</sub>

## ⚙️ Your Existing Cards Stay As Configured

Saved CARTO and custom-map cards retain their provider, URLs, and keys.

You can switch providers without losing those settings.

## 🧭 Heading And Vehicle Features Preserved

- Heading arrows and custom day/night vehicle images.
- Nighttime headlights and rear-light effects.
- Speedometers, tooltips, and vehicle tracking.
- Zoom and recenter controls.

## 🔄 Automatic Compatibility Fallback

If vector rendering is unavailable, Home Assistant raster maps retain markers and controls. Raster styling and labels are more limited.

If the Home Assistant map service is unavailable, the card shows a compatibility message rather than silently switching providers.

## 🔧 Map Recovery Improved

Temporary tile authorization failures trigger a shared token refresh and a full map-style reload so rejected tiles can load again.

Authentication tokens remain in memory. The renderer and worker are bundled into the card.

## 🧪 Initial Beta

Automated tests and browser checks passed. A live 20-minute token refresh and an initial iPhone background/resume check passed before the final recovery fix.

The final phone recheck, longer phone background intervals, and real driving validation remain outstanding.

Default HACS catalog submission remains deferred.

---

## 🎨 Next Priority: A Clearer Configuration Experience

The next planned large update will focus on simplifying and reorganizing the card’s configuration options. Features have grown quickly during the beta, and the editor has become crowded. The goal is to make settings easier to find, understand, and customize. Smaller fixes may be released before that work is ready.
