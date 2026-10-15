# Vercel-oppsett (prosjekt `notably-clean`)

Siden er en ren Vite/React-app. **Ingen miljøvariabler er påkrevd for å bygge.**

Valgfrie variabler (se `.env.example`):

| Navn | Brukes til |
|------|------------|
| `SITEMAP_BASE_URL` / `SITE_URL` | Kanonisk domene i `sitemap.xml` (standard `https://notably.no`) |
| `INDEXNOW_KEY`, `INDEXNOW_HOST`, `INDEXNOW_ENDPOINT` | IndexNow-ping etter bygg (`scripts/notify-indexing.mjs`) |

## Artikler

Artiklene ligger som filer i repoet (`content/artikler/`) og publiseres via PR. Bygget skriver statisk HTML for
`/artikler` og hver artikkel. Se `content/artikler/README.md`.

## Flyttet bort fra Bolt (oktober 2026)

Nettsiden har ingen tilknytning til det gamle Bolt-prosjektet lenger: artiklene er filer, bildene ligger i
`public/media/` og `public/artikler/`, og admin-sidene, ventelisteskjemaet og edge-funksjonene er fjernet.
Disse Vercel-variablene brukes ikke lenger og kan slettes etter merge: `VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY` (og `SUPABASE_SERVICE_ROLE_KEY` hvis den finnes).
