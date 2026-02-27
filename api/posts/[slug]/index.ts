import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { slug } = req.query;

  console.log('GET /api/posts/[slug] - slug:', slug);

  if (req.method === 'GET') {
    try {
      if (!slug) {
        return res.status(400).json({ error: 'Slug is required' });
      }

      const post = await prisma.post.findUnique({
        where: { slug: slug as string },
      });

      console.log('Post found:', post ? 'yes' : 'no');

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      return res.status(200).json(post);
    } catch (error: any) {
      console.error('GET /api/posts/[slug] error:', error);
      return res.status(500).json({ error: error.message, stack: error.stack });
    }
  }

  if (req.method === 'PUT') {
    try {
      if (!slug) {
        return res.status(400).json({ error: 'Slug is required' });
      }

      const { title, type, content, status, tags, description, coverImage, downloadUrl, videoUrl, playlist } = req.body;

      console.log('PUT /api/posts/[slug] - updating:', slug, req.body);

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

      return res.status(200).json(post);
    } catch (error: any) {
      console.error('PUT /api/posts/[slug] error:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      if (!slug) {
        return res.status(400).json({ error: 'Slug is required' });
      }

      await prisma.post.delete({
        where: { id: slug as string },
      });
      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('DELETE /api/posts/[slug] error:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
