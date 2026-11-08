import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Calculator, HardHat, Scale } from 'lucide-react';
import { Label, Reveal, ease } from './shared';

const industries = [
  { to: '/advokat', icon: Scale, name: 'Advokater', text: 'Klientmøter dokumentert, klart for saken og timeføringen.' },
  { to: '/regnskapsforer', icon: Calculator, name: 'Regnskapsførere', text: 'Hvert kundemøte samlet, med råd gitt og hva kunden skal gjøre.' },
  { to: '/bygg-og-anlegg', icon: HardHat, name: 'Bygg og anlegg', text: 'Byggemøter og befaringer med hvem som gjør hva, og innen når.' },
];

/** Kundehistorien (Pharma Nordic) og veien videre til bransjesidene. */
export default function NfStory() {
  const reduced = useReducedMotion();
  return (
    <section data-ph-section="customer_story" className="px-5 pb-24 sm:px-8 sm:pb-36">
      <div className="mx-auto max-w-6xl">
        <motion.figure
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative grid overflow-hidden rounded-[2.25rem] bg-slate-950 text-white lg:grid-cols-[0.85fr_1.15fr]"
        >
          <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[34rem]">
            <motion.img
              src="/media/1762616775767.webp"
              alt="Bent Andreassen, CEO i Pharma Nordic"
              width={1900}
              height={1069}
              loading="lazy"
              decoding="async"
              variants={{ hidden: { scale: reduced ? 1 : 1.12 }, visible: { scale: 1, transition: { duration: 1.6, ease } } }}
              className="absolute inset-0 h-full w-full object-cover object-[66%_22%]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-950/30" />
          </div>
          <div className="relative flex flex-col justify-center p-7 sm:p-12">
            <Label dark>Kundehistorie</Label>
            <blockquote className="mt-7">
              <p className="text-balance text-[1.7rem] font-semibold leading-[1.2] tracking-[-0.02em] sm:text-[2.3rem]">
                «Notably gjør oss i stand til å bruke møtetiden smartere.{' '}
                <span className="text-slate-400">Vi slipper å bruke timer på manuell referatskriving.»</span>
              </p>
            </blockquote>
            <figcaption className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-white/10 pt-6">
              <div>
                <p className="font-semibold">Bent Andreassen</p>
                <p className="text-sm text-slate-400">CEO, Pharma Nordic</p>
              </div>
              <Link
                to="/artikler/pharma-nordic-notably-frigjor-tid-fra-forste-mote"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-blue-300 hover:text-white"
              >
                Les hele historien
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </figcaption>
          </div>
        </motion.figure>

        <div className="mt-24 sm:mt-32">
          <Reveal>
            <Label>Bransjer</Label>
            <h2 className="mt-6 max-w-2xl text-balance text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-slate-950 sm:text-[2.8rem]">
              Ulike møter, samme poeng: ingen skal måtte skrive referat.
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {industries.map(({ to, icon: Icon, name, text }, i) => (
              <Reveal as="li" key={to} delay={i * 0.08}>
                <Link
                  to={to}
                  className="group flex h-full flex-col rounded-[1.5rem] bg-white p-6 ring-1 ring-slate-900/[0.06] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-35px_rgba(11,15,25,0.45)]"
                >
                  <span className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F6F5F1]">
                      <Icon className="h-5 w-5 text-slate-800" aria-hidden />
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-slate-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-600" aria-hidden />
                  </span>
                  <span className="mt-8 text-xl font-semibold tracking-tight text-slate-950">{name}</span>
                  <span className="mt-1.5 text-[15px] leading-relaxed text-slate-600">{text}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
