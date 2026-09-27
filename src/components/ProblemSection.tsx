import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Check } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

/** Svarene fortsetter historien fra hero-kortet: Q3-lanseringen, Sara og prismodellen. */
const decisions = ['Lanseringen flyttes til 14. juni', 'Sara tar prismodellen', 'Status på fredag'];

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

        <motion.div
          variants={fadeUp(0.2)}
          className="mx-auto mt-8 max-w-sm rounded-[22px] border border-slate-200/90 bg-white p-5 text-left shadow-[0_30px_60px_-38px_rgba(15,23,42,0.45)]"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Bestemt i møtet
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200/70">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Klart
            </span>
          </div>

          <ul className="mt-4 space-y-3">
            {decisions.map((decision, i) => (
              <motion.li
                key={decision}
                variants={{
                  hidden: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -8 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.4, delay: 0.55 + i * 0.3, ease },
                  },
                }}
                className="flex items-center gap-3"
              >
                <motion.span
                  variants={{
                    hidden: { scale: prefersReducedMotion ? 1 : 0 },
                    visible: {
                      scale: 1,
                      transition: {
                        type: 'spring',
                        stiffness: 420,
                        damping: 18,
                        delay: 0.65 + i * 0.3,
                      },
                    },
                  }}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600"
                >
                  <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} aria-hidden />
                </motion.span>
                <span className="text-[15px] text-slate-800">{decision}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProblemSection;
