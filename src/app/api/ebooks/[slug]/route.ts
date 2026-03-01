import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/ebooks/[slug] — Récupérer un e-book
export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const ebook = await prisma.ebook.findUnique({
      where: { slug },
    });

    if (!ebook) {
      return NextResponse.json({ error: 'E-book non trouvé' }, { status: 404 });
    }

    return NextResponse.json(ebook);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
