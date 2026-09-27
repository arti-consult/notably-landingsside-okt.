import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion, type Variants } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

/** Svarene fortsetter historien fra hero-kortet: Q3-lanseringen, Sara og prismodellen. */
const decisions = ['Lanseringen flyttes til 14. juni', 'Sara tar prismodellen', 'Status på fredag'];

const LINE_START = 0.5;
const LINE_GAP = 0.5;
/** Når siste linje er ferdig skrevet og referatet er klart, i sekunder. */
const DONE_AT = LINE_START + decisions.length * LINE_GAP + 0.3;

/**
 * Referatet skriver seg ferdig uten at noen gjør noe: linjene
 * blekkes inn fra venstre, hakene tegnes og statusen går til «Klart».
 * Spilles én gang.
 */
const DecisionsCard = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const prefersReducedMotion = useReducedMotion();
  const [doneState, setDoneState] = useState(false);
  const done = prefersReducedMotion || doneState;
  const play = inView && !prefersReducedMotion;

  useEffect(() => {
    if (!play) return;
    const timer = window.setTimeout(() => setDoneState(true), DONE_AT * 1000);
    return () => window.clearTimeout(timer);
  }, [play]);

  const shown = play || prefersReducedMotion;

  return (
    <div
      ref={ref}
      className="mx-auto mt-8 max-w-sm overflow-hidden rounded-[22px] border border-slate-200/90 bg-white text-left shadow-[0_30px_60px_-38px_rgba(15,23,42,0.45)]"
    >
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Bestemt i møtet
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={done ? 'klart' : 'skriver'}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${
                done
                  ? 'bg-emerald-50 text-emerald-700 ring-emerald-200/70'
                  : 'bg-blue-50 text-blue-700 ring-blue-200/70'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${done ? 'bg-emerald-500' : 'notably-rec-dot bg-blue-500'}`}
              />
              {done ? 'Klart' : 'Skriver …'}
            </motion.span>
          </AnimatePresence>
        </div>

        <ul className="mt-4 space-y-3">
          {decisions.map((decision, i) => {
            const delay = LINE_START + i * LINE_GAP;
            return (
              <li key={decision} className="flex items-center gap-3">
                {/* Haken tegnes opp */}
                <motion.svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="h-6 w-6 shrink-0"
                  initial={false}
                  animate={shown ? 'on' : 'off'}
                >
                  <motion.circle
                    cx="12"
                    cy="12"
                    r="12"
                    className="fill-blue-600"
                    variants={{
                      off: { scale: 0, opacity: 0 },
                      on: { scale: 1, opacity: 1, transition: { delay: delay + 0.25, duration: 0.3, ease } },
                    }}
                    style={{ transformOrigin: 'center' }}
                  />
                  <motion.path
                    d="M7 12.5l3.2 3.2L17 9"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={{
                      off: { pathLength: 0 },
                      on: { pathLength: 1, transition: { delay: delay + 0.45, duration: 0.3, ease } },
                    }}
                  />
                </motion.svg>

                {/* Teksten blekkes inn fra venstre */}
                <motion.span
                  className="text-[15px] text-slate-800"
                  initial={false}
                  animate={
                    shown
                      ? { clipPath: 'inset(0 0% 0 0)', opacity: 1 }
                      : { clipPath: 'inset(0 100% 0 0)', opacity: 0.4 }
                  }
                  transition={{ delay, duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
                >
                  {decision}
                </motion.span>
              </li>
            );
          })}
        </ul>
      </div>

    </div>
  );
};

/**
 * Spørsmål og svar. Spørsmålet er noe alle har kjent på etter et møte; rett
 * under svarer Notably konkret, med beslutningene som krysses av én og én.
 */
const ProblemSection = () => {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = (delay = 0): Variants => ({
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease } },
  });

  return (
    <section className="bg-white px-6 pb-16 pt-24 text-center sm:px-10 sm:pb-20 sm:pt-32">
      {/* Spørsmålet */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className="mx-auto max-w-5xl"
      >
        <motion.p
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.6 } },
          }}
          className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 sm:text-sm"
        >
          Kjenner du deg igjen?
        </motion.p>

        <motion.h2
          variants={fadeUp()}
          className="mt-6 text-balance text-[2.35rem] font-semibold leading-[1.1] tracking-[-0.03em] text-slate-800 sm:text-5xl md:text-6xl lg:text-[4rem] lg:leading-[1.05]"
        >
          Møtet er over.
          <br />
          <span className="text-slate-500">Men hva ble egentlig bestemt?</span>
        </motion.h2>
      </motion.div>

      {/* Svaret – egen trigger, siden kortet ofte ligger under folden på mobil. */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        className="mx-auto mt-10 max-w-md sm:mt-12"
      >
        <motion.p
          variants={fadeUp()}
          className="text-balance text-lg leading-relaxed text-slate-600 sm:text-xl"
        >
          Med Notably ligger svaret klart – med en gang møtet er slutt.
        </motion.p>

        <motion.div variants={fadeUp(0.2)}>
          <DecisionsCard />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProblemSection;
