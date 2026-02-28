import React, { useState } from 'react';
import { Lock, Mail, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        onLogin();
      } else {
        setError(data.error || 'Identifiants invalides');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium text-[#6B1A2A] mb-2">
            IROTORI BAROKA
          </h1>
          <p className="text-[var(--text-color)]/60">Administration</p>
        </div>

        {/* Login Form */}
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-8">
          <h2 className="text-2xl font-medium text-[var(--text-color)] mb-6 text-center">
            Connexion
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-color)]/40">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] pl-12 pr-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg transition-colors"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-color)]/60 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-color)]/40">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] pl-12 pr-4 py-3 text-base text-[var(--text-color)] focus:outline-none focus:border-[#6B1A2A] rounded-lg transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6B1A2A] text-white py-3 text-base font-medium hover:opacity-90 transition-opacity disabled:opacity-50 rounded-lg"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-sm text-[var(--text-color)]/60 hover:text-[#6B1A2A] transition-colors"
          >
            ← Retour au site
          </a>
        </div>
      </div>
    </div>
  );
};
