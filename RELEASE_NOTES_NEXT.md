# Configuration And Vehicle Display Improvements

Setting up your vehicle and customizing its appearance is easier!

## 🚗 Vehicle Settings Together

Location, heading, speed, and gear choices now sit together under Device. Separate latitude and longitude sensors are available when needed.

Related vehicle entities appear first. Each choice shows its integration, device, and entity ID beneath its name. Search narrows the choices, and speed lists exclude nonnumeric states.

Choosing a device fills detected sources. Manual choices remain intact when you reselect the same device.

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

Choose Satellite (MapTiler) in Map Style & Layout and enter your MapTiler API key. Heading markers, custom vehicle images, speed displays, and map controls remain available over satellite imagery. Provider usage limits apply; satellite imagery has been verified in Home Assistant with an origin-restricted personal key.

---

## 🎨 Next Priority: A Clearer Configuration Experience

The next planned large update will further simplify and reorganize the configuration experience. Smaller fixes may arrive first. A richer showcase card and Add Card preview remain planned for later.
