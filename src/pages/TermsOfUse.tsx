import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import termsText from '../content/terms-of-use.txt?raw';

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
            <pre className="whitespace-pre-wrap font-sans text-gray-300">{termsText}</pre>
          </div>
        </div>
      </div>
    </>
  );
}
