Notably landingsside

Kjøring
- Installer: `npm install`
- Utvikling: `npm run dev`
- Bygg: `npm run build`

Miljøvariabler
- Bruk `.env` lokalt (ikke committed). Se `.env.example` for mal.
- Vercel: Sett `VITE_SUPABASE_URL` og `VITE_SUPABASE_ANON_KEY` i Project → Settings → Environment Variables. Se `VERCEL_SETUP.md`.
- OpenAI for artikkelsystemet kjører via Edge Function `openai-generate` og trenger `OPENAI_API_KEY` som Supabase-secret (ikke i frontend).
- For automatisk indekseringsping etter deploy:
  - `SITEMAP_BASE_URL` (f.eks. `https://notably.no`)
  - `INDEXNOW_KEY` (valgfri, men anbefalt)
  - `INDEXNOW_HOST` (f.eks. `notably.no`)
  - `INDEXNOW_ENDPOINT` (standard: `https://api.indexnow.org/indexnow`)
- For automatisk deploy ved publisering av artikler:
  - Opprett en Vercel Deploy Hook URL
  - Legg den som Supabase Function secret: `VERCEL_DEPLOY_HOOK_URL`
  - Deploy Supabase Edge Function: `trigger-site-rebuild`

Supabase
- Frontend leser artikler fra `articles` og relaterte tabeller via Supabase.
- Venteliste kaller Edge Function `waitlist-signup` (krever `VITE_SUPABASE_URL` og `VITE_SUPABASE_ANON_KEY`).
- AI-generering kaller Edge Function `openai-generate` (krever `OPENAI_API_KEY` som secret i Supabase).

Sikkerhet og beste praksis
- Ikke commit `.env` (ignorert i `.gitignore`).
- Bruk `.env.example` for å dokumentere hvilke variabler som trengs.
- Resend API-nøkkel for Edge Function leses fra `RESEND_API_KEY` (ikke hardkodet).

Indeksering
- `npm run build` kjører automatisk:
  1. `prebuild`: genererer `public/sitemap.xml`
  2. `build`: bygger appen
  3. `postbuild`: pinger Bing sitemap-endepunkt og sender IndexNow hvis `INDEXNOW_KEY` er satt
- Ved publisering av artikler i admin kalles `trigger-site-rebuild` for å starte ny deploy automatisk, slik at sitemap oppdateres uten manuell push.
