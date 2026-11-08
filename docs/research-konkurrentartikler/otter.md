# Otter.ai: faktagrunnlag for "Otter.ai vs Notably"

Kildene er hentet 8. november 2026. Det meste kommer fra Otters egne sider (otter.ai/pricing, otter.ai/privacy-policy, otter.ai/privacy-security, otter.ai, Apple App Store NO). Otters help center svarte 403 da jeg prøvde å hente det direkte. Det jeg oppgir derfra kommer fra søkeresultater som gjengir artiklene der. Sekundærkilder er merket med (SEK).

## 1. Produkt, målgruppe og selskap
- Otter kaller seg "the world's only Conversational Knowledge Engine". Det er en AI-notatskriver som gjør møter om til søkbar kunnskap, fra brief før samtalen til oppfølging etterpå. Kilde: https://otter.ai
- Målgruppe: salg, utdanning og medier har egne sider. Otter retter seg også mot enterprise, og har en gratisplan for enkeltpersoner og små team. Kilde: https://otter.ai
- Selskap: Otter.ai, Inc., 800 W El Camino Real, Suite 170, Mountain View, CA 94040, registrert i Delaware, USA. Kilde: https://otter.ai/privacy-policy
- Grunnlagt i 2016 av Sam Liang og Yun Fu, opprinnelig under navnet AISense (SEK: https://sacra.com/c/otter/ og https://aiwiki.ai/wiki/otter_ai).
- Over 100 millioner USD i årlig gjentakende inntekt (ARR), ifølge Otters egen pressemelding: https://www.businesswire.com/news/home/20250325249430/en
- Antall brukere er oppgitt til over 25 millioner (SEK: Sacra og NPR) og 35 millioner+ (SEK, aggregatorer). Det eksakte tallet er usikkert.

## 2. Hvordan Otter fanger møter
Kilde for hele punktet: https://otter.ai og https://otter.ai/pricing
- **Bot:** "AI Notetaker" (tidligere OtterPilot) blir med i møtet som deltaker.
- **Uten bot:** desktop-app for Mac og Windows, og en Chrome-utvidelse for opptak i nettleseren.
- **Mobil:** apper for iOS og Android.
- **Opplasting av fil:** import av lyd og video. Gratisplanen har 3 importer totalt, Pro har 10 per måned, Business har ubegrenset.
- **Fysiske møter:** forsiden nevner det ikke eksplisitt. Mobilappen tar opp lyd direkte (appen heter "Otter Transcribe Voice Notes"), så det fungerer i praksis. Det er en slutning fra appen, ikke en påstand fra Otter.

## 3. Plattformer
- Zoom, Microsoft Teams og Google Meet. Kilde: https://otter.ai/pricing
- Webex er ikke nevnt på Otters sider. Status: ukjent.

## 4. Referatet
Kilde: https://otter.ai og https://otter.ai/pricing
- Sammendrag med beslutninger, handlingspunkter og innsikt. Handlingspunkter fanges og tildeles automatisk.
- Maler: "advanced meeting templates" fra Pro. Egne AI-arbeidsflyter fra Business.
- Talergjenkjenning er med på alle planer.
- Otter AI Chat lar deg spørre på tvers av møter og tilkoblede apper. Kvoten er begrenset: Basic 20 spørsmål per måned (3 per samtale), Pro 50, Business og Enterprise 200 per bruker.
- Andre funksjoner: Live-Assist (sanntidscoaching i samtalen), brief før samtalen, Channels (møter gruppert per team eller prosjekt), MCP-server for ChatGPT og Claude, og "Otter Sales Notetaker" på Enterprise.

## 5. Norsk språk
- Transkripsjon på seks språk: engelsk, spansk, fransk, tysk, japansk og kinesisk (mandarin, forenklet skrift). Tysk og kinesisk er i beta.
  - Help center-artikkelen "Transcribe conversations in English, Spanish, French, German, Japanese, or Chinese (Simplified)": https://help.otter.ai/hc/en-us/articles/26660468516631 (innhold sett via søk)
  - Prissiden lister de samme seks språkene: https://otter.ai/pricing
- **Norsk støttes ikke.** Norsk står ikke i noen offisiell språkliste.
- Otter transkriberer bare ett språk om gangen, og språket må velges før opptaket starter. Eneste unntak er fransk, som kan bytte automatisk til engelsk (samme help center-artikkel).
- Grensesnittet er bare på engelsk, ifølge App Store NO: https://apps.apple.com/no/app/id1276437113
- Om sammendrag kan lages på norsk fra engelsk lyd: ukjent. Jeg fant ikke noe som sier det.

## 6. Personvern
- **Lagring:** AWS, "based in the United States". Kilde: https://otter.ai/privacy-policy
  - Region us-west oppgis bare i sekundærkilder (SEK: https://www.simpleanalytics.com/is-gdpr-compliant/otter-ai). En annen sekundærkilde sier us-east-1. Eksakt region er usikker.
  - Ingen dokumentert EU-region (SEK: https://www.happyscribe.com/blog/european-alternatives-to-otter-ai).
- **AI-trening:** ja. Personvernerklæringen lister "training our proprietary AI technology on de-identified audio recordings and on transcriptions" som formål, og nevner at transkripsjoner "may contain Personal Information". Kilde: https://otter.ai/privacy-policy
  - Kundedata brukes ikke til å trene tredjeparts AI-leverandører, ifølge https://otter.ai/privacy-security
  - Om det finnes en reservasjonsmulighet (opt-out): ukjent. Sidene beskriver ingen, og sekundærkildene sier imot hverandre.
- **Overføring fra EU til USA:** EU-U.S. Data Privacy Framework (med UK- og Sveits-utvidelser) og standardavtaleklausuler (SCC). Kilde: https://otter.ai/privacy-policy
- **GDPR:** Otter sier de har "incorporated GDPR standards into data practices". Om det finnes en egen databehandleravtale (DPA) står ikke på sikkerhetssiden: ukjent. Kilde: https://otter.ai/privacy-security
- **Sertifiseringer:**
  - SOC 2 Type 2 (https://otter.ai/privacy-security, og pressemelding fra 2023).
  - Rutinene er "basert på" rammeverket ISO 27001/2. Det er ingen påstand om ISO-sertifisering.
  - HIPAA er et tillegg på Enterprise (https://otter.ai/pricing).
- **Kryptering:** AWS S3 med serverside-kryptering AES-256. Kilde: https://otter.ai/privacy-security
- **Sletting:** slettede samtaler ligger i papirkurven og slettes automatisk etter 30 dager, eller med en gang hvis brukeren tømmer papirkurven selv. Kilde: https://otter.ai/privacy-security
- **Søksmål:** gruppesøksmålet Brewer mot Otter.ai ble anlagt 15. august 2025 i Northern District of California. Det påstår at boten tar opp møtedeltakere uten samtykke og bruker opptakene til AI-trening. Otter svarer at brukerne selv har ansvaret for å innhente tillatelse. Kilde: https://www.npr.org/2025/08/15/g-s1-83087/otter-ai-transcription-class-action-lawsuit (SEK, nyhet). Status i dag: ukjent.

## 7. Integrasjoner
- Slack, Zoom, Salesforce, HubSpot, Claude, Google Drive, Dropbox, Google Calendar, Google Docs, Google Meet, Jira, Notion, Glean og Asana. Kilde: https://otter.ai
- Zapier fra Pro. Salesforce og HubSpot fra Pro, med brukergrenser.
- API, webhooks og AI Chat mot Gmail, Drive, Notion og Jira bare på Enterprise. Kilde: https://otter.ai/pricing

## 8. Pris (USD per bruker)
Kilde: https://otter.ai/pricing

| | Basic | Pro | Business | Enterprise |
|---|---|---|---|---|
| Pris per måned, årlig betaling | Gratis | 8,33 | 19,99 | Etter avtale |
| Pris per måned, månedlig betaling | Gratis | 16,99 | 30 | Etter avtale |
| Møteminutter per måned | 300 | 1 200 | Ubegrenset | Ubegrenset |
| Maks lengde per samtale | 30 min | 90 min | 4 timer | 4 timer |

- Prissiden viser også rabattert Pro-pris (4,17 og 8,49 USD), men den gjelder bare med indisk kredittkort.
- Business månedlig vises med kampanjepris 24 USD.
- Basic har 1x avspilling og eksport bare til mp3 og txt.
- Enterprise krever minst 100 brukere for SSO/SCIM.
- Studentrabatt: 20 % på Pro.
- **App Store Norge (NOK, kjøp i appen):**
  - Pro: 199 eller 205 kr per måned, 1 290 kr per år.
  - Business: 399 kr per måned, 2 990 kr per år.
  - Kilde: https://apps.apple.com/no/app/id1276437113

## 9. Styrker og svakheter for norske virksomheter

**Styrker** (rettferdig vurdert):
- Stor og moden aktør med over 100 millioner USD i ARR.
- Mange måter å ta opp på: bot, desktop uten bot, Chrome-utvidelse, iOS, Android og filimport.
- Sjenerøs gratisplan.
- Lav pris på Pro.
- Sterke CRM- og salgsfunksjoner (Salesforce, HubSpot, Sales Notetaker).
- Chat på tvers av møter, og MCP-integrasjon.
- SOC 2 Type 2.
- Mobilapp med god vurdering (4,5 i App Store NO).

**Svakheter:**
- Ingen norsk transkripsjon.
- Grensesnittet er bare på engelsk.
- Ett språk per møte, valgt på forhånd.
- Data lagres i USA, uten dokumentert EU-region.
- Trener egne modeller på avidentifiserte kundeopptak og transkripsjoner, uten dokumentert opt-out.
- Pågående søksmål om samtykke ved opptak.
- Kvoter på AI Chat.
- Begrenset lengde per samtale på de rimelige planene (30 og 90 minutter).

## 10. Usikkert eller motstridende
- **Antall språk:** prissiden og help center sier 6. Eldre markedsføringssider og noen sekundærkilder sier 3 eller 4.
- **AWS-region:** us-west eller us-east-1. Otter oppgir bare "United States".
- **Opt-out fra AI-trening:** sekundærkildene sier imot hverandre. Otters egne sider nevner ingen opt-out.
- **Brukertall:** 25 millioner eller 35 millioner+.
- **Hovedkontor:** Mountain View (personvernerklæringen) eller Los Altos (SEK).
- **Andre ukjente:** DPA, Webex-støtte, og om sammendrag kan lages på andre språk enn det som snakkes.
- **Pris i App Store:** to ulike månedspriser for Pro (199 og 205 kr) står samtidig.

## LOGO
Mappe: /private/tmp/claude-501/-Users-jorgen--claude-spares-spare-8BmDUC/022cad4c-d7e3-4564-bda2-3c7db7728525/scratchpad/logos/otter/

- **Best: `apple-touch-icon.png`**, 256x256 PNG med gjennomsiktig bakgrunn. Kilde: otter.ai, Webflow CDN. Inneholder bare symbolet: en blå ring med lydbølgestreker. Symbolet er lite i forhold til lerretet, så det bør beskjæres eller skaleres.
  - /private/tmp/claude-501/-Users-jorgen--claude-spares-spare-8BmDUC/022cad4c-d7e3-4564-bda2-3c7db7728525/scratchpad/logos/otter/apple-touch-icon.png
- **Alternativ: `appstore-icon-1024.png`**, 1024x1024, uten gjennomsiktighet. Hvit til lysegrå avrundet flis med blått symbol, glød og 3D-effekt. Kilde: App Store.
  - /private/tmp/claude-501/-Users-jorgen--claude-spares-spare-8BmDUC/022cad4c-d7e3-4564-bda2-3c7db7728525/scratchpad/logos/otter/appstore-icon-1024.png
- `favicon.png` er 32x32 og ikke egnet.
- **Merkefarge:** blå #007AFF, målt fra pikslene i symbolet.