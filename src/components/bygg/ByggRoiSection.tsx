import { useState } from 'react';
import { Eyebrow, PrimaryCta, SectionHeading, Slider } from '../advokat/shared';

/** Byggemøtereferater er lengre enn de fleste, så gjennomlesningen settes til ti minutter. */
const REVIEW_MINUTES = 10;
const WEEKS_PER_MONTH = 4;
/** En kveld ved PC-en etter en dag på plassen. */
const HOURS_PER_EVENING = 2;
const PRICE_PER_MONTH = 399;
const PRICE_PER_YEAR = PRICE_PER_MONTH * 12;

const nok = new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 0 });
const hours = new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 1, minimumFractionDigits: 0 });

/**
 * Referatene skrives ofte etter arbeidstid, så gevinsten vises som kvelder i
 * tillegg til kroner. Timeverdien starter på 1 000 kr, et nøkternt anslag for
 * hva en time av prosjektlederen koster eller kan faktureres for.
 */
export default function ByggRoiSection() {
  const [meetings, setMeetings] = useState(5);
  const [minutes, setMinutes] = useState(45);
  const [rate, setRate] = useState(1000);

  const savedPerMeeting = Math.max(minutes - REVIEW_MINUTES, 0);
  const savedHours = (meetings * savedPerMeeting * WEEKS_PER_MONTH) / 60;
  const evenings = savedHours / HOURS_PER_EVENING;
  const value = savedHours * rate;
  const multiple = value / PRICE_PER_MONTH;

  return (
    <section id="kalkulator" className="page-container scroll-mt-24 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Regn på det selv</Eyebrow>
          <SectionHeading
            className="mt-5"
            lead="Hvor mange kvelder går til referater?"
            muted="Prøv med dine egne tall."
          />
        </div>

        <div className="mt-12 grid overflow-hidden rounded-[2rem] ring-1 ring-inset ring-slate-200/80 sm:mt-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-9 bg-slate-50 p-7 sm:p-10">
            <Slider
              label="Byggemøter, befaringer og andre møter med referat per uke"
              value={meetings}
              min={1}
              max={20}
              step={1}
              format={(v) => `${v}`}
              onChange={setMeetings}
            />
            <Slider
              label="Minutter du bruker på å skrive og sende referatet per møte"
              value={minutes}
              min={15}
              max={120}
              step={5}
              format={(v) => `${v} min`}
              onChange={setMinutes}
            />
            <Slider
              label="Hva en time av deg er verdt for firmaet"
              value={rate}
              min={600}
              max={1800}
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
              Det er omtrent{' '}
              <span className="font-semibold text-white">
                {nok.format(Math.round(evenings))} {Math.round(evenings) === 1 ? 'kveld' : 'kvelder'}
              </span>{' '}
              du slipper å bruke på referater.
            </p>

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-sm text-slate-400">Verdt i timer</p>
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

            <PrimaryCta className="mt-8 self-start">Prøv på neste byggemøte</PrimaryCta>
          </div>
        </div>

        <div className="mx-auto mt-5 max-w-6xl rounded-[1.75rem] bg-blue-50 p-6 ring-1 ring-inset ring-blue-100 sm:p-7">
          <p className="text-[17px] font-semibold tracking-tight text-slate-900">Og da har vi ikke regnet med tilleggene.</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-slate-700">
            Et år med Notably koster {nok.format(PRICE_PER_YEAR)} kr eks. mva. Ett tilleggsarbeid på 5 000 kr som blir
            betalt fordi det sto skriftlig, dekker hele året.
          </p>
        </div>

        <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-slate-500">
          Anslag basert på {WEEKS_PER_MONTH} arbeidsuker per måned, kvelder på {HOURS_PER_EVENING} timer, og at du
          bruker ca. {REVIEW_MINUTES} minutter på å lese gjennom hvert referat. Pris eks. mva.
        </p>
      </div>
    </section>
  );
}
