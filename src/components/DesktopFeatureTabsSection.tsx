import { useMemo, useState, type ReactNode } from 'react';
import { FileText, LayoutDashboard, Bot, Share2 } from 'lucide-react';

type DesktopFeatureTab = {
  id: string;
  label: string;
  imageSrc: string;
  alt: string;
  icon: ReactNode;
  fit?: 'cover' | 'contain';
};

const tabs: DesktopFeatureTab[] = [
  {
    id: 'dashboard',
    label: 'dashboard',
    imageSrc: 'https://qelklrrxciwomrwunzjo.supabase.co/storage/v1/object/public/admin-images/1771941136611.png',
    alt: 'Dashboard-visning i Notably',
    icon: <LayoutDashboard className="h-4 w-4" aria-hidden />,
    fit: 'contain',
  },
  {
    id: 'motereferat',
    label: 'Møtereferat',
    imageSrc: '/placeholders/motereferat-1440x900.svg',
    alt: 'Placeholder-bilde for møtereferat',
    icon: <FileText className="h-4 w-4" aria-hidden />,
  },
  {
    id: 'ai-assistent',
    label: 'AI-assistent',
    imageSrc: '/placeholders/ai-assistent-1440x900.svg',
    alt: 'Placeholder-bilde for AI-assistent',
    icon: <Bot className="h-4 w-4" aria-hidden />,
  },
  {
    id: 'deling',
    label: 'Deling',
    imageSrc: '/placeholders/deling-1440x900.svg',
    alt: 'Placeholder-bilde for deling',
    icon: <Share2 className="h-4 w-4" aria-hidden />,
  },
];

export default function DesktopFeatureTabsSection() {
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTabId) ?? tabs[0],
    [activeTabId]
  );

  return (
    <section className="hidden lg:block page-container pb-24 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-[30px] border border-slate-200 bg-gradient-to-b from-slate-100 via-slate-50 to-white p-4 xl:p-5 shadow-[0_30px_90px_-55px_rgba(15,23,42,0.7)]">
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400" aria-hidden />
              <span className="h-3 w-3 rounded-full bg-amber-400" aria-hidden />
              <span className="h-3 w-3 rounded-full bg-emerald-400" aria-hidden />
            </div>
            <div role="tablist" aria-label="Velg app-visning" className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1.5">
              {tabs.map((tab) => {
                const isActive = tab.id === activeTab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`desktop-feature-tabpanel-${tab.id}`}
                    id={`desktop-feature-tab-${tab.id}`}
                    onClick={() => setActiveTabId(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <div className="h-6 w-12" aria-hidden />
          </div>

          <div
            role="tabpanel"
            id={`desktop-feature-tabpanel-${activeTab.id}`}
            aria-labelledby={`desktop-feature-tab-${activeTab.id}`}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
          >
            <img
              src={activeTab.imageSrc}
              alt={activeTab.alt}
              width={1440}
              height={900}
              className={`w-full h-auto aspect-[16/10] ${activeTab.fit === 'contain' ? 'object-contain bg-slate-100' : 'object-cover'}`}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
