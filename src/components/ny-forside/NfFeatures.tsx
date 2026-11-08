import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { Folder, Plug } from 'lucide-react';
import { APP_STORE_URL, Label, PLAY_STORE_URL, Reveal, ease } from './shared';

function Cell({
  title,
  text,
  children,
  footer,
}: {
  title: string;
  text: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className={`flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-slate-900/[0.06]`}>
      <div className="relative flex min-h-[13rem] flex-1 items-center justify-center overflow-hidden bg-[#FBFAF7] p-6">
        {children}
      </div>
      <div className="p-6 sm:p-7">
        <h3 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h3>
        <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">{text}</p>
        {footer}
      </div>
    </div>
  );
}

const useCycle = (length: number, ms: number, active: boolean) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % length), ms);
    return () => window.clearInterval(id);
  }, [length, ms, active]);
  return i;
};

/* Hvem sa hva: taletid fordelt på deltakerne, som spor i en lydfil. */
const speakers = [
  { name: 'Kari', color: 'bg-blue-500', parts: [[0, 14], [38, 52], [80, 92]] },
  { name: 'Ola', color: 'bg-amber-400', parts: [[15, 30], [53, 66]] },
  { name: 'Amir', color: 'bg-emerald-500', parts: [[31, 37], [67, 79], [93, 100]] },
];

function SpeakersVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  return (
    <div ref={ref} className="w-full max-w-lg space-y-4">
      {speakers.map(({ name, color, parts }, r) => (
        <div key={name} className="flex items-center gap-4">
          <span className="w-12 text-sm font-semibold text-slate-700">{name}</span>
          <div className="relative h-7 flex-1 rounded-full bg-slate-900/[0.04]">
            {parts.map(([a, b], k) => (
              <motion.span
                key={k}
                className={`absolute inset-y-1 rounded-full ${color}`}
                style={{ left: `${a}%`, width: `${b - a}%`, transformOrigin: 'left' }}
                initial={reduced ? false : { scaleX: 0, opacity: 0 }}
                animate={inView ? { scaleX: 1, opacity: 1 } : undefined}
                transition={{ duration: 0.6, delay: (a / 100) * 1.4 + r * 0.05, ease }}
              />
            ))}
          </div>
        </div>
      ))}
      <motion.div
        aria-hidden
        className="ml-16 h-px bg-slate-300"
        initial={reduced ? false : { scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : undefined}
        style={{ transformOrigin: 'left' }}
        transition={{ duration: 1.6, ease: 'linear' }}
      />
    </div>
  );
}

const templates = ['Styremøte', 'Salgsmøte', 'Intervju', 'Byggemøte', 'Klientmøte'];

function TemplatesVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduced = useReducedMotion();
  const i = useCycle(templates.length, 1800, inView && !reduced);
  return (
    <div ref={ref} className="relative h-36 w-52">
      {[2, 1].map((d) => (
        <div
          key={d}
          aria-hidden
          className="absolute inset-x-0 top-0 h-32 rounded-2xl bg-white ring-1 ring-slate-900/[0.06]"
          style={{ transform: `translateY(${d * 10}px) scale(${1 - d * 0.06})`, opacity: 1 - d * 0.3 }}
        />
      ))}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={templates[i]}
          initial={{ y: -30, opacity: 0, rotate: -4 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 40, opacity: 0, rotate: 4 }}
          transition={{ duration: 0.5, ease }}
          className="absolute inset-x-0 top-0 h-32 rounded-2xl bg-white p-4 shadow-[0_16px_40px_-20px_rgba(11,15,25,0.4)] ring-1 ring-slate-900/[0.06]"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue-600">Mal</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{templates[i]}</p>
          <div className="mt-3 space-y-1.5" aria-hidden>
            <span className="block h-1.5 w-full rounded-full bg-slate-100" />
            <span className="block h-1.5 w-4/5 rounded-full bg-slate-100" />
            <span className="block h-1.5 w-1/2 rounded-full bg-slate-100" />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const hellos = ['Hei', 'Hello', 'Hej', 'Hallo', 'Hola', 'Cześć', 'Bonjour', 'Ciao', 'Olá', 'Hoi'];

function LanguagesVisual() {
  const reduced = useReducedMotion();
  return (
    <div className="flex flex-wrap justify-center gap-2" aria-hidden>
      {hellos.map((h, i) => (
        <motion.span
          key={h}
          initial={reduced ? false : { opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07, type: 'spring', stiffness: 400, damping: 20 }}
          className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${
            i === 0 ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-900/[0.07]'
          }`}
        >
          {h}
        </motion.span>
      ))}
    </div>
  );
}

const folders = [
  { name: 'Nordvik AS', count: 12 },
  { name: 'Prosjekt Fjordtun', count: 31 },
  { name: 'Ledergruppen', count: 8 },
];

function FoldersVisual() {
  return (
    <ul className="w-full max-w-[15rem] space-y-2">
      {folders.map(({ name, count }, i) => (
        <motion.li
          key={name}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.12, duration: 0.5, ease }}
          className="flex items-center gap-3 rounded-xl bg-white px-3.5 py-2.5 ring-1 ring-slate-900/[0.06]"
        >
          <Folder className="h-4 w-4 text-blue-600" aria-hidden />
          <span className="flex-1 truncate text-sm font-medium text-slate-800">{name}</span>
          <span className="font-mono text-xs text-slate-400">{count}</span>
        </motion.li>
      ))}
    </ul>
  );
}

function PhoneVisual() {
  return (
    <div className="relative">
      <div className="relative h-[19rem] w-[9.5rem] rounded-[2rem] bg-slate-950 p-1.5 shadow-[0_30px_60px_-30px_rgba(11,15,25,0.7)]">
        <div className="flex h-full flex-col items-center justify-between rounded-[1.6rem] bg-[#0F1420] px-3 pb-6 pt-5">
          <span className="h-1.5 w-12 rounded-full bg-white/15" />
          <div className="text-center">
            <p className="font-mono text-xl font-semibold tabular-nums text-white">12:47</p>
            <p className="mt-1 text-[10px] text-slate-400">Befaring · Fjordtun</p>
          </div>
          <div className="flex h-10 items-center gap-[3px]" aria-hidden>
            {Array.from({ length: 16 }, (_, i) => (
              <span
                key={i}
                className="notably-wave-bar w-[3px] rounded-full bg-blue-400"
                style={{ height: `${30 + Math.abs(Math.sin(i)) * 70}%`, animationDelay: `${(i % 5) * 0.13}s` }}
              />
            ))}
          </div>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
            <span className="h-6 w-6 rounded-md bg-rose-500" />
          </span>
        </div>
      </div>
    </div>
  );
}

function AiVisual() {
  return (
    <div className="flex items-center gap-3">
      {[
        { name: 'ChatGPT', src: '/media/1790522767839.webp' },
        { name: 'Claude', src: '/media/1790522689887.webp' },
      ].map(({ name, src }) => (
        <span key={name} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-800 ring-1 ring-slate-900/[0.07]">
          <img src={src} alt="" className="h-5 w-5 object-contain" />
          {name}
        </span>
      ))}
      <span className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
        <Plug className="h-4 w-4" aria-hidden />
        MCP
      </span>
    </div>
  );
}

export default function NfFeatures() {
  return (
    <section data-ph-section="capabilities" className="px-5 pb-24 sm:px-8 sm:pb-36">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-3xl">
          <Label>Mer enn et referat</Label>
          <h2 className="mt-6 text-balance text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[3.4rem]">
            Laget for hvordan norske team faktisk har møter.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Reveal className="md:col-span-2">
            <Cell title="Hvem sa hva" text="Notably kjenner igjen hvem som snakker, så referatet viser navn. Ikke «taler 1» og «taler 2».">
              <SpeakersVisual />
            </Cell>
          </Reveal>
          <Reveal delay={0.08} className="lg:row-span-2">
            <Cell
              title="Fysiske møter på mobilen"
              text="Kundemøtet, befaringen eller styremøtet rundt bordet. Legg telefonen på bordet og trykk opptak."
              footer={
                <p className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
                  <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="rounded-full bg-slate-950 px-3.5 py-1.5 text-white hover:bg-blue-600">
                    iPhone
                  </a>
                  <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="rounded-full bg-slate-950 px-3.5 py-1.5 text-white hover:bg-blue-600">
                    Android
                  </a>
                </p>
              }
            >
              <PhoneVisual />
            </Cell>
          </Reveal>
          <Reveal>
            <Cell title="Maler for hver møtetype" text="Styremøtet og salgsmøtet trenger ulike referater. Velg en mal, eller lag din egen.">
              <TemplatesVisual />
            </Cell>
          </Reveal>
          <Reveal delay={0.08}>
            <Cell title="Over 100 språk" text="Laget for norsk, og henger med når møtet veksler mellom norsk og engelsk.">
              <LanguagesVisual />
            </Cell>
          </Reveal>
          <Reveal>
            <Cell title="Mapper per kunde og prosjekt" text="Samle alle møtene om samme kunde eller prosjekt på ett sted.">
              <FoldersVisual />
            </Cell>
          </Reveal>
          <Reveal delay={0.08} className="md:col-span-1 lg:col-span-2">
            <Cell title="Kobles til AI-en din" text="Spør ChatGPT og Claude om møtene dine via MCP, uten å kopiere og lime inn.">
              <AiVisual />
            </Cell>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
