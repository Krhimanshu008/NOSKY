import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import crypto from 'crypto';

export async function getDb() {
  // Return the existing promise if it's already initializing/initialized
  if (globalThis._dbPromise) {
    return globalThis._dbPromise;
  }
  
  // Cache the initialization promise globally to survive hot-reloads
  // and prevent concurrent requests from trying to create multiple connections
  globalThis._dbPromise = (async () => {
    const db = await open({
      filename: path.join(process.cwd(), 'dev.db'),
      driver: sqlite3.Database
    });

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

    return db;
  })();

  return globalThis._dbPromise;
}

export function generateId() {
  return crypto.randomBytes(16).toString('hex');
}
