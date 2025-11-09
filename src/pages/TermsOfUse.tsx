import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function TermsOfUse() {
  return (
    <>
      <Helmet>
        <title>Vilkår for bruk - Notably</title>
        <meta name="description" content="Les våre vilkår for bruk for Notably. Denne siden beskriver rammer for bruk av tjenesten og ansvar mellom partene." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Tilbake til forsiden
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-8">Vilkår for bruk</h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-400 mb-8">Sist oppdatert: 28.10.2025</p>

            <section className="mb-12">
              <p className="text-gray-300">
                Dette er en foreløpig versjon av Notablys vilkår for bruk med plassholder-innhold. Den endelige versjonen
                vil beskrive brukerrettigheter, begrensninger, akseptabel bruk og øvrige juridiske rammer for tjenesten.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Om tjenesten</h2>
              <p className="text-gray-300">
                Notably hjelper deg å fange og oppsummere møter. Ved å bruke tjenesten bekrefter du at du har rett til å
                initiere opptak der det er påkrevd, og at du overholder gjeldende lover og avtaler.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Brukeransvar</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Ikke misbruk eller forsøk å forstyrre stabiliteten i tjenesten.</li>
                <li>Sørg for nødvendig samtykke ved opptak av møter.</li>
                <li>Ikke del innhold som bryter med andres rettigheter eller lovverket.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Ansvarsbegrensning</h2>
              <p className="text-gray-300">
                Tjenesten leveres «som den er». Notably fraskriver seg ansvar for indirekte tap, med mindre annet følger av
                ufravikelig lov. Eventuelle servicenivåer og garantier vil fremgå av endelige vilkår.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Endringer</h2>
              <p className="text-gray-300">
                Vilkårene kan bli oppdatert. Ved vesentlige endringer vil vi gi tydelig varsel før ikrafttredelse.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Kontakt</h2>
              <p className="text-gray-300">
                Har du spørsmål om vilkårene? Kontakt oss på
                {" "}
                <a className="text-blue-400 hover:text-blue-300" href="mailto:legal@notably.no">legal@notably.no</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

