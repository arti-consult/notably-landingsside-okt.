import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShimmerButton } from './ShimmerButton';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false);

    if (location.pathname === '/') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePricingClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false);

    if (location.pathname === '/') {
      event.preventDefault();
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    event.preventDefault();
    navigate('/', { state: { scrollTo: 'pricing' } });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="page-container py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              onClick={handleLogoClick}
              aria-label="Gå til forsiden"
              className="flex items-center cursor-pointer"
            >
              <img src="https://qelklrrxciwomrwunzjo.supabase.co/storage/v1/object/public/admin-images/1760975960292.png" alt="Notably" className="h-8" />
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/artikler" className="text-gray-700 hover:text-black transition-colors">Artikler</Link>
              <a href="/#pricing" onClick={handlePricingClick} className="text-gray-700 hover:text-black transition-colors">Priser</a>
              <a href="https://app.notably.no" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-black transition-colors">Logg inn</a>
              <a href="https://app.notably.no/no/sign-up" target="_blank" rel="noopener noreferrer">
                <ShimmerButton background="#2663eb" className="px-6 py-2 font-medium">
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
                  <Link to="/artikler" className="text-gray-700 hover:text-black transition-colors">Artikler</Link>
                  <a href="/#pricing" onClick={handlePricingClick} className="text-gray-700 hover:text-black transition-colors">Priser</a>
                  <a href="https://app.notably.no" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-black transition-colors">Logg inn</a>
                  <a href="https://app.notably.no/no/sign-up" target="_blank" rel="noopener noreferrer">
                    <ShimmerButton background="#2663eb" className="px-6 py-2 font-medium">
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
      </div>
    </nav>
  );
}
