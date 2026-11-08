# Konkurrentanalyse: forsider for AI-møteassistenter

Laget 6.11.2026 som grunnlag for ny forside på notably.no.

## Om materialet

Skjermbilder i denne mappen:

| Konkurrent | Hero desktop (1440x900) | Full side (1440 bred) | Hero mobil (390x844) | Ekstra |
|---|---|---|---|---|
| Granola | `granola-hero-desktop.png` | `granola-full.png` (14 392 px) | `granola-hero-mobil.png` | |
| Trale | `trale-hero-desktop.png` | `trale-full.png` (13 842 px) | `trale-hero-mobil.png` | `trale-scroll-steg.jpg`, `trale-scroll-sitat.jpg` |
| Wispr Flow | `wispr-hero-desktop.png` | `wispr-full.png` (kuttet ved 16 000 px) | `wispr-hero-mobil.png` | `wispr-scroll-detaljer.jpg`, `wispr-scroll-what-did-i-miss.jpg` |
| Otter | `otter-hero-desktop.png` | `otter-full.png` (11 180 px) | `otter-hero-mobil.png` | |
| Dara | mangler | mangler | mangler | |

Metode: headless Chrome styrt via DevTools-protokollen. Mobil er emulert som iPhone (390 bred), fordi `--window-size=390,...` i vanlig headless-modus klipper siden. Cookie-bannere er avvist der knappen kunne trykkes. Siden scrollet gjennom før fullside-bildet ble tatt, så animasjoner skulle trigges.

Kjente svakheter:
- **Dara (meetdara.no) var nede hele økten.** Både herfra og fra WebFetch: tidsavbrudd eller «connection refused» mot Vercel-IP-ene, og Internet Archive var også nede. Dara-delen bygger derfor på det vi dokumenterte i `docs/research-bygg-og-anlegg.md` (oktober 2026). Ta skjermbilder på nytt når siden er oppe.
- Scroll-låste seksjoner blir tomme flater i fullside-bildene (Wispr og Trale). Derfor finnes de ekstra `*-scroll-*.jpg`-bildene, som viser tilstanden midt i en scroll.
- Wispr-banneret på mobil (Usercentrics) ligger i shadow DOM og kunne ikke avvises. Det dekker nedre halvdel av `wispr-hero-mobil.png`.

---

## 1. Granola (granola.ai)

**Hero**
- Overskrift: «The AI notepad for back-to-back meetings»
- Underoverskrift: «Notes, actions and memory. Without a meeting bot.»
- Over overskriften: merkelapp «New · Voice typing by Granola →»
- CTA: «Download for free» (desktop). På mobil: «Download for iOS» som primær og «Get the Desktop app» som sekundær. Under: «Available for macOS, Windows, iOS, Android».
- Nav: Features, Enterprise, Pricing, Blog, Careers, «Talk to sales», «Download».

**Vinkling:** Et notatblokk du skriver i selv, som AI gjør ferdig. To ting skiller dem ut: ingen bot i møtet, og at notatene er dine og private som standard. Produktet er laget for folk med mange møter etter hverandre, ikke for en organisasjon.

**Seksjonsrekkefølge**
1. Hero med app-vindu («Q3 GTM sync») og videomøte ved siden av
2. «Effortless notes, enhanced instantly.» Tre linjer med ikon: ingen bot, privat som standard, virker med Zoom/Meet/Teams
3. «For the doers» i enorm serif, så mørk logovegg «Trusted by teams we admire» (PostHog, Intercom, Figma, Brex, Ramp, Replit, Lovable, Cursor, Bumble, Asana, Vanta, Linear)
4. «Granola helps you before, during and after your meetings.» Låst sidemeny (Before / In / After the meeting) mens tre mockups scroller forbi
5. Granola Chat: «Perfect meeting memory», på limegrønn flate med en tom chat-boks
6. Mørk sitatseksjon: «Helping busy people through busy days». 4,96 av 5 fra 14 678 vurderinger i App Store, og sitatkarusell med svart-hvitt-portretter (Linear-CEO, a16z, Vercel-CEO, Menlo, Nat Friedman)
7. «Works everywhere you do, how you do». Fem rader, hver med tittel til venstre, én setning til høyre og stort bilde under: «Humans in the room, not bots», alle møteapper, privat som standard, «Made for in-person meetings too», kalendersynk
8. MCP: «Use your meeting notes anywhere». Logoband med AI-verktøy
9. Pris-teaser: «Unlimited meeting notes for free» (oppgrader for å se notater eldre enn 30 dager)
10. Footer med enormt ordmerke

