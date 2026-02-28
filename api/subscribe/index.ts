import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    try {
      const { email } = req.body;
      
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email' });
      }

      // Try to create subscriber
      try {
        await prisma.subscriber.create({ data: { email } });
        console.log('New subscriber:', email);
        return res.status(200).json({ success: true });
      } catch (error: any) {
        // P2002 = Unique constraint failed (already subscribed)
        if (error.code === 'P2002') {
          return res.status(200).json({ success: true, message: 'Already subscribed' });
        }
        throw error;
      }
    } catch (error: any) {
      console.error('POST /api/subscribe error:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
