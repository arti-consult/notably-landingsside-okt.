const companies = [
  'Obligo',
  'Orkla',
  'Skytale',
  'Politiet',
  'Nordic Corporate Bank',
  'Pareto',
  'Posten',
  'Kobben',
  'Holger Hartmann',
  'Egset Ventilasjon',
];

export default function TrustSection() {
  return (
    <section className="py-12 bg-gray-100 overflow-hidden">
      <div className="page-container">
        <p className="text-center text-gray-600 mb-8">Gjør møter produktive hos</p>
        <div className="relative">
          <div className="flex animate-scroll">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center gap-16 px-8">
                {companies.map((company, i) => (
                  <span key={i} className="font-bold text-xl text-gray-800 whitespace-nowrap">
                    {company}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
