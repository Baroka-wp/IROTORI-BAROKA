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

// GET /api/projects - List projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (featured !== null) where.featured = featured === 'true';

    const projects = await prisma.project.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ data: projects });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// POST /api/projects - Create project (auth required)
export async function POST(request: NextRequest) {
  if (!(await authenticate())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const project = await prisma.project.create({ data: body });
    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT /api/projects/:slug - Update project (auth required)
export async function PUT(request: NextRequest, context: any) {
  if (!(await authenticate())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug } = await context.params;
    const body = await request.json();
    const data = {
      ...body,
      updatedAt: new Date(),
    };

    const project = await prisma.project.update({
      where: { slug },
      data,
    });

    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE /api/projects/:slug - Delete project (auth required)
export async function DELETE(request: NextRequest, context: any) {
  if (!(await authenticate())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug } = await context.params;
    await prisma.project.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
