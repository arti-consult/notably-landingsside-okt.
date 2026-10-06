import type { Faq } from '../advokat/faqs';

/**
 * Spørsmålene en regnskapsfører stiller før første kundemøte med Notably.
 * Svarene brukes også som FAQPage-strukturdata, så de holdes som ren tekst.
 * Henvisningene er sjekket mot Lovdata, Datatilsynet og personvernerklæringen
 * (oktober 2026). Se docs/research-regnskapsforere.md.
 */
export const regnskapFaqs: Faq[] = [
  {
    question: 'Kan jeg ta opp et møte med en kunde?',
    answer:
      'Du kan ta opp samtaler du selv deltar i. Straffeloven § 205 forbyr bare opptak av samtaler du ikke er med i. Men opptaket er behandling av personopplysninger, og Datatilsynet sier at virksomheter som hovedregel må be om samtykke før de tar opp samtaler med kunder. Spør derfor kunden før du starter, og fortell hva opptaket brukes til. I digitale møter er Notably synlig som deltaker, så alle ser at det tas notater.',
  },
  {
    question: 'Hvordan passer Notably med taushetsplikten?',
    answer:
      'Regnskapsførerloven § 4-2 krever at byrået hindrer uvedkommende i å få tilgang til opplysninger om kundene. Byrået er behandlingsansvarlig og Notably er databehandler. Databehandleravtalen er automatisk på plass når dere blir kunde, møtene lagres i EU, og bare de dere gir tilgang kan se dem. Dere får også oversikt over underleverandørene, så Notably kan tas inn i byråets risikovurdering av IT-leverandører.',
  },
  {
    question: 'Hvor lagres opptakene og referatene?',
    answer:
      'Opptak, transkripsjoner og referater lagres på Notablys egen drift i EU. Tale-til-tekst går til et EU-endepunkt, og AI-oppsummeringene kjøres i Sverige. Unntakene er e-post og supportchat, som går via leverandører i USA. Alt står i personvernerklæringen.',
  },
  {
    question: 'Brukes kundemøtene til å trene AI?',
    answer:
      'Nei. Møtene brukes bare til å lage referatene, søkene og svarene du ber om. De brukes ikke til å trene modeller, verken våre eller underleverandørenes.',
  },
  {
    question: 'Kan jeg slette opptaket og beholde referatet?',
    answer:
      'Ja. Du kan fjerne lydfilen og beholde referatet, så du ikke lagrer mer av samtalen enn du trenger. Du kan også slette et helt møte, eller hele arbeidsområdet.',
  },
  {
    question: 'Kan jeg sende referatet til kunden?',
    answer:
      'Ja. Du kan sende referatet på e-post rett fra Notably, eller laste det ned som dokument og sende det selv. E-post fra Notably går via en leverandør i USA, så vil du unngå det, laster du ned dokumentet og sender det fra din egen e-post. Du velger alltid selv hva som deles. Husk at hvitvaskingsloven § 28 forbyr å fortelle kunden om undersøkelser eller rapportering, så slike notater skal ikke sendes.',
  },
  {
    question: 'Kan jeg stole på at referatet er riktig?',
    answer:
      'Notably er laget for norsk tale og forstår over 100 språk. Men Notably gir ikke råd. Den skriver ned det som ble sagt, og du har fortsatt ansvaret for det som går til kunden. Bruk et par minutter på å lese gjennom. Transkripsjonen ligger der hvis du vil sjekke nøyaktig hva som ble sagt.',
  },
  {
    question: 'Fungerer det på fysiske møter?',
    answer:
      'Ja. På kontoret eller hos kunden bruker du mobilappen (iPhone) og legger telefonen på bordet, uten bot i møtet. Digitale møter på Teams, Zoom og Google Meet fanges opp via kalenderen. Har du et opptak fra før, kan du laste opp lydfilen.',
  },
  {
    question: 'Kan Notably kobles til Tripletex, PowerOffice eller andre regnskapssystemer?',
    answer:
      'Ikke i dag. Du laster ned referatet med et par klikk og legger det i kundemappen. Du kan også koble Notably til ChatGPT eller Claude via MCP. Bruker byrået et bestemt system? Si fra, vi prioriterer integrasjoner etter hva kundene trenger.',
  },
  {
    question: 'Hva koster det?',
    answer:
      '399 kr per bruker per måned eks. mva., med 14 dager gratis og full tilgang. Regnskapsbyråer som trenger SSO, felles maler og hjelp med leverandørvurderingen, får et tilbud tilpasset antall brukere.',
  },
];
