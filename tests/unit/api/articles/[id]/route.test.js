import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DELETE, PUT } from '@/app/api/articles/[id]/route';
import { verifyAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import cache from '@/lib/cache';
import { revalidatePath } from 'next/cache';

vi.mock('@/lib/auth', () => ({
  verifyAuth: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  getDb: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/cache', () => ({
  default: {
    invalidatePrefix: vi.fn(),
  },
}));

describe('PUT /api/articles/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when unauthorized', async () => {
    verifyAuth.mockResolvedValue(false);

    const request = new Request('http://localhost:3000/api/articles/123');
    const response = await PUT(request, { params: Promise.resolve({ id: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 400 when article ID is missing', async () => {
    verifyAuth.mockResolvedValue(true);

    const request = new Request('http://localhost:3000/api/articles/');
    const response = await PUT(request, { params: Promise.resolve({ id: undefined }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Article ID is required');
  });

  it('updates article and invalidates caches successfully', async () => {
    verifyAuth.mockResolvedValue(true);
    const mockCollection = {
      updateOne: vi.fn().mockResolvedValue({ modifiedCount: 1 }),
      findOne: vi.fn().mockResolvedValue({ id: '123', slug: 'test-article', published: 1 })
    };
    getDb.mockResolvedValue(mockCollection);

    const body = {
      title: 'New Title',
      slug: 'test-article',
      content: 'New content'
    };
    const request = new Request('http://localhost:3000/api/articles/123', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const response = await PUT(request, { params: Promise.resolve({ id: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(mockCollection.updateOne).toHaveBeenCalledWith({ id: '123' }, expect.any(Object));
    expect(mockCollection.findOne).toHaveBeenCalledWith({ id: '123' });
    expect(cache.invalidatePrefix).toHaveBeenCalledWith('articles:');
    expect(cache.invalidatePrefix).toHaveBeenCalledWith('achievements:');
    expect(revalidatePath).toHaveBeenCalledWith('/article');
    expect(revalidatePath).toHaveBeenCalledWith('/achievements');
    expect(revalidatePath).toHaveBeenCalledWith('/article/test-article');
    expect(revalidatePath).toHaveBeenCalledWith('/achievement/test-article');
  });

  it('returns 500 on database error', async () => {
    verifyAuth.mockResolvedValue(true);
    getDb.mockRejectedValue(new Error('DB connection failed'));

    const body = { title: 'New Title' };
    const request = new Request('http://localhost:3000/api/articles/123', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const response = await PUT(request, { params: Promise.resolve({ id: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to update article');
  });
});


describe('DELETE /api/articles/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when unauthorized', async () => {
    verifyAuth.mockResolvedValue(false);

    const request = new Request('http://localhost:3000/api/articles/123');
    const response = await DELETE(request, { params: Promise.resolve({ id: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 400 when article ID is missing', async () => {
    verifyAuth.mockResolvedValue(true);

    const request = new Request('http://localhost:3000/api/articles/');
    const response = await DELETE(request, { params: Promise.resolve({ id: undefined }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Article ID is required');
  });

  it('deletes article and invalidates caches successfully', async () => {
    verifyAuth.mockResolvedValue(true);
    const mockCollection = {
      findOne: vi.fn().mockResolvedValue({ slug: 'test-article' }),
      deleteOne: vi.fn().mockResolvedValue({ deletedCount: 1 })
    };
    getDb.mockResolvedValue(mockCollection);

    const request = new Request('http://localhost:3000/api/articles/123');
    const response = await DELETE(request, { params: Promise.resolve({ id: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockCollection.findOne).toHaveBeenCalledWith({ id: '123' }, { projection: { slug: 1 } });
    expect(mockCollection.deleteOne).toHaveBeenCalledWith({ id: '123' });
    expect(cache.invalidatePrefix).toHaveBeenCalledWith('articles:');
    expect(cache.invalidatePrefix).toHaveBeenCalledWith('achievements:');
    expect(revalidatePath).toHaveBeenCalledWith('/article');
    expect(revalidatePath).toHaveBeenCalledWith('/achievements');
    expect(revalidatePath).toHaveBeenCalledWith('/article/test-article');
    expect(revalidatePath).toHaveBeenCalledWith('/achievement/test-article');
  });

  it('returns 500 on database error', async () => {
    verifyAuth.mockResolvedValue(true);
    getDb.mockRejectedValue(new Error('DB error'));

    const request = new Request('http://localhost:3000/api/articles/123');
    const response = await DELETE(request, { params: Promise.resolve({ id: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to delete article');
  });
});
