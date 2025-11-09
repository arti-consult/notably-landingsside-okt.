import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Personvernerklæring - Notably</title>
        <meta name="description" content="Les vår personvernerklæring for informasjon om hvordan Notably samler inn, bruker og beskytter dine personopplysninger." />
        <meta name="robots" content="index, follow" />
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
            <p className="text-gray-400 mb-8">Sist oppdatert: 28.10.2025</p>

            <section className="mb-12">
              <p className="text-gray-300">
                Notably AI fanger, transkriberer og oppsummerer møtene dine samtidig som vi følger GDPR og globale
                personvernkrav. Denne erklæringen forklarer hvordan vi behandler personopplysninger, hvilke partnere
                vi bruker, og hvilke kontrollmuligheter du har.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Datasenter og sikkerhet</h2>
              <p className="text-gray-300">
                All kundedata—inkludert transkripsjoner, AI-notater, embeddings, møtemetadata og opptak—lagres i EU på
                GDPR-kompatibel infrastruktur. Supabase driver Postgres og Storage i EU (Frankfurt), mens Vercel leverer
                applikasjonen fra EU-datasentre. Tilgang til produksjonssystemene er begrenset, loggført og sikret med
                minste privilegium.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Personopplysninger vi behandler</h2>
              <p className="text-gray-300 mb-4">Vi behandler bare informasjonen som er nødvendig for å levere tjenesten:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li><strong className="text-white">Kontodata:</strong> Navn, e-postadresse, innloggingshendelser og medlemskap i arbeidsområdet.</li>
                <li><strong className="text-white">Møtekontekst:</strong> Kalenderhendelser, opptakslenker og preferanser på arbeidsområdenivå som trengs for sikre opptak.</li>
                <li><strong className="text-white">Innhold du legger inn:</strong> Møtelyd, transkripsjoner, AI-genererte notater, maler og semantiske embeddings.</li>
                <li><strong className="text-white">Fakturadata:</strong> Planvalg og Stripe-kundeidentifikatorer (håndteres direkte av Stripe; vi lagrer aldri kortnummer).</li>
              </ul>
              <p className="text-gray-300 mt-4">Vi selger ikke personopplysninger og beholder dem bare så lenge arbeidsområdet ditt er aktivt eller loven krever det.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Google-data vi får tilgang til</h2>
              <p className="text-gray-300 mb-4">
                Når du velger å koble en Google-konto, ber vi kun om lese-tilgang som trengs for å synkronisere møtene dine.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li><strong className="text-white">Grunnleggende profil:</strong> Navn, e-postadresse og profilbilde levert gjennom Google-pålogging via Supabase Auth for å opprette og sikre kontoen din.</li>
                <li><strong className="text-white">Kalendermetadata:</strong> Lese-tilgang til møtetitler, beskrivelser, start- og sluttider, arrangør- og deltakerlister samt møtelenker fra kalenderne du velger.</li>
                <li><strong className="text-white">Varsler om endringer:</strong> Webhook- eller polling-varsler fra Recall.ai som viser når hendelser opprettes, oppdateres eller avlyses slik at Notably holder seg synkronisert.</li>
              </ul>
              <p className="text-gray-300 mt-4">Vi ber aldri om skrivetilgang til Google Kalender eller tilgang til Gmail-data.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Hvordan vi bruker Google-data</h2>
              <p className="text-gray-300 mb-4">Google-data brukes kun til å holde funksjonene du har aktivert i gang:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Speile kommende møter i Notably-dashbordet og holde planleggingsmetadata oppdatert.</li>
                <li>Planlegge, deduplisere og sende Recall.ai-opptaksboten til møter med gyldige lenker.</li>
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
                  <h3 className="text-xl font-medium mb-2 text-white">Recall.ai (kalender + bot)</h3>
                  <p className="text-gray-300">Mottar OAuth-oppfriskingstokenet og kalendermetadata for å synkronisere hendelser og sende opptaksboten. Recall lagrer tokenet sikkert og begrenser tilgangen.</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Supabase (database + lagring)</h3>
                  <p className="text-gray-300">Lagrer kalendermetadata, møtetranskripsjoner og arbeidsområdeinnstillinger i EU med radnivåsikkerhet og kryptering.</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Vercel (applikasjonshotell)</h3>
                  <p className="text-gray-300">Leverer Notably-nettappen og API-ene; Google-data som sendes gjennom appen er kryptert under transport.</p>
                </div>
              </div>
              <p className="text-gray-300 mt-4">Vi selger aldri Google-brukerdata eller deler dem med annonsører.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Lagring og beskyttelse</h2>
              <p className="text-gray-300 mb-4">Kalendermetadata og møtekontekst fra Google lagres i Supabase sin EU-region med kryptering i ro, strenge tilgangskontroller og revisjonsspor.</p>
              <p className="text-gray-300 mb-4">OAuth-oppfriskingstoken sendes direkte til Recall.ai; vi lagrer ikke Google-tilgangs- eller oppfriskingstoken i vår infrastruktur.</p>
              <p className="text-gray-300">Tilgang til produksjonsdata er begrenset til klarerte medarbeidere med konfidensialitetsavtaler, og overvåking hindrer uautorisert bruk.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Lagringstid og sletting</h2>
              <p className="text-gray-300 mb-4">Google-data beholdes kun så lenge de trengs for møteflyten du har aktivert:</p>
              <p className="text-gray-300 mb-2">Frakobling av Google-kalender fra Innstillinger eller Google Sikkerhet stanser umiddelbart nye hendelser og tilbakekaller token.</p>
              <p className="text-gray-300 mb-2">Når du sletter et møte, arbeidsområde eller opptak fjernes tilhørende Google-metadata, transkripsjoner, embeddings og Recall.ai-kalender innen 30 dager (ofte raskere).</p>
              <p className="text-gray-300 mb-2">Du kan sende en e-post til <a className="text-blue-400 hover:text-blue-300" href="mailto:legal@notably.no">legal@notably.no</a> for å be om raskere sletting; vi svarer innen 30 dager og bekrefter når Recall.ai og Supabase er tømt.</p>
              <p className="text-gray-300">Sikkerhetskopier med Google-data følger samme tidsplan og slettes automatisk etter retensjonsperioden.</p>
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
                <li><strong className="text-white">Varsler om endringer:</strong> Webhook-varsler fra Recall.ai som forteller når møter opprettes, oppdateres eller avlyses slik at Notably holder seg synkronisert.</li>
              </ul>
              <p className="text-gray-300 mt-4">Vi ber aldri om skrivetilgang til Microsoft 365-kalenderne dine eller e-posten din.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Hvordan vi bruker Microsoft-data</h2>
              <p className="text-gray-300 mb-4">Microsoft-data behandles kun for å levere funksjonene du har slått på:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Vise kommende Outlook-møter i Notably og holde planleggingsdetaljene korrekte.</li>
                <li>Planlegge, deduplisere og sende Recall.ai-opptaksboten til møter med gyldige konferanselenker.</li>
                <li>Gi møtekontekst til transkripsjon, AI-notater og semantisk søk etter at opptaket er fullført.</li>
              </ul>
              <p className="text-gray-300 mt-4">Vi bruker ikke Microsoft-data til annonsering, profilering eller andre formål.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Hvem vi deler Microsoft-data med</h2>
              <p className="text-gray-300 mb-6">Begrensede Microsoft-data deles med betrodde databehandlere kun for å drifte tjenesten:</p>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Recall.ai (kalender + bot)</h3>
                  <p className="text-gray-300">Mottar OAuth-oppfriskingstokenet og kalendermetadata for å synkronisere Outlook-hendelser og sende opptaksboten. Tokenet lagres sikkert og knyttes til arbeidsområdet ditt.</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Supabase (database + lagring)</h3>
                  <p className="text-gray-300">Lagrer møtemetadata, transkripsjoner og arbeidsområdeinnstillinger i EU med radnivåsikkerhet.</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Vercel (applikasjonshotell)</h3>
                  <p className="text-gray-300">Leverer Notably-nettappen; Microsoft-data som sendes gjennom appen er kryptert i transport.</p>
                </div>
              </div>
              <p className="text-gray-300 mt-4">Vi selger aldri Microsoft-brukerdata eller deler dem med annonsører.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Lagringstid og sletting av Microsoft-data</h2>
              <p className="text-gray-300 mb-2">Microsoft-data beholdes bare så lenge det er nødvendig for møteflyten du har aktivert:</p>
              <p className="text-gray-300 mb-2">Kobler du fra Microsoft Outlook i Innstillinger eller trekker tilbake tilgangen i Microsoft-portalen, stopper nye hendelser umiddelbart.</p>
              <p className="text-gray-300 mb-2">Når du sletter et møte, arbeidsområde eller opptak, fjerner vi tilhørende Microsoft-metadata, transkripsjoner, embeddings og Recall.ai-kalenderen innen 30 dager (vanligvis raskere).</p>
              <p className="text-gray-300 mb-2">Send en e-post til <a className="text-blue-400 hover:text-blue-300" href="mailto:legal@notably.no">legal@notably.no</a> for å be om raskere sletting; vi bekrefter når Recall.ai og Supabase er tømt.</p>
              <p className="text-gray-300">Sikkerhetskopier med Microsoft-data følger samme tidsplan og slettes automatisk etter retensjonsperioden.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Informasjonskapsler og lokal lagring</h2>
              <p className="text-gray-300">
                Notably bruker kun strengt nødvendige informasjonskapsler for å holde deg innlogget, sikre økten og huske
                samtykkevalgene dine. Vi setter ikke valgfrie analyse-kapsler. Når du lukker banneret lagrer vi samtykket i
                en funksjonell kapsel slik at du slipper å se meldingen hver gang.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Hvordan møtene blir tatt opp</h2>
              <p className="text-gray-300 mb-4">Møtelyden fanges av en dedikert Recall.ai-bot som vi planlegger på dine vegne basert på konferansedetaljene fra kalenderen du har koblet til.</p>
              <p className="text-gray-300 mb-4">Recall.ai-boten spiller inn møtet, krypterer lydfilen og leverer den til Notably; ingen hos Notably eller Recall.ai lytter på møtet direkte.</p>
              <p className="text-gray-300">Vi henter opptaket, lagrer det i vårt private Supabase-område i EU, kjører transkripsjon og oppsummering, og sletter filen når du fjerner møtet eller lagringsperioden er over.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Underleverandører</h2>
              <p className="text-gray-300 mb-6">Vi samarbeider med følgende leverandører som tilfredsstiller GDPR-kravene og samsvarer med denne erklæringen:</p>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Supabase (EU West)</h3>
                  <p className="text-gray-300">Primærlagring av data, autentisering og håndheving av radnivåsikkerhet.</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Vercel (EU-regionen)</h3>
                  <p className="text-gray-300">Applikasjonshotell og levering av Notably-nettappen fra EU.</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Recall.ai</h3>
                  <p className="text-gray-300">Kalendersynkronisering og planlegging av opptaksboten som deltar i møtene.</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">ElevenLabs Scribe</h3>
                  <p className="text-gray-300">Automatisk tale-til-tekst og diariserte høyttakersegmenter.</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">OpenAI</h3>
                  <p className="text-gray-300">Generering av AI-oppsummeringer, strukturerte notater og semantiske embeddings.</p>
                </div>
              </div>
              <p className="text-gray-300 mt-4">Hver leverandør mottar bare minimumsdatæne som trengs for å levere tjenesten. Vi vurderer underleverandører jevnlig og varsler om endringer før de trer i kraft.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Rettighetene dine</h2>
              <p className="text-gray-300 mb-4">Administratorer kan laste ned transkripsjoner, slette møter eller starte full kontosletting når som helst. Sletting opphever Recall.ai-kalendere, fjerner data i Supabase, sletter embeddings og tar bort media fra opptaksbøtten. Du kan be om innsyn, retting eller sletting ved å kontakte oss.</p>
              <p className="text-gray-300">For personvernspørsmål kontakt <a className="text-blue-400 hover:text-blue-300" href="mailto:legal@notably.no">legal@notably.no</a>. Vi svarer innen 30 dager.</p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
