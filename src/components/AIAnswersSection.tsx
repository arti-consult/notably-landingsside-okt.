import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUp, FileText, Sparkles } from 'lucide-react';

/**
 * Tre spørsmål som viser bredden: en beslutning, en ansvarlig og noe fra lenge
 * siden. Kildene viser at svaret hentes fra et bestemt møte.
 */
const examples = [
  {
    question: 'Hva ble bestemt om Q2-strategien?',
    answer:
      'Tre prioriteringer: øke markedsandelen i Norden med 15 %, lansere to nye funksjoner innen juni og styrke kundeservice med tre ansatte.',
    source: 'Strategimøte · 14. mars',
  },
  {
    question: 'Hvem har ansvaret for lanseringen?',
    answer: 'Sara Jensen leder lanseringen, med støtte fra tech-teamet til Tomas Andersen.',
    source: 'Statusmøte · Q3-lansering',
  },
  {
    question: 'Hva sa kunden om prisen i fjor?',
    answer:
      'Kunden syntes prisen var høy, men åpnet for en treårsavtale med 10 % rabatt.',
    source: 'Salgsmøte · 3. oktober 2025',
  },
];

type Phase = 'typing' | 'searching' | 'answer';

const TYPE_SPEED = 38;
const SEARCH_TIME = 1100;
const HOLD_TIME = 3000;

export default function AIAnswersSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.5 });
  const prefersReducedMotion = useReducedMotion();
  const animate = inView && !prefersReducedMotion;

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('typing');
  const [typed, setTyped] = useState(0);

  const { question, answer, source } = examples[index];

  // Uten animasjon vises spørsmål og svar ferdig med en gang.
  const shownPhase: Phase = prefersReducedMotion ? 'answer' : phase;
  const shownTyped = prefersReducedMotion ? question.length : typed;

  // Én tidsstyrt sekvens per eksempel: skriv → søk → svar → neste.
  useEffect(() => {
    if (!animate) return;
    let timer: number;

    if (phase === 'typing') {
      timer =
        typed < question.length
          ? window.setTimeout(() => setTyped((t) => t + 1), TYPE_SPEED)
          : window.setTimeout(() => setPhase('searching'), 250);
    } else if (phase === 'searching') {
      timer = window.setTimeout(() => setPhase('answer'), SEARCH_TIME);
    } else {
      timer = window.setTimeout(() => {
        setIndex((i) => (i + 1) % examples.length);
        setTyped(0);
        setPhase('typing');
      }, HOLD_TIME);
    }
    return () => window.clearTimeout(timer);
  }, [animate, phase, typed, question.length]);

  return (
    <section className="py-20 page-container bg-gray-50 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-slate-800 sm:text-4xl md:text-5xl md:leading-[1.1]">
          Spør om alt som har blitt sagt.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-balance text-lg leading-relaxed text-slate-600">
          Notably søker i alle møtene dine og svarer med én gang – enten møtet var i går
          eller i fjor.
        </p>
      </div>

      {/* Skjermlesere får eksemplene som tekst; selve demoen er dekor. */}
      <dl className="sr-only">
        {examples.map((example) => (
          <div key={example.question}>
            <dt>{example.question}</dt>
            <dd>
              {example.answer} Kilde: {example.source}.
            </dd>
          </div>
        ))}
      </dl>

      <div ref={stageRef} className="mx-auto mt-12 max-w-2xl">
        {/* Spørsmålsfeltet */}
        <div
          aria-hidden
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white py-2.5 pl-3 pr-2.5 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <Sparkles className="h-[18px] w-[18px] text-blue-600" />
          </span>
          <p className="min-w-0 flex-1 text-left text-[15px] leading-snug text-slate-800 sm:text-base">
            {question.slice(0, shownTyped)}
            {shownPhase === 'typing' && (
              <span className="notably-caret ml-[1px] inline-block h-[1.05em] w-[2px] translate-y-[3px] rounded-full bg-blue-600" />
            )}
          </p>
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
              shownTyped === question.length ? 'bg-blue-600' : 'bg-slate-200'
            }`}
          >
            <ArrowUp className="h-4 w-4 text-white" />
          </span>
        </div>

        {/* Svaret. Fast minimumshøyde, så siden ikke hopper mellom eksemplene. */}
        <div aria-hidden className="relative mt-3 min-h-[11.5rem] sm:min-h-[10rem]">
          <AnimatePresence mode="wait">
            {shownPhase === 'searching' && (
              <motion.div
                key={`search-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 px-4 pt-4 text-sm text-slate-500"
              >
                <span className="flex gap-1">
                  {[0, 1, 2].map((dot) => (
                    <motion.span
                      key={dot}
                      className="h-1.5 w-1.5 rounded-full bg-blue-500"
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.15 }}
                    />
                  ))}
                </span>
                Søker i 248 møter …
              </motion.div>
            )}

            {shownPhase === 'answer' && (
              <motion.div
                key={`answer-${index}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 text-left"
              >
                <p className="text-[15px] leading-relaxed text-slate-700 sm:text-base">
                  {answer.split(' ').map((word, i) => (
                    <motion.span
                      key={i}
                      initial={prefersReducedMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25, delay: i * 0.035 }}
                    >
                      {word}{' '}
                    </motion.span>
                  ))}
                </p>
                <motion.p
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: answer.split(' ').length * 0.035 + 0.1 }}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                >
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  {source}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
