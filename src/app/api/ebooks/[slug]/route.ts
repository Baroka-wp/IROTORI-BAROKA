import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/ebooks/[slug] - Get single ebook
export async function GET(request: Request, context: any) {
  try {
    const { slug } = await context.params;
    const ebook = await prisma.ebook.findUnique({
      where: { slug },
    });

    if (!ebook) {
      return NextResponse.json({ error: 'Ebook not found' }, { status: 404 });
    }

    return NextResponse.json(ebook);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
