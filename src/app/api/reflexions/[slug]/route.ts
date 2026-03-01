import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/reflexions/[slug] — Récupérer une réflexion
export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const reflexion = await prisma.reflexion.findUnique({
      where: { slug },
    });

    if (!reflexion) {
      return NextResponse.json({ error: 'Réflexion non trouvée' }, { status: 404 });
    }

    return NextResponse.json(reflexion);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
