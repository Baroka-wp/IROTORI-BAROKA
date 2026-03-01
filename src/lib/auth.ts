import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

/** Lance une erreur explicite si JWT_SECRET n'est pas défini — refuse le fallback silencieux */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required but not defined');
  }
  return secret;
}

/** Vérifie le cookie JWT de l'administrateur */
export async function authenticate(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return false;
  try {
    jwt.verify(token, getJwtSecret());
    return true;
  } catch {
    return false;
  }
}
