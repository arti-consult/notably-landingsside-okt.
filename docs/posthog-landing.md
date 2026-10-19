# PostHog på den offentlige landingssiden

## Omfang og rapporter

EU-prosjekt 312060: **Notably – landingsside**.
[Dashboard: Notably – landingsside og demo](https://eu.posthog.com/project/312060/dashboard/1037086).

Dashboardet har åtte rapporter: besøk, handlinger over tid, trafikkilder, besøkte sider, fra besøk til Start gratis, fra besøk til bekreftet demo, knappens plassering og UTM-kampanje. Det siste krever både analyse- og annonsemålingssamtykke. Alle rapportene filtrerer på `site=notably.no`, bruker Europe/Oslo og viser siste 30 dager som utgangspunkt.

Det nye [dashboardet for innhold og brukeropplevelse](https://eu.posthog.com/project/312060/dashboard/1037213) har tolv rapporter: synlige seksjoner, FAQ, kalkulator/kontakt, rulledybde, Start gratis- og demoforløp fordelt på enhet og side, LCP, INP, CLS og besøk med tekniske problemer. Det filtrerer på `measurement_version=2`, slik at eldre delvis målte besøk ikke blandes inn. De åtte opprinnelige rapportene er uendret. Nye rapporter får data etter at denne utvidelsen er publisert og samtykkende besøk er målt.

Native PostHog-heatmaps er lagret for [forsiden](https://eu.posthog.com/project/312060/heatmaps/c7C9PMSc), [regnskapsførersiden](https://eu.posthog.com/project/312060/heatmaps/xjv0VZW6) og [advokatsiden](https://eu.posthog.com/project/312060/heatmaps/UBjM6Kjj). Hver side har ferdig genererte bakgrunner i bredder 375, 390, 425, 768, 1024, 1440 og 1920. Velg karttype og aktuell skjermbredde i Heatmaps. Klikk, pekerbevegelse, rulledybde og signaler om gjentatte eller tilsynelatende resultatløse klikk samles etter SDK-ens regler. En synlig seksjon i fem sekunder er et signal om oppmerksomhet, ikke dokumentert lesing.

Heatmap-data samles fra alle besøk som oppfyller samtykke-, side- og personvernkravene, uten vårt eget prosentutvalg. De er ikke komplette data om alle besøkende: avslag, blokkering, botfiltrering og nettverksfeil gir bortfall. PostHog varsler i prosjektet at gratisplanen begrenses til tre sider fra **15. november 2026**; de tre sidene over ligger i tillattlisten. Reglene er foreløpig ikke håndhevet. Flere sider etter denne datoen krever en vurdering av betalt plan; ingen betalingsplan er endret. Opptak er separat: Session replay beholder 25 % utvalg, minst 5 sekunder og 30 dagers lagring.

| Hendelse | Betydning |
| --- | --- |
| `$pageview` / `$pageleave` | Besøk på en godkjent offentlig side, varighet og rulling |
| `start_trial_click` | Et ekte klikk på Start gratis; **ikke** bekreftet trial |
| `demo_click` | Et ekte klikk som åpner bookingmodalen |
| `demo_booked` | Den eksisterende validerte og dedupliserte bookingbekreftelsen |
| `section_viewed` | Minst halve den synlige seksjonshøyden i aktiv fane i ett sammenhengende sekund; én gang per seksjon og sidevisning |
| `section_engaged` | Samme synlighetskrav i fem sekunder; modal og skjult fane avbryter tidsvinduet |
| `faq_opened` | Brukeren åpner et lukket spørsmål; bare spørsmål-ID, én gang per spørsmål og sidevisning |
| `calculator_used` | Brukeren endrer en kalkulatorskyver; én gang per sidevisning, uten verdier eller resultater |
| `contact_click` | Enterprise-knapp eller offentlig e-post-/telefonlenke; bare kontakttype |
| `landing_error` | Kategori for egen runtime-feil, lokal ressursfeil eller den eksisterende bookingmodalens lastetidsvarsel; ingen feilmelding eller stack |
| `$autocapture` / `$rageclick` / `$dead_click` | Avgrensede klikk på offentlige lenker/knapper; kun strukturell elementplassering, ingen tekst eller lenkeadresse |
| `$web_vitals` | Numeriske LCP/FCP/INP/CLS-målinger, uten DOM- eller nettverksattribusjon |
| `$$heatmap` | SDK-ens koordinater for klikk og pekerbevegelse, med rensede sideadresser |
| `$snapshot` | Maskert opptak av den offentlige siden |

Ingen app-, organisasjons- eller kontoidentitet kobles inn. En tilfeldig identifikator lagres i sessionStorage; besøk i andre faner/enheter blir ikke koblet til samme person. Funnelrapportene gjelder samme fane innen ett døgn. Sidefordelingen bruker siden ved forløpets første steg, som ikke nødvendigvis er øktens opprinnelige inngangsside. Tallene dekker samtykkende besøk, ikke alle besøkende, og følger ikke annonseplattformenes attribusjonsmodell.

Ytelsesrapportene viser 75-persentilen per enhet. Målingene gjelder første sidelasting; de brukes ikke til å tilordne tidligere lastetid til senere SPA-navigasjon. Forsinkede målinger etter et slikt sidebytte forkastes. Feilrapporten teller berørte besøk innenfor de tre avgrensede kategoriene, ikke alle feil i tjenesten. Feil før samtykke/SDK-start eller inne i bookingappen dekkes ikke.

## Samtykke og personvern

SDK-en lastes dynamisk først når begge disse kravene er oppfylt:

1. Eksisterende samtykkeklient har gyldig, serverbekreftet analysesamtykke.
2. Personen har uttrykkelig lagret analysevalget i landingssidens oppdaterte dialog, som informerer om PostHog.

En lokal kvittering knyttes til nøyaktig serverrevisjon, beslutningstid og utløp. Kvitteringen er aldri samtykke alene. Gamle samtykker og nye valg gjort bare i webappen aktiverer ikke PostHog. Eksisterende besøkende får ingen tvungen ny dialog; de kan åpne Personvernvalg og bekrefte der. Dette bevarer dagens Google/Meta-valg og serverkontrakt.

Avslag, manglende lagring, serverfeil, utløpt/endrede samtykker, forhåndsvisninger og ukjente sideadresser stopper PostHog. Tilbaketrekking stopper innsamling og opptak lokalt før serverlagringen forsøkes, også uten nett. Ingen tidligere avviste hendelser spilles av ved senere samtykke.

Skjemaer, alle innfelt-vinduer, bookingmodalen, redigerbare felt, lyd/video og canvas blokkeres i opptak. Tekst og innholds-/URL-attributter maskeres. Offentlige layoutklasser og stiler beholdes, bortsett fra verdier med URL-er eller annonseidentifikatorer. Opptakene har derfor redusert detaljnivå. Konsoll, nettverkspayloads, generell exception capture, surveys og personprofiler er slått av. Autocapture er begrenset til klikk på offentlige knapper/lenker i merkede seksjoner, navigasjon og footer; tekst og attributter maskeres, og bare taggnavn og søskenposisjon tillates gjennom siste filter. IP-adresser fjernes ved mottak i PostHog.

Hendelser har en eksplisitt liste over tillatte egenskaper. Nettadresser mister parametere og fragmenter; henviser begrenses til domenet. `gclid`, `fbclid`, salgshenvisninger, søkeord, navn, e-post og booking-ID sendes ikke til PostHog. Utvalgte UTM-felt brukes bare ved annonsemålingssamtykke og valideres. Opptaksmaskering kontrolleres også på dekomprimerte nettverkspayloads i nettlesertesten.

## Bevaring av dagens annonsemåling

`analytics.ts`, `marketing-loader.ts`, `marketing-policy.ts`, `marketing-attribution.ts`, `consent.ts`, `consent-client.ts`, `trial-clicks.ts`, `demo-tracking.ts` og `demo-modal.ts` er byte-identiske med produksjonsbaseline for denne utvidelsen. PostHog har eget livsløp og sender aldri til Google/Meta. De eksisterende klikk-/bookingmodulene kaller allerede PostHog etter leverandørkallene; dette er uendret. Feil i PostHog fanges og skal ikke stoppe klikk, navigasjon eller booking.

Samtykkekontrakt, eksisterende informasjonsversjon, Google Ads-destinasjoner, Meta Pixel-ID, bookingvalidering, deduplisering og faktisk trial-konvertering er uendret. Ingen endring i annonser, kampanjer, budsjetter eller optimaliseringsmål inngår. Start gratis-klikk skal aldri merkes som faktisk trial.

## Validering før publisering

- Baseline for denne utvidelsen: publisert `e43e6588a699a6be700cb8c7a449a58cabaef108` (PR #14).
- `npm run test:tracking`: 105 bestått, ni flere enn baseline.
- Typekontroll og produksjonsbygg; målrettet lint uten feil (eksisterende mønster for Fast Refresh gir advarsler i main.tsx).
- Samme Chromium-forløp kjøres på baseline og nytt produksjonsbygg: fullt samtykke, bare analyse, bare annonsemåling, avslag, eldre samtykke, mobil, blokkert SDK og utrygg URL.
- Google/Meta-payloads sammenlignes etter normalisering av tilfeldige hendelses-ID-er.
- Alle åtte sammenligninger er identiske. De ni kjernemodulene over er også kontrollert byte for byte.
- Ekte SDK bekrefter strukturelle klikkdata, numeriske web vitals, native rulledybde, prisvisning/oppmerksomhet, FAQ, kalkulator og kontakt. Unit-testene dekker også modal, skjult fane, deduplisering, syntetiske klikk og rensing av feilinnhold.
- To demoklikk, doble bekreftelser fra samme booking og ett Start gratis-klikk: én booking skal telles.
- PostHog må være stille før samtykke, ved avslag og med eldre samtykke. Sidebytte skal ha én ny sidevisning. Avslag uten nett og påfølgende omlasting skal stoppe PostHog.
- Testene bruker ekte SDK og ferdige byggepakker på simulert produksjonsdomene. PostHog-botfilteret er slått av **kun i testsvaret** fordi automatiserte nettlesere ellers filtreres. Opptaksutvalg settes til 100 % kun i testens nettverkssvar. Produksjonskoden beholder botfilter og 25 % utvalg.
- Alle hendelser, annonseforespørsler, samtykkesvar og bookingbekreftelser fanges opp lokalt. Testene oppretter ingen ekte bookinger eller konverteringer.

Nettlesertesten ligger i `tests/browser/posthog-landing.mjs`. Kjør med `node tests/browser/posthog-landing.mjs` etter et produksjonsbygg. Den bruker Playwright fra lokal installasjon, eller absolutt modulsti i `PLAYWRIGHT_MODULE_PATH`. `POSTHOG_QA_OUTPUT` velger evidensmappe; standard er `/tmp/notably-posthog-qa`. For baseline: sett `POSTHOG_QA_BASELINE_DIST` til et ferdig bygget `dist` fra baseline-commiten, og legg til `--baseline`. Testen endrer ikke nettleserprofilen eller noen ekte samtykker. Sammenligningsresultatet for utvidelsen er lagret i `docs/posthog-enhancements-verification-2026-10-19.json`; den eldre verifikasjonsfilen dokumenterer første PostHog-installasjon.

Testfiler og rå evidens fra denne utvidelsen ligger i arbeidsområdets `release-evidence/posthog-enhancements-2026-10-19/`. Nettlesertesten må vise bestått for alle tilfeller før publisering. En lokal bestått test bekrefter ikke at produksjonsdata er mottatt av PostHog.

## Publisering og tilbakeføring

Endringen publiseres gjennom GitHub-PR og ordinær godkjenning. Prosjektnøkkelen i nettleseren er PostHogs offentlige prosjekt-token; ingen administrativ API-nøkkel brukes. Ingen nye miljøvariabler er nødvendig.

Etter merge: kontroller at Vercel publiserer riktig commit, at landingssiden laster, og at nye samtykkende besøk mottas i EU-prosjektet. Eksisterende brukere begynner ikke automatisk å sende PostHog-data. Vent på faktiske besøk før rapportene vurderes; ikke opprett falske trials eller bookinger for å fylle rapportene.

Ved behov kan denne utvidelsen tilbakeføres til PR #14. Det fjerner de nye målingene og informasjonsteksten, mens den opprinnelige PostHog-integrasjonen og eksisterende Google/Meta-kode beholdes. Prosjektrapporter kan beholdes. Prosjektflagg for autocapture, web vitals og dead clicks er aktivert for å støtte den nye, eksplisitt avgrensede SDK-konfigurasjonen; baseline har disse slått av i klienten og begynner ikke å samle dem ved tilbakeføring.

Referanse: [PostHog: kontroll av datainnsamling](https://posthog.com/docs/privacy/data-collection), [SDK-konfigurasjon](https://posthog.com/docs/libraries/js/config), [opptak og personvern](https://posthog.com/docs/session-replay/privacy).
