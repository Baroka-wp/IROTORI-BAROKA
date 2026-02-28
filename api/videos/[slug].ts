import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { slug } = req.query;

  try {
    if (req.method === 'GET' && slug) {
      const video = await prisma.video.findUnique({
        where: { slug: slug as string },
      });

      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }

      return res.status(200).json(video);
    }

    if (req.method === 'PUT' && slug) {
      const { title, description, thumbnail, videoUrl, playlist, tags, resume, status } = req.body;

      const video = await prisma.video.update({
        where: { slug: slug as string },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(thumbnail && { thumbnail }),
          ...(videoUrl && { videoUrl }),
          ...(playlist && { playlist }),
          ...(tags && { tags }),
          ...(resume && { resume }),
          ...(status && { 
            status,
            publishedAt: status === 'published' ? new Date() : undefined,
          }),
          updatedAt: new Date(),
        },
      });

      return res.status(200).json(video);
    }

    if (req.method === 'DELETE' && slug) {
      await prisma.video.delete({
        where: { slug: slug as string },
      });

      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Invalid request' });
  } catch (error: any) {
    console.error('Video [slug] API error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Video not found' });
    }
    return res.status(500).json({ error: error.message });
  }
}
