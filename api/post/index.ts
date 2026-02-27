import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { slug } = req.query;

  if (req.method === 'GET' && slug) {
    try {
      const post = await prisma.post.findUnique({ where: { slug: slug as string } });
      if (!post) return res.status(404).json({ error: 'Post not found' });
      return res.status(200).json(post);
    } catch (error: any) {
      console.error('GET error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT' && slug) {
    try {
      const post = await prisma.post.update({
        where: { slug: slug as string },
        data: req.body,
      });
      return res.status(200).json(post);
    } catch (error: any) {
      console.error('PUT error:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE' && slug) {
    try {
      await prisma.post.delete({ where: { id: slug as string } });
      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('DELETE error:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  return res.status(400).json({ error: 'Invalid request' });
}
