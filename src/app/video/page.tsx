import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ContentListPage } from '@/components/pages/ContentList';
import { getCurrentUser } from '@/lib/auth';
import { getPublishedVideos } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Webinaires — IROTORI BAROKA',
  description: 'Des webinaires sur des sujets divers : Ingénierie web, IA, Technologie, Spiritualité.',
};

export default async function VideoPage() {
  const [user, videos] = await Promise.all([
    getCurrentUser(),
    getPublishedVideos(),
  ]);

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="min-h-[calc(100vh-200px)]">
        <ContentListPage type="video" title="Webinaire" items={videos} />
      </main>
      <Footer />
    </div>
  );
}
