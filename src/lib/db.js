import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import crypto from 'crypto';

/**
 * Get the database connection. Schema initialization only runs once
 * per process lifetime via the _dbInitialized flag.
 */
export async function getDb() {
  // Fast path: return existing connection if already initialized
  if (globalThis._dbPromise && globalThis._dbInitialized) {
    return globalThis._dbPromise;
  }

  // Return in-progress initialization if it's already started
  if (globalThis._dbPromise) {
    return globalThis._dbPromise;
  }
  
  // First call: open connection + run schema setup once
  globalThis._dbPromise = (async () => {
    const db = await open({
      filename: path.join(process.cwd(), 'dev.db'),
      driver: sqlite3.Database
    });

    // Enable WAL mode for better concurrent read performance
    await db.exec('PRAGMA journal_mode=WAL');
    await db.exec('PRAGMA cache_size=2000');

    await db.exec(`
    CREATE TABLE IF NOT EXISTS Article (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      metaDescription TEXT NOT NULL,
      metaKeywords TEXT,
      coverImage TEXT,
      geoRegion TEXT,
      cityLocation TEXT,
      published INTEGER DEFAULT 0,
      category TEXT DEFAULT 'article',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Safely add the 'category' column to existing DBs if it doesn't exist
    try {
      await db.exec(`ALTER TABLE Article ADD COLUMN category TEXT DEFAULT 'article'`);
    } catch (err) {
      // Ignore if column already exists (sqlite throws error if column exists)
    }

    globalThis._dbInitialized = true;
    return db;
  })();

  return globalThis._dbPromise;
}

export function generateId() {
  return crypto.randomBytes(16).toString('hex');
}
