import { useState } from 'react';
import { Check, Users, Mic, MessageSquare, ShieldCheck, Headphones, TrendingDown } from 'lucide-react';

interface PricingPlan {
  name: string;
  monthlyPrice: number | null;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans: PricingPlan[] = [
    {
      name: 'Pro',
      monthlyPrice: 399,
      description: 'For profesjonelle brukere',
      features: [
        'Uendelig møter',
        '200 assistentmeldinger hver dag',
        'Ingen trening på dataen din',
        'Prioritert support'
      ],
      highlighted: true,
      cta: 'Start gratis'
    },
    {
      name: 'Enterprise',
      monthlyPrice: null,
      description: 'For team med 20+ brukere',
      features: [
        'Alt i Pro-planen',
        'Volume-baserte rabatter',
        'Dedikert kundekontakt',
        'Ingen trening på dataen din'
      ],
      cta: 'Kontakt oss'
    }
  ];

  const calculatePrice = (monthlyPrice: number | null) => {
    if (monthlyPrice === null) return null;
    if (isAnnual) {
      return Math.round(monthlyPrice * 0.85);
    }
    return monthlyPrice;
  };

  const calculateAnnualSavings = (monthlyPrice: number | null) => {
    if (monthlyPrice === null) return null;
    return Math.round((monthlyPrice - (monthlyPrice * 0.85)) * 12);
  };

  return (
    <section className="py-20 page-container bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Prisplaner for alle behov
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Velg planen som passer best for deg. Ingen skjulte kostnader.
          </p>

          <div className="inline-flex items-center gap-2 bg-white rounded-full p-1 shadow-md text-sm">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 rounded-full font-medium transition-all duration-300 ${
                !isAnnual
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Månedlig
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 rounded-full font-medium transition-all duration-300 flex items-center gap-1.5 ${
                isAnnual
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Årlig
              <span className="px-1.5 py-0.5 bg-green-500 text-white text-xs rounded-full">
                Spart 15%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const price = calculatePrice(plan.monthlyPrice);
            const savings = calculateAnnualSavings(plan.monthlyPrice);
            const priceInclVat = price !== null ? Math.round(price * 1.25) : null;

            return (
              <div
                key={index}
                className={`bg-white rounded-3xl p-8 transition-all duration-300 flex flex-col relative ${
                  plan.highlighted
                    ? 'ring-2 ring-blue-600 shadow-xl scale-105'
                    : 'shadow-lg hover:shadow-xl'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 right-6 px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                    Mest populær
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="mb-6">
                  {price !== null ? (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold">{price},-</span>
                      </div>
                      <p className="text-gray-600 mt-2">
                        per bruker per måned
                      </p>
                      {plan.name === 'Pro' && priceInclVat !== null && (
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {priceInclVat},- inkl. MVA (25%)
                        </div>
                      )}
                      {isAnnual && savings && (
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm">
                          <TrendingDown className="w-4 h-4" />
                          Spar {savings},- kr årlig
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-3xl font-bold">Kontakt oss</div>
                  )}
                </div>

                <div className="flex-grow">
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={plan.name === 'Enterprise' ? '#' : 'https://app.notably.no/no/sign-up'}
                  target={plan.name === 'Enterprise' ? undefined : '_blank'}
                  rel={plan.name === 'Enterprise' ? undefined : 'noopener noreferrer'}
                  className={`w-full py-3.5 rounded-full font-medium transition-all duration-300 mt-auto block text-center ${
                    plan.highlighted
                      ? 'bg-black text-white hover:bg-gray-900'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            Alle planer inkluderer 14 dagers gratis prøveperiode
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>GDPR-kompatibel</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-5 h-5">
                <div className="absolute inset-0 bg-blue-600 rounded-full"></div>
                <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angle = (i * 30 * Math.PI) / 180;
                    const x = 12 + 7 * Math.sin(angle);
                    const y = 12 - 7 * Math.cos(angle);
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="1.2"
                        fill="#FCD34D"
                      />
                    );
                  })}
                </svg>
              </div>
              <span>Hostet i Europa</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-blue-600" />
              <span>Norsk support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
