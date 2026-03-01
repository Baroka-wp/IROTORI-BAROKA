import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PostDisplay } from '@/components/pages/Post';
import { getCurrentUser } from '@/lib/auth';
import { getContentBySlug } from '@/lib/queries';

interface PostDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContentBySlug(slug);
  if (!content) {
    return { title: 'Contenu non trouvé — IROTORI BAROKA' };
  }
  return {
    title: `${content.title} — IROTORI BAROKA`,
    description: ('shortDescription' in content && content.shortDescription)
      ? content.shortDescription
      : ('description' in content && typeof content.description === 'string')
        ? content.description.replace(/<[^>]+>/g, '').slice(0, 160)
        : undefined,
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;

  const [user, content] = await Promise.all([
    getCurrentUser(),
    getContentBySlug(slug),
  ]);

  if (!content) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="min-h-[calc(100vh-200px)]">
        <PostDisplay content={content} />
      </main>
      <Footer />
    </div>
  );
}
