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

  const description = ('shortDescription' in content && content.shortDescription)
    ? content.shortDescription
    : ('description' in content && typeof content.description === 'string')
      ? content.description.replace(/<[^>]+>/g, '').slice(0, 160)
      : ('content' in content && typeof (content as { content?: string }).content === 'string')
        ? (content as { content: string }).content.replace(/<[^>]+>/g, '').slice(0, 160)
        : undefined;

  const canonicalUrl = `https://irotoribaroka.com/post/${slug}`;

  return {
    title: content.title,
    description,
    authors: [{ name: 'IROTORI BAROKA Emmanuel', url: 'https://irotoribaroka.com' }],
    openGraph: {
      title: `${content.title} — IROTORI BAROKA`,
      description: description ?? undefined,
      url: canonicalUrl,
      type: 'article',
      locale: 'fr_FR',
      siteName: 'IROTORI BAROKA',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${content.title} — IROTORI BAROKA`,
      description: description ?? undefined,
    },
    alternates: {
      canonical: canonicalUrl,
    },
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

  // JSON-LD Article schema
  const isReflexion = 'content' in content && !('videoUrl' in content) && !('downloadUrl' in content);
  const articleJsonLd = isReflexion ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: content.title,
    author: {
      '@type': 'Person',
      name: 'IROTORI BAROKA Emmanuel',
      url: 'https://irotoribaroka.com',
    },
    publisher: {
      '@type': 'Person',
      name: 'IROTORI BAROKA Emmanuel',
    },
    datePublished: content.publishedAt ?? content.createdAt,
    dateModified: content.updatedAt,
    url: `https://irotoribaroka.com/post/${slug}`,
  } : null;

  return (
    <div className="min-h-screen">
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      <Navbar user={user} />
      <main className="min-h-[calc(100vh-200px)]">
        <PostDisplay content={content} />
      </main>
      <Footer />
    </div>
  );
}
