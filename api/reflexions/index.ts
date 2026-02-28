import { VercelRequest, VercelResponse } from '@vercel/node';
import { getContent, createContent } from '../../lib/handlers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const result = await getContent('reflexion', req.query);
      return res.status(200).json(result);
    }

    if (req.method === 'POST') {
      const item = await createContent('reflexion', req.body);
      return res.status(201).json(item);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Reflexions API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
