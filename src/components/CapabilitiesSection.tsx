import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import { Briefcase, Handshake, Landmark, Plug, UserRound, Users } from 'lucide-react';

/**
 * Teller som går rundt med fast intervall, men bare mens kortet er synlig og
 * brukeren ikke har bedt om redusert bevegelse. Da står første verdi stille.
 */
const useCycle = (length: number, interval: number, active: boolean) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % length), interval);
    return () => window.clearInterval(id);
  }, [active, interval, length]);
  return index;
};

/* ------------------------------------------------------------------ */
/* Flagg – enkle geometriske SVG-er. Emoji-flagg vises som bokstaver    */
/* på Windows, så de tegnes i stedet.                                   */
/* ------------------------------------------------------------------ */

const Flag = ({ children, viewBox }: { children: ReactNode; viewBox: string }) => (
  <svg
    viewBox={viewBox}
    preserveAspectRatio="xMidYMid slice"
    className="h-8 w-8 rounded-full ring-1 ring-inset ring-black/5"
    aria-hidden
  >
    {children}
  </svg>
);

const languages = [
  {
    name: 'Norsk',
    flag: (
      <Flag viewBox="0 0 22 16">
        <rect width="22" height="16" fill="#BA0C2F" />
        <rect x="6" width="4" height="16" fill="#fff" />
        <rect y="6" width="22" height="4" fill="#fff" />
        <rect x="7" width="2" height="16" fill="#00205B" />
        <rect y="7" width="22" height="2" fill="#00205B" />
      </Flag>
    ),
  },
  {
    name: 'English',
    flag: (
      <Flag viewBox="0 0 60 30">
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
        <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
      </Flag>
    ),
  },
  {
    name: 'Svenska',
    flag: (
      <Flag viewBox="0 0 16 10">
        <rect width="16" height="10" fill="#006AA7" />
        <rect x="5" width="2" height="10" fill="#FECC00" />
        <rect y="4" width="16" height="2" fill="#FECC00" />
      </Flag>
    ),
  },
  {
    name: 'Deutsch',
    flag: (
      <Flag viewBox="0 0 5 3">
        <rect width="5" height="1" fill="#000" />
        <rect y="1" width="5" height="1" fill="#DD0000" />
        <rect y="2" width="5" height="1" fill="#FFCE00" />
      </Flag>
    ),
  },
  {
    name: 'Español',
    flag: (
      <Flag viewBox="0 0 4 4">
        <rect width="4" height="4" fill="#AA151B" />
        <rect y="1" width="4" height="2" fill="#F1BF00" />
      </Flag>
    ),
  },
  {
    name: 'Polski',
    flag: (
      <Flag viewBox="0 0 8 5">
        <rect width="8" height="5" fill="#fff" />
        <rect y="2.5" width="8" height="2.5" fill="#DC143C" />
      </Flag>
    ),
  },
];

/**
 * Én replikk per språk, i samme rekkefølge som `languages`. Pillen viser alltid
 * språket til replikken som står midt i kortet, så de to kan ikke gli fra
 * hverandre.
 */
const spokenSegments = [
  'Hei, da starter vi. Vi tar oppfølgingen på torsdag. ',
  'Right, let’s get started. I’ll send the recap today. ',
  'Hej, då kör vi. Vi tar uppföljningen på torsdag. ',
  'Also, fangen wir an. Wir sprechen nächste Woche weiter. ',
  'Bueno, empecemos. Les envío el resumen esta tarde. ',
  'Dobrze, zaczynamy. Wyślę podsumowanie po południu. ',
];
const spokenLine = spokenSegments.join('');

/* ------------------------------------------------------------------ */
/* Felles byggeklosser                                                  */
/* ------------------------------------------------------------------ */

/** Den hvite pillen øverst i hvert kort. Verdien byttes med en myk rulling. */
const Pill = ({
  label,
  value,
  icon,
  className = '',
}: {
  label: string;
  value: string;
  icon: ReactNode;
  className?: string;
}) => (
  <div
    className={`flex h-14 items-center justify-between gap-3 rounded-full bg-white pl-5 pr-3 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)] ${className}`}
  >
    <span className="flex min-w-0 items-center gap-1.5 text-[15px]">
      <span className="font-semibold text-slate-900">{label}</span>
      <span className="relative block h-6 min-w-0 flex-1 overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="block truncate leading-6 text-slate-700"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
    <span className="relative flex h-8 w-8 shrink-0 items-center justify-center">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-8 w-8 items-center justify-center"
        >
          {icon}
        </motion.span>
      </AnimatePresence>
    </span>
  </div>
);

const visualFrame = 'relative h-60 overflow-hidden rounded-2xl';

/* ------------------------------------------------------------------ */
/* Kort 1 – språk                                                       */
/* ------------------------------------------------------------------ */

