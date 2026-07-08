import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const db = await getDb();

    await db.run(`
      UPDATE Article SET
        title = ?, slug = ?, content = ?, metaDescription = ?, metaKeywords = ?,
        coverImage = ?, geoRegion = ?, cityLocation = ?, published = ?, category = ?,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      body.title, body.slug, body.content, body.metaDescription, body.metaKeywords,
      body.coverImage, body.geoRegion, body.cityLocation, body.published ? 1 : 0, body.category || 'article',
      id
    ]);

    const article = await db.get('SELECT * FROM Article WHERE id = ?', [id]);
    if (article) article.published = Boolean(article.published);

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
    const db = await getDb();
    
    await db.run('DELETE FROM Article WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Article deleted' });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
