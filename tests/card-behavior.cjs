const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const definitions=new Map();
const context={URL,HTMLElement:class{},customElements:{get:n=>definitions.get(n),define:(n,c)=>definitions.set(n,c)},window:{customCards:[]},console};vm.createContext(context);
vm.runInContext(fs.readFileSync('src/entity-heading-map-card.js','utf8').replace(/^import .*?;\n/, '').replaceAll('__CARD_TAG__', 'entity-heading-map-card')+'\nthis.testApi={withCartoApiKey,isCartoTileUrl,EntityHeadingMapCard,EntityHeadingMapCardEditor,normalizeCardConfig};',context);
const {withCartoApiKey,isCartoTileUrl,EntityHeadingMapCard}=context.testApi;
const template='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
assert.equal(withCartoApiKey(template,' a&b '),template+'?key=a%26b');
assert.equal(withCartoApiKey(template+'?key=old','new'),template+'?key=new');
assert.equal(withCartoApiKey(template,' '),template);
assert.equal(withCartoApiKey('https://example.org/{z}/{x}/{y}.png','private'),'https://example.org/{z}/{x}/{y}.png');
assert.equal(isCartoTileUrl('https://basemaps.cartocdn.com.evil.test/a'),false);
let options,url,prefix;context.window.L={tileLayer:(u,o)=>{url=u;options=o;return{addTo:()=>({options:o,_url:u})};}};
const card=Object.create(EntityHeadingMapCard.prototype);card._map={attributionControl:{setPrefix:p=>prefix=p}};card._leafletReady=true;card._config={tile_style:'default',carto_api_key:'example',tile_attribution:'old',tile_subdomains:'abcd'};card._hass={themes:{darkMode:false}};card._syncTileLayer();
assert.equal(options.maxNativeZoom,18);assert.equal(options.maxZoom,20);assert.equal(prefix,false);assert.match(options.attribution,/OpenStreetMap/);assert.match(url,/key=example/);
card._tileLayer=null;card._config={tile_style:'custom',tile_url:'https://example.org/{z}/{x}/{y}.png',carto_api_key:'private',tile_attribution:'Other',tile_subdomains:'a'};card._syncTileLayer();assert.equal(options.maxNativeZoom,20);assert.equal(options.attribution,'Other');assert.ok(!url.includes('private'));
console.log('Passed: key encoding/replacement, no-key compatibility, provider isolation, CARTO native zoom cap, custom provider preservation, compact attribution prefix.');

const normalize=context.testApi.normalizeCardConfig;
for(const [value,expected] of [[undefined,100],[0,0],[50,50],[100,100],[-5,0],[110,100]]) assert.equal(normalize({attribution_opacity:value}).attribution_opacity,expected);
console.log('Passed: opacity defaults, endpoints, midpoint and bounds.');

const editor=Object.create(context.testApi.EntityHeadingMapCardEditor.prototype);
const slider={value:100,matches:()=>true};editor.shadowRoot={activeElement:slider};
editor._setControlValue(slider,25,true);assert.equal(slider.value,25);
editor._setControlValue(slider,35);assert.equal(slider.value,25);
editor._setControlValue(slider,0,true);assert.equal(slider.value,0);
console.log('Passed: focused slider value updates, zero value, other focused controls preserved.');
card._config=normalize({marker_type:'image',marker_image:'/local/day.png',marker_image_night:'/local/night.png',marker_image_mode:'auto'});
card._hass={states:{'sun.sun':{state:'above_horizon'}}};assert.equal(card._getMarkerImageUrl(),'/local/day.png');
card._hass.states['sun.sun'].state='below_horizon';assert.equal(card._getMarkerImageUrl(),'/local/night.png');
card._config.marker_image_mode='day';assert.equal(card._getMarkerImageUrl(),'/local/day.png');
card._config.marker_image='javascript:alert(1)';assert.equal(card._getMarkerImageUrl(),'');
card._config.marker_image='/local/a".png';assert.match(card._getMarkerMarkup('arrow'),/&quot;/);
assert.equal(normalize({marker_image_size:999}).marker_image_size,160);
card._config.marker_type='arrow';assert.equal(card._getMarkerImageUrl(),'');assert.match(card._getMarkerMarkup('arrow'),/arrow-shape/);
console.log('Passed: day/night selection, URL validation/escaping, size bounds, arrow fallback.');
card._config.marker_type='image';assert.match(card._getMarkerMarkup('arrow',true),/headlight-beams/);
assert.ok(!card._getMarkerMarkup('arrow').includes('headlight-beams'));
console.log('Passed: headlight markup on and off states.');

