import { useId, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

export const SIGNUP_URL = 'https://app.notably.no/no/sign-up';
export const DEMO_URL = 'https://calendly.com/arti-jorgen/notably-demo';
export const CONTACT_EMAIL = 'jorgen@notably.no';

export const ease = [0.22, 1, 0.36, 1] as const;

/** Liten overtittel over seksjonsoverskriftene, som på forsiden. */
export const Eyebrow = ({ children, className = 'text-slate-500' }: { children: ReactNode; className?: string }) => (
  <p className={`text-xs font-medium uppercase tracking-[0.18em] sm:text-sm ${className}`}>{children}</p>
);

/** Overskrift i to toner: påstanden i mørkt, poenget i grått – samme grep som forsiden. */
export const SectionHeading = ({
  lead,
  muted,
  className = '',
  dark = false,
}: {
  lead: ReactNode;
  muted?: ReactNode;
  className?: string;
  dark?: boolean;
}) => (
  <h2
    className={`text-balance text-[1.75rem] font-semibold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl md:leading-[1.1] ${
      dark ? 'text-white' : 'text-slate-800'
    } ${className}`}
  >
    {lead}
    {muted && <span className={`block ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{muted}</span>}
  </h2>
);

export const PrimaryCta = ({
  placement,
  children = 'Start gratis',
  light = false,
  className = '',
}: {
  placement?: string;
  children?: ReactNode;
  light?: boolean;
  className?: string;
}) => (
  <a
    data-trial-cta={placement}
    href={SIGNUP_URL}
    target="_blank"
    rel="noopener noreferrer"
    className={`group inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-transparent px-6 py-4 text-lg font-semibold transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
      light
        ? 'bg-white text-slate-900 hover:bg-blue-50 focus-visible:outline-white'
        : 'bg-blue-600 text-white shadow-[0_14px_30px_-16px_rgba(37,99,235,0.7)] hover:bg-blue-700 focus-visible:outline-blue-600'
    } ${className}`}
  >
    {children}
    <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
  </a>
);

export const SecondaryCta = ({
  children = 'Book en demo',
  dark = false,
  className = '',
}: {
  children?: ReactNode;
  dark?: boolean;
  className?: string;
}) => (
  <a
    href={DEMO_URL}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex shrink-0 items-center justify-center rounded-2xl border px-6 py-4 text-lg font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
      dark
        ? 'border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10 focus-visible:outline-white'
        : 'border-slate-300 bg-white/70 text-slate-700 backdrop-blur hover:border-slate-400 hover:text-slate-900 focus-visible:outline-slate-500'
    } ${className}`}
  >
    {children}
  </a>
);

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}

/** Glidebryter til kalkulatorene på bransjesidene. */
export const Slider = ({ label, value, min, max, step, format, onChange }: SliderProps) => {
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