**Visuelt:** Lys, nesten hvit bunn. Stor, litt skjev serif i overskriftene og nøytral grotesk i brødtekst. Limegrønt som eneste sterke farge, og mørk oliven på knappene. Mockupene ligger oppå naturfoto (fjell, sjø) eller risograf- og halvtone-kunst. Sidene veksler mellom lyse og mørke flater. Videomøtene viser ekte ansikter.

**Animasjoner og interaksjoner:** Hero-mockupen skriver seg selv: notatlinjer dukker opp, og «Transcribing» skifter til «Enhancing notes». Sidemenyen før/under/etter er scroll-låst med fremdriftslinjer. Sitatene er en horisontal karusell, og MCP-logoene ruller som et bånd.

**Sosialt bevis:** Logovegg med 12 kjente teknologiselskaper, App Store-snitt med antall vurderinger, og sitater fra navngitte toppledere og investorer med foto.

**CTA og pris:** «Download for free» gjentas etter nesten hver seksjon. Ingen kronebeløp på forsiden, bare «gratis, oppgrader for historikk» og «View pricing».

**Fungerer godt**
- Underoverskriften sier tre substantiv og én innvending på ni ord.
- Mobil-CTA-en tilpasser seg enheten («Download for iOS»).
- Hver funksjon får én rad med én setning og ett stort bilde. Lett å skumlese.

**Fungerer dårlig**
- «For the doers» og «Helping busy people through busy days» er fyll.
- Chat-seksjonen viser en tom boks, ikke et svar.
- Cookie-modalen midt i heroen dekker overskriften på både desktop og mobil.

---

## 2. Trale (trale.ai/no)

**Hero**
- Overskrift: «En komplett løsning for hvert møte» (to linjer, forskjøvet)
- Underoverskrift: «Trale tar seg av forberedelsene, notatene og oppfølgingen. Du bare tar møtet.»
- CTA: «Kontakt oss» (primær, hvit) og «Se hvordan det fungerer» (sekundær)
- Nav: Ressurser, Priser, NO/EN, «Prat med oss», «Logg inn»

**Vinkling:** Norsk «alt-i-ett» med bedriftspreg. Tre ting går igjen: møteforberedelse, oppgaver med ansvarlig og frist, og synk til CRM med salgscoaching. Sikkerhet og norske kunder kommer tidlig. Siden er salgsledet («Kontakt oss», «Book et møte»).

**Seksjonsrekkefølge**
1. Hero på nattblå himmel med AI-malt landskap (fyrtårn, by, fjell) og app-skjermbilde («God ettermiddag, Marcus.»)
2. Funksjonsrad i versaler: Møteforberedelse, Oppsummeringer, CRM-synk, Spør Trale, Coaching, Prosjekter, Oppgaver
3. «Innebygd sikkerhet i bedriftsklasse.» Tre glasskort: «100 % EU-data», «Uavhengig testet av Telenor Cyber Defence», «SOC 2 Type II-infrastruktur»
4. Logovegg med 23 norske kunder (Atea, Visma, Tripletex, KLP, HubSpot, SuperOffice, Volvat, Aprila Bank, UiA, Standard Norge m.fl.)
5. «Fra første ord til oppfølgingen.» Låst stegmeny (Fanger opp / Lager oppgaver / Følger opp) med knappen «Book et møte». Linjene til høyre går fra grå til svart mens du scroller.
6. To kort: «Vit hvem du møter» og «Spør om alle møtene dine og få svaret med kilder»
7. «Hver oppgave får en ansvarlig og en frist.»
8. Prosjekter: «Hvert møte og hver fil samlet på ett sted»
9. Sitat fra SWMS
10. «Oppfølgingen er klar når samtalen er over.»
11. Coaching: «Tilbakemelding på hver samtale, hentet fra samtalen selv» (score per seksjon, teamsnitt)
12. «Uansett hvor du jobber. Alt du trenger er å møte opp.» Tre kort: Skrivebordsapp (uten bot), På telefonen, I Claude og ChatGPT
13. Stort sitat fra Reodor Studios med portrett. Ordene fylles inn ett for ett mens du scroller.
14. «Trale snakker språket ditt. Du trenger ikke endre noe.» 104 språk, alle møteplattformer, MCP
15. Auto-synk: «Aldri registrer data manuelt igjen». Integrasjonsikoner og samtaleliste, og sitat fra Placepoint
16. Avslutning: «Møt smartere. Følg opp raskere.» med gratis nedlasting for macOS

