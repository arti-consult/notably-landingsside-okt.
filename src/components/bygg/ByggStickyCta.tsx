import { useEffect, useState } from 'react';
import { DEMO_URL, SIGNUP_URL } from '../advokat/shared';

/**
 * Fast knapperad nederst på mobil. Vises når heroen er scrollet forbi, og
 * skjules igjen når prisene eller den siste oppfordringen er på skjermen,
 * så den aldri ligger oppå de samme knappene.
 */
export default function ByggStickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setCtaVisible(visible.size > 0);
    });
    const observe = () => document.querySelectorAll('[data-hide-sticky-cta]').forEach((el) => observer.observe(el));
    observe();
    // Seksjonene under bretten lastes etter hvert, så vi ser etter dem igjen.
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, []);

  const show = pastHero && !ctaVisible;

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_30px_-18px_rgba(15,23,42,0.35)] transition-transform duration-300 md:hidden ${
        show ? 'translate-y-0' : 'pointer-events-none translate-y-full'
      }`}
    >
      <div className="flex gap-2.5">
        <a
          data-trial-cta="sticky_mobile"
          href={SIGNUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={show ? 0 : -1}
          className="flex-1 rounded-xl bg-blue-600 py-3 text-center text-[15px] font-semibold text-white"
        >
          Prøv gratis
        </a>
        <a
          data-demo-cta="sticky_mobile"
          href={DEMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={show ? 0 : -1}
          className="flex-1 rounded-xl border border-slate-300 py-3 text-center text-[15px] font-semibold text-slate-800"
        >
          Book demo
        </a>
      </div>
    </div>
  );
}
