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
            <p className="text-gray-400 mb-8">
              Sist oppdatert: {new Date().toLocaleDateString('nb-NO', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">1. Introduksjon</h2>
              <p className="text-gray-300 mb-4">
                Notably ("vi", "oss" eller "vår") tar ditt personvern på alvor. Denne personvernerklæringen beskriver
                hvordan vi samler inn, bruker, og beskytter dine personopplysninger når du bruker vår tjeneste.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">2. Dataansvarlig</h2>
              <p className="text-gray-300 mb-4">
                Notably er dataansvarlig for behandlingen av dine personopplysninger.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">3. Hvilke opplysninger samler vi inn?</h2>
              <div className="text-gray-300 space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">3.1 Informasjon du gir oss</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>E-postadresse når du registrerer deg på ventelisten</li>
                    <li>Kontoinformasjon når du oppretter en konto</li>
                    <li>Møteinnhold og lydopptak som du laster opp eller registrerer</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">3.2 Informasjon vi samler automatisk</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Teknisk informasjon som IP-adresse, nettlesertype og enhet</li>
                    <li>Bruksmønster og interaksjon med tjenesten</li>
                    <li>Informasjonskapsler og lignende teknologier</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">4. Hvordan bruker vi dine opplysninger?</h2>
              <div className="text-gray-300">
                <p className="mb-4">Vi bruker dine personopplysninger til å:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Levere og forbedre våre tjenester</li>
                  <li>Behandle møteopptak og generere møtereferater</li>
                  <li>Kommunisere med deg om tjenesten</li>
                  <li>Sende oppdateringer og markedsføring (med ditt samtykke)</li>
                  <li>Analysere og forbedre brukeropplevelsen</li>
                  <li>Overholde juridiske forpliktelser</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">5. Deling av informasjon</h2>
              <div className="text-gray-300 space-y-4">
                <p>Vi deler ikke dine personopplysninger med tredjeparter, med mindre:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Du har gitt ditt samtykke</li>
                  <li>Det er nødvendig for å levere tjenesten (f.eks. hosting-leverandører)</li>
                  <li>Vi er juridisk forpliktet til å gjøre det</li>
                  <li>Det er nødvendig for å beskytte våre rettigheter</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">6. Datasikkerhet</h2>
              <p className="text-gray-300 mb-4">
                Vi implementerer passende tekniske og organisatoriske sikkerhetstiltak for å beskytte dine
                personopplysninger mot uautorisert tilgang, endring, avsløring eller ødeleggelse. Dette inkluderer:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Kryptering av data under overføring og lagring</li>
                <li>Regelmessige sikkerhetsvurderinger</li>
                <li>Begrenset tilgang til personopplysninger</li>
                <li>Sikre servere og databaser</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">7. Lagringstid</h2>
              <p className="text-gray-300 mb-4">
                Vi lagrer dine personopplysninger så lenge det er nødvendig for å oppfylle formålene beskrevet i
                denne erklæringen, med mindre en lengre lagringsperiode er påkrevet eller tillatt ved lov.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">8. Dine rettigheter</h2>
              <div className="text-gray-300 space-y-4">
                <p>I henhold til GDPR har du følgende rettigheter:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-white">Rett til innsyn:</strong> Du kan be om en kopi av dine personopplysninger</li>
                  <li><strong className="text-white">Rett til retting:</strong> Du kan be om å rette unøyaktige opplysninger</li>
                  <li><strong className="text-white">Rett til sletting:</strong> Du kan be om at vi sletter dine personopplysninger</li>
                  <li><strong className="text-white">Rett til begrensning:</strong> Du kan be om begrensning av behandlingen</li>
                  <li><strong className="text-white">Rett til dataportabilitet:</strong> Du kan motta dine data i et strukturert format</li>
                  <li><strong className="text-white">Rett til å protestere:</strong> Du kan protestere mot vår behandling av dine data</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">9. Informasjonskapsler</h2>
              <p className="text-gray-300 mb-4">
                Vi bruker informasjonskapsler og lignende teknologier for å forbedre din opplevelse på nettsiden vår.
                Du kan kontrollere bruken av informasjonskapsler gjennom nettleserinnstillingene dine.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">10. Endringer i personvernerklæringen</h2>
              <p className="text-gray-300 mb-4">
                Vi kan oppdatere denne personvernerklæringen fra tid til annen. Vi vil varsle deg om eventuelle
                vesentlige endringer ved å publisere den nye erklæringen på denne siden og oppdatere datoen øverst.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">11. Kontakt oss</h2>
              <p className="text-gray-300 mb-4">
                Hvis du har spørsmål om denne personvernerklæringen eller ønsker å utøve dine rettigheter,
                vennligst kontakt oss på:
              </p>
              <p className="text-gray-300">
                E-post: <a href="mailto:kontakt@notably.no" className="text-blue-400 hover:text-blue-300">kontakt@notably.no</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
