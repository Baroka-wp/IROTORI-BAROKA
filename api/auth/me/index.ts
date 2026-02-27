import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const token = req.cookies?.token;
      if (!token) {
        return res.status(200).json({ user: null });
      }
      
      const decoded = jwt.verify(token, JWT_SECRET);
      return res.status(200).json({ user: decoded });
    } catch (error) {
      return res.status(200).json({ user: null });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
