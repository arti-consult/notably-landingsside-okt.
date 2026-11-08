# Dara (meetdara.no): researchrapport for «Dara vs Notably»

**Om kildene:** meetdara.no var nesten ikke til å nå mens jeg jobbet (8.11.2026). Curl og WebFetch fikk tidsavbrudd på /pricing, /security, /sammenlign, /about, /media-kit, /dpa, /vilkar og bransjesidene. Bare to sider kom gjennom:
- **Forsiden** https://www.meetdara.no/ kom via WebFetch. Den gir et sammendrag laget av en liten modell, ikke rå HTML. Påstandene er derfor rimelig sikre, men bør sjekkes mot siden før publisering. Det gjelder særlig prisene.
- **Personvernerklæringen** https://www.meetdara.no/personvern ble lastet ned som rå HTML. Den er sist oppdatert 12.10.2026, og teksten er lest ordrett.

Hjelpesenteret https://help.meetdara.no/ er bygget med JavaScript. Der fikk jeg bare ut kategoriene: Kom i gang, Grunnleggende funksjoner, Organisering, Konto, Sikkerhet og personvern, Juridisk. Nettsøk ga ingen omtale fra andre: ingen app-butikkoppføring, presseomtale eller anmeldelser. LinkedIn ga 403.

## 1. Produkt, målgruppe og selskap
- Dara beskriver seg som «En usynlig møteassistent som er best på norsk». Den transkriberer, husker og oppsummerer møter. (Forsiden)
- **Selskap:** Soria AS, org.nr. 936 462 995, Dronning Eufemias gate 16, 0191 Oslo. Forsiden sier «Utviklet i Oslo», og footeren lenker til soriaventures.no. (Forsiden og /personvern)
- **Målgruppe:** norske virksomheter. Dara har egne bransjesider for konsulentselskaper, advokatfirmaer, regnskapsbyråer, salgsteam, rekruttering, eiendomsmeglere, offentlig sektor, ledergrupper, HR, prosjektledere, finansrådgivere og bygg og anlegg. (Forsiden)
- Forsiden sier «Dara brukes i kommuner og børsnoterte selskaper». Den nevner ingen kunder ved navn. (Forsiden)
- Når produktet ble lansert eller selskapet stiftet: **ukjent**.

## 2. Hvordan møter tas opp
- **Ingen bot.** Dara tar opp lyden fra brukerens egen maskin, og ingen ekstra deltaker blir med i møtet. Forsiden sier «Ingen bot i møtet». (Forsiden)
- **Desktop-app** for macOS og Windows. (Forsiden)
- **Fysiske møter** tas opp med PC-mikrofonen: brukeren åpner Dara og trykker start. (Forsiden)
- **Mobilapp for iOS og Android** nevnes ikke på forsiden, og jeg fant ingen oppføring i app-butikkene. Status: **ukjent**, trolig ingen.
- **Opplasting av lydfil** er ikke beskrevet som en egen funksjon. Forsiden sier tvert imot at man ikke trenger å «laste opp lydfiler etterpå». Personvernerklæringen nevner «brukeropplastet materiale», men da om dokumenter og tekst. Status: **ukjent**.

## 3. Plattformer
- Teams, Google Meet, Zoom og Slack, pluss «alt som spiller lyd på maskinen». Det følger av at lyden tas opp lokalt. (Forsiden)
- Google Kalender kan kobles til med lesetilgang. Da vises kommende møter, og notater knyttes til riktig møte. (/personvern, del 10)
- Støtte for Outlook-kalender: **ukjent**.

## 4. Referatet
- Dara transkriberer alt, også dialekter. (Forsiden)
- Sammendraget har med beslutninger og neste steg. (Forsiden)
- Andre funksjoner (alle fra forsiden):
  - Sammendragsmaler og ordforråd tilpasset bransjen.
  - Utkast til oppfølgingsmail.
  - «Spør Dara»: chat med møtene, med hukommelse på tvers av møter og kildehenvisninger. Navnet «Spør Dara» står også i /personvern.
  - Notater, delte møter og mapper i et felles arbeidsområde.
- **Talergjenkjenning:** ikke nevnt, **ukjent**. Det er uklart hvordan Dara skiller talere når lyden tas opp lokalt.
- **Eksport og deling** utover delte mapper: **ukjent**.

## 5. Norsk språk
- Dara er laget for norsk fra starten. Den forstår dialekter og takler møter der deltakerne bytter mellom norsk og engelsk. (Forsiden)
- Grensesnittet er på norsk, og det samme er nettsiden og hjelpesenteret.
- Antall språk som støttes: **ukjent**.

## 6. Personvern og sikkerhet
- **Lagring:** transkripsjoner, notater og kontodata ligger hos AWS i Stockholm, altså i EU/EØS. Forsiden sier «Data lagret i EU». (/personvern, del 5, og forsiden)
- **Lydfiler slettes automatisk og permanent** når transkripsjonen er ferdig, og bare tekst blir lagret. (/personvern og forsiden)
- **AI-trening:** forsiden sier at data «Brukes ikke til AI-trening». Personvernerklæringen sier det samme eksplisitt for data fra Google API-er. (Forsiden og /personvern, del 10)
- **Viktig, og motstridende med budskapet «Data lagret i EU»:** /personvern del 8 sier at Dara bruker «AI-modellen Claude levert av Anthropic» til oppsummering og «Spør Dara». Transkripsjoner, notater og tekst brukeren skriver inn kan dermed sendes til Anthropic. Erklæringen sier at Anthropic «opererer per i dag med infrastruktur både i og utenfor EU/EØS». Overføring utenfor EU/EØS skjer i så fall med EUs standard kontraktsbestemmelser (SCC). Lagringen skjer altså i EU, men behandlingen kan skje utenfor EU/EØS.
- **Underleverandører:** Dara lister ikke databehandlerne sine offentlig. Begrunnelsen er «Av sikkerhetshensyn». (/personvern, del 7 og 8)
- **Sikkerhetstiltak** (forsiden og /personvern, del 9):
  - AES-256- og TLS-kryptering.
  - Rollebasert tilgang og tofaktorautentisering.
  - Segmentert infrastruktur.
  - Årlige GDPR-revisjoner.
