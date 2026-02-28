import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) onLogin();
    else setError('Invalid credentials');
  };

  return (
    <div className="py-40 max-w-[400px] mx-auto">
      <h1 className="text-4xl font-light mb-8 text-[#6B1A2A]">Admin Access</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-2 text-base text-[var(--text-color)] focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-2 text-base text-[var(--text-color)] focus:outline-none"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button className="w-full bg-[#6B1A2A] text-white py-2 text-base hover:opacity-90 transition-colors">
          Login
        </button>
      </form>
    </div>
  );
};
