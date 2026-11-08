import { regnskapFaqs } from './faqs.ts';

/**
 * SEO for /regnskapsforer på ett sted. Brukes både av RegnskapPage (Helmet) og av
 * scripts/prerender-articles.mjs, som skriver statisk HTML for siden etter bygget,
 * slik at søkemotorer, AI-crawlere og lenkeforhåndsvisninger får riktig tittel,
 * beskrivelse, canonical og innhold uten å kjøre JavaScript.
 *
 * Filen importeres direkte av Node, så den skal bare inneholde ren TypeScript
 * uten React, og lokale importer må ha .ts-endelse.
 */

export const REGNSKAP_PATH = '/regnskapsforer';

/** Under 60 tegn, så Google ikke kutter den. «Møtereferat» og «regnskapsførere» først. */
export const REGNSKAP_TITLE = 'Møtereferat for regnskapsførere med AI | Notably';

/** Under 155 tegn. Møtetypene, hva referatet inneholder, lagring og prøveperioden. */
export const REGNSKAP_DESCRIPTION =
  'Notably skriver referatet fra kundemøter om årsoppgjør, lønn og rådgivning, med rådene du ga og fristene. Lagret i EU. Prøv gratis i 14 dager.';

export const REGNSKAP_SOCIAL_TITLE = 'Notably for regnskapsførere: Du ga rådet. Nå står det skriftlig.';

/** Holdes lik H1 og underteksten i src/components/regnskap/RegnskapHero.tsx. */
export const REGNSKAP_H1 = 'Du ga rådet. Nå står det skriftlig.';
export const REGNSKAP_INTRO =
  'Notably skriver referatet fra kundemøtet mens du snakker med kunden. Rådene du ga, det kunden fortalte og hva hver av dere skal gjøre, med frister. Klart til å sendes kunden når møtet er over.';

/** Seksjonene på siden som ren tekst for den statiske HTML-en. Holdes i takt med komponentene. */
export const regnskapOutline: { heading: string; text: string }[] = [
  {
    heading: 'Alt ligger i systemet. Bortsett fra det kunden sa.',
    text: 'Bilagene er digitale og bankavstemmingen går nesten av seg selv. Men rådene du gir og beskjedene kunden gir deg i møtet, havner fortsatt i en notatblokk. Med Notably står rådet og forutsetningene i referatet, og det kunden nevner i en bisetning blir en oppgave med frist.',
  },
  {
    heading: 'Et oppstartsmøte er ikke et årsoppgjør. Referatet vet forskjellen.',
    text: 'Et oppstartsmøte trenger eierskap og fullmakter. Et rådgivningsmøte trenger rådet og forutsetningene. Velg en mal, eller lag byråets egen, så får referatet den strukturen du ville brukt selv.',
  },
  {
    heading: 'Kunden får oppsummeringen samme dag.',
    text: 'Les gjennom, rett det du vil, og send referatet på e-post rett fra Notably. Eller last det ned og legg det i kundemappen sammen med resten av oppdraget.',
  },
  {
    heading: 'På kontoret, på Teams eller hos kunden.',
    text: 'Legg telefonen på bordet og trykk opptak i mobilappen for iPhone. Koble til kalenderen, så blir Notably med i Teams, Zoom og Google Meet. Eller last opp et opptak du allerede har.',
  },
  {
    heading: 'Kundens tall er taushetsbelagt. Det gjelder også verktøyene dine.',
    text: 'Lagret i EU og aldri brukt til AI-trening. Databehandleravtalen er på plass fra første dag. Du kan slette lydfilen og beholde referatet, og byråer kan få SSO.',
  },
  {
    heading: 'Hva rådet vi kunden egentlig?',
    text: 'Spør på tvers av alle møtene med en kunde, og få svaret med kilde. Også når det var en kollega som hadde møtet.',
  },
  {
    heading: 'Koster mindre enn en halvtime i måneden.',
    text: 'Regnskapsfører: 399 kr per bruker i måneden eks. mva., med 14 dager gratis. Regnskapsbyrå: pris etter antall brukere, med SSO, felles maler og onboarding.',
  },
];

export function regnskapStructuredData(siteUrl: string) {
  const pageUrl = `${siteUrl}${REGNSKAP_PATH}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: REGNSKAP_TITLE,
        description: REGNSKAP_DESCRIPTION,
        inLanguage: 'nb',
        audience: { '@type': 'BusinessAudience', name: 'Regnskapsførere og regnskapsbyråer' },
        about: { '@id': `${pageUrl}#software` },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        isPartOf: { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'Notably', url: `${siteUrl}/` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Notably', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Regnskapsførere', item: pageUrl },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${pageUrl}#software`,
        name: 'Notably',
        description: 'Automatiske referater fra kundemøter om årsoppgjør, lønn og rådgivning for regnskapsførere.',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web, iOS',
        inLanguage: 'nb',
        url: pageUrl,
        offers: {
          '@type': 'Offer',
          price: '399',
          priceCurrency: 'NOK',
          url: `${pageUrl}#pris`,
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '399',
            priceCurrency: 'NOK',
            valueAddedTaxIncluded: false,
            unitText: 'per bruker per måned',
          },
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        mainEntity: regnskapFaqs.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  };
}
