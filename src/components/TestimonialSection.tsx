export default function TestimonialSection() {
  return (
    <section className="py-16 sm:py-20 page-container bg-gray-50">
      <div className="max-w-3xl mx-auto text-center">
        <div className="rounded-3xl border border-gray-200 bg-white/90 px-6 py-10 shadow-sm sm:px-10">
          <p className="text-xl font-semibold leading-relaxed text-gray-900 sm:text-2xl">
            "Notably gjør oss i stand til å bruke møtetiden smartere - vi slipper å bruke timer på manuell referatskriving"
          </p>
          <p className="mt-5 text-base font-medium text-gray-700 sm:text-lg">Bent Andreassen, CEO</p>
          <div className="mt-4 flex items-center justify-center">
            <img
              src="/Pharma%20Nordic%20logo.png"
              alt="Pharma Nordic logo"
              className="h-6 object-contain sm:h-7"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
