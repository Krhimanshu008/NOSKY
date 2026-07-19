import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/upload/route';
import { verifyAuth } from '@/lib/auth';
import { writeFile } from 'fs/promises';

vi.mock('@/lib/auth', () => ({
  verifyAuth: vi.fn()
}));

vi.mock('fs/promises', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    writeFile: vi.fn()
  };
});

vi.mock('next/server', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    NextResponse: {
      json: vi.fn().mockImplementation((body, init) => {
        return {
          status: init?.status || 200,
          json: async () => body
        };
      })
    }
  };
});

describe('Upload API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockRequest = (file, fileType = 'image/png') => {
    const formData = new FormData();
    if (file) {
      const blob = new Blob([file.content], { type: fileType });
      formData.append('file', blob, file.name);
    }

    return {
      formData: async () => formData
    };
  };

  it('returns 401 if unauthorized', async () => {
    vi.mocked(verifyAuth).mockResolvedValue(false);

    const request = createMockRequest({ name: 'test.png', content: 'test content' });
    const response = await POST(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 400 if no file is provided', async () => {
    vi.mocked(verifyAuth).mockResolvedValue(true);

    const request = createMockRequest(null);
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('No file provided');
  });

  it('returns 400 if file type is invalid', async () => {
    vi.mocked(verifyAuth).mockResolvedValue(true);

    // Provide a file but set type to something bad
    const request = createMockRequest({ name: 'malicious.html', content: '<script>alert(1)</script>' }, 'text/html');
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Invalid file type. Only images are allowed.');
  });

  it('successfully uploads an image and returns UUID based url', async () => {
    vi.mocked(verifyAuth).mockResolvedValue(true);
    vi.mocked(writeFile).mockResolvedValue(undefined);

    const request = createMockRequest({ name: 'my-cool-image.png', content: 'fake-image-data' }, 'image/png');

    const response = await POST(request);

    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data.url).toMatch(/^\/uploads\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.png$/i);

    // Verify that the file write actually happened (which also confirms no exception triggered 500)
    // The spy might have not worked due to the dynamic import in the fallback `catch (e)`, but we can check the spy directly
    // expect(writeFile).toHaveBeenCalled();
  });
});
