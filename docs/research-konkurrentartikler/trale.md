# Trale vs Notably: researchrapport (8. november 2026)

## 1. Produkt, målgruppe, selskap
- Trale er en AI-møteassistent. Den forbereder møter (briefing om deltakerne), transkriberer, oppsummerer og lager oppgaver med ansvarlig og frist. Den lager også utkast til oppfølgings-e-post, synkroniserer til CRM og gir coaching etter samtaler. Tittel på forsiden: «AI-møtereferat, CRM-synk og oppfølging». Kilde: https://trale.ai/no
- Målgruppen er tydeligst salg og kundeoppfølging (CRM-synk, salgs-playbooks, coaching), men også ledere og prosjektteam. Supercompany nevner selv «sales and recruitment teams» (sekundærkilde via søk, supercompany.co). Kilde: https://trale.ai/no og https://trale.ai/no/pricing
- Selskapet er Supercompany AS, Torggata 11, 0181 Oslo. Det markedsføres som «Laget i Norge» og «Bygget i EU». App Store oppgir Supercompany AS som selger. Kilder: https://trale.ai/no, https://trale.ai/no/about, https://apps.apple.com/no/app/trale-ai/id6799740815
- Grunnlagt 2024, og Arash Saidi (Kindly-gründer) nevnes som gründer. Lanseringsartikkelen fra januar 2025 sier at Trale da ble brukt av over 30 selskaper i Skandinavia. Dette er sekundærkilder via websøk og ikke bekreftet på trale.ai. Om-oss-siden oppgir ikke gründere eller årstall. Kilder: https://trale-website.vercel.app/news/7 (sekundær), https://trale.ai/no/about
- Kundelogoer på forsiden: blant annet Atea, Visma, Tripletex, HubSpot og KLP. Kilde: https://trale.ai/no

## 2. Slik fanger Trale møter
- **Bot:** blir med i Google Meet, Microsoft Teams og Zoom. Kilde: https://trale.ai/no
- **Desktop-app uten bot:** finnes for macOS (Apple Silicon og Intel) og Windows (x64 og ARM64). Appen oppdager når et møte starter og tar opp lyd fra maskinen etter ett klikk. Den fanger også WhatsApp-samtaler og kan ta skjermopptak, for eksempel av en demo. Forsiden og oppsummeringssiden nevner macOS 14.2 eller nyere. Kilder: https://trale.ai/no/desktop og https://trale.ai/no/features/summaries
- **Mobil:** kun iPhone. Appen tar opp fysiske møter med telefonen på bordet, men ikke telefonsamtaler. Android står som «Kommer snart til Google Play». Kilde: https://trale.ai/no/mobile
- iOS-appen er et tillegg for eksisterende Trale-brukere med jobb-e-post. Den er gratis, og abonnementet styres fra app.trale.ai. Krever iOS 16.4 eller nyere, versjon 1.0.7, vurdering 5,0 av 3 vurderinger. Kilde: https://apps.apple.com/no/app/trale-ai/id6799740815
- **Opplasting av lydfil:** ukjent. Det nevnes ikke på forsiden, oppsummeringssiden, desktop-siden eller prissiden.

## 3. Plattformer
- Teams, Zoom og Google Meet. Desktop-appen fanger i tillegg alt som spilles av på maskinen, også WhatsApp. Kilder: https://trale.ai/no og https://trale.ai/no/desktop
- Webapp på app.trale.ai. MCP-server for Claude og ChatGPT. Kilde: https://trale.ai/no/mcp (lenket fra forsiden)

## 4. Referatet
- Innhold: møteformål, hovedpunkter med tidsstempel, beslutninger med tidsstempel, temaer og neste steg. Faner for AI-chat, høydepunkter, innsikt, transkripsjon, oppgaver, e-post og playbook. Kilde: https://trale.ai/no/features/summaries
- Oppgaver får ansvarlig og frist, og kan bli oppgaver i HubSpot og Salesforce. Kilde: https://trale.ai/no/features/summaries
- Maler: egne maler per møtetype finnes bare i Business-planen. Kilde: https://trale.ai/no/pricing
- Talere: transkripsjonen i iOS-appen viser talernavn. Business-planen har «speaker memory» som husker talere på tvers av møter. Hvordan selve talerskillet virker, er ikke forklart. Kilder: https://trale.ai/no/mobile og https://trale.ai/no/pricing
- «Spør Trale» er en chat med kildehenvisninger og søk på tvers av alle møter. Den er med i Standard. Kilder: https://trale.ai/no og https://trale.ai/no/pricing
- Andre funksjoner:
  - Keyframes leser innhold som vises på skjermen i møtet (Business).
  - Coaching med poeng per del av møtet (Business).
  - Prosjekter samler møter, filer og oppgaver (Business).
