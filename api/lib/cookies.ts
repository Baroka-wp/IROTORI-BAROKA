import type { VercelRequest } from '@vercel/node';

export function parseCookies(req: VercelRequest): Record<string, string> {
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
