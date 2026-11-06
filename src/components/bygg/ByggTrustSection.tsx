import { Ban, FileCheck2, MapPin, Trash2, type LucideIcon } from 'lucide-react';

/**
 * Påstandene skal stemme med personvernerklæringen (src/pages/PrivacyPolicy.tsx).
 * Ikke legg til sertifiseringer eller garantier vi ikke har. Detaljene står i FAQ.
 */
const items: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: MapPin, title: 'Lagret i EU', text: 'Opptak, transkripsjoner og referater lagres og behandles i EU/EØS.' },
  { icon: Ban, title: 'Aldri brukt til AI-trening', text: 'Møtene brukes bare til å lage dine referater.' },
  { icon: FileCheck2, title: 'Databehandleravtale', text: 'På plass fra dag én når dere blir kunde.' },
  { icon: Trash2, title: 'Slett lyden, behold referatet', text: 'Du lagrer ikke mer av møtet enn du trenger.' },
];

export default function ByggTrustSection() {
  return (
    <section id="sikkerhet" className="px-6 sm:px-10 md:px-[8%] xl:px-[11%] scroll-mt-24 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-slate-800 sm:text-3xl">
            Trygt for deg, og for byggherren.
          </h2>
          <a href="/personvern" className="text-sm font-medium text-blue-700 underline-offset-4 hover:underline">
            Les personvernerklæringen
          </a>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-[1.5rem] bg-slate-50 p-6 ring-1 ring-inset ring-slate-200/70">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200/80">
                <Icon className="h-[18px] w-[18px] text-slate-700" aria-hidden />
              </span>
              <h3 className="mt-4 text-[17px] font-semibold tracking-tight text-slate-900">{title}</h3>
              <p className="mt-1 text-[15px] leading-relaxed text-slate-600">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
