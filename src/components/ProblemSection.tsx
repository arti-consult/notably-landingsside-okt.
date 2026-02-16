import { Clock, FileQuestion, Brain, AlertCircle } from 'lucide-react';

const ProblemSection = () => {
  const problems = [
    {
      icon: Clock,
      title: 'Viktige detaljer glipper',
      description: 'Beslutninger og avklaringer blir fort borte uten strukturert oppsummering.',
    },
    {
      icon: FileQuestion,
      title: 'Notatskriving stjeler fokus',
      description: 'Deltakere skriver mens møtet pågår, i stedet for å lytte og bidra aktivt.',
    },
    {
      icon: Brain,
      title: 'Ingen samlet kunnskapsbank',
      description: 'Innsikt havner i flere verktøy, tråder og private notater.',
    },
    {
      icon: AlertCircle,
      title: 'Oppgaver faller mellom stolene',
      description: 'Ansvar, frister og oppfølging blir uklare etter at møtet er ferdig.',
    },
  ];

  return (
    <section className="py-20 page-container bg-gradient-to-b from-white via-slate-50/60 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-8 sm:p-10 lg:p-12">
              <p className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-4">
                Utfordringen
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-5">
                Etter møtet starter letingen etter beslutninger, oppgaver og neste steg.
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                Når møteinformasjon er spredt, går tiden til å lete i notater, chat og opptak i stedet for å skape fremdrift.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5">
                  <p className="text-xs font-semibold tracking-wide text-blue-700 uppercase mb-2">
                    Møtetid hver måned
                  </p>
                  <p className="text-4xl font-bold text-gray-900">50 timer</p>
                  <p className="text-sm text-gray-600 mt-2">I snitt for norske arbeidstakere.</p>
                </div>
                <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5">
                  <p className="text-xs font-semibold tracking-wide text-blue-700 uppercase mb-2">
                    Detaljer som forsvinner
                  </p>
                  <p className="text-4xl font-bold text-gray-900">70-80 %</p>
                  <p className="text-sm text-gray-600 mt-2">I løpet av få timer uten god dokumentasjon.</p>
                </div>
              </div>
            </div>

            <div className="p-8 sm:p-10 lg:p-12 bg-slate-50/70 border-t lg:border-t-0 lg:border-l border-gray-200">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                Flaskehalser de fleste team kjenner igjen
              </h3>
              <div className="space-y-4">
                {problems.map((problem, index) => {
                  const Icon = problem.icon;
                  return (
                    <div
                      key={index}
                      className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-gray-900 mb-1">
                            {problem.title}
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {problem.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
