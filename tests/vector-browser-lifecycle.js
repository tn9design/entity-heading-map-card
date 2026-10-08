async page => {
  const wait = async()=>page.waitForFunction(()=>fixture.cards.every(c=>c._haBackground?.glMap?.isStyleLoaded()));
  for(let i=0;i<5;i++) {
    await page.evaluate(()=>{fixture.configs.forEach(c=>{c.map_provider='custom';c.tile_url='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=';});fixture.cards.forEach((c,i)=>c.setConfig(fixture.configs[i]));});
    await page.waitForFunction(()=>fixture.cards.every(c=>!c._haBackground && c.shadowRoot.querySelectorAll('canvas').length===0));
    await page.evaluate(()=>{fixture.configs.forEach(c=>c.map_provider='home_assistant');fixture.cards.forEach((c,i)=>c.setConfig(fixture.configs[i]));});
    await wait();
  }
  await page.evaluate(()=>{for(let i=0;i<8;i++)fixture.theme();fixture.configs.forEach(c=>c.show_map_labels=false);fixture.cards.forEach((c,i)=>c.setConfig(fixture.configs[i]));});await wait();
  await page.waitForFunction(()=>fixture.cards.every(c=>c._haBackground.glMap.getStyle().layers.filter(l=>l.type==='symbol'&&l.layout?.['text-field']!==undefined).every(l=>l.paint?.['text-opacity']===0)));
  const labels=await page.evaluate(()=>fixture.cards.every(c=>c._haBackground.glMap.getStyle().layers.filter(l=>l.type==='symbol'&&l.layout?.['text-field']!==undefined).every(l=>l.paint['text-opacity']===0)));
  if(!labels)throw Error('Labels not hidden');
  for(let i=0;i<4;i++){await page.evaluate(()=>fixture.recreate());await wait();}
  await page.evaluate(()=>{const cards=[...fixture.cards];cards.forEach(c=>c.remove());cards.forEach(c=>document.querySelector('#cards').append(c));});await wait();
  const state=await page.evaluate(()=>fixture.cards.map(c=>({canvas:c.shadowRoot.querySelectorAll('canvas').length,markers:c._markers.size,markerNodes:c.shadowRoot.querySelector('#marker-layer').children.length,mode:c._haBackground.mode})));
  if(state.some(c=>c.canvas!==1||c.markers!==1||c.markerNodes!==1||c.mode!=='vector'))throw Error('Lifecycle leak');
  await page.evaluate(results=>window.lifecycleResults=results,{switches:5,recreations:4,labelsHidden:labels,state,workers:page.workers().length});
}
