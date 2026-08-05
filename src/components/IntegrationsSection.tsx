import IntegrationsFlow from './IntegrationsFlow';

export default function IntegrationsSection() {
  return (
    <section className="py-20 page-container bg-white">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-950 mb-4">
          Sømløs integrering med dine favorittverktøy
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Notably kobler seg til møteplattformene dine og samler alt på ett sted — og virker
          like godt i fysiske møter, med opptak rett fra mobilen.
        </p>
      </div>
      <IntegrationsFlow />
    </section>
  );
}
