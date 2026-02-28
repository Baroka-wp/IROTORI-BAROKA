import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get token from cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(200).json({ user: null });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; role: string };

    return res.status(200).json({
      user: {
        email: decoded.email,
        role: decoded.role,
      },
    });
  } catch (error: any) {
    // Token is invalid or expired
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      res.setHeader(
        'Set-Cookie',
        'token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax'
      );
      return res.status(200).json({ user: null });
    }

    console.error('Auth check error:', error);
    return res.status(500).json({ error: error.message });
  }
}
