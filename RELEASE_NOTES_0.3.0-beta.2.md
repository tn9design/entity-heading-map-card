# v0.3.0-beta.2 — Maps And Vehicle Setup

Heading-aware maps without a separate map account, satellite imagery, and easier vehicle customization!

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

## 🚗 Vehicle Settings Together

Location, heading, speed, and gear choices now sit together under Device. Separate latitude and longitude sensors are available when needed.

Related vehicle entities appear first. Each choice shows its integration, device, and entity ID beneath its name. Search narrows the choices, and speed lists exclude nonnumeric states.

Choosing a device fills detected sources. Manual choices remain intact when you reselect the same device.

Menus respond more smoothly, close when you open another, and dismiss when you click outside or press Escape.

## 🖼️ Custom Images Made Easier

Day and night image pickers show thumbnails. Choose an existing HA image or use Replace Image to upload one.

Help & Advanced contains matching day/night image instructions, copyable creation prompts, and manual URLs. Image mode, size, and nighttime lighting have a clearer layout.

## 🎨 Header Colors

Set the header icon and its background independently. Automatic resets each color to the dashboard theme.

## 📐 Card Width

An optional maximum width centers the card within the available dashboard space. Custom widths have a 280 px minimum; 0 fills the available space.

## 🅿️ Clearer Park Display

An explicit Park gear shows P in the speedometer without a speed unit. Drive, Reverse, and Neutral retain the speed readout. Missing gear never infers Park from zero speed alone.

Speed Or Parked subtitles use the same speed sensor as the speedometer and display the default Parked text when stopped.

## 🛰️ Satellite Imagery

Choose Satellite (MapTiler) in Map Style & Layout and enter your MapTiler API key. Provider usage limits apply.

Keep your heading markers, custom vehicle images, speed displays, and controls over satellite imagery.

Show Map Labels switches between plain imagery and imagery with streets, roads, and place names. Attribution opacity also works with satellite maps, and provider credits stay clear of the zoom controls on narrow cards.

The README includes examples for every field when creating a MapTiler key, including local and remote Home Assistant addresses.

## 🧪 Beta Validation

Automated checks and live Home Assistant reviews covered the new editor controls and satellite maps. Longer phone background intervals and real driving validation remain outstanding.

---

## 🎨 Next Priority: A Clearer Configuration Experience

The next planned large update will focus on simplifying and reorganizing the card’s configuration options. Features have grown quickly during the beta, and the editor has become crowded. The goal is to make settings easier to find, understand, and customize. Smaller fixes may be released before that work is ready.
