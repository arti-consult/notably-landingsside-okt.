import IntegrationsFlow from './IntegrationsFlow';

export default function IntegrationsSection() {
  return (
    <section className="py-20 page-container bg-white">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Sømløs integrering med dine favorittverktøy
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Notably kobler seg til alle dine møteplattformer og samler alt på ett sted
        </p>
      </div>
      <IntegrationsFlow />
    </section>
  );
}
