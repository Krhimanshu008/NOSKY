import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import cache from '@/lib/cache';

export async function DELETE(request) {
  try {
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ids } = await request.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
    }

    const collection = await getDb();

    // Get slugs before deleting for cache invalidation
    const articles = await collection.find({ id: { $in: ids } }, { projection: { slug: 1 } }).toArray();

    await collection.deleteMany({ id: { $in: ids } });

    // Invalidate all content caches
    cache.invalidatePrefix('articles:');
    cache.invalidatePrefix('achievements:');
    revalidatePath('/article');
    revalidatePath('/achievements');

    for (const article of articles) {
      if (article.slug) {
        revalidatePath(`/article/${article.slug}`);
        revalidatePath(`/achievement/${article.slug}`);
      }
    }

    return NextResponse.json({ success: true, message: `${ids.length} articles deleted` });
  } catch (error) {
    console.error('Error deleting articles:', error);
    return NextResponse.json({ error: 'Failed to delete articles' }, { status: 500 });
  }
}
