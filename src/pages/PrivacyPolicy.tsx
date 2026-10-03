import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { DEFAULT_SOCIAL_IMAGE_ALT, DEFAULT_SOCIAL_IMAGE_URL } from '../lib/seo';
import { openPrivacyChoices } from '../lib/consent';

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Personvernerklæring - Notably</title>
        <meta name="description" content="Les vår personvernerklæring for informasjon om hvordan Notably samler inn, bruker og beskytter dine personopplysninger." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://notably.no/personvern" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Notably" />
        <meta property="og:locale" content="nb_NO" />
        <meta property="og:url" content="https://notably.no/personvern" />
        <meta property="og:title" content="Personvernerklæring - Notably" />
        <meta
          property="og:description"
          content="Les vår personvernerklæring for informasjon om hvordan Notably samler inn, bruker og beskytter dine personopplysninger."
        />
        <meta property="og:image" content={DEFAULT_SOCIAL_IMAGE_URL} />
        <meta property="og:image:alt" content={DEFAULT_SOCIAL_IMAGE_ALT} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://notably.no/personvern" />
        <meta name="twitter:title" content="Personvernerklæring - Notably" />
        <meta
          name="twitter:description"
          content="Les vår personvernerklæring for informasjon om hvordan Notably samler inn, bruker og beskytter dine personopplysninger."
        />
        <meta name="twitter:image" content={DEFAULT_SOCIAL_IMAGE_URL} />
        <meta name="twitter:image:alt" content={DEFAULT_SOCIAL_IMAGE_ALT} />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Tilbake til forsiden
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-8">Personvernerklæring</h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-400 mb-8">Sist oppdatert: 03.10.2026</p>

            <section className="mb-12">
              <p className="text-gray-300">
                Denne erklæringen forklarer hvordan ARTI CONSULT AS, som driver Notably, behandler personopplysninger
                når du bruker Notably på web eller mobil, møteopptak, AI-funksjoner, støtte, fakturering og tilkoblede
                tjenester.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Hvem er ansvarlig for opplysningene dine</h2>
              <p className="text-gray-300 mb-4">
                ARTI CONSULT AS, organisasjonsnummer 929 098 609 MVA, registrert i Foretaksregisteret med adresse
                C. Sundts gate 55, 5004 Bergen, Norge («Notably», «vi», «oss»), er behandlingsansvarlig for
                kontoadministrasjon, fakturering, produktdrift, sikkerhet, støtte, tjenesteanalyse og salg.
              </p>
              <p className="text-gray-300">
                Når en organisasjon bruker Notably til å behandle møteinnhold på sine vegne, vil organisasjonen normalt
                være behandlingsansvarlig og Notably være databehandler. Organisasjonen bestemmer hvorfor møtet tas opp
                og hvordan innholdet brukes.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Datasenter og sikkerhet</h2>
              <p className="text-gray-300 mb-4">
                Notably driver webappen, API-et, arbeidsprosessene, PostgreSQL-databasen, autentiseringstjenestene og
                selvhostet Supabase-programvare på Hetzner-infrastruktur i Nürnberg i Tyskland. Private objekter med
                møteopptak lagres i objektlagring som Hetzner administrerer i Falkenstein i Tyskland. Hetzner leverer
                infrastrukturen og den administrerte objektlagringen. Supabase Inc. hoster ikke Notablys kjernedatabase
                eller autentiseringstjeneste.
              </p>
              <p className="text-gray-300">
                Vi bruker kryptering under transport, tilgangskontroller, skille mellom arbeidsområder og begrenset
                produksjonstilgang. Ingen tjeneste kan garanteres fullstendig sikker, så gi oss raskt beskjed hvis du
                mistenker uautorisert tilgang.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Personopplysninger vi behandler</h2>
              <p className="text-gray-300 mb-4">
                Avhengig av hvilke funksjoner du bruker, behandler vi disse kategoriene:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li><strong className="text-white">Konto-, organisasjons- og identitetsdata:</strong> Navn, e-postadresse, valgfritt profilbilde, innloggingshendelser, medlemskap i arbeidsområder og organisasjoner, roller, invitasjoner, SSO- eller identitetsleverandørinformasjon og kontoadministrasjon.</li>
                <li><strong className="text-white">Møte- og kalenderdata:</strong> Kalenderhendelser, emner, beskrivelser, tidspunkter, arrangører, deltakere, konferanselenker, opptakslenker, opptaksstatus, talere og opptakspreferanser for arbeidsområdet.</li>
                <li><strong className="text-white">Innholds- og AI-data:</strong> Opplastet eller tatt opp lyd, transkripsjoner, oversettelser, notater, oppsummeringer, maler, forespørsler, assistentsamtaler, utledede fakta eller preferanser, forslag, generert innhold, semantiske embeddings og innhold du velger å dele eller eksportere.</li>
                <li><strong className="text-white">Fakturadata:</strong> Planvalg, kundeidentifikatorer for webfakturering, App Store-identifikatorer for transaksjoner, produkter og abonnement i iOS-appen samt kjøpstoken og ordre-, produkt- og abonnementsidentifikatorer fra Google Play for Android-fakturering. Betalingsleverandøren vår for web, Apple og Google behandler betalingsdetaljene; vi mottar aldri kortnummer.</li>
                <li><strong className="text-white">Tilkoblinger og autorisasjoner:</strong> OAuth-tilganger, identifikatorer for tilkoblede tjenester, forespurte tilganger, synkroniseringsstatus og registrering av brukerautoriserte datautvekslinger med kalender-, identitets- og apptjenester.</li>
                <li><strong className="text-white">Data for mobilvarsler:</strong> Hvis du slår på mobilvarsler, behandler vi en appgenerert enhetsidentifikator, push-token, plattform, appversjon og varselinnholdet. Innholdet kan omfatte møtetittel, varseltekst og hendelsestype samt møte- og arbeidsområdeidentifikatorer som trengs for å rute oppdateringer.</li>
                <li><strong className="text-white">Støtte-, diagnose- og bruksdata:</strong> Støttemeldinger og vedlegg, enhets- og nettleserinformasjon, IP-adresse, logger, feilrapporter, sikkerhetshendelser og begrensede produktbruksdata som trengs for feilsøking, beskyttelse og forbedring av tjenesten.</li>
              </ul>
              <p className="text-gray-300 mt-4">
                Vi mottar data fra deg, organisasjonen eller administratorer for arbeidsområdet, møtedeltakere og
                opptak, enheter og nettlesere, tjenester du kobler til, og leverandører som handler på våre vegne. Vi
                selger ikke personopplysninger.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Formål og behandlingsgrunnlag</h2>
              <p className="text-gray-300 mb-4">Vi behandler personopplysninger bare når vi har et rettslig grunnlag:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>For å opprette kontoer, ta opp og behandle møter, levere søk og AI-funksjoner, synkronisere tjenester, sende varsler, administrere abonnement og gi støtte når det er nødvendig for å oppfylle avtalen med deg eller organisasjonen din.</li>
                <li>For å sikre, overvåke, feilsøke, hindre misbruk, forstå og forbedre Notably når våre berettigede interesser ikke veier lettere enn rettighetene dine.</li>
                <li>For å levere valgfrie integrasjoner, enhetstillatelser, varsler og lignende funksjoner når du aktiverer dem. Når behandlingen bygger på samtykke, kan du trekke det tilbake når som helst.</li>
                <li>For å overholde loven, løse tvister, håndheve avtaler og oppbevare skatte-, regnskaps-, svindelforebyggings- og sikkerhetsopplysninger når det kreves.</li>
              </ul>
              <p className="text-gray-300 mt-4">
                Personen eller organisasjonen som bestemmer at et møte skal tas opp, er ansvarlig for å ha
                behandlingsgrunnlag og gi varslene som kreves for opptaket.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Salg og kundekontakt</h2>
              <p className="text-gray-300">
                Når vi kontakter bedrifter om Notably, behandler vi kontaktopplysninger for personer i rollen deres
                (navn, tittel, jobb-e-post og telefon) fra offentlige kilder som Brønnøysundregistrene og bedriftens
                nettsider, og dialogen vi har med dem. Når du åpner tilbud, avtaledokumenter, IT-dokumentet eller
                bookingsiden fra lenker vi har sendt, registrerer vi når og hvor ofte, slik at vi kan følge opp på
                riktig tidspunkt. Vi lagrer ikke IP-adressen din. Grunnlaget er berettiget interesse. Du kan når som
                helst be oss slutte å kontakte deg ved å svare på e-posten eller skrive til{' '}
                <a className="text-blue-400 hover:text-blue-300" href="mailto:support@notably.no">support@notably.no</a>.
                Vi lagrer kontaktopplysningene så lenge virksomheten er aktuell for oss som mulig kunde. Ber du oss slutte å kontakte deg, sletter eller sperrer vi opplysningene dine.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Google-data vi får tilgang til</h2>
              <p className="text-gray-300 mb-4">
                Når du velger å koble en Google-konto, ber vi kun om lese-tilgang som trengs for å synkronisere møtene dine.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li><strong className="text-white">Grunnleggende profil:</strong> Navn, e-postadresse og profilbilde levert gjennom Google-pålogging for å opprette og sikre kontoen din.</li>
                <li><strong className="text-white">Kalendermetadata:</strong> Lese-tilgang til møtetitler, beskrivelser, start- og sluttider, arrangør- og deltakerlister samt møtelenker fra kalenderne du velger.</li>
                <li><strong className="text-white">Varsler om endringer:</strong> Hendelsesvarsler fra tjenesten vår for kalendersynkronisering som viser når hendelser opprettes, oppdateres eller avlyses slik at Notably holder seg synkronisert.</li>
              </ul>
              <p className="text-gray-300 mt-4">Vi ber aldri om skrivetilgang til Google Kalender eller tilgang til Gmail-data.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Hvordan vi bruker Google-data</h2>
              <p className="text-gray-300 mb-4">Google-data brukes kun til å holde funksjonene du har aktivert i gang:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Speile kommende møter i Notably-dashbordet og holde planleggingsmetadata oppdatert.</li>
                <li>Planlegge, deduplisere og sende en automatisert opptaksassistent til møter med gyldige lenker.</li>
                <li>Forhåndsfylle møtekontekst for transkripsjon, AI-notater og semantisk søk etter at opptaket er ferdig.</li>
              </ul>
              <p className="text-gray-300 mt-4">Vi bruker ikke Google-data til annonsering, profilering eller andre formål.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Hvem vi deler Google-data med</h2>
              <p className="text-gray-300 mb-6">
                Begrensede Google-data deles med våre databehandlere for å levere tjenesten:
              </p>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Kalendersynkronisering og møteopptak</h3>
                  <p className="text-gray-300">
                    Leverandøren av kalender- og møteopptak mottar OAuth-oppfriskingstokenet og kalendermetadata for å
                    synkronisere hendelser og sende opptaksassistenten. Notably knytter forbindelsen til det aktuelle
                    arbeidsområdet og begrenser apptilgangen tilsvarende.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Selvhostet EU-infrastruktur for appen</h3>
                  <p className="text-gray-300">
                    Notably lagrer kalendermetadata, møtetranskripsjoner, arbeidsområdeinnstillinger og
                    autentiseringsdata i sitt selvhostede EU-miljø med skille mellom arbeidsområder og
                    tilgangskontroller.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Møtebehandling du har bedt om</h3>
                  <p className="text-gray-300">
                    Kalenderkontekst kan følge opptak som sendes til avtalte tale- og AI-databehandlere for å lage
                    transkripsjoner, notater og søkefunksjoner du har bedt om.
                  </p>
                </div>
              </div>
              <p className="text-gray-300 mt-4">
                Vi selger aldri Google-brukerdata eller bruker dem til annonsering. Opplysninger deles bare med
                leverandører som trengs for funksjonene du ber om, eller med en tilkoblet tjeneste du godkjenner.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Lagring og beskyttelse</h2>
              <p className="text-gray-300 mb-4">
                Kalendermetadata og møtekontekst fra Google lagres i Notablys selvhostede EU-databasemiljø med strenge
                tilgangskontroller og skille mellom arbeidsområder.
              </p>
              <p className="text-gray-300 mb-4">
                OAuth-oppfriskingstoken sendes direkte til databehandleren for kalendersynkronisering. Vi lagrer ikke
                Google-tilgangs- eller oppfriskingstoken i vår infrastruktur.
              </p>
              <p className="text-gray-300">
                Tilgang til produksjonsdata er begrenset til autorisert personell og tjenesteprosesser som trenger
                opplysningene for å drifte og beskytte Notably.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Lagringstid og sletting av Google-data</h2>
              <p className="text-gray-300 mb-4">Google-data beholdes kun så lenge de trengs for møteflyten du har aktivert:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Når du kobler fra Google Kalender i Notably, stopper den lokale forbindelsen, og vi ber kalenderdatabehandleren om sletting eller tilbakekalling. Du kan også trekke tilbake tilgangen direkte i Googles sikkerhetsportal.</li>
                <li>Sletting av et enkelt møte fjerner den aktive appoppføringen og avledet databaseinnhold og setter separat lagrede opptaksmedier samt støttede medie- og opptaksressurser hos leverandøren av møteopptak i kø for opprydding. Mislykkede forespørsler prøves på nytt, og delte ressurser beholdes mens et annet møte fortsatt viser til dem. Sletting av arbeidsområde og konto bruker en bredere opprydding i tråd med rollen din. Kontakt oss hvis du trenger hjelp med en sletteforespørsel.</li>
                <li>Du kan sende en e-post til <a className="text-blue-400 hover:text-blue-300" href="mailto:support@notably.no">support@notably.no</a> for å be om innsyn eller sletting. Vi kan bekrefte identiteten din og svarer innen fristen loven krever.</li>
              </ul>
              <p className="text-gray-300 mt-4">
                Rester kan ligge i begrensede sikkerhetskopier eller historiske migreringskopier etter aktiv sletting.
                Notably publiserer foreløpig ingen bekreftet fast slette- eller overskrivingsplan for disse kopiene.
                Enkelte opplysninger kan også beholdes av juridiske, sikkerhetsmessige eller avstemmingsmessige grunner.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Microsoft-data vi får tilgang til</h2>
              <p className="text-gray-300 mb-4">
                Når du kobler en Microsoft Outlook- eller Office 365-konto, ber vi bare om lese-tilgang som trengs for å
                synkronisere møtene dine.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li><strong className="text-white">Grunnleggende profil:</strong> Navn, e-postadresse og profilbilde hentet via Microsoft OAuth-strømmen slik at vi kan opprette og sikre kontoen din.</li>
                <li><strong className="text-white">Kalendermetadata:</strong> Lese-tilgang til møtetitler, beskrivelser, start- og sluttider, arrangører, deltakere og konferanselenker fra kalenderne du godkjenner.</li>
                <li><strong className="text-white">Varsler om endringer:</strong> Hendelsesvarsler fra tjenesten vår for kalendersynkronisering som forteller når møter opprettes, oppdateres eller avlyses slik at Notably holder seg synkronisert.</li>
              </ul>
              <p className="text-gray-300 mt-4">Vi ber aldri om skrivetilgang til Microsoft 365-kalenderne dine eller e-posten din.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Hvordan vi bruker Microsoft-data</h2>
              <p className="text-gray-300 mb-4">Microsoft-data behandles kun for å levere funksjonene du har slått på:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Vise kommende Outlook-møter i Notably og holde planleggingsdetaljene korrekte.</li>
                <li>Planlegge, deduplisere og sende en automatisert opptaksassistent til møter med gyldige konferanselenker.</li>
                <li>Gi møtekontekst til transkripsjon, AI-notater og semantisk søk etter at opptaket er fullført.</li>
              </ul>
              <p className="text-gray-300 mt-4">Vi bruker ikke Microsoft-data til annonsering, profilering eller andre formål.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Hvem vi deler Microsoft-data med</h2>
              <p className="text-gray-300 mb-6">Begrensede Microsoft-data deles med betrodde databehandlere kun for å drifte tjenesten:</p>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Kalendersynkronisering og møteopptak</h3>
                  <p className="text-gray-300">
                    Leverandøren av kalender- og møteopptak mottar OAuth-oppfriskingstokenet og kalendermetadata for å
                    synkronisere Outlook-hendelser og sende opptaksassistenten. Notably knytter forbindelsen til det
                    aktuelle arbeidsområdet og begrenser apptilgangen tilsvarende.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Selvhostet EU-infrastruktur for appen</h3>
                  <p className="text-gray-300">
                    Notably lagrer møtemetadata, transkripsjoner, arbeidsområdeinnstillinger og autentiseringsdata i
                    sitt selvhostede EU-miljø med skille mellom arbeidsområder og tilgangskontroller.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Møtebehandling du har bedt om</h3>
                  <p className="text-gray-300">
                    Kalenderkontekst kan følge opptak som sendes til avtalte tale- og AI-databehandlere for å lage
                    transkripsjoner, notater og søkefunksjoner du har bedt om.
                  </p>
                </div>
              </div>
              <p className="text-gray-300 mt-4">
                Vi selger aldri Microsoft-brukerdata eller bruker dem til annonsering. Opplysninger deles bare med
                leverandører som trengs for funksjonene du ber om, eller med en tilkoblet tjeneste du godkjenner.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Lagringstid og sletting av Microsoft-data</h2>
              <p className="text-gray-300 mb-4">Microsoft-data beholdes bare så lenge det er nødvendig for møteflyten du har aktivert:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Når du kobler fra Microsoft Outlook i Notably, stopper den lokale forbindelsen, og vi ber kalenderdatabehandleren om sletting eller tilbakekalling. Du kan også trekke tilbake tilgangen direkte i Microsoft-kontoportalen.</li>
                <li>Sletting av et enkelt møte fjerner den aktive appoppføringen og avledet databaseinnhold og setter separat lagrede opptaksmedier samt støttede medie- og opptaksressurser hos leverandøren av møteopptak i kø for opprydding. Mislykkede forespørsler prøves på nytt, og delte ressurser beholdes mens et annet møte fortsatt viser til dem. Sletting av arbeidsområde og konto bruker en bredere opprydding i tråd med rollen din. Kontakt oss hvis du trenger hjelp med en sletteforespørsel.</li>
                <li>Send en e-post til <a className="text-blue-400 hover:text-blue-300" href="mailto:support@notably.no">support@notably.no</a> for å be om innsyn eller sletting. Vi kan bekrefte identiteten din og svarer innen fristen loven krever.</li>
              </ul>
              <p className="text-gray-300 mt-4">
                Rester kan ligge i begrensede sikkerhetskopier eller historiske migreringskopier etter aktiv sletting.
                Notably publiserer foreløpig ingen bekreftet fast slette- eller overskrivingsplan for disse kopiene.
                Enkelte opplysninger kan også beholdes av juridiske, sikkerhetsmessige eller avstemmingsmessige grunner.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Tilkoblede apper og datadeling</h2>
              <p className="text-gray-300 mb-4">
                Hvis du kobler til en identitetsleverandør, kalender, AI-klient, MCP-klient, eksportdestinasjon eller en
                annen tredjepartstjeneste, godkjenner du at Notably utveksler dataene som vises når forbindelsen
                aktiveres. Eiere og administratorer kan også konfigurere tilkoblinger for organisasjonen og styre
                medlemstilgang.
              </p>
              <p className="text-gray-300">
                En tilkoblet tjeneste kan motta oppsummeringer, transkripsjoner, beslutninger, forpliktelser,
                kontoidentifikatorer eller annen informasjon du ber Notably sende.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Informasjonskapsler og lokal lagring</h2>
              <p className="text-gray-300">
                Notablys webapp bruker nettleserens lokale lagring til å bevare innloggingsøkter og kan bruke
                informasjonskapsler eller lignende lagring for sikkerhet, nødvendige innstillinger og for å huske
                personvernvalget ditt. Mobilappen lagrer økter i beskyttet native lagring. Valgfrie analyse- og
                markedsføringsverktøy forblir avslått til du tillater dem gjennom Personvernvalg. Hvis du tillater dem,
                kan det offentlige nettstedet laste Google Analytics med konverteringsmåling, Meta Pixel og TikTok
                Pixel, og Google Tag Manager kan laste Meta Pixel, Google-konverteringsmåling og attribusjon for
                registrering eller prøveperiode bare på et begrenset sett offentlige sider uten spørringsparametere
                eller fragmenter.
                Verktøyene kan motta nettidentifikatorer og begrensede opplysninger om side, henviser, nettleser, enhet
                og samhandling. Du kan trekke tilbake valget når som helst. Notably sender da signaler om
                tilbaketrekking, sletter kjente markedsføringskapsler vi har tilgang til og slutter å laste verktøyene,
                men leverandørene kan beholde opplysninger de mottok før tilbaketrekkingen etter sine egne vilkår.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Opptak og opplastinger</h2>
              <p className="text-gray-300 mb-4">
                Notably støtter en automatisert opptaksassistent for digitale møter, native opptak av fysiske møter
                eller romlyd, manuelle opptaksflyter og opplasting av lyd. Den automatiserte assistenten planlegges med
                konferanseinformasjon fra en tilkoblet kalender.
              </p>
              <p className="text-gray-300 mb-4">
                Opptak og opplastinger i kø kan bli liggende på enheten til de lastes opp, forkastes eller fjernes med
                appen. Når Notably mottar dem, lagrer og behandler vi dem for å levere transkripsjon, oppsummeringer,
                søk og andre funksjoner du ber om.
              </p>
              <p className="text-gray-300">
                Personen eller organisasjonen som bruker Notably, er ansvarlig for å gi opptaksvarsler og innhente
                tillatelser, samtykker og annet rettslig grunnlag som kreves for å ta opp, laste opp, analysere, lagre
                og dele innholdet.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Tjenesteleverandører og andre mottakere</h2>
              <p className="text-gray-300 mb-6">
                Avhengig av hvilke funksjoner du bruker og hvordan arbeidsområdet er konfigurert, støtter eller mottar
                avtalte databehandlere, selvstendige leverandører og andre mottakere data for disse aktivitetene:
              </p>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Hetzner-infrastruktur i Tyskland</h3>
                  <p className="text-gray-300">
                    Datakraft, database, autentisering og selvhostet Supabase-programvare som Notably driver i
                    Nürnberg, samt privat objektlagring som Hetzner administrerer for møtemedier i Falkenstein.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Kalendersynkronisering og møteopptak</h3>
                  <p className="text-gray-300">
                    Kalendertilkobling, oppbevaring av OAuth-token, synkronisering av hendelser og planlegging av
                    opptaksassistenten som deltar i digitale møter gjennom leverandørens isolerte EU-region.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Talebehandling</h3>
                  <p className="text-gray-300">
                    Opptak og opplastinger sendes til et EU-residensendepunkt for automatisk tale-til-tekst og
                    taleridentifisering. EU-residens innebærer ikke i seg selv null lagringstid eller at alle støtte- og
                    modereringsoverføringer er utelukket.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">EU-rutet AI-behandling</h3>
                  <p className="text-gray-300">
                    AI-forespørsler er nå konfigurert gjennom en EU-ruter, med modellkjøring i Sverige for genererte
                    oppsummeringer, oversettelser og strukturerte notater og i Frankrike for semantiske embeddings.
                    Rutingen garanterer ikke at alle leverandørkopier eller støtteoperasjoner blir i EU eller har null
                    lagringstid.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Levering av pushvarsler</h3>
                  <p className="text-gray-300">
                    Leveringsforespørselen for valgfrie mobilvarsler omfatter push-token, møtetittel, varseltekst og
                    hendelsestype samt møte- og arbeidsområdeidentifikatorer. Formidleren beholder innhold i minne eller
                    meldingskøer før det sendes videre til Apple eller Google, som også har globale leveringsvilkår.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">E-post- og støttetjenester</h3>
                  <p className="text-gray-300">
                    E-post for autentisering, invitasjoner, transaksjoner, livssyklusmeldinger, oppsummeringer og
                    støttesvar sendes gjennom en leverandør som lagrer kunde- og meldingsdata i USA.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Fakturerings- og identitetsleverandører</h3>
                  <p className="text-gray-300">
                    Betalings- og abonnementsadministrasjon, kjøp i appbutikker, innlogging og organisasjonsstyrte
                    identitetstjenester. Leverandørene kan være selvstendig behandlingsansvarlige for enkelte
                    aktiviteter.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Brukerautoriserte tilkoblede tjenester</h3>
                  <p className="text-gray-300">
                    Datautveksling med kalendere, identitetsleverandører, AI- eller MCP-klienter og eksportdestinasjoner
                    når en bruker eller organisasjon aktiverer forbindelsen.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Analyse-, annonserings-, diagnose- og støtteverktøy</h3>
                  <p className="text-gray-300">
                    Google Tag Manager og måleverktøy fra Meta og Google behandler nettidentifikatorer og brukshendelser
                    som beskrevet ovenfor. Avhengig av aktiviteten kan leverandørene være databehandlere, felles
                    behandlingsansvarlige eller selvstendig behandlingsansvarlige. Når den offentlige støttesiden åpnes,
                    lastes en USA-basert leverandør av støttechat og mottar tekniske forespørselsdata. Meldinger du
                    skriver, sendes til leverandøren.
                  </p>
                </div>
              </div>
              <p className="text-gray-300 mt-4">
                Hver leverandør eller mottaker får data som trengs for rollen eller den konfigurerte forbindelsen. Noen
                leverandører, som betalingsplattformer og brukervalgte tilkoblede tjenester, kan behandle data etter
                egne vilkår.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Lagringstid og sletting</h2>
              <p className="text-gray-300 mb-4">Vi beholder personopplysninger bare så lenge de trengs for formålene ovenfor:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Konto- og arbeidsområdeinnhold beholdes vanligvis så lenge den aktuelle kontoen eller arbeidsområdet er aktivt. Aktivt møteinnhold i databasen beholdes til en autorisert bruker sletter det, arbeidsområdet slettes eller en annen avtalt lagringsinnstilling gjelder.</li>
                <li>Sletting av et enkelt møte fjerner den aktive appoppføringen og avledet databaseinnhold og setter separat lagrede opptaksmedier samt støttede medie- og opptaksressurser hos leverandøren av møteopptak i kø for opprydding. Oppryddingen kan fullføres etter at appoppføringen er borte, fordi mislykkede forespørsler til leverandøren eller lagringstjenesten prøves på nytt. En ressurs slettes ikke mens et annet møte fortsatt viser til den. Hvis du bare er medlem, fjerner kontosletting medlemskapet, men ikke innhold som styres av det delte arbeidsområdet.</li>
                <li>Ved nye automatiserte opptak ber Notably leverandøren av møteopptak om at opptaksmediene skal utløpe 165 timer etter at leverandøren registrerer opptaket som ferdig, noe som normalt skjer kort tid etter at møtet avsluttes. Dette gjelder ikke opptaksmedier som allerede er kopiert til Notablys objektlagring. Sletting av et enkelt møte setter begge kopiene og støttede opptaksressurser separat i kø for opprydding, og mislykkede forespørsler prøves på nytt. Leverandøren kan beholde en botoppføring uten medier eller en driftsoppføring etter egne lagringsregler fordi grensesnittet for sletting av boten bare gjelder før boten blir med i en samtale.</li>
                <li>Google opplyser at _gcl-attribusjonskapsler kan beholdes i 90 dager. Meta opplyser at _fbp og _fbc kan beholdes i 90 dager, og at hendelsesdata kan beholdes i opptil to år. Kapsler og hendelsesdata fra TikTok Pixel følger TikToks egne vilkår. Attribusjons- og annonseringsdata hos leverandøren følger leverandørens vilkår etter overføringen.</li>
                <li>Begrensede sikkerhetskopier eller historiske migreringskopier, samt operasjonelle data fra arbeidskøer og feilkøer som oppbevares i Notablys selvhostede Redis-kø for nye behandlingsforsøk og diagnostikk, kan inneholde rester av møte- eller kommunikasjonsdata etter at dataene er slettet fra aktive systemer. Notably oppgir foreløpig ingen verifisert, fast tidsplan for sletting eller overskriving av disse kopiene.</li>
                <li>Begrensede fakturerings-, juridiske, svindelforebyggings-, sikkerhets-, støtte-, reservasjons- og avstemmingsopplysninger kan beholdes så lenge loven krever eller det med rimelighet trengs for disse formålene. Tilkoblede leverandører kan beholde data etter egne plikter.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Internasjonale overføringer</h2>
              <p className="text-gray-300 mb-4">
                Notablys kjernebaserte systemer for kundeinnhold på serversiden driftes i Tyskland. E-postdata fra
                applikasjonen og støttechatdata behandles eller lagres i USA etter leverandørenes vilkår. Pushlevering,
                identitet, fakturering, analyse, støtteoperasjoner og enkelte leverandørkopier kan også innebære
                behandling utenfor EU eller EØS. Et EU-endepunkt eller en EU-rute utelukker ikke i seg selv alle
                internasjonale overføringer.
              </p>
              <p className="text-gray-300">
                En overføring utenfor EU eller EØS som krever et vern, må dekkes av en relevant rettslig mekanisme.
                Avhengig av leverandøren og mottakerlandet kan dette være en adekvansbeslutning, EUs standard
                personvernbestemmelser eller et annet lovlig vern. En tilkoblet tjeneste du velger, kan gjøre egne
                overføringer etter sin personvernerklæring. Kontakt oss for informasjon om mekanismen som gjelder for en
                bestemt tjeneste.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Rettighetene dine</h2>
              <p className="text-gray-300 mb-4">
                Med forbehold om gjeldende lov kan du be om innsyn, retting, sletting, begrensning eller
                dataportabilitet, protestere mot behandling basert på berettigede interesser og trekke tilbake samtykke
                uten at det påvirker tidligere behandling. Du kan også klage til din lokale tilsynsmyndighet, blant
                annet Datatilsynet i Norge. Arbeidsområdekontroller lar autoriserte brukere eksportere eller slette
                innhold separat.
              </p>
              <p className="text-gray-300">
                For personvernspørsmål kontakt{' '}
                <a className="text-blue-400 hover:text-blue-300" href="mailto:support@notably.no">support@notably.no</a>.
                Vi kan bekrefte identiteten din og svarer innen fristen loven krever.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Barn og endringer i erklæringen</h2>
              <p className="text-gray-300">
                Notably er beregnet på profesjonell bruk og bruk i organisasjoner og er ikke rettet mot barn. Vi tilbyr
                ikke bevisst kontoer direkte til barn. Vi kan oppdatere erklæringen når produktet, leverandørene eller
                loven endres, og varsler om vesentlige endringer gjennom tjenesten eller en annen egnet kanal.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Personvernvalg</h2>
              <p className="text-gray-300 mb-6">
                Valgfrie analyse- og markedsføringsverktøy styres gjennom Personvernvalg. Der kan du gi eller trekke
                tilbake tillatelsen når som helst, eller kontakte{' '}
                <a className="text-blue-400 hover:text-blue-300" href="mailto:support@notably.no">support@notably.no</a>{' '}
                hvis du trenger hjelp med valget ditt.
              </p>
              <button
                type="button"
                onClick={openPrivacyChoices}
                className="rounded-full bg-[#2663eb] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Åpne Personvernvalg
              </button>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
