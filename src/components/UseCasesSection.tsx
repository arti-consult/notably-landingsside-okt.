import { useState } from 'react';
import { TrendingUp, Users, Briefcase, Headphones as HeadphonesIcon, Scale } from 'lucide-react';

interface UseCase {
  title: string;
  description: string;
}

interface Industry {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  useCases: UseCase[];
}

const UseCasesSection = () => {
  const industries: Industry[] = [
    {
      id: 'sales',
      name: 'Salgsmøter',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'blue',
      useCases: [
        {
          title: 'Automatisk oppfølging',
          description: 'Få alle kundeløfter og oppgaver dokumentert automatisk etter hvert salgsmøte.'
        },
        {
          title: 'Innsikt i kundens behov',
          description: 'Analyser møtehistorikk for å forstå hva som driver kjøpsbeslutninger.'
        },
        {
          title: 'Salgstrening',
          description: 'Gjennomgå samtaler for å forbedre salgsteknikker og objeksjonshåndtering.'
        }
      ]
    },
    {
      id: 'hr',
      name: 'HR/Intervjuer',
      icon: <Users className="w-6 h-6" />,
      color: 'violet',
      useCases: [
        {
          title: 'Konsistente vurderinger',
          description: 'Sammenlign kandidater objektivt basert på faktiske svar og diskusjoner.'
        },
        {
          title: 'Raskere ansettelser',
          description: 'Del intervjusammendrag med teamet umiddelbart etter samtalen.'
        },
        {
          title: 'Juridisk dokumentasjon',
          description: 'Oppretthold nøyaktige opptak av ansettelsesprosessen for compliance.'
        }
      ]
    },
    {
      id: 'consulting',
      name: 'Konsulenttjenester',
      icon: <Briefcase className="w-6 h-6" />,
      color: 'green',
      useCases: [
        {
          title: 'Fakturerbar tid',
          description: 'Dokumenter alle kundemøter nøyaktig for presis timeregistrering.'
        },
        {
          title: 'Kundehistorikk',
          description: 'Få umiddelbar tilgang til all tidligere rådgivning gitt til klienten.'
        },
        {
          title: 'Kvalitetssikring',
          description: 'Sikre at alle teammedlemmer gir konsistent rådgivning til samme klient.'
        }
      ]
    },
    {
      id: 'support',
      name: 'Kundeservice',
      icon: <HeadphonesIcon className="w-6 h-6" />,
      color: 'orange',
      useCases: [
        {
          title: 'Raskere løsninger',
          description: 'Søk gjennom tidligere kundesamtaler for å finne lignende problemer og løsninger.'
        },
        {
          title: 'Oppfølgingssikkerhet',
          description: 'Aldri glem et kundeløfte eller oppfølgingsoppgave.'
        },
        {
          title: 'Kvalitetsforbedring',
          description: 'Analyser mønstre i kundehenvendelser for å forbedre produktet.'
        }
      ]
    },
    {
      id: 'legal',
      name: 'Juridiske møter',
      icon: <Scale className="w-6 h-6" />,
      color: 'slate',
      useCases: [
        {
          title: 'Nøyaktig dokumentasjon',
          description: 'Sikre fullstendig og nøyaktig nedtegnelse av alle juridiske diskusjoner.'
        },
        {
          title: 'Revisjonsspor',
          description: 'Oppretthold et komplett spor av alle rådgivninger og avgjørelser.'
        },
        {
          title: 'Tidssparing',
          description: 'La juridiske fagfolk fokusere på rådgivning i stedet for notatskriving.'
        }
      ]
    }
  ];

  const [activeTab, setActiveTab] = useState(industries[0].id);
  const activeIndustry = industries.find(ind => ind.id === activeTab) || industries[0];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      blue: {
        active: 'bg-blue-600 text-white',
        inactive: 'text-gray-600 hover:bg-blue-50'
      },
      violet: {
        active: 'bg-violet-600 text-white',
        inactive: 'text-gray-600 hover:bg-violet-50'
      },
      green: {
        active: 'bg-green-600 text-white',
        inactive: 'text-gray-600 hover:bg-green-50'
      },
      orange: {
        active: 'bg-orange-600 text-white',
        inactive: 'text-gray-600 hover:bg-orange-50'
      },
      slate: {
        active: 'bg-slate-700 text-white',
        inactive: 'text-gray-600 hover:bg-slate-50'
      }
    };
    return isActive ? colors[color as keyof typeof colors].active : colors[color as keyof typeof colors].inactive;
  };

  const getCardColorClasses = (color: string) => {
    const colors = {
      blue: 'border-blue-200 hover:border-blue-400 hover:shadow-blue-100',
      violet: 'border-violet-200 hover:border-violet-400 hover:shadow-violet-100',
      green: 'border-green-200 hover:border-green-400 hover:shadow-green-100',
      orange: 'border-orange-200 hover:border-orange-400 hover:shadow-orange-100',
      slate: 'border-slate-200 hover:border-slate-400 hover:shadow-slate-100'
    };
    return colors[color as keyof typeof colors];
  };

  const getIconBgClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      violet: 'bg-violet-100 text-violet-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600',
      slate: 'bg-slate-100 text-slate-700'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <section className="py-20 page-container bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          Bruksområder for alle bransjer
        </h2>

        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
          {industries.map((industry) => (
            <button
              key={industry.id}
              onClick={() => setActiveTab(industry.id)}
              className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 text-sm md:text-base ${getColorClasses(industry.color, activeTab === industry.id)}`}
            >
              <span className="hidden md:inline">{industry.icon}</span>
              {industry.name}
            </button>
          ))}
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {activeIndustry.useCases.map((useCase, index) => (
              <div
                key={index}
                className={`bg-white border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${getCardColorClasses(activeIndustry.color)}`}
              >
                <div className={`w-12 h-12 rounded-xl ${getIconBgClasses(activeIndustry.color)} flex items-center justify-center mb-4`}>
                  {activeIndustry.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{useCase.title}</h3>
                <p className="text-gray-600 leading-relaxed">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
