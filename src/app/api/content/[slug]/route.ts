import { NextRequest, NextResponse } from 'next/server';
import { getContentBySlug } from '@/lib/queries';

// GET /api/content/[slug] — Endpoint universel (public)
// Cherche le slug dans reflexions, vidéos et e-books en parallèle.
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const content = await getContentBySlug(slug);

    if (!content) {
      return NextResponse.json({ error: 'Contenu non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ data: content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
