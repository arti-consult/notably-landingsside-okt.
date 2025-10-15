import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { BackgroundBeamsWithCollision } from './BackgroundBeamsWithCollision';

export default function CTASection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Vennligst oppgi en gyldig e-postadresse');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/waitlist-signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Du er nå på ventelisten!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Noe gikk galt. Prøv igjen.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Noe gikk galt. Sjekk internettforbindelsen din.');
      console.error('Waitlist error:', error);
    }
  };

  return (
    <BackgroundBeamsWithCollision>
      <div className="max-w-4xl mx-auto text-center z-10 relative px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm text-white font-medium">Klar til å komme i gang?</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            Bli med på ventelisten
          </h2>

          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Gjør dine møter mer produktive med AI-drevne notater spesialtrent for norsk
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@epost.no"
                disabled={status === 'loading' || status === 'success'}
                className="flex-1 px-6 py-4 rounded-full bg-white/90 backdrop-blur-sm border-2 border-white/20 focus:border-white focus:bg-white focus:outline-none text-base disabled:bg-gray-100 disabled:cursor-not-allowed transition-all placeholder:text-gray-500"
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="px-8 py-4 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-2 shadow-xl"
              >
                {status === 'loading' && (
                  <Loader2 className="w-5 h-5 animate-spin" />
                )}
                {status === 'success' && (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                {status === 'loading' ? 'Melder på...' : status === 'success' ? 'Påmeldt!' : 'Bli med'}
              </button>
            </div>

            {message && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 text-sm font-medium ${
                  status === 'success' ? 'text-green-300' : 'text-red-300'
                }`}
              >
                {message}
              </motion.p>
            )}
          </form>

          <p className="mt-6 text-sm text-gray-300">
            Bli først ute med tidlig tilgang 🚀
          </p>
        </motion.div>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
