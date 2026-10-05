# Research: Notably for advokater

Grunnlag for landingssiden på `/advokat` (oktober 2026). ✅ = sjekket mot primærkilde, ◐ = sekundærkilde.

## Møtetypene og hva som må dokumenteres
| Møte | Må dokumenteres |
|---|---|
| Inntaks-/klientmøte | Sakens faktum, klientens mål, frister, konfliktsjekk, grunnlag for oppdragsbekreftelse og kundekontroll |
| Oppfølging med klient | Instrukser, råd som ble gitt, beslutninger, neste steg |
| Internt saksmøte / overlevering | Strategi, ansvar, status, frister |
| Forhandling / møte med motpart | Posisjoner, tilbud, innrømmelser, hvem sa hva |
| Forberedelse til retten | Klientens forklaring, svake punkter, bevis |
| Due diligence | Funn, risiko, avklaringer |
| Styremøter (advokat som sekretær) | Vedtak og protokoll |

Rettsmekling er konfidensiell og bør ikke brukes som eksempel på opptak.

## Smertepunktene
1. Advokaten må velge mellom å lytte og å skrive.
2. Etterarbeid (renskriving, referat, saksoppdatering) blir sjelden fakturert. Clio 2025: utnyttelsesgrad ca. 38 %, altså ca. 3 fakturerbare timer per 8-timersdag ◐ (amerikanske tall).
3. Ufullstendige notater når saken tas opp igjen eller går til retten.
4. Informasjonstap ved overlevering mellom partner, advokat og fullmektig.
5. Lav tillit til personvern i KI-verktøy: 45,7 % av norske jurister er utrygge, og bare 2 % mener dagens løsninger ivaretar konfidensialitet godt nok ✅ ([Karnov, Fremtidens jurist 2025](https://www.karnovgroup.no/fremtidens-jurist-2025), 1 380 respondenter).
6. KI-bruken er høy: 53,9 % av jurister bruker KI daglig eller ukentlig ✅ (Karnov 2025).

## Regelverket
- **Advokatloven § 32** ✅: taushetsplikten gjelder opplysninger om oppdrag *og mulige oppdrag*, så inntaksmøtet er også omfattet. Tredje ledd åpner for bruk «for driften av advokatvirksomheten og alminnelig kontorhold». Plikten gjelder også hjelpere. (Advokatloven trådte i kraft 1.1.2025. Straffeloven § 211 gjelder ikke lenger advokater.)
- **Advokatloven § 36** ✅: krav om forsvarlig arkiv.
- **Bevisforbud**: tvisteloven § 22-5 og straffeprosessloven § 119 ◐.
- **Advokatforeningens GDPR-veileder v2 (24.10.2024)** ✅: firmaet er behandlingsansvarlig. Det må ha databehandleravtale (art. 28) som også dekker opplysninger som ikke er personopplysninger, og må vurdere leverandørens sikkerhet. Leverandører i USA eller India krever gyldig overføringsgrunnlag.
- **Advokatforeningens KI-veiledning (5.9.2025)** ◐: advokaten har alltid sluttansvaret. Teksten ligger bak innlogging og er ikke sitert direkte på siden.
- **Datatilsynet om lydopptak** ✅: de vanlige GDPR-reglene gjelder. Deltakerne skal informeres. Straffeloven § 205 forbyr bare opptak av samtaler du ikke selv deltar i.

## Sikkerhetsspørsmålene advokater stiller
Databehandleravtale (automatisk på plass for Notably-kunder), lagring i EU/EØS, liste over underleverandører, ingen modelltrening, kryptering, SSO/MFA, sletting og arkiv, revisjonslogg, ISO 27001/SOC 2.

**Dette sier siden om Notably** (alt hentet fra personvernerklæringen):
- Lagring hos Hetzner i Tyskland
- Tale og AI rutes til EU (Sverige og Frankrike)
- Ingen modelltrening
- TLS under transport
- Arbeidsområdene er adskilt fra hverandre
- Sletting per møte
- Underleverandørene er bundet av databehandleravtaler
- SSO for firmaer
- E-post og support går via leverandører i USA (dette står åpent på siden)

**Ikke påstått:** ISO 27001, SOC 2, kryptering ved lagring, revisjonslogg.

## Konkurrentene
Harvey (samarbeid med Gyldendal Rettsdata), Lovdata Pro og Copilot, samt Otter, Fireflies og Fathom, som er svakere på norsk og har amerikansk databehandling. Internasjonale «AI note taker for lawyers»-sider lover at advokaten kan være til stede i møtet, at dataene ikke brukes til trening, og at de har SOC 2.
