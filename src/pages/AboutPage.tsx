import { ArrowUpRight, Briefcase, Building2, ShieldCheck, Users2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { DEFAULT_SOCIAL_IMAGE_ALT, DEFAULT_SOCIAL_IMAGE_URL } from '../lib/seo';

const workPrinciples = [
  {
    title: 'Tett samarbeid med kunden',
    description:
      'ARTI beskriver selv at de ønsker å være en viktig del av kundens team. Denne arbeidsformen brukes også i utviklingen av Notably.',
    icon: Users2,
  },
  {
    title: 'Gjennomføringskraft i praksis',
    description:
      'Vi prioriterer løsninger som fungerer i den virkelige arbeidshverdagen, ikke bare på idéstadiet. Det gir forutsigbar leveranse og raske forbedringer.',
    icon: Briefcase,
  },
  {
    title: 'Faglig tyngde og struktur',
    description:
      'Erfaring med strategi, implementering, prosjektledelse og prosessutvikling gir et solid fundament for produktet og måten vi jobber på.',
    icon: ShieldCheck,
  },
];

const customerExamples = [
  'Orkla',
  'Politiet',
  'Skagenfondene',
  'Telenor',
  'Pareto',
  'Selvaag Bolig',
];

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>Om oss - ARTI Consult AS og Notably</title>
        <meta
          name="description"
          content="Notably er utviklet av ARTI Consult AS. Les hvordan vi jobber, hvilke verdier vi bygger på, og hvorfor norske virksomheter velger løsninger levert av ARTI."
        />
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
        <link rel="canonical" href="https://notably.no/om-oss" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Notably" />
        <meta property="og:locale" content="nb_NO" />
        <meta property="og:url" content="https://notably.no/om-oss" />
        <meta property="og:title" content="Om oss - ARTI Consult AS og Notably" />
        <meta
          property="og:description"
          content="Notably er utviklet av ARTI Consult AS. Les hvordan vi jobber og hvorfor norske virksomheter velger løsninger levert av ARTI."
        />
        <meta property="og:image" content={DEFAULT_SOCIAL_IMAGE_URL} />
        <meta property="og:image:alt" content={DEFAULT_SOCIAL_IMAGE_ALT} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://notably.no/om-oss" />
        <meta name="twitter:title" content="Om oss - ARTI Consult AS og Notably" />
        <meta
          name="twitter:description"
          content="Notably er utviklet av ARTI Consult AS. Les hvordan vi jobber og hvorfor norske virksomheter velger løsninger levert av ARTI."
        />
        <meta name="twitter:image" content={DEFAULT_SOCIAL_IMAGE_URL} />
        <meta name="twitter:image:alt" content={DEFAULT_SOCIAL_IMAGE_ALT} />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-gray-50 pt-24">
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white via-blue-50/50 to-slate-100 p-8 md:p-12">
              <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-4 py-1.5 text-sm font-medium text-blue-900">
                <Building2 className="h-4 w-4" />
                Selskapet bak Notably
              </p>

              <h1 className="mt-6 text-4xl md:text-5xl font-semibold text-gray-900 leading-tight">
                Om oss
              </h1>

              <p className="mt-6 max-w-3xl text-lg text-gray-700">
                Notably er utviklet av <strong className="text-gray-900">ARTI Consult AS</strong>. ARTI hjelper private og
                offentlige virksomheter med strategiske endringsprosjekter, og erfaringen derfra er grunnlaget for
                hvordan vi bygger Notably.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="https://www.articonsult.no/om-oss/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  Les mer om ARTI
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href="https://www.articonsult.no/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-gray-800 font-medium hover:bg-gray-100 transition-colors"
                >
                  Besøk articonsult.no
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 max-w-3xl">
              <h2 className="text-3xl font-semibold text-gray-900">Hvordan vi jobber</h2>
              <p className="mt-4 text-gray-700 leading-relaxed">
                ARTI jobber tett med kunder for å skape målbare resultater. De samme prinsippene ligger til grunn for
                hvordan Notably utvikles, driftes og forbedres.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {workPrinciples.map((principle) => (
                <article key={principle.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                    <principle.icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{principle.title}</h2>
                  <p className="mt-3 text-gray-600 leading-relaxed">{principle.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto rounded-3xl border border-gray-200 bg-white p-8 md:p-12">
            <h2 className="text-3xl font-semibold text-gray-900">Kunder og erfaring</h2>
            <p className="mt-4 max-w-3xl text-gray-700 leading-relaxed">
              ARTI har bistått både private og offentlige aktører. På kundelisten finner vi blant annet Orkla, Politiet,
              Skagenfondene, Telenor, Pareto og Selvaag Bolig, i tillegg til en rekke andre virksomheter.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {customerExamples.map((customer) => (
                <span
                  key={customer}
                  className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700"
                >
                  {customer}
                </span>
              ))}
            </div>

            <p className="mt-8 text-gray-600">
              Vil du lese mer om hvordan ARTI jobber med strategi, implementering og gjennomføring?
            </p>
            <a
              href="https://www.articonsult.no/om-oss/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-blue-700 font-medium hover:text-blue-800"
            >
              Se ARTI sin om-oss-side
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
