import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import cache from '@/lib/cache';

export async function PUT(request, { params }) {
  try {
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const collection = await getDb();

    await collection.updateOne({ id }, {
      $set: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        metaDescription: body.metaDescription,
        metaKeywords: body.metaKeywords,
        coverImage: body.coverImage,
        geoRegion: body.geoRegion,
        cityLocation: body.cityLocation,
        published: body.published ? 1 : 0,
        category: body.category || 'article',
        updatedAt: new Date()
      }
    });

    const article = await collection.findOne({ id });
    if (article) article.published = Boolean(article.published);

    // Invalidate caches and trigger ISR revalidation
    cache.invalidatePrefix('articles:');
    cache.invalidatePrefix('achievements:');
    revalidatePath('/article');
    revalidatePath('/achievements');
    if (article) {
      revalidatePath(`/article/${article.slug}`);
      revalidatePath(`/achievement/${article.slug}`);
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const collection = await getDb();
    
    // Get slug before deleting for cache invalidation
    const article = await collection.findOne({ id }, { projection: { slug: 1 } });
    
    await collection.deleteOne({ id });

    // Invalidate all content caches
    cache.invalidatePrefix('articles:');
    cache.invalidatePrefix('achievements:');
    revalidatePath('/article');
    revalidatePath('/achievements');
    if (article) {
      revalidatePath(`/article/${article.slug}`);
      revalidatePath(`/achievement/${article.slug}`);
    }

    return NextResponse.json({ success: true, message: 'Article deleted' });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
