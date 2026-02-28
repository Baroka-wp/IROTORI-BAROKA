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
      const ebook = await prisma.ebook.findUnique({
        where: { slug: slug as string },
      });

      if (!ebook) {
        return res.status(404).json({ error: 'Ebook not found' });
      }

      return res.status(200).json(ebook);
    }

    if (req.method === 'PUT' && slug) {
      const { title, subtitle, description, coverImage, downloadUrl, price, status } = req.body;

      const ebook = await prisma.ebook.update({
        where: { slug: slug as string },
        data: {
          ...(title && { title }),
          ...(subtitle && { subtitle }),
          ...(description && { description }),
          ...(coverImage && { coverImage }),
          ...(downloadUrl && { downloadUrl }),
          ...(price !== undefined && { price }),
          ...(status && { 
            status,
            publishedAt: status === 'published' ? new Date() : undefined,
          }),
          updatedAt: new Date(),
        },
      });

      return res.status(200).json(ebook);
    }

    if (req.method === 'DELETE' && slug) {
      await prisma.ebook.delete({
        where: { slug: slug as string },
      });

      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Invalid request' });
  } catch (error: any) {
    console.error('Ebook [slug] API error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Ebook not found' });
    }
    return res.status(500).json({ error: error.message });
  }
}
