import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate } from '@/lib/auth';
import { sanitizeHtml } from '@/lib/sanitize';

// GET /api/videos — Liste (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const playlist = searchParams.get('playlist');

    const allowedStatuses = ['draft', 'published'];
    const where: { status?: string; playlist?: string } = {};
    if (status && allowedStatuses.includes(status)) where.status = status;
    if (playlist) where.playlist = String(playlist);

    const videos = await prisma.video.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        thumbnail: true,
        videoUrl: true,
        playlist: true,
        tags: true,
        resume: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ data: videos });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// POST /api/videos — Créer (auth requis)
export async function POST(request: NextRequest) {
  if (!(await authenticate())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, description, thumbnail, videoUrl, playlist, tags, resume, status } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Titre et slug requis' }, { status: 400 });
    }

    const allowedStatuses = ['draft', 'published'];
    const safeStatus = allowedStatuses.includes(status) ? status : 'draft';

    const data = {
      title: String(title),
      slug: String(slug),
      description: description ? String(description) : undefined,
      thumbnail: thumbnail ? String(thumbnail) : undefined,
      videoUrl: videoUrl ? String(videoUrl) : undefined,
      playlist: playlist ? String(playlist) : undefined,
      tags: tags ? String(tags) : undefined,
      // S4 FIX : sanitisation du champ resume (HTML riche)
      resume: resume ? sanitizeHtml(String(resume)) : undefined,
      status: safeStatus,
      publishedAt: safeStatus === 'published' ? new Date() : null,
    };

    const video = await prisma.video.create({ data });
    return NextResponse.json(video);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT /api/videos — Mettre à jour (auth requis)
export async function PUT(request: NextRequest) {
  if (!(await authenticate())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, title, description, thumbnail, videoUrl, playlist, tags, resume, status } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Slug requis' }, { status: 400 });
    }

    const allowedStatuses = ['draft', 'published'];
    const safeStatus = allowedStatuses.includes(status) ? status : 'draft';

    const existing = await prisma.video.findUnique({ where: { slug }, select: { publishedAt: true } });
    const publishedAt = safeStatus === 'published'
      ? (existing?.publishedAt ?? new Date())
      : null;

    const updateData = {
      ...(title !== undefined && { title: String(title) }),
      ...(description !== undefined && { description: String(description) }),
      ...(thumbnail !== undefined && { thumbnail: String(thumbnail) }),
      ...(videoUrl !== undefined && { videoUrl: String(videoUrl) }),
      ...(playlist !== undefined && { playlist: String(playlist) }),
      ...(tags !== undefined && { tags: String(tags) }),
      ...(resume !== undefined && { resume: sanitizeHtml(String(resume)) }),
      status: safeStatus,
      publishedAt,
      updatedAt: new Date(),
    };

    const video = await prisma.video.update({ where: { slug }, data: updateData });
    return NextResponse.json(video);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE /api/videos — Supprimer (auth requis)
export async function DELETE(request: NextRequest) {
  if (!(await authenticate())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Slug requis' }, { status: 400 });
    }

    await prisma.video.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
