import assert from 'node:assert/strict';
import { test } from 'node:test';
import { classifyReferrer, decorateSignup, readOrigin } from '../src/lib/marketing-attribution.ts';

const SIGNUP = 'https://app.notably.no/no/sign-up';
const o = (source, medium = 'organic') => ({ source, medium });

test('classifyReferrer: search / linkedin / ai / social / referral / direct / own domain', () => {
  for (const r of ['https://www.google.com/', 'https://www.google.no/', 'https://google.co.uk/']) assert.deepEqual(classifyReferrer(r), o('google'), r);
  assert.deepEqual(classifyReferrer('https://www.bing.com/'), o('bing'));
  assert.deepEqual(classifyReferrer('https://duckduckgo.com/'), o('duckduckgo'));
  for (const r of ['https://www.linkedin.com/', 'https://lnkd.in/abc', 'https://no.linkedin.com/feed']) assert.deepEqual(classifyReferrer(r), o('linkedin'), r);
  assert.deepEqual(classifyReferrer('https://chatgpt.com/'), o('chatgpt.com'));
  assert.deepEqual(classifyReferrer('https://l.facebook.com/'), o('facebook'));
  assert.deepEqual(classifyReferrer('https://gemini.google.com/'), o('gemini'));
  assert.deepEqual(classifyReferrer('https://nettavisen.no/artikkel'), o('referral'));
  for (const r of ['', null, undefined, 'not a url', 'android-app://com.google.android.gm']) assert.deepEqual(classifyReferrer(r), o('direct', 'none'), String(r));
  for (const r of ['https://app.notably.no/no/sign-up', 'https://www.notably.no/']) assert.equal(classifyReferrer(r), null, r);
  assert.deepEqual(classifyReferrer('https://evilgoogle.com/'), o('referral'));
  assert.deepEqual(classifyReferrer('https://google.com.evil.test/'), o('referral'));
});

test('readOrigin: public pages only; explicit utm_source/click id in the URL wins; referrer URL is never carried', () => {
  assert.deepEqual(readOrigin(new URL('https://www.notably.no/regnskapsforer/'), 'https://www.google.com/search?q=secret'), o('google'));
  assert.equal(readOrigin(new URL('https://www.notably.no/regnskapsforer?utm_source=linkedin'), 'https://www.google.com/'), null);
  assert.equal(readOrigin(new URL('https://www.notably.no/?gclid=abc'), 'https://www.google.com/'), null);
  assert.equal(readOrigin(new URL('https://www.notably.no/hemmelig'), 'https://www.google.com/'), null);
  assert.equal(readOrigin(new URL('https://evil.test/'), 'https://www.google.com/'), null);
  assert.equal(readOrigin(new URL('https://www.notably.no/'), 'https://app.notably.no/'), null);
});

test('decorateSignup: standard utm_* only (the app rejects unknown sign-up params); never overrides explicit tagging', () => {
  assert.equal(decorateSignup(SIGNUP, null, null), SIGNUP);
  const g = new URL(decorateSignup(SIGNUP, null, 'partner-1', o('google')));
  assert.equal(g.searchParams.get('utm_source'), 'google');
  assert.equal(g.searchParams.get('utm_medium'), 'organic');
  assert.equal(g.searchParams.get('ref'), 'partner-1');
  assert.deepEqual([...g.searchParams.keys()].sort(), ['ref', 'utm_medium', 'utm_source']);
  const d = new URL(decorateSignup(SIGNUP, null, null, o('direct', 'none')));
  assert.equal(d.search, '?utm_source=direct&utm_medium=none');
  // explicit UTM wins over the derived origin
  const tagged = new URL(decorateSignup(SIGNUP, { sourceUrl: 'https://www.notably.no/', identifiers: {}, utm: { utm_source: 'linkedin', utm_medium: 'organic', utm_campaign: 'regnskapsforer' } }, null, o('google')));
  assert.equal(tagged.searchParams.get('utm_source'), 'linkedin');
  assert.equal(tagged.searchParams.get('utm_campaign'), 'regnskapsforer');
  // a click id means paid: no organic label next to it
  const paid = new URL(decorateSignup(SIGNUP, { sourceUrl: 'https://www.notably.no/', identifiers: { gclid: 'abc123' } }, null, o('google')));
  assert.equal(paid.searchParams.get('gclid'), 'abc123');
  assert.equal(paid.searchParams.has('utm_source'), false);
  // stale inbound copies are replaced
  assert.equal(decorateSignup(`${SIGNUP}?utm_source=stale`, null, null), SIGNUP);
  assert.equal(decorateSignup('https://app.notably.no.evil.test/no/sign-up', null, null, o('google')), 'https://app.notably.no.evil.test/no/sign-up');
});
