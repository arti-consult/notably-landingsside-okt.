import assert from 'node:assert/strict';
import { test } from 'node:test';
import { classifyReferrer, decorateSignup, readOrigin } from '../src/lib/marketing-attribution.ts';

const SIGNUP = 'https://app.notably.no/no/sign-up';

test('classifyReferrer: search / linkedin / social / ai / other / direct / internal', () => {
  const c = classifyReferrer;
  for (const r of ['https://www.google.com/', 'https://www.google.no/', 'https://google.co.uk/', 'https://www.bing.com/', 'https://duckduckgo.com/', 'https://search.brave.com/']) assert.equal(c(r), 'search', r);
  for (const r of ['https://www.linkedin.com/', 'https://lnkd.in/abc', 'https://no.linkedin.com/feed']) assert.equal(c(r), 'linkedin', r);
  for (const r of ['https://chatgpt.com/', 'https://www.perplexity.ai/']) assert.equal(c(r), 'ai', r);
  for (const r of ['https://l.facebook.com/', 'https://t.co/x', 'https://www.youtube.com/']) assert.equal(c(r), 'social', r);
  assert.equal(c('https://nettavisen.no/artikkel'), 'other');
  for (const r of ['', null, undefined, 'not a url', 'android-app://com.google.android.gm']) assert.equal(c(r), 'direct', String(r));
  for (const r of ['https://app.notably.no/no/sign-up', 'https://www.notably.no/']) assert.equal(c(r), 'internal', r);
  assert.equal(c('https://evilgoogle.com/'), 'other');
  assert.equal(c('https://google.com.evil.test/'), 'other');
});

test('readOrigin: only public landing paths; the referrer URL is never carried, only its class', () => {
  const o = readOrigin(new URL('https://www.notably.no/regnskapsforer/?x=1#h'), 'https://www.google.com/search?q=secret');
  assert.deepEqual(o, { landingPath: '/regnskapsforer', referrerClass: 'search' });
  assert.equal(readOrigin(new URL('https://www.notably.no/hemmelig'), 'https://www.google.com/'), null);
  assert.equal(readOrigin(new URL('https://evil.test/'), 'https://www.google.com/'), null);
});

test('decorateSignup: landing_path/referrer_class only with an origin; inbound copies are stripped; utm/ref keep working', () => {
  assert.equal(decorateSignup(SIGNUP, null, null), SIGNUP);
  const withOrigin = new URL(decorateSignup(`${SIGNUP}?referrer_class=search&landing_path=/x`, null, 'partner-1', { landingPath: '/', referrerClass: 'linkedin' }));
  assert.equal(withOrigin.searchParams.get('landing_path'), '/');
  assert.equal(withOrigin.searchParams.get('referrer_class'), 'linkedin');
  assert.equal(withOrigin.searchParams.get('ref'), 'partner-1');
  const spoof = new URL(decorateSignup(`${SIGNUP}?referrer_class=search&landing_path=/x`, null, null));
  assert.equal(spoof.search, '');
  const both = new URL(decorateSignup(SIGNUP, { sourceUrl: 'https://www.notably.no/', identifiers: {}, utm: { utm_source: 'linkedin', utm_medium: 'organic' } }, null, { landingPath: '/advokat', referrerClass: 'linkedin' }));
  assert.equal(both.searchParams.get('utm_source'), 'linkedin');
  assert.equal(both.searchParams.get('utm_medium'), 'organic');
  assert.equal(both.searchParams.get('landing_path'), '/advokat');
});
