import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getDatabase, getDb, getUsersCollection, generateId } from '../../src/lib/db';

const mockConnect = vi.fn().mockImplementation(async function() { return this; });
const mockCollection = vi.fn((name) => ({ collectionName: name }));
const mockDb = vi.fn((name) => ({
  databaseName: name,
  collection: mockCollection
}));

vi.mock('mongodb', () => {
  return {
    MongoClient: class {
      constructor(uri, options) {
        this.uri = uri;
        this.options = options;
      }
      connect = mockConnect;
      db = mockDb;
    },
    ServerApiVersion: {
      v1: '1'
    }
  };
});

describe('db.js', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
    delete globalThis._mongoClientPromise;
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
    delete globalThis._mongoClientPromise;
  });

  describe('getDatabase', () => {
    it('throws an error if no URI is provided', async () => {
      delete process.env.MONGODB_URI;
      delete process.env.TEST_MONGODB_URI;

      await expect(getDatabase()).rejects.toThrow('Please add your Mongo URI to .env');
    });

    it('connects to the database and returns the "nosky" database', async () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017';

      const db = await getDatabase();

      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockDb).toHaveBeenCalledWith('nosky');
      expect(db.databaseName).toBe('nosky');
    });

    it('reuses the existing connection if it exists', async () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017';

      await getDatabase();
      await getDatabase();

      // If getDatabase reuses the _mongoClientPromise, it will only connect once.
      // Additionally, we can verify that MongoClient was not instantiated multiple times
      // but testing that mockConnect is called only once is sufficient to prove reuse.
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockDb).toHaveBeenCalledWith('nosky');
    });

  });

  describe('getDb', () => {
    it('returns the "articles" collection', async () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017';

      const collection = await getDb();

      expect(mockCollection).toHaveBeenCalledWith('articles');
      expect(collection.collectionName).toBe('articles');
    });
  });

  describe('getUsersCollection', () => {
    it('returns the "users" collection', async () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017';

      const collection = await getUsersCollection();

      expect(mockCollection).toHaveBeenCalledWith('users');
      expect(collection.collectionName).toBe('users');
    });
  });

  describe('generateId', () => {
    it('generates a 32-character hex string', () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(id1).toHaveLength(32);
      expect(id2).toHaveLength(32);
      expect(id1).not.toBe(id2);
      expect(/^[0-9a-f]{32}$/.test(id1)).toBe(true);
    });
  });
});
