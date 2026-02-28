import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    // Verify auth
    const cookieHeader = req.headers.cookie;
    let token: string | null = null;
    
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [name, ...valueParts] = cookie.split('=');
        acc[name.trim()] = valueParts.join('=');
        return acc;
      }, {} as Record<string, string>);
      token = cookies.token || null;
    }

    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
      jwt.verify(token, JWT_SECRET);
      
      const subscribers = await prisma.subscriber.findMany({
        orderBy: { createdAt: 'desc' },
      });
      
      return res.status(200).json(subscribers);
    } catch (error: any) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
