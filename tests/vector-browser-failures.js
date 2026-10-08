async page => {
  const waitVector=()=>page.waitForFunction(()=>fixture.cards.every(c=>c._haBackground?.glMap?.isStyleLoaded()));
  const waitRaster=()=>page.waitForFunction(()=>fixture.cards.every(c=>c._haBackground?.mode==='raster'));
  await waitVector();
  await page.evaluate(()=>{
    window.originalContext=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl2'?null:originalContext.call(this,type,...args);};
    fixture.recreate();
  });
  await waitRaster();
  const noWebGL=await page.evaluate(()=>fixture.cards.every(c=>c._markers.size===1&&c.shadowRoot.querySelector('.leaflet-tile-pane').querySelectorAll('img').length>0));
  await page.evaluate(()=>{HTMLCanvasElement.prototype.getContext=originalContext;fixture.recreate();});await waitVector();
  const workerPage=await page.context().newPage();
  await workerPage.route('http://127.0.0.1:8768/',async route=>{const response=await route.fetch();await route.fulfill({response,headers:{...response.headers(),'Content-Security-Policy':"worker-src 'none'"}});});
  await workerPage.goto('http://127.0.0.1:8768/');
  await workerPage.waitForFunction(()=>window.fixture?.cards.every(c=>c._haBackground?.mode==='raster'),{},{timeout:30000});
  const blockedWorker=await workerPage.evaluate(()=>fixture.cards.every(c=>c._markers.size===1));
  await workerPage.close();
  await page.evaluate(()=>fixture.cards.forEach(c=>c._haBackground.glMap.getCanvas().getContext('webgl2').getExtension('WEBGL_lose_context').loseContext()));await waitRaster();
  const contextLoss=await page.evaluate(()=>fixture.cards.every(c=>c._markers.size===1&&c._providerStatus.includes('Simpler')));
  await page.evaluate(()=>fixture.recreate());await waitVector();
  await page.route('**/__map_token',route=>route.fulfill({status:503,body:'Unavailable fixture'}));
  await page.evaluate(()=>fixture.recreate());
  await page.waitForFunction(()=>fixture.cards.every(c=>c._haBackground?.mode==='unavailable'));
  const missingProxy=await page.evaluate(()=>fixture.cards.every(c=>c._markers.size===1&&c._providerStatus.includes('Requires HA')));
  await page.unroute('**/__map_token');await page.evaluate(()=>fixture.recreate());await waitVector();
  await page.evaluate(r=>window.failureResults=r,{noWebGL,blockedWorker,contextLoss,missingProxy,workers:page.workers().length});
  if(!noWebGL||!blockedWorker||!contextLoss||!missingProxy)throw Error('Fallback failure');
}
