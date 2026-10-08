import assert from 'node:assert/strict';
import { acquireMapSession, mapRequest, prepareMapStyle } from '../src/ha-map-provider.js';
const timers = new Set();
const clock = { setInterval(fn, delay) { assert.equal(delay,20*60*1000); timers.add(fn); return fn; }, clearInterval(fn) { timers.delete(fn); } };
function fixture(header = false) {
  let count = 0, nextToken = 'fixture-token-1';
  const events = new Map(), requests = [];
  const connection = { options: { auth: { data: { hassUrl: 'http://fixture.test' } } },
    async sendMessagePromise(message) { assert.equal(message.type,'map_tiles/access_token'); count++; return { token: nextToken }; },
    addEventListener(name, cb) { events.set(name, cb); }, removeEventListener(name, cb) { if (events.get(name) === cb) events.delete(name); } };
  const fetcher = async (url, options) => {
    requests.push({url,options});
    const ok = header || url.includes('?token=');
    return { ok, status: ok ? 200 : 403, async json() { return { attribution: 'OSM', maxzoom: 14 }; } };
  };
  return { hass: {connection}, fetcher, events, requests, count:()=>count, rotate:()=> { nextToken='fixture-token-2'; } };
}
for (const header of [true,false]) {
  const f = fixture(header), a = acquireMapSession(f.hass,f.fetcher,clock), b = acquireMapSession(f.hass,f.fetcher,clock);
  assert.equal(a.session,b.session);
  await Promise.all([a.session.refresh(), b.session.refresh()]);
  assert.equal(f.count(),1); assert.equal(timers.size,1);
  assert.equal(a.session.transport,header?'header':'query');
  const request = mapRequest('/api/map_tiles/vector/{z}/{x}/{y}.mvt',a.session);
  assert.equal(Boolean(request.headers),header);
  for(const url of ['https://other.test/api/map_tiles/vector/0/0/0.mvt','http://fixture.test/not-map']) {
    assert.equal(mapRequest(url,a.session).headers,undefined); assert.ok(!mapRequest(url,a.session).url.includes('fixture-token'));
  }
  f.rotate(); await [...timers][0](); assert.equal(a.session.token,'fixture-token-2');
  const count=f.count(); f.events.get('ready')(); await a.session.pending; assert.equal(f.count(),count+1);
  a.release(); assert.equal(timers.size,1); b.release(); assert.equal(timers.size,0); assert.equal(f.events.size,0); b.release();
}
const unavailable = fixture(); unavailable.hass.connection.sendMessagePromise=async()=> {throw Error('private detail');};
const handle=acquireMapSession(unavailable.hass,unavailable.fetcher,clock);await assert.rejects(handle.session.refresh());handle.release();assert.equal(timers.size,0);
const original={sources:{osm:{url:'/api/map_tiles/tilejson.json'}},glyphs:'/api/map_tiles/fonts/{fontstack}/{range}.pbf',sprite:[{id:'basics',url:'/api/map_tiles/sprites/basics/sprites'}],layers:[{id:'text',type:'symbol',layout:{'text-field':['get','name'],'icon-image':'town'}},{id:'road',type:'line'}]};
const style=prepareMapStyle(original,'http://fixture.test',false);
assert.equal(style.layers[0].paint['text-opacity'],0); assert.equal(style.layers[0].layout['icon-image'],'town'); assert.equal(original.layers[0].paint,undefined);
assert.ok(style.glyphs.includes('{fontstack}'));assert.equal(style.sources.osm.url,'http://fixture.test/api/map_tiles/tilejson.json');assert.ok(style.sprite[0].url.startsWith('http://fixture.test/'));
console.log('Passed: shared sessions, header/query compatibility, rotation, deduplication, release, token isolation, missing API and style labels/URLs.');
