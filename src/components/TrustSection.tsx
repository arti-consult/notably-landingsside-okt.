import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface MediaLogo {
  id: string;
  name: string;
  public_url: string;
  alt_text: string | null;
  file_name: string;
}

interface TrustLogo {
  company: string;
  logo: MediaLogo | null;
}

const targetCompanies = ['1881', 'O breivik eiendom', 'Pharma nordic', 'Møbelringen'] as const;

const normalizeValue = (value: string | null | undefined) =>
  (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const matchesCompany = (logo: MediaLogo, company: string) => {
  const companyKey = normalizeValue(company);
  const candidates = [
    normalizeValue(logo.name),
    normalizeValue(logo.file_name),
    normalizeValue(logo.alt_text),
  ];

  return candidates.some((candidate) => candidate === companyKey || candidate.includes(companyKey));
};

export default function TrustSection() {
  const [logos, setLogos] = useState<TrustLogo[]>(targetCompanies.map((company) => ({ company, logo: null })));

  useEffect(() => {
    const loadTrustLogos = async () => {
      const { data, error } = await supabase
        .from('media_library')
        .select('id, name, public_url, alt_text, file_name')
        .order('created_at', { ascending: false });

      if (error || !data) return;

      const mediaItems = data as MediaLogo[];

      const mapped = targetCompanies.map((company) => {
        const found = mediaItems.find((item) => matchesCompany(item, company)) || null;
        return { company, logo: found };
      });

      setLogos(mapped);
    };

    loadTrustLogos();
  }, []);

  return (
    <section className="py-12 sm:py-14 bg-white">
      <div className="page-container">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs sm:text-sm font-semibold tracking-[0.12em] uppercase text-slate-500 mb-7">
            Brukt av team hos
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {logos.map((item) => (
              <div
                key={item.company}
                className="h-20 sm:h-24 rounded-2xl border border-slate-200 bg-white flex items-center justify-center px-5"
              >
                {item.logo ? (
                  <img
                    src={item.logo.public_url}
                    alt={item.logo.alt_text || `${item.company} logo`}
                    className="max-h-10 sm:max-h-12 w-auto max-w-full object-contain opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-200"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="text-sm sm:text-base font-semibold text-slate-600 text-center">{item.company}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