card._config={show_headlights:true,gear_entity:'sensor.gear'};card._hass={states:{'sun.sun':{state:'below_horizon'},'sensor.gear':{state:'P'}}};
card._getConfiguredSpeedData=()=>({speed:10});assert.equal(card._shouldShowHeadlights(),false);
for(const gear of ['D','R','N','drive','reverse']){card._hass.states['sensor.gear'].state=gear;card._getConfiguredSpeedData=()=>({speed:0});assert.equal(card._shouldShowHeadlights(),true);}
card._hass.states['sensor.gear'].state='unavailable';assert.equal(card._shouldShowHeadlights(),false);
card._getConfiguredSpeedData=()=>({speed:1});assert.equal(card._shouldShowHeadlights(),true);
delete card._hass.states['sensor.gear'];assert.equal(card._shouldShowHeadlights(),true);
card._hass.states['sun.sun'].state='above_horizon';assert.equal(card._shouldShowHeadlights(),false);
card._hass.states['sun.sun'].state='unavailable';assert.equal(card._shouldShowHeadlights(),false);
card._config.show_headlights=false;assert.equal(card._shouldShowHeadlights(),false);
console.log('Passed: Park priority, D/R/N at zero speed, unknown/missing gear speed fallback, daylight and unknown sun disabled.');

assert.equal(normalize({}).map_provider,'carto');
assert.equal(normalize({tile_style:'custom',tile_url:'https://example.org/tiles'}).map_provider,'custom');
assert.equal(normalize({map_provider:'home_assistant'}).map_provider,'home_assistant');
assert.equal(EntityHeadingMapCard.getStubConfig().map_provider,'home_assistant');
console.log('Passed: legacy provider preservation and HA default for new cards.');

card._config=normalize({tile_style:'default',tile_url:'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'});
assert.equal(card._config.tile_style,'voyager');
assert.match(card._getResolvedTileUrl(),/voyager/);
console.log('Passed: legacy explicit Voyager URL keeps its background.');

assert.equal(normalize({tile_style:'default',tile_url:'https://example.org/{z}/{x}/{y}.png'}).map_provider,'carto');
assert.equal(normalize({tile_url:'https://example.org/{z}/{x}/{y}.png'}).map_provider,'custom');
console.log('Passed: inactive legacy custom URLs do not change provider.');

delete card._getConfiguredSpeedData;
// Header speed must use the same selected speed sensor as map overlays.
card._config={speed_entity:'sensor.vehicle_speed',subtitle_entity:'device_tracker.vehicle',subtitle_mode:'speed_or_parked'};
card._hass={states:{'sensor.vehicle_speed':{state:'24',attributes:{unit_of_measurement:'mph'}},'device_tracker.vehicle':{state:'home',attributes:{}}}};
const speedPoint={entityState:card._hass.states['device_tracker.vehicle']};
assert.equal(card._getSubtitle([speedPoint]),'24 mph');
card._config.subtitle_fallback='Custom stopped text';
card._hass.states['sensor.vehicle_speed'].state='0';
assert.equal(card._getSubtitle([speedPoint]),'Parked');
console.log('Passed: Speed Or Parked shares the configured speed sensor and handles zero speed.');

