# Organic origin on signup links

Signup links (`https://app.notably.no/{no,en}/sign-up`) now also carry two parameters, **only when the visitor has granted advertising consent** (same gate as UTM/click ids; `ref` is unchanged and still always sent):

| Param | Value | Source |
|---|---|---|
| `landing_path` | public path of the first page view of the visit (`/`, `/advokat`, `/regnskapsforer`, `/bygg-og-anlegg`, `/artikler/<slug>`, …) | `location` at load |
| `referrer_class` | `search` · `linkedin` · `social` · `ai` · `other` · `direct` · `internal` | `document.referrer` at load, reduced to a class |

The referrer URL itself (path, query, search terms) is never forwarded or stored. Memory only, no browser storage. Inbound copies of these params on the link are stripped before setting. `utm_*` and click ids behave as before, so a UTM-tagged LinkedIn post arrives with both `utm_*` and `referrer_class=linkedin`.

`internal` = referrer is notably.no/app.notably.no (not a new source; the app should ignore it). Paid vs organic is NOT decided here: click id or paid `utm_medium` wins downstream.

## UTM convention for organic posts and newsletters

`utm_source=<linkedin|nyhetsbrev|olympus|blogg>&utm_medium=organic&utm_campaign=<segment>` (e.g. `utm_source=linkedin&utm_medium=organic&utm_campaign=regnskapsforer`). Paid LinkedIn (thought-leader ads) must use `utm_medium=paid_social`.

## Not changed

The `POST /v1/consent/attribution` payload is untouched (the API validates its shape). Storing organic origin in the product needs an app change.
