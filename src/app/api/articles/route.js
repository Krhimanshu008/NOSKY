import { NextResponse } from 'next/server';
import { getDb, generateId } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import cache from '@/lib/cache';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const includeUnpublished = searchParams.get('all') === 'true';

  try {
    const isAdmin = await verifyAuth();
    const collection = await getDb();
    
    let articles;
    if (isAdmin && includeUnpublished) {
      articles = await collection.find({}).sort({ createdAt: -1 }).toArray();
    } else {
      articles = await collection.find({ published: 1 }).sort({ createdAt: -1 }).toArray();
    }
    
    // Convert to boolean for frontend
    articles = articles.map(a => ({
      ...a,
      published: Boolean(a.published)
    }));

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const collection = await getDb();
    
    let slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const existing = await collection.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const id = generateId();
    const newArticle = {
      id,
      title: body.title,
      slug,
      content: body.content,
      metaDescription: body.metaDescription || '',
      metaKeywords: body.metaKeywords || '',
      coverImage: body.coverImage || '',
      geoRegion: body.geoRegion || '',
      cityLocation: body.cityLocation || '',
      published: body.published ? 1 : 0,
      category: body.category || 'article',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await collection.insertOne(newArticle);

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

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
