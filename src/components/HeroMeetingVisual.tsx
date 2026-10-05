import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import { Check } from 'lucide-react';

/**
 * «Møtereferatet skriver seg selv», vist i stedet for forklart: det noen sier i
 * møtet dukker opp som en taleboble, som så glir ned i referatet og blir en
 * ryddig linje. Boble og linje deler layoutId, så framer-motion morfer den ene
 * over i den andre.
 */

export interface MeetingSpeaker {
  initials: string;
  color: string;
}

export interface MeetingItem {
  speaker: number;
  said: string;
  tag: string;
  tagClass: string;
  text: string;
  due?: string;
}

const defaultSpeakers: MeetingSpeaker[] = [
  { initials: 'JN', color: 'bg-blue-600' },
  { initials: 'SA', color: 'bg-emerald-600' },
  { initials: 'MK', color: 'bg-indigo-600' },
];

const defaultItems: MeetingItem[] = [
  {
    speaker: 0,
    said: 'Vi flytter lanseringen til 14. juni.',
    tag: 'Beslutning',
    tagClass: 'bg-blue-50 text-blue-700 ring-blue-200/70',
    text: 'Lansering 14. juni',
  },
  {
    speaker: 1,
    said: 'Jeg tar prismodellen innen fredag.',
    tag: 'Oppgave',
    tagClass: 'bg-amber-50 text-amber-700 ring-amber-200/70',
    text: 'Sara · prismodellen',
    due: 'Fre',
  },
  {
    speaker: 2,
    said: 'Vi tar en statussjekk på tirsdag.',
    tag: 'Neste møte',
    tagClass: 'bg-slate-100 text-slate-600 ring-slate-200',
    text: 'Statussjekk tirsdag',
  },
];

/**
 * Stegene i én runde: snakk → skriv, tre ganger, så «klart».
 * Partall = noen snakker (boble), oddetall = boblen blir til en linje.
 */
const STEP_TIMES = [1900, 750, 1900, 750, 1900, 900, 3200];
const DONE_STEP = 6;

const ease = [0.22, 1, 0.36, 1] as const;

interface HeroMeetingVisualProps {
  title?: string;
  speakers?: MeetingSpeaker[];
  items?: MeetingItem[];
}

