import { unstable_cache } from 'next/cache';
import { prisma } from './db';
import { Reflexion, Video, Ebook, Project } from './utils';

// ─── Réflexions ────────────────────────────────────────────────────────────────
export const getPublishedReflexions = unstable_cache(
  async (): Promise<Reflexion[]> => {
    const rows = await prisma.reflexion.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        tags: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    // Convertit les Date Prisma en string pour la sérialisation React
    return rows.map(r => ({
      ...r,
      publishedAt: r.publishedAt?.toISOString() ?? undefined,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })) as Reflexion[];
  },
  ['reflexions-published'],
  { revalidate: 60, tags: ['reflexions'] }
);

// ─── Vidéos ────────────────────────────────────────────────────────────────────
export const getPublishedVideos = unstable_cache(
  async (): Promise<Video[]> => {
    const rows = await prisma.video.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        thumbnail: true,
        videoUrl: true,
        playlist: true,
        tags: true,
        resume: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return rows.map(r => ({
      ...r,
      publishedAt: r.publishedAt?.toISOString() ?? undefined,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })) as Video[];
  },
  ['videos-published'],
  { revalidate: 60, tags: ['videos'] }
);

// ─── E-books ───────────────────────────────────────────────────────────────────
export const getPublishedEbooks = unstable_cache(
  async (): Promise<Ebook[]> => {
    const rows = await prisma.ebook.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        subtitle: true,
        shortDescription: true,
        description: true,
        coverImage: true,
        downloadUrl: true,
        price: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return rows.map(r => ({
      ...r,
      publishedAt: r.publishedAt?.toISOString() ?? undefined,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })) as Ebook[];
  },
  ['ebooks-published'],
  { revalidate: 60, tags: ['ebooks'] }
);

// ─── Projets ───────────────────────────────────────────────────────────────────
export const getPublishedProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const rows = await prisma.project.findMany({
      where: { status: { in: ['completed', 'in_progress'] } },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        longDescription: true,
        coverImage: true,
        websiteUrl: true,
        githubUrl: true,
        demoUrl: true,
        status: true,
        startDate: true,
        endDate: true,
        technologies: true,
        category: true,
        teamMembers: true,
        partners: true,
        featured: true,
        order: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return rows.map(r => ({
      ...r,
      startDate: r.startDate?.toISOString() ?? undefined,
      endDate: r.endDate?.toISOString() ?? undefined,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })) as Project[];
  },
  ['projects-published'],
  { revalidate: 60, tags: ['projects'] }
);

// ─── Contenu par slug (remplace le triple-fetch séquentiel de Post.tsx) ────────
export async function getContentBySlug(
  slug: string
): Promise<Reflexion | Video | Ebook | null> {
  const [reflexionResult, videoResult, ebookResult] = await Promise.allSettled([
    prisma.reflexion.findUnique({ where: { slug } }),
    prisma.video.findUnique({ where: { slug } }),
    prisma.ebook.findUnique({ where: { slug } }),
  ]);

  const serialize = (obj: Record<string, unknown>) =>
    Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k,
        v instanceof Date ? v.toISOString() : v,
      ])
    );

  if (reflexionResult.status === 'fulfilled' && reflexionResult.value) {
    return serialize(reflexionResult.value as Record<string, unknown>) as unknown as Reflexion;
  }
  if (videoResult.status === 'fulfilled' && videoResult.value) {
    return serialize(videoResult.value as Record<string, unknown>) as unknown as Video;
  }
  if (ebookResult.status === 'fulfilled' && ebookResult.value) {
    return serialize(ebookResult.value as Record<string, unknown>) as unknown as Ebook;
  }
  return null;
}
