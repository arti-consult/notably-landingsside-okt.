# Separate consent purposes — app handoff

Status updated 9 October 2026: the app owner has [released v2 to production](https://github.com/arti-consult/notably-app-v2/pull/554#issuecomment-6066458938), with [the exact contract documented here](https://github.com/arti-consult/notably-app-v2/blob/c3253e5e9196ce2b04cb946a3540224a74989ed3/docs/operations/consent-purpose-v2-2026-10-08.md). The landing client independently passed production API checks against that contract. PR #6 now includes the requested bounded clock-skew and partial-withdrawal copy corrections. Required rereview, landing publication and actual production browser acceptance remain. No production app changes are made by this PR.

## Scope and ownership

Keep the existing Stripe-confirmed trial implementation, credentials, stable `trial_<subscription_id>` IDs, original timestamps, idempotency, retries, environment isolation and retention. The app's production senders are already enabled by the app owner's decision; the old wait-for-landing gate is superseded. This follow-up changes consent eligibility, not the Stripe lifecycle.

Landing owner: consent presentation, browser SDK gating, attribution forwarding, CTA events, landing PR/release and ad-platform reporting. App owner: consent API/storage/history, app consent UI, checkout snapshots, worker eligibility/withdrawal and app release. An independent authorized reviewer must approve the landing PR before ordinary merge.

First layer on both surfaces: `Aksepter alle`, `Avvis alle`, `Tilpass valg`. Accept-all is one action for both purposes; no preliminary checkbox. Customize exposes `Analyse` and `Annonsemåling`, off for a new choice. Reopening displays only confirmed current choices. No default advertising grant or advertising personalization.

## Deployed wire contract

Reuse `GET/POST /v1/consent` and `POST /v1/consent/attribution`, `credentials: include`, host-only API cookie, exact-origin CORS, CSRF, revisions and idempotency. Keep both `https://notably.no` and `https://www.notably.no` allowed, plus the app origin. Existing acquisition paths and OAuth/Stripe continuity remain supported.

Version markers verified against the production API:

- `consent.contractVersion`: `"2"`
- `consent.disclosureVersion` and `consent.mappingVersion`: `"trial-2026-10-08-v2"`
- `consent.permissions`: `{ "analytics": boolean, "advertising": boolean }`
- Preserve the envelope (`status`, `enabled`, `csrfToken`) and the current revision, state and time fields.
- `state: "granted"` means at least one current purpose is granted. `unset`, `expired`, `rejected`, `withdrawn` authorize neither. Return the current v2 policy for new choices, as v1 already does.

Example of **analytics only** in a successful GET/POST response (other fields unchanged):

```json
{
  "contractVersion": "2",
  "disclosureVersion": "trial-2026-10-08-v2",
  "mappingVersion": "trial-2026-10-08-v2",
  "state": "granted",
  "permissions": { "analytics": true, "advertising": false },
  "providerPermissions": {
    "analyticsStorage": "granted",
    "adStorage": "denied",
    "adUserData": "denied",
    "adPersonalization": "denied"
  }
}
```

Explicit complete choice (POST, existing CSRF header; a fresh real UUID per logical request):

```json
{
  "requestId": "<fresh UUID>",
  "action": "grant",
  "expectedRevision": 3,
  "disclosureVersion": "trial-2026-10-08-v2",
  "permissions": { "analytics": true, "advertising": false }
}
```

Accept-all uses both `true`. Advertising-only uses `false`/`true`. No selected purposes uses existing `reject`/`withdraw`, without disclosureVersion. The server must apply false values as revocations, not simply store UI preferences.

Purpose-only withdrawal (must never grant or change the other purpose):

```json
{
  "requestId": "<fresh UUID>",
  "action": "withdraw",
  "expectedRevision": 4,
  "purposes": ["advertising"]
}
```

Omitting `purposes` from reject/withdraw means revoke both, including for legacy clients. `purposes` is a nonempty validated subset of `analytics`, `advertising`. Support withdrawal without app login using the existing API consent cookie/CSRF protections. The landing durably stores **denials only**, synchronizes a restricted-purpose withdrawal before any new explicit partial grant, retries lost responses with identical IDs/payloads, and rebases only denials after 409. A 409 on a grant requires a fresh explicit choice; no silent overwrite.

The landing uses these deployed names and versions. Any later contract change must preserve compatibility or be coordinated before release; do not introduce a second consent system.

## Purpose mapping

| Consent | Landing | App/server |
| --- | --- | --- |
| Neither | No optional SDKs or advertising attribution | No ad identifier capture/delivery |
| Analytics only | GA4 page/CTA analytics; Google advertising storage/data denied | No advertising attribution or trial delivery |
| Advertising only | Google Ads CTA tag, Meta/existing TikTok, permitted attribution; no GA4 config | Eligible Stripe trial delivery to Meta/Google |
| Both | Both sets | Same advertising eligibility as advertising-only |

`analyticsStorage` follows analytics; `adStorage` and `adUserData` follow advertising; `adPersonalization` remains denied. Trial senders must **not** require analytics permission. Analytics-only withdrawal must not cancel an otherwise eligible advertising delivery or erase its identifiers. Advertising withdrawal must cancel unsent delivery and clear raw ad attribution as today. Eligibility needs valid advertising consent at capture/checkout and again at send time; later re-consent must not resurrect previously cancelled trials or backfill earlier non-consented trials.

Existing combined v1 grants are not silently interpreted as v2 purpose choices. The app owner's release confirms that old combined grants require a fresh choice and denials remain. The landing discards old local grants, retains/replays old denials and accepts v1 responses only to support rejection; it cannot enable tracking or submit a v2 grant against v1. API/app support is now deployed. Return to contract acceptance if that interface changes.

## Signals and platform setup

- Actual trial: app worker only, Meta `StartTrial` in production dataset `1783628368949768`, Google action `7826807919` in customer `7497620176`. No browser dashboard/signup trial tags.
- CTA: GA4 `start_trial_click` under analytics permission; Meta `StartTrialClick` and native Google Ads click event under advertising permission. Shared fresh click event ID; never the Stripe trial ID.
- Reused Google Ads website action `7609535917`, renamed `Start gratis - klikk på landingssiden`, Secondary, One per ad click, no value. Public destination `AW-17626822366/I0M7CK2bwawcEN7tj9VB`. No extra GA4 import of this same click into Ads. GA4 counts deliberate activations; Ads' One-per-click count is not the total number of button presses.
- Trial action remains Secondary / Every pending genuine delivery/processing evidence and deliberate campaign-goal selection. Existing campaign budgets/goals are not changed by this follow-up.
- GTM version 8 already pauses the legacy signup/dashboard trial tags; landing does not load GTM. App-side purpose gating is included in the app owner's v2 release. `StartTrial` must remain worker-owned.
- Synthetic QA only in isolated Meta dataset `1108306031635601` / `TEST30220` and test Stripe. Production workspace exclusions remain `[]`; add verified IDs before any internal production trial. No new keys needed and no keys in this document.

## Acceptance status and remaining release steps

1. App v2 implementation and release evidence were supplied by the app owner: exact interface, four combinations, partial withdrawals, app browser checks and worker eligibility. No new app implementation or credential handoff is requested by the landing review correction.
2. Landing owner independently verified all four choices and provider mappings through the actual client against the current API, shared app-origin reads, retained expiry after both partial withdrawals, duplicate retry and stale-grant behavior, attribution eligibility and credentialed CORS/preflight. This HTTP verification does not establish browser cookie acceptance or end-to-end checkout/provider delivery.
3. Obtain the required approving review of the updated PR #6, then publish through the normal merge/deployment flow. Do not bypass the outstanding review.
4. Immediately verify actual production browser/API behavior on the four acquisition pages, signup forwarding, consent changes and withdrawal. Verify GA4 and Ads destination routing as well as consent flags, not just the presence of the Google library. Local/preview SDK isolation remains enabled.
5. Observe a genuine eligible consented trial: app owner supplies redacted event ID/time and Meta receipt, Google validateOnly/import result and subsequent processing. Landing owner checks platform reporting/attribution. Do not fabricate ad IDs or production conversions. This observation follows publication; it is not proof supplied by the isolated tests.

Landing evidence on 9 October: 48 tracking tests, Vite build and targeted changed-file lint passed. Thirty checks using the actual client against production v2 passed, with both purposes withdrawn during cleanup and no advertising identifiers or trial events sent. Chrome desktop/mobile checks covered the real component/client with a fixture 60 ms ahead, plus offline partial withdrawal and retry. Decision-time tolerance is bounded at 1,000 ms; expiry and denials remain strict. Production browser/SDK acceptance and genuine provider receipts are still pending. Existing unrelated TypeScript errors and the TikTok vendor-snippet lint findings are documented separately; they are not new v2 errors.
