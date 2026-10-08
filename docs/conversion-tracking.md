# Landing conversion tracking

Implemented 2026-10-08. App integration and release are owned separately by Slawomir.

## What this repository sends

| Signal | Destination | Meaning |
| --- | --- | --- |
| `start_trial_click` | GA4 `G-NJRML2BKQP` | A consented activation of a link to the app's sign-up page |
| `StartTrialClick` | Meta dataset `1783628368949768` | The same CTA activation |
| `StartTrial` / Google trial action `7826807919` | App worker only | Stripe-confirmed self-service trial; never emitted by this repository |

CTA parameters are bounded `button_id` and public `page_path`. A fresh event UUID is shared between the two click signals. The code does not read button text, form fields, email, meeting data, money, or arbitrary query values into event parameters. The consented SDKs still receive their normal technical/browser identifiers and permitted campaign URL data. Clicks measure activations, not unique people or completed subscriptions. Repeated deliberate clicks are separate activations.

A delegated handler covers desktop/mobile navigation, heroes, pricing, industry landing pages, footer and dynamically rendered article links. It recognizes only HTTPS `app.notably.no/{no|en}/sign-up`, supports ordinary, keyboard and middle-button activation, and ignores synthetic or prevented events. Clicking never waits for tracking and the signup journey works without consent.

## Consent and attribution

The API is `https://api.notably.no`. Every request uses `credentials: include`. The API owns its Secure/HttpOnly/host-only `__Host-notably_consent` cookie. The website never reads this capability or moves it into a URL.

- GET `/v1/consent` supplies current revision, CSRF token and permissions.
- POST `/v1/consent` uses `X-Notably-Consent-CSRF`, fresh UUID, actual revision and policy `trial-2026-10-08-v1` for grants.
- Identical network retries reuse the UUID/payload. A conflicting grant is not replayed over a newer decision. Denials may be safely rebased.
- Only current server-confirmed grants with the known policy, valid expiry and matching provider permissions enable optional SDKs. Google ad personalization remains denied.
- Legacy local grants are discarded. Legacy denials are synchronized. Unsent rejection/withdrawal is persisted locally, with an essential cookie fallback, and immediately suppresses capture and tags. Loaded SDKs are revoked; Google is also explicitly disabled; the page reloads to unload SDKs once denial is durable. The API is rechecked on route entry, focus, online, visibility and each visible minute. This is periodic reconciliation, not instant cross-domain push notification.

After consent, allowlisted genuine URL click IDs (`gclid`, `gbraid`, `wbraid`, `fbclid`), UTM fields and valid existing `_fbc`/`_fbp` values can be sent to POST `/v1/consent/attribution`. Source URLs have no query or fragment. No raw ad IDs are persisted to localStorage/cookies by the landing code. Provider SDKs may set their own consented cookies. URL IDs and UTM fields are additionally forwarded explicitly to signup; sales `ref` remains independent of marketing consent.

Direct API capture is limited to the source paths confirmed in production: `/`, `/advokat`, `/regnskapsforer`, `/bygg-og-anlegg` on apex and www. On other public pages, valid consented URL parameters are forwarded to signup but are not submitted to the API with an unapproved source URL. Adding a new advertising landing path requires coordinating its exact source URL with the API owner and updating `ACQUISITION_PATHS`.

Valid campaign parameters remain on public landing URLs so the consented GA and Meta browser SDKs can attribute CTA clicks; they are not stripped before SDK initialization. The app separately handles its URL cleanup. Unknown query strings, invalid/repeated campaign parameters and private/nonproduction routes block new SDK initialization. Campaign values are validated against the deployed API's bounded format. Never manufacture clicks or use invented ad IDs in production.

## One SDK owner

The landing loads GA4, Meta and the existing TikTok pixel directly from `analytics.ts`, only after consent. It no longer also loads GTM. GTM live version 8's remaining Meta PageView would duplicate the directly owned pixel. Conversion attribution instead uses the shared API and explicit signup parameters; it does not depend on `_gl` or the GTM Conversion Linker. The app's GTM configuration is unchanged.

GA4 owns the initial pageview and its configured enhanced history measurement. Do not add manual pageviews while enhanced history measurement is enabled. Do not recreate trial-start tags based on clicks, registration or dashboard visits.

## Verification and platform acceptance

Run `npm run test:tracking` with Node 24 and `npx vite build`. Tests use injected HTTP fixtures and jsdom without resource loading: synthetic identifiers never reach production. Browser visual checks cover the privacy dialog and mobile layout; local/preview hosts cannot contact the production consent API or load production SDKs. `npm run build` additionally runs existing sitemap/indexing hooks, so use the direct Vite command for a local verification build.

At implementation: 28 tracking checks and the production build passed. Targeted lint of the new consent/attribution/loader/UI modules passed. Repository-wide TypeScript checking reports seven pre-existing errors in AuthContext, ArticleList, ArticleManagement and BlogListing; no tracking-file errors.

Release status: the Vercel preview is deployed. Production publication is pending the repository’s existing requirement for one approving PR review; do not bypass this rule.

After deployment, check server-confirmed consent in a real browser, signup links and SDK presence before/after consent and withdrawal. No synthetic production trial is needed for these checks.

GA4 receiving a custom event does not automatically create a Google Ads conversion action. Expose `start_trial_click` as a secondary reporting action if required, without changing bidding goals. Meta `StartTrialClick` should likewise remain a reporting signal. Trial starts are the intended optimization outcome, subject to actual provider acceptance and attribution evidence. Do not sum CTA clicks and trials into one conversion count or claim that platform-attributed totals equal every Stripe trial.

A genuine eligible consented new trial still needs reconciliation across Stripe/app, provider delivery receipt and later Google/Meta attribution. The landing implementation alone cannot prove this. No keys or app sender switches are changed by this release.

## Rollback

Revert this landing PR through a new commit and redeploy using the normal Vercel flow. Coordinate with the app owner: the old landing's local-only consent is not equivalent to shared API consent. For an emergency stop of landing collection, fail closed by disabling the loader; do not re-enable old dashboard/signup trial tags or change app sender switches as a side effect. Keep the app's Stripe trial records for reconciliation.
