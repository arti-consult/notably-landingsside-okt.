import { Clock3, FileQuestion, ListChecks, Search } from 'lucide-react';

const frictionPoints = [
  {
    icon: Search,
    label: 'Beslutninger blir liggende i tråder, notater og opptak.',
  },
  {
    icon: FileQuestion,
    label: 'Uklart ansvar gjør at oppgaver stopper opp.',
  },
  {
    icon: ListChecks,
    label: 'Ingen samlet oversikt over neste steg for teamet.',
  },
];

const ProblemSection = () => {
  return (
    <section className="py-20 md:py-24 page-container bg-gradient-to-b from-white via-slate-50/40 to-white">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-7 sm:p-10 md:p-12 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.35)]">
          <p className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide uppercase">
            Utfordringen
          </p>

          <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
            Møtet skaper fart. Etterpå forsvinner momentum.
          </h2>

          <p className="mt-5 text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl">
            Team bruker for mye tid på å lete etter hva som faktisk ble besluttet. Resultatet er tregere oppfølging,
            usikkerhet og lavere gjennomføringsevne.
          </p>

          <div className="mt-8 space-y-3">
            {frictionPoints.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-white border border-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed">{item.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/70 px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2 text-blue-700 font-semibold">
              <Clock3 className="w-4 h-4" />
              50 timer i møter hver måned
            </div>
            <p className="text-slate-700">
              Uten strukturert dokumentasjon forsvinner opptil <span className="font-semibold">70-80 %</span> av konteksten få timer senere.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
