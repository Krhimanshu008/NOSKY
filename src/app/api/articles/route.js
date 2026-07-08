import { NextResponse } from 'next/server';
import { getDb, generateId } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const includeUnpublished = searchParams.get('all') === 'true';

  try {
    const isAdmin = await verifyAuth();
    const db = await getDb();
    
    let articles;
    if (isAdmin && includeUnpublished) {
      articles = await db.all('SELECT * FROM Article ORDER BY createdAt DESC');
    } else {
      articles = await db.all('SELECT * FROM Article WHERE published = 1 ORDER BY createdAt DESC');
    }
    
    // SQLite stores booleans as 0/1, map them to true/false
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
    const db = await getDb();
    
    let slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const existing = await db.get('SELECT id FROM Article WHERE slug = ?', [slug]);
    if (existing) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const id = generateId();
    await db.run(`
      INSERT INTO Article (
        id, title, slug, content, metaDescription, metaKeywords, coverImage, geoRegion, cityLocation, published, category
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, body.title, slug, body.content, body.metaDescription || '', body.metaKeywords || '',
      body.coverImage || '', body.geoRegion || '', body.cityLocation || '',
      body.published ? 1 : 0, body.category || 'article'
    ]);

    const article = await db.get('SELECT * FROM Article WHERE id = ?', [id]);
    if (article) article.published = Boolean(article.published);

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
