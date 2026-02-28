import { VercelRequest, VercelResponse } from '@vercel/node';
import { getContentBySlug, updateContent, deleteContent } from '../../lib/handlers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Slug is required' });
  }

  try {
    if (req.method === 'GET') {
      const item = await getContentBySlug('reflexion', slug);
      return res.status(200).json(item);
    }

    if (req.method === 'PUT') {
      const item = await updateContent('reflexion', slug, req.body);
      return res.status(200).json(item);
    }

    if (req.method === 'DELETE') {
      await deleteContent('reflexion', slug);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Reflexion API error:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
}
