import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Clear the token cookie
    res.setHeader(
      'Set-Cookie',
      'token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax'
    );

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: error.message });
  }
}
