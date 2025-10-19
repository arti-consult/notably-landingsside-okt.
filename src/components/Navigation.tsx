import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShimmerButton } from './ShimmerButton';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="page-container py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/Notably logo icon.svg" alt="Notably" className="h-8" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/blog" className="text-gray-700 hover:text-black transition-colors">Blogg</Link>
            <a href="https://app.notably.no" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-black transition-colors">Logg inn</a>
            <a href="https://app.notably.no/no/sign-up" target="_blank" rel="noopener noreferrer">
              <ShimmerButton className="px-6 py-2 font-medium">
                <span className="whitespace-pre-wrap text-center font-medium leading-none tracking-tight text-white">
                  Start gratis
                </span>
              </ShimmerButton>
            </a>
          </div>

          <button
            className="md:hidden text-gray-700 hover:text-black transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-4 pt-4 pb-2">
                <Link to="/blog" className="text-gray-700 hover:text-black transition-colors">Blogg</Link>
                <a href="https://app.notably.no" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-black transition-colors">Logg inn</a>
                <a href="https://app.notably.no/no/sign-up" target="_blank" rel="noopener noreferrer">
                  <ShimmerButton className="px-6 py-2 font-medium">
                    <span className="whitespace-pre-wrap text-center font-medium leading-none tracking-tight text-white">
                      Start gratis
                    </span>
                  </ShimmerButton>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
