import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/reflexions/[slug] - Get single reflexion
export async function GET(request: Request, context: any) {
  try {
    const { slug } = await context.params;
    const reflexion = await prisma.reflexion.findUnique({
      where: { slug },
    });

    if (!reflexion) {
      return NextResponse.json({ error: 'Reflexion not found' }, { status: 404 });
    }

    return NextResponse.json(reflexion);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
