import React, { useState } from 'react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setStatus('success');
      else setStatus('error');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section className="bg-[var(--card-bg)] border border-[var(--border-color)] p-10 my-20">
      <h3 className="text-2xl font-medium mb-4 text-[var(--brand-text)]">Newsletter</h3>
      <p className="text-[var(--text-color)]/70 font-light mb-8 leading-relaxed text-lg">
        Recevez des idées essentielles pour renforcer votre clarté mentale et votre capacité d'action.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-[var(--bg-color)] border border-[var(--border-color)] px-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-[#6B1A2A] text-white px-8 py-3 text-base font-medium hover:opacity-90 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? '...' : "S'inscrire"}
        </button>
      </form>
      {status === 'success' && <p className="text-sm text-green-500 mt-3">Bienvenue. Vous recevrez bientôt nos réflexions.</p>}
      {status === 'error' && <p className="text-sm text-red-500 mt-3">Une erreur est survenue. Veuillez réessayer.</p>}
    </section>
  );
};
