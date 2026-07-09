import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import cache from '@/lib/cache';

/**
 * Admin-only endpoint to manually purge cache + trigger ISR revalidation.
 * POST /api/revalidate
 * Body: { "path": "/article" | "/achievements" | "all" }
 */
export async function POST(request) {
  try {
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const targetPath = body.path || 'all';

    if (targetPath === 'all') {
      cache.clear();
      revalidatePath('/article');
      revalidatePath('/achievements');
      revalidatePath('/');
      return NextResponse.json({ revalidated: true, path: 'all' });
    }

    // Invalidate cache by prefix based on path
    if (targetPath.startsWith('/article')) {
      cache.invalidatePrefix('articles:');
    }
    if (targetPath.startsWith('/achievement')) {
      cache.invalidatePrefix('achievements:');
    }

    revalidatePath(targetPath);

    return NextResponse.json({ revalidated: true, path: targetPath });
  } catch (error) {
    console.error('Error revalidating:', error);
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 });
  }
}
