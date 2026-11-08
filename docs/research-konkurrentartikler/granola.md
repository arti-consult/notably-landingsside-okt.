# Granola: fakta til «Granola vs Notably» (research 8. nov 2026)

De fleste opplysningene kommer fra Granolas egne sider. Der jeg har brukt andre kilder, står det «sekundærkilde».

## 1. Produkt, målgruppe, selskap
- Granola beskriver seg som «AI notepad for back-to-back meetings». Den synker med kalenderen, lager et kort notat før møtet (Brief), forbedrer notatene dine og gir handlingspunkter og oppfølging etterpå. Kilde: https://www.granola.ai
- Målgruppen er travle fagfolk, særlig innen salg, produktledelse og startups. Forsiden viser kundelogoer fra PostHog, Intercom, Figma, Brex, Ramp, Linear og Vercel. Kilde: https://www.granola.ai
- Selskapet heter Granola Inc (selgernavn i App Store). Det omtales som London-basert, og det er bare sekundærkilder som sier det.
  - Sekundærkilde: Series C på 125 mill. USD i mars 2026, ledet av Index Ventures, til en verdsettelse på 1,5 mrd. USD. Kilde: https://www.implicator.ai/granola-raises-125-million-at-1-5-billion-valuation-for-ai-notetaker.md
  - Sekundærkilde: Series A på 20 mill. USD i 2024 og Series B på 43 mill. USD i 2025. Kilder: https://siliconcanals.com/?p=55810 og https://simplify.jobs/c/Granola
  - Gründere er ikke bekreftet.

## 2. Slik fanger Granola møter
- **Ingen bot.** Desktop-appen for macOS og Windows tar opp systemlyd og mikrofon lokalt. Opptaket starter først når du åpner et notat. Kilder: https://www.granola.ai og https://docs.granola.ai/help-center/taking-notes/transcription
- **Mobilapp.** Den finnes for iOS og Android, og det finnes en Apple Watch-app. Mobilappene er laget for fysiske møter og telefonsamtaler. De kan ikke fange lyd fra Zoom, Meet og lignende på telefonen, fordi operativsystemet ikke tillater det. Kilder: https://www.granola.ai, https://docs.granola.ai/help-center/feature-requests og https://docs.granola.ai/help-center/ios/apple-watch
- **Ingen opplasting av lydfil.** Granola sier de ikke har planer om å støtte lyd- eller videoopptak. Kilder: https://docs.granola.ai/help-center/taking-notes/transcription og https://docs.granola.ai/help-center/feature-requests
- **Samtykke er brukerens ansvar.** Siden ingen bot blir med, får ikke de andre deltakerne noe varsel. Granola anbefaler å informere dem. Kilde: https://docs.granola.ai/help-center/consent-security-privacy/security-privacy-data-faqs

## 3. Plattformer
- Granola virker med Zoom, Google Meet, Microsoft Teams, Slack Huddles og andre møteapper, fordi den tar opp lyden på maskinen. Kilde: https://www.granola.ai
- Kalendersynk støttes for Google og Microsoft/Outlook, men ikke Apple Kalender. Kilde: https://docs.granola.ai/help-center/feature-requests
- Ingen webapp er nevnt. Om Linux eller nettleser støttes: ukjent.

## 4. Referatet
- **Maler:** Det finnes egne maler, og ifølge en oppdatering 29 ferdige. Egne maler lages bare på desktop. Man kan ikke velge en annen standardmal enn «auto». Kilder: https://docs.granola.ai/help-center/taking-notes/customise-notes-with-templates og https://docs.granola.ai/help-center/feature-requests
- **Handlingspunkter og oppfølging:** Ja. Oppfølgings-e-post krever Business-planen. Kilder: https://www.granola.ai og https://www.granola.ai/pricing
- **Beslutninger som egen seksjon:** ukjent.
- **Talergjenkjenning:**
  - På desktop vises navnet på hver deltaker for Meet, Zoom og Teams når dette er satt opp. Ellers står det bare «Me» og «Them».
  - Mobilappen skiller talere i fysiske møter.
  - Kilde: https://docs.granola.ai/help-center/taking-notes/transcription
