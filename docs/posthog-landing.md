# PostHog på den offentlige landingssiden

## Omfang og rapporter

EU-prosjekt 312060: **Notably – landingsside**.
[Dashboard: Notably – landingsside og demo](https://eu.posthog.com/project/312060/dashboard/1037086).

Dashboardet har åtte rapporter: besøk, handlinger over tid, trafikkilder, besøkte sider, fra besøk til Start gratis, fra besøk til bekreftet demo, knappens plassering og UTM-kampanje. Det siste krever både analyse- og annonsemålingssamtykke. Alle rapportene filtrerer på `site=notably.no`, bruker Europe/Oslo og viser siste 30 dager som utgangspunkt.

Lagrede klikkart for forsiden, regnskapsførersiden og advokatsiden er opprettet i Heatmaps med skjermbredder 390 og 1440. Data kommer først etter publisering og nye samtykker. Opptak finnes i Session replay; 25 % utvalg, minst 5 sekunder, 30 dagers lagring.

| Hendelse | Betydning |
| --- | --- |
| `$pageview` / `$pageleave` | Besøk på en godkjent offentlig side, varighet og rulling |
| `start_trial_click` | Et ekte klikk på Start gratis; **ikke** bekreftet trial |
| `demo_click` | Et ekte klikk som åpner bookingmodalen |
| `demo_booked` | Den eksisterende validerte og dedupliserte bookingbekreftelsen |
| `$$heatmap` | SDK-ens koordinater for klikk og pekerbevegelse, med rensede sideadresser |
| `$snapshot` | Maskert opptak av den offentlige siden |

Ingen app-, organisasjons- eller kontoidentitet kobles inn. En tilfeldig identifikator lagres i sessionStorage; besøk i andre faner/enheter blir ikke koblet til samme person. Funnelrapportene gjelder samme fane innen ett døgn. Tallene dekker samtykkende besøk, ikke alle besøkende, og følger ikke annonseplattformenes attribusjonsmodell.

## Samtykke og personvern

SDK-en lastes dynamisk først når begge disse kravene er oppfylt:

1. Eksisterende samtykkeklient har gyldig, serverbekreftet analysesamtykke.
2. Personen har uttrykkelig lagret analysevalget i landingssidens oppdaterte dialog, som informerer om PostHog.

En lokal kvittering knyttes til nøyaktig serverrevisjon, beslutningstid og utløp. Kvitteringen er aldri samtykke alene. Gamle samtykker og nye valg gjort bare i webappen aktiverer ikke PostHog. Eksisterende besøkende får ingen tvungen ny dialog; de kan åpne Personvernvalg og bekrefte der. Dette bevarer dagens Google/Meta-valg og serverkontrakt.

Avslag, manglende lagring, serverfeil, utløpt/endrede samtykker, forhåndsvisninger og ukjente sideadresser stopper PostHog. Tilbaketrekking stopper innsamling og opptak lokalt før serverlagringen forsøkes, også uten nett. Ingen tidligere avviste hendelser spilles av ved senere samtykke.

Skjemaer, alle innfelt-vinduer, bookingmodalen, redigerbare felt, lyd/video og canvas blokkeres i opptak. Tekst og innholds-/URL-attributter maskeres. Offentlige layoutklasser og stiler beholdes, bortsett fra verdier med URL-er eller annonseidentifikatorer. Opptakene har derfor redusert detaljnivå. Konsoll, nettverkspayloads, feilfangst, generell autocapture, surveys og personprofiler er slått av. IP-adresser fjernes ved mottak i PostHog.

Hendelser har en eksplisitt liste over tillatte egenskaper. Nettadresser mister parametere og fragmenter; henviser begrenses til domenet. `gclid`, `fbclid`, salgshenvisninger, søkeord, navn, e-post og booking-ID sendes ikke til PostHog. Utvalgte UTM-felt brukes bare ved annonsemålingssamtykke og valideres. Opptaksmaskering kontrolleres også på dekomprimerte nettverkspayloads i nettlesertesten.

## Bevaring av dagens annonsemåling

`analytics.ts`, `marketing-loader.ts`, `marketing-policy.ts`, `marketing-attribution.ts`, `consent.ts` og `consent-client.ts` er uendret. PostHog har eget livsløp og sender aldri til Google/Meta. De to eksisterende klikk-/bookingmodulene kaller PostHog etter de eksisterende leverandørkallene. Feil i PostHog fanges og skal ikke stoppe klikk, navigasjon eller booking.

Samtykkekontrakt, eksisterende informasjonsversjon, Google Ads-destinasjoner, Meta Pixel-ID, bookingvalidering, deduplisering og faktisk trial-konvertering er uendret. Ingen endring i annonser, kampanjer, budsjetter eller optimaliseringsmål inngår. Start gratis-klikk skal aldri merkes som faktisk trial.

## Validering før publisering

- Baseline: publisert `9f22c4c639476fd0c9488353f09042b74ae0badf` (PR #13).
- `npm run test:tracking`: 96 bestått, inkludert 17 nye PostHog-tester.
- Typekontroll og produksjonsbygg; målrettet lint uten feil (eksisterende mønster for Fast Refresh gir advarsler i main.tsx).
- Samme Chromium-forløp kjøres på baseline og nytt produksjonsbygg: fullt samtykke, bare analyse, bare annonsemåling, avslag, eldre samtykke, mobil, blokkert SDK og utrygg URL.
- Google/Meta-payloads sammenlignes etter normalisering av tilfeldige hendelses-ID-er.
- To demoklikk, doble bekreftelser fra samme booking og ett Start gratis-klikk: én booking skal telles.
- PostHog må være stille før samtykke, ved avslag og med eldre samtykke. Sidebytte skal ha én ny sidevisning. Avslag uten nett og påfølgende omlasting skal stoppe PostHog.
- Testene bruker ekte SDK og ferdige byggepakker på simulert produksjonsdomene. PostHog-botfilteret er slått av **kun i testsvaret** fordi automatiserte nettlesere ellers filtreres. Opptaksutvalg settes til 100 % kun i testens nettverkssvar. Produksjonskoden beholder botfilter og 25 % utvalg.
- Alle hendelser, annonseforespørsler, samtykkesvar og bookingbekreftelser fanges opp lokalt. Testene oppretter ingen ekte bookinger eller konverteringer.

Nettlesertesten ligger i `tests/browser/posthog-landing.mjs`. Kjør med `node tests/browser/posthog-landing.mjs` etter et produksjonsbygg. Den bruker Playwright fra lokal installasjon, eller absolutt modulsti i `PLAYWRIGHT_MODULE_PATH`. `POSTHOG_QA_OUTPUT` velger evidensmappe; standard er `/tmp/notably-posthog-qa`. For baseline: sett `POSTHOG_QA_BASELINE_DIST` til et ferdig bygget `dist` fra baseline-commiten, og legg til `--baseline`. Testen endrer ikke nettleserprofilen eller noen ekte samtykker. Sammenligningsresultatet er lagret i `docs/posthog-verification-2026-10-19.json`.

Testfiler og rå evidens fra nettleseren ligger i arbeidsområdets `release-evidence/posthog-landing-2026-10-19/`. Nettlesertesten må vise bestått for alle tilfeller før publisering. En lokal bestått test bekrefter ikke at produksjonsdata er mottatt av PostHog.

## Publisering og tilbakeføring

Endringen publiseres gjennom GitHub-PR og ordinær godkjenning. Prosjektnøkkelen i nettleseren er PostHogs offentlige prosjekt-token; ingen administrativ API-nøkkel brukes. Ingen nye miljøvariabler er nødvendig.

Etter merge: kontroller at Vercel publiserer riktig commit, at landingssiden laster, og at nye samtykkende besøk mottas i EU-prosjektet. Eksisterende brukere begynner ikke automatisk å sende PostHog-data. Vent på faktiske besøk før rapportene vurderes; ikke opprett falske trials eller bookinger for å fylle rapportene.

Ved behov kan denne PR-en tilbakeføres. Det fjerner PostHog-koblingen og den nye informasjonen, mens eksisterende Google/Meta-kode fortsatt er den samme som før endringen. Prosjektrapporter kan beholdes uten ny innsamling.

Referanse: [PostHog: kontroll av datainnsamling](https://posthog.com/docs/privacy/data-collection), [SDK-konfigurasjon](https://posthog.com/docs/libraries/js/config), [opptak og personvern](https://posthog.com/docs/session-replay/privacy).
