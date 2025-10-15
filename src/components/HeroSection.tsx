import { ShimmerButton } from './ShimmerButton';

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 md:pb-20 pb-14 page-container relative">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
          AI tar notater
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
            mens du fokuserer
          </span>
        </h1>

        <div className="text-xl md:text-2xl text-gray-600 space-y-1 mb-12">
          <p>Hvert <span className="text-blue-500">møte</span>, transkribert.</p>
          <p>Hver <span className="text-blue-500">oppgave</span>, delegert.</p>
          <p>Alltid, <span className="text-blue-500">automatisk</span>.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <a href="https://app.notably.no/no/sign-up" target="_blank" rel="noopener noreferrer">
            <ShimmerButton className="px-8 py-3.5 font-medium">
              <span className="whitespace-pre-wrap text-center font-medium leading-none tracking-tight text-white">
                Start gratis
              </span>
            </ShimmerButton>
          </a>
          <a
            href="https://calendly.com/vegardhaavik/demo-notably"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors font-medium"
          >
            Book en demo
          </a>
        </div>

        <p className="text-sm text-gray-500">
          Fungerer med Microsoft Teams og Google Meet
        </p>
      </div>
    </section>
  );
}
