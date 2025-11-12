import { ShieldCheck, Lock, Globe, Server } from 'lucide-react';

export default function SecuritySection() {
  return (
    <section className="py-20 page-container bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Sikkerhet og personvern du kan stole på
          </h2>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto">
            Bygd for norske virksomheter: GDPR-kompatibel, EU/EØS-dataresidens og sterk kryptering
            i transitt og i ro. Vi trener aldri modellene våre på dine data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">GDPR-kompatibel</h3>
                <p className="text-gray-600">
                  Vi følger GDPR med transparente databehandlingsrutiner. Vi samler kun inn det som er nødvendig
                  og gir deg full kontroll over egne data.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Datakryptering</h3>
                <p className="text-gray-600">
                  All data er kryptert i ro (AES-256) og under overføring (TLS). Lydopptak behandles sikkert
                  og slettes etter ferdig prosessering.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">EU/EØS dataresidens</h3>
                <p className="text-gray-600">
                  All møte- og transkripsjonsdata lagres og behandles utelukkende innenfor EU/EØS. Vi bruker ikke
                  møtedata til å trene AI-modeller.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center">
                <Server className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">SOC 2-sertifisert hosting</h3>
                <p className="text-gray-600">
                  Infrastruktur på SOC 2-sertifiserte plattformer med strenge kontroller for sikkerhet, tilgjengelighet og
                  konfidensialitet. Regelmessig revidert av uavhengige tredjeparter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

