import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { sendNewsletter } from '../lib/newsletter';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Middleware d'authentification
function authenticate(req: VercelRequest): boolean {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return false;
  
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [name, ...valueParts] = cookie.split('=');
    acc[name.trim()] = valueParts.join('=');
    return acc;
  }, {} as Record<string, string>);
  
  const token = cookies.token;
  if (!token) return false;
  
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    console.log('POST /api/newsletter - Body:', req.body);
    console.log('Headers:', req.headers);

    // Vérifier l'authentification
    if (!authenticate(req)) {
      console.log('Unauthorized');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { slug } = req.body;

      if (!slug) {
        console.log('Missing slug');
        return res.status(400).json({ error: 'Post slug is required' });
      }

      // Récupérer le post
      const post = await prisma.post.findUnique({
        where: { slug: slug as string },
      });

      if (!post) {
        console.log('Post not found:', slug);
        return res.status(404).json({ error: 'Post not found' });
      }

      if (post.status !== 'published') {
        console.log('Post not published:', post.status);
        return res.status(400).json({ error: 'Post must be published to send newsletter' });
      }

      console.log('Sending newsletter for post:', post.title);

      // Envoyer la newsletter
      const result = await sendNewsletter({
        title: post.title,
        slug: post.slug,
        type: post.type,
        description: post.description,
      });

      console.log('Newsletter sent:', result);

      res.status(200).json({
        success: true,
        message: `Newsletter sent to ${result.sent} subscribers`,
        sent: result.sent,
      });
    } catch (error: any) {
      console.error('POST /api/newsletter error:', error);
      console.error('Error stack:', error.stack);
      console.error('Error response:', error.response?.body);

      res.status(500).json({
        error: error.message || 'Failed to send newsletter',
        details: error.response?.body || 'Unknown error',
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
