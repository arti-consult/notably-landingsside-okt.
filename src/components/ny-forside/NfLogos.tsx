import { useReducedMotion } from 'framer-motion';

/** Samme kundelogoer som på dagens forside. `scale` jevner ut optisk størrelse. */
const logos = [
  { name: 'Pharma Nordic', src: '/logos/kunder/pharma-nordic.svg', scale: 0.72 },
  { name: 'Møbelringen', src: '/logos/kunder/mobelringen.webp', scale: 1.25 },
  { name: 'Brave', src: '/logos/kunder/brave.webp', scale: 0.85 },
  { name: '1881', src: '/logos/kunder/1881.webp', scale: 1.35 },
  { name: 'Breivik Eiendom', src: '/logos/kunder/breivik-eiendom.svg', scale: 0.72 },
  { name: 'Verdsette', src: '/logos/kunder/verdsette.webp', scale: 0.78 },
  { name: 'TOR Entreprenør', src: '/logos/kunder/tor-entreprenor.webp', scale: 1.2 },
  { name: 'Bø kommune', src: '/logos/kunder/bo-kommune.webp', scale: 1.1 },
  { name: 'HTB', src: '/logos/kunder/htb.webp', scale: 1.1 },
  { name: 'Økonomihuset', src: '/logos/kunder/oh.svg', scale: 1 },
];

const Row = ({ hidden = false }: { hidden?: boolean }) => (
  <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-14 pr-14 sm:gap-20 sm:pr-20">
    {logos.map(({ name, src, scale }) => (
      <li key={name} className="flex shrink-0 items-center">
        <img
          src={src}
          alt={hidden ? '' : name}
          loading="lazy"
          decoding="async"
          style={{ height: `calc(var(--logo-h) * ${scale})` }}
          className="w-auto opacity-70 grayscale"
        />
      </li>
    ))}
  </ul>
);

export default function NfLogos() {
  const reduced = useReducedMotion();
  return (
    <section data-ph-section="customer_logos" className="relative py-12 sm:py-16">
      <p className="text-center text-sm text-slate-500">
        Brukt av team i alt fra <span className="font-semibold text-slate-800">byggefirmaer og regnskapsbyråer til kommuner</span>
      </p>
      {reduced ? (
        <ul className="mx-auto mt-8 flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-6 px-5 [--logo-h:26px]">
          {logos.map(({ name, src, scale }) => (
            <li key={name}>
              <img src={src} alt={name} style={{ height: `calc(26px * ${scale})` }} className="w-auto opacity-70 grayscale" />
            </li>
          ))}
        </ul>
      ) : (
        <div className="relative mt-8 overflow-hidden [--logo-h:24px] [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] sm:[--logo-h:30px]">
          <div className="notably-marquee flex w-max" style={{ animationDuration: '50s' }}>
            <Row />
            <Row hidden />
          </div>
        </div>
      )}
    </section>
  );
}
