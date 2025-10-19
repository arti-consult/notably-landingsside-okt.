Notably landingsside

Kjøring
- Installer: `npm install`
- Utvikling: `npm run dev`
- Bygg: `npm run build`

Miljøvariabler
- Bruk `.env` lokalt (ikke committed). Se `.env.example` for mal.
- Vercel: Sett `VITE_SUPABASE_URL` og `VITE_SUPABASE_ANON_KEY` i Project → Settings → Environment Variables. Se `VERCEL_SETUP.md`.

Supabase
- Frontend leser artikler fra `articles` og relaterte tabeller via Supabase.
- Venteliste kaller Edge Function `waitlist-signup` (krever `VITE_SUPABASE_URL` og `VITE_SUPABASE_ANON_KEY`).

Sikkerhet og beste praksis
- Ikke commit `.env` (ignorert i `.gitignore`).
- Bruk `.env.example` for å dokumentere hvilke variabler som trengs.
- Resend API-nøkkel for Edge Function leses fra `RESEND_API_KEY` (ikke hardkodet).
