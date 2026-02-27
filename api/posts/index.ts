import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Parse cookies from request header
function parseCookies(req: VercelRequest): Record<string, string> {
  const cookieHeader = req.headers.cookie;
  const cookies: Record<string, string> = {};

  if (!cookieHeader) {
    return cookies;
  }

  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      const name = decodeURIComponent(parts.shift()!.trim());
      const value = decodeURIComponent(parts.join('=').trim());
      cookies[name] = value;
    }
  });

  return cookies;
}

// Middleware d'authentification
const authenticate = (req: VercelRequest): boolean => {
  const cookies = parseCookies(req);
  const token = cookies.token;
  if (!token) return false;

  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const { type, status, playlist } = req.query;
      const where: any = {};

      if (type) where.type = type as string;
      if (status) where.status = status as string;
      if (playlist) where.playlist = playlist as string;

      const posts = await prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json(posts);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    // Vérifier l'authentification
    if (!authenticate(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { title, slug, type, content, status, tags, description, coverImage, downloadUrl, videoUrl, playlist } = req.body;

      const createData: any = {
        title,
        slug,
        type,
        content,
        status: status || 'draft',
      };

      if (tags) createData.tags = tags;
      if (description) createData.description = description;
      if (coverImage) createData.coverImage = coverImage;
      if (downloadUrl) createData.downloadUrl = downloadUrl;
      if (videoUrl) createData.videoUrl = videoUrl;
      if (playlist) createData.playlist = playlist;

      const post = await prisma.post.create({
        data: createData,
      });
      return res.status(201).json(post);
    } catch (error: any) {
      console.error('Create error:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
