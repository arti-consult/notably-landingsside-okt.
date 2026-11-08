import type { ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const SIGNUP_URL = 'https://app.notably.no/no/sign-up';
export const LOGIN_URL = 'https://app.notably.no';
// Samme adresse som DEMO_BOOKING_URL i lib/marketing-policy.ts.
export const DEMO_URL = 'https://os.notably.no/book/demo';
export const APP_STORE_URL = 'https://apps.apple.com/no/app/notably/id6783667184?l=nb';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=no.notably.mobile';

export const ease = [0.22, 1, 0.36, 1] as const;

/** Liten mono-etikett over seksjonene, som et tidsstempel i en transkripsjon. */
export function Label({ children, dark = false, className = '' }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <p
      className={`flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] sm:text-xs ${
        dark ? 'text-slate-400' : 'text-slate-500'
      } ${className}`}
    >
      <Lines className={`h-2.5 w-3 ${dark ? 'text-blue-400' : 'text-blue-600'}`} />
      {children}
    </p>
  );
}

/**
 * De tre linjene fra «n»-en i logoen: to hele og en kort. Brukes som motiv for
 * «referat» gjennom hele siden. Proporsjonene er hentet fra logo-SVG-en.
 */
export function Lines({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 182 233" aria-hidden className={className} fill="currentColor">
      <rect y="0" width="182" height="53" />
      <rect y="90" width="182" height="53" />
      <rect y="180" width="100" height="53" />
    </svg>
  );
}

/** Toner inn og løfter innholdet når det kommer på skjermen. */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className = '',
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'li' | 'p';
}) {
  const reduced = useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : y },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, delay, ease } },
  };
  const Comp = as === 'li' ? motion.li : as === 'p' ? motion.p : motion.div;
  return (
    <Comp
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className={className}
    >
      {children}
    </Comp>
  );
}

export function PrimaryCta({
  placement,
  children = 'Prøv gratis i 14 dager',
  light = false,
  className = '',
}: {
  placement: string;
  children?: ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <a
      data-trial-cta={placement}
      href={SIGNUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative inline-flex shrink-0 items-center justify-center gap-2.5 overflow-hidden rounded-full px-7 py-4 text-[17px] font-semibold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
        light
          ? 'bg-white text-slate-950 hover:bg-blue-50 focus-visible:outline-white'
          : 'bg-blue-600 text-white shadow-[0_18px_40px_-18px_rgba(37,99,235,0.9)] hover:bg-blue-700 focus-visible:outline-blue-600'
      } ${className}`}
    >
      <span className="relative">{children}</span>
      <span
        className={`relative flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-0.5 ${
          light ? 'bg-slate-950 text-white' : 'bg-white/20'
        }`}
      >
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </span>
    </a>
  );
}

export function SecondaryCta({
  placement,
  children = 'Book en demo',
  dark = false,
  className = '',
}: {
  placement: string;
  children?: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <a
      data-demo-cta={placement}
      href={DEMO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex shrink-0 items-center justify-center rounded-full px-7 py-4 text-[17px] font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
        dark
          ? 'text-white ring-1 ring-inset ring-white/25 hover:bg-white/10 focus-visible:outline-white'
          : 'text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-white hover:ring-slate-400 focus-visible:outline-slate-500'
      } ${className}`}
    >
      {children}
    </a>
  );
}

/** Norsk flagg som SVG, fordi emoji-flagg vises som «NO» på Windows. */
export function NorwayFlag({ className = 'h-3 w-auto' }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 16" aria-hidden className={`${className} rounded-[2px]`}>
      <rect width="22" height="16" fill="#BA0C2F" />
      <rect x="6" width="4" height="16" fill="#fff" />
      <rect y="6" width="22" height="4" fill="#fff" />
      <rect x="7" width="2" height="16" fill="#00205B" />
      <rect y="7" width="22" height="2" fill="#00205B" />
    </svg>
  );
}

/** Logoen. På mørk bunn snus den svarte PNG-en til hvit. */
export function Logo({ dark = false, className = 'h-7 w-auto' }: { dark?: boolean; className?: string }) {
  return (
    <img
      src="/media/1760975960292.png"
      alt="Notably"
      width={1988}
      height={504}
      decoding="async"
      className={`${className} ${dark ? 'invert' : ''}`}
    />
  );
}
