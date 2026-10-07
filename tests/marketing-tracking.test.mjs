import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { initMarketingTracking, revokeMarketingTracking } from '../src/lib/analytics.ts';
import { saveConsent } from '../src/lib/consent.ts';
import { startMarketingScriptsLoader } from '../src/lib/marketing-loader.ts';

let cleanup = () => {};
function browser(url = 'https://notably.no/', readyState = 'complete') {
  const scripts = [];
  const timers = new Map();
  const storage = new Map();
  let timerId = 0;
  const win = new EventTarget();
  Object.assign(win, {
    location: new URL(url),
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
    setTimeout: callback => { timers.set(++timerId, callback); return timerId; },
    clearTimeout: id => timers.delete(id),
  });
  const parent = { insertBefore: script => scripts.push(script) };
  const doc = {
    readyState,
    cookie: '',
    head: { appendChild: script => scripts.push(script) },
    createElement: () => ({}),
    getElementById: id => scripts.find(script => script.id === id),
    getElementsByTagName: () => [{ parentNode: parent }],
  };
  globalThis.window = win;
  globalThis.document = doc;
  revokeMarketingTracking();
  return {
    scripts, timers, storage, win,
    advance: () => { const jobs = [...timers.values()]; timers.clear(); jobs.forEach(fn => fn()); },
  };
}

afterEach(() => {
  cleanup(); cleanup = () => {};
  revokeMarketingTracking();
  delete globalThis.window;
  delete globalThis.document;
});

test('no saved consent or denied consent never injects tracking scripts', () => {
  const env = browser();
  initMarketingTracking();
  saveConsent('denied');
  initMarketingTracking();
  assert.equal(env.scripts.length, 0);
});

test('withdrawal cancels the load scheduled for a returning visitor', () => {
  const env = browser();
  saveConsent('granted');
  cleanup = startMarketingScriptsLoader();
  assert.equal(env.timers.size, 1);
  saveConsent('denied');
  assert.equal(env.timers.size, 0);
  env.advance();
  assert.equal(env.scripts.length, 0);
});

test('initializer rechecks consent even if storage changes without an event', () => {
  const env = browser();
  saveConsent('granted');
  cleanup = startMarketingScriptsLoader();
  env.storage.clear();
  env.advance();
  assert.equal(env.scripts.length, 0);
});

for (const url of [
  'https://notably-clean.vercel.app/',
  'https://test.notably.no/',
  'http://localhost:5173/',
  'https://notably.no.example.com/',
  'http://notably.no/',
  'https://notably.no/admin',
  'https://www.notably.no/admin/login',
]) {
  test(`production tags stay off on ${url}`, () => {
    const env = browser(url);
    saveConsent('granted');
    initMarketingTracking();
    assert.equal(env.scripts.length, 0);
  });
}

for (const url of ['https://notably.no/', 'https://www.notably.no/advokat']) {
  test(`consented production pages initialize once on ${url}`, () => {
    const env = browser(url);
    saveConsent('granted');
    cleanup = startMarketingScriptsLoader();
    env.advance();
    initMarketingTracking();
    assert.equal(env.scripts.filter(s => s.id === 'notably-gtm-script').length, 1);
    assert.equal(env.scripts.filter(s => s.id === 'notably-ga-script').length, 1);
  });
}

test('cleanup cancels a delayed load during unmount', () => {
  const env = browser();
  saveConsent('granted');
  const stop = startMarketingScriptsLoader();
  stop(); env.advance();
  assert.equal(env.scripts.length, 0);
});

test('cleanup also removes a pending page load listener', () => {
  const env = browser('https://notably.no/', 'loading');
  saveConsent('granted');
  const stop = startMarketingScriptsLoader();
  stop(); env.win.dispatchEvent(new Event('load')); env.advance();
  assert.equal(env.scripts.length, 0);
});

test('blocked consent storage fails closed', () => {
  const env = browser();
  env.win.localStorage.getItem = () => { throw new Error('blocked'); };
  cleanup = startMarketingScriptsLoader();
  saveConsent('granted');
  env.advance();
  assert.equal(env.scripts.length, 0);
});
