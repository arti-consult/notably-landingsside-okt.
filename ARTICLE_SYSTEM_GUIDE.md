# Notably Article Management System - Brukerveiledning

Dette er en komplett veiledning for å bruke det SEO-optimaliserte artikkel-systemet i Notably.

## Oversikt

Systemet inkluderer:
- Full artikkeleditor med TipTap rich-text editor
- AI-drevet innholdsgenerering (TLDR, meta-beskrivelser, nøkkelord)
- SEO-optimalisering med sanntidspoeng
- Kategoristyring
- Bildeintegrasjon med eksisterende media library
- Frontend visning med automatisk innholdsfortegnelse
- Blogg listing-side med søk og filtrering

## Administrasjon

### Tilgang til artikkelsystemet

1. Logg inn på admin-panelet: `/admin/login`
2. Fra dashboardet, klikk på "Artikler"-kortet
3. Du vil se en liste over alle artikler

### Opprette ny artikkel

1. Klikk på "Ny artikkel"-knappen
2. Fyll ut følgende felt:
   - **Tittel**: Artikkelens hovedtittel
   - **URL-slug**: Genereres automatisk fra tittelen, kan redigeres
   - **Kategori**: Velg eksisterende kategori eller opprett ny
   - **Hovedbilde**: Velg et bilde fra media library
   - **TLDR**: Kort sammendrag (kan genereres med AI)
   - **Innhold**: Skriv artikkelinnholdet med rich-text editor

### Bruke editoren

Editoren støtter:
- **Tekstformatering**: Fet, kursiv, understreking
- **Overskrifter**: H1, H2, H3 (viktig for SEO!)
- **Lister**: Punktliste og nummerert liste
- **Lenker**: Sett inn eksterne og interne lenker
- **Bilder**: Sett inn bilder fra media library
- **Tabeller**: Opprett sammenligningsartikler
- **Sitater og kodeblokker**: For spesialisert innhold

### AI-funksjoner

Systemet har innebygd OpenAI-integrasjon for å hjelpe med:

1. **TLDR-generering**:
   - Skriv artikkelinnholdet først
   - Klikk "Generer med AI" ved TLDR-feltet
   - AI genererer et 2-3 setninger langt sammendrag

2. **Meta-beskrivelse**:
   - Klikk "Generer med AI" i SEO-panelet
   - AI lager en SEO-optimalisert beskrivelse (150-160 tegn)

3. **Nøkkelord**:
   - Klikk "Generer med AI" under nøkkelord
   - AI foreslår relevante SEO-nøkkelord basert på innholdet

### SEO-optimalisering

SEO-panelet (høyre side) viser:
- **SEO Score**: 0-100 poeng basert på best practices
- **Problemer**: Kritiske ting som må fikses
- **Forbedringsforslag**: Anbefalinger for bedre SEO

Viktige SEO-tips:
- Bruk én H1-overskrift (blir automatisk tittelen)
- Legg til H2 og H3 for struktur
- Sørg for at meta-beskrivelsen er 120-160 tegn
- Legg til alt-tekst på alle bilder
- Skriv minst 1000 ord for beste resultat
- Bruk nøkkelord naturlig i innholdet

### Kategorier

Opprette ny kategori:
1. I artikkeleditor, klikk "Ny kategori"
2. Skriv kategorinavn på norsk
3. Klikk "Opprett"
4. Kategorien blir automatisk valgt for artikkelen

### Publisering

Artikler har fire statuser:
- **Utkast**: Arbeid pågår, ikke synlig offentlig
- **Publisert**: Live på nettsiden
- **Planlagt**: Vil publiseres på et fremtidig tidspunkt
- **Arkivert**: Ikke lenger aktiv

For å publisere:
1. Sjekk at SEO-score er minst 60 (helst 80+)
2. Fyll ut alle meta-felt
3. Velg "Publisert" fra status-dropdown
4. Klikk "Publiser" eller "Lagre"

## Frontend

### Blogg-side

Besøk `/blog` for å se alle publiserte artikler.

Funksjoner:
- Søk etter artikler
- Filtrer på kategori
- Sortering etter publiseringsdato
- Responsive design for mobil og desktop

### Artikkelside

Hver artikkel har:
- Brødsmulesti-navigasjon
- Hovedbilde og metadata (dato, lesetid)
- TLDR-seksjon øverst
- Innholdsfortegnelse (genereres automatisk fra H2/H3)
- Artikkelinnhold med rik formatering
- Tags/nøkkelord nederst
- Relaterte artikler

### SEO og deling

Hver artikkel har automatisk:
- Riktig HTML-struktur (semantic HTML5)
- Meta tags for søkemotorer
- Open Graph tags for Facebook/LinkedIn
- Twitter Card tags
- Schema.org structured data (Article)
- Canonical URL
- Breadcrumbs for bedre SEO

## Database-struktur

Systemet bruker følgende tabeller i Supabase:
- `article_categories`: Kategorier
- `articles`: Artikler
- `article_seo_metadata`: SEO-metadata
- `article_tags`: Tags/nøkkelord
- `article_table_of_contents`: Innholdsfortegnelse
- `article_analytics`: Visningsstatistikk

## Sikkerhet

- Row Level Security (RLS) er aktivert på alle tabeller
- Kun admin-brukere (med @notably.* e-post) har skrivetilgang
- Publiserte artikler er synlige for alle
- Utkast er kun synlige for innloggede admins

## Beste praksiser for SEO

1. **Tittel**: 30-60 tegn, inneholder hovednøkkelord
2. **Meta-beskrivelse**: 120-160 tegn, overbevisende og informativ
3. **URL-slug**: Kort, beskrivende, med bindestreker
4. **Innhold**: Minst 1000 ord, godt strukturert med overskrifter
5. **Bilder**: Alltid med beskrivende alt-tekst
6. **Interne lenker**: Link til andre relevante artikler
7. **Nøkkelord**: 5-8 relevante nøkkelord, ikke overfyll
8. **Overskrifter**: Logisk hierarki (H1 → H2 → H3)

## Feilsøking

### AI-generering fungerer ikke
- Sjekk at `OPENAI_API_KEY` er satt som secret i Supabase (Edge Functions)
- Sørg for at du har skrevet nok innhold først
- Prøv igjen om noen sekunder

### Bilder vises ikke
- Sjekk at bildet er lastet opp til media library først
- Verifiser at bildet har en public_url

### SEO-score er lav
- Les gjennom "Problemer" og "Forbedringsforslag"
- Fokuser på kritiske problemer først
- Bruk AI til å generere meta-beskrivelse og nøkkelord

## API-nøkler

OpenAI API-nøkkelen lagres som secret i Supabase Edge Functions (`OPENAI_API_KEY`) og skal ikke ligge i frontend eller i repo.

## Fremtidige forbedringer

Potensielle forbedringer:
- Planlagt publisering med automatisk aktivering
- A/B testing av titler og meta-beskrivelser
- Avansert analytics med Google Analytics-integrasjon
- Automatisk intern linking-forslag
- Bildekomprimering og optimalisering
- Sitemap.xml generering
- RSS feed for subscribers

---

## Support

For spørsmål eller problemer, kontakt utviklingsteamet.
