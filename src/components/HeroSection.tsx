import { ShimmerButton } from './ShimmerButton';

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 md:pb-20 pb-14 page-container relative">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-tight mb-8">
          <span className="font-semibold">
            Møtereferater med{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
              AI
            </span>
            .
          </span>
          <span className="block mt-2 text-3xl md:text-4xl lg:text-5xl font-normal">
            5 timer spart hver uke.
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-12">
          Notably skriver møtereferater for deg, og sikrer alle viktige detaljer helt automatisk.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 mb-6">
          <a href="https://app.notably.no/no/sign-up" target="_blank" rel="noopener noreferrer">
            <ShimmerButton background="#2663eb" className="px-8 py-3.5 font-medium">
              <span className="whitespace-pre-wrap text-center font-medium leading-none tracking-tight text-white">
                Start gratis prøveperiode
              </span>
            </ShimmerButton>
          </a>
          <a
            href="https://calendly.com/d/cxdp-xt7-q9z/notably-motereferat-med-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 font-medium hover:text-blue-600 hover:underline"
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
