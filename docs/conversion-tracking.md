# Landing conversion tracking

Updated 2026-10-09. App integration and release are owned separately by Slawomir. The purpose-separated landing matches the deployed v2 contract in [the app handoff](consent-v2-handoff.md); the actual landing client passed the production API checks described below. Landing publication still requires an approving PR review, followed by browser acceptance on the published site.

## What this repository sends

| Signal | Destination | Meaning |
| --- | --- | --- |
| `start_trial_click` | GA4 `G-NJRML2BKQP` | A consented activation of a link to the app's sign-up page |
| Native click `conversion` | Google Ads secondary website action `7609535917` | A consented signup-link activation, counted One per ad click |
| `StartTrialClick` | Meta dataset `1783628368949768` | The same CTA activation |
| `StartTrial` / Google trial action `7826807919` | App worker only | Stripe-confirmed self-service trial; never emitted by this repository |

CTA parameters are bounded `button_id` and public `page_path`. A fresh event UUID is shared between the permitted click destinations (Google Ads uses it as transaction_id). GA4 requires analytics permission; native Google Ads and Meta require advertising permission. GA4 counts activations, while the Ads action retains One-per-ad-click counting. The code does not read button text, form fields, email, meeting data, money, or arbitrary query values into event parameters. The consented SDKs still receive their normal technical/browser identifiers and permitted campaign URL data. Clicks measure activations, not unique people or completed subscriptions. Repeated deliberate clicks are separate activations.

A delegated handler covers desktop/mobile navigation, heroes, pricing, industry landing pages, footer and dynamically rendered article links. It recognizes only HTTPS `app.notably.no/{no|en}/sign-up`, supports ordinary, keyboard and middle-button activation, and ignores synthetic or prevented events. Clicking never waits for tracking and the signup journey works without consent.

## Consent and attribution

The API is `https://api.notably.no`. Every request uses `credentials: include`. The API owns its Secure/HttpOnly/host-only `__Host-notably_consent` cookie. The website never reads this capability or moves it into a URL.

- GET `/v1/consent` supplies current revision, CSRF token and permissions.
- POST `/v1/consent` uses `X-Notably-Consent-CSRF`, fresh UUID, actual revision and policy `trial-2026-10-08-v2` plus explicit `permissions.analytics`/`permissions.advertising` for grants. Purpose-only withdrawal uses `purposes`; see the handoff for exact payloads.
- Identical network retries reuse the UUID/payload. A conflicting grant is not replayed over a newer decision. Denials may be safely rebased.
- Only current server-confirmed v2 purpose grants with the known policy, valid expiry and matching provider permissions enable the corresponding optional SDKs. Legacy v1 grants cannot authorize either purpose; reject-all remains supported. Google ad personalization remains denied.
- Legacy local grants are discarded. Legacy denials are synchronized. Unsent rejection/withdrawal is persisted locally, with an essential cookie fallback, and immediately suppresses capture and tags. Loaded SDKs are revoked; Google is also explicitly disabled; the page reloads to unload SDKs once denial is durable. The API is rechecked on route entry, focus, online, visibility and each visible minute. This is periodic reconciliation, not instant cross-domain push notification.

After advertising consent, allowlisted genuine URL click IDs (`gclid`, `gbraid`, `wbraid`, `fbclid`), UTM fields and valid existing `_fbc`/`_fbp` values can be sent to POST `/v1/consent/attribution`. Source URLs have no query or fragment. No raw ad IDs are persisted to localStorage/cookies by the landing code. Provider SDKs may set their own consented cookies. URL IDs and UTM fields are additionally forwarded explicitly to signup; sales `ref` remains independent of marketing consent.

Direct API capture is limited to the source paths confirmed in production: `/`, `/advokat`, `/regnskapsforer`, `/bygg-og-anlegg` on apex and www. On other public pages, valid consented URL parameters are forwarded to signup but are not submitted to the API with an unapproved source URL. Adding a new advertising landing path requires coordinating its exact source URL with the API owner and updating `ACQUISITION_PATHS`.

With advertising consent, valid campaign parameters remain on public landing URLs so the consented SDKs can attribute CTA clicks; they are not stripped before SDK initialization. For analytics-only consent the landing first removes query parameters from the browser URL to prevent automatic GA measurement from reading advertising IDs. Sales referral is already preserved on signup links; excluded ad IDs are not retained for a later grant. The app separately handles its URL cleanup. Unknown query strings, invalid/repeated campaign parameters and private/nonproduction routes block new SDK initialization. Campaign values are validated against the deployed API's bounded format. Never manufacture clicks or use invented ad IDs in production.

## One SDK owner

The landing loads GA4 under analytics consent and native Google Ads, Meta and the existing TikTok pixel under advertising consent, directly from `analytics.ts`. One Google library services only the explicitly permitted configurations/events. Google Ads action `7609535917` was reused and renamed `Start gratis - klikk på landingssiden`; Secondary / One / no value were read back in Chrome. The destination is `AW-17626822366/I0M7CK2bwawcEN7tj9VB`. It no longer also loads GTM. GTM live version 8's remaining Meta PageView would duplicate the directly owned pixel. Conversion attribution instead uses the shared API and explicit signup parameters; it does not depend on `_gl` or the GTM Conversion Linker. The app's GTM configuration is unchanged.