- **Transkripsjonen kan ikke redigeres.** Kilde: https://docs.granola.ai/help-center/feature-requests
- **Chat på tvers av møter:** Ja. På gratisplanen bare i «Auto mode». Business gir valg av modell og tilgang via MCP, slik at Claude, ChatGPT og Cursor kan lese møtenotatene. Kilder: https://www.granola.ai/pricing og https://www.granola.ai

## 5. Norsk språk
- **Desktop:** 31 språk, og «Norwegian» er med. Det står ikke om dette betyr bokmål eller nynorsk.
- **Mobil (iOS og Android):** 17 språk, og norsk er ikke med. For fysiske møter, som går via mobilappen, er det altså ikke norsk transkripsjon.
- **Notatspråk:**
  - På desktop styres det av innstillingen «Summary language». Står den på English, blir notatene på engelsk uansett hvilket språk som ble snakket. Står den på Auto, brukes språket det ble snakket mest på.
  - På mobil velges majoritetsspråket automatisk.
- Kilde for punktene over: https://docs.granola.ai/help-center/customising-granola/multi-language
- **Grensesnittet** er bare på engelsk. App Store i Norge oppgir bare språket EN (sjekket via iTunes lookup-API, id 6739429409).
- **Motstridende tall:** Hjelpesenteret lister 31 språk. En sekundærkilde nevner en utvidelse til 32 språk i september 2026 (https://www.createwith.com/tool/granola/updates/granola-multi-language-support-expands-ai-meeting-notes-to-32-languages). Eldre anmeldelser sier rundt 10 språk, og eldre FAQ-er sier at notatene alltid er på engelsk. Begge deler ser utdatert ut.

## 6. Personvern
- **Lagring:** All data ligger hos AWS i USA. Sitat: «We do not offer EU, UK, or other regional data residency at this time.» Kilder: https://docs.granola.ai/help-center/consent-security-privacy/security-privacy-data-faqs og https://www.granola.ai/security
- **Underleverandører:** Transkripsjon via Deepgram og AssemblyAI, oppsummering via OpenAI og Anthropic. Disse har ikke lov til å trene på dataene. Kilde: https://www.granola.ai/security
- **Trening på kundedata:**
  - På Free og Business kan anonymiserte data brukes til Granolas egne modeller som standard. Hver bruker kan reservere seg.
  - På Enterprise er trening av som standard, og det gjelder hele organisasjonen.
  - Kilder: https://docs.granola.ai/help-center/consent-security-privacy/security-privacy-data-faqs og https://www.granola.ai/security
- **Sertifiseringer:** SOC 2 Type II siden juli 2025. ISO er ikke nevnt (ukjent). HIPAA-arbeidsområder finnes bare på Enterprise. Kilder: https://www.granola.ai/security og https://www.granola.ai/pricing
- **GDPR:** Det finnes en standard databehandleravtale (DPA) med EU- og UK-standardklausuler (SCC), på go.granola.so/dpa. Egne DPA-er tilbys ikke. Kilde: https://docs.granola.ai/help-center/consent-security-privacy/security-privacy-data-faqs
- **Lyd:** Lyden slettes etter transkripsjonen, både hos Granola og hos tredjeparter. Notater og transkripsjoner beholdes på ubestemt tid, med mindre man setter opp automatisk sletting. Kilde: samme FAQ som over.

## 7. Integrasjoner
- **Business:** Slack, Notion, HubSpot, Attio, Affinity og Zapier, i tillegg til API og MCP.
- **Enterprise:** Salesforce.
- **Uklart om Slack er med på gratisplanen:** Prissiden lister Slack under Basic, mens en plan-tabell på Granolas egen blogg sier nei (https://www.granola.ai/blog/granola-free-vs-paid-features-each-plan).
- **Eksport er manuell:** Hvert notat må sendes for seg, og det må gjøres fra desktop. Kilder: https://www.granola.ai/blog/granola-integrations-complete-guide-connecting-meeting-tools og https://docs.granola.ai/help-center/feature-requests
- Kilde: https://www.granola.ai/pricing

## 8. Pris
Alle priser er i USD per bruker per måned. Prissiden viste ingen årspris.

| Plan | Pris | Innhold |
|---|---|---|
| Basic | 0 USD | Ubegrenset antall notater, men bare 30 dagers historikk. Ingen integrasjoner bortsett fra den uklare Slack-tilgangen. Ingen API, Brief før møter eller oppfølgings-e-post. |
| Business | 14 USD | Ubegrenset historikk og integrasjoner. |
| Enterprise | 35 USD | Pålogging med SSO (krever minst 50 brukere), SCIM, Salesforce, sentral styring av lagringstid og HIPAA-arbeidsområder. |

Kilde: https://www.granola.ai/pricing

## 9. Styrker og svakheter
**Styrker:**
- Ingen bot i møtet, noe som gir diskré bruk.
- Ryddig og enkelt grensesnitt der egne notater blandes med AI-notatene.
- Bred plattformstøtte: Mac, Windows, iOS, Android og Apple Watch.
- Lav pris og en gratisplan.
- Sterk chat på tvers av møter og MCP-tilgang.
- SOC 2 Type II.
- Lyden lagres ikke.
- Stor og godt finansiert aktør med mange kjente tech-kunder.

**Svakheter for norske virksomheter:**
- Data lagres bare i USA, uten mulighet for EU-lagring.
- Ingen norsk transkripsjon på mobil, og dermed ikke i fysiske møter.
- Grensesnittet er bare på engelsk.
- Notatene blir på engelsk hvis språkinnstillingen ikke er endret.
- Trening på anonymiserte data er på som standard på Free og Business.
- Ingen opplasting av lydfil, og transkripsjonen kan ikke redigeres.
- Deltakerne får ikke noe varsel, så brukeren må selv sørge for samtykke.
- Det må stå en datamaskin i møtet for digitale møter, og ingen bot kan ta opp møter du ikke selv er med i.
- Gratisplanen har bare 30 dagers historikk.

## 10. Usikkert eller motstridende
- Antall språk: 31, 32 eller rundt 10, avhengig av kilde. I tillegg er det uklart om «Norwegian» betyr bokmål.
- Om Slack er med på Basic.
- Opt-out fra trening: én blogg sier at Enterprise har det av som standard for hele organisasjonen. Hjelpesenteret omtaler opt-out per bruker på Business. En sekundærkilde (Voibe) hevder at opt-out bare gjelder fremtidige data, og det er ikke bekreftet.
- Total finansiering: anslagene spriker mellom 171 og 192 mill. USD.
- Gründere og hovedkontor er ikke bekreftet fra primærkilde.
- Om det finnes årspris med rabatt: ukjent.

## Logo
Alle filene ligger i `/private/tmp/claude-501/-Users-jorgen--claude-spares-spare-8BmDUC/022cad4c-d7e3-4564-bda2-3c7db7728525/scratchpad/logos/granola/`. Alle er sjekket med `file` og sett på med Read.

- **Best: `favicon-from-svg-1024.png`**, 1024×1024 PNG. Det er PNG-bildet som lå inne i granola.ai/favicon/favicon.svg. Ikonet er kvadratisk med skarpe hjørner og har ingen glans.
- `favicon.svg`: original-SVG-en, som bare er en innpakning rundt en PNG og ikke ekte vektorgrafikk.
- `appstore-icon-1024.png`: 1024×1024 fra App Store. Det har avrundede hjørner med glans og lys kant, og er dårligere til gjenbruk.
- `apple-touch-icon.png`: 180×180, samme motiv.

Motivet er en håndtegnet spiral i nesten svart (cirka #1F1F1F) på en heldekkende gulgrønn bakgrunn. Bakgrunnen er ikke gjennomsiktig. Merkefargen er gulgrønn, cirka **#B2C248**. Fargen er målt på pikselen i hjørnet, og målingen er omtrentlig.