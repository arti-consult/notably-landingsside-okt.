import { motion } from 'framer-motion';
import { MessageSquare, Search } from 'lucide-react';

const exampleQuestions = [
  'Hva var hovedpunktene fra forrige møte?',
  'Hvem er den beste kandidaten fra intervjuene?',
  'Hva har vært hovedtemaene den siste uken?',
];

const conversation = [
  { text: 'Hva ble besluttet i møtet om Q2-strategi?', isUser: true },
  {
    text: 'Det ble besluttet å fokusere på tre områder: øke markedsandelen i Norden med 15 %, lansere to nye produktfunksjoner innen juni, og styrke kundeservice-teamet med tre ansatte.',
    isUser: false,
  },
  { text: 'Hvem er ansvarlig for produktlanseringen?', isUser: true },
  {
    text: 'Sara Jensen er prosjektleder, med støtte fra tech-teamet ledet av Tomas Andersen.',
    isUser: false,
  },
];

export default function AIAnswersSection() {
  return (
    <section className="py-20 page-container bg-gray-50">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-14">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl"
          >
            Spør om alt som
            <br />
            har blitt sagt.
          </motion.h2>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-600">
            Still hvilket som helst spørsmål på tvers av alle møtene dine, og få svaret med
            én gang — enten møtet var i går eller i fjor.
          </p>

          <ul className="mt-8 space-y-2.5">
            {exampleQuestions.map((question) => (
              <li
                key={question}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                <span className="text-[15px] text-slate-700">{question}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_28px_70px_-45px_rgba(15,23,42,0.5)] sm:p-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
              <MessageSquare className="h-5 w-5 text-white" aria-hidden />
            </span>
            <div>
              <p className="font-semibold text-slate-900">Notably AI</p>
              <p className="text-xs text-slate-500">Søker i alle møtene dine</p>
            </div>
          </div>

          <div className="space-y-3 pt-5">
            {conversation.map((message, index) => (
              <motion.div
                key={message.text}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.55, ease: 'easeOut' }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
                    message.isUser
                      ? 'rounded-br-md bg-blue-600 text-white'
                      : 'rounded-bl-md bg-slate-100 text-slate-700'
                  }`}
                >
                  {message.text}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