GA4 owns the initial pageview and its configured enhanced history measurement. Do not add manual pageviews while enhanced history measurement is enabled. Do not recreate trial-start tags based on clicks, registration or dashboard visits.

## Verification and platform acceptance

Run `npm run test:tracking` with Node 24 and `npx vite build`. Tests use injected HTTP fixtures and jsdom without resource loading: synthetic identifiers never reach production. Browser visual checks cover the privacy dialog and mobile layout; local/preview hosts cannot contact the production consent API or load production SDKs. `npm run build` additionally runs existing sitemap/indexing hooks, so use the direct Vite command for a local verification build.

On 2026-10-09: 48 tracking tests and the Vite production build passed. The five added regressions cover an immediately saved grant 60 ms ahead of the browser, the inclusive 1,000 ms decision-time limit, rejection beyond that limit, and strict expiry/withdrawal. Targeted lint of the changed consent client/UI passed; earlier client/loader/policy/CTA lint also passed. The unchanged TikTok vendor snippet in analytics.ts has five previously recorded lint findings (any/arguments). Repository-wide TypeScript checking previously reported seven errors in untouched AuthContext, ArticleList, ArticleManagement and BlogListing; no tracking-file errors.

The actual landing consent client also passed 30 checks over 43 HTTP requests against the production v2 API, using a fresh process-local anonymous cookie jar. These covered credentialed origin/preflight responses, all four choices and provider mappings, shared app-origin reads, both partial withdrawals and retained expiry, identical retries, stale-grant rejection, and empty attribution eligibility on the four approved acquisition paths. Cleanup withdrew both purposes. No ad identifiers, browser SDKs, checkout, trial or provider conversions were used. This verifies HTTP/client interoperability, not actual browser cross-origin cookie behavior or provider receipt.

Chrome desktop/mobile checks used the real consent component/client with an isolated API fixture that returns grant timestamps 60 ms ahead. Immediate saving/reopening, all four choices and an offline advertising withdrawal followed by successful retry passed. The pending message correctly refers to declined purposes; the retained analytics choice survives synchronization. Live browser/SDK acceptance remains a separate post-publication check.

## Consent presentation and release coordination

The banner has equal-sized, equal-colour `Avvis alle` / `Aksepter alle` buttons plus `Tilpass valg`. Accept-all is one click. Customize contains independent analytics and advertising choices, initially off; reopening reflects server-confirmed choices. Desktop/mobile UI and keyboard focus were checked against an offline fixture. An increase in opt-in rate is not measured or promised.

Datatilsynet's guidance covers [separate purposes](https://www.datatilsynet.no/personvern-pa-ulike-omrader/internett-og-apper/bruk-av-informasjonskapsler-og-andre-sporingsteknologier/4.-la-brukeren-velge-hvilke-formal-de-vil-samtykke-til-eller-ikke) and [active consent](https://www.datatilsynet.no/personvern-pa-ulike-omrader/internett-og-apper/bruk-av-informasjonskapsler-og-andre-sporingsteknologier/5.-ikke-bruk-forhandsavkryssede-bokser-eller-aksept-ved-passivitet).

**Before production release:** obtain the required approving review of the updated landing head. The app owner's [production release evidence](https://github.com/arti-consult/notably-app-v2/pull/554#issuecomment-6066458938) confirms the v2 rollout, and the landing owner independently verified the current API as described above. No further app implementation is requested by this correction. This code deliberately keeps optional SDKs off against old combined grants. The app's existing live sender switches are not changed by this PR.

The repository requires one approving review. Do not merge this prepared integration until API acceptance and review are complete; no administrative bypass is part of this release.

After deployment, check server-confirmed consent in a real browser, signup links and SDK presence before/after consent and withdrawal. No synthetic production trial is needed for these checks.

The native Google Ads secondary click action is wired directly; do not also import the GA4 click as another Ads conversion. Trial action `7826807919` remains Secondary pending genuine receipt/processing evidence and deliberate campaign-goal selection. Meta `StartTrialClick` should likewise remain a reporting signal. Trial starts are the intended optimization outcome, subject to actual provider acceptance and attribution evidence. Do not sum CTA clicks and trials into one conversion count or claim that platform-attributed totals equal every Stripe trial.

A genuine eligible consented new trial still needs reconciliation across Stripe/app, provider delivery receipt and later Google/Meta attribution. The landing implementation alone cannot prove this. No keys or app sender switches are changed by this release.

## Rollback

Revert this landing PR through a new commit and redeploy using the normal Vercel flow. Coordinate with the app owner: the old landing's local-only consent is not equivalent to shared API consent. For an emergency stop of landing collection, fail closed by disabling the loader; do not re-enable old dashboard/signup trial tags or change app sender switches as a side effect. Keep the app's Stripe trial records for reconciliation.
