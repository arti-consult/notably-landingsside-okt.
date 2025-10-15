import { Plus, Mic, ArrowUp } from 'lucide-react';

const questions = [
  { text: 'Hva var hovedpunktene fra forrige møte?', featured: false },
  { text: 'Hvem er den beste kandidaten fra intervjuene denne uken?', featured: false },
  { text: 'Hva skjer på markedsføringsfronten?', featured: false },
  { text: 'Hva har vært hovedtemaene den siste uken?', featured: true },
];

export default function AIAnswersSection() {
  return (
    <section className="py-20 page-container bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-6">
            Få nyttige <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">svar</span>
            <br />
            fra alle dine møter
          </h2>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto">
            Still hvilket som helst spørsmål på tvers av alle dine tidligere møter og la Notably finne svarene du
            leter etter umiddelbart. Trygt hostet i Europa.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8 max-w-3xl mx-auto">
          <div className="space-y-2 mb-4">
            {questions.map((question, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0 mt-0.5 group-hover:bg-gray-300 transition-colors"></div>
                <p className={`text-sm ${question.featured ? 'text-gray-700 font-medium' : 'text-gray-600'}`}>
                  {question.text}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center flex-shrink-0">
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Spør Notably AI..."
                  className="w-full text-gray-400 text-base bg-transparent outline-none"
                  disabled
                />
              </div>
              <button className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center flex-shrink-0">
                <Mic className="w-4 h-4 text-gray-600" />
              </button>
              <button className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center flex-shrink-0">
                <ArrowUp className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
