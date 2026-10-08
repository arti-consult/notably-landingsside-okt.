# Separate consent purposes — app handoff

Status: landing implementation prepared in PR #6 on 8 October 2026. **This is a proposed interface, not evidence that the app has implemented or deployed it.** Confirm/adapt with Slawomir before merge. No production app changes are made by this PR.

## Scope and ownership

Keep the existing Stripe-confirmed trial implementation, credentials, stable `trial_<subscription_id>` IDs, original timestamps, idempotency, retries, environment isolation and retention. The app's production senders are already enabled by the app owner's decision; the old wait-for-landing gate is superseded. This follow-up changes consent eligibility, not the Stripe lifecycle.

Landing owner: consent presentation, browser SDK gating, attribution forwarding, CTA events, landing PR/release and ad-platform reporting. App owner: consent API/storage/history, app consent UI, checkout snapshots, worker eligibility/withdrawal and app release. An independent authorized reviewer must approve the landing PR before ordinary merge.

First layer on both surfaces: `Aksepter alle`, `Avvis alle`, `Tilpass valg`. Accept-all is one action for both purposes; no preliminary checkbox. Customize exposes `Analyse` and `Annonsemåling`, off for a new choice. Reopening displays only confirmed current choices. No default advertising grant or advertising personalization.

## Proposed wire contract

Reuse `GET/POST /v1/consent` and `POST /v1/consent/attribution`, `credentials: include`, host-only API cookie, exact-origin CORS, CSRF, revisions and idempotency. Keep both `https://notably.no` and `https://www.notably.no` allowed, plus the app origin. Existing acquisition paths and OAuth/Stripe continuity remain supported.

Version markers used by the prepared landing:

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

If you prefer different wire names or versions, send the exact deployed examples before landing release. The adapter/constants can be changed; do not implement a second consent system.

## Purpose mapping

| Consent | Landing | App/server |
| --- | --- | --- |
| Neither | No optional SDKs or advertising attribution | No ad identifier capture/delivery |
| Analytics only | GA4 page/CTA analytics; Google advertising storage/data denied | No advertising attribution or trial delivery |
| Advertising only | Google Ads CTA tag, Meta/existing TikTok, permitted attribution; no GA4 config | Eligible Stripe trial delivery to Meta/Google |
| Both | Both sets | Same advertising eligibility as advertising-only |

`analyticsStorage` follows analytics; `adStorage` and `adUserData` follow advertising; `adPersonalization` remains denied. Trial senders must **not** require analytics permission. Analytics-only withdrawal must not cancel an otherwise eligible advertising delivery or erase its identifiers. Advertising withdrawal must cancel unsent delivery and clear raw ad attribution as today. Eligibility needs valid advertising consent at capture/checkout and again at send time; later re-consent must not resurrect previously cancelled trials or backfill earlier non-consented trials.

Existing combined v1 grants are not silently interpreted as v2 purpose choices. Agree a safe rollout/migration: show a fresh explicit choice for the new policy, retain/replay old denials, and handle stale v1 grants without bypassing the new semantics. The prepared landing accepts v1 responses only to support rejection; it cannot enable tracking or submit a v2 grant against v1. Deploy API/app support first and verify it before landing merge; return to this step if the final contract differs.

## Signals and platform setup

- Actual trial: app worker only, Meta `StartTrial` in production dataset `1783628368949768`, Google action `7826807919` in customer `7497620176`. No browser dashboard/signup trial tags.
- CTA: GA4 `start_trial_click` under analytics permission; Meta `StartTrialClick` and native Google Ads click event under advertising permission. Shared fresh click event ID; never the Stripe trial ID.
- Reused Google Ads website action `7609535917`, renamed `Start gratis - klikk på landingssiden`, Secondary, One per ad click, no value. Public destination `AW-17626822366/I0M7CK2bwawcEN7tj9VB`. No extra GA4 import of this same click into Ads. GA4 counts deliberate activations; Ads' One-per-click count is not the total number of button presses.
- Trial action remains Secondary / Every pending genuine delivery/processing evidence and deliberate campaign-goal selection. Existing campaign budgets/goals are not changed by this follow-up.
- GTM version 8 already pauses the legacy signup/dashboard trial tags; landing does not load GTM. App owner must apply the correct purpose gating to any remaining app GTM tags. `StartTrial` must remain worker-owned.
- Synthetic QA only in isolated Meta dataset `1108306031635601` / `TEST30220` and test Stripe. Production workspace exclusions remain `[]`; add verified IDs before any internal production trial. No new keys needed and no keys in this document.

## Acceptance and requested return

1. Verify neither/analytics-only/advertising-only/both on API and app, plus each partial withdrawal, expiry, stale revisions, offline withdrawal and legacy migration. Repeat existing webhook/dedup tests where consent checks changed.
2. Verify advertising attribution capture and checkout/worker eligibility for advertising-only and both; analytics-only cannot deliver. Preserve current identifiers, source URLs, timestamps and anonymous-to-authenticated/OAuth/Stripe continuity. Do not reject an advertising-valid checkout solely because analytics changed.
3. Send exact final GET/POST examples, policy versions, tested/deployed commit and any migration/variable changes. No credential rotation or new secret handoff is expected.
4. Landing owner aligns/tests the adapter, checks the four public landing pages and production browser/network behavior, then publishes after required PR approval. Verify GA4 and Ads destination routing as well as consent flags, not just the presence of the Google library.
5. Observe a genuine eligible consented trial: app owner supplies redacted event ID/time and Meta receipt, Google validateOnly/import result and subsequent processing. Landing owner checks platform reporting/attribution. Do not fabricate ad IDs or production conversions. This observation follows publication; it is not proof supplied by the offline tests.

Prepared landing evidence: 43 isolated tracking tests and Vite build passed; four choices verified with offline UI fixtures in desktop/mobile Chrome. Production v2 browser/API acceptance is still pending. Existing unrelated TypeScript errors and the pre-existing TikTok vendor-snippet lint findings are documented separately; they are not new v2 errors.
