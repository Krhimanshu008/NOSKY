import { describe, it, expect, vi, beforeEach } from 'vitest';
import { proxy } from '@/proxy';
import { NextResponse } from 'next/server';
import * as jose from 'jose';

vi.mock('next/server', () => ({
  NextResponse: {
    next: vi.fn(),
    redirect: vi.fn()
  }
}));

vi.mock('jose', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    jwtVerify: vi.fn()
  };
});

describe('proxy middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  const createMockRequest = (pathname, tokenValue = undefined) => {
    return {
      nextUrl: {
        pathname
      },
      url: 'http://localhost:3000' + pathname,
      cookies: {
        get: vi.fn().mockReturnValue(tokenValue !== undefined ? { value: tokenValue } : undefined)
      }
    };
  };

  it('skips non-admin routes', async () => {
    const request = createMockRequest('/about');
    NextResponse.next.mockReturnValue('mock-next');

    const result = await proxy(request);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(result).toBe('mock-next');
  });

  it('redirects to /admin if accessing protected route without a token', async () => {
    const request = createMockRequest('/admin/settings');
    NextResponse.redirect.mockReturnValue('mock-redirect');

    const result = await proxy(request);

    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/admin', request.url));
    expect(result).toBe('mock-redirect');
  });

  it('redirects to /admin/dashboard if accessing /admin with a valid token', async () => {
    const request = createMockRequest('/admin', 'valid-token');
    vi.mocked(jose.jwtVerify).mockResolvedValue({ payload: { admin: true } });
    NextResponse.redirect.mockReturnValue('mock-redirect');

    const result = await proxy(request);

    expect(jose.jwtVerify).toHaveBeenCalled();
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/admin/dashboard', request.url));
    expect(result).toBe('mock-redirect');
  });

  it('allows access to protected route with a valid token', async () => {
    const request = createMockRequest('/admin/settings', 'valid-token');
    vi.mocked(jose.jwtVerify).mockResolvedValue({ payload: { admin: true } });
    NextResponse.next.mockReturnValue('mock-next');

    const result = await proxy(request);

    expect(jose.jwtVerify).toHaveBeenCalled();
    expect(NextResponse.next).toHaveBeenCalled();
    expect(result).toBe('mock-next');
  });

  it('redirects to /admin if token is invalid (jwtVerify throws)', async () => {
    const request = createMockRequest('/admin/settings', 'invalid-token');
    vi.mocked(jose.jwtVerify).mockRejectedValue(new Error('Invalid signature'));
    NextResponse.redirect.mockReturnValue('mock-redirect');

    const result = await proxy(request);

    expect(jose.jwtVerify).toHaveBeenCalled();
    // Because token is invalid, isAuthenticated stays false.
    // For path !== '/admin', if !isAuthenticated, it redirects to /admin.
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL('/admin', request.url));
    expect(result).toBe('mock-redirect');
  });

  it('allows access to /admin if token is invalid (jwtVerify throws) - does not redirect to dashboard', async () => {
    const request = createMockRequest('/admin', 'invalid-token');
    vi.mocked(jose.jwtVerify).mockRejectedValue(new Error('Invalid signature'));
    NextResponse.next.mockReturnValue('mock-next');

    const result = await proxy(request);

    expect(jose.jwtVerify).toHaveBeenCalled();
    // Because token is invalid, isAuthenticated stays false.
    // For path === '/admin', if !isAuthenticated, it falls through to NextResponse.next()
    expect(NextResponse.next).toHaveBeenCalled();
    expect(result).toBe('mock-next');
  });
});
