import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { buildTikTokContext, trackTikTokEvent } from '../lib/analytics';

export default function WaitlistSection() {
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

    const tiktokCtx = buildTikTokContext();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/waitlist-signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email, tiktok: tiktokCtx }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        trackTikTokEvent('CompleteRegistration', { content_name: 'Waitlist' }, tiktokCtx);
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
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-600 font-medium">Eksklusiv tidlig tilgang</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
            Bli med på ventelisten
          </h2>

          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Vær blant de første til å oppleve AI-drevet møteassistanse spesialtrent for norsk
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@epost.no"
                disabled={status === 'loading' || status === 'success'}
                className="flex-1 px-6 py-4 rounded-full bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none text-base disabled:bg-gray-100 disabled:cursor-not-allowed transition-all placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-2"
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
                  status === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {message}
              </motion.p>
            )}
          </form>

          <p className="mt-6 text-sm text-gray-500">
            Bli først ute med tidlig tilgang 🚀
          </p>
        </motion.div>
      </div>
    </section>
  );
}
