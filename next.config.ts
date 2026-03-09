import type { NextConfig } from 'next';

// SÉCURITÉ : Ne jamais exposer les secrets dans le bloc `env` de Next.js.
// Le bloc `env` injecte les valeurs dans le bundle JavaScript client (accessible publiquement).
// Les variables serveur (JWT_SECRET, ADMIN_PASSWORD, DATABASE_URL, clés API)
// restent dans process.env et ne sont accessibles que dans les API routes / Server Components.
// Seules les variables NEXT_PUBLIC_* (déclarées avec ce préfixe) sont destinées au client.
const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
