import { VercelRequest, VercelResponse } from '@vercel/node';
import { getContent, createContent, updateContent, deleteContent } from '../lib/handlers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { status, category, featured } = req.query;
      const filters: any = {};
      if (status) filters.status = status;
      if (category) filters.category = category;
      if (featured) filters.featured = featured === 'true';

      const result = await getContent('project', filters);
      return res.status(200).json(result);
    }

    if (req.method === 'POST') {
      const item = await createContent('project', req.body);
      return res.status(201).json(item);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Projects API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
