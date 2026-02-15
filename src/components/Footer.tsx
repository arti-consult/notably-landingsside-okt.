import { Instagram, Facebook, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const socialLinks = [
    { name: 'Instagram', href: 'https://www.instagram.com/notably_ai', icon: Instagram },
    { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61581862197291', icon: Facebook },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/notably-no/about/', icon: Linkedin },
  ];

  return (
    <footer className="bg-black text-gray-400 py-12 page-container border-t border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-6">
        <div className="mb-2">
          <img src="/Notably logo icon.svg" alt="Notably" className="h-8 brightness-0 invert" />
        </div>
        <p className="text-sm">Norskutviklet AI-agent som automatisk lager møtereferat fra dine digitale og fysiske møter.</p>

        <div className="flex items-center gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
              aria-label={social.name}
            >
              <social.icon className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
            </a>
          ))}
        </div>

        <div className="mt-4 pt-6 border-t border-gray-800 text-sm flex flex-col gap-3">
          <Link to="/personvern" className="hover:text-white transition-colors">
            Personvern
          </Link>
          <Link to="/vilkar" className="hover:text-white transition-colors">
            Vilkår for bruk
          </Link>
          <p>&copy; 2026 Notably. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
