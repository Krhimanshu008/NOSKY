import { describe, it, expect, vi, beforeEach } from 'vitest';
import { proxy } from '@/proxy';
import { NextResponse } from 'next/server';
import * as jose from 'jose';

vi.mock('next/server', () => {
  const nextResponse = {
    next: vi.fn(() => 'next-called'),
    redirect: vi.fn((url) => `redirect-called:${url}`),
  };
  return {
    NextResponse: nextResponse,
  };
});

vi.mock('jose', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    jwtVerify: vi.fn(),
  };
});

describe('proxy middleware', () => {
  let mockRequest;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';

    mockRequest = {
      nextUrl: {
        pathname: '',
      },
      cookies: {
        get: vi.fn(),
      },
      url: 'http://localhost:3000',
    };
  });

  it('should call NextResponse.next() if path does not start with /admin', async () => {
    mockRequest.nextUrl.pathname = '/about';

    const result = await proxy(mockRequest);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(result).toBe('next-called');
  });

  it('should call NextResponse.next() for /admin when unauthenticated', async () => {
    mockRequest.nextUrl.pathname = '/admin';
    mockRequest.cookies.get.mockReturnValue(undefined);

    const result = await proxy(mockRequest);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(result).toBe('next-called');
  });

  it('should redirect to /admin/dashboard for /admin when authenticated', async () => {
    mockRequest.nextUrl.pathname = '/admin';
    mockRequest.cookies.get.mockReturnValue({ value: 'valid-token' });
    vi.mocked(jose.jwtVerify).mockResolvedValue({ payload: { username: 'admin' } });

    const result = await proxy(mockRequest);

    expect(jose.jwtVerify).toHaveBeenCalled();
    expect(NextResponse.redirect).toHaveBeenCalled();

    // Check URL argument
    const redirectUrl = NextResponse.redirect.mock.calls[0][0];
    expect(redirectUrl.pathname).toBe('/admin/dashboard');
  });

  it('should redirect to /admin for protected routes when unauthenticated', async () => {
    mockRequest.nextUrl.pathname = '/admin/settings';
    mockRequest.cookies.get.mockReturnValue(undefined);

    const result = await proxy(mockRequest);

    expect(NextResponse.redirect).toHaveBeenCalled();

    // Check URL argument
    const redirectUrl = NextResponse.redirect.mock.calls[0][0];
    expect(redirectUrl.pathname).toBe('/admin');
  });

  it('should call NextResponse.next() for protected routes when authenticated', async () => {
    mockRequest.nextUrl.pathname = '/admin/settings';
    mockRequest.cookies.get.mockReturnValue({ value: 'valid-token' });
    vi.mocked(jose.jwtVerify).mockResolvedValue({ payload: { username: 'admin' } });

    const result = await proxy(mockRequest);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(result).toBe('next-called');
  });

  it('should redirect to /admin for protected routes when authentication fails (invalid token)', async () => {
    mockRequest.nextUrl.pathname = '/admin/settings';
    mockRequest.cookies.get.mockReturnValue({ value: 'invalid-token' });
    vi.mocked(jose.jwtVerify).mockRejectedValue(new Error('Invalid token'));

    const result = await proxy(mockRequest);

    expect(NextResponse.redirect).toHaveBeenCalled();

    // Check URL argument
    const redirectUrl = NextResponse.redirect.mock.calls[0][0];
    expect(redirectUrl.pathname).toBe('/admin');
  });
});
