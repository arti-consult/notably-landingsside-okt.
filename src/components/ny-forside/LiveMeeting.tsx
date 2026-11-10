import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { Check, CornerDownRight, Send } from 'lucide-react';
import { Lines, ease } from './shared';

type Kind = 'beslutning' | 'oppgave';

interface Line {
  t: string;
  who: keyof typeof people;
  text: string;
  /** Delen av replikken Notably markerer. */
  mark?: string;
  kind?: Kind;
  /** Det som havner i referatet. */
  note?: string;
  owner?: string;
}

const people = {
  Kari: { initials: 'KB', color: 'bg-blue-600', text: 'text-blue-700' },
  Ola: { initials: 'OS', color: 'bg-amber-500', text: 'text-amber-700' },
  Amir: { initials: 'AH', color: 'bg-emerald-600', text: 'text-emerald-700' },
};

const script: Line[] = [
  { t: '00:12', who: 'Kari', text: 'Da starter vi. Hvor står vi med tilbudet til Nordvik?' },
  { t: '00:31', who: 'Ola', text: 'Prisen er klar, men de vil starte før jul.' },
  {
    t: '01:04',
    who: 'Kari',
    text: 'Da sier vi ja til oppstart 2. desember.',
    mark: 'oppstart 2. desember',
    kind: 'beslutning',
    note: 'Oppstart hos Nordvik 2. desember',
  },
  {
    t: '01:22',
    who: 'Amir',
    text: 'Jeg sender den reviderte avtalen innen fredag.',
    mark: 'sender den reviderte avtalen innen fredag',
    kind: 'oppgave',
    note: 'Sende revidert avtale',
    owner: 'Amir · fredag',
  },
  { t: '02:10', who: 'Ola', text: 'Should we loop in Sarah from the London office?' },
  {
    t: '02:18',
    who: 'Kari',
    text: 'Ja, Ola inviterer henne til neste møte.',
    mark: 'Ola inviterer henne til neste møte',
    kind: 'oppgave',
    note: 'Invitere Sarah til neste møte',
    owner: 'Ola · neste møte',
  },
];

const LINE_MS = 1700;
const HOLD_MS = 5200;

const markClass: Record<Kind, string> = {
  beslutning: 'bg-blue-200/80',
  oppgave: 'bg-amber-200/90',
};

function Marked({ line, instant }: { line: Line; instant: boolean }) {
  if (!line.mark) return <>{line.text}</>;
  const i = line.text.indexOf(line.mark);
  const before = line.text.slice(0, i);
  const after = line.text.slice(i + line.mark.length);
  return (
    <>
      {before}
      <span className="relative whitespace-normal">
        <motion.span
          aria-hidden
          initial={instant ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.7, ease }}
          className={`absolute -inset-x-1 inset-y-0 -z-0 origin-left rounded-[4px] ${markClass[line.kind!]}`}
        />
        <span className="relative">{line.mark}</span>
      </span>
      {after}
    </>
  );
}

/**
 * Heroens illustrasjon: et møte som pågår. Replikkene kommer inn i
 * transkripsjonen, Notably markerer det som er viktig, og markeringene havner i
 * referatet til høyre. Spilles i løkke bare mens kortet er synlig.
 */