assert.equal(normalize({max_width:480}).max_width,480);
for (const width of [1,100,279,280]) assert.equal(normalize({max_width:width}).max_width,280);
assert.equal(normalize({max_width:0}).max_width,0);
assert.equal(normalize({max_width:-5}).max_width,0);
assert.equal(normalize({header_icon_color:'#ffffff',header_icon_background:'#2255aa'}).header_icon_background,'#2255aa');
assert.equal(normalize({header_icon_color:'url(example)'}).header_icon_color,'');
const visibilityEditor=Object.create(context.testApi.EntityHeadingMapCardEditor.prototype);
visibilityEditor._rendered=true; visibilityEditor._refs={};
for(const key of ['subtitle','subtitleEntity','subtitleLabel','subtitleSuffix','subtitleFallback']) visibilityEditor._refs[key]={style:{}};
visibilityEditor._config={subtitle_mode:'speed_or_parked'}; visibilityEditor._syncSubtitleEditorState();
assert.equal(visibilityEditor._refs.subtitleEntity.hidden,true);
assert.equal(visibilityEditor._refs.subtitleSuffix.hidden,true);
assert.equal(visibilityEditor._refs.subtitleFallback.hidden,true);
visibilityEditor._config.subtitle_mode='custom_entity'; visibilityEditor._syncSubtitleEditorState();
assert.equal(visibilityEditor._refs.subtitleEntity.hidden,false);
console.log('Passed: width bounds, safe independent header colors and subtitle control visibility.');

const speedCard=Object.create(EntityHeadingMapCard.prototype);
const speedNodes={};
for(const id of ['speedometer','speedometer-value','speedometer-unit']) speedNodes[id]={classList:{remove(){},toggle(){}},style:{setProperty(){}}};
speedCard.shadowRoot={getElementById:id=>speedNodes[id]};
speedCard._isEditorPreviewCard=()=>false; speedCard._updateGaugeSegments=()=>{};
speedCard._config={show_speedometer:true,speedometer_style:'gauge',speed_entity:'sensor.speed',gear_entity:'sensor.gear'};
speedCard._hass={states:{'sensor.speed':{state:'5',attributes:{unit_of_measurement:'mph'}},'sensor.gear':{state:'P'}}};
const testPoint={entityState:{state:'parked'}};
speedCard._updateSpeedometer([testPoint]);
assert.equal(speedNodes['speedometer-value'].textContent,'P');
assert.equal(speedNodes['speedometer-unit'].textContent,'');
assert.equal(speedNodes.speedometer.hidden,false);
speedCard._hass.states['sensor.gear'].state='R'; speedCard._updateSpeedometer([testPoint]);
assert.equal(speedNodes['speedometer-value'].textContent,'5');
speedCard._hass.states['sensor.gear'].state='unavailable';speedCard._hass.states['sensor.speed'].state='0';speedCard._updateSpeedometer([testPoint]);
assert.equal(speedNodes['speedometer-value'].textContent,'0');
console.log('Passed: explicit Park displays P without units, Reverse retains speed, unknown gear retains zero.');

// Reselecting the same vehicle must not replace manually chosen source entities.
editor._config={device_id:'car',speed_entity:'sensor.manual_speed',gear_entity:'sensor.manual_gear'};
editor._commitConfig=()=>{throw Error('Same-device selection changed config');};
editor._handleDeviceSelection('car');
assert.equal(editor._config.speed_entity,'sensor.manual_speed');
assert.equal(editor._config.gear_entity,'sensor.manual_gear');
assert.equal(normalize({map_provider:'satellite'}).map_provider,'satellite');
card._config=normalize({map_provider:'satellite',maptiler_api_key:'a&b',carto_api_key:'private'});
card._tileLayer=null;card._syncTileLayer();
assert.equal(url,'https://api.maptiler.com/maps/satellite/256/{z}/{x}/{y}.jpg?key=a%26b');
assert.ok(!url.includes('private'));
assert.match(options.attribution,/MapTiler/);
assert.match(options.attribution,/logo.svg/);
assert.equal(options.crossOrigin,true);
assert.equal(options.maxNativeZoom,18);
let removed=false;card._tileLayer={remove:()=>{removed=true;}};
card._config.maptiler_api_key='';card._syncTileLayer();
assert.equal(removed,true);assert.equal(card._tileLayer,null);
console.log('Passed: manual source preservation, satellite provider isolation, encoded key, attribution and missing-key handling.');
