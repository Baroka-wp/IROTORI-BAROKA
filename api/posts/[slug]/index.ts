import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';

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
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { slug } = req.query;

  if (req.method === 'GET') {
    try {
      const post = await prisma.post.findUnique({
        where: { slug: slug as string },
      });

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      return res.status(200).json(post);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    // Vérifier l'authentification
    if (!authenticate(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { title, type, content, status, tags, description, coverImage, downloadUrl, videoUrl, playlist } = req.body;

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (type !== undefined) updateData.type = type;
      if (content !== undefined) updateData.content = content;
      if (status !== undefined) updateData.status = status;
      if (tags !== undefined) updateData.tags = tags;
      if (description !== undefined) updateData.description = description;
      if (coverImage !== undefined) updateData.coverImage = coverImage;
      if (downloadUrl !== undefined) updateData.downloadUrl = downloadUrl;
      if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
      if (playlist !== undefined) updateData.playlist = playlist;

      const post = await prisma.post.update({
        where: { slug: slug as string },
        data: updateData,
      });
      return res.status(200).json(post);
    } catch (error: any) {
      console.error('Update error:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    // Vérifier l'authentification
    if (!authenticate(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      await prisma.post.delete({
        where: { id: slug as string },
      });
      return res.status(200).json({ success: true });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
