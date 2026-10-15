Notably landingsside

Kjøring
- Installer: `npm install`
- Utvikling: `npm run dev`
- Bygg: `npm run build`

Kontroll av sporingslastingen
- Kjør `npm run test:tracking` med Node 24.
- Testene bruker en simulert nettleser og sender ingen hendelser til leverandører.
- Produksjonstagger lastes bare på HTTPS for notably.no og www.notably.no, etter bekreftet samtykke fra API-et. Nye lastinger på /admin er sperret.

Detaljer om delt samtykke, klikkmåling og akseptanse finnes i [docs/conversion-tracking.md](docs/conversion-tracking.md).

Miljøvariabler
- Bruk `.env` lokalt (ikke committed). Se `.env.example` for mal.
- Ingen miljøvariabler er påkrevd for å bygge siden. Se `VERCEL_SETUP.md`.
- For automatisk indekseringsping etter deploy:
  - `SITEMAP_BASE_URL` (f.eks. `https://notably.no`)
  - `INDEXNOW_KEY` (valgfri, men anbefalt)
  - `INDEXNOW_HOST` (f.eks. `notably.no`)
  - `INDEXNOW_ENDPOINT` (standard: `https://api.indexnow.org/indexnow`)

Artikler
- Artiklene ligger som filer i `content/artikler/<slug>.md` med bilder i `public/artikler/<slug>/`. Ny artikkel = én fil + bilder i en PR. Format og mal: [content/artikler/README.md](content/artikler/README.md).
- Ved bygg skrives ferdig HTML (title, meta, canonical, Open Graph, JSON-LD) for `/artikler` og hver artikkel. Det finnes ingen admin-side og ingen artikkeldatabase.
- Test: `npm run test:artikler`.

Bilder
- Logo, favicon, delingsbilde og andre bilder ligger i `public/media/` (flyttet fra det gamle Bolt-prosjektet, som nettsiden ikke lenger bruker).

Sikkerhet og beste praksis
- Ikke commit `.env` (ignorert i `.gitignore`).
- Bruk `.env.example` for å dokumentere hvilke variabler som trengs.
- Resend API-nøkkel for Edge Function leses fra `RESEND_API_KEY` (ikke hardkodet).

Indeksering
- `npm run build` kjører automatisk:
  1. `prebuild`: genererer `public/sitemap.xml` (inkludert artiklene i `content/artikler`)
  2. `build`: bygger appen og skriver statisk HTML for artiklene
  3. `postbuild`: pinger Bing sitemap-endepunkt og sender IndexNow hvis `INDEXNOW_KEY` er satt
- Nye artikler kommer med i sitemap automatisk når PR-en med artikkelfilen merges og Vercel bygger.
