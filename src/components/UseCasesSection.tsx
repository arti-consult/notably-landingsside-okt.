import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { Briefcase, Check, Landmark, TrendingUp, Users } from "lucide-react";

/**
 * Én gevinst og ett referat per team. Referatet viser hva Notably faktisk lager
 * for den typen møte – det sier mer enn tre generiske kort.
 */
const teams = [
  {
    id: "salg",
    name: "Salg",
    icon: TrendingUp,
    headline: "Hvert kundeløfte blir fulgt opp.",
    description:
      "Behov, innvendinger og neste steg havner i referatet – og oppfølgingsmailen er skrevet før du er tilbake ved pulten.",
    meeting: "Salgsmøte · Nordvik Bygg",
    rows: [
      { label: "Behov", text: "Bedre oversikt over prosjektmøtene" },
      { label: "Innvending", text: "Pris sammenlignet med dagens løsning" },
      { label: "Neste steg", text: "Sende tilbud innen fredag" },
    ],
    done: "Utkast til oppfølgingsmail er klart",
  },
  {
    id: "hr",
    name: "HR",
    icon: Users,
    headline: "Sammenlign kandidater på det de faktisk sa.",
    description:
      "Du kan være til stede i intervjuet i stedet for å skrive. Teamet får et likt oppsummert grunnlag for hver kandidat.",
    meeting: "Intervju · Produktdesigner",
    rows: [
      { label: "Styrke", text: "Solid erfaring med brukertesting" },
      { label: "Avklart", text: "Kan starte tidligst i mars" },
      { label: "Vurdering", text: "Anbefales til andre runde" },
    ],
    done: "Delt med ansettelsesteamet",
  },
  {
    id: "radgivning",
    name: "Rådgivning",
    icon: Briefcase,
    headline: "Full oversikt over rådene du har gitt.",
    description:
      "Konsulenter, advokater og revisorer får hvert kundemøte dokumentert – klart for kundehistorikk og timeføring.",
    meeting: "Kundemøte · Årsoppgjør",
    rows: [
      { label: "Råd gitt", text: "Utsette investeringen til Q1" },
      { label: "Kunden gjør", text: "Sender regnskapet innen 15. mai" },
      { label: "Tid", text: "45 minutter, klart for timeføring" },
    ],
    done: "Lagt i kundehistorikken",
  },
  {
    id: "ledelse",
    name: "Ledelse",
    icon: Landmark,
    headline: "Vedtak og ansvar samlet, møte etter møte.",
    description:
      "Fra ledermøtet til styremøtet: hvem som skal gjøre hva står svart på hvitt, og protokollen er nesten skrevet.",
    meeting: "Styremøte · Oktober",
    rows: [
      { label: "Vedtak", text: "Budsjettet for 2027 er godkjent" },
      { label: "Ansvar", text: "Sara starter rekruttering av CFO" },
      { label: "Frist", text: "Status på neste styremøte 12. nov." },
    ],
    done: "Utkast til protokoll er klart",
  },
];

/** Hvor lenge hvert team vises før neste tar over, i sekunder. */
const TEAM_DURATION = 6.5;

type Team = (typeof teams)[number];

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Innholdet for ett team. Brukes både synlig og som usynlig «målestokk»: alle
 * teamene ligger oppå hverandre i samme rutenettcelle, så panelet alltid er
 * like høyt som det høyeste. Da hopper ikke siden når teamet skifter på mobil.
 */
