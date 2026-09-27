import { useRef } from 'react';
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion';
import { Check, Lock, Mic, X } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';

const ease = [0.22, 1, 0.36, 1] as const;

/** Påstandene her skal stemme med personvernerklæringen – ikke legg til sertifiseringer vi ikke har. */
const facts = ['GDPR-kompatibel', 'Egen drift i EU', 'Skille mellom arbeidsområder'];

/** Tolv femtakkede stjerner i en sirkel, som i EU-flagget. */
const euStars = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  const cx = 15 + Math.sin(angle) * 6;
  const cy = 10 - Math.cos(angle) * 6;
  return Array.from({ length: 10 }, (_, k) => {
    const r = k % 2 === 0 ? 1.5 : 0.65;
    const a = (k / 10) * Math.PI * 2;
    return `${(cx + Math.sin(a) * r).toFixed(2)},${(cy - Math.cos(a) * r).toFixed(2)}`;
  }).join(' ');
});

const EuFlag = () => (
  <svg viewBox="0 0 30 20" aria-hidden className="h-3.5 w-[1.3rem] rounded-[2px] shadow-[0_0_0_1px_rgba(15,23,42,0.08)]">
    <rect width="30" height="20" fill="#003399" />
    {euStars.map((points, i) => (
      <polygon key={i} points={points} fill="#FFCC00" />
    ))}
  </svg>
);

const node =
  'flex w-full max-w-[15rem] flex-col sm:max-w-none items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white px-3 py-4 text-center shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] sm:px-6 sm:py-5';

/**
 * Viser hvor møtedataene faktisk går i stedet for å bare si det: fra møtet,
 * kryptert, til Notably i EU – og aldri videre til modelltrening.
 */
export default function SecuritySection() {
  const diagramRef = useRef<HTMLDivElement>(null);
  const inView = useInView(diagramRef, { amount: 0.5 });
  const prefersReducedMotion = useReducedMotion();
  const pulse = inView && !prefersReducedMotion;
  // Loddrett flyt på mobil, vannrett fra sm – pulsen følger samme akse.
  const horizontal = useMediaQuery('(min-width: 640px)');

  const step = (delay: number): Variants => ({
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease } },
  });

  return (
    <section className="page-container bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 sm:text-sm">
            Sikkerhet og personvern
          </p>
          <h2 className="mt-5 text-balance text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-slate-800 sm:text-4xl md:text-5xl md:leading-[1.1]">
            Møtene dine blir i Europa.
            <span className="block text-slate-500">Vi trener aldri AI på dem.</span>
          </h2>
        </div>

        {/* Dataflyten */}
        <motion.div
          ref={diagramRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mt-12 rounded-[2rem] bg-slate-50 px-4 py-10 sm:mt-14 sm:px-12 sm:py-14"
        >
          <div className="flex flex-col items-center sm:grid sm:grid-cols-[1fr_minmax(6rem,1.1fr)_1fr] sm:items-center">
            {/* Møtet */}
            <motion.div variants={step(0)} className={node}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900">
                <Mic className="h-[18px] w-[18px] text-white" aria-hidden />
              </span>
              <span>
                <span className="block text-[15px] font-semibold text-slate-900">Møtet ditt</span>
                <span className="mt-0.5 block text-xs text-slate-500 sm:text-[13px]">Opptak og tale</span>
              </span>
            </motion.div>

            {/* Den krypterte linjen */}
            <motion.div
              variants={step(0.25)}
              className="relative flex h-20 w-full items-center justify-center sm:mx-3 sm:h-auto sm:w-auto"
            >
              <div className="relative h-full w-px bg-slate-300 sm:h-px sm:w-full">
                {pulse && (
                  <motion.span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.18)]"
                    animate={
                      horizontal
                        ? { left: ['0%', '100%'], top: '50%', opacity: [0, 1, 1, 0] }
                        : { top: ['0%', '100%'], left: '50%', opacity: [0, 1, 1, 0] }
                    }
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
                  />
                )}
                <span className="absolute left-1/2 top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white">
                  <Lock className="h-3.5 w-3.5 text-blue-600" aria-hidden />
                </span>
              </div>
              <span className="absolute left-1/2 top-1/2 ml-6 -translate-y-1/2 whitespace-nowrap text-xs font-medium text-slate-500 sm:ml-0 sm:top-5 sm:-translate-x-1/2 sm:translate-y-0">
                Kryptert (TLS)
              </span>
            </motion.div>

            {/* Notably i EU */}
            <motion.div variants={step(0.5)} className={`${node} ring-1 ring-blue-100`}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                <img
                  src="/Notably logo icon.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="h-5 w-5 object-contain"
                />
              </span>
              <span>
                <span className="block text-[15px] font-semibold text-slate-900">Notably</span>
                <span className="mt-0.5 flex items-center justify-center gap-1.5 text-xs text-slate-500 sm:text-[13px]">
                  <EuFlag />
                  Lagret i EU
                </span>
              </span>
            </motion.div>

            {/* Grenen som aldri brukes */}
            <div className="flex flex-col items-center sm:col-start-3">
              <motion.span
                aria-hidden
                variants={{
                  hidden: { scaleY: 0 },
                  visible: { scaleY: 1, transition: { duration: 0.4, delay: 0.85, ease } },
                }}
                className="h-8 w-px origin-top border-l border-dashed border-slate-300 sm:h-10"
              />
              <motion.div
                variants={step(1.1)}
                className="flex items-center gap-2 rounded-full border border-dashed border-slate-300 bg-white/60 py-1.5 pl-1.5 pr-3.5"
              >
                <motion.span
                  variants={{
                    hidden: { scale: prefersReducedMotion ? 1 : 0 },
                    visible: { scale: 1, transition: { type: 'spring', stiffness: 400, damping: 18, delay: 1.35 } },
                  }}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500"
                >
                  <X className="h-3 w-3 text-white" strokeWidth={3} aria-hidden />
                </motion.span>
                <span className="text-[13px] font-medium text-slate-400 line-through decoration-slate-300 sm:text-sm">
                  <span className="sr-only">Brukes aldri til </span>
                  Modelltrening
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Faktaene */}
        <div className="mt-8 flex flex-col items-center gap-5 sm:mt-10">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            {facts.map((fact) => (
              <li key={fact} className="flex items-center gap-2 text-[15px] text-slate-700">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-inset ring-emerald-200">
                  <Check className="h-3 w-3 text-emerald-600" strokeWidth={3} aria-hidden />
                </span>
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
