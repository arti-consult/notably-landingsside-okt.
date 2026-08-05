import { motion } from 'framer-motion';
import { Bell, Languages, LayoutTemplate, UserCheck } from 'lucide-react';

const capabilities = [
  {
    icon: Languages,
    title: 'Over 100 språk',
    description: 'Møter på norsk, engelsk eller blandet — Notably henger med.',
  },
  {
    icon: UserCheck,
    title: 'Kjenner igjen stemmer',
    description: 'Referatet viser hvem som sa hva, uten at du merker noen.',
  },
  {
    icon: LayoutTemplate,
    title: 'Egne notatmaler',
    description: 'Tilpass strukturen til styremøtet, salgsmøtet eller intervjuet.',
  },
  {
    icon: Bell,
    title: 'Påminnelser',
    description: 'Få beskjed når oppgavene fra møtet nærmer seg frist.',
  },
];

export default function CapabilitiesSection() {
  return (
    <section className="py-16 page-container bg-white sm:py-20">
      <div className="mx-auto max-w-6xl">
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-4"
        >
          {capabilities.map(({ icon: Icon, title, description }) => (
            <motion.li
              key={title}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                <Icon className="h-[18px] w-[18px] text-blue-600" aria-hidden />
              </span>
              <h3 className="mt-4 font-semibold tracking-tight text-slate-900">{title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">{description}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
