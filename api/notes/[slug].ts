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
      const note = await prisma.note.findUnique({
        where: { slug: slug as string },
      });

      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }

      return res.status(200).json(note);
    }

    if (req.method === 'PUT' && slug) {
      const { title, content, bookTitle, author, status } = req.body;

      const note = await prisma.note.update({
        where: { slug: slug as string },
        data: {
          ...(title && { title }),
          ...(content && { content }),
          ...(bookTitle && { bookTitle }),
          ...(author && { author }),
          ...(status && { 
            status,
            publishedAt: status === 'published' ? new Date() : undefined,
          }),
          updatedAt: new Date(),
        },
      });

      return res.status(200).json(note);
    }

    if (req.method === 'DELETE' && slug) {
      await prisma.note.delete({
        where: { slug: slug as string },
      });

      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Invalid request' });
  } catch (error: any) {
    console.error('Note [slug] API error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Note not found' });
    }
    return res.status(500).json({ error: error.message });
  }
}
