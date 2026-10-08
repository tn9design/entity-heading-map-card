async page => {
  await page.waitForFunction(()=>fixture.cards.every(c=>c._haBackground?.glMap?.isStyleLoaded()));
  const result = await page.evaluate(async()=>{
    const failures=[],check=(condition,label)=>{if(!condition)failures.push(label);};
    const frames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    const gl=fixture.cards.map(c=>c._haBackground.glMap);
    for(const heading of [0,45,90,180,270,359,0]) {
      fixture.hass.states['sensor.car0'].attributes.heading=heading;fixture.cards[0].hass=fixture.hass;await frames();
      const c=fixture.cards[0],marker=[...c._markers.values()][0],point=[...c._markerPoints.values()][0],expected=c._map.latLngToContainerPoint([point.latitude,point.longitude]);
      check(marker.style.getPropertyValue('--heading')===`${heading}deg`,'heading '+heading);
      check(Math.abs(parseFloat(marker.style.left)-expected.x)<.1 && Math.abs(parseFloat(marker.style.top)-expected.y)<.1,'alignment '+heading);
      check(c._haBackground.glMap===gl[0],'heading recreated background');
    }
    for(const speed of [0,2])for(const gear of ['P','D','R','unknown']) {
      fixture.hass.states['sensor.speed'].state=String(speed);fixture.hass.states['sensor.gear'].state=gear;fixture.cards.forEach(c=>c.hass=fixture.hass);
      const expected=gear==='P'?false:['D','R'].includes(gear)?true:speed>0;
      check(fixture.cards.every(c=>Boolean(c.shadowRoot.querySelector('.headlight-beams'))===expected),'lights '+gear+'/'+speed);
    }
    fixture.hass.states['sun.sun'].state='above_horizon';fixture.cards.forEach(c=>c.hass=fixture.hass);
    check(fixture.cards.every(c=>!c.shadowRoot.querySelector('.headlight-beams')),'daylights');
    check(fixture.cards.every(c=>c.shadowRoot.querySelector('.car-marker-image').src.includes('-day.png')),'day images');
    fixture.hass.states['sun.sun'].state='below_horizon';fixture.hass.states['sensor.gear'].state='D';fixture.cards.forEach(c=>c.hass=fixture.hass);
    check(fixture.cards.every(c=>c.shadowRoot.querySelector('.car-marker-image').src.includes('-night.png')),'night images');
    fixture.move();await frames();check(fixture.cards.every((c,i)=>c._haBackground.glMap===gl[i]),'movement recreated vector');
    const c=fixture.cards[0],marker=[...c._markers.values()][0];
    for(const zoom of [12,18,19.5,20]) {
      c._map.setZoom(zoom,{animate:false});await frames();
      check(marker.style.getPropertyValue('--marker-size')==='80px','fixed image size '+zoom);
      const p=[...c._markerPoints.values()][0],v=c._haBackground.glMap.project([p.longitude,p.latitude]),canvas=c._haBackground.glMap.getCanvas().getBoundingClientRect(),root=c.shadowRoot.querySelector('#map').getBoundingClientRect(),point=c._map.latLngToContainerPoint([p.latitude,p.longitude]);
      check(Math.abs(canvas.left+v.x-root.left-point.x)<1&&Math.abs(canvas.top+v.y-root.top-point.y)<1,'vector/marker projection '+zoom);
    }
    fixture.hass.states['sensor.car0'].attributes.heading=null;c.hass=fixture.hass;check(marker.style.getPropertyValue('--heading')==='0deg','missing heading');
    fixture.hass.states['sensor.car0'].attributes.heading=100;c.hass=fixture.hass;
    const durations=[];for(let i=0;i<120;i++){const start=performance.now();fixture.turn();durations.push(performance.now()-start);}
    durations.sort((a,b)=>a-b);
    return {failures,headingUpdates:7,lightingCases:8,markerUpdateP95:durations[Math.floor(durations.length*.95)]};
  });
  await page.evaluate(r=>window.browserResults=r,result);
  if(result.failures.length)throw Error(JSON.stringify(result.failures));
}
