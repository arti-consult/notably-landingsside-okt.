export interface Faq {
  question: string;
  answer: string;
}

/**
 * Spørsmålene en advokat stiller før de tar opp en klient. Svarene brukes også
 * som FAQPage-strukturdata på siden, så de holdes som ren tekst.
 * Henvisningene er sjekket mot Lovdata og Datatilsynet (oktober 2026).
 */
export const advokatFaqs: Faq[] = [
  {
    question: 'Er det lov å ta opp et klientmøte?',
    answer:
      'Ja, du kan ta opp samtaler du selv deltar i – straffeloven § 205 forbyr bare opptak av samtaler du ikke er part i. Men opptaket er behandling av personopplysninger, så klienten og de andre deltakerne skal få beskjed før du starter. Mange firmaer tar det inn i oppdragsbekreftelsen. I digitale møter er Notably synlig som deltaker, så alle ser at det tas notater.',
  },
  {
    question: 'Hvordan forholder Notably seg til taushetsplikten?',
    answer:
      'Taushetsplikten etter advokatloven § 32 gjelder også overfor leverandørene dine. Firmaet er behandlingsansvarlig og Notably er databehandler, og Advokatforeningens GDPR-veileder anbefaler at du har databehandleravtale og vurderer leverandørens sikkerhet. Databehandleravtalen er automatisk på plass når dere blir kunde. I tillegg får dere full oversikt over underleverandører og svar på leverandørskjemaet, så vurderingen kan gjøres skikkelig.',
  },
  {
    question: 'Hvor lagres opptakene og notatene?',
    answer:
      'Opptak, transkripsjoner og notater lagres på Notablys egen drift i EU. Tale-til-tekst går til et EU-endepunkt, og AI-oppsummeringer kjøres i Sverige. Unntakene er e-postvarsler og supportchat, som går via leverandører i USA. Alt står i personvernerklæringen.',
  },
  {
    question: 'Brukes klientsamtalene til å trene AI?',
    answer:
      'Nei. Møtene dine brukes bare til å lage notatene, søkene og svarene du ber om. De brukes ikke til å trene modeller – verken våre eller underleverandørenes.',
  },
  {
    question: 'Hva med arkivplikten?',
    answer:
      'Advokatloven § 36 krever at du holder forsvarlig arkiv. Notably er ikke et saksarkiv: eksporter det ferdige notatet og legg det i saksbehandlingssystemet slik du gjør med andre saksdokumenter, og slett opptaket i Notably når du ikke trenger det lenger.',
  },
  {
    question: 'Kan jeg stole på at notatet er riktig?',
    answer:
      'Notably er laget for norsk tale og forstår over 100 språk, også når møtet veksler mellom norsk og engelsk. Men som advokat har du alltid sluttansvaret for det som går inn i saken. Bruk et par minutter på å lese gjennom notatet – det er fortsatt langt raskere enn å skrive det selv.',
  },
  {
    question: 'Fungerer det på fysiske møter og telefon?',
    answer:
      'Ja. På kontoret bruker du mobilappen (iPhone) og legger telefonen på bordet. Digitale møter på Teams, Zoom og Google Meet fanges opp via kalenderen. Har du et opptak fra før, kan du laste opp lydfilen.',
  },
  {
    question: 'Kan Notably kobles til saksbehandlingssystemet vårt?',
    answer:
      'Det finnes ingen automatisk overføring i dag, men du eksporterer notatet med et par klikk og legger det inn i saken. Du kan også koble Notably til ChatGPT eller Claude via MCP. Bruker firmaet et bestemt saksbehandlingssystem? Si fra – vi prioriterer integrasjoner etter hva kundene trenger.',
  },
  {
    question: 'Hva koster det?',
    answer:
      '399 kr per bruker per måned eks. mva., med 14 dager gratis og full tilgang. Advokatfirmaer som trenger SSO, felles maler og hjelp med innkjøpsprosessen, får et tilbud tilpasset antall brukere.',
  },
];
