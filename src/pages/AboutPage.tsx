import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { DEFAULT_SOCIAL_IMAGE_ALT, DEFAULT_SOCIAL_IMAGE_URL } from '../lib/seo';

const workPrinciples = [
  {
    number: '01',
    title: 'Praktisk først',
    description:
      'Vi bygger løsninger som faktisk tas i bruk i arbeidshverdagen, ikke pilotprosjekter som stopper opp.',
  },
  {
    number: '02',
    title: 'Trygg implementering',
    description:
      'Vi kombinerer fart med governance, sikkerhet og tydelige rammer for ansvarlig AI-bruk.',
  },
  {
    number: '03',
    title: 'Målbar effekt',
    description:
      'Vi definerer KPI-er tidlig og følger leveransen tett for å sikre dokumenterte gevinster.',
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
                  href="#hvordan-vi-jobber"
                  className="inline-flex items-center gap-2 text-slate-700 font-semibold hover:text-slate-950 transition-colors"
                >
                  Hvordan vi jobber
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/4.1] overflow-hidden rounded-[2rem] border border-slate-300/70 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 shadow-[0_24px_55px_-26px_rgba(15,23,42,0.7)]"
            >
              <div className="absolute -top-16 right-[-10%] h-56 w-56 rounded-full bg-blue-300/30 blur-3xl" />
              <div className="absolute -bottom-24 left-[-10%] h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_22%,rgba(255,255,255,0.32),transparent_36%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(255,255,255,0.08)_0%,transparent_45%,rgba(96,165,250,0.18)_100%)]" />

              <div className="absolute top-6 right-6 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-slate-100/90 backdrop-blur">
                ARTI x Notably
              </div>

              <div className="absolute left-6 right-6 bottom-6 rounded-2xl border border-white/20 bg-white/12 p-5 backdrop-blur-md">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-200/85">Slik jobber vi</p>
                <p className="mt-3 text-2xl leading-tight font-semibold text-white">
                  Fra strategi til produksjon, med sikkerhet, tempo og målbar verdi.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-6 md:px-[9%] xl:px-[14%] py-10 md:py-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.65 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-5xl text-center text-3xl sm:text-4xl lg:text-[3rem] leading-[1.17] font-semibold tracking-tight text-slate-900"
          >
            Vi tror AI skal gi mennesker mer tid til arbeid som betyr noe. Vår jobb er å gjøre det mulig, trygt, raskt
            og med varig effekt.
          </motion.p>
        </section>

        <section id="hvordan-vi-jobber" className="scroll-mt-28 px-6 md:px-[9%] xl:px-[14%] py-16 md:py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">Hvordan vi jobber</h2>

            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {workPrinciples.map((principle, index) => (
                <motion.article
                  key={principle.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="border-t border-slate-300 pt-7"
                >
                  <p className="text-sm font-medium tracking-[0.22em] text-slate-500">{principle.number}</p>
                  <h3 className="mt-5 text-3xl font-semibold leading-tight text-slate-900">{principle.title}</h3>
                  <p className="mt-4 text-lg leading-relaxed text-slate-700">{principle.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
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
