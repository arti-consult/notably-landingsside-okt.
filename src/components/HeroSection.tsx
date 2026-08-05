import { useMemo, useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/** Ved redusert bevegelse tones innholdet inn uten å forskyves. */
const buildItemVariants = (reduced: boolean | null): Variants => ({
  hidden: { opacity: 0, y: reduced ? 0 : 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
});

/** Overskriften staggrer sine egne to linjer. */
const headingVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/** Hver linje stiger opp bak en maske. */
const buildLineVariants = (reduced: boolean | null): Variants => ({
  hidden: reduced ? { opacity: 0 } : { y: '112%' },
  visible: {
    opacity: 1,
    y: '0%',
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
});

/**
 * Overskriften settes i ett mørkt blekk med en tonal gradient over de to
 * linjene. Stoppene henger sammen: linje 2 starter der linje 1 slutter, slik at
 * skiftet leses som én flate og ikke som to striper.
 *
 * Gradienten går MØRKERE nedover, ikke lysere. To grunner: poenget landes på
 * siste linje, som da er den dypeste – ikke den svakeste – og ingen del av
 * teksten leses som grå. Lyseste punkt er ~12:1 mot hvitt.
 */
const headingLines = [
  { text: 'Møtereferatet', ink: 'bg-gradient-to-b from-[#223049] to-[#141E33]' },
  { text: 'skriver seg selv.', ink: 'bg-gradient-to-b from-[#141E33] to-[#080D18]' },
];

const participants = [
  { initials: 'JN', className: 'bg-blue-600' },
  { initials: 'SA', className: 'bg-emerald-600' },
  { initials: 'TB', className: 'bg-amber-500' },
  { initials: 'MK', className: 'bg-indigo-600' },
];

const tasks = [
  { owner: 'SA', name: 'Sara', task: 'Ferdigstille go-to-market', due: 'Fre' },
  { owner: 'TB', name: 'Tomas', task: 'Oppdatere prisene', due: '12. jun' },
];

/** Referatet Notably produserer – hero-seksjonens visuelle anker. */
const ReferatCard = () => (
  <div aria-hidden className="relative w-full max-w-[26rem] lg:max-w-none">
    {/* Kort bak, gir dybde */}
    <div className="absolute -right-3 -top-4 h-full w-full rotate-[3deg] rounded-[26px] border border-slate-200/70 bg-white/60 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)]" />

    <div className="relative overflow-hidden rounded-[26px] border border-slate-200/90 bg-white shadow-[0_36px_80px_-40px_rgba(15,23,42,0.45)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

      <div className="relative p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold leading-snug tracking-tight text-slate-900 sm:text-xl">
            Statusmøte · Q3-lansering
          </h2>
          <span className="mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200/70">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Klart
          </span>
        </div>

        <div className="mt-2.5 flex items-center gap-3">
          <p className="text-[13px] text-slate-500">I dag 09:15 · 41 min</p>
          <div className="flex -space-x-1.5">
            {participants.map(({ initials, className }) => (
              <span
                key={initials}
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-semibold text-white ring-2 ring-white ${className}`}
              >
                {initials}
              </span>
            ))}
          </div>
        </div>

        <div className="my-6 h-px bg-slate-100" />

        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Sammendrag
        </p>
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-600">
          Teamet gikk gjennom fremdrift og risiko før lansering. Datoen justeres for å rekke
          integrasjonstesten, og ansvaret for go-to-market er fordelt.
        </p>

        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Oppgaver
        </p>
        <ul className="mt-2.5 space-y-2">
          {tasks.map(({ owner, name, task, due }) => (
            <li
              key={task}
              className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 px-3 py-2.5"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[9px] font-semibold text-white">
                {owner}
              </span>
              <span className="min-w-0 flex-1 truncate text-[13px] text-slate-700">
                <span className="font-medium text-slate-900">{name}</span> · {task}
              </span>
              <span className="shrink-0 rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-slate-500 ring-1 ring-inset ring-slate-200">
                {due}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const itemVariants = useMemo(
    () => buildItemVariants(prefersReducedMotion),
    [prefersReducedMotion]
  );
  const lineVariants = useMemo(
    () => buildLineVariants(prefersReducedMotion),
    [prefersReducedMotion]
  );

  const rawY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const y = useSpring(rawY, { stiffness: 90, damping: 24, mass: 0.6 });
  const rotate = useTransform(scrollYProgress, [0, 1], [-1.6, 1.2]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-6 pb-16 pt-32 sm:px-10 sm:pt-36 md:px-[12%] lg:pb-20 xl:pl-[19%] xl:pr-[12%]"
    >
      {/* Atmosfære */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[38rem] w-[38rem] rounded-full bg-blue-400/25 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[12%] top-16 h-[26rem] w-[26rem] rounded-full bg-indigo-400/20 blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          {/* Budskap */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {/* Løsere linjeavstand på mobil, stram på store skjermer der
                typen er stor nok til å tåle det. */}
            <motion.h1
              variants={headingVariants}
              // Trinnene er regnet mot Schibsted Grotesk, som er ~13 % bredere
              // enn systemfonten. Målt slik at «skriver seg selv.» pluss markøren
              // alltid står på én linje, også på 1024px der kolonnen er smalest.
              className="text-[2.375rem] font-semibold leading-[1.12] tracking-[-0.025em] text-[#0B1120] sm:text-[3.25rem] lg:text-[3rem] lg:leading-[1.04] xl:text-[3.5rem] 2xl:text-[4rem]"
            >
              {headingLines.map(({ text, ink }, index) => (
                // Masken må ha plass til nedstreker, ellers klippes «g» i «seg».
                <span key={text} className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
                  <motion.span variants={lineVariants} className="block">
                    {/* Tonal gradient i samme farge – lys som faller på blekk, ikke
                        kromatisk gradient. Stoppene fortsetter fra linje til linje.
                        I tvungen kontrastmodus overstyres bakgrunner, så gradienten
                        slås av og teksten får systemfargen – ellers blir den usynlig. */}
                    <span
                      className={`bg-clip-text text-transparent forced-colors:bg-none forced-colors:text-[CanvasText] ${ink}`}
                    >
                      {text}
                    </span>
                    {index === headingLines.length - 1 && (
                      <span
                        aria-hidden
                        className="notably-caret ml-[0.1em] inline-block h-[0.72em] w-[0.075em] rounded-[2px] bg-blue-600 align-baseline"
                      />
                    )}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-7 max-w-md text-lg leading-relaxed text-slate-600 sm:text-xl"
            >
              Notably blir med i møtet, tar opp og skriver referatet — automatisk, og på norsk.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-11 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <a
                href="https://app.notably.no/no/sign-up"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-transparent bg-blue-600 px-6 py-4 text-lg font-semibold text-white shadow-[0_18px_36px_-18px_rgba(37,99,235,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
              >
                Start gratis
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
              <a
                href="https://calendly.com/arti-jorgen/notably-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-slate-300 bg-white/70 px-6 py-4 text-lg font-semibold text-slate-700 backdrop-blur transition-colors hover:border-slate-400 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-500"
              >
                Book en demo
              </a>
            </motion.div>

            <motion.p variants={itemVariants} className="mt-6 text-sm text-slate-500">
              14 dager gratis · full tilgang
            </motion.p>
          </motion.div>

          {/* Referatet */}
          <div className="relative flex justify-center lg:justify-end">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 m-auto h-[24rem] w-[24rem] rounded-full bg-blue-400/20 blur-[100px]"
            />
            {/* Ytre lag animerer inngangen, indre lag følger scroll –
                de kan ikke dele samme y-verdi uten å overstyre hverandre. */}
            <motion.div
              className="relative w-full max-w-[26rem] lg:max-w-[27rem]"
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 34 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div style={prefersReducedMotion ? undefined : { y, rotate }}>
                <ReferatCard />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
