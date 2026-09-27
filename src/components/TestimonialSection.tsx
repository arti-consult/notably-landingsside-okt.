import { Link } from 'react-router-dom';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const STORAGE = 'https://qelklrrxciwomrwunzjo.supabase.co/storage/v1/object/public/admin-images';

/**
 * Bildet og logoen hentes direkte i stedet for via artikkelen i databasen – da
 * vises kortet likt overalt, også der Supabase ikke er satt opp.
 */
const PHOTO_URL = `${STORAGE}/1762616775767.webp`;
const LOGO_URL = `${STORAGE}/1771237686841.svg`;
const CASE_URL = '/artikler/pharma-nordic-notably-frigjor-tid-fra-forste-mote';

const ease = [0.22, 1, 0.36, 1] as const;

export default function TestimonialSection() {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = (delay: number): Variants => ({
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease } },
  });

  return (
    <section className="page-container bg-white py-16 sm:py-24">
      <motion.figure
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] bg-slate-50 ring-1 ring-inset ring-slate-200/70 lg:grid-cols-[0.8fr_1.2fr]"
      >
        {/* Portrettet. Ansiktet sitter til høyre i originalen, så utsnittet
            holdes der både i bredt (mobil) og høyt (desktop) format. */}
        <div className="relative aspect-[5/4] overflow-hidden sm:aspect-[16/10] lg:aspect-auto lg:min-h-[28rem]">
          <motion.img
            src={PHOTO_URL}
            alt="Bent Andreassen, CEO i Pharma Nordic"
            width={1900}
            height={1069}
            loading="lazy"
            decoding="async"
            variants={{
              hidden: { scale: prefersReducedMotion ? 1 : 1.08 },
              visible: { scale: 1, transition: { duration: 1.4, ease } },
            }}
            className="absolute inset-0 h-full w-full object-cover object-[66%_22%]"
          />
        </div>

        {/* Sitatet */}
        <div className="flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-10">
          <motion.svg
            variants={fadeUp(0.15)}
            viewBox="0 0 32 24"
            aria-hidden
            className="h-6 w-8 text-blue-600 sm:h-7 sm:w-9"
          >
            <path
              fill="currentColor"
              d="M0 24V14.4C0 6.4 4.3 1.6 11.2 0l1.6 3.2C8.9 4.6 7 7.4 6.7 11.2H12V24H0Zm19.2 0V14.4c0-8 4.3-12.8 11.2-14.4L32 3.2c-3.9 1.4-5.8 4.2-6.1 8H31.2V24H19.2Z"
            />
          </motion.svg>

          <motion.blockquote variants={fadeUp(0.25)} className="mt-6">
            <p className="text-balance text-[1.5rem] font-semibold leading-[1.3] tracking-tight text-slate-800 sm:text-[1.9rem] lg:text-[1.65rem] xl:text-[1.8rem]">
              Notably gjør oss i stand til å bruke møtetiden smartere –{' '}
              <span className="text-slate-500">
                vi slipper å bruke timer på manuell referatskriving.
              </span>
            </p>
          </motion.blockquote>

          <motion.figcaption
            variants={fadeUp(0.4)}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4 border-t border-slate-200 pt-6"
          >
            <div className="mr-auto">
              <p className="font-semibold text-slate-900">Bent Andreassen</p>
              <p className="text-sm text-slate-500">CEO, Pharma Nordic</p>
            </div>
            <img
              src={LOGO_URL}
              alt="Pharma Nordic"
              width={650}
              height={76}
              loading="lazy"
              decoding="async"
              className="h-5 w-auto sm:h-6"
            />
          </motion.figcaption>

          <motion.div variants={fadeUp(0.5)} className="mt-6">
            <Link
              to={CASE_URL}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Les hele caset
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </motion.div>
        </div>
      </motion.figure>
    </section>
  );
}
