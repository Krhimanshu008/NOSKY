import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getDatabase } from '@/lib/db';
import { MongoClient } from 'mongodb';

vi.mock('mongodb', () => {
  const mockDb = vi.fn().mockReturnValue('mocked-db-instance');
  const mockConnect = vi.fn().mockResolvedValue(undefined);

  return {
    MongoClient: class {
      constructor(uri, options) {
        this.uri = uri;
        this.options = options;
      }
      connect = mockConnect;
      db = mockDb;
    },
    ServerApiVersion: { v1: '1' }
  };
});

describe('getDatabase', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    // Clear the global promise so each test starts fresh
    delete globalThis._mongoClientPromise;
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  it('throws an error if MONGODB_URI and TEST_MONGODB_URI are not set', async () => {
    delete process.env.MONGODB_URI;
    delete process.env.TEST_MONGODB_URI;

    await expect(getDatabase()).rejects.toThrow('Please add your Mongo URI to .env');
  });

  it('connects to the database and returns the nosky db if URI is provided', async () => {
    process.env.MONGODB_URI = 'mongodb://localhost:27017';

    const db = await getDatabase();

    expect(db).toBe('mocked-db-instance');
  });
});
