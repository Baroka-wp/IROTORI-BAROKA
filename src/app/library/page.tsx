import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ContentListPage } from '@/components/pages/ContentList';
import { getCurrentUser } from '@/lib/auth';
import { getPublishedEbooks } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Livres — IROTORI BAROKA',
  description: 'Des ressources pour transformer votre vie.',
};

export default async function LibraryPage() {
  const [user, ebooks] = await Promise.all([
    getCurrentUser(),
    getPublishedEbooks(),
  ]);

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="min-h-[calc(100vh-200px)]">
        <ContentListPage type="library" title="Livres" items={ebooks} />
      </main>
      <Footer />
    </div>
  );
}
