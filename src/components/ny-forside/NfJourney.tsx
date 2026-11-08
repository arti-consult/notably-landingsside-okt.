import { useRef, useState, type ReactNode } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type Variants,
} from 'framer-motion';
import { Check, Download, Mail, Share2, Smartphone, Video } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Label, Lines, ease } from './shared';

interface Stage {
  when: string;
  title: string;
  text: string;
  Visual: () => JSX.Element;
}

/* ------------------------------------------------------------------ */
/* 01 Før møtet: kalenderen                                            */
/* ------------------------------------------------------------------ */

const meetings = [
  { time: '09:00', title: 'Ukesmøte, ledergruppen', where: 'Teams', icon: Video },
  { time: '11:30', title: 'Kundemøte · Nordvik AS', where: 'Zoom', icon: Video },
  { time: '14:00', title: 'Befaring · Fjordtun', where: 'Fysisk møte', icon: Smartphone },
];

const pop: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 + i * 0.12, ease } }),
};

function CalendarVisual() {
  return (
    <div className="w-full max-w-md rounded-[1.5rem] bg-white/[0.04] p-5 ring-1 ring-white/10 sm:p-6">
      <div className="flex items-baseline justify-between">
        <p className="text-lg font-semibold text-white">Torsdag</p>
        <p className="font-mono text-xs text-slate-400">Kalender · Outlook</p>
      </div>
      <ul className="mt-5 space-y-3">
        {meetings.map(({ time, title, where, icon: Icon }, i) => (
          <motion.li
            key={title}
            custom={i}
            variants={pop}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-4 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10"
          >
            <span className="w-11 font-mono text-sm text-slate-400">{time}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-medium text-white">{title}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                <Icon className="h-3 w-3" aria-hidden />
                {where}
              </p>
            </div>
            {/* Bryteren slår seg på etter tur. */}
            <span className="relative h-6 w-10 shrink-0 rounded-full bg-white/15">
              <motion.span
                initial={{ backgroundColor: 'rgba(37,99,235,0)' }}
                animate={{ backgroundColor: 'rgba(37,99,235,1)' }}
                transition={{ delay: 0.7 + i * 0.35, duration: 0.3 }}
                className="absolute inset-0 rounded-full"
              />
              <motion.span
                initial={{ x: 2 }}
                animate={{ x: 18 }}
                transition={{ delay: 0.7 + i * 0.35, type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow"
              />
            </span>
          </motion.li>
        ))}
      </ul>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9 }}
        className="mt-5 flex items-center gap-2 text-sm text-blue-300"
      >
        <Check className="h-4 w-4" aria-hidden /> Notably er med på alle tre
      </motion.p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 02 Under møtet: lytter og skriver                                   */
/* ------------------------------------------------------------------ */

const heard = [
  { who: 'Kari Berg', color: 'text-blue-300', text: 'Vi må bestemme leverandør for fasaden før jul.' },
  { who: 'Ola Strand', color: 'text-amber-300', text: 'I can send the comparison to the whole group tomorrow.' },
  { who: 'Amir Haddad', color: 'text-emerald-300', text: 'Da tar vi beslutningen på torsdag.' },
];

function ListeningVisual() {
  const reduced = useReducedMotion();
  return (
    <div className="w-full max-w-md">
      {/* Lydbølgen */}
      <div className="flex h-24 items-center justify-center gap-[5px]" aria-hidden>
        {Array.from({ length: 34 }, (_, i) => (
          <span
            key={i}
            className="notably-wave-bar w-[5px] rounded-full bg-gradient-to-b from-blue-300 to-blue-600"
            style={{
              height: `${30 + Math.abs(Math.sin(i * 0.9)) * 70}%`,
              animationDelay: `${(i % 7) * 0.11}s`,
              animationDuration: `${0.9 + (i % 5) * 0.12}s`,
            }}
          />
        ))}
      </div>
      <ul className="mt-6 space-y-3">
        {heard.map(({ who, color, text }, i) => (
          <motion.li
            key={who}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.6, ease }}
            className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10"
          >
            <p className="flex items-center justify-between text-xs">
              <span className={`font-semibold ${color}`}>{who}</span>
              {i === 1 && (
                <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] text-slate-300">Engelsk</span>
              )}
            </p>
            <p className="mt-1 text-[15px] leading-snug text-slate-200">{text}</p>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 03 Etter møtet: referatet                                           */
/* ------------------------------------------------------------------ */

const tasks = [
  { task: 'Sende sammenligning av fasadeleverandører', who: 'Ola', when: 'Fredag' },
  { task: 'Innhente pris på alternativ B', who: 'Kari', when: '12. nov' },
];

function ReferatVisual() {
  const reduced = useReducedMotion();
  const appear = (delay: number) =>
    reduced
      ? {}
      : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay, ease } };
  return (
    <div className="relative w-full max-w-md">
      <div className="rounded-[1.5rem] bg-white p-6 text-slate-900 shadow-[0_40px_100px_-40px_rgba(37,99,235,0.6)]">
        <motion.div {...appear(0)} className="flex items-center justify-between">
          <p className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            <Lines className="h-2.5 w-3 text-blue-600" /> Referat
          </p>
          <p className="text-xs text-slate-400">Byggemøte 14 · 47 min</p>
        </motion.div>
        <motion.p {...appear(0.1)} className="mt-3 text-xl font-semibold tracking-tight">
          Fasaden: valg av leverandør
        </motion.p>
        <motion.p {...appear(0.2)} className="mt-2 text-sm leading-relaxed text-slate-600">
          Gruppen sammenlignet to leverandører. Alternativ B er billigst, men har lengre leveringstid.
        </motion.p>
        <motion.div {...appear(0.35)} className="mt-4 rounded-xl bg-blue-50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Beslutning</p>
          <p className="mt-1 text-sm font-medium">Leverandør velges på møtet torsdag</p>
        </motion.div>
        <motion.div {...appear(0.5)} className="mt-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Oppgaver</p>
          <ul className="mt-1.5 divide-y divide-slate-100">
            {tasks.map((t) => (
              <li key={t.task} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="min-w-0 truncate">{t.task}</span>
                <span className="shrink-0 text-xs text-slate-500">
                  {t.who} · {t.when}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div {...appear(0.65)} className="mt-4 flex gap-2">
          {[
            { icon: Share2, label: 'Del' },
            { icon: Mail, label: 'E-post' },
            { icon: Download, label: 'Last ned' },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
              {label}
            </span>
          ))}
        </motion.div>
      </div>
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 300, damping: 22 }}
        className="absolute -bottom-5 -right-2 flex items-center gap-2 rounded-full bg-emerald-500 py-2 pl-2 pr-4 text-sm font-semibold text-white shadow-lg sm:-right-6"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25">
          <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
        </span>
        Sendt til 6 deltakere
      </motion.div>
    </div>
  );
}

const stages: Stage[] = [
  {
    when: 'Før møtet',
    title: 'Notably står allerede i kalenderen.',
    text: 'Koble til Outlook eller Google Kalender, så blir Notably med i møtene i Teams, Zoom og Google Meet. Sitter dere rundt et bord, trykker du opptak i appen.',
    Visual: CalendarVisual,
  },
  {
    when: 'Under møtet',
    title: 'Notably lytter. Du leder.',
    text: 'Alt som blir sagt skrives ned, og Notably kjenner igjen hvem som snakker. Også når praten glir over i engelsk og tilbake.',
    Visual: ListeningVisual,
  },
  {
    when: 'Etter møtet',
    title: 'Referatet er klart når møtet er slutt.',
    text: 'Sammendrag, beslutninger og oppgaver med ansvarlig og frist. Del det med deltakerne, send det på e-post eller last det ned som dokument.',
    Visual: ReferatVisual,
  },
];

function Stagger({ children }: { children: ReactNode }) {
  return <div className="flex min-h-[28rem] items-center justify-center">{children}</div>;
}

/**
 * Signaturseksjonen. På desktop står den fast mens man scroller gjennom tre
 * trinn, og illustrasjonen bytter når man passerer en tredel. Trinnet er en
 * vanlig tilstand (ikke en verdi per frame), så det koster nesten ingenting.
 * På mobil står trinnene under hverandre.
 */
export default function NfJourney() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const pinned = useMediaQuery('(min-width: 1024px)') && !reduced;
  const [stage, setStage] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(stages.length - 1, Math.floor(v * stages.length));
    if (next !== stage) setStage(next);
  });

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * ((i + 0.5) / stages.length), behavior: 'smooth' });
  };

  const intro = (
    <div className="max-w-2xl">
      <Label dark>Slik virker det</Label>
      <h2 className="mt-6 text-balance text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.4rem]">
        Fra «la oss starte» til ferdig referat.
      </h2>
    </div>
  );

  return (
    <section
      ref={ref}
      id="slik-virker-det"
      data-ph-section="how_it_works"
      className="relative scroll-mt-0 bg-[#080B12] text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />

      {pinned ? (
        <div className="relative" style={{ height: `${stages.length * 100 + 40}vh` }}>
          <div className="sticky top-0 flex h-screen items-center overflow-hidden">
            <div
              aria-hidden
              className="pointer-events-none absolute right-[-10%] top-1/2 h-[40rem] w-[40rem] -translate-y-1/2 rounded-full bg-blue-600/25 glow scale-150"
            />
            <div className="relative mx-auto grid w-full max-w-6xl grid-cols-[1fr_1fr] items-center gap-16 px-8">
              <div>
                {intro}
                <ol className="mt-12 space-y-2">
                  {stages.map((s, i) => {
                    const active = i === stage;
                    return (
                      <li key={s.when}>
                        <button
                          type="button"
                          onClick={() => goTo(i)}
                          className={`group w-full rounded-2xl p-5 text-left transition-colors duration-500 ${
                            active ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={`font-mono text-xs transition-colors ${active ? 'text-blue-400' : 'text-slate-500'}`}
                            >
                              0{i + 1}
                            </span>
                            <span
                              className={`text-sm font-semibold uppercase tracking-[0.14em] transition-colors ${
                                active ? 'text-white' : 'text-slate-500'
                              }`}
                            >
                              {s.when}
                            </span>
                          </span>
                          <AnimatePresence initial={false}>
                            {active && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.45, ease }}
                                className="overflow-hidden"
                              >
                                <p className="mt-3 text-2xl font-semibold tracking-tight text-white">{s.title}</p>
                                <p className="mt-2 max-w-md text-[15px] leading-relaxed text-slate-400">{s.text}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          {/* Fremdriften i trinnet. */}
                          <span className="mt-4 block h-px w-full bg-white/10">
                            <motion.span
                              className="block h-px origin-left bg-blue-500"
                              initial={false}
                              animate={{ scaleX: i < stage ? 1 : i === stage ? 0.5 : 0 }}
                              transition={{ duration: 0.6, ease }}
                            />
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div className="relative flex justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stage}
                    initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -30, filter: 'blur(6px)' }}
                    transition={{ duration: 0.45, ease }}
                    className="w-full"
                  >
                    <Stagger>
                      {(() => {
                        const V = stages[stage].Visual;
                        return <V />;
                      })()}
                    </Stagger>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-2xl">
            {intro}
            <ol className="mt-14 space-y-20">
              {stages.map(({ when, title, text, Visual }, i) => (
                <li key={when}>
                  <p className="flex items-center gap-3">
                    <span className="font-mono text-xs text-blue-400">0{i + 1}</span>
                    <span className="text-sm font-semibold uppercase tracking-[0.14em] text-white">{when}</span>
                  </p>
                  <p className="mt-3 text-[1.6rem] font-semibold leading-tight tracking-tight text-white">{title}</p>
                  <p className="mt-3 text-base leading-relaxed text-slate-400">{text}</p>
                  <MobileVisual>
                    <Visual />
                  </MobileVisual>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </section>
  );
}

/** På mobil spilles illustrasjonen av først når den kommer på skjermen. */
function MobileVisual({ children }: { children: ReactNode }) {
  const [seen, setSeen] = useState(false);
  return (
    <motion.div
      onViewportEnter={() => setSeen(true)}
      viewport={{ once: true, amount: 0.4 }}
      className="mt-8 flex min-h-[22rem] justify-center"
    >
      {seen && children}
    </motion.div>
  );
}
