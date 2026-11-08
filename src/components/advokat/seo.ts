import { advokatFaqs } from './faqs.ts';

/**
 * SEO for /advokat på ett sted. Brukes både av AdvokatPage (Helmet) og av
 * scripts/prerender-articles.mjs, som skriver statisk HTML for siden etter bygget,
 * slik at søkemotorer, AI-crawlere og lenkeforhåndsvisninger får riktig tittel,
 * beskrivelse, canonical og innhold uten å kjøre JavaScript.
 *
 * Filen importeres direkte av Node, så den skal bare inneholde ren TypeScript
 * uten React, og lokale importer må ha .ts-endelse.
 */

export const ADVOKAT_PATH = '/advokat';

/** Under 60 tegn, så Google ikke kutter den. «AI-notater», «klientmøter» og «advokater» først. */
export const ADVOKAT_TITLE = 'AI-notater fra klientmøter for advokater | Notably';

/** Under 155 tegn. Møtetypene, hva notatet inneholder, lagring og prøveperioden. */
export const ADVOKAT_DESCRIPTION =
  'Notably skriver notatet fra klientmøter, forhandlinger og saksmøter, med faktum, frister og neste steg. Lagret i EU. Prøv gratis i 14 dager.';

export const ADVOKAT_SOCIAL_TITLE = 'Notably for advokater: Lytt til klienten. Notably tar notatet.';

/** Holdes lik H1 og underteksten i src/components/advokat/AdvokatHero.tsx. */
export const ADVOKAT_H1 = 'Lytt til klienten. Notably tar notatet.';
export const ADVOKAT_INTRO =
  'Notably dokumenterer klientmøter, forhandlinger og saksmøter, med faktum, frister og neste steg ferdig strukturert når møtet er over. Så du kan bruke tiden på saken, ikke på referatet.';

/** Seksjonene på siden som ren tekst for den statiske HTML-en. Holdes i takt med komponentene. */
export const advokatOutline: { heading: string; text: string }[] = [
  {
    heading: 'Du er advokat. Ikke referent.',
    text: 'Du er til stede i møtet mens Notably skriver. Notatet er ferdig når møtet er over, du kan søke i alt som er sagt med kilde, og når fullmektigen tar over, starter alle fra samme faktum.',
  },
  {
    heading: 'Et notat som forstår hva slags møte det var.',
    text: 'Et inntaksmøte trenger faktum og frister. En forhandling trenger posisjoner og innrømmelser. Velg en mal, eller lag firmaets egen, for inntaksmøter, forhandlinger, forberedelse av partsforklaring, saksgjennomganger og DD-gjennomganger.',
  },
  {
    heading: 'Taushetsplikten gjelder også verktøyene dine.',
    text: 'Lagret i EU og aldri brukt til AI-trening. AI-behandlingen skjer i EU. Databehandleravtalen er på plass når dere blir kunde, og firmaet er behandlingsansvarlig. Du sletter opptaket når du vil, og advokatfirmaer kan få SSO.',
  },
  {
    heading: 'På kontoret, på Teams eller på farten.',
    text: 'Legg telefonen på bordet og trykk opptak i mobilappen for iPhone. Koble til kalenderen, så blir Notably med i Teams, Zoom og Google Meet. Eller last opp et opptak du allerede har.',
  },
  {
    heading: 'Hva sa motparten egentlig?',
    text: 'Spør på tvers av alle møtene i saken, og få svaret med kilde, enten møtet var i går eller for et år siden.',
  },
  {
    heading: 'Koster mindre enn et kvarter av én fakturerbar time i måneden.',
    text: 'Advokat: 399 kr per bruker i måneden eks. mva., med 14 dager gratis. Advokatfirma: pris etter antall brukere, med SSO, felles maler og onboarding.',
  },
];

export function advokatStructuredData(siteUrl: string) {
  const pageUrl = `${siteUrl}${ADVOKAT_PATH}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: ADVOKAT_TITLE,
        description: ADVOKAT_DESCRIPTION,
        inLanguage: 'nb',
        audience: { '@type': 'BusinessAudience', name: 'Advokater og advokatfirmaer' },
        about: { '@id': `${pageUrl}#software` },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        isPartOf: { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'Notably', url: `${siteUrl}/` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Notably', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Advokater', item: pageUrl },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${pageUrl}#software`,
        name: 'Notably',
        description: 'Automatiske notater fra klientmøter, forhandlinger og saksmøter for advokater.',
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
        mainEntity: advokatFaqs.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  };
}
