import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LOGIN_URL, Logo, SIGNUP_URL } from './shared';

const links = [
  { href: '#slik-virker-det', label: 'Slik virker det' },
  { href: '#sikkerhet', label: 'Sikkerhet' },
  { href: '#priser', label: 'Priser' },
];

/**
 * Flytende meny. Gjennomsiktig over heroen, og blir en avrundet pille med hvit
 * flate når man har scrollet litt. Ingen backdrop-blur på mobil (koster for
 * mye per scrollframe der).
 */
export default function NfNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        aria-label="Hovedmeny"
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full py-2 pl-5 pr-2 transition-all duration-500 ${
          scrolled || open
            ? 'bg-white/95 shadow-[0_10px_40px_-20px_rgba(11,15,25,0.35)] ring-1 ring-slate-900/5 md:bg-white/80 md:backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <Link to="/ny-forside" aria-label="Notably" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Logo className="h-[22px] w-auto sm:h-6" />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-[15px] text-slate-600 transition-colors hover:bg-slate-900/5 hover:text-slate-950"
            >
              {label}
            </a>
          ))}
          <a
            href={LOGIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-4 py-2 text-[15px] text-slate-600 transition-colors hover:bg-slate-900/5 hover:text-slate-950"
          >
            Logg inn
          </a>
          <a
            data-trial-cta="navigation-desktop"
            href={SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 rounded-full bg-slate-950 px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-blue-600"
          >
            Prøv gratis
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Lukk meny' : 'Åpne meny'}
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-800 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-3xl bg-white p-3 shadow-[0_20px_50px_-25px_rgba(11,15,25,0.4)] ring-1 ring-slate-900/5 md:hidden">
          {links.map(({ href, label }) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-lg text-slate-800">
              {label}
            </a>
          ))}
          <a href={LOGIN_URL} target="_blank" rel="noopener noreferrer" className="block rounded-2xl px-4 py-3 text-lg text-slate-800">
            Logg inn
          </a>
          <a
            data-trial-cta="navigation-mobile"
            href={SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block rounded-2xl bg-blue-600 px-4 py-3.5 text-center text-lg font-semibold text-white"
          >
            Prøv gratis i 14 dager
          </a>
        </div>
      )}
    </header>
  );
}
