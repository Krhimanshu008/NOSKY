import { MongoClient, ServerApiVersion } from 'mongodb';
import crypto from 'crypto';

/**
 * Get the database connection. Connection only runs once
 * per process lifetime via the _mongoClientPromise flag.
 */
export async function getDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env');
  }

  const uri = process.env.MONGODB_URI;

  if (globalThis._mongoClientPromise) {
    const client = await globalThis._mongoClientPromise;
    return client.db("nosky");
  }

  globalThis._mongoClientPromise = (async () => {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    
    await client.connect();
    return client;
  })();

  const client = await globalThis._mongoClientPromise;
  return client.db("nosky");
}

export async function getDb() {
  const db = await getDatabase();
  return db.collection("articles");
}

export function generateId() {
  return crypto.randomBytes(16).toString('hex');
}
