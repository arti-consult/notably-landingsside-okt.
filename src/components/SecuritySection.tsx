import { ShieldCheck, Lock, Globe, Server } from 'lucide-react';

export default function SecuritySection() {
  return (
    <section className="py-20 page-container bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Sikkerhet og personvern</h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">GDPR, EU/EØS‑dataresidens og sterk kryptering. Vi trener aldri på dine data.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">GDPR‑kompatibel</h3>
                <p className="text-gray-600">Transparente rutiner og full kontroll på egne data.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-start gap-3">
              <Lock className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Datakryptering</h3>
                <p className="text-gray-600">AES‑256 i ro, TLS i transitt. Lyd slettes etter prosessering.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-start gap-3">
              <Globe className="w-6 h-6 text-orange-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">EU/EØS‑dataresidens</h3>
                <p className="text-gray-600">All behandling og lagring i EU/EØS. Ingen modelltrening på kundedata.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-start gap-3">
              <Server className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">SOC 2‑sertifisert hosting</h3>
                <p className="text-gray-600">Sertifiserte plattformer med strenge kontroller og jevnlige revisjoner.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
