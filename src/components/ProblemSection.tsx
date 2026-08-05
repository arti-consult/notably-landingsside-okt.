import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Mic, Play } from 'lucide-react';

/** Fragmentene vipper ut av stilling, ett for ett – rotet er poenget. */
const buildFragmentVariants = (reduced: boolean | null, rotate: number): Variants => ({
  hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 26, rotate: 0 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: reduced ? 0 : rotate,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
});

const waveform = [7, 13, 5, 16, 9, 19, 6, 12, 17, 8, 14, 6, 11, 16, 9, 13];

/**
 * Bredde, forskyvning og overlapp ligger på en wrapper, ikke på selve
 * motion-elementet: framer-motion skriver transform inline og ville overkjørt
 * Tailwinds translate-klasse. Forskyvningen slår først inn fra sm, der det er
 * plass til den uten at kortene stikker utenfor.
 */
const layout = [
  { rotate: -3.5, wrapper: 'w-full' },
  { rotate: 4, wrapper: 'w-[90%] mt-3 sm:translate-x-8' },
  { rotate: -6, wrapper: 'w-[84%] mt-3 sm:translate-x-2' },
  { rotate: 2.5, wrapper: 'w-[88%] mt-3 sm:translate-x-10' },
];

const card =
  'rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.5)]';

const ProblemSection = () => {
  const prefersReducedMotion = useReducedMotion();
  const variants = layout.map((l) => buildFragmentVariants(prefersReducedMotion, l.rotate));

  return (
    <section className="py-20 md:py-24 page-container bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* Budskapet */}
          <div>
            <p className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
              Utfordringen
            </p>

            <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-950 leading-tight tracking-tight">
              Møtet skaper fart.
              <br />
              Oppfølgingen mister retning.
            </h2>

            <p className="mt-6 max-w-lg text-lg text-slate-600 leading-relaxed">
              Beslutninger havner i tråder, notater og opptak. Oppgaver mangler eier. Neste
              steg blir aldri samlet ett sted — og gjennomføringen stopper opp.
            </p>

            {/* Tallet står uten kilde. Hele blokken kan fjernes uten å røre resten. */}
            <div className="mt-9 flex items-baseline gap-5 border-t border-slate-200 pt-7">
              <p className="shrink-0 whitespace-nowrap text-5xl font-semibold tracking-tight text-slate-950">
                70–80 %
              </p>
              <p className="max-w-[15rem] text-sm leading-relaxed text-slate-500">
                av møtekonteksten kan forsvinne i løpet av få timer uten en samlet
                oppsummering.
              </p>
            </div>
          </div>

          {/* Rotet: der møtet faktisk havner */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ visible: { transition: { staggerChildren: 0.11 } } }}
            className="relative isolate mx-auto flex w-full max-w-md flex-col items-start px-2 lg:mx-0"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(circle,rgba(15,23,42,0.09)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
            />

            {/* Meldingen i en tråd */}
            <div className={layout[0].wrapper}>
              <motion.div variants={variants[0]} className={card}>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-semibold text-white">
                    TB
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">Teams · 09:41</span>
                </div>
                <p className="mt-2.5 text-[15px] text-slate-800">
                  Ble vi egentlig enige om 14. juni?
                </p>
              </motion.div>
            </div>

            {/* Opptaket ingen hører på */}
            <div className={layout[1].wrapper}>
              <motion.div variants={variants[1]} className={card}>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900">
                    <Play className="h-3 w-3 translate-x-[1px] fill-white text-white" />
                  </span>
                  <span
                    aria-hidden
                    className="flex h-6 flex-1 items-center gap-[3px] overflow-hidden"
                  >
                    {waveform.map((height, index) => (
                      <span
                        key={index}
                        className="w-[2px] shrink-0 rounded-full bg-slate-300"
                        style={{ height: `${height}px` }}
                      />
                    ))}
                  </span>
                  <span className="shrink-0 text-[11px] font-medium tabular-nums text-slate-400">
                    41:08
                  </span>
                </div>
                <p className="mt-2.5 flex items-center gap-1.5 text-[13px] text-slate-500">
                  <Mic className="h-3 w-3" aria-hidden />
                  Opptak fra møtet · ikke gjennomgått
                </p>
              </motion.div>
            </div>

            {/* Lappen på pulten */}
            <div className={layout[2].wrapper}>
              <motion.div
                variants={variants[2]}
                className="rounded-2xl border border-amber-200/80 bg-amber-50 p-4 shadow-[0_16px_40px_-28px_rgba(120,53,15,0.45)]"
              >
                <p className="text-lg italic text-amber-900">Sara → GTM? sjekk m/ Tomas</p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.1em] text-amber-700/70">
                  Notat på papir
                </p>
              </motion.div>
            </div>

            {/* Oppgaven uten eier */}
            <div className={layout[3].wrapper}>
              <motion.div variants={variants[3]} className={card}>
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-dashed border-slate-300 text-sm text-slate-300"
                  >
                    ?
                  </span>
                  <span className="min-w-0 flex-1 text-[15px] text-slate-800">
                    Oppdatere prismodellen
                  </span>
                  <span className="shrink-0 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600 ring-1 ring-inset ring-rose-200/70">
                    Ingen eier
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
