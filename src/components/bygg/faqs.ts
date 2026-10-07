import type { Faq } from '../advokat/faqs';

/**
 * Spørsmålene en prosjektleder eller byggeleder stiller før første byggemøte
 * med Notably. Svarene brukes også som FAQPage-strukturdata, så de holdes som
 * ren tekst. Henvisningene er sjekket mot Lovdata, Datatilsynet og
 * personvernerklæringen (oktober 2026). Se docs/research-bygg-og-anlegg.md.
 */
export const byggFaqs: Faq[] = [
  {
    question: 'Kan jeg ta opp et byggemøte med folk fra andre firma?',
    answer:
      'Du kan ta opp møter du selv deltar i. Straffeloven § 205 forbyr bare opptak av samtaler du ikke er med i. Men opptaket er behandling av personopplysninger, så alle i møtet skal vite at det tas opp og hva det brukes til. Skriv det i innkallingen, si det når møtet starter, og gi folk mulighet til å si fra. Datatilsynet sier at «kan bli tatt opp» ikke er nok informasjon. I digitale møter er Notably synlig som deltaker.',
  },
  {
    question: 'Må vi spørre de ansatte før vi tar opp interne møter?',
    answer:
      'Lydopptak av egne ansatte kan regnes som et kontrolltiltak etter arbeidsmiljøloven kapittel 9. Drøft det med tillitsvalgte før dere starter, og lag enkle regler for hva opptakene brukes til. Det tryggeste er å bruke opptaket til å lage referatet, og slette lyden når referatet er klart.',
  },
  {
    question: 'Hva med støy på byggeplassen?',
    answer:
      'Notably håndterer både byggemøtet i brakka og befaringen ute på plassen. Legg telefonen på bordet i brakka, eller ha den med deg mens dere går befaringen.',
  },
  {
    question: 'Kan referatet brukes hvis det blir uenighet eller tvist?',
    answer:
      'Et referat alle parter har fått samme dag, er bedre dokumentasjon enn hukommelsen, og transkripsjonen viser hva som faktisk ble sagt og hvem som sa det. Varsel om endring, fristforlengelse og vederlagsjustering sender du slik kontrakten sier. Med referatet klart samme dag er det lettere å gjøre det i tide.',
  },
  {
    question: 'Hvor lagres opptakene og referatene?',
    answer:
      'Opptak, transkripsjoner og referater lagres på Notablys egen drift i EU. Tale-til-tekst går til et EU-endepunkt, og AI-oppsummeringene kjøres i Sverige. Unntakene er e-post og supportchat, som går via leverandører i USA. Alt står i personvernerklæringen.',
  },
  {
    question: 'Brukes møtene til å trene AI?',
    answer:
      'Nei. Møtene brukes bare til å lage referatene, søkene og svarene du ber om. De brukes ikke til å trene modeller, verken våre eller underleverandørenes.',
  },
  {
    question: 'Fungerer Notably sammen med Dalux, Interaxo eller andre prosjekthotell?',
    answer:
      'Referatet passer rett inn. Last det ned eller send det på e-post, og legg det i Dalux, Interaxo eller prosjektmappen der det alltid har ligget. Bruker dere et bestemt system? Si fra, vi prioriterer integrasjoner etter hva kundene trenger.',
  },
  {
    question: 'Finnes appen for Android?',
    answer:
      'Ja. Mobilappen finnes for både iPhone og Android. Digitale møter på Teams, Zoom og Google Meet fanges opp via kalenderen, og har du et opptak fra før, kan du laste opp lydfilen.',
  },
  {
    question: 'Forstår Notably dialekter og andre språk?',
    answer:
      'Notably er laget for norsk tale og forstår over 100 språk, så det går fint når deler av møtet er på engelsk eller et annet språk. Referatet viser hvem som sa hva, med navn, og transkripsjonen ligger der hvis du vil sjekke noe.',
  },
  {
    question: 'Kan jeg slette opptaket og beholde referatet?',
    answer:
      'Ja. Du kan fjerne lydfilen og beholde referatet, så du ikke lagrer mer av møtet enn du trenger. Du kan også slette et helt møte, eller hele arbeidsområdet.',
  },
  {
    question: 'Hva koster det?',
    answer:
      '399 kr per bruker per måned eks. mva., med 14 dager gratis og full tilgang. De andre i møtet trenger ikke Notably for å få referatet på e-post. Firma som trenger SSO, felles maler og oppfølging av flere prosjektledere, får et tilbud tilpasset antall brukere.',
  },
];
