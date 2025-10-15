import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Sparkles, Building2, ArrowRight, CheckCircle2, Clock, Users, FileText, Shield, TrendingUp, Zap } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { ShimmerButton } from '../components/ShimmerButton';

export default function ByggReisDegNoSpace() {
  return (
    <>
      <Helmet>
        <title>Bygg Reis Deg 2025 - Eksklusivt tilbud - Notably</title>
        <meta name="description" content="Møt oss på Bygg Reis Deg 2025! Få 20% rabatt de første to månedene på Notably - AI-drevet møteassistanse for byggenæringen." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50/30 to-gray-50">
        <Navigation />

        {/* Hero Section */}
        <section className="relative pt-32 pb-12 px-6">
          <div className="max-w-5xl mx-auto text-center">
            {/* Event Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <img
                src="https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_sm,q_auto:good,w_746/d6tueucgrugw4q9rja38fl"
                alt="Bygg Reis Deg 2025"
                className="h-20 md:h-24 mx-auto object-contain"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              AI-møteassistanse for
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                byggenæringen
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto"
            >
              Spar tid, reduser risiko og hold teamet synkronisert med AI-drevet møteassistanse
            </motion.p>

            {/* CTA Pricing Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-8"
            >
              {/* Basic Plan */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 hover:border-blue-300 transition-all">
                <div className="text-left">
                  <h3 className="text-2xl font-bold mb-2">Basic</h3>
                  <p className="text-sm text-gray-600 mb-4">Perfekt for å komme i gang</p>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-5xl font-bold">299,-</span>
                    <span className="text-gray-600">kr</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">per bruker per måned</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Fysiske og digitale møter</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">20 timer per måned</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">20 assistentmeldinger per dag</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Ingen trening på dataen din</span>
                    </li>
                  </ul>
                  <a
                    href="https://app.notably.no/no/sign-up"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <button className="w-full py-3 px-6 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
                      Start gratis
                    </button>
                  </a>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-8 shadow-xl border-2 border-blue-500 relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-xs font-semibold text-white">MEST POPULÆR</span>
                </div>
                <div className="text-left text-white">
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <p className="text-sm text-blue-100 mb-4">For profesjonelle brukere</p>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-5xl font-bold">599,-</span>
                    <span className="text-blue-100">kr</span>
                  </div>
                  <p className="text-sm text-blue-100 mb-6">per bruker per måned</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" />
                      <span>Uendelig møter</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" />
                      <span>150 assistentmeldinger per dag</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" />
                      <span>Ingen trening på dataen din</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" />
                      <span>Prioritert support</span>
                    </li>
                  </ul>
                  <a
                    href="https://app.notably.no/no/sign-up"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <button className="w-full py-3 px-6 bg-white text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors">
                      Start gratis
                    </button>
                  </a>
                </div>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 hover:border-blue-300 transition-all">
                <div className="text-left">
                  <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                  <p className="text-sm text-gray-600 mb-4">For team med 20+ brukere</p>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-bold">Kontakt oss</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">&nbsp;</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Alt i Pro-planen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Volume-baserte rabatter</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Dedikert kundekontakt</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Ingen trening på dataen din</span>
                    </li>
                  </ul>
                  <a
                    href="https://calendly.com/vegardhaavik/demo-notably"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <button className="w-full py-3 px-6 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
                      Kontakt oss
                    </button>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Discount Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Bruk kode <span className="font-bold">BYGG2025</span> for 20% rabatt i 2 måneder</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-4 text-sm text-gray-600"
            >
              Inkludert 14 dagers gratis prøveperiode
            </motion.p>
          </div>
        </section>


        {/* Features Section - Construction Focus */}
        <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-6">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-600 font-medium">Skreddersydd for byggenæringen</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Hvorfor byggebransjen elsker Notably
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Vi forstår utfordringene i byggenæringen. Notably er designet for å håndtere komplekse prosjekter, teknisk terminologi og sikre oppfølging.
              </p>
            </motion.div>

            {/* Main Benefits Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[
                {
                  icon: Clock,
                  title: 'Spar 5+ timer i uken',
                  description: 'Automatiser møtereferat og oppfølging. La teamet fokusere på det som faktisk bygger prosjektet fremover.',
                  stat: '5t',
                  gradient: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: Shield,
                  title: 'Reduser risiko',
                  description: 'Dokumenter alle avgjørelser, ansvar og frister automatisk. Unngå misforståelser og konflikter.',
                  stat: '100%',
                  gradient: 'from-violet-500 to-purple-500'
                },
                {
                  icon: Users,
                  title: 'Synkroniser teamet',
                  description: 'Alle er på samme side med klare referat, delegerte oppgaver og sporbare beslutninger.',
                  stat: '∞',
                  gradient: 'from-emerald-500 to-teal-500'
                },
                {
                  icon: FileText,
                  title: 'Byggenærings-terminologi',
                  description: 'AI-en forstår RIB, RIF, SHA, HMS og annen fagterminologi brukt i norsk byggebransje.',
                  stat: 'AI',
                  gradient: 'from-orange-500 to-red-500'
                },
                {
                  icon: TrendingUp,
                  title: 'Bedre prosjektstyring',
                  description: 'Hold oversikt over framdrift, leveranser og milepæler på tvers av alle byggeprosjekter.',
                  stat: '↗',
                  gradient: 'from-pink-500 to-rose-500'
                },
                {
                  icon: Zap,
                  title: 'Raskere beslutninger',
                  description: 'Få umiddelbar tilgang til tidligere møter, beslutninger og diskusjoner via AI-søk.',
                  stat: '⚡',
                  gradient: 'from-yellow-500 to-amber-500'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.gradient} rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>

                  <div className="absolute top-8 right-8 text-4xl font-bold text-gray-100 group-hover:text-gray-200 transition-colors">
                    {feature.stat}
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mt-16 p-8 bg-blue-50 rounded-2xl border border-blue-100"
            >
              <p className="text-lg text-gray-700 italic mb-4">
                "Notably har revolusjonert hvordan vi håndterer byggemøter. Vi sparer timer hver uke og har full kontroll på alle prosjekter."
              </p>
              <p className="text-sm text-gray-600 font-medium">
                – Byggeleder, stor entreprenør
              </p>
            </motion.div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-blue-600 via-violet-600 to-purple-600 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Urgency Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
                <Clock className="w-5 h-5 text-yellow-300" />
                <span className="text-sm text-white font-semibold">Tilbudet utløper 31. oktober 2025</span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
                Eksklusivt messetilbud
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  20% rabatt i 2 måneder
                </span>
              </h2>

              <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                Kom i gang med Notably i dag og få 20% rabatt de første to månedene etter gratis prøveperiode
              </p>

              {/* Value Props */}
              <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-bold text-white mb-2">14 dager</div>
                  <div className="text-blue-100 text-sm">Gratis prøveperiode</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">20%</div>
                  <div className="text-blue-100 text-sm">Rabatt i 2 måneder</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-bold text-white mb-2">∞</div>
                  <div className="text-blue-100 text-sm">Ubegrenset møter</div>
                </div>
              </div>

              <a
                href="https://calendly.com/vegardhaavik/demo-notably"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <ShimmerButton className="px-12 py-6 font-medium text-xl shadow-2xl">
                  <span className="whitespace-pre-wrap text-center font-semibold leading-none tracking-tight text-white flex items-center gap-3">
                    Bestill demo og aktiver tilbud
                    <ArrowRight className="w-6 h-6" />
                  </span>
                </ShimmerButton>
              </a>

              <p className="mt-8 text-blue-100 text-sm">
                Bruk kode <span className="font-bold text-yellow-300 text-base">BYGG2025</span> ved oppstart
              </p>

              <div className="mt-12 flex items-center justify-center gap-8 text-blue-100 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-300" />
                  <span>Ingen binding</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-300" />
                  <span>Avbryt når som helst</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-300" />
                  <span>Norsk support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