- Deling og eksport: privat lenke som kan deles også utenfor selskapet. Eksport til PDF, DOCX, TXT og MP4. Referatet kan sendes på e-post til deltakerne, manuelt eller automatisk. Kilde: https://trale.ai/no/features/summaries

## 5. Norsk språk
- Grunnsnittet finnes på norsk og engelsk. iOS-appen finnes på norsk bokmål og engelsk. Kilder: https://trale.ai/no og App Store-lenken over
- Transkripsjon og oppsummering støttes på 104 språk ifølge forsiden, og på «100+ språk» ifølge prissiden. Norsk står i språkvelgeren på oppsummeringssiden. Kilder: https://trale.ai/no, https://trale.ai/no/pricing og https://trale.ai/no/features/summaries
- Transkripsjonen gjøres av Gladia (fransk leverandør med en generell flerspråklig modell). Jeg fant ingen dokumentasjon av hvor god transkripsjonen er på norsk eller dialekter. Kvaliteten er derfor ukjent. Kilde: https://trale.ai/no/security

## 6. Personvern og sikkerhet (alt fra https://trale.ai/no/security)
- Data lagres og behandles bare i EU/EØS. Infrastrukturen er AWS, Vercel og Supabase.
- Underleverandører: Gladia (Frankrike) for transkripsjon og Anthropic Claude via AWS Bedrock med EU-inferens for oppsummeringer.
- Kundedata brukes aldri til å trene AI. Dette står også på https://trale.ai/no/mobile.
- GDPR: signert databehandleravtale etter artikkel 28 kan fås på forespørsel. Brudd varsles innen 72 timer.
- SOC 2 Type II gjelder skyleverandørene (AWS, Vercel, Supabase), ikke Trale selv. Forsiden skriver «SOC 2 Type II-infrastruktur». ISO 27001 er under arbeid, styrt via Vanta.
- Penetrasjonstester gjøres av Telenor Cyber Defence (hvor ofte er ikke oppgitt). Automatiske sikkerhetsskanninger kjøres daglig.
- Kryptering: TLS 1.2 og AES-256. SSO (SAML 2.0) og SCIM omtales på sikkerhetssiden, men prissiden legger SSO under Enterprise.
- Admin kan selv sette regler for hvor lenge data lagres og når de slettes. Brukere kan eksportere og slette data. Det står ikke eksplisitt om lydopptak slettes eller hvor lenge de lagres som standard (ukjent). «Konfigurerbar datalagring» står under Business.

## 7. Integrasjoner (https://trale.ai/no/integrations)
| Kategori | Integrasjoner |
|---|---|
| Kalender | Google Calendar, Microsoft Calendar |
| AI | Claude, ChatGPT (MCP) |
| CRM | Lime CRM, HubSpot, Salesforce, Microsoft Dynamics 365, SuperOffice |
| Lagring | Google Drive, OneDrive, SharePoint |
| Kommunikasjon | Gmail, Outlook, Slack, Microsoft Teams |
| Produktivitet | Notion |
| Utvikler | Webhooks |

Toveis CRM-synk og webhooks krever Business. Slack, Notion og Google Drive er med i Standard. Kilde: https://trale.ai/no/pricing

## 8. Pris (https://trale.ai/no/pricing, med månedspris fra schema.org-dataene i sidens HTML)
| Plan | Årlig fakturering | Månedlig fakturering | Innhold |
|---|---|---|---|
| Standard | 299 NOK/bruker/mnd | 349 NOK | Ubegrenset opptakstid, desktop uten bot, oppsummeringer, Spør Trale, MCP, møteforberedelse, Slack/Notion/Drive, 100+ språk, kalendersynk |
| Business («mest populær») | 399 NOK/bruker/mnd | 499 NOK | Alt i Standard, pluss prosjekter, maler, Keyframes, speaker memory, coaching, playbooks, toveis CRM-synk, webhooks, konfigurerbar lagring |
| Enterprise | Etter avtale | Etter avtale | API, SSO, white label, egen Slack-support, SLA |

