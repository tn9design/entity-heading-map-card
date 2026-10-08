async page => {
  const wait=()=>page.waitForFunction(()=>fixture.cards.every(c=>c._haBackground?.glMap?.isStyleLoaded()));
  await wait();
  await page.route('**/*.basemaps.cartocdn.com/**',route=>route.fulfill({status:200,contentType:'image/png',body:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64')}));
  await page.evaluate(()=>{fixture.configs.forEach(c=>{c.map_provider='carto';c.tile_style='default';});fixture.cards.forEach((c,i)=>c.setConfig(fixture.configs[i]));});
  const baseline=await page.evaluate(()=>{const samples=[];for(let i=0;i<120;i++){const start=performance.now();fixture.turn();samples.push(performance.now()-start);}samples.sort((a,b)=>a-b);return samples[Math.floor(samples.length*.95)];});
  await page.evaluate(()=>{fixture.configs.forEach(c=>{c.map_provider='home_assistant';c.marker_type='arrow';c.show_map_labels=true;});fixture.cards.forEach((c,i)=>c.setConfig(fixture.configs[i]));});await wait();
  const arrows=await page.evaluate(()=>{fixture.hass.states['sensor.car0'].attributes.heading=359;fixture.cards[0].hass=fixture.hass;const c=fixture.cards[0],m=[...c._markers.values()][0];return Boolean(m.querySelector('.arrow-shape'))&&m.style.getPropertyValue('--heading')==='359deg';});
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>fixture.cards.forEach(c=>{c._map.invalidateSize();c._map.panBy([30,20],{animate:false});c.shadowRoot.querySelector('#recenter-button').click();}));
  await page.waitForFunction(()=>fixture.cards.every(c=>{const m=[...c._markers.values()][0],p=[...c._markerPoints.values()][0],e=c._map.latLngToContainerPoint([p.latitude,p.longitude]);return Math.abs(parseFloat(m.style.left)-e.x)<1&&Math.abs(parseFloat(m.style.top)-e.y)<1;}));
  const controls=await page.evaluate(()=>fixture.cards.every(c=>!!c.shadowRoot.querySelector('.leaflet-control-zoom-in')&&!!c.shadowRoot.querySelector('#recenter-button')));
  await page.evaluate(r=>window.controlsResults=r,{arrows,controls,cartoMarkerP95:baseline,phoneViewport:true});
  if(!arrows||!controls)throw Error('Controls/arrow regression');
  await page.setViewportSize({width:1280,height:720});
  await page.evaluate(()=>{fixture.configs.forEach(c=>c.marker_type='image');fixture.cards.forEach((c,i)=>c.setConfig(fixture.configs[i]));});
}
