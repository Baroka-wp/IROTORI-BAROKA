import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate } from '@/lib/auth';
import { sanitizeHtml } from '@/lib/sanitize';

// GET /api/reflexions — Liste (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const tags = searchParams.get('tags');

    // Validation stricte du filtre status — refuse toute valeur arbitraire
    const allowedStatuses = ['draft', 'published'];
    const where: { status?: string; tags?: { contains: string; mode: 'insensitive' } } = {};
    if (status && allowedStatuses.includes(status)) where.status = status;
    if (tags) where.tags = { contains: tags, mode: 'insensitive' };

    const reflexions = await prisma.reflexion.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      // S6 FIX : sélection explicite — pas de fuite de champs internes
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        tags: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ data: reflexions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// POST /api/reflexions — Créer (auth requis)
export async function POST(request: NextRequest) {
  if (!(await authenticate())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // S6 FIX : whitelist explicite des champs — refuse id, createdAt, updatedAt injectés
    const { title, slug, content, tags, status } = body;
    if (!title || !slug) {
      return NextResponse.json({ error: 'Titre et slug requis' }, { status: 400 });
    }

    const allowedStatuses = ['draft', 'published'];
    const safeStatus = allowedStatuses.includes(status) ? status : 'draft';

    const data = {
      title: String(title),
      slug: String(slug),
      // S4 FIX : sanitisation du HTML riche avant stockage
      content: sanitizeHtml(String(content ?? '')),
      tags: tags ? String(tags) : undefined,
      status: safeStatus,
      publishedAt: safeStatus === 'published' ? new Date() : null,
    };

    const reflexion = await prisma.reflexion.create({ data });
    return NextResponse.json(reflexion);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT /api/reflexions — Mettre à jour (auth requis)
export async function PUT(request: NextRequest) {
  if (!(await authenticate())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, title, content, tags, status } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Slug requis' }, { status: 400 });
    }

    const allowedStatuses = ['draft', 'published'];
    const safeStatus = allowedStatuses.includes(status) ? status : 'draft';

    // S6 FIX : whitelist — seuls les champs légitimes sont mis à jour
    // C7 FIX : publishedAt n'est défini qu'à la première publication (on récupère la valeur existante)
    const existing = await prisma.reflexion.findUnique({ where: { slug }, select: { publishedAt: true } });
    const publishedAt = safeStatus === 'published'
      ? (existing?.publishedAt ?? new Date())
      : null;

    const updateData = {
      ...(title !== undefined && { title: String(title) }),
      ...(content !== undefined && { content: sanitizeHtml(String(content)) }),
      ...(tags !== undefined && { tags: String(tags) }),
      status: safeStatus,
      publishedAt,
      updatedAt: new Date(),
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

// DELETE /api/reflexions — Supprimer (auth requis)
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

    await prisma.reflexion.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