**Visuelt:** Hero og avslutning har mørk blå natt, ellers er bunnen lys grå-hvit. Overskriftene er i Playfair-aktig serif, forskjøvet over to linjer, og brødteksten i Inter-aktig grotesk. Illustrasjonene er AI-malte landskap i Ghibli-stil (enger, vandrere, fyrtårn) bak skjermbildene. Appvisningene er mørke. Navigasjonen er en flytende glass-pille.

**Animasjoner og interaksjoner:** Scroll-låst stegmeny med prikk-indikator. Tekst som tones fra grå til svart linje for linje, og sitat som fylles ord for ord. Norsk tekst går i en bue på språkkortet, og chips ruller. På mobil viser heroen en levende norsk transkripsjon fra et Google Meet-opptak (`trale-hero-mobil.png`). Det er sterkere enn desktop-versjonen.

**Sosialt bevis:** Den sterkeste norske logoveggen i markedet (23 logoer) og tre sitater med navn, rolle og foto. Sikkerhetsbevisene er konkrete og navngitte: Telenor Cyber Defence og SOC 2 Type II.

**CTA og pris:** «Kontakt oss», «Book et møte» og «Prat med oss» dominerer. «Prøv gratis» og «Last ned gratis» kommer sent. Ingen pris på forsiden.

**Fungerer godt**
- Tillitsblokken: tre korte, etterprøvbare påstander rett under heroen.
- Norske logoer tidlig gir lokal trygghet med en gang.
- Sitatet «Hver samtale betydde en time med adminarbeid» sier gevinsten i kundens egne ord.
- Mobilheroen viser produktet på norsk.

**Fungerer dårlig**
- Overskriften «En komplett løsning for hvert møte» kunne stått på en hvilken som helst side og sier ikke hva produktet gjør.
- Primær-CTA «Kontakt oss» stenger ute de som vil prøve selv.
- Siden er lang og har mange funksjoner (coaching, prosjekter, CRM). Den leses som en funksjonsliste for salgsteam.
- Bare iPhone og macOS er nevnt (ingen Android eller Windows-app synlig).
- De AI-malte landskapene er pene, men viser ikke møter.

---

## 3. Wispr Flow Notetaker (wisprflow.ai/notetaker)

**Hero**
- Over overskriften: «WISPR FLOW NOTETAKER»
- Overskrift: «Meeting notes that get *the details right.*» (kursiv på slutten)
- Underoverskrift: ingen
- CTA: «Get started on macOS» (gjenkjenner operativsystemet), på mobil «Get started for free». Under: «Available on Mac and Windows».
- Nav: bryter mellom Dictation og Notetaker, så Business, Pricing, Lab og CTA

**Vinkling:** Nøyaktighet. Den fanger navn, fagord og detaljer fordi den bruker ordboken og kalenderen din. Den er solgt som en del av diktat-produktet Flow og tar aktivt kunder fra Granola og Otter.

**Seksjonsrekkefølge**
1. Hero med transkripsjon som ruller: linjer med fargede taler-chips (Mark, Alix, Hailey, DeShawn) og et kort som hentes ut, «Flag demo-space change», merket med navn
2. Mørk stripe med ett sitat: Steven Bartlett (The Diary of a CEO)
3. Mørkegrønn flate: «Wispr Notetaker captures the *hard-to-spell* words and *easy-to-miss* details.»
4. Scroll-låst fortelling med fem faner: The details / Ask anything / What did I miss? / Summary / MCP. Én mockup i midten bytter innhold, og tekst står til høyre (se `wispr-scroll-*.jpg`).
5. «Fits into your workflow. *Doesn't change it.*» Tre kort: starter automatisk, virker overalt, kobles til AI-en din
6. «Switch without *losing a thing.*» Import fra Granola og Otter
7. «Bring Notetaker *to your team.*» Fire admin-kontroller (av/på, samtykkebekreftelse, ingen trening på data, sentrale personvernregler)
8. Mørk: «From the first *people to use it.*» Sitatkort i farger stablet som en kortstokk
9. FAQ: «You might *be wondering.*» (nøyaktighet, samtykke, personvern, sammenligning med Granola, pris, språk)
10. Blogg: tre artikler, blant annet en guide til Granola-alternativer
11. Avslutning: diktat og notater i ett abonnement

