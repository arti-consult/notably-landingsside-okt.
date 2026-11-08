import { byggFaqs } from './faqs.ts';

/**
 * SEO for /bygg-og-anlegg på ett sted. Brukes både av ByggPage (Helmet) og av
 * scripts/prerender-articles.mjs, som skriver statisk HTML for siden etter bygget,
 * slik at søkemotorer, AI-crawlere og lenkeforhåndsvisninger får riktig tittel,
 * beskrivelse, canonical og innhold uten å kjøre JavaScript.
 *
 * Filen importeres direkte av Node, så den skal bare inneholde ren TypeScript
 * uten React, og lokale importer må ha .ts-endelse.
 */

export const BYGG_PATH = '/bygg-og-anlegg';

/** Under 60 tegn, så Google ikke kutter den. «Møtereferat» og «bygg og anlegg» først. */
export const BYGG_TITLE = 'Møtereferat for bygg og anlegg med AI | Notably';

/** Under 155 tegn. Møtetypene folk søker på, hva referatet inneholder, og prøveperioden. */
export const BYGG_DESCRIPTION =
  'Notably skriver referatet fra byggemøter, befaringer og Teams-møter. Hvem som sa hva, hvem som gjør hva og innen når. Lagret i EU. Prøv gratis i 14 dager.';

export const BYGG_SOCIAL_TITLE = 'Notably for bygg og anlegg: Mindre papirarbeid. Mer tid på plassen.';

/** Holdes lik H1 og underteksten i src/components/bygg/ByggHero.tsx. */
export const BYGG_H1 = 'Mindre papirarbeid. Mer tid på plassen.';
export const BYGG_INTRO =
  'Notably skriver referatet fra byggemøter, befaringer og Teams-møter. Du sender det før du går ut døra.';

/** Seksjonene på siden som ren tekst for den statiske HTML-en. Holdes i takt med komponentene. */
export const byggOutline: { heading: string; text: string }[] = [
  {
    heading: 'Samme møte. To helt forskjellige kvelder.',
    text: 'Uten Notably sitter du igjen med notatblokka og skriver referatet i kveld. Med Notably er referatet med beslutninger og frister sendt før du går ut døra.',
  },
  {
    heading: 'Du leder møtet. Notably skriver referatet.',
    text: 'Trykk opptak på telefonen. Notably skriver referatet med framdrift, beskjeder og frister, og du sender det til alle deltakerne.',
  },
  {
    heading: '«Det har vi aldri avtalt.» Jo. På byggemøte nr. 14.',
    text: 'Søk i alle referatene i prosjektet og finn hva som ble besluttet, av hvem og når.',
  },
  {
    heading: 'Alle møtene i prosjektet. Samlet i én mappe.',
    text: 'Byggemøter, prosjekteringsmøter, befaringer, SHA-møter og overtakelser i samme prosjektmappe. Mobilapp for iPhone og Android, og Teams, Zoom og Google Meet. Egen mal per møtetype.',
  },
  {
    heading: 'Trygt for deg, og for byggherren.',
    text: 'Lagret i EU, aldri brukt til AI-trening og databehandleravtale på plass. Du kan slette lydfilen og beholde referatet.',
  },
  {
    heading: 'Prøv selv i morgen. Eller få med hele firmaet.',
    text: 'Prosjektleder: 399 kr per bruker i måneden eks. mva., med 14 dager gratis. Firma: pris etter antall brukere, med felles maler, SSO og onboarding.',
  },
];

export function byggStructuredData(siteUrl: string) {
  const pageUrl = `${siteUrl}${BYGG_PATH}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: BYGG_TITLE,
        description: BYGG_DESCRIPTION,
        inLanguage: 'nb',
        audience: { '@type': 'BusinessAudience', name: 'Entreprenører, byggherrer og rådgivere i bygg og anlegg' },
        about: { '@id': `${pageUrl}#software` },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        isPartOf: { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'Notably', url: `${siteUrl}/` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Notably', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Bygg og anlegg', item: pageUrl },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${pageUrl}#software`,
        name: 'Notably',
        description: 'Automatiske møtereferat for bygg og anlegg, fra byggemøter, befaringer og digitale møter.',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web, iOS, Android',
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
        mainEntity: byggFaqs.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  };
}