export default function HeroMeetingVisual({
  title = 'Statusmøte · Q3',
  speakers = defaultSpeakers,
  items = defaultItems,
}: HeroMeetingVisualProps = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const prefersReducedMotion = useReducedMotion();
  const animate = inView && !prefersReducedMotion;

  const [step, setStep] = useState(0);
  // Ny runde = nye layoutId-er, så linjene fra forrige runde ikke morfer
  // tilbake opp i den første boblen.
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!animate) return;
    const timer = window.setTimeout(() => {
      if (step === DONE_STEP) {
        setCycle((c) => c + 1);
        setStep(0);
      } else {
        setStep((s) => s + 1);
      }
    }, STEP_TIMES[step]);
    return () => window.clearTimeout(timer);
  }, [animate, step]);

  // Med redusert bevegelse vises sluttresultatet stille.
  const shownStep = prefersReducedMotion ? DONE_STEP : step;
  const speakingIndex = shownStep % 2 === 0 && shownStep < DONE_STEP ? shownStep / 2 : null;
  const writtenCount = Math.min(Math.ceil(shownStep / 2), items.length);
  const writing = shownStep % 2 === 1 && shownStep < DONE_STEP;
  const done = shownStep === DONE_STEP;
  const activeSpeaker = speakingIndex !== null ? items[speakingIndex].speaker : null;

  return (
    <div ref={ref} aria-hidden className="relative w-full max-w-[26rem] lg:max-w-none">
      {/* Kort bak, gir dybde */}
      <div className="absolute -right-3 -top-4 h-full w-full rotate-[3deg] rounded-[26px] border border-slate-200/70 bg-white/60 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)]" />

      <div className="relative overflow-hidden rounded-[26px] border border-slate-200/90 bg-white shadow-[0_36px_80px_-40px_rgba(15,23,42,0.45)]">
        <LayoutGroup>
          <div className="p-6 sm:p-7">
            {/* Toppen: møtet og status */}
            <div className="flex items-center justify-between gap-3">
              <h2 className="truncate text-lg font-semibold tracking-tight text-slate-900">
                {title}
              </h2>
              <AnimatePresence mode="wait" initial={false}>
                {done ? (
                  <motion.span
                    key="klart"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200/70"
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                    Referat klart
                  </motion.span>
                ) : (
                  <motion.span
                    key="opptak"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-inset ring-rose-200/70"
                  >
                    <span className="notably-rec-dot h-1.5 w-1.5 rounded-full bg-rose-500" />
                    Tar opp
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Deltakerne – den som snakker lyser opp */}
            <div className="mt-5 flex items-center gap-2.5">
              {speakers.map(({ initials, color }, i) => {
                const talking = activeSpeaker === i;
                return (
                  <motion.span
                    key={initials}
                    animate={{ scale: talking ? 1.08 : 1, opacity: activeSpeaker === null || talking ? 1 : 0.45 }}
                    transition={{ duration: 0.3 }}
                    className={`relative flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold text-white ${color} ${
                      talking ? 'ring-4 ring-blue-100' : 'ring-2 ring-white'
                    }`}
                  >
                    {initials}
                  </motion.span>
                );
              })}
              {/* Lydbølgen følger den som snakker */}
              <span className="ml-1 flex h-6 items-center gap-[3px]">
                {[8, 16, 11, 20, 13, 17, 9].map((h, i) => (
                  <span
                    key={i}
                    className={`w-[3px] rounded-full transition-colors duration-300 ${
                      activeSpeaker !== null ? 'notably-wave-bar bg-blue-500' : 'bg-slate-200'
                    }`}
                    style={{ height: `${h}px`, animationDelay: `${i * 0.09}s` }}
                  />
                ))}
              </span>
            </div>

            {/* Talebobla */}
            <div className="relative mt-4 h-[3.25rem]">
              <AnimatePresence>
                {speakingIndex !== null && (
                  <motion.div
                    key={`bubble-${cycle}-${speakingIndex}`}
                    layoutId={`item-${cycle}-${speakingIndex}`}
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease }}
                    className="absolute left-0 top-0 max-w-full rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3"
                  >
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="truncate text-[14px] text-slate-700"
                    >
                      «{items[speakingIndex].said}»
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="my-5 h-px bg-slate-100" />

            {/* Referatet som skriver seg selv */}
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Referat
              {writing && (
                <span className="notably-caret inline-block h-3 w-[2px] rounded-full bg-blue-600" />
              )}
            </p>

            <ul className="mt-3 space-y-2">
              {items.map((item, i) => (
                <li key={i} className="relative h-11">
                  {/* Plassholder til linjen er skrevet, så kortet ikke endrer høyde */}
                  <div className="absolute inset-0 flex items-center gap-3 rounded-xl border border-dashed border-slate-200 px-3">
                    <span className="h-2 w-14 rounded-full bg-slate-100" />
                    <span className="h-2 flex-1 rounded-full bg-slate-100" />
                  </div>

                  <AnimatePresence>
                    {i < writtenCount && (
                      <motion.div
                        key={`row-${cycle}-${i}`}
                        layoutId={prefersReducedMotion ? undefined : `item-${cycle}-${i}`}
                        exit={{ opacity: 0, transition: { duration: 0.35 } }}
                        transition={{ duration: 0.7, ease }}
                        className="absolute inset-0 flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3"
                      >
                        <motion.span
                          initial={prefersReducedMotion ? false : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.35, duration: 0.3 }}
                          className="flex min-w-0 flex-1 items-center gap-2.5"
                        >
                          <span
                            className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${item.tagClass}`}
                          >
                            {item.tag}
                          </span>
                          <span className="truncate text-[13.5px] font-medium text-slate-800">
                            {item.text}
                          </span>
                          {item.due && (
                            <span className="ml-auto shrink-0 rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-slate-500 ring-1 ring-inset ring-slate-200">
                              {item.due}
                            </span>
                          )}
                        </motion.span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </div>
        </LayoutGroup>
      </div>
    </div>
  );
}