**Visuelt:** Kremgul bunn. Overskrifter i Garamond-aktig serif med kursiv på nøkkelordene, brødtekst i grotesk. Primærknappen er lilla med svart kant. Seksjonene er store flater (svart, mørkegrønn, oransje) med svært runde hjørner. Videomøte-rutene viser ekte mennesker med fargede navnelapper. Uttrykket er varmt og redaksjonelt.

**Animasjoner og interaksjoner:** Hero-transkripsjonen ruller, og eldre linjer blekner. Handlingspunktet glir ut som et kort. Scroll-låst seksjon med fem faner og aktiv markør. Sitatkortene vippes og stables. Den mørkegrønne flaten utvides mens du scroller.

**Sosialt bevis:** Fem navngitte sitater (Warby Parker-CEO, Notable Capital, Menlo Ventures, Goodwater, Steven Bartlett). Ingen logovegg og ingen brukertall.

**CTA og pris:** «Get started for free» eller «Download for free» flere steder. Pris er bare omtalt i FAQ (gratis plan, Pro, Teams), uten beløp.

**Fungerer godt**
- Én tydelig påstand (nøyaktighet) som hele siden beviser.
- Heroen viser hva produktet gjør på tre sekunder: tale blir et handlingspunkt med navn.
- «What did I miss?» er en konkret, menneskelig situasjon, ikke en funksjon.
- Bytt-seksjonen fjerner byttekostnaden.
- FAQ-en tar innvendingene (samtykke, personvern) direkte.

**Fungerer dårlig**
- Ingen underoverskrift. Du vet ikke at det er en desktop-app uten bot før du leser videre.
- Scroll-låste seksjoner gir lange tomme partier hvis scrollen er rask eller JavaScript feiler.
- Mobil støttes ikke («mobile on the roadmap»).

---

## 4. Otter (otter.ai)

**Hero**
- Toppbanner: «Work Mode and Live Assist are here. Get more from every meeting. Learn more»
- Overskrift: «Your AI notetaker is now also your Conversational Knowledge Engine»
- Underoverskrift: «Otter transcribes every meeting, turning it into searchable knowledge that powers your workflow.»
- CTA: «Start for free» (blå) og «Schedule demo» (kontur)
- Under CTA: roterende sitat med portrett, for eksempel «I use Otter.ai almost everyday....it is a superpower.» (Brandon Savage, Voziq.ai)
- Nav: Use Cases, Resources, Download, Enterprise, Pricing, «Schedule demo», «Log in», «Start for free»

**Vinkling:** Fra transkripsjon til «kunnskapsmotor» for hele selskapet: søk på tvers, brief før møter, live coaching og CRM. Målgruppen er bedrift og salg.

**Seksjonsrekkefølge**
1. Hero med produktvideo (lyd av, med lydknapp) og sitatkarusell
2. Logorad: Salesforce, Harvard, NBC Universal, Amazon, IBM, Grant Thornton, Walgreens, Mastercard
3. «Like having your own executive assistant» og bento-rutenett med 7 kort (Ask Otter anything, desktop-app uten bot, live-transkripsjon, oppsummeringer, handlingspunkter, CRM, Channels)
4. «Whatever you do, Otter works for you». Faner Sales / Education / Media med 3D-kule
5. «Choose how you capture meetings» (bot, desktop eller mobil)
6. «Scale with your company» (sikkerhet, uten konkrete sertifiseringer) og MCP
7. «Trusted by teams, loved by people». Bento med WSJ-omtale, logoer, «4+ timer spart per uke» og videositater (Tony Robbins, Tim Draper)
8. «Connect to your favorite apps». To rader med integrasjonskort som ruller
9. Pris på blå flate: Basic gratis, Business «From $19.99/month per user» med 7 dagers prøve, og Enterprise
10. Avslutning: «The world's only Conversational Knowledge Engine» med ovale bilder
11. Relaterte artikler og footer med stort ordmerke

