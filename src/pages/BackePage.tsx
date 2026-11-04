import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowUpRight, CalendarCheck, Check, Copy, KeyRound, LifeBuoy, ShieldCheck, Smartphone } from 'lucide-react';

/**
 * Onboardingside for Backe (enterprise-kunde, ca. 600 brukere).
 * Ikke indeksert, ikke i sitemap og ikke i ACQUISITION_PATHS, så ingen markedsføringsskript kjører her.
 *
 * Skjermbilder: legg filene i public/media/backe/ med navnene i SHOTS under.
 * Finnes ikke filen, vises en plassholder under utvikling. I produksjon skjules den.
 */

const SIGN_IN_URL = 'https://app.notably.no/no/sign-in';
const APP_STORE_URL = 'https://apps.apple.com/no/app/notably/id6783667184?l=nb';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=no.notably.mobile';

const SHOTS = {
  ssoButton: '/media/backe/sso-1-knapp.webp',
  ssoEmail: '/media/backe/sso-2-epost.webp',
  ssoBacke: '/media/backe/sso-3-backe-innlogging.png',
  calendarChoose: '/media/backe/kalender-1-velg.png',
  calendarApprove: '/media/backe/kalender-2-godkjenn.png',
  calendarDone: '/media/backe/kalender-3-ferdig.png',
};

const SECTIONS = [
  { id: 'logg-inn', label: 'Logg inn', icon: KeyRound },
  { id: 'kalender', label: 'Koble kalender', icon: CalendarCheck },
  { id: 'mobilapp', label: 'Mobilappen', icon: Smartphone },
  { id: 'sporsmal', label: 'Vanlige spørsmål', icon: LifeBuoy },
  { id: 'hjelp', label: 'Få hjelp', icon: LifeBuoy },
  { id: 'administrator', label: 'For administratorer', icon: ShieldCheck },
] as const;

const INVITE_TEXT = `Hei!

Nå tar vi i bruk Notably, som tar referat fra møtene dine.

Slik kommer du i gang:
1. Gå til notably.no/backe
2. Logg inn med «Bruk bedrifts-SSO» og e-postadressen din i Backe
3. Koble til kalenderen når du blir spurt om det

Har du spørsmål? Alt står på notably.no/backe.`;

function Screenshot({ src, alt }: { src: string; alt: string }) {
  const [missing, setMissing] = useState(false);
  // Plassholderen vises bare under utvikling. I produksjon skjules et manglende bilde.
  if (missing && import.meta.env.PROD) return null;
  if (missing) {
    return (
      <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <p className="text-sm font-semibold text-slate-600">Skjermbilde kommer</p>
        <p className="text-sm text-slate-500">{alt}</p>
        <code className="mt-1 rounded bg-white px-2 py-1 text-xs text-slate-500 ring-1 ring-slate-200">public{src}</code>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setMissing(true)}
      className="h-auto max-h-[520px] w-auto max-w-full rounded-2xl border border-slate-200 bg-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.55)]"
    />
  );
}

function Step({ n, title, children, shot }: { n: number; title: string; children?: ReactNode; shot?: { src: string; alt: string } }) {
  return (
    <li className="flex gap-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-base font-semibold text-white">
        {n}
      </span>
      <div className="min-w-0 flex-1 pt-1">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {children && <div className="mt-2 space-y-2 text-base leading-relaxed text-slate-600">{children}</div>}
        {shot && (
          <div className="mt-5 max-w-3xl">
            <Screenshot {...shot} />
          </div>
        )}
      </div>
    </li>
  );
}