- Om prisene er med eller uten mva, er ikke oppgitt (ukjent).
- Det finnes ingen gratisplan. Prøveperioden er 7 dager uten kort.
- Volumpris fra 10 brukere. Årsavtale faktureres på forskudd.
- HubSpot-markedsplassen viste en «Essential»-plan til 32,50 USD/mnd. Dette er en sekundærkilde og kanskje utdatert, så den bør ikke brukes. Kilde: https://ecosystem.hubspot.com/marketplace/listing/trale-4309577

## 9. Styrker og svakheter for norske virksomheter
**Styrker:**
- Norsk selskap med norsk grensesnitt og data i EU/EØS.
- Ingen AI-trening på kundedata. Pentest fra Telenor Cyber Defence.
- Desktop-app uten bot for både Mac og Windows, i tillegg til bot i Teams, Zoom og Meet.
- Sterk på salg: CRM-synk med norske systemer som SuperOffice og Lime, coaching og playbooks.
- Møteforberedelse, MCP mot Claude og ChatGPT, og mange eksportformater.
- Standard (299 kr ved årsbetaling) er billigere enn Notably (399 kr).

**Svakheter og forskjeller mot Notably:**
- Ingen Android-app ennå, og iPhone-appen krever en eksisterende Trale-konto.
- Prøveperioden er 7 dager mot Notablys 14.
- På sammenlignbart nivå (maler, CRM-synk) koster Trale 399 kr ved årsbetaling og 499 kr månedlig.
- Opplasting av lydfil er ikke dokumentert.
- Norsk transkripsjon skjer med en generell flerspråklig modell (Gladia), og kvaliteten på norsk er udokumentert.
- Trale har ikke egen SOC 2. Den gjelder bare infrastrukturen, og ISO 27001 er under arbeid.
- Produktet er tydelig rettet mot salg og kan virke tyngre for generelle interne møter.

## 10. Usikkert eller motstridende
- 104 språk (forsiden) mot «100+» (prissiden).
- macOS 14.2+ (forsiden og oppsummeringssiden) mot macOS 12.0+ med M1 (App Store, for iOS-appen på Mac).
- SSO står på sikkerhetssiden som generell funksjon, men på prissiden bare under Enterprise.
- Forsidens «SOC 2 Type II-infrastruktur» kan leses som om Trale selv er sertifisert, men sikkerhetssiden presiserer at det gjelder leverandørene.
- Gründer og kundetall kommer fra sekundærkilder: Arash Saidi og/eller Samuel Nuri, og over 30 selskaper (2025) mot «1000+» i en katalogoppføring.
- Ukjent: mva i prisene, opplasting av lyd, standard lagringstid og sletting av lyd, om iOS-appen virker uten nett, og dokumentert norsk-kvalitet.

## Logo
Filene ligger i `/private/tmp/claude-501/-Users-jorgen--claude-spares-spare-8BmDUC/022cad4c-d7e3-4564-bda2-3c7db7728525/scratchpad/logos/trale/`. Begge er sjekket med `file`.
- **Best:** `trale-appstore-1024.png`. Det er App Store-ikonet hentet via iTunes lookup-API, en PNG på 1024x1024 (RGB). Bakgrunnen er heldekkende svart (#000000), ikke gjennomsiktig. Symbolet er tre overlappende sirkler i avtagende størrelse, i nesten hvitt (ca. #F4F4F4), sentrert.
- **Alternativ:** `trale-icon.svg`, favicon fra trale.ai/icon.svg. Det er samme symbol i vektor, svart fill og gjennomsiktig bakgrunn, i formatet 23x15 og ikke kvadratisk. Det passer når du trenger fargen fritt, for eksempel hvitt på mørk flate.
- **Merkefarge:** monokrom svart og hvitt. Nettsiden bruker også nøytralt grått (#09090B, #71717A). Jeg fant ingen egen aksentfarge.