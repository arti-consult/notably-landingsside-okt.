import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function FeaturesGrid() {
  return (
    <section className="py-20 page-container bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:row-span-2 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-[32px] p-8 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-3xl font-bold mb-8 leading-tight">Del møtenotater<br />med ett klikk</h3>
            <div className="relative mx-auto" style={{ maxWidth: '280px' }}>
              <div className="bg-gray-900 rounded-[40px] p-3 shadow-2xl border-8 border-gray-800">
                <div className="bg-black rounded-[32px] overflow-hidden">
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </button>
                        <button className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                          <div className="flex gap-0.5">
                            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                          </div>
                        </button>
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/30">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Del
                      </button>
                    </div>
                    <div className="bg-gray-900 rounded-2xl px-4 py-3 border border-gray-800">
                      <div className="text-gray-500 text-xs">Styremøte</div>
                    </div>
                    <div className="h-32 bg-gray-900 rounded-2xl border border-gray-800 p-3 space-y-2">
                      <div className="h-2 bg-gray-700 rounded-full w-full"></div>
                      <div className="h-2 bg-gray-700 rounded-full w-full"></div>
                      <div className="h-2 bg-gray-700 rounded-full w-4/5"></div>
                      <div className="h-2 bg-gray-700 rounded-full w-full"></div>
                      <div className="h-2 bg-gray-700 rounded-full w-full"></div>
                      <div className="h-2 bg-gray-700 rounded-full w-3/4"></div>
                    </div>
                    <div className="h-24 bg-gray-900 rounded-2xl border border-gray-800 p-3 space-y-2">
                      <div className="h-2 bg-gray-700 rounded-full w-full"></div>
                      <div className="h-2 bg-gray-700 rounded-full w-full"></div>
                      <div className="h-2 bg-gray-700 rounded-full w-2/3"></div>
                      <div className="h-2 bg-gray-700 rounded-full w-full"></div>
                    </div>
                    <div className="flex gap-2">
                      <button className="w-10 h-10 bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                      </button>
                      <button className="w-10 h-10 bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-[32px] p-8 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-3xl font-bold mb-8 leading-tight">Påminnelser som gir kontroll</h3>
            <div className="relative">
              <div className="bg-gray-900 rounded-[28px] p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-4 left-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="text-center pt-8 pb-4">
                  <div className="text-white text-2xl font-bold mb-3">Product kickoff</div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-orange-500 font-semibold text-lg">in 3m</span>
                    <span className="text-gray-600">·</span>
                    <span className="text-gray-400 text-lg">10:30-11 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-50 rounded-[32px] p-8 hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            <h3 className="text-3xl font-bold mb-auto leading-tight">Hostet i<br />Europa</h3>
            <div className="flex items-center justify-end mt-6">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-blue-700 rounded-[32px] flex items-center justify-center relative overflow-hidden shadow-2xl">
                <img
                  src="https://qelklrrxciwomrwunzjo.supabase.co/storage/v1/object/public/admin-images/1759703485126.png"
                  alt="EU-flagg"
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-[32px] p-8 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-3xl font-bold mb-8 leading-tight">Tilpassede<br />notatmaler</h3>
            <div className="bg-gray-900 rounded-[24px] p-5 relative shadow-2xl">
              <div className="bg-gray-800 rounded-2xl px-4 py-3 mb-3">
                <div className="flex items-center gap-3 text-white text-sm">
                  <button className="text-gray-400 text-xs flex items-center gap-1">
                    Brødtekst
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="flex gap-1">
                    <button className="w-7 h-7 hover:bg-gray-700 rounded-lg flex items-center justify-center font-bold text-sm transition-colors">B</button>
                    <button className="w-7 h-7 hover:bg-gray-700 rounded-lg flex items-center justify-center italic text-sm transition-colors">I</button>
                    <button className="w-7 h-7 hover:bg-gray-700 rounded-lg flex items-center justify-center text-sm transition-colors"><span className="underline">U</span></button>
                    <button className="w-7 h-7 hover:bg-gray-700 rounded-lg flex items-center justify-center text-sm transition-colors line-through">S</button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="bg-gray-800/60 rounded-xl px-3 py-2.5">
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="text-gray-500">✦</span>
                    <span>Møtetittel</span>
                  </div>
                </div>
                <div className="bg-gray-800/60 rounded-xl px-3 py-2.5">
                  <div className="text-white/70 text-sm mb-1.5">Tagger:</div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">✦</span>
                    <span className="text-white/70 text-sm">Tagger</span>
                  </div>
                </div>
                <div className="bg-gray-800/60 rounded-xl px-3 py-2.5">
                  <div className="text-white/70 text-sm">Hovedpunkter:</div>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 group">
                <div className="relative">
                  <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl text-sm font-semibold shadow-2xl shadow-blue-500/40 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Liste med hovedpunkter
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3">
                    <svg viewBox="0 0 24 24" fill="white" className="drop-shadow-lg">
                      <path d="M12 0L15 9L24 12L15 15L12 24L9 15L0 12L9 9L12 0Z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
            className="bg-gradient-to-br from-emerald-50 to-white rounded-[32px] p-8 hover:shadow-xl transition-all duration-300 flex flex-col border border-emerald-100"
          >
            <h3 className="text-3xl font-bold mb-auto leading-tight">GDPR-<br />kompatibel</h3>
            <div className="flex items-center justify-end mt-6">
              <div className="relative">
                <Shield className="w-36 h-36 text-emerald-500 stroke-[2] drop-shadow-lg" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="lg:row-span-2 rounded-[32px] overflow-hidden hover:shadow-xl transition-all duration-300 relative"
          >
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Languages"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10"></div>
            </div>
            <div className="relative z-10 p-8 h-full flex flex-col justify-end">
              <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-2xl leading-tight">Støtter over<br />100 språk</h3>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
            className="lg:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-[32px] p-8 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-3xl font-bold mb-8 leading-tight">AI gjenkjenner<br />hvem som snakker</h3>
            <div className="bg-gray-900 rounded-[24px] p-6 flex items-center justify-center shadow-2xl min-h-[200px]">
              <div className="flex items-center gap-4 w-full max-w-2xl justify-center">
                <div className="flex-1 max-w-[180px]">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-4 space-y-3 border-2 border-blue-400">
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-white text-sm font-semibold mb-1">Speaker 1</div>
                      <div className="text-blue-200 text-xs">Ole Hansen</div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 max-w-[180px]">
                  <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-4 space-y-3 border-2 border-purple-400">
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-white text-sm font-semibold mb-1">Speaker 2</div>
                      <div className="text-purple-200 text-xs">Anna Berg</div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 max-w-[180px]">
                  <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-4 space-y-3 border-2 border-green-400">
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-white text-sm font-semibold mb-1">Speaker 3</div>
                      <div className="text-green-200 text-xs">Kari Larsen</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="bg-slate-900 rounded-[32px] p-8 hover:shadow-xl transition-all duration-300 text-white flex flex-col relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-auto leading-tight">Still spørsmål<br />på tvers av<br />alle møter</h3>
              <div className="flex items-end justify-end mt-8">
                <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
                  <div className="text-right space-y-1 max-w-xs">
                    <div className="text-sm text-white/90 leading-relaxed">
                      Hva ble bestemt i <span className="text-blue-400 font-medium">budsjettmøtet</span>
                    </div>
                    <div className="text-sm text-white/90 leading-relaxed">
                      forrige uke?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
