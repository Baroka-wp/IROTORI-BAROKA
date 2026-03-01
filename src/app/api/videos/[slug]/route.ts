import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/videos/[slug] — Récupérer une vidéo
export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const video = await prisma.video.findUnique({
      where: { slug },
    });

    if (!video) {
      return NextResponse.json({ error: 'Vidéo non trouvée' }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