**Visuelt:** Hvit bunn, Otter-blå som merkefarge og en ren, geometrisk grotesk. Gradienter i lilla, rosa og blå bak iPhone- og Mac-mockups. Stort sett lyst, med en mettet blå prisblokk. Det ser ut som en klassisk SaaS-side fra 2023 til 2024.

**Animasjoner og interaksjoner:** Video i heroen, karuseller for sitater og bruksområder, rullende integrasjonskort, og en 3D-kule som skifter med fanene.

**Sosialt bevis:** Mest av alle: store merkevarer, WSJ, kjendiser, et tidstall (4+ timer i uka, 33 % tid spart) og mange sitater. Mengden gjør det mindre troverdig.

**CTA og pris:** «Start for free» og «Schedule demo» side om side i hele siden. Pris med beløp står på forsiden.

**Fungerer godt**
- Pris med beløp og gratisplan rett på siden fjerner et klikk.
- Sitat med ansikt rett under CTA-en i heroen.
- Et konkret tidstall: 4+ timer per uke.

**Fungerer dårlig**
- Heroen bruker kategorisjargong («Conversational Knowledge Engine») som ingen søker etter, og som må forklares.
- For mange funksjoner og kort. Ingen tydelig rekkefølge eller fortelling.
- Siden gjentar seg: chat-blokken kommer to ganger, og «Start for free» står overalt.

---

## 5. Dara (meetdara.no)

Forsiden var ikke tilgjengelig 6.11.2026 (tidsavbrudd og «connection refused»). Under står det vi har dokumentert tidligere (`docs/research-bygg-og-anlegg.md`, oktober 2026). Det er ikke kontrollert på nytt.

- Egen bransjeside for bygg og anlegg (`/for/bygg-og-anlegg`) med løftet «aldri mist et endringsvarsel igjen»
- Tallpåstander: 3,1 % feilrate på norsk og 21x ROI
- Personvern: data i Sverige, og lyden lagres ikke
- Pris synlig: 150 kr (10 møter) og 350 kr per bruker per måned, altså under Notably
- Ser ut til å være en desktop-app
- Har påstått at Teams blokkerer tredjeparts-boter fra 2026. Jørgen har avkreftet dette for Notably.

**Vinkling:** Norsk og billig, med bransjesider og målbar nøyaktighet på norsk. Nærmeste direkte konkurrent på pris og språk.

**Å gjøre:** Ta de tre skjermbildene (`dara-hero-desktop.png`, `dara-full.png`, `dara-hero-mobil.png`) når siden er oppe igjen. Kjør `node cdp-shot.mjs <mappe> dara https://www.meetdara.no/` (skriptet ligger i scratchpad og kan legges i repoet ved behov).

---

## Tverrgående syntese

### Mønstre som går igjen
- **Serif i overskriftene** hos alle unntatt Otter (Granola, Trale og Wispr). Uttrykket er redaksjonelt og menneskelig, ikke «AI-blått».
- **Før, under og etter møtet** er fast struktur hos Granola, Trale og Otter. Den forventes, men skiller ingen.
- **«Uten bot»** sier Granola, Wispr og Trale (desktop), og Otter har det som eget kort. Det er blitt hovedfortellingen i markedet.
- **MCP mot ChatGPT og Claude** har alle fire. Det er standard, ikke noe som skiller.
- **Scroll-låste fortellinger** med fanemeny har Granola, Trale og Wispr.
- **Pris:** bare Otter (og Dara) viser beløp. Granola sier «gratis». Trale og Wispr skjuler pris.

### Posisjoner som er tatt
| Posisjon | Eier |
|---|---|
| «Ingen bot i møtet», notatblokk du skriver i selv, privat som standard | Granola (Wispr og Trale følger etter) |
| Nøyaktighet på navn og fagord, «What did I miss?» | Wispr |
| Kunnskapsmotor for bedrift, salgscoaching og CRM | Otter, og på norsk Trale |
| Norsk «komplett løsning» med sikkerhetsbevis (Telenor-pentest, SOC 2) og norsk logovegg | Trale |
| Norsk, billig, bransjeside for bygg, feilrate på norsk som tall | Dara |
| 100+ språk | Trale (104), Notably sier «over 100». Ikke noe som skiller. |

