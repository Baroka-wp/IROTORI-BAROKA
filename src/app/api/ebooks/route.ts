import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate } from '@/lib/auth';
import { sanitizeHtml } from '@/lib/sanitize';

// GET /api/ebooks — Liste (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const allowedStatuses = ['draft', 'published'];
    const where: { status?: string } = {};
    if (status && allowedStatuses.includes(status)) where.status = status;

    const ebooks = await prisma.ebook.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        subtitle: true,
        shortDescription: true,
        description: true,
        coverImage: true,
        downloadUrl: true,
        price: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ data: ebooks });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// POST /api/ebooks — Créer (auth requis)
export async function POST(request: NextRequest) {
  if (!(await authenticate())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, subtitle, shortDescription, description, coverImage, downloadUrl, price, status } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Titre et slug requis' }, { status: 400 });
    }

    const allowedStatuses = ['draft', 'published'];
    const safeStatus = allowedStatuses.includes(status) ? status : 'draft';
    const safePrice = typeof price === 'number' && price >= 0 ? price : 0;

    const data = {
      title: String(title),
      slug: String(slug),
      subtitle: subtitle ? String(subtitle) : undefined,
      shortDescription: shortDescription ? String(shortDescription) : undefined,
      // S4 FIX : sanitisation de la description HTML riche
      description: description ? sanitizeHtml(String(description)) : undefined,
      coverImage: coverImage ? String(coverImage) : undefined,
      downloadUrl: downloadUrl ? String(downloadUrl) : undefined,
      price: safePrice,
      status: safeStatus,
      publishedAt: safeStatus === 'published' ? new Date() : null,
    };

    const ebook = await prisma.ebook.create({ data });
    return NextResponse.json(ebook);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT /api/ebooks — Mettre à jour (auth requis)
export async function PUT(request: NextRequest) {
  if (!(await authenticate())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, title, subtitle, shortDescription, description, coverImage, downloadUrl, price, status } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Slug requis' }, { status: 400 });
    }

    const allowedStatuses = ['draft', 'published'];
    const safeStatus = allowedStatuses.includes(status) ? status : 'draft';

    const existing = await prisma.ebook.findUnique({ where: { slug }, select: { publishedAt: true } });
    const publishedAt = safeStatus === 'published'
      ? (existing?.publishedAt ?? new Date())
      : null;

    const updateData = {
      ...(title !== undefined && { title: String(title) }),
      ...(subtitle !== undefined && { subtitle: String(subtitle) }),
      ...(shortDescription !== undefined && { shortDescription: String(shortDescription) }),
      ...(description !== undefined && { description: sanitizeHtml(String(description)) }),
      ...(coverImage !== undefined && { coverImage: String(coverImage) }),
      ...(downloadUrl !== undefined && { downloadUrl: String(downloadUrl) }),
      ...(price !== undefined && typeof price === 'number' && price >= 0 && { price }),
      status: safeStatus,
      publishedAt,
      updatedAt: new Date(),
    };

    const ebook = await prisma.ebook.update({ where: { slug }, data: updateData });
    return NextResponse.json(ebook);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE /api/ebooks — Supprimer (auth requis)
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

    await prisma.ebook.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
