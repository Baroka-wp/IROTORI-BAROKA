import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/videos/[slug] - Get single video
export async function GET(request: Request, context: any) {
  try {
    const { slug } = await context.params;
    const video = await prisma.video.findUnique({
      where: { slug },
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
