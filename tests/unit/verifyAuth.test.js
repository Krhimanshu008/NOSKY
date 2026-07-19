import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifyAuth } from '@/lib/auth';
import * as jose from 'jose';
import { cookies } from 'next/headers';

vi.mock('next/headers', () => ({
  cookies: vi.fn()
}));

vi.mock('jose', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    jwtVerify: vi.fn()
  };
});

describe('verifyAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  it('returns false if no token is present', async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: vi.fn().mockReturnValue(undefined)
    });

    const result = await verifyAuth();
    expect(result).toBe(false);
  });

  it('returns false if jwtVerify throws an error', async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: 'invalid-token' })
    });
    
    vi.mocked(jose.jwtVerify).mockRejectedValue(new Error('Invalid token'));

    const result = await verifyAuth();
    expect(result).toBe(false);
  });

  it('returns true if jwtVerify succeeds', async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: 'valid-token' })
    });
    
    vi.mocked(jose.jwtVerify).mockResolvedValue({ payload: { username: 'admin' } });

    const result = await verifyAuth();
    expect(result).toBe(true);
  });
});