const TeamContent = ({ t, still }: { t: Team; still: boolean }) => (
  <>
    {/* Gevinsten */}
    <div className="px-1 pt-2 sm:px-0 sm:pt-0">
      <h3 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-3xl">
        {t.headline}
      </h3>
      <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600 sm:text-lg">
        {t.description}
      </p>
    </div>

    {/* Referatet Notably lager */}
    <div
      aria-hidden
      className="rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.45)] sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-[15px] font-semibold tracking-tight text-slate-900">
          {t.meeting}
        </p>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200/70">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Klart
        </span>
      </div>

      <ul className="mt-5 space-y-2.5">
        {t.rows.map(({ label, text }, row) => (
          <motion.li
            key={label}
            initial={still ? false : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.25 + row * 0.18, ease }}
            className="flex flex-col gap-1 rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 sm:flex-row sm:items-center sm:gap-3"
          >
            <span className="w-24 shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              {label}
            </span>
            <span className="text-[14px] text-slate-800">{text}</span>
          </motion.li>
        ))}
      </ul>

      <motion.p
        initial={still ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.25 + t.rows.length * 0.18 + 0.1,
          ease,
        }}
        className="mt-4 flex items-center gap-2 text-[13px] font-medium text-blue-700"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
          <Check className="h-3 w-3 text-white" strokeWidth={3} />
        </span>
        {t.done}
      </motion.p>
    </div>
  </>
);

export default function UseCasesSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.4 });
  const prefersReducedMotion = useReducedMotion();

  const [index, setIndex] = useState(0);
  // Når noen har valgt selv, stopper rotasjonen så de får lese i fred.
  const [userPicked, setUserPicked] = useState(false);
  const autoplay = inView && !prefersReducedMotion && !userPicked;

  const team = teams[index];

  return (
    <section className="py-20 page-container bg-white sm:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-balance text-center text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-slate-800 sm:text-4xl md:text-5xl md:leading-[1.1]">
          Uansett hvilke møter du har.
          <span className="block text-slate-500">
            Notably vet hva som er viktig.
          </span>
        </h2>

        {/* Teamvelgeren. Fremdriftsstripen i aktiv knapp viser når neste kommer. */}
        <div
          role="tablist"
          aria-label="Velg team"
          className="mx-auto mt-10 flex w-fit max-w-full gap-1 rounded-full bg-slate-100 p-1 sm:mt-12"
        >
          {teams.map(({ id, name, icon: Icon }, i) => {
            const isActive = i === index;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                id={`usecase-tab-${id}`}
                aria-selected={isActive}
                aria-controls="usecase-panel"
                onClick={() => {
                  setIndex(i);
                  setUserPicked(true);
                }}
                className={`relative flex items-center gap-2 overflow-hidden rounded-full px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:px-5 sm:py-2.5 sm:text-[15px] ${
                  isActive
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="usecase-pill"
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.45,
                      ease,
                    }}
                    className="absolute inset-0 rounded-full bg-white shadow-[0_4px_14px_-6px_rgba(15,23,42,0.3)]"
                  />
                )}
                <Icon
                  className="relative hidden h-4 w-4 sm:block"
                  aria-hidden
                />
                <span className="relative">{name}</span>
                {isActive && autoplay && (
                  <motion.span
                    key={`progress-${index}`}
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: TEAM_DURATION, ease: "linear" }}
                    onAnimationComplete={() =>
                      setIndex((current) => (current + 1) % teams.length)
                    }
                    className="absolute inset-x-4 bottom-1 h-[2px] origin-left rounded-full bg-blue-500/70"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Innholdet */}
        <div
          ref={stageRef}
          id="usecase-panel"
          role="tabpanel"
          aria-labelledby={`usecase-tab-${team.id}`}
          className="mt-8 overflow-hidden rounded-[2rem] bg-[#E6ECF7] p-5 sm:mt-10 sm:p-8 lg:p-12"
        >
          <div className="grid">
            {teams.map((t) => (
              <div
                key={t.id}
                aria-hidden
                className="invisible grid content-start items-start gap-8 lg:content-center lg:items-center [grid-area:1/1] lg:min-h-[19rem] lg:grid-cols-[0.9fr_1.1fr] lg:gap-12"
              >
                <TeamContent t={t} still />
              </div>
            ))}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={team.id}
                initial={
                  prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }
                }
                transition={{ duration: 0.35, ease }}
                className="grid content-start items-start gap-8 lg:content-center lg:items-center [grid-area:1/1] lg:min-h-[19rem] lg:grid-cols-[0.9fr_1.1fr] lg:gap-12"
              >
                <TeamContent t={team} still={!!prefersReducedMotion} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
