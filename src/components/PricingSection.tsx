import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ShieldCheck, Headphones, X } from 'lucide-react';

interface PricingPlan {
  name: string;
  monthlyPrice: number | null;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

const PricingSection = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    if (!isContactModalOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsContactModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isContactModalOpen]);

  const plans: PricingPlan[] = [
    {
      name: 'Pro',
      monthlyPrice: 399,
      description: 'For profesjonelle brukere',
      features: [
        'Uendelig møter',
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
        'Skreddersydd onboarding',
        'SLA og tilpassede avtaler',
        'SSO',
        'Volume-baserte rabatter',
        'Dedikert kundekontakt',
        'Ingen trening på dataen din'
      ],
      cta: 'Kontakt oss'
    }
  ];

  return (
    <>
      <section id="pricing" className="py-20 page-container bg-gray-50 scroll-mt-24 md:scroll-mt-28">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Prisplaner for alle behov
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Velg planen som passer best for deg. Ingen skjulte kostnader.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, index) => {
              const price = plan.monthlyPrice;
              const priceInclVat = price !== null ? Math.round(price * 1.25) : null;
              const ctaClass = plan.name === 'Pro'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-900 text-white hover:bg-black';

              return (
                <div
                  key={index}
                  className={`bg-white rounded-3xl p-7 transition-all duration-300 flex flex-col relative ${
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

                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-5">{plan.description}</p>

                  <div className="mb-5">
                    {price !== null ? (
                      <>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[2.55rem] font-bold">{price},-</span>
                        </div>
                        <p className="text-gray-600 mt-2">
                          per bruker per måned
                        </p>
                        {plan.name === 'Pro' && priceInclVat !== null && (
                          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {priceInclVat},- inkl. MVA (25%)
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-3xl font-bold">Kontakt oss</div>
                    )}
                  </div>

                  <div className="flex-grow">
                    <div className="space-y-3 mb-7">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-blue-600" />
                          </div>
                          <span className="text-gray-700 text-sm leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {plan.name === 'Enterprise' ? (
                    <button
                      type="button"
                      onClick={() => setIsContactModalOpen(true)}
                      className={`w-full py-3 rounded-full font-medium transition-all duration-300 mt-auto block text-center ${ctaClass}`}
                    >
                      {plan.cta}
                    </button>
                  ) : (
                    <a
                      href="https://app.notably.no/no/sign-up"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-3 rounded-full font-medium transition-all duration-300 mt-auto block text-center ${ctaClass}`}
                    >
                      {plan.cta}
                    </a>
                  )}
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

      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] p-4 sm:p-6 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="enterprise-contact-title"
          >
            <button
              type="button"
              aria-label="Lukk kontaktvindu"
              onClick={() => setIsContactModalOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="relative w-full max-w-md rounded-2xl bg-white p-5 sm:p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h3 id="enterprise-contact-title" className="text-xl sm:text-2xl font-bold text-gray-900">
                    Kontakt Enterprise
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Ta kontakt for tilbud og oppsett.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
                  aria-label="Lukk"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-sm sm:text-base">
                <p className="text-gray-700">
                  <span className="font-semibold text-gray-900">Kontaktperson:</span> Jørgen Helmers-Olsen
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold text-gray-900">E-post:</span>{' '}
                  <a href="mailto:jorgen@notably.no" className="text-blue-600 hover:text-blue-700 hover:underline">
                    jorgen@notably.no
                  </a>
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold text-gray-900">Telefon:</span>{' '}
                  <a href="tel:+4791826351" className="text-blue-600 hover:text-blue-700 hover:underline">
                    +47 918 26 351
                  </a>
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold text-gray-900">Selskap:</span> ARTI Consult AS
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PricingSection;