- **Avtaler:** forsiden sier at Dara følger GDPR og at kunden kan signere en databehandleravtale. Avtalen ligger på /dpa, men den siden kunne jeg ikke laste.
- **Sertifiseringer:** SOC 2 eller ISO 27001 er ikke nevnt, **ukjent**, trolig ingen.
- **Ansvar for samtykke:** Dara legger ansvaret for lovlig opptak og samtykke på brukeren. (/personvern, del 3)

## 7. Integrasjoner
- Teams, Zoom, Google Meet og Slack, i betydningen at opptaket virker der. (Forsiden)
- Google Kalender. (/personvern)
- SSO og admin-kontroll i Enterprise-planen. (Forsiden)
- CRM, Notion, HubSpot, Outlook og API: ikke nevnt, **ukjent**.

## 8. Pris
Alle tall er fra forsiden, lest via WebFetch-sammendrag. /pricing kunne ikke lastes, og det er **ukjent** om prisene er med eller uten mva.

| Plan | Pris per bruker | Innhold |
|---|---|---|
| Basis | 125 kr/mnd, eller 1 500 kr årlig | 10 møter i måneden, AI-sammendrag og chat, delte mapper og notater |
| Bedrift | 292 kr/mnd, eller 3 500 kr årlig | Ubegrensede møter, prioritert support |
| Enterprise | Ta kontakt | SSO, admin-kontroll, dedikert kundekontakt, SLA |

- Årlig betaling gir «2 måneder gratis». Det tyder på at kronebeløpene per måned er årspris delt på 12, og at månedlig betaling i så fall er dyrere. Det er **usikkert**.
- 7 dagers gratis prøveperiode uten kort: «Test Dara gratis i en uke». (Forsiden og /personvern)
- Ingen permanent gratisplan.

## 9. Styrker og svakheter
**Styrker (rettferdig vurdert):**
- Norsk selskap med norsk fokus og dialektstøtte.
- Ingen bot i møtet, som oppleves diskret.
- Billigere enn Notably: 125 eller 292 kr mot 399 kr.
- Lyd slettes etter transkripsjon, og lagringen skjer i Stockholm.
- Chat på tvers av møter med kilder, maler, utkast til oppfølgingsmail og mange bransjesider.

**Svakheter for norske virksomheter:**
- Ingen dokumentert mobilapp. Fysiske møter krever en PC i rommet.
- Opptaket krever at desktop-appen kjører på brukerens maskin, så Dara virker bare i møter brukeren selv er med på.
- AI-behandlingen hos Anthropic kan skje utenfor EU/EØS, og underleverandørene er ikke listet offentlig.
- Ingen oppgitte sertifiseringer.
- Basis har tak på 10 møter i måneden.
- Ingen dokumenterte CRM- eller Notion-integrasjoner.
- Talergjenkjenning er ukjent.
- Selskapet er nytt og lite synlig, uten treff i uavhengige kilder.

## 10. Usikkert eller motstridende
- «Data lagret i EU» og «Ingen data utenfor EU» stemmer ikke helt med /personvern del 8, som åpner for behandling utenfor EU/EØS hos Anthropic.
- Prisene er ikke kontrollert mot /pricing. Om prisene er med eller uten mva, og hva månedlig betaling uten årsavtale koster, er ukjent.
- Mobilapp, opplasting av lydfil, talergjenkjenning, antall språk, sertifiseringer og stiftelsesår er ukjent.
- Det er uklart om Slack betyr huddles-opptak eller deling til Slack.
- Org.nr. 936 462 995 tyder på et ganske nyregistrert selskap. Det er ikke sjekket i Brønnøysundregistrene.

## LOGO
- **Fil:** /private/tmp/claude-501/-Users-jorgen--claude-spares-spare-8BmDUC/022cad4c-d7e3-4564-bda2-3c7db7728525/scratchpad/logos/dara/google-favicon-256.png
  - Kilden er Googles favicon-tjeneste for meetdara.no, altså en sekundærkilde for selve faviconet.
  - `file` viser PNG, 192x192, RGBA. Jeg har sett på den med Read.
- **Kandidater som ikke kunne lastes ned:** https://www.meetdara.no/Favicon/apple-touch-icon.png (180x180), https://www.meetdara.no/Favicon/site.webmanifest og https://meetdara.co/metaimage.png. Alle fikk tidsavbrudd.
- **Motiv:** et symbol uten tekst, en åpen ring delt i segmenter. Ringen går fra rosa-rød nede til venstre via lilla til blå oppe til høyre.
- **Bakgrunn:** gjennomsiktig. Hjørnene og midten har alpha 0.
- **Merkefarger målt i fila:**
  - Blå #0096FF, med variant #0B91F8.
  - Rosa-rød #FF1E56 / #FE1E57.
  - Overgangsfargene #C5397C og #7B5CAD.
- **Anbefaling:** bruk denne fila. Prøv å hente apple-touch-icon.png på nytt når siden svarer igjen, for den har trolig bedre kvalitet. Ingen annen fil er lastet ned eller kjørt.