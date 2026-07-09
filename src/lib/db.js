import { MongoClient, ServerApiVersion } from 'mongodb';
import crypto from 'crypto';

/**
 * Get the database connection. Connection only runs once
 * per process lifetime via the _dbClientPromise flag.
 */
export async function getDb() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env');
  }

  const uri = process.env.MONGODB_URI;

  if (globalThis._dbPromise && globalThis._dbInitialized) {
    return globalThis._dbPromise;
  }

  if (globalThis._dbPromise) {
    return globalThis._dbPromise;
  }

  globalThis._dbPromise = (async () => {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    
    await client.connect();
    
    // We return a small wrapper that mimics the sqlite async methods slightly
    // but mostly we will refactor callers to use standard MongoDB syntax.
    // For now, we return the 'articles' collection directly.
    const db = client.db("nosky");
    const collection = db.collection("articles");
    
    globalThis._dbInitialized = true;
    return collection;
  })();

  return globalThis._dbPromise;
}

export function generateId() {
  return crypto.randomBytes(16).toString('hex');
}

