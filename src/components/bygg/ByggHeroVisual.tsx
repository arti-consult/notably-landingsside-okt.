import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ease } from '../advokat/shared';

/**
 * Hele løftet i ett bilde: telefonen ligger på bordet i brakka og tar opp,
 * og beslutningene dukker opp på skjermen etter hvert som de blir tatt.
 * Prosjektet er oppdiktet og går igjen nedover siden.
 */

const WAVE = [0.35, 0.6, 0.9, 0.5, 0.75, 1, 0.55, 0.8, 0.4, 0.95, 0.65, 0.45, 0.85, 0.6, 1, 0.5, 0.7, 0.4, 0.9, 0.55, 0.75, 0.35];

const decisions = [
  { text: 'Sjakt S3 flyttes 40 cm mot øst', meta: 'Hilde Aas, byggherren' },
  { text: 'Marius sender varsel om endring', meta: 'Frist onsdag' },
  { text: 'ARK leverer nye tegninger for S3', meta: 'Frist fredag' },
];

function useTicker(start: number, running: boolean) {
  const [seconds, setSeconds] = useState(start);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function ByggHeroVisual() {
  const reduced = useReducedMotion();
  const time = useTicker(41 * 60 + 52, !reduced);

  return (
    <div className="relative mx-auto w-full max-w-[17rem] sm:max-w-[19.5rem]">
      <p className="sr-only">
        Illustrasjon: en telefon tar opp byggemøte nr. 14 og viser beslutningene fra møtet etter hvert som de blir
        tatt, med hvem som sa det og frister.
      </p>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 m-auto h-[22rem] w-[22rem] rounded-full bg-blue-300/20 glow scale-[1.8]"
      />

      <motion.div
        aria-hidden
        {...(reduced
          ? {}
          : { initial: { opacity: 0, y: 30, rotate: 0 }, animate: { opacity: 1, y: 0, rotate: -3 }, transition: { duration: 0.8, ease } })}
        style={reduced ? { rotate: -3 } : undefined}
        className="relative rounded-[2.8rem] bg-slate-900 p-[9px] shadow-[0_40px_80px_-30px_rgba(15,23,42,0.6)] sm:rounded-[3.1rem] sm:p-[10px]"
      >
        <div className="relative flex aspect-[9/18.5] flex-col overflow-hidden rounded-[2.3rem] bg-gradient-to-b from-slate-50 to-white px-5 pb-6 pt-11 sm:rounded-[2.6rem] sm:px-6 sm:pt-12">
          <span className="absolute left-1/2 top-2.5 h-5 w-20 -translate-x-1/2 rounded-full bg-slate-900 sm:top-3 sm:h-6 sm:w-24" />

          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">Fjordparken B2</p>
          <div className="mt-0.5 flex items-center justify-between gap-2">
            <p className="text-[17px] font-semibold tracking-tight text-slate-900 sm:text-lg">Byggemøte nr. 14</p>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-200/70">
              <span className="notably-rec-dot h-1.5 w-1.5 rounded-full bg-red-500" />
              Tar opp
            </span>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <p className="text-[1.9rem] font-semibold tabular-nums tracking-tight text-slate-900 sm:text-[2.2rem]">{time}</p>
            <div className="flex h-9 flex-1 items-center justify-end gap-[3px]">
              {WAVE.slice(0, 14).map((h, i) => (
                <span
                  key={i}
                  className="notably-wave-bar w-[3px] rounded-full bg-blue-500"
                  style={{ height: `${h * 100}%`, animationDelay: `${(i % 7) * -0.16}s`, opacity: 0.55 + h * 0.45 }}
                />
              ))}
            </div>
          </div>

          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">Beslutninger</p>
          <ul className="mt-2.5 space-y-2">
            {decisions.map(({ text, meta }, i) => (
              <motion.li
                key={text}
                {...(reduced
                  ? {}
                  : {
                      initial: { opacity: 0, y: 12, scale: 0.97 },
                      animate: { opacity: 1, y: 0, scale: 1 },
                      transition: { duration: 0.55, delay: 0.9 + i * 0.7, ease },
                    })}
                className="flex gap-2.5 rounded-2xl bg-white p-3 shadow-[0_8px_20px_-14px_rgba(15,23,42,0.35)] ring-1 ring-inset ring-slate-200/80"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold leading-snug text-slate-900 sm:text-sm">{text}</span>
                  <span className="mt-0.5 block text-[11px] text-slate-500 sm:text-xs">{meta}</span>
                </span>
              </motion.li>
            ))}
          </ul>

          <div className="mt-auto flex justify-center pt-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-blue-200">
              <span className="h-4 w-4 rounded-[5px] bg-blue-600" />
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
