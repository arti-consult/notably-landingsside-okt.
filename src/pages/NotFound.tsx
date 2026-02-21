import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Siden ble ikke funnet - Notably</title>
        <meta
          name="description"
          content="Siden du leter etter finnes ikke. Gå tilbake til forsiden eller utforsk Notably-artikler."
        />
        <meta name="robots" content="noindex,follow" />
        <link rel="canonical" href="https://notably.no/404" />
      </Helmet>

      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-xl text-center">
          <p className="text-sm font-semibold tracking-wide uppercase text-blue-700 mb-4">404</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Siden ble ikke funnet</h1>
          <p className="text-gray-600 mb-8">
            Lenken er feil eller siden har blitt flyttet.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Gå til forsiden
            </Link>
            <Link
              to="/artikler"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold hover:border-blue-300 hover:text-blue-700 transition-colors"
            >
              Se artikler
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
