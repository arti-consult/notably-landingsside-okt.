import { Helmet } from 'react-helmet-async';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function ByggReisDeg() {
  return (
    <>
      <Helmet>
        <title>Bygg Reis Deg - Notably</title>
      </Helmet>
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <section className="relative pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Bygg Reis Deg
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              Ta kontroll over møtene dine med Notably
            </p>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}
