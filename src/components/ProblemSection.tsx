import { motion, useReducedMotion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Problemet sagt i én setning. Spørsmålet er noe alle har kjent på etter et
 * møte, så det trenger verken brødtekst eller illustrasjon for å lande – og
 * står som en pause mellom hero-kortet og app-seksjonen.
 */
const ProblemSection = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="bg-white px-6 pb-16 pt-24 text-center sm:px-10 sm:pb-20 sm:pt-32">
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
          variants={{
            hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
          }}
          className="mt-6 text-balance text-[2.35rem] font-semibold leading-[1.1] tracking-[-0.03em] text-slate-800 sm:text-5xl md:text-6xl lg:text-[4rem] lg:leading-[1.05]"
        >
          Møtet er over.
          <br />
          <span className="text-slate-500">Men hva ble egentlig bestemt?</span>
        </motion.h2>
      </motion.div>
    </section>
  );
};

export default ProblemSection;
