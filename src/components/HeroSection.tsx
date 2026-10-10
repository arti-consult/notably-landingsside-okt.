import { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import HeroMeetingVisual from './HeroMeetingVisual';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/** Ved redusert bevegelse tones innholdet inn uten å forskyves. */
const buildItemVariants = (reduced: boolean | null): Variants => ({
  hidden: { opacity: 0, y: reduced ? 0 : 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
});

/** Overskriften staggrer sine egne to linjer. */
const headingVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/** Hver linje stiger opp bak en maske. */
const buildLineVariants = (reduced: boolean | null): Variants => ({
  hidden: reduced ? { opacity: 0 } : { y: '112%' },
  visible: {
    opacity: 1,
    y: '0%',
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
});

/**
 * Første linje står i dyp marine, andre linje – poenget – i merkeblått. Hver
 * linje har en svak tonal gradient i sin egen farge (lys som faller på blekk,
 * ikke kromatisk gradient). Marine i stedet for nesten svart gjør heroen lysere
 * og mer innbydende, særlig på mobil der overskriften fyller skjermen.
 * Kontrast mot hvitt: marine ~13:1, blått ~5,2:1.
 */
const headingLines = [
  { text: 'Møtereferatet', ink: 'bg-gradient-to-b from-[#334155] to-[#1E293B]' },
  { text: 'skriver seg selv.', ink: 'bg-gradient-to-b from-[#2563EB] to-[#1D4ED8]' },
];

const TYPED_LINE = headingLines[1];
/** Når skrivingen starter – etter at første linje har steget opp. */
const TYPE_START_MS = 650;
const TYPE_SPEED_MS = 45;
/** Tre blink (animasjonen er 1,1 s) før markøren toner ut. */
const CARET_BLINK_MS = 3300;

type CaretState = 'typing' | 'blinking' | 'gone';

/**
 * Andre linje skriver seg selv, som overskriften sier. Teksten skrives fram én
 * gang, markøren blinker noen ganger og forsvinner – så står overskriften rolig
 * ved siden av animasjonen i kortet.
 */
const useTypedHeading = (reduced: boolean | null) => {
  const [typed, setTyped] = useState(0);
  const [caret, setCaret] = useState<CaretState>('typing');

  useEffect(() => {
    if (reduced) return;
    const total = TYPED_LINE.text.length;
    let count = 0;
    let interval = 0;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        count += 1;
        setTyped(count);
        if (count >= total) window.clearInterval(interval);
      }, TYPE_SPEED_MS);
    }, TYPE_START_MS);
    const blink = window.setTimeout(
      () => setCaret('blinking'),
      TYPE_START_MS + total * TYPE_SPEED_MS + 100
    );
    const gone = window.setTimeout(
      () => setCaret('gone'),
      TYPE_START_MS + total * TYPE_SPEED_MS + 100 + CARET_BLINK_MS
    );
    return () => {
      [start, blink, gone].forEach((id) => window.clearTimeout(id));
      window.clearInterval(interval);
    };
  }, [reduced]);

  if (reduced) return { typed: TYPED_LINE.text.length, caret: 'gone' as CaretState };
  return { typed, caret };
};

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const itemVariants = useMemo(
    () => buildItemVariants(prefersReducedMotion),
    [prefersReducedMotion]
  );
  const { typed, caret } = useTypedHeading(prefersReducedMotion);
  const lineVariants = useMemo(
    () => buildLineVariants(prefersReducedMotion),
    [prefersReducedMotion]
  );

  // Ingen useSpring her. En spring jager scrollposisjonen på egen rAF-løkke,
  // og når hovedtråden nedprioriteres under momentum-scroll på mobil mister den
  // frames og hopper for å ta igjen. useTransform utleder verdien direkte fra
  // scrollen og kan aldri ligge etter.
  const y = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-1.6, 1.2]);

  // Parallaksen kjører bare fra lg og opp. Under det er effekten knapt synlig,
  // og alt per-scroll-arbeid på hovedtråden faller bort.
  const allowParallax = useMediaQuery('(min-width: 1024px)') && !prefersReducedMotion;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-6 pb-24 pt-32 sm:px-10 sm:pt-36 md:px-[12%] lg:pb-20 xl:pl-[19%] xl:pr-[12%]"
    >
      {/* Atmosfære. På mobil fyller en full-styrke glød hele den smale skjermen
          og legger en grå-blå hinne over teksten, så den krympes og trekkes ut i
          hjørnene der. Full styrke først fra lg, der det er luft rundt. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-48 h-[24rem] w-[24rem] rounded-full bg-sky-300/20 glow scale-[1.86] lg:-top-40 lg:right-[-10%] lg:h-[38rem] lg:w-[38rem] lg:bg-blue-400/20 lg:scale-[1.64]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-48 top-[55%] h-[20rem] w-[20rem] rounded-full bg-indigo-300/15 glow scale-[2.03] lg:-left-[12%] lg:top-16 lg:h-[26rem] lg:w-[26rem] lg:bg-indigo-400/15 lg:scale-[1.87]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          {/* Budskap */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {/* Løsere linjeavstand på mobil, stram på store skjermer der
                typen er stor nok til å tåle det. */}
            <motion.h1
              variants={headingVariants}
              // Trinnene er regnet mot Schibsted Grotesk, som er ~13 % bredere
              // enn systemfonten. Målt slik at «skriver seg selv.» pluss markøren
              // alltid står på én linje, også på 1024px der kolonnen er smalest.
              className="text-[2.375rem] font-semibold leading-[1.12] tracking-[-0.025em] text-slate-800 sm:text-[3.25rem] lg:text-[3rem] lg:leading-[1.04] xl:text-[3.5rem] 2xl:text-[4rem]"
            >
              {/* Første linje stiger opp bak en maske. Masken må ha plass til
                  nedstreker, ellers klippes «g» i «seg». */}
              <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
                <motion.span variants={lineVariants} className="block">
                  {/* Tonal gradient i samme farge – lys som faller på blekk, ikke
                      kromatisk gradient. I tvungen kontrastmodus overstyres
                      bakgrunner, så gradienten slås av og teksten får
                      systemfargen – ellers blir den usynlig. */}
                  <span
                    className={`bg-clip-text text-transparent forced-colors:bg-none forced-colors:text-[CanvasText] ${headingLines[0].ink}`}
                  >
                    {headingLines[0].text}
                  </span>
                </motion.span>
              </span>

              {/* Andre linje skrives fram. Resten av teksten står gjennomsiktig
                  bak markøren, så linjen har full bredde fra start og ingenting
                  hopper – og teksten finnes bare én gang, for søk og skjermlesere. */}
              {' '}
              <span className="block pb-[0.14em] -mb-[0.14em]">
                <span
                  className={`bg-clip-text text-transparent forced-colors:bg-none forced-colors:text-[CanvasText] ${TYPED_LINE.ink}`}
                >
                  {TYPED_LINE.text.slice(0, typed)}
                </span>
                {/* Står i flyten også når den er tonet ut, så linjen ikke flytter seg. */}
                <motion.span
                  aria-hidden
                  initial={false}
                  animate={{ opacity: caret === 'gone' ? 0 : 1 }}
                  transition={{ duration: 0.4 }}
                  className={`ml-[0.04em] inline-block h-[0.72em] w-[0.075em] rounded-[2px] bg-blue-600 align-baseline ${
                    caret === 'blinking' ? 'notably-caret' : ''
                  }`}
                />
                <span className="text-transparent">{TYPED_LINE.text.slice(typed)}</span>
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-7 max-w-md text-lg leading-relaxed text-slate-500 sm:text-xl"
            >
              Notably blir med i møtet, tar opp og skriver referatet — automatisk, og på{' '}
              {/* Flagget holdes på linje med siste ord, så det aldri står alene.
                  Tegnet som SVG fordi emoji-flagg vises som «NO» på Windows. */}
              <span className="whitespace-nowrap">
                norsk
                <svg
                  viewBox="0 0 22 16"
                  aria-hidden
                  className="ml-2 inline-block h-[0.8em] w-auto -translate-y-[0.05em] rounded-[3px] align-baseline shadow-[0_0_0_1px_rgba(15,23,42,0.08)]"
                >
                  <rect width="22" height="16" fill="#BA0C2F" />
                  <rect x="6" width="4" height="16" fill="#fff" />
                  <rect y="6" width="22" height="4" fill="#fff" />
                  <rect x="7" width="2" height="16" fill="#00205B" />
                  <rect y="7" width="22" height="2" fill="#00205B" />
                </svg>
              </span>
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-11 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <a
                data-trial-cta="hero"
                href="https://app.notably.no/no/sign-up"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-transparent bg-blue-500 px-6 py-4 text-lg font-semibold text-white shadow-[0_14px_30px_-16px_rgba(59,130,246,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
              >
                Start gratis
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
              <a
                href="https://calendly.com/arti-jorgen/notably-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-slate-300 bg-white/70 px-6 py-4 text-lg font-semibold text-slate-700 backdrop-blur transition-colors hover:border-slate-400 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-500"
              >
                Book en demo
              </a>
            </motion.div>

            <motion.p variants={itemVariants} className="mt-6 text-sm text-slate-500">
              14 dager gratis · full tilgang
            </motion.p>
          </motion.div>

          {/* Referatet */}
          <div className="relative flex justify-center lg:justify-end">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 m-auto h-[24rem] w-[24rem] rounded-full bg-blue-300/15 glow scale-[1.78] lg:bg-blue-400/20"
            />
            {/* Ytre lag animerer inngangen, indre lag følger scroll –
                de kan ikke dele samme y-verdi uten å overstyre hverandre. */}
            <motion.div
              className="relative w-full max-w-[26rem] lg:max-w-[27rem]"
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 34 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Egen komposittlag. Kortet har en 80px uskarp skygge, og uten
                  promotering må hele subtreet rastreres på nytt hver frame. */}
              <motion.div
                // will-change holder på et komposittlag, så det settes bare når
                // det faktisk er noe som animeres.
                className={allowParallax ? 'will-change-transform' : undefined}
                style={allowParallax ? { y, rotate } : undefined}
              >
                <HeroMeetingVisual />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
