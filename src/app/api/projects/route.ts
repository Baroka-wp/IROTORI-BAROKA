import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticate } from '@/lib/auth';

// GET /api/projects — Liste (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const allowedStatuses = ['in_progress', 'completed', 'archived'];
    const allowedCategories = ['tech', 'business', 'social', 'education', 'other'];

    const where: { status?: string; category?: string; featured?: boolean } = {};
    if (status && allowedStatuses.includes(status)) where.status = status;
    if (category && allowedCategories.includes(category)) where.category = category;
    if (featured !== null && featured !== undefined) where.featured = featured === 'true';

    const projects = await prisma.project.findMany({
      where,
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        longDescription: true,
        coverImage: true,
        websiteUrl: true,
        githubUrl: true,
        demoUrl: true,
        status: true,
        startDate: true,
        endDate: true,
        technologies: true,
        category: true,
        teamMembers: true,
        partners: true,
        featured: true,
        order: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ data: projects });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// POST /api/projects — Créer (auth requis)
export async function POST(request: NextRequest) {
  if (!(await authenticate())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title, slug, description, longDescription, coverImage,
      websiteUrl, githubUrl, demoUrl, status, startDate, endDate,
      technologies, category, teamMembers, partners, featured, order,
    } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Titre et slug requis' }, { status: 400 });
    }

    const allowedStatuses = ['in_progress', 'completed', 'archived'];
    const allowedCategories = ['tech', 'business', 'social', 'education', 'other'];

    const data = {
      title: String(title),
      slug: String(slug),
      description: description ? String(description) : undefined,
      longDescription: longDescription ? String(longDescription) : undefined,
      coverImage: coverImage ? String(coverImage) : undefined,
      websiteUrl: websiteUrl ? String(websiteUrl) : undefined,
      githubUrl: githubUrl ? String(githubUrl) : undefined,
      demoUrl: demoUrl ? String(demoUrl) : undefined,
      status: allowedStatuses.includes(status) ? status : 'in_progress',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      technologies: technologies ? String(technologies) : undefined,
      category: allowedCategories.includes(category) ? category : undefined,
      teamMembers: teamMembers ? String(teamMembers) : undefined,
      partners: partners ? String(partners) : undefined,
      featured: typeof featured === 'boolean' ? featured : false,
      order: typeof order === 'number' ? order : 0,
    };

    const project = await prisma.project.create({ data });
    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT /api/projects — Mettre à jour (auth requis)
export async function PUT(request: NextRequest) {
  if (!(await authenticate())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      slug, title, description, longDescription, coverImage,
      websiteUrl, githubUrl, demoUrl, status, startDate, endDate,
      technologies, category, teamMembers, partners, featured, order,
    } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Slug requis' }, { status: 400 });
    }

    const allowedStatuses = ['in_progress', 'completed', 'archived'];
    const allowedCategories = ['tech', 'business', 'social', 'education', 'other'];

    const updateData = {
      ...(title !== undefined && { title: String(title) }),
      ...(description !== undefined && { description: String(description) }),
      ...(longDescription !== undefined && { longDescription: String(longDescription) }),
      ...(coverImage !== undefined && { coverImage: String(coverImage) }),
      ...(websiteUrl !== undefined && { websiteUrl: String(websiteUrl) }),
      ...(githubUrl !== undefined && { githubUrl: String(githubUrl) }),
      ...(demoUrl !== undefined && { demoUrl: String(demoUrl) }),
      ...(status !== undefined && allowedStatuses.includes(status) && { status }),
      ...(startDate !== undefined && { startDate: new Date(startDate) }),
      ...(endDate !== undefined && { endDate: new Date(endDate) }),
      ...(technologies !== undefined && { technologies: String(technologies) }),
      ...(category !== undefined && allowedCategories.includes(category) && { category }),
      ...(teamMembers !== undefined && { teamMembers: String(teamMembers) }),
      ...(partners !== undefined && { partners: String(partners) }),
      ...(typeof featured === 'boolean' && { featured }),
      ...(typeof order === 'number' && { order }),
      updatedAt: new Date(),
    };

    const project = await prisma.project.update({ where: { slug }, data: updateData });
    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE /api/projects — Supprimer (auth requis)
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

    await prisma.project.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
