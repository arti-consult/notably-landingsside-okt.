import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion';
import { Mic, Sparkles, Check } from 'lucide-react';

const APP_STORE_URL = 'https://apps.apple.com/no/app/notably/id6783667184?l=nb';

const AppleLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.208-1.24-3.234-4.921-.026-4.106 3.35-5.469 3.507-5.573-1.17-1.714-2.98-1.923-3.601-1.976-2.166-.221-4.052 1.169-5.096 1.169zm.11-3.417c.83-.976 1.4-2.34 1.244-3.479-1.007.052-2.235.676-2.98 1.53-.677.755-1.247 1.976-1.09 3.14 1.13.09 2.288-.573 2.826-1.19z" />
  </svg>
);

const upcomingMeetings = [
  {
    time: '13:30',
    day: 'i dag',
    title: 'Team retrospektiv',
    meta: 'Microsoft Teams · 6 deltakere',
    dot: 'bg-blue-500',
  },
  {
    time: '09:00',
    day: 'tor',
    title: 'Salgsmøte · Nordic AS',
    meta: 'Fysisk møte · Oslo',
    dot: 'bg-emerald-500',
  },
];

const summaryPoints = [
  'Lansering flyttes til 14. juni',
  'Sarah eier go-to-market',
  'Budsjett godkjent av ledelsen',
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Animert lydkurve i telefonmockupen. */
const Waveform = () => {
  const bars = [10, 18, 7, 22, 13, 26, 9, 17, 24, 11, 20, 8, 15, 23, 12, 19, 6, 21];

  return (
    <div className="flex h-[28px] items-center gap-[3px]" aria-hidden>
      {bars.map((height, index) => (
        <span
          key={index}
          className="notably-wave-bar w-[2px] rounded-full bg-white/70"
          style={{ height: `${height}px`, animationDelay: `${index * 0.09}s` }}
        />
      ))}
    </div>
  );
};

/** iPhone-mockup bygget i CSS – ramme, dynamic island, sideknapper og app-skjerm. */
const PhoneMockup = () => (
  <div aria-hidden className="relative w-[288px]">
    {/* Sideknapper */}
    <div aria-hidden className="absolute -left-[2px] top-[104px] h-[26px] w-[2px] rounded-l-sm bg-gradient-to-b from-slate-600 to-slate-800" />
    <div aria-hidden className="absolute -left-[2px] top-[146px] h-[44px] w-[2px] rounded-l-sm bg-gradient-to-b from-slate-600 to-slate-800" />
    <div aria-hidden className="absolute -left-[2px] top-[200px] h-[44px] w-[2px] rounded-l-sm bg-gradient-to-b from-slate-600 to-slate-800" />
    <div aria-hidden className="absolute -right-[2px] top-[168px] h-[68px] w-[2px] rounded-r-sm bg-gradient-to-b from-slate-600 to-slate-800" />

    {/* Titanramme */}
    <div className="relative rounded-[44px] bg-gradient-to-b from-slate-500 via-slate-700 to-slate-900 p-[3px] shadow-[0_40px_80px_-30px_rgba(2,6,23,0.9)]">
      <div className="rounded-[41px] bg-slate-950 p-[9px]">
        {/* Skjerm */}
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[32px] bg-gradient-to-b from-slate-50 to-white">
          {/* Dynamic island */}
          <div aria-hidden className="absolute left-1/2 top-[11px] z-20 flex h-[25px] w-[84px] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-[9px]">
            <span className="h-[6px] w-[6px] rounded-full bg-slate-900 ring-[0.5px] ring-slate-700/50" />
          </div>

          {/* Statuslinje */}
          <div className="relative z-10 flex h-[46px] items-center justify-between px-[20px] pt-[6px] text-[11px] font-semibold text-slate-900">
            <span className="tracking-tight">9:41</span>
            <span className="flex items-center gap-[5px]" aria-hidden>
              <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
                <rect x="0" y="7" width="3" height="4" rx="1" />
                <rect x="4.3" y="5" width="3" height="6" rx="1" />
                <rect x="8.6" y="2.5" width="3" height="8.5" rx="1" />
                <rect x="12.9" y="0" width="3" height="11" rx="1" opacity="0.35" />
              </svg>
              <svg width="14" height="11" viewBox="0 0 14 11" fill="currentColor">
                <path d="M7 10.4 5.1 8.3a2.7 2.7 0 0 1 3.8 0L7 10.4Zm0-4.1a5 5 0 0 0-3.6 1.5L2 6.4a7 7 0 0 1 10 0l-1.4 1.4A5 5 0 0 0 7 6.3Zm0-3.7a8.7 8.7 0 0 0-6.2 2.6L-.6 3.8a10.7 10.7 0 0 1 15.2 0l-1.4 1.4A8.7 8.7 0 0 0 7 2.6Z" />
              </svg>
              <span className="flex h-[11px] w-[22px] items-center rounded-[3px] border border-slate-900/40 p-[1.5px]">
                <span className="h-full w-[72%] rounded-[1.5px] bg-slate-900" />
              </span>
            </span>
          </div>

          {/* App-innhold */}
          <div className="px-[16px] pb-[16px]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-slate-400">Onsdag 12. juni</p>
                <h3 className="text-[19px] font-bold leading-tight tracking-tight text-slate-900">Møter</h3>
              </div>
              <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-[10px] font-semibold text-white">
                JN
              </span>
            </div>

            {/* Opptakskort */}
            <div className="mt-[12px] overflow-hidden rounded-[16px] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-[13px] shadow-[0_14px_26px_-16px_rgba(37,99,235,0.9)]">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-[5px] rounded-full bg-white/15 px-[7px] py-[3px] text-[8.5px] font-semibold uppercase tracking-wider text-white">
                  <span className="notably-rec-dot h-[5px] w-[5px] rounded-full bg-red-400" />
                  Spiller inn
                </span>
                <span className="font-mono text-[10px] tabular-nums text-white/85">12:04</span>
              </div>
              <p className="mt-[9px] text-[12.5px] font-semibold leading-snug text-white">
                Produktlansering Q1
              </p>
              <p className="text-[9.5px] text-blue-100/90">Møterom Fjord · 4 deltakere</p>
              <div className="mt-[8px] flex items-end justify-between">
                <Waveform />
                <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <Mic className="h-[13px] w-[13px] text-blue-700" />
                </span>
              </div>
            </div>

            {/* Referatkort */}
            <div className="mt-[10px] rounded-[16px] border border-slate-200/80 bg-white p-[13px] shadow-[0_8px_20px_-16px_rgba(15,23,42,0.5)]">
              <div className="flex items-center gap-[6px]">
                <Sparkles className="h-[11px] w-[11px] text-blue-600" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-blue-600">
                  AI-referat
                </span>
              </div>
              <p className="mt-[7px] text-[11.5px] font-semibold leading-snug text-slate-900">
                Kundeavtale · gjennomgang
              </p>
              <ul className="mt-[8px] space-y-[6px]">
                {summaryPoints.map((point) => (
                  <li key={point} className="flex items-start gap-[6px]">
                    <span className="mt-[1px] flex h-[11px] w-[11px] shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <Check className="h-[7px] w-[7px] text-emerald-600" strokeWidth={3.5} />
                    </span>
                    <span className="text-[9.5px] leading-[13px] text-slate-600">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kommende møter */}
            <p className="mt-[13px] px-[2px] text-[8.5px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Kommende
            </p>
            <ul className="mt-[7px] space-y-[7px]">
              {upcomingMeetings.map((meeting) => (
                <li
                  key={meeting.title}
                  className="flex items-center gap-[9px] rounded-[14px] border border-slate-200/70 bg-white p-[9px]"
                >
                  <span className="flex h-[28px] w-[28px] shrink-0 flex-col items-center justify-center rounded-[9px] bg-slate-100">
                    <span className="text-[9px] font-bold leading-none text-slate-900">{meeting.time}</span>
                    <span className="mt-[2px] text-[6.5px] font-medium uppercase leading-none text-slate-400">
                      {meeting.day}
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-semibold leading-tight text-slate-900">
                      {meeting.title}
                    </p>
                    <p className="truncate text-[8.5px] leading-tight text-slate-500">{meeting.meta}</p>
                  </div>
                  <span className={`h-[6px] w-[6px] shrink-0 rounded-full ${meeting.dot}`} />
                </li>
              ))}
            </ul>
          </div>

          {/* Tab bar */}
          {/* Tab baren må være helt opak: backdrop-blur her ville samplet den mørke
              rammen utenfor skjermens avrundede klipp og blødd grått inn i hjørnene. */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200/80 bg-white px-[26px] pb-[16px] pt-[9px]">
            <div className="flex items-end justify-between text-slate-300">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600" aria-hidden>
                <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <rect x="3" y="4" width="18" height="17" rx="3" strokeLinejoin="round" />
                <path d="M8 2v4M16 2v4M3 10h18" strokeLinecap="round" />
              </svg>
              <span className="-mt-[10px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-[0_8px_16px_-8px_rgba(37,99,235,1)]">
                <Mic className="h-[15px] w-[15px] text-white" />
              </span>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.6 9.6 0 0 1-2.8-.4L4 21l1.4-4.1A8.2 8.2 0 0 1 3 11.5C3 6.8 7 3 12 3s9 3.8 9 8.5Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" strokeLinecap="round" />
              </svg>
            </div>
            <span aria-hidden className="mx-auto mt-[7px] block h-[4px] w-[96px] rounded-full bg-slate-900/25" />
          </div>
        </div>
      </div>

      {/* Glans på rammen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[44px] ring-1 ring-inset ring-white/25"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[44px]"
      >
        <div className="absolute -left-1/3 top-0 h-[140%] w-1/2 rotate-[18deg] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  </div>
);

export default function MobileAppSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  // Vippingen av telefonen krever bredde vi bare har fra lg og opp.
  const [allowTilt, setAllowTilt] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const update = () => setAllowTilt(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const rawY = useTransform(scrollYProgress, [0, 0.5, 1], [56, 0, -48]);
  const rawRotate = useTransform(scrollYProgress, [0, 0.5, 1], [6, 0, -3.5]);
  const y = useSpring(rawY, { stiffness: 80, damping: 22, mass: 0.6 });
  const rotate = useSpring(rawRotate, { stiffness: 70, damping: 22, mass: 0.6 });
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.94, 1]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.75, 1.1, 0.85]);
  const gridY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  const phoneStyle = prefersReducedMotion
    ? undefined
    : allowTilt
      ? { y, rotate, scale }
      : { y, scale };

  return (
    <section ref={sectionRef} id="mobilapp" className="relative page-container bg-white py-16 sm:py-20 scroll-mt-24">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-950 px-5 py-14 ring-1 ring-inset ring-white/[0.07] sm:rounded-[2.5rem] sm:px-10 sm:py-16 lg:px-14 lg:py-20">
          {/* Atmosfære */}
          <motion.div
            aria-hidden
            style={prefersReducedMotion ? undefined : { y: gridY }}
            className="pointer-events-none absolute inset-0 -top-[10%] h-[120%] opacity-[0.35] [background-image:linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
          />
          <motion.div
            aria-hidden
            style={prefersReducedMotion ? undefined : { scale: glowScale }}
            className="pointer-events-none absolute -right-32 top-0 h-[30rem] w-[30rem] rounded-full bg-blue-600/25 blur-[120px] lg:right-0"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 bottom-[-6rem] h-[24rem] w-[24rem] rounded-full bg-indigo-500/20 blur-[110px]"
          />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
            {/* Tekst */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 backdrop-blur">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
                  Nyhet
                </span>
                <span className="text-sm font-medium text-white">
                  Notably <span className="hidden sm:inline">finnes </span>nå som iOS-app
                </span>
              </motion.div>

              <motion.h2
                variants={itemVariants}
                className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]"
              >
                Møtereferatene
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  rett i lomma.
                </span>
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl"
              >
                Ta opp fysiske møter fra mobilen, les referatene på farten og spør Notably om
                hva som ble bestemt – uansett hvor du er.
              </motion.p>

              <motion.a
                variants={itemVariants}
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 text-slate-950 shadow-[0_20px_40px_-20px_rgba(255,255,255,0.45)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 sm:w-auto"
                aria-label="Last ned Notably i App Store"
              >
                <AppleLogo className="h-7 w-7 shrink-0" />
                <span className="text-left leading-none">
                  <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
                    Last ned i
                  </span>
                  <span className="mt-1 block text-lg font-semibold tracking-tight">App Store</span>
                </span>
              </motion.a>
            </motion.div>

            {/* Telefon */}
            <div className="relative flex justify-center lg:justify-end">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 m-auto h-[22rem] w-[22rem] rounded-full bg-blue-500/20 blur-[90px]"
              />

              <motion.div
                style={phoneStyle}
                initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="relative"
              >
                <PhoneMockup />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
