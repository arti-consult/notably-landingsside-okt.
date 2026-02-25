import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { DEFAULT_SOCIAL_IMAGE_ALT, DEFAULT_SOCIAL_IMAGE_URL } from '../lib/seo';

const customerExamples = [
  'Orkla',
  'Politiet',
  'Skagenfondene',
  'Telenor',
  'Pareto',
  'Selvaag Bolig',
];

const HERO_IMAGE_URL = 'https://qelklrrxciwomrwunzjo.supabase.co/storage/v1/object/public/admin-images/1772011939789.svg';

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

      <main className="min-h-screen bg-[#eceff2] pt-24 text-slate-900">
        <section className="px-6 md:px-[9%] xl:px-[14%] py-14 md:py-20">
          <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-[1fr_1.02fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl"
            >
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Om oss</p>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl leading-[1.03] font-semibold text-slate-900">
                Vi gjør AI konkret for norske virksomheter.
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-slate-700">
                <strong className="text-slate-900">ARTI Consult AS</strong> er selskapet bak Notably. Vi jobber tett med
                ledere og fagmiljøer for å gå fra AI-idé til produksjon, med trygg fremdrift og dokumentert effekt.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href="https://www.articonsult.no/om-oss/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-white font-semibold hover:bg-slate-800 transition-colors"
                >
                  Les om ARTI
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href="https://www.articonsult.no/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-slate-700 font-semibold hover:text-slate-950 transition-colors"
                >
                  Besøk articonsult.no
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/4.1] overflow-hidden rounded-[2rem] border border-slate-300/70 bg-white shadow-[0_24px_55px_-26px_rgba(15,23,42,0.7)]"
            >
              <img
                src={HERO_IMAGE_URL}
                alt="ARTI Consult team i møte"
                className="h-full w-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </motion.div>
          </div>
        </section>

        <section className="px-6 md:px-[9%] xl:px-[14%] py-10 md:py-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.65 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-5xl text-center text-3xl sm:text-4xl lg:text-[3rem] leading-[1.35] font-semibold tracking-tight text-slate-900"
          >
            Vi tror AI skal gi mennesker mer tid til arbeid som betyr noe. Vår jobb er å gjøre det mulig, trygt, raskt
            og med varig effekt.
          </motion.p>
        </section>

        <section className="px-6 md:px-[9%] xl:px-[14%] pb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-7xl rounded-[2rem] border border-slate-300 bg-white/80 p-8 md:p-12 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.55)] backdrop-blur"
          >
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Kunder og erfaring</p>
                <h2 className="mt-4 text-3xl sm:text-4xl font-semibold leading-tight text-slate-900">
                  ARTI har levert prosjekter for noen av Norges mest krevende virksomheter.
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-slate-700">
                  På kundelisten finner vi blant annet Orkla, Politiet, Skagenfondene, Telenor, Pareto og Selvaag
                  Bolig, i tillegg til en rekke andre private og offentlige aktører.
                </p>
                <a
                  href="https://www.articonsult.no/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-2 text-blue-700 font-semibold hover:text-blue-900 transition-colors"
                >
                  Besøk articonsult.no
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>

              <div className="flex flex-wrap content-start gap-3">
                {customerExamples.map((customer) => (
                  <span
                    key={customer}
                    className="rounded-full border border-slate-300 bg-slate-100/80 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    {customer}
                  </span>
                ))}
                <span className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                  ... og flere
                </span>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
}
