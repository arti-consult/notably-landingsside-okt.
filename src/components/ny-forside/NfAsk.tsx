import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUp, FileText, Search } from 'lucide-react';
import { Label, Reveal, ease } from './shared';

const examples = [
  {
    q: 'Hva ble bestemt om lanseringen?',
    a: 'Lanseringen flyttes til 14. juni. Sara tar ansvaret for prismodellen, og dere tar en statussjekk fredag.',
    src: 'Statusmøte · 2. oktober',
  },
  {
    q: 'Hva lovet vi Nordvik om leveransen?',
    a: 'Første versjon leveres innen uke 46, og opplæring for to personer er inkludert i prisen.',
    src: 'Kundemøte · Nordvik AS · 18. september',
  },
  {
    q: 'Hvem skulle følge opp budsjettet?',
    a: 'Amir har ansvaret. Han legger fram et revidert budsjett på neste styremøte.',
    src: 'Styremøte · 9. september',
  },
  {
    q: 'Hva var kundens største innvending i fjor?',
    a: 'Prisen. Kunden åpnet likevel for en treårsavtale hvis oppstarten kunne skje før sommeren.',
    src: 'Salgsmøte · 3. oktober 2025',
  },
];

type Phase = 'typing' | 'searching' | 'answer';

/**
 * Spør møtene dine. Besøkende kan trykke på et spørsmål selv. Til de gjør det,
 * går eksemplene av seg selv mens seksjonen er synlig.
 */
export default function NfAsk() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('typing');
  const [typed, setTyped] = useState(0);
  const [manual, setManual] = useState(false);
  const { q, a, src } = examples[index];

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setTyped(q.length);
      setPhase('answer');
      return;
    }
    let t: number;
    if (phase === 'typing') {
      t = typed < q.length ? window.setTimeout(() => setTyped((n) => n + 1), 32) : window.setTimeout(() => setPhase('searching'), 200);
    } else if (phase === 'searching') {
      t = window.setTimeout(() => setPhase('answer'), 1000);
    } else if (!manual) {
      t = window.setTimeout(() => choose((index + 1) % examples.length, false), 4200);
    }
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, phase, typed, index, manual, reduced]);

  function choose(i: number, byUser = true) {
    if (byUser) setManual(true);
    setIndex(i);
    setTyped(0);
    setPhase('typing');
  }

  return (
    <section data-ph-section="ask" className="px-5 py-24 sm:px-8 sm:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <Reveal>
            <Label>Spør Notably</Label>
            <h2 className="mt-6 text-balance text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[3.4rem]">
              Alt som er sagt, ett spørsmål unna.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-600">
              Notably søker i alle møtene dine og svarer med kilde. Enten møtet var i går eller i fjor.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">Prøv et spørsmål</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {examples.map((ex, i) => (
                <li key={ex.q}>
                  <button
                    type="button"
                    onClick={() => choose(i)}
                    aria-pressed={i === index}
                    className={`rounded-full px-4 py-2 text-left text-sm font-medium transition-all duration-200 ${
                      i === index
                        ? 'bg-slate-950 text-white'
                        : 'bg-white text-slate-700 ring-1 ring-slate-900/10 hover:-translate-y-0.5 hover:ring-slate-900/25'
                    }`}
                  >
                    {ex.q}
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div
            ref={ref}
            className="relative rounded-[2rem] bg-white p-5 shadow-[0_50px_120px_-60px_rgba(11,15,25,0.5)] ring-1 ring-slate-900/[0.06] sm:p-8"
          >
            <div className="flex min-h-[19rem] flex-col justify-end gap-4 sm:min-h-[20rem]">
              {/* Spørsmålet */}
              <div className="ml-auto max-w-[85%] rounded-3xl rounded-br-lg bg-blue-600 px-5 py-3.5 text-[15px] font-medium text-white sm:text-base">
                {q.slice(0, typed) || ' '}
                {phase === 'typing' && <span className="notably-caret ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-white/80" />}
              </div>

              <AnimatePresence mode="wait">
                {phase === 'searching' && (
                  <motion.p
                    key="searching"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-sm text-slate-500"
                  >
                    <Search className="h-4 w-4 animate-pulse" aria-hidden />
                    Søker i møtene dine
                  </motion.p>
                )}
                {phase === 'answer' && (
                  <motion.div
                    key={`answer-${index}`}
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease }}
                    className="max-w-[92%] rounded-3xl rounded-bl-lg bg-[#F6F5F1] px-5 py-4"
                  >
                    <p className="text-[15px] leading-relaxed text-slate-800 sm:text-base">{a}</p>
                    <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-900/[0.06]">
                      <FileText className="h-3.5 w-3.5 text-blue-600" aria-hidden />
                      {src}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-full bg-[#F6F5F1] py-2 pl-5 pr-2">
              <span className="flex-1 truncate text-sm text-slate-400">Spør om hva som helst fra møtene dine</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white">
                <ArrowUp className="h-4 w-4" aria-hidden />
              </span>
            </div>
          </div>
          <p className="mt-5 text-center text-sm text-slate-500">
            Bruker du Claude eller ChatGPT? Koble dem til møtene dine via MCP.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
