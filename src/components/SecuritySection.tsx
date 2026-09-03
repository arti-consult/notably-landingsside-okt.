import { ShieldCheck, Lock, Globe, Server } from 'lucide-react';

export default function SecuritySection() {
  return (
    <section className="py-20 page-container bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-950 mb-4">Sikkerhet og personvern</h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">GDPR, møteinnhold lagret i EU og strenge tilgangskontroller. Vi trener aldri på dine data.</p>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Kryptering og tilgangskontroll</h3>
                <p className="text-gray-600">TLS i transitt, strenge tilgangskontroller og skille mellom arbeidsområder.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-start gap-3">
              <Globe className="w-6 h-6 text-orange-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Møtedata lagret i EU</h3>
                <p className="text-gray-600">Transkripsjoner, notater og opptak lagres i Tyskland. Ingen modelltrening på kundedata.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-start gap-3">
              <Server className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Egen EU-drift</h3>
                <p className="text-gray-600">Vi drifter database, autentisering og lagring selv på Hetzner-infrastruktur i Tyskland.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
