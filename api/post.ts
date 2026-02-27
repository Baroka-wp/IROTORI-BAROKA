import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS + No cache
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { slug, id } = req.query;

  console.log('Request:', req.method, '- slug:', slug, 'id:', id);

  // GET single post by slug
  if (req.method === 'GET' && slug) {
    try {
      const post = await prisma.post.findUnique({
        where: { slug: slug as string },
      });
      
      if (!post) {
        console.log('Post not found for slug:', slug);
        return res.status(404).json({ error: 'Post not found' });
      }
      
      console.log('Post found:', post.id);
      return res.status(200).json(post);
    } catch (error: any) {
      console.error('GET error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // PUT update post by slug
  if (req.method === 'PUT' && slug) {
    try {
      const { title, type, content, status, tags, description, coverImage, downloadUrl, videoUrl, playlist } = req.body;
      
      const post = await prisma.post.update({
        where: { slug: slug as string },
        data: {
          title,
          type,
          content,
          status,
          tags,
          description,
          coverImage,
          downloadUrl,
          videoUrl,
          playlist,
        },
      });
      
      console.log('Post updated:', post.id);
      return res.status(200).json(post);
    } catch (error: any) {
      console.error('PUT error:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  // DELETE post by id or slug
  if (req.method === 'DELETE' && (id || slug)) {
    try {
      await prisma.post.delete({
        where: { id: (id || slug) as string },
      });
      console.log('Post deleted');
      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('DELETE error:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  return res.status(400).json({ error: 'Invalid request' });
}
