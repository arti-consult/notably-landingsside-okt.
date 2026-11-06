import { useState } from 'react';
import { Eyebrow, PrimaryCta, SectionHeading, Slider } from '../advokat/shared';

/** Ett referat tar typisk 45 minutter å skrive. Gjennomlesningen av Notablys tar rundt ti. */
const WRITE_MINUTES = 45;
const REVIEW_MINUTES = 10;
const WEEKS_PER_MONTH = 4;
/** En kveld ved PC-en etter en dag på plassen. */
const HOURS_PER_EVENING = 2;
const HOURLY_RATE = 1000;
const PRICE_PER_MONTH = 399;
const PRICE_PER_YEAR = PRICE_PER_MONTH * 12;

const nok = new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 0 });

/**
 * Én glidebryter i stedet for tre. Gevinsten vises som kvelder, fordi det er
 * der referatene faktisk blir skrevet. Forutsetningene står under.
 */
export default function ByggRoiSection() {
  const [meetings, setMeetings] = useState(4);

  const savedHours = (meetings * (WRITE_MINUTES - REVIEW_MINUTES) * WEEKS_PER_MONTH) / 60;
  const evenings = Math.round(savedHours / HOURS_PER_EVENING);
  const value = Math.round((savedHours * HOURLY_RATE) / 100) * 100;

  return (
    <section id="kalkulator" className="page-container scroll-mt-24 bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Regn på det selv</Eyebrow>
          <SectionHeading className="mt-5" lead="Hvor mange kvelder får du tilbake?" />
        </div>

        <div className="mt-12 grid overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-50px_rgba(15,23,42,0.5)] ring-1 ring-inset ring-slate-200/80 sm:mt-14 md:grid-cols-2">
          <div className="flex flex-col justify-center bg-white p-7 sm:p-10">
            <Slider
              label="Byggemøter, befaringer og andre møter med referat per uke"
              value={meetings}
              min={1}
              max={15}
              step={1}
              format={(v) => `${v}`}
              onChange={setMeetings}
            />
            <div className="mt-8 rounded-2xl bg-blue-50 p-5 ring-1 ring-inset ring-blue-100">
              <p className="text-[15px] font-semibold text-slate-900">Og da har vi ikke regnet med tilleggene.</p>
              <p className="mt-1 text-[15px] leading-relaxed text-slate-700">
                Ett tillegg på 5 000 kr som blir betalt fordi det sto skriftlig, dekker et helt år med Notably.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center bg-slate-950 p-7 text-white sm:p-10" aria-live="polite">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-slate-400">Hver måned får du tilbake</p>
            <p className="mt-2 text-6xl font-semibold tracking-tight text-amber-300 sm:text-7xl">
              {nok.format(evenings)}
              <span className="ml-3 text-2xl text-white sm:text-3xl">{evenings === 1 ? 'kveld' : 'kvelder'}</span>
            </p>
            <p className="mt-3 text-[15px] text-slate-300">
              {nok.format(Math.round(savedHours))} timer, verdt rundt{' '}
              <span className="font-semibold text-white">{nok.format(value)} kr</span>. Notably koster {PRICE_PER_MONTH} kr i måneden.
            </p>
            <PrimaryCta light placement="calculator" className="mt-8 self-stretch sm:self-start">
              Prøv gratis i 14 dager
            </PrimaryCta>
          </div>
        </div>

        <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-slate-500">
          Anslag: {WRITE_MINUTES} minutter på å skrive et referat, {REVIEW_MINUTES} minutter på å lese gjennom
          Notablys, {WEEKS_PER_MONTH} uker i måneden, kvelder på {HOURS_PER_EVENING} timer og{' '}
          {nok.format(HOURLY_RATE)} kr timen. Et år koster {nok.format(PRICE_PER_YEAR)} kr per bruker. Priser eks. mva.
        </p>
      </div>
    </section>
  );
}