function Section({ id, eyebrow, title, intro, children }: { id: string; eyebrow: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-36 border-t border-slate-200 py-14 first:border-t-0 first:pt-0 md:scroll-mt-28 md:py-16">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
      {intro && <div className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">{intro}</div>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-base leading-relaxed text-blue-950">{children}</div>
  );
}

function Faq({ q, children }: { q: string; children: ReactNode }) {
  return (
    <details className="group rounded-2xl border border-slate-200 bg-white p-5 open:shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-slate-900">
        {q}
        <span className="text-xl leading-none text-slate-400 transition-transform group-open:rotate-45" aria-hidden>+</span>
      </summary>
      <div className="mt-3 space-y-2 text-base leading-relaxed text-slate-600">{children}</div>
    </details>
  );
}

function CopyInvite() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INVITE_TEXT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Teksten står synlig og kan markeres manuelt. */
    }
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-3">
        <p className="text-sm font-semibold text-slate-700">Melding til de ansatte</p>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-blue-700 hover:bg-blue-50"
        >
          {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          {copied ? 'Kopiert' : 'Kopier'}
        </button>
      </div>
      <pre className="whitespace-pre-wrap px-5 py-4 font-sans text-sm leading-relaxed text-slate-700">{INVITE_TEXT}</pre>
    </div>
  );
}

/** Følger hvilken seksjon som er synlig, så menyen kan markere den. */
function useActiveSection() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