/**
 * Talen løper langs en bue under pillen. Teksten ligger to ganger etter
 * hverandre på banen, og forskyvningen nullstilles når første kopi har passert,
 * så løkka blir sømløs. Posisjonen skrives rett til DOM-en for å slippe
 * React-render hver frame.
 *
 * Tickeren eier også språket: hver frame regnes det ut hvilken replikk som står
 * midt på buen, og bare når den skifter meldes det opp til pillen.
 */
const CurvedTicker = ({
  active,
  onLanguageChange,
}: {
  active: boolean;
  onLanguageChange: (index: number) => void;
}) => {
  const pathId = useId().replace(/:/g, '');
  const pathRef = useRef<SVGPathElement>(null);
  const measureRef = useRef<SVGTextElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    let cancelled = false;

    // Målingene må vente på webfonten, ellers stemmer ikke lengdene med
    // teksten som faktisk tegnes.
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      const measure = measureRef.current;
      const path = pathRef.current;
      if (cancelled || !measure || !path) return;

      const copyLength = measure.getComputedTextLength();
      if (!copyLength) return;

      // Der hver replikk begynner, målt langs teksten.
      let charIndex = 0;
      const starts = spokenSegments.map((segment) => {
        const start = charIndex === 0 ? 0 : measure.getSubStringLength(0, charIndex);
        charIndex += segment.length;
        return start;
      });
      const center = path.getTotalLength() / 2;

      let offset = 0;
      let current = -1;
      let last = performance.now();
      const tick = (now: number) => {
        offset = (offset + ((now - last) / 1000) * 60) % copyLength;
        last = now;
        textPathRef.current?.setAttribute('startOffset', String(-offset));

        // Teksten starter `offset` før banen, så punktet midt på buen ligger
        // `center + offset` inn i teksten.
        const position = (center + offset) % copyLength;
        let index = starts.length - 1;
        while (index > 0 && starts[index] > position) index -= 1;
        if (index !== current) {
          current = index;
          onLanguageChange(index);
        }
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [active, onLanguageChange]);

  return (
    <svg
      viewBox="0 0 280 70"
      preserveAspectRatio="none"
      className="absolute inset-x-0 bottom-9 w-full overflow-visible"
      aria-hidden
    >
      <path ref={pathRef} id={pathId} d="M -20 62 Q 140 4 300 62" fill="none" />
      <text ref={measureRef} visibility="hidden" className="fill-slate-800 text-[15px] font-medium">
        {spokenLine}
      </text>
      <text className="fill-slate-800 text-[15px] font-medium">
        <textPath ref={textPathRef} href={`#${pathId}`}>
          {spokenLine}
          {spokenLine}
        </textPath>
      </text>
    </svg>
  );
};

