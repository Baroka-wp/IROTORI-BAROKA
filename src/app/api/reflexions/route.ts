import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

async function authenticate(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return false;
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

// GET /api/reflexions - List reflexions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const tags = searchParams.get('tags');

    const where: any = {};
    if (status) where.status = status;
    if (tags) where.tags = { contains: tags, mode: 'insensitive' };

    const reflexions = await prisma.reflexion.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: reflexions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// POST /api/reflexions - Create reflexion (auth required)
export async function POST(request: NextRequest) {
  if (!(await authenticate())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = {
      ...body,
      publishedAt: body.status === 'published' ? new Date() : null,
    };

    const reflexion = await prisma.reflexion.create({ data });
    return NextResponse.json(reflexion);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT /api/reflexions - Update reflexion (auth required)
export async function PUT(request: NextRequest) {
  if (!(await authenticate())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, ...data } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Slug required' }, { status: 400 });
    }

    const updateData = {
      ...data,
      updatedAt: new Date(),
      publishedAt: data.status === 'published' ? new Date() : undefined,
    };

    const reflexion = await prisma.reflexion.update({
      where: { slug },
      data: updateData,
    });

    return NextResponse.json(reflexion);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE /api/reflexions/:slug - Delete reflexion (auth required)
export async function DELETE(request: NextRequest, context: any) {
  if (!(await authenticate())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug } = await context.params;
    await prisma.reflexion.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