### Ledige plasser for Notably
- **Norsk referat for vanlige norske arbeidsplasser**, ikke salgsteam. Trale og Otter sikter mot salg og CRM, Granola og Wispr mot amerikanske teknologifolk.
- **Fysiske møter på telefonen, både iPhone og Android.** Trale viser bare iPhone, Wispr har ikke mobil, og Dara ser ut til å være desktop.
- **Åpen pris og prøving uten salgsprat:** 399 kr og 14 dager gratis. Trale krever «Kontakt oss».
- **Boten som en fordel:** den blir med i Teams, Zoom og Meet, alle i møtet ser at den er der, og ingen trenger å installere noe. Dette må sies aktivt, ellers leses boten som en svakhet mot «uten bot»-fortellingen.

### 10 konkrete grep

**Stjel**
1. **Underoverskrift på Granola-formel:** tre substantiv og én innvending i én linje. For eksempel «Referat, oppgaver og beslutninger. På norsk, med data i EU.» Overskriften skal beskrive situasjonen, ikke kategorien.
2. **Hero som viser produktet i arbeid,** ikke et stillbilde. Wispr og Granola lar tale bli til notat eller handlingspunkt foran deg. Notably bør vise **norsk** tale som blir et norsk referat med «hvem sa hva». Det er det ingen andre kan vise på norsk, bortsett fra Trale på mobil.
3. **Tillitsrad med tre etterprøvbare påstander rett under heroen** (Trale-formatet). Bruk bare det som er bekreftet: data i EU (Tyskland), aldri AI-trening på dataene, databehandleravtale automatisk. Ikke nevn SOC 2 eller ISO før det er avklart.
4. **Pris på forsiden:** 399 kr per bruker per måned og 14 dager gratis, som hos Otter. Det skiller oss tydelig fra Trale («Kontakt oss») og fjerner det vanligste klikket bort fra siden.
5. **CTA som tilpasser seg enheten** (Granola og Wispr): «Last ned appen» på mobil, «Prøv gratis i 14 dager» på desktop. Behold én primærhandling. Demo kan være sekundær.
6. **Én funksjon per rad: tittel, én setning, ett stort bilde** (Granola). Maks fem rader. Det passer med prinsippet fra bygg-siden: «vis med mockups, én setning per poeng».
7. **Sitat med ansikt, navn, rolle og konkret gevinst i kundens egne ord** (Trale: «en time med adminarbeid per samtale»). Ett sterkt sitat tidlig gjør mer enn ti logoer. Ord-for-ord-avsløringen til Trale er et billig og virkningsfullt grep.
8. **FAQ med de ekte innvendingene** (Wispr): samtykke og GDPR, hva de andre i møtet ser, dialekter, Teams-boten, hva som skjer med lyden. Det er her «bot»-spørsmålet bør besvares.

**Unngå**
9. **Kategorisjargong og tomme påstander i heroen:** «Conversational Knowledge Engine» (Otter) og «En komplett løsning for hvert møte» (Trale). Ingen av dem sier hva som skjer etter møtet.
10. **For mange funksjoner og flater som bare virker med JavaScript.** Otters bento med sju kort og Trales lange funksjonsliste gjør det uklart hva produktet er. Scroll-låste seksjoner (Trale og Wispr) blir tomme flater når scrollen er rask, på mobil og i skjermbilder. Bruk scroll-låsing bare på desktop, og la innholdet stå som vanlige rader på mobil. Unngå også at cookie-banneret dekker heroen på mobil (Granola, Trale og Wispr gjør det).

### Mobil i korthet
- Granola er best: overskriften får plass, CTA-en tilpasser seg enheten, og mockupen titter fram over kanten.
- Trale er nest best: norsk transkripsjon med Google Meet-ramme i første skjermbilde.
- Otter: overskriften tar halve skjermen, og produktet kommer først under.
- Wispr: banneret dekker halve skjermen.
- Lærdom: overskriften bør være maks fire linjer på 390 bredde, og det må synes et glimt av produktet over skjermkanten.
