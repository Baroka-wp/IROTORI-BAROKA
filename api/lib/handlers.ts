// Shared API handlers for both local (Express) and Vercel
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Types
export type ContentType = 'reflexion' | 'video' | 'ebook' | 'note';

// Generic handler for listing content
export async function getContent(type: ContentType, filters: any = {}) {
  const where: any = {};
  
  if (filters.status) where.status = filters.status;
  if (filters.playlist && type === 'video') where.playlist = filters.playlist;
  if (filters.tags && type === 'reflexion') {
    where.tags = { contains: filters.tags, mode: 'insensitive' };
  }

  const model = prisma[type as keyof typeof prisma];
  if (!model) throw new Error(`Unknown content type: ${type}`);

  const items = await (model as any).findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return { data: items };
}

// Generic handler for getting single item
export async function getContentBySlug(type: ContentType, slug: string) {
  const model = prisma[type as keyof typeof prisma];
  if (!model) throw new Error(`Unknown content type: ${type}`);

  const item = await (model as any).findUnique({
    where: { slug },
  });

  if (!item) throw new Error(`${type} not found`);
  return item;
}

// Generic handler for creating content
export async function createContent(type: ContentType, data: any) {
  const model = prisma[type as keyof typeof prisma];
  if (!model) throw new Error(`Unknown content type: ${type}`);

  const createData: any = {
    ...data,
    publishedAt: data.status === 'published' ? new Date() : null,
  };

  // Remove fields that don't exist on certain models
  if (type === 'reflexion') {
    delete createData.subtitle;
    delete createData.thumbnail;
    delete createData.videoUrl;
    delete createData.playlist;
    delete createData.resume;
    delete createData.coverImage;
    delete createData.downloadUrl;
    delete createData.price;
    delete createData.bookTitle;
    delete createData.author;
    delete createData.shortDescription;
  }

  if (type === 'video') {
    delete createData.subtitle;
    delete createData.shortDescription;
    delete createData.coverImage;
    delete createData.downloadUrl;
    delete createData.price;
    delete createData.bookTitle;
    delete createData.author;
  }

  if (type === 'ebook') {
    delete createData.content;
    delete createData.thumbnail;
    delete createData.videoUrl;
    delete createData.playlist;
    delete createData.resume;
    delete createData.tags;
    delete createData.bookTitle;
    delete createData.author;
  }

  if (type === 'note') {
    delete createData.subtitle;
    delete createData.shortDescription;
    delete createData.thumbnail;
    delete createData.videoUrl;
    delete createData.playlist;
    delete createData.resume;
    delete createData.coverImage;
    delete createData.downloadUrl;
    delete createData.price;
    delete createData.tags;
  }

  return await (model as any).create({ data: createData });
}

// Generic handler for updating content
export async function updateContent(type: ContentType, slug: string, data: any) {
  const model = prisma[type as keyof typeof prisma];
  if (!model) throw new Error(`Unknown content type: ${type}`);

  const updateData: any = {
    ...data,
    updatedAt: new Date(),
    publishedAt: data.status === 'published' ? new Date() : undefined,
  };

  // Remove fields that don't exist on certain models
  if (type === 'reflexion') {
    delete updateData.subtitle;
    delete updateData.thumbnail;
    delete updateData.videoUrl;
    delete updateData.playlist;
    delete updateData.resume;
    delete updateData.coverImage;
    delete updateData.downloadUrl;
    delete updateData.price;
    delete updateData.bookTitle;
    delete updateData.author;
    delete updateData.shortDescription;
  }

  if (type === 'video') {
    delete updateData.subtitle;
    delete updateData.shortDescription;
    delete updateData.coverImage;
    delete updateData.downloadUrl;
    delete updateData.price;
    delete updateData.bookTitle;
    delete updateData.author;
  }

  if (type === 'ebook') {
    delete updateData.content;
    delete updateData.thumbnail;
    delete updateData.videoUrl;
    delete updateData.playlist;
    delete updateData.resume;
    delete updateData.tags;
    delete updateData.bookTitle;
    delete updateData.author;
  }

  if (type === 'note') {
    delete updateData.subtitle;
    delete updateData.shortDescription;
    delete updateData.thumbnail;
    delete updateData.videoUrl;
    delete updateData.playlist;
    delete updateData.resume;
    delete updateData.coverImage;
    delete updateData.downloadUrl;
    delete updateData.price;
    delete updateData.tags;
  }

  return await (model as any).update({
    where: { slug },
    data: updateData,
  });
}

// Generic handler for deleting content
export async function deleteContent(type: ContentType, slug: string) {
  const model = prisma[type as keyof typeof prisma];
  if (!model) throw new Error(`Unknown content type: ${type}`);

  return await (model as any).delete({
    where: { slug },
  });
}
