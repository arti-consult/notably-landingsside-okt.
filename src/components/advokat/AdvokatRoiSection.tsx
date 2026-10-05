import { useId, useState } from 'react';
import { Eyebrow, PrimaryCta, SectionHeading } from './shared';

/** Tiden vi regner med at det tar å lese gjennom og kvalitetssikre et ferdig notat. */
const REVIEW_MINUTES = 5;
const WEEKS_PER_MONTH = 4;
const PRICE_PER_MONTH = 399;

const nok = new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 0 });
const hours = new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 1, minimumFractionDigits: 0 });

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}

const Slider = ({ label, value, min, max, step, format, onChange }: SliderProps) => {
  const id = useId();
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[15px] font-medium text-slate-700">
          {label}
        </label>
        <output htmlFor={id} className="shrink-0 text-lg font-semibold tabular-nums text-slate-900">
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ background: `linear-gradient(to right, #2563eb ${fill}%, #e2e8f0 ${fill}%)` }}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(15,23,42,0.35)]"
      />
    </div>
  );
};

/**
 * Advokater tenker i timer og timepris. Kalkulatoren gjør gevinsten konkret
 * i deres egen valuta – og er åpen om forutsetningen.
 */
export default function AdvokatRoiSection() {
  const [meetings, setMeetings] = useState(8);
  const [minutes, setMinutes] = useState(25);
  const [rate, setRate] = useState(2500);

  const savedPerMeeting = Math.max(minutes - REVIEW_MINUTES, 0);
  const savedHours = (meetings * savedPerMeeting * WEEKS_PER_MONTH) / 60;
  const value = savedHours * rate;
  const multiple = value / PRICE_PER_MONTH;

  return (
    <section id="kalkulator" className="page-container scroll-mt-24 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Regn på det selv</Eyebrow>
          <SectionHeading className="mt-5" lead="Hva koster notatene deg i dag?" muted="I timer du kunne brukt på saken." />
        </div>

        <div className="mt-12 grid overflow-hidden rounded-[2rem] ring-1 ring-inset ring-slate-200/80 sm:mt-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-9 bg-slate-50 p-7 sm:p-10">
            <Slider
              label="Møter med notatbehov per uke"
              value={meetings}
              min={1}
              max={30}
              step={1}
              format={(v) => `${v}`}
              onChange={setMeetings}
            />
            <Slider
              label="Minutter du bruker på notat og referat per møte"
              value={minutes}
              min={5}
              max={60}
              step={5}
              format={(v) => `${v} min`}
              onChange={setMinutes}
            />
            <Slider
              label="Din timepris"
              value={rate}
              min={1000}
              max={5000}
              step={100}
              format={(v) => `${nok.format(v)} kr`}
              onChange={setRate}
            />
          </div>

          <div className="flex flex-col justify-center bg-slate-950 p-7 text-white sm:p-10" aria-live="polite">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-slate-400">Tid frigjort per måned</p>
            <p className="mt-2 text-5xl font-semibold tracking-tight sm:text-6xl">
              {hours.format(savedHours)} <span className="text-2xl text-slate-400 sm:text-3xl">timer</span>
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

            <PrimaryCta className="mt-8 self-start">Prøv på neste klientmøte</PrimaryCta>
          </div>
        </div>

        <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-slate-500">
          Anslag basert på {WEEKS_PER_MONTH} arbeidsuker per måned, og at du bruker ca. {REVIEW_MINUTES} minutter på å
          lese gjennom og kvalitetssikre hvert notat. Pris eks. mva.
        </p>
      </div>
    </section>
  );
}
