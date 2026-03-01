import type { Metadata } from 'next';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HomePage } from '../components/pages/Home';
import { getCurrentUser } from '../lib/auth';

export const metadata: Metadata = {
  title: 'IROTORI BAROKA — Plateforme de Clarté Mentale',
  description: 'Réflexions, vidéos, e-books et projets sur le développement personnel, la philosophie et la spiritualité.',
};

export default async function Page() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="min-h-[calc(100vh-200px)]">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}
