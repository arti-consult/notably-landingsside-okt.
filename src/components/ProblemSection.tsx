const frictionPoints = [
  'Beslutninger blir spredd i tråder, notater og opptak.',
  'Oppgaver mangler tydelig eier etter møtet.',
  'Neste steg blir ikke samlet ett sted.',
];

const ProblemSection = () => {
  return (
    <section className="py-20 md:py-24 page-container bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
          <div>
            <p className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
              Utfordringen
            </p>

            <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
              Møtet skaper fart. Oppfølgingen mister retning.
            </h2>

            <p className="mt-5 max-w-2xl text-lg md:text-xl text-slate-600 leading-relaxed">
              Når beslutninger og ansvar ikke samles rett etter møtet, stopper gjennomføringen opp.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 sm:p-7">
            <p className="text-sm font-semibold text-slate-900">Der det vanligvis stopper opp</p>

            <ul className="mt-4 divide-y divide-slate-200">
              {frictionPoints.map((item) => (
                <li key={item} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-blue-600" />
                  <p className="text-slate-700 leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Konsekvens</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">70-80 %</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                av møtekontekst kan forsvinne i løpet av få timer uten en samlet oppsummering.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
