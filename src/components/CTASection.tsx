import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { BackgroundBeamsWithCollision } from './BackgroundBeamsWithCollision';

export default function CTASection() {
  return (
    <BackgroundBeamsWithCollision>
      <div className="max-w-4xl mx-auto text-center z-10 relative px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm text-white font-medium">Klar til å komme i gang?</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            Start gratis prøveperiode
          </h2>

          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Kom i gang på få minutter. Ingen kredittkort nødvendig.
          </p>

          <div className="mt-2">
            <a
              href="https://app.notably.no/no/sign-up"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-all shadow-xl"
            >
              Start gratis
            </a>
          </div>
        </motion.div>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
