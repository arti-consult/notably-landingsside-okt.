import { motion } from 'framer-motion';
import { Mic, Users, Calendar } from 'lucide-react';
import { Highlight } from './Highlight';
import { useState, useEffect } from 'react';

const ChatMessage = ({ text, isUser, delay }: { text: string; isUser: boolean; delay: number }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
        }`}
      >
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
    </motion.div>
  );
};

export default function AllMeetingsSection() {
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const resetTimer = setTimeout(() => {
      setResetKey(prev => prev + 1);
    }, 12000);

    return () => clearTimeout(resetTimer);
  }, [resetKey]);

  const messages = [
    { text: "Hva ble besluttet i møtet om Q2-strategi?", isUser: true, delay: 0 },
    { text: "I møtet ble det besluttet å fokusere på tre hovedområder: 1) Øke markedsandelen i Norden med 15%, 2) Lansere to nye produktfunksjoner innen juni, og 3) Styrke kundeservice-teamet med tre nye ansatte.", isUser: false, delay: 1200 },
    { text: "Hvem er ansvarlig for produktlanseringen?", isUser: true, delay: 3000 },
    { text: "Sarah Jensen er prosjektleder for produktlanseringen, med støtte fra tech-teamet ledet av Thomas Andersen.", isUser: false, delay: 4200 },
  ];

  return (
    <section className="py-20 page-container bg-gray-50">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold mb-6 leading-tight"
          >
            Fungerer for alle møter.
            <br className="mb-2" />
            <span className="block mt-3">
              <Highlight className="text-black">
                Digitalt og fysisk.
              </Highlight>
            </span>
          </motion.h2>
          <p className="text-gray-700 text-lg mb-8">
            Bruk Notably i møter, på nett eller fysisk. Fungerer sømløst på tvers av verktøyene dine.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2">
              <Mic className="w-4 h-4" />
              Lydbasert
            </span>
            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2">
              <Users className="w-4 h-4" />
              Fysiske møter
            </span>
            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Digitale møter
            </span>
          </div>
        </div>
        <div className="relative">
          <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl shadow-xl p-6 h-[500px] flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Notably AI</h3>
                <p className="text-xs text-gray-500">Spør om dine møter</p>
              </div>
            </div>

            <div key={resetKey} className="flex-1 overflow-y-auto space-y-3">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  text={message.text}
                  isUser={message.isUser}
                  delay={message.delay}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
