async page => {
  await page.reload();
  const wait=()=>page.waitForFunction(()=>window.fixture?.cards.every(c=>c._haBackground?.glMap?.isStyleLoaded()));
  await wait();
  const before=await page.evaluate(()=>fixture.tokenRequests);
  await page.evaluate(()=>fixture.cards.forEach(c=>{for(let i=0;i<10;i++)c._haBackground.glMap.fire('error',{error:{status:401}});}));
  await page.waitForFunction(n=>fixture.tokenRequests>n,before);await wait();
  const refreshed=await page.evaluate(n=>fixture.tokenRequests===n+1,before);
  await page.route('**/static/map/*.json',async route=>{const response=await route.fetch();await new Promise(r=>setTimeout(r,250));await route.fulfill({response});});
  await page.evaluate(()=>{fixture.recreate();setTimeout(()=>{fixture.configs.forEach(c=>{c.map_theme='dark';c.show_map_labels=false;});fixture.cards.forEach((c,i)=>c.setConfig(fixture.configs[i]));},100);});
  await wait();
  await page.waitForFunction(()=>fixture.cards.every(c=>c._haBackground.glMap.getStyle().layers.filter(l=>l.type==='symbol'&&l.layout?.['text-field']!==undefined).every(l=>l.paint?.['text-opacity']===0)));
  const pendingChanges=await page.evaluate(async()=>{const expected=await (await fetch('/static/map/dark.json')).json();return fixture.cards.every(c=>JSON.stringify(c._haBackground.glMap.getStyle().layers[0].paint)===JSON.stringify(expected.layers[0].paint));});
  await page.unroute('**/static/map/*.json');
  if(!refreshed||!pendingChanges)throw Error('Recovery or stale style regression');
  await page.evaluate(r=>window.recoveryResults=r,{oneRefreshForAuthBurst:refreshed,pendingThemeLabels:pendingChanges});
}
