import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Eyebrow, SectionHeading, ease } from './shared';
import { advokatFaqs, type Faq } from './faqs';

/** Brukes også på regnskapsførersiden, med egne spørsmål og undertittel. */
export default function AdvokatFaqSection({
  faqs = advokatFaqs,
  muted = 'før første klientmøte.',
  background = 'bg-white',
}: { faqs?: Faq[]; muted?: string; background?: string } = {}) {
  const [open, setOpen] = useState<number | null>(0);
  const reduced = useReducedMotion();

  return (
    <section id="faq" className={`page-container scroll-mt-24 py-20 sm:py-24 ${background}`}>
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>Spørsmål og svar</Eyebrow>
          <SectionHeading className="mt-5" lead="Det du lurer på" muted={muted} />
          <p className="mt-5 max-w-sm text-lg leading-relaxed text-slate-600">
            Finner du ikke svaret? Skriv til{' '}
            <a href="mailto:support@notably.no" className="font-medium text-blue-700 underline-offset-4 hover:underline">
              support@notably.no
            </a>
            .
          </p>
        </div>

        <ul className="divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map(({ question, answer }, i) => {
            const isOpen = open === i;
            return (
              <li key={question}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-semibold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:text-lg"
                  >
                    {question}
                    <Plus
                      className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                      aria-hidden
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={reduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                      exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-10 text-[15px] leading-relaxed text-slate-600 sm:text-base">{answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
