import type { Faq } from '../advokat/faqs';

/**
 * Spørsmålene en prosjektleder eller byggeleder stiller før første byggemøte
 * med Notably, inkludert de vanligste innvendingene. Svarene brukes også som
 * FAQPage-strukturdata, så de holdes som ren tekst. Henvisningene er sjekket
 * mot Lovdata, Datatilsynet og personvernerklæringen (oktober 2026).
 * Se docs/research-bygg-og-anlegg.md.
 */
export const byggFaqs: Faq[] = [
  {
    question: 'Kan jeg ta opp et byggemøte med folk fra andre firma?',
    answer:
      'Du kan ta opp møter du selv deltar i. Straffeloven § 205 forbyr bare opptak av samtaler du ikke er med i. Men opptaket er behandling av personopplysninger, så alle i møtet skal vite at det tas opp og hva det brukes til. Skriv det i innkallingen, si det når møtet starter, og gi folk mulighet til å si fra. Datatilsynet sier at «kan bli tatt opp» ikke er nok informasjon. Hos en privatkunde spør du om lov først. I digitale møter er Notably synlig som deltaker.',
  },
  {
    question: 'Må alle i møtet ha Notably?',
    answer:
      'Nei. Den som leder møtet trykker opptak på telefonen, iPhone eller Android. Resten snakker som før, og får referatet på e-post. Byggherren, rådgiverne og underentreprenørene trenger ikke Notably selv.',
  },
  {
    question: 'Hva med støy på byggeplassen?',
    answer:
      'Notably håndterer både byggemøtet i brakka og befaringen ute på plassen. Legg telefonen på bordet i brakka, eller ha den med deg mens dere går befaringen.',
  },
  {
    question: 'Hva om Notably hører feil?',
    answer:
      'Du leser gjennom før noe sendes, og retter det du vil. Transkripsjonen ligger der hvis du vil sjekke nøyaktig hva som ble sagt, og av hvem.',
  },
  {
    question: 'Byggherren skriver referatet. Trenger jeg Notably da?',
    answer:
      'Da har du ditt eget referat, med navn på hvem som sa hva, å sjekke byggherrens mot. Ser du at en beskjed eller et forbehold mangler, kan du gi merknad før neste møte, mens alle husker hva som ble sagt.',
  },
  {
    question: 'Fungerer Notably sammen med Dalux, Interaxo eller andre prosjekthotell?',
    answer:
      'Notably erstatter ikke prosjekthotellet. Den skriver referatet. Last det ned eller send det på e-post, og legg det i Dalux, Interaxo eller prosjektmappen der det alltid har ligget. Bruker dere et bestemt system? Si fra, vi prioriterer integrasjoner etter hva kundene trenger.',
  },
  {
    question: 'Kan referatet brukes hvis det blir uenighet eller tvist?',
    answer:
      'Et referat alle parter har fått samme dag, er bedre dokumentasjon enn hukommelsen, og transkripsjonen viser hva som faktisk ble sagt og hvem som sa det. Varsel om endring, fristforlengelse og vederlagsjustering sender du slik kontrakten sier. Med referatet klart samme dag er det lettere å gjøre det i tide.',
  },
  {
    question: 'Må vi spørre de ansatte før vi tar opp interne møter?',
    answer:
      'Lydopptak av egne ansatte kan regnes som et kontrolltiltak etter arbeidsmiljøloven kapittel 9. Drøft det med tillitsvalgte før dere starter, og lag enkle regler for hva opptakene brukes til. Det tryggeste er å bruke opptaket til å lage referatet, og slette lyden når referatet er klart.',
  },
  {
    question: 'Hvor lagres opptakene og referatene?',
    answer:
      'Alt kundeinnhold, altså møter, opptak, transkripsjoner, referater og e-post fra Notably, lagres og behandles i EU/EØS. Opptak og database ligger hos Hetzner i Tyskland, tale-til-tekst går til et EU-endepunkt, og AI-oppsummeringene kjøres i Sverige og Frankrike. Unntakene gjelder ikke møteinnhold: betaling (Stripe), push-varsler på mobil (uten møtetitler), innlogging med Google, Microsoft eller Apple hvis du velger det, og AI-verktøy du selv kobler til. Leverandørenes støtte- og sikkerhetstilgang fra utenfor EU (ElevenLabs, Microsoft) er avgrenset og regulert av DPA og SCC. Alt står i personvernerklæringen.',
  },
  {
    question: 'Forstår Notably dialekter og andre språk?',
    answer:
      'Notably er laget for norsk tale og forstår over 100 språk, så det går fint når deler av møtet er på engelsk, polsk eller et annet språk. Referatet viser hvem som sa hva, med navn, og transkripsjonen ligger der hvis du vil sjekke noe.',
  },
  {
    question: 'Hva koster det?',
    answer:
      '399 kr per bruker per måned eks. mva., med 14 dager gratis og full tilgang. De andre i møtet trenger ikke Notably for å få referatet på e-post. Firma som trenger SSO, felles maler og oppfølging av flere prosjektledere, får et tilbud tilpasset antall brukere.',
  },
];
