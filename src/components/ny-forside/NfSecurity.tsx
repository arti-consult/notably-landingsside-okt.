import { motion, useReducedMotion } from 'framer-motion';
import { Ban, FileSignature, Lock, Server, Trash2, Users } from 'lucide-react';
import { Label, Reveal, ease } from './shared';

/**
 * Påstandene skal kunne spores til personvernerklæringen eller være bekreftet
 * av Jørgen (se docs/research-*.md). Ikke legg til sertifiseringer.
 */
const facts = [
  { icon: Server, title: 'Lagret i EU', text: 'Møter, opptak og referater lagres og behandles i EU/EØS, på servere i Tyskland.' },
  { icon: Ban, title: 'Aldri brukt til AI-trening', text: 'Det dere sier i møtene, blir aldri brukt til å trene AI-modeller.' },
  { icon: FileSignature, title: 'Databehandleravtale på plass', text: 'Avtalen følger automatisk med når dere tar Notably i bruk.' },
  { icon: Lock, title: 'Kryptert underveis', text: 'All trafikk mellom deg og Notably går kryptert (TLS).' },
  { icon: Trash2, title: 'Du bestemmer over opptaket', text: 'Slett lydfilen når du vil, og behold referatet.' },
  { icon: Users, title: 'Adskilte arbeidsområder', text: 'Hvert firma har sitt eget arbeidsområde med tilgangsstyring.' },
];

/** Tolv stjerner i ring, som i EU-flagget, rundt Notably-ikonet. */
function EuRing() {
  const reduced = useReducedMotion();
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[22rem]">
      <div aria-hidden className="absolute inset-[18%] rounded-full bg-blue-600/30 glow scale-150" />
      <motion.div
        className="absolute inset-0"
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
      >
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <motion.svg
              key={i}
              viewBox="0 0 24 24"
              aria-hidden
              initial={reduced ? false : { opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.07, type: 'spring', stiffness: 300, damping: 15 }}
              className="absolute h-6 w-6 text-[#FFCC00]"
              style={{ left: `calc(50% + ${Math.sin(a) * 42}% - 12px)`, top: `calc(50% - ${Math.cos(a) * 42}% - 12px)` }}
            >
              <path fill="currentColor" d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z" />
            </motion.svg>
          );
        })}
      </motion.div>
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
        className="absolute inset-[30%] flex flex-col items-center justify-center rounded-full bg-white shadow-[0_30px_80px_-20px_rgba(37,99,235,0.7)]"
      >
        <img src="/Notably logo icon.svg" alt="" className="h-9 w-9" />
        <p className="mt-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Tyskland</p>
      </motion.div>
    </div>
  );
}

export default function NfSecurity() {
  return (
    <section
      id="sikkerhet"
      data-ph-section="security"
      className="relative scroll-mt-20 overflow-hidden bg-[#080B12] px-5 py-24 text-white sm:px-8 sm:py-36"
    >
      <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Reveal>
            <Label dark>Sikkerhet og personvern</Label>
            <h2 className="mt-6 text-balance text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl lg:text-[3rem]">
              Møtene dine blir i Europa.
              <span className="block text-slate-500">Vi trener aldri AI på dem.</span>
            </h2>
          </Reveal>
          <ul className="mt-12 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {facts.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 0.05}>
                <Icon className="h-5 w-5 text-blue-400" aria-hidden />
                <p className="mt-3 font-semibold">{title}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-slate-400">{text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
        <EuRing />
      </div>
    </section>
  );
}
