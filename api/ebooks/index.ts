import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { status, page = '1', limit = '20' } = req.query;

      const where: any = {};
      if (status) where.status = status as string;

      const [ebooks, total] = await Promise.all([
        prisma.ebook.findMany({
          where,
          orderBy: { publishedAt: 'desc' },
          skip: (parseInt(page as string) - 1) * parseInt(limit as string),
          take: parseInt(limit as string),
        }),
        prisma.ebook.count({ where }),
      ]);

      return res.status(200).json({
        data: ebooks,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    }

    if (req.method === 'POST') {
      const { title, slug, subtitle, description, coverImage, downloadUrl, price, status } = req.body;

      if (!title || !slug) {
        return res.status(400).json({ error: 'Title and slug are required' });
      }

      const ebook = await prisma.ebook.create({
        data: {
          title,
          slug,
          subtitle,
          description,
          coverImage,
          downloadUrl,
          price: price || 0,
          status: status || 'draft',
          publishedAt: status === 'published' ? new Date() : null,
        },
      });

      return res.status(201).json(ebook);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Ebooks API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
