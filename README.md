Notably landingsside

Kjøring
- Installer: `npm install`
- Utvikling: `npm run dev`
- Bygg: `npm run build`

Miljøvariabler
- Bruk `.env` lokalt (ikke committed). Se `.env.example` for mal.
- Vercel: Sett `VITE_SUPABASE_URL` og `VITE_SUPABASE_ANON_KEY` i Project → Settings → Environment Variables. Se `VERCEL_SETUP.md`.
- OpenAI for artikkelsystemet kjører via Edge Function `openai-generate` og trenger `OPENAI_API_KEY` som Supabase-secret (ikke i frontend).

Supabase
- Frontend leser artikler fra `articles` og relaterte tabeller via Supabase.
- Venteliste kaller Edge Function `waitlist-signup` (krever `VITE_SUPABASE_URL` og `VITE_SUPABASE_ANON_KEY`).
- AI-generering kaller Edge Function `openai-generate` (krever `OPENAI_API_KEY` som secret i Supabase).

Sikkerhet og beste praksis
- Ikke commit `.env` (ignorert i `.gitignore`).
- Bruk `.env.example` for å dokumentere hvilke variabler som trengs.
- Resend API-nøkkel for Edge Function leses fra `RESEND_API_KEY` (ikke hardkodet).
