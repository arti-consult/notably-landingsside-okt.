import { Typewriter } from './Typewriter';

const TypewriterSection = () => {
  return (
    <section className="py-20 page-container bg-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight flex flex-col items-center justify-start">
            <span className="text-gray-900">Gjør møtene dine om til </span>
            <span className="block mt-2 h-[6rem] md:h-[4.5rem] lg:h-[4rem] flex items-start justify-center">
              <Typewriter
                text={[
                  "klare beslutninger",
                  "konkrete neste steg",
                  "delbare oppsummeringer",
                  "automatiske referater",
                  "rask oppfølging",
                  "tydelig ansvar",
                  "et søkbart arkiv",
                  "sikret dokumentasjon",
                  "kunnskap som deles",
                ]}
                speed={70}
                className="text-blue-600"
                waitTime={1500}
                deleteSpeed={40}
                cursorChar={"_"}
              />
            </span>
          </h2>
        </div>
      </div>
    </section>
  );
};

export default TypewriterSection;
