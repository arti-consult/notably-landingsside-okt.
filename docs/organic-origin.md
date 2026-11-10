# Organic origin on signup links

Until now `document.referrer` was never read, and a visit without a campaign key (`utm_*`, click id) left no trace in the product. Signup links (`https://app.notably.no/{no,en}/sign-up`) now carry the organic origin of the visit as **standard `utm_source` / `utm_medium`** when the link has no explicit tagging, and **only when the visitor has granted advertising consent** (same gate as UTM/click ids; `ref` is unchanged).

| Visit | Added to the signup link |
|---|---|
| Google (any ccTLD) | `utm_source=google&utm_medium=organic` |
| Bing / DuckDuckGo / Ecosia / Brave / Yahoo / Startpage / Kagi | `utm_source=<name>&utm_medium=organic` |
| LinkedIn (`linkedin.com`, `lnkd.in`) | `utm_source=linkedin&utm_medium=organic` |
| ChatGPT / Perplexity / Claude / Gemini / Copilot | `utm_source=chatgpt.com` (etc.)`&utm_medium=organic` |
| Facebook / Instagram / X / Threads / Reddit / TikTok | `utm_source=<name>&utm_medium=organic` |
| Any other site | `utm_source=referral&utm_medium=organic` |
| No referrer | `utm_source=direct&utm_medium=none` |
| Own domains (back from the app) | nothing |

Rules:
- Explicit tagging always wins: if the landing URL has `utm_source` or a click id, nothing is derived (and a click id on the link means paid; no organic label is added next to it).
- Only the short source name leaves the browser, never the referrer URL, path or search terms. Memory only, no browser storage.
- Why `utm_*` and not new params: the app's sign-up page ignores the whole marketing capture when the URL has any unknown query key (`isSafeInitialMarketingUrl`), so new parameter names would break paid conversion tracking.
- `utm_medium=paid*` (Google/Meta/LinkedIn ads) is decided by the ad URL / click id, not here.

## UTM convention for organic posts and newsletters (set by the sender)

`utm_source=<linkedin|nyhetsbrev|olympus|blogg>&utm_medium=organic&utm_campaign=<segment>`, e.g. `utm_source=linkedin&utm_medium=organic&utm_campaign=regnskapsforer` for a founder post. Email and in-app browsers strip the referrer, so newsletters and LinkedIn posts MUST be tagged. LinkedIn thought-leader ads / boosted posts are paid: `utm_medium=paid_social`.

## Not changed

The `POST /v1/consent/attribution` payload is untouched. The app only stores UTM next to a click-id/`_fbp` observation (CHECK on `kind`), so a consenting visitor without any identifier is still not stored; that needs an app change.