export default function LiveMeeting() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduced = useReducedMotion();
  const [step, setStep] = useState(reduced ? script.length + 1 : 1);
  const [seconds, setSeconds] = useState(12);

  const done = step > script.length;
  const shown = script.slice(0, Math.min(step, script.length));
  const notes = shown.filter((l) => l.kind);

  useEffect(() => {
    if (reduced || !inView) return;
    const id = window.setTimeout(
      () => setStep((s) => (s > script.length ? 1 : s + 1)),
      step > script.length ? HOLD_MS : LINE_MS,
    );
    return () => window.clearTimeout(id);
  }, [step, inView, reduced]);

  useEffect(() => {
    if (reduced || !inView || done) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [inView, reduced, done]);

  const time = `${String(Math.floor(seconds / 60) + 14).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const speaking = !done ? shown[shown.length - 1]?.who : undefined;

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-[1.75rem] bg-white shadow-[0_50px_120px_-50px_rgba(11,15,25,0.45)] ring-1 ring-slate-900/[0.07]"
    >
      {/* Vinduslinjen */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="hidden gap-1.5 sm:flex" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          </div>
          <p className="truncate text-sm font-semibold text-slate-900">Prosjektmøte · Nordvik</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex -space-x-2" aria-hidden>
            {(Object.keys(people) as (keyof typeof people)[]).map((name) => (
              <span
                key={name}
                className={`relative flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-white ${people[name].color}`}
              >
                {people[name].initials}
                {speaking === name && (
                  <span className="absolute -inset-1 animate-ping rounded-full ring-2 ring-current opacity-40" />
                )}
              </span>
            ))}
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold ring-1 ring-inset ${
              done ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-blue-50 text-blue-700 ring-blue-200'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${done ? 'bg-emerald-500' : 'notably-rec-dot bg-red-500'}`} />
            {done ? 'Ferdig' : time}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-[1.15fr_0.85fr]">
        {/* Transkripsjonen */}
        <div className="relative h-[19rem] overflow-hidden px-4 pb-4 pt-5 sm:h-[22rem] sm:px-6">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Transkripsjon</p>
          <div className="absolute inset-x-0 bottom-0 top-12 flex flex-col justify-end px-4 pb-5 sm:px-6">
            <ul className="space-y-3.5">
              <AnimatePresence initial={false}>
                {shown.map((line, i) => {
                  const p = people[line.who];
                  return (
                    <motion.li
                      key={`${line.t}-${i}`}
                      layout={!reduced}
                      initial={reduced ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease }}
                      className="flex gap-3"
                    >
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white ${p.color}`}
                        aria-hidden
                      >
                        {p.initials}
                      </span>
                      <div className="min-w-0">
                        <p className="flex items-baseline gap-2 text-[12px]">
                          <span className={`font-semibold ${p.text}`}>{line.who}</span>
                          <span className="font-mono text-[10px] text-slate-400">{line.t}</span>
                        </p>
                        <p className="relative mt-0.5 text-[14px] leading-snug text-slate-700 sm:text-[15px]">
                          <Marked line={line} instant={!!reduced} />
                        </p>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-10 h-16 bg-gradient-to-b from-white to-transparent" />
        </div>

        {/* Referatet */}
        <div className="relative border-t border-slate-100 bg-[#FAFAF8] px-4 pb-5 pt-5 sm:px-6 md:border-l md:border-t-0">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              <Lines className="h-2.5 w-3 text-blue-600" />
              Referat
            </p>
            <AnimatePresence>
              {done && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white"
                >
                  <Check className="h-3 w-3" strokeWidth={3} aria-hidden /> Klart
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <ul className="mt-4 min-h-[9.5rem] space-y-2.5">
            <AnimatePresence initial={false}>
              {notes.map((n) => (
                <motion.li
                  key={n.note}
                  initial={reduced ? false : { opacity: 0, x: -26, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, delay: 0.55, ease }}
                  className="rounded-xl bg-white p-3 shadow-[0_8px_24px_-16px_rgba(11,15,25,0.35)] ring-1 ring-slate-900/[0.06]"
                >
                  <span
                    className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      n.kind === 'beslutning' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {n.kind === 'beslutning' ? 'Beslutning' : 'Oppgave'}
                  </span>
                  <p className="mt-1.5 text-[13.5px] font-medium leading-snug text-slate-900">{n.note}</p>
                  {n.owner && (
                    <p className="mt-1 flex items-center gap-1 text-[12px] text-slate-500">
                      <CornerDownRight className="h-3 w-3" aria-hidden />
                      {n.owner}
                    </p>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <motion.div
            initial={false}
            animate={{ opacity: done ? 1 : 0.35 }}
            className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-slate-950 px-3.5 py-2.5 text-[13px] font-semibold text-white"
          >
            <span>Send til deltakerne</span>
            <Send className="h-3.5 w-3.5" aria-hidden />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