export default function BackePage() {
  const active = useActiveSection();

  return (
    <>
      <Helmet>
        <title>Kom i gang med Notably | Backe</title>
        <meta name="description" content="Slik logger du inn i Notably med Backe-brukeren din og kobler til kalenderen." />
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href="https://notably.no/backe" />
        {/* Holdes lik BACKE i scripts/prerender-articles.mjs, som skriver den statiske versjonen for Teams, Slack og LinkedIn. */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Notably" />
        <meta property="og:locale" content="nb_NO" />
        <meta property="og:url" content="https://notably.no/backe" />
        <meta property="og:title" content="Kom i gang med Notably | Backe" />
        <meta property="og:description" content="Slik logger du inn i Notably med Backe-brukeren din og kobler til kalenderen." />
        <meta property="og:image" content="https://notably.no/media/backe/backe-deling.jpg" />
        <meta property="og:image:alt" content="Notably og Backe: Kom i gang med Notably" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kom i gang med Notably | Backe" />
        <meta name="twitter:description" content="Slik logger du inn i Notably med Backe-brukeren din og kobler til kalenderen." />
        <meta name="twitter:image" content="https://notably.no/media/backe/backe-deling.jpg" />
      </Helmet>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white">
        <div className="page-container flex items-center justify-between gap-4 py-3.5">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link to="/" aria-label="Notably" className="shrink-0">
              <img src="/media/1760975960292.png" alt="Notably" width={168} height={32} className="h-6 w-auto sm:h-7" />
            </Link>
            <span className="text-xl font-light text-slate-300" aria-hidden>×</span>
            <img src="/logos/kunder/backe.svg" alt="Backe" width={138} height={50} className="h-7 w-auto shrink-0 sm:h-8" />
          </div>
          <a
            href={SIGN_IN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Logg inn
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </div>

        {/* Meny på mobil: horisontal rad under toppen. */}
        <nav aria-label="Innhold" className="border-t border-slate-100 lg:hidden">
          <div className="page-container flex gap-2 overflow-x-auto py-2 [scrollbar-width:none]">
            {SECTIONS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium ${
                  active === id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main className="min-h-screen bg-[#f5f6f8] pb-24 pt-32 text-slate-900 lg:pt-24">
        <div className="page-container">
          <div className="mx-auto max-w-6xl">
            {/* Toppen */}
            <div className="py-10 md:py-14">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-700">Notably for Backe</p>
              <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
                Kom i gang med Notably
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
                Notably tar referat fra møtene dine. Her finner du alt du trenger for å komme i gang, steg for steg.
              </p>

              <ol className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  { n: 1, title: 'Logg inn med SSO', text: 'Med e-postadressen din i Backe.', href: '#logg-inn' },
                  { n: 2, title: 'Koble kalenderen', text: 'Så finner Notably møtene dine.', href: '#kalender' },
                  { n: 3, title: 'Last ned appen', text: 'For møter du har ute og på farten.', href: '#mobilapp' },
                ].map((s) => (
                  <li key={s.n}>
                    <a href={s.href} className="flex h-full gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-blue-300">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">{s.n}</span>
                      <span>
                        <span className="block font-semibold text-slate-900">{s.title}</span>
                        <span className="mt-1 block text-sm text-slate-600">{s.text}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
              {/* Meny på desktop: fast til venstre. */}
              <nav aria-label="Innhold" className="hidden lg:block">
                <ul className="sticky top-28 space-y-1">
                  {SECTIONS.map(({ id, label, icon: Icon }) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                          active === id ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div>
                <Section
                  id="logg-inn"
                  eyebrow="Steg 1"
                  title="Logg inn med Backe-brukeren din"
                  intro={<>Du trenger ikke lage en egen konto. Første gang du logger inn med SSO, blir brukeren din opprettet.</>}
                >
                  <ol className="space-y-10">
                    <Step n={1} title="Gå til app.notably.no">
                      <p>
                        <a href={SIGN_IN_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 underline underline-offset-4">
                          Åpne innloggingssiden
                        </a>{' '}
                        i nettleseren på PC-en.
                      </p>
                    </Step>
                    <Step n={2} title="Trykk «Bruk bedrifts-SSO»" shot={{ src: SHOTS.ssoButton, alt: 'Innloggingssiden til Notably med knappen «Bruk bedrifts-SSO» markert' }}>
                      <p>Knappen ligger under de andre valgene.</p>
                    </Step>
                    <Step n={3} title="Skriv inn e-postadressen din i Backe" shot={{ src: SHOTS.ssoEmail, alt: 'Vinduet for single sign-on med e-postadressen fylt inn og knappen «Fortsett med SSO» markert' }}>
                      <p>
                        Det er adressen som slutter på @backe.no. Trykk så «Fortsett med SSO».
                      </p>
                    </Step>
                    <Step n={4} title="Logg inn slik du gjør ellers i Backe" shot={{ src: SHOTS.ssoBacke, alt: 'Innloggingsbildet til Backe' }}>
                      <p>Du sendes til den vanlige innloggingen i Backe. Når du er logget inn, kommer du rett til Notably.</p>
                    </Step>
                  </ol>

                  <Callout>
                    <strong>Bruk alltid «Bruk bedrifts-SSO».</strong> Ikke velg Google, Microsoft, Apple eller e-post, og ikke trykk «Lag en».
                    Da logger du inn med Backe-brukeren din og slipper et eget passord for Notably.
                  </Callout>
                </Section>

                <Section
                  id="kalender"
                  eyebrow="Steg 2"
                  title="Koble til kalenderen"
                  intro={<>Første gang du logger inn, blir du bedt om å koble til kalenderen. Da finner Notably møtene dine, og du slipper å legge dem inn selv.</>}
                >
                  <ol className="space-y-10">
                    <Step n={1} title="Velg Outlook" shot={{ src: SHOTS.calendarChoose, alt: 'Valg av kalender under oppstarten' }}>
                      <p>
                        Backe bruker Outlook-kalenderen i Microsoft 365.
                      </p>
                    </Step>
                    <Step n={2} title="Godkjenn tilgangen" shot={{ src: SHOTS.calendarApprove, alt: 'Microsoft ber om godkjenning av tilgang til kalenderen' }}>
                      <p>
                        IT i Backe har godkjent tilgangen på forhånd. Du trenger ikke be om lov eller vente på svar fra noen.
                      </p>
                    </Step>
                    <Step n={3} title="Ferdig" shot={{ src: SHOTS.calendarDone, alt: 'Kalenderen er koblet til, og møtene vises i Notably' }}>
                      <p>Møtene dine vises nå i Notably.</p>
                    </Step>
                  </ol>

                  <Callout>
                    <strong>Hoppet du over steget?</strong> Du kan koble til kalenderen senere under Innstillinger og Integrasjoner.
                  </Callout>
                </Section>

                <Section
                  id="mobilapp"
                  eyebrow="Steg 3"
                  title="Last ned mobilappen"
                  intro={<>Med appen kan du ta opp møter du har ute, på byggeplassen eller i bilen. Du logger inn på samme måte, med «Bruk bedrifts-SSO».</>}
                >
                  <div className="flex flex-wrap gap-3">
                    <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800">
                      Last ned for iPhone
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </a>
                    <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800">
                      Last ned for Android
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </a>
                  </div>
                </Section>

                <Section id="sporsmal" eyebrow="Vanlige spørsmål" title="Lurer du på noe?">
                  <div className="space-y-3">
                    <Faq q="Må jeg betale for Notably?">
                      <p>Nei. Avtalen er mellom Backe og Notably, så du betaler ingenting selv.</p>
                    </Faq>
                    <Faq q="Jeg kommer ikke inn med SSO. Hva gjør jeg?">
                      <p>Sjekk at du har trykket «Bruk bedrifts-SSO» og skrevet inn e-postadressen din i Backe, ikke en privat adresse.</p>
                      <p>Hjelper ikke det, se <a href="#hjelp" className="font-semibold text-blue-700 underline underline-offset-4">Få hjelp</a>.</p>
                    </Faq>
                    <Faq q="Jeg har allerede en Notably-konto. Hva skjer med den?">
                      <p>Du trenger ikke gjøre noe. Kontoer som er registrert med e-postadressen din i Backe, blir automatisk en del av Backe i Notably.</p>
                    </Faq>
                    <Faq q="Hvem kan se referatene mine?">
                      <p>Referater fra digitale møter kan bare de som var invitert til møtet og har en Notably-konto, se.</p>
                      <p>Opptak fra fysiske møter kan du velge å dele i etterkant.</p>
                      <p>Vil du dele et referat med andre, åpner du referatet og trykker på Del-knappen.</p>
                    </Faq>
                    <Faq q="Hvor lagres dataene?">
                      <p>
                        Les mer i{' '}
                        <Link to="/personvern" className="font-semibold text-blue-700 underline underline-offset-4">personvernerklæringen</Link>.
                      </p>
                    </Faq>
                  </div>
                </Section>

                <Section id="hjelp" eyebrow="Få hjelp" title="Hvem kontakter du?">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                      <p className="font-semibold text-slate-900">Tilgang og innlogging</p>
                      <p className="mt-2 text-slate-600">Kommer du ikke inn, eller mangler du tilgang, kontakt IT i Backe slik du pleier.</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                      <p className="font-semibold text-slate-900">Bruk av Notably</p>
                      <p className="mt-2 text-slate-600">Spørsmål om hvordan Notably fungerer, eller noe som ikke virker som det skal.</p>
                      <p className="mt-3 font-semibold text-slate-900"><a href="mailto:support@notably.no" className="text-blue-700 underline underline-offset-4">support@notably.no</a></p>
                    </div>
                  </div>
                </Section>

                <Section
                  id="administrator"
                  eyebrow="For administratorer i Backe"
                  title="Utrulling og oversikt"
                  intro={<>Denne delen er for IT og de som har ansvar for innføringen i Backe.</>}
                >
                  <div className="grid gap-4 xl:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                      <p className="font-semibold text-slate-900">Status for oppsettet</p>
                      <dl className="mt-4 space-y-3 text-sm">
                        {[
                          ['SSO', 'Satt opp for backe.no'],
                          ['Kalender', 'Outlook i Microsoft 365, godkjent av IT for alle'],
                          ['Kontakt hos Notably', 'support@notably.no'],
                        ].map(([k, v]) => (
                          <div key={k as string} className="grid grid-cols-[120px_1fr] gap-3">
                            <dt className="text-slate-500">{k}</dt>
                            <dd className="text-slate-800">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                    <div>
                      <p className="mb-3 text-base text-slate-600">Klar tekst du kan sende på e-post, Teams eller intranettet:</p>
                      <CopyInvite />
                    </div>
                  </div>
                </Section>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="page-container flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
          <p>Notably er levert av ARTI Consult AS</p>
          <div className="flex gap-5">
            <Link to="/personvern" className="hover:text-slate-900">Personvern</Link>
            <Link to="/vilkar" className="hover:text-slate-900">Vilkår</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
