import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// GET /api/auth - Check current user
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ user: decoded });
  } catch (err) {
    return NextResponse.json({ user: null });
  }
}

// POST /api/auth - Login
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'password123';

  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });

    const response = NextResponse.json({ success: true });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}

// DELETE /api/auth - Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('token');
  return response;
}
