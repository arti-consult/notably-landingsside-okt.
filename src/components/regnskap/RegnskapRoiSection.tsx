import { useState } from 'react';
import { Eyebrow, PrimaryCta, SectionHeading, Slider } from '../advokat/shared';

/** Tiden vi regner med at det tar å lese gjennom og rette et ferdig referat. */
const REVIEW_MINUTES = 5;
const WEEKS_PER_MONTH = 4;
const HOURS_PER_DAY = 7.5;
const PRICE_PER_MONTH = 399;

const nok = new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 0 });
const hours = new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 1, minimumFractionDigits: 0 });

/**
 * Byråene mangler folk mer enn de mangler oppdrag, så gevinsten vises både som
 * kroner og som arbeidsdager. Timeprisen starter på 1 000 kr, midt i spennet
 * Synega og Fiken oppgir for regnskapsførere.
 */
export default function RegnskapRoiSection() {
  const [meetings, setMeetings] = useState(10);
  const [minutes, setMinutes] = useState(20);
  const [rate, setRate] = useState(1000);

  const savedPerMeeting = Math.max(minutes - REVIEW_MINUTES, 0);
  const savedHours = (meetings * savedPerMeeting * WEEKS_PER_MONTH) / 60;
  const savedDays = savedHours / HOURS_PER_DAY;
  const value = savedHours * rate;
  const multiple = value / PRICE_PER_MONTH;

  return (
    <section id="kalkulator" className="page-container scroll-mt-24 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Regn på det selv</Eyebrow>
          <SectionHeading
            className="mt-5"
            lead="Hvor mye av fastprisen går til referater?"
            muted="Prøv med dine egne tall."
          />
        </div>

        <div className="mt-12 grid overflow-hidden rounded-[2rem] ring-1 ring-inset ring-slate-200/80 sm:mt-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-9 bg-slate-50 p-7 sm:p-10">
            <Slider
              label="Kundemøter og interne møter per uke"
              value={meetings}
              min={1}
              max={30}
              step={1}
              format={(v) => `${v}`}
              onChange={setMeetings}
            />
            <Slider
              label="Minutter du bruker på referat og oppsummering per møte"
              value={minutes}
              min={5}
              max={60}
              step={5}
              format={(v) => `${v} min`}
              onChange={setMinutes}
            />
            <Slider
              label="Hva en time er verdt for byrået"
              value={rate}
              min={600}
              max={2000}
              step={50}
              format={(v) => `${nok.format(v)} kr`}
              onChange={setRate}
            />
          </div>

          <div className="flex flex-col justify-center bg-slate-950 p-7 text-white sm:p-10" aria-live="polite">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-slate-400">Tid frigjort per måned</p>
            <p className="mt-2 text-5xl font-semibold tracking-tight sm:text-6xl">
              {hours.format(savedHours)} <span className="text-2xl text-slate-400 sm:text-3xl">timer</span>
            </p>
            <p className="mt-2 text-[15px] text-slate-300">
              Det er omtrent <span className="font-semibold text-white">
                {hours.format(savedDays)} {savedDays > 1 ? 'arbeidsdager' : 'arbeidsdag'}
              </span>{' '}
              til kunder, årsoppgjør og rådgivning.
            </p>

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-sm text-slate-400">Verdt i timepris</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">{nok.format(value)} kr</p>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
                {multiple >= 1 ? (
                  <>
                    Det er <span className="font-semibold text-white">{nok.format(Math.floor(multiple))} ganger</span> det
                    Notably koster per måned.
                  </>
                ) : (
                  <>Notably koster {PRICE_PER_MONTH} kr per måned.</>
                )}
              </p>
            </div>

            <PrimaryCta className="mt-8 self-start">Prøv på neste kundemøte</PrimaryCta>
          </div>
        </div>

        <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-slate-500">
          Anslag basert på {WEEKS_PER_MONTH} arbeidsuker per måned, arbeidsdager på {hours.format(HOURS_PER_DAY)} timer,
          og at du bruker ca. {REVIEW_MINUTES} minutter på å lese gjennom hvert referat. Pris eks. mva.
        </p>
      </div>
    </section>
  );
}
