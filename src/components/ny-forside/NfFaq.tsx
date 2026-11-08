import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Label, Reveal, ease } from './shared';

const nfFaqs = [
  {
    question: 'Fungerer Notably på norsk?',
    answer:
      'Ja. Notably er laget for norske team og skriver referatet på norsk. Den forstår over 100 språk, også når møtet veksler mellom norsk og engelsk.',
  },
  {
    question: 'Hvilke møter fungerer det med?',
    answer:
      'Notably blir med i møter i Microsoft Teams, Zoom og Google Meet. Fysiske møter tar du opp med appen for iPhone eller Android.',
  },
  {
    question: 'Må jeg installere noe for digitale møter?',
    answer:
      'Nei. Koble til kalenderen, så blir Notably med i Teams-, Zoom- og Meet-møtene som en egen deltaker. Det betyr også at alle i møtet ser at det tas notater.',
  },
  {
    question: 'Hvor lagres møtene, og trener dere AI på dem?',
    answer:
      'Møter, opptak og referater lagres og behandles i EU/EØS, på servere i Tyskland. Innholdet blir aldri brukt til å trene AI-modeller, og databehandleravtalen følger automatisk med.',
  },
  {
    question: 'Hva koster det?',
    answer:
      '399 kr per bruker per måned eks. mva. Du får 14 dager gratis med full tilgang. Større firmaer kan få et tilbud med SSO, onboarding og tilpasset avtale.',
  },
  {
    question: 'Kan referatet tilpasses vår måte å jobbe på?',
    answer:
      'Ja. Velg en mal for møtetypen, som styremøte, salgsmøte eller intervju, eller lag din egen. Møtene kan samles i mapper per kunde eller prosjekt.',
  },
  {
    question: 'Hvordan deler jeg referatet?',
    answer: 'Del det med Del-knappen, send det på e-post rett fra Notably, eller last det ned som dokument.',
  },
];

export default function NfFaq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section data-ph-section="faq" className="px-5 pb-24 sm:px-8 sm:pb-36">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <Label>Spørsmål</Label>
          <h2 className="mt-6 text-balance text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-slate-950 sm:text-5xl">
            Det folk lurer på.
          </h2>
          <p className="mt-5 text-slate-600">
            Finner du ikke svaret? Skriv til{' '}
            <a href="mailto:support@notably.no" className="font-medium text-blue-700 underline-offset-4 hover:underline">
              support@notably.no
            </a>
            .
          </p>
        </Reveal>
        <ul className="divide-y divide-slate-900/10 border-y border-slate-900/10">
          {nfFaqs.map(({ question, answer }, i) => {
            const isOpen = open === i;
            return (
              <li key={question}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">{question}</span>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      isOpen ? 'rotate-45 bg-slate-950 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-900/10'
                    }`}
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 text-[16px] leading-relaxed text-slate-600">{answer}</p>
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
