import test, { afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { startLandingEngagement } from '../src/lib/posthog-engagement.ts';

let dom, stop;
const globals=['window','document','Element','ErrorEvent','MutationObserver'];
function setup(html='<section data-ph-section="pricing"></section>') {
  dom=new JSDOM(html,{url:'https://www.notably.no/',pretendToBeVisual:true});
  for(const key of globals)globalThis[key]=key==='window'?dom.window:dom.window[key];
  let time=0, consent=true, sample;
  mock.method(performance,'now',()=>time);
  window.setInterval=fn=>{sample=fn;return 1;};
  const section=document.querySelector('section');
  section.getBoundingClientRect=()=>({top:0,bottom:600,width:800,height:600});
  const events=[];
  stop=startLandingEngagement((event,properties)=>events.push({event,properties}),()=>consent);
  return {events,section,at(t){time=t;sample();},deny(){consent=false;}};
}
afterEach(()=>{stop?.();dom?.window.close();mock.restoreAll();for(const key of globals)delete globalThis[key];});

test('section reach requires one second, attention five seconds, each once per page',()=>{
  const f=setup();f.at(999);assert.equal(f.events.length,0);f.at(1000);
  assert.deepEqual(f.events,[{event:'section_viewed',properties:{section_id:'pricing'}}]);
  f.at(5000);f.at(10000);assert.equal(f.events.length,2);assert.equal(f.events[1].event,'section_engaged');
});
test('a modal interrupts attention and a short visit does not count',()=>{
  const f=setup();f.at(800);const modal=document.createElement('div');modal.setAttribute('aria-modal','true');document.body.append(modal);
  f.at(1000);modal.remove();f.at(3000);f.at(3800);assert.equal(f.events.length,0);f.at(4000);assert.equal(f.events.length,1);
  f.at(8000);assert.equal(f.events[1].event,'section_engaged');
});
test('long mobile sections qualify based on the visible viewport, not half of their entire height',()=>{
  const f=setup();f.section.getBoundingClientRect=()=>({top:-3000,bottom:9000,width:390,height:12000});f.at(1000);assert.equal(f.events[0].event,'section_viewed');
});
test('denial, route changes and stopping prevent delayed observations',()=>{
  const f=setup();f.deny();f.at(10000);assert.equal(f.events.length,0);stop();f.at(20000);assert.equal(f.events.length,0);
});
test('synthetic clicks and input values cannot create FAQ or calculator engagement',()=>{
  const f=setup('<section id="kalkulator"><input type="range" value="9876"><button data-ph-faq="question-2" aria-expanded="false">PRIVATE</button></section>');
  document.querySelector('button').click();document.querySelector('input').dispatchEvent(new window.Event('change',{bubbles:true}));
  assert.equal(f.events.length,0);
  window.history.pushState({},'','/advokat');f.at(10000);assert.equal(f.events.length,0);
});
test('technical errors report only a fixed category and ignore third-party messages',()=>{
  const f=setup();window.dispatchEvent(new window.ErrorEvent('error',{filename:'https://third-party.test/a.js',message:'PRIVATE'}));assert.equal(f.events.length,0);
  for(let i=0;i<3;i++)window.dispatchEvent(new window.ErrorEvent('error',{filename:'https://www.notably.no/assets/index.js',message:'PRIVATE',error:new Error('PRIVATE')}));
  assert.deepEqual(f.events,[{event:'landing_error',properties:{error_category:'runtime_error'}}]);
});
