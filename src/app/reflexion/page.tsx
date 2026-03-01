import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ContentListPage } from '@/components/pages/ContentList';
import { getCurrentUser } from '@/lib/auth';
import { getPublishedReflexions } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Réflexions — IROTORI BAROKA',
  description: 'Principes et structures pour clarifier votre pensée et reprendre le contrôle.',
};

export default async function ReflexionPage() {
  const [user, reflexions] = await Promise.all([
    getCurrentUser(),
    getPublishedReflexions(),
  ]);

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="min-h-[calc(100vh-200px)]">
        <ContentListPage type="reflexion" title="Réflexions" items={reflexions} />
      </main>
      <Footer />
    </div>
  );
}
