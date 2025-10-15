import { Clock, FileQuestion, Brain, AlertCircle } from 'lucide-react';

const ProblemSection = () => {
  const problems = [
    {
      icon: Clock,
      title: 'Mister verdifulle detaljer',
    },
    {
      icon: FileQuestion,
      title: 'Notatskriving stjeler fokus',
    },
    {
      icon: Brain,
      title: 'Ingen sentral kunnskapsbank',
    },
    {
      icon: AlertCircle,
      title: 'Oppgaver faller mellom stolene',
    }
  ];

  return (
    <section className="py-20 page-container bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Hvor mye tid bruker du på å lete etter informasjon fra møter?
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            De fleste har samme utfordringer med møtedokumentasjon.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors text-center"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Icon className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 leading-snug">
                  {problem.title}
                </h3>
              </div>
            );
          })}
        </div>

        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xl text-gray-700 leading-relaxed">
            Norske arbeidere bruker i snitt <span className="font-bold text-blue-600">50 timer per måned</span> i møter, og rapporterer om at man mister <span className="font-bold text-blue-600">70–80 %</span> av de konkrete detaljene fra et møte i løpet av timer etter fullført møte.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
