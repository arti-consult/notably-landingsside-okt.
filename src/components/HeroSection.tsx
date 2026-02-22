import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="pt-24 sm:pt-32 md:pt-36 pb-14 md:pb-24 page-container relative overflow-hidden">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-blue-200/30 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -top-16 right-[-8rem] w-[22rem] h-[22rem] bg-indigo-200/35 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-[2rem] border border-blue-100/80 bg-white/90 px-5 sm:px-8 md:px-12 py-8 sm:py-10 md:py-12 shadow-[0_14px_42px_-28px_rgba(37,99,235,0.32)]">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.1),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(99,102,241,0.09),transparent_40%)]" />

          <div className="relative text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 mb-6">
              <CheckCircle2 className="w-4 h-4" />
              AI møteassistent for norske team
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-semibold tracking-tight text-slate-950 leading-[1.04]">
              Notably skriver{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                referatene dine
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-xl sm:text-2xl md:text-[2rem] md:leading-tight text-slate-700 font-medium">
              Sikrer alle viktige detaljer, helt automatisk.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://app.notably.no/no/sign-up"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-4 text-white font-semibold text-lg shadow-[0_16px_32px_-16px_rgba(37,99,235,0.8)] hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Start gratis prøveperiode
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="https://calendly.com/d/cxdp-xt7-q9z/notably-motereferat-med-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-7 py-4 text-slate-700 font-semibold text-lg hover:border-blue-300 hover:text-blue-700 transition-colors"
              >
                Book en demo
              </a>
            </div>

            <p className="mt-6 text-sm sm:text-base text-slate-500">
              Microsoft Teams, Zoom, Google Meet og fysisk
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
