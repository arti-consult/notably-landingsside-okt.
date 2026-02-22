import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const pharmaNordicArticleSlug = 'pharma-nordic-notably-frigjor-tid-fra-forste-mote';
const pharmaNordicLogoUrl = 'https://qelklrrxciwomrwunzjo.supabase.co/storage/v1/object/public/admin-images/1771237686841.svg';

interface TestimonialImage {
  public_url: string;
  alt_text: string | null;
}

export default function TestimonialSection() {
  const [articleImage, setArticleImage] = useState<TestimonialImage | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadArticleImage = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('media_library (public_url, alt_text)')
        .eq('slug', pharmaNordicArticleSlug)
        .eq('status', 'published')
        .maybeSingle();

      if (!isActive || error || !data) return;

      const articleData = data as { media_library: TestimonialImage | null };
      if (!articleData.media_library) return;

      setArticleImage(articleData.media_library);
    };

    loadArticleImage();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section className="py-16 sm:py-20 page-container bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm sm:grid sm:grid-cols-2">
          <div className="relative min-h-[250px] bg-slate-100 sm:min-h-full">
            {articleImage ? (
              <img
                src={articleImage.public_url}
                alt={articleImage.alt_text || 'Bent Andreassen fra Pharma Nordic'}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6">
                <img
                  src={pharmaNordicLogoUrl}
                  alt="Pharma Nordic logo"
                  className="h-10 w-auto object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
          </div>

          <div className="px-6 py-8 text-left sm:px-10 sm:py-12">
            <p className="text-xl font-semibold leading-relaxed text-gray-900 sm:text-2xl">
              "Notably gjør oss i stand til å bruke møtetiden smartere - vi slipper å bruke timer på manuell
              referatskriving"
            </p>
            <p className="mt-5 text-base font-medium text-gray-700 sm:text-lg">Bent Andreassen - CEO</p>
            <div className="mt-4">
              <img
                src={pharmaNordicLogoUrl}
                alt="Pharma Nordic logo"
                className="h-7 w-auto object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
