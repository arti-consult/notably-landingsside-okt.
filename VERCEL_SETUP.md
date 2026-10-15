# Vercel Miljøvariabler Oppsett

For at nettsiden skal fungere i produksjon på Vercel, må du legge til følgende miljøvariabler:

## Steg-for-steg instruksjoner:

1. Gå til [Vercel Dashboard](https://vercel.com/dashboard)
2. Velg prosjektet ditt (notably-landingsside-okt)
3. Gå til **Settings** → **Environment Variables**
4. Legg til følgende variabler:

### Environment Variables

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://qelklrrxciwomrwunzjo.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlbGtscnJ4Y2l3b21yd3VuempvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDA4ODQsImV4cCI6MjA3NDk3Njg4NH0.7SXgcNAn0tMEGVkYDcLdoPUf0SJ8pZimeBQUjIPs3nQ` | Production, Preview, Development |

## Viktig informasjon:

- ✅ **anon/public key er trygg å eksponere** - Den er designet for å brukes i frontend og har kun begrenset tilgang via Row Level Security (RLS) policies
- ✅ **Miljøvariabler i Vercel er sikre** - De er kryptert og kun tilgjengelige under build/runtime
- ✅ **.env filen er i .gitignore** - Den vil aldri bli pushet til Github
- 🔄 **Etter du har lagt til variablene** - Gjør en redeploy av prosjektet på Vercel

## Lokal utvikling:

For lokal utvikling er miljøvariablene allerede satt opp i `.env` filen i prosjektets rot.

## Supabase Edge Functions:

Edge functions (som `waitlist-signup`) får automatisk tilgang til `SUPABASE_URL` og `SUPABASE_SERVICE_ROLE_KEY` fra Supabase selv - disse trenger ikke settes opp i Vercel.

## Artikler

Artiklene ligger som filer i repoet (`content/artikler/`) og publiseres via PR. Det trengs ingen OpenAI-nøkkel, Deploy Hook eller Edge Function for artikler. Se `content/artikler/README.md`.

---

**Prosjektinformasjon:**
- Supabase Project: Notably | Nettside
- Project ID: qelklrrxciwomrwunzjo
- Database: bolt-native-database-57918369
