import { Shield, Globe, FileText, Video, MessageSquare, CircleUser as UserCircle } from 'lucide-react';
import DisplayCards from './DisplayCards';

export default function MeetingSummarySection() {
  return (
    <section className="py-20 page-container bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-10 items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 text-gray-900">Glem stresset med å ta notater.</h2>
          <p className="text-gray-600 text-base sm:text-lg mb-6 lg:mb-8">
            Notably gjør jobben for deg og fanger alle viktige detaljer - så du kan være fullt til stede i samtalen.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <span className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm flex items-center gap-2 text-blue-700">
              <Shield className="w-4 h-4" />
              GDPR-kompatibel
            </span>
            <span className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm flex items-center gap-2 text-blue-700">
              <Globe className="w-4 h-4" />
              100+ språk
            </span>
            <span className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm flex items-center gap-2 text-blue-700">
              <FileText className="w-4 h-4" />
              Oppgaver og beslutninger
            </span>
            <span className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm flex items-center gap-2 text-blue-700">
              <Globe className="w-4 h-4" />
              Hostet i Europa
            </span>
            <span className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm flex items-center gap-2 text-blue-700">
              <Shield className="w-4 h-4" />
              Personvern først
            </span>
          </div>
        </div>
        <div className="relative flex items-center justify-center min-h-[280px] sm:min-h-[360px] overflow-hidden pb-10 sm:pb-0">
          <DisplayCards cards={[
            {
              icon: <Video className="size-4 text-white" />,
              title: "Produktlansering Q1",
              description: "Strategi og tidsplan",
              date: "I morgen 10:00",
              iconClassName: "bg-blue-600",
              titleClassName: "text-blue-600",
              className: "[grid-area:stack] hover:-translate-y-8 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
            },
            {
              icon: <MessageSquare className="size-4 text-white" />,
              title: "Kundeavtale gjennomgang",
              description: "Månedlig status og oppfølging",
              date: "Fredag 14:30",
              iconClassName: "bg-green-600",
              titleClassName: "text-green-600",
              className: "[grid-area:stack] translate-x-12 translate-y-8 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
            },
            {
              icon: <UserCircle className="size-4 text-white" />,
              title: "Team retrospektiv",
              description: "Sprint gjennomgang og forbedringer",
              date: "Onsdag 15:00",
              iconClassName: "bg-purple-600",
              titleClassName: "text-purple-600",
              className: "[grid-area:stack] translate-x-24 translate-y-16 hover:translate-y-8",
            },
          ]} />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white pointer-events-none sm:hidden"></div>
        </div>
      </div>
    </section>
  );
}
