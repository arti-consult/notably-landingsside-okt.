import type { MouseEvent, ReactNode } from 'react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { openPrivacyChoices } from '../lib/consent';
import { requestScrollToSection } from '../lib/scrollToSection';

const socialLinks = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/notably-no/about/', icon: Linkedin },
  { name: 'Instagram', href: 'https://www.instagram.com/notably_ai', icon: Instagram },
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61581862197291', icon: Facebook },
];

const linkClass =
  'text-[15px] text-slate-600 transition-colors hover:text-slate-900 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';

const External = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
    {children}
  </a>
);

const Column = ({ title, children }: { title: string; children: ReactNode }) => (
  <div>
    <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{title}</h2>
    <ul className="mt-4 space-y-3">{children}</ul>
  </div>
);

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  // Seksjonslenker scroller på forsiden, og navigerer dit fra andre sider –
  // samme oppførsel som «Priser» i menyen.
  const goToSection = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (location.pathname === '/') {
      requestScrollToSection(id);
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
  };

  return (
    <footer className="border-t border-slate-200 bg-white page-container">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.3fr_2fr] lg:gap-16">
          {/* Merkevaren */}
          <div>
            <Link to="/" aria-label="Notably – til forsiden" className="inline-block">
              <img
                src="https://qelklrrxciwomrwunzjo.supabase.co/storage/v1/object/public/admin-images/1760975960292.png"
                alt="Notably"
                width={168}
                height={32}
                decoding="async"
                className="h-7 w-auto"
              />
            </Link>
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-slate-600">
              Norskutviklet AI-agent som automatisk lager møtereferat fra dine digitale og fysiske
              møter.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {/* Lenkene */}
          <nav aria-label="Bunntekst" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            <Column title="Produkt">
              <li>
                <a href="/#pricing" onClick={goToSection('pricing')} className={linkClass}>
                  Priser
                </a>
              </li>
              <li>
                <a href="/#mobilapp" onClick={goToSection('mobilapp')} className={linkClass}>
                  Mobilapp
                </a>
              </li>
              <li>
                <External href="https://app.notably.no/no/sign-up">Start gratis</External>
              </li>
              <li>
                <External href="https://app.notably.no">Logg inn</External>
              </li>
            </Column>

            <Column title="Selskap">
              <li>
                <Link to="/om-oss" className={linkClass}>
                  Om oss
                </Link>
              </li>
              <li>
                <Link to="/artikler" className={linkClass}>
                  Artikler
                </Link>
              </li>
              <li>
                <External href="https://calendly.com/arti-jorgen/notably-demo">Book en demo</External>
              </li>
              <li>
                <a href="mailto:support@notably.no" className={linkClass}>
                  Kontakt oss
                </a>
              </li>
            </Column>

            <Column title="Juridisk">
              <li>
                <Link to="/personvern" className={linkClass}>
                  Personvern
                </Link>
              </li>
              <li>
                <Link to="/vilkar" className={linkClass}>
                  Vilkår for bruk
                </Link>
              </li>
              <li>
                <button type="button" onClick={openPrivacyChoices} className={linkClass}>
                  Personvernvalg
                </button>
              </li>
            </Column>
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-200 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Notably. Alle rettigheter forbeholdt.</p>
          <p>Utviklet i Norge</p>
        </div>
      </div>
    </footer>
  );
}
