/**
 * In-Memory TTL Cache for NoSky
 * 
 * Simple cache with automatic expiration. Survives hot-reloads via globalThis.
 * Designed with an abstracted interface so it can be swapped to Redis later
 * by changing only this file.
 */

class CacheStore {
  constructor() {
    this._store = new Map();
  }

  /**
   * Get a cached value. Returns undefined if expired or not found.
   */
  get(key) {
    const entry = this._store.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this._store.delete(key);
      return undefined;
    }

    return entry.value;
  }

  /**
   * Set a value with a TTL in milliseconds.
   * @param {string} key
   * @param {*} value
   * @param {number} ttlMs - Time-to-live in milliseconds (default: 60s)
   */
  set(key, value, ttlMs = 60_000) {
    this._store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Invalidate a specific key.
   */
  invalidate(key) {
    this._store.delete(key);
  }

  /**
   * Invalidate all keys matching a prefix.
   * e.g. invalidatePrefix('articles:') clears all article caches.
   */
  invalidatePrefix(prefix) {
    for (const key of this._store.keys()) {
      if (key.startsWith(prefix)) {
        this._store.delete(key);
      }
    }
  }

  /**
   * Clear the entire cache.
   */
  clear() {
    this._store.clear();
  }

  /**
   * Get the number of active (non-expired) entries.
   */
  get size() {
    // Lazy cleanup on size check
    const now = Date.now();
    for (const [key, entry] of this._store) {
      if (now > entry.expiresAt) {
        this._store.delete(key);
      }
    }
    return this._store.size;
  }
}

// ---- Cache TTL Constants ----
export const CACHE_TTL = {
  ARTICLES_LIST: 60 * 1000,        // 60 seconds
  ACHIEVEMENTS_LIST: 60 * 1000,    // 60 seconds
  ARTICLE_DETAIL: 5 * 60 * 1000,   // 5 minutes
  ACHIEVEMENT_DETAIL: 5 * 60 * 1000, // 5 minutes
};

// ---- Cache Key Helpers ----
export const CACHE_KEYS = {
  articlesList: () => 'articles:list',
  achievementsList: () => 'achievements:list',
  articleBySlug: (slug) => `articles:slug:${slug}`,
  achievementBySlug: (slug) => `achievements:slug:${slug}`,
};

// ---- Singleton (survives hot-reloads) ----
if (!globalThis._cacheStore) {
  globalThis._cacheStore = new CacheStore();
}

/** @type {CacheStore} */
const cache = globalThis._cacheStore;

export default cache;
