import { motion, useReducedMotion } from 'framer-motion';

/**
 * Korte referanser fra kunder: sitat, navn, stilling, portrett og logo.
 * Person og logo står i en egen kolonne ved siden av sitatet på desktop,
 * og over sitatet på mobil. Nye referanser legges til i listen under og
 * vises under hverandre.
 */
type Reference = {
  quote: string;
  /** Fraser fra sitatet som settes i fet skrift. Kundens ordlyd endres ikke. */
  highlights?: string[];
  name: string;
  role: string;
  company: string;
  /** Kvadratisk portrett, vises rundt. Valgfritt. */
  photo?: string;
  logo: { src: string; width: number; height: number };
};

const references: Reference[] = [
  {
    quote:
      'Jeg har testet mange møteassistenter, og kom frem til at Notably er den beste på norsk. Den er flink til å fange opp dialekter, men fungerer også veldig bra i møter med internasjonale deltakere. Ikke minst er jeg imponert over utviklingstakten. Med Notably koblet opp mot Claude har jeg superkrefter!',
    highlights: ['den beste på norsk', 'superkrefter'],
    name: 'Magnus Rosenvinge Hjelle',
    role: 'CFO',
    company: 'Elekt',
    photo: '/media/referanser/magnus-rosenvinge-hjelle.webp',
    logo: { src: '/logos/kunder/elekt.webp', width: 600, height: 237 },
  },
];

function emphasize(text: string, highlights: string[] = []) {
  if (highlights.length === 0) return text;
  const escaped = highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return text.split(new RegExp(`(${escaped.join('|')})`, 'g')).map((part, i) =>
    highlights.includes(part) ? (
      <strong key={i} className="font-semibold text-slate-900">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function ReferencesSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section data-ph-section="references" className="page-container bg-white py-14 sm:py-20">
      <ul className="mx-auto flex max-w-4xl flex-col gap-6">
        {references.map((ref, index) => (
          <motion.li
            key={ref.name}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease }}
          >
            <figure className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-white to-slate-50 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(37,99,235,0.18)] ring-1 ring-inset ring-blue-100 sm:p-10">
              {/* Myk lysflekk i bakgrunnen */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-400/15 blur-3xl"
              />

              <div className="relative grid gap-7 md:grid-cols-[13rem_1fr] md:gap-10">
                {/* Personen */}
                <figcaption className="flex items-center gap-4 md:flex-col md:items-start md:border-r md:border-blue-100 md:pr-8">
                  {ref.photo && (
                    <div className="relative isolate shrink-0">
                      <img
                        src={ref.photo}
                        alt={ref.name}
                        width={192}
                        height={192}
                        loading="lazy"
                        decoding="async"
                        className="h-14 w-14 rounded-full object-cover shadow-md ring-4 ring-white md:h-20 md:w-20"
                      />
                      <span
                        aria-hidden
                        className="absolute inset-0 -z-10 translate-x-1 translate-y-1 rounded-full bg-blue-600/20"
                      />
                    </div>
                  )}
                  <div className="mr-auto md:mr-0">
                    <p className="font-semibold leading-snug text-slate-900">{ref.name}</p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {ref.role}, {ref.company}
                    </p>
                  </div>
                  <img
                    src={ref.logo.src}
                    alt={ref.company}
                    width={ref.logo.width}
                    height={ref.logo.height}
                    loading="lazy"
                    decoding="async"
                    className="h-7 w-auto md:mt-auto md:h-8"
                  />
                </figcaption>

                {/* Sitatet */}
                <div className="flex flex-col justify-center">
                  {index === 0 && (
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
                      Hva kundene sier
                    </h2>
                  )}
                  <blockquote>
                    <p className="text-pretty text-[1.05rem] leading-relaxed text-slate-700 sm:text-[1.15rem]">
                      «{emphasize(ref.quote, ref.highlights)}»
                    </p>
                  </blockquote>
                </div>
              </div>
            </figure>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
