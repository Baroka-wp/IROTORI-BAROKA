import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { getJwtSecret } from '@/lib/auth';

// GET /api/auth - Vérifier l'utilisateur courant
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    return NextResponse.json({ user: decoded });
  } catch {
    return NextResponse.json({ user: null });
  }
}

// POST /api/auth - Login
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD;

  // Fail hard si les variables ne sont pas configurées — évite tout login silencieux par défaut
  if (!adminEmail || !adminPasswordHash) {
    console.error('ADMIN_EMAIL ou ADMIN_PASSWORD non défini dans les variables d\'environnement');
    return NextResponse.json({ error: 'Erreur de configuration serveur' }, { status: 500 });
  }

  const emailMatch = email === adminEmail;
  // S2 FIX : comparaison bcrypt — ADMIN_PASSWORD doit être un hash bcrypt dans le .env
  // Pour générer le hash : node -e "require('bcryptjs').hash('votre_mdp', 12).then(console.log)"
  const passwordMatch = await bcrypt.compare(password, adminPasswordHash);

  if (emailMatch && passwordMatch) {
    const token = jwt.sign({ email }, getJwtSecret(), { expiresIn: '24h' });

    const response = NextResponse.json({ success: true });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 heures
      path: '/',
    });

    return response;
  }

  return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
}

// DELETE /api/auth - Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('token');
  return response;
}
