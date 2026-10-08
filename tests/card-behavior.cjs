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