const LanguageVisual = ({ active }: { active: boolean }) => {
  // Står tickeren stille, viser den starten av første replikk – norsk.
  const [index, setIndex] = useState(0);
  const { name, flag } = languages[index];

  return (
    <div className={`${visualFrame} bg-[#E6ECF7]`}>
      <Pill label="Språk:" value={name} icon={flag} className="mx-auto mt-8 w-[86%]" />
      <CurvedTicker active={active} onLanguageChange={setIndex} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Kort 2 – egne maler                                                  */
/* ------------------------------------------------------------------ */

const templates = [
  { name: 'Styremøte', icon: Landmark, sections: ['Vedtak', 'Saker til behandling', 'Oppfølging'] },
  { name: 'Salgsmøte', icon: Handshake, sections: ['Kundens behov', 'Innvendinger', 'Neste steg'] },
  { name: '1:1-samtale', icon: UserRound, sections: ['Trivsel', 'Mål', 'Avtaler'] },
  { name: 'Intervju', icon: Briefcase, sections: ['Bakgrunn', 'Styrker', 'Vurdering'] },
  { name: 'Prosjektmøte', icon: Users, sections: ['Status', 'Risiko', 'Oppgaver'] },
];

/** Bredde på en mal-pille pluss mellomrom, i rem. */
const TEMPLATE_STEP = 13.25;

const TemplateVisual = ({ active }: { active: boolean }) => {
  const index = useCycle(templates.length, 2600, active);
  const count = templates.length;

  return (
    <div className={`${visualFrame} bg-[#E3EAE5]`}>
      {/* Karusellen: aktiv mal i midten, naboene skimtes på sidene. */}
      <div className="relative mt-8 h-14">
        {templates.map(({ name, icon: Icon }, i) => {
          // Relativ plass i ringen, lagt i området -2…2 så ringen går rundt.
          let offset = (i - index + count) % count;
          if (offset > count / 2) offset -= count;
          const isActive = offset === 0;

          return (
            <motion.div
              key={name}
              initial={false}
              animate={{
                x: `calc(-50% + ${offset * TEMPLATE_STEP}rem)`,
                opacity: isActive ? 1 : Math.abs(offset) === 1 ? 0.45 : 0,
                scale: isActive ? 1 : 0.94,
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-1/2 top-0 flex h-14 w-[12.5rem] items-center justify-between gap-2 rounded-full bg-white pl-5 pr-3 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)]"
            >
              <span className="truncate text-[15px] font-semibold text-slate-900">{name}</span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50">
                <Icon className="h-4 w-4 text-blue-600" />
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Referatet som følger malen: overskriftene byttes med malen. */}
      <div className="mx-auto mt-5 w-[86%] rounded-xl bg-white/70 px-4 py-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={index}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            className="space-y-2"
          >
            {templates[index].sections.map((section, row) => (
              <motion.li
                key={section}
                variants={{
                  hidden: { opacity: 0, y: 6 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                  exit: { opacity: 0, transition: { duration: 0.15 } },
                }}
                className="flex items-center gap-3"
              >
                <span className="w-[7.5rem] shrink-0 truncate text-[12px] font-semibold text-slate-700">
                  {section}
                </span>
                <span
                  className="h-1.5 rounded-full bg-slate-200"
                  style={{ width: `${[70, 52, 62][row]}%` }}
                />
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Kort 3 – AI-koblinger                                                */
/* ------------------------------------------------------------------ */

const LOGO_BASE = 'https://qelklrrxciwomrwunzjo.supabase.co/storage/v1/object/public/admin-images';

const AiLogo = ({ src }: { src: string }) => (
  <img src={src} alt="" width={24} height={24} className="h-6 w-6 object-contain" />
);

const CHATGPT_LOGO = `${LOGO_BASE}/1790522767839.webp`;
const CLAUDE_LOGO = `${LOGO_BASE}/1790522689887.webp`;

const aiTargets = [
  { name: 'ChatGPT', icon: <AiLogo src={CHATGPT_LOGO} /> },
  { name: 'Claude', icon: <AiLogo src={CLAUDE_LOGO} /> },
  { name: 'MCP', icon: <Plug className="h-5 w-5 text-slate-800" aria-hidden /> },
];

const prompts = [
  'Hva ble bestemt på styremøtet?',
  'Hvem eier oppfølgingen?',
  'Skriv utkast til oppsummering',
  'Hva sa kunden om pris?',
  'Lag en oppgaveliste fra uka',
];

const AiVisual = ({ active }: { active: boolean }) => {
  const index = useCycle(aiTargets.length, 2400, active);
  const { name, icon } = aiTargets[index];

  // Logoene hentes på forhånd, så de ikke blinker inn første gang pillen bytter.
  useEffect(() => {
    [CHATGPT_LOGO, CLAUDE_LOGO].forEach((src) => {
      new Image().src = src;
    });
  }, []);

  return (
    <div className={`${visualFrame} bg-[#EEE8DF]`}>
      <Pill label="Spør:" value={name} icon={icon} className="mx-auto mt-8 w-[86%]" />

      <div className="absolute inset-x-0 bottom-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <ul
          className="notably-marquee flex w-max gap-2.5"
          style={{ animationPlayState: active ? 'running' : 'paused' }}
        >
          {[...prompts, ...prompts].map((prompt, i) => (
            <li
              key={i}
              className="whitespace-nowrap rounded-full bg-white/80 px-4 py-2.5 text-[14px] font-medium text-slate-800"
            >
              {prompt}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */

const cards = [
  {
    title: 'Snakker språket ditt',
    description:
      'Notably forstår over 100 språk – også når møtet veksler mellom norsk og engelsk.',
    Visual: LanguageVisual,
  },
  {
    title: 'Egne maler',
    description:
      'Styremøtet, salgsmøtet og intervjuet trenger ulike referater. Velg en mal, eller lag din egen.',
    Visual: TemplateVisual,
  },
  {
    title: 'Kobles til AI-en din',
    description: 'Spør ChatGPT og Claude om møtene dine via MCP – uten å kopiere og lime inn.',
    Visual: AiVisual,
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function CapabilitiesSection() {
  const listRef = useRef<HTMLUListElement>(null);
  const inView = useInView(listRef, { amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();
  const animate = inView && !prefersReducedMotion;

  return (
    <section className="py-16 page-container bg-white sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-balance text-center text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-slate-800 sm:text-4xl md:text-5xl md:leading-[1.1]">
          <span className="block">Passer inn i hverdagen deres.</span>
          <span className="block text-slate-500">Uten at dere endrer noe.</span>
        </h2>

        <motion.ul
          ref={listRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="mt-12 grid gap-12 sm:mt-16 lg:grid-cols-3 lg:gap-6 xl:gap-8"
        >
          {cards.map(({ title, description, Visual }) => (
            <motion.li key={title} variants={cardVariants} className="mx-auto w-full max-w-md lg:max-w-none">
              <div aria-hidden>
                <Visual active={animate} />
              </div>
              <h3 className="mt-6 text-center text-xl font-semibold tracking-tight text-slate-900">
                {title}
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-center text-[15px] leading-relaxed text-slate-600">
                {description}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
