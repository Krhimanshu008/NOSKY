import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import cache, { CACHE_TTL, CACHE_KEYS } from '@/lib/cache';

describe('CacheStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    cache.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('get()', () => {
    it('returns undefined for a non-existent key', () => {
      expect(cache.get('non-existent')).toBeUndefined();
    });

    it('returns the cached value if the key exists and has not expired', () => {
      cache.set('test-key', 'test-value', 1000);

      expect(cache.get('test-key')).toBe('test-value');

      // Advance time by 500ms
      vi.advanceTimersByTime(500);
      expect(cache.get('test-key')).toBe('test-value');
    });

    it('returns undefined and removes the key if the TTL has expired', () => {
      cache.set('test-key', 'test-value', 1000);

      // Advance time by 1001ms (past expiration)
      vi.advanceTimersByTime(1001);

      expect(cache.get('test-key')).toBeUndefined();
      // Verify it's actually removed from the internal map by checking size
      expect(cache.size).toBe(0);
    });
  });

  describe('set()', () => {
    it('sets a value with the default TTL', () => {
      cache.set('default-ttl-key', 'value');
      expect(cache.get('default-ttl-key')).toBe('value');

      // Advance time to just before default TTL (60s)
      vi.advanceTimersByTime(59999);
      expect(cache.get('default-ttl-key')).toBe('value');

      // Advance time past default TTL
      vi.advanceTimersByTime(2);
      expect(cache.get('default-ttl-key')).toBeUndefined();
    });
  });

  describe('invalidate()', () => {
    it('removes a specific key', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');

      cache.invalidate('key1');

      expect(cache.get('key1')).toBeUndefined();
      expect(cache.get('key2')).toBe('value2');
    });
  });

  describe('invalidatePrefix()', () => {
    it('removes all keys matching a prefix', () => {
      cache.set('article:1', 'content1');
      cache.set('article:2', 'content2');
      cache.set('user:1', 'admin');

      cache.invalidatePrefix('article:');

      expect(cache.get('article:1')).toBeUndefined();
      expect(cache.get('article:2')).toBeUndefined();
      expect(cache.get('user:1')).toBe('admin');
    });
  });

  describe('clear()', () => {
    it('removes all keys from the cache', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');

      cache.clear();

      expect(cache.get('key1')).toBeUndefined();
      expect(cache.get('key2')).toBeUndefined();
      expect(cache.size).toBe(0);
    });
  });

  describe('size', () => {
    it('returns the number of active entries and cleans up expired ones', () => {
      cache.set('key1', 'value1', 1000);
      cache.set('key2', 'value2', 2000);
      cache.set('key3', 'value3', 3000);

      expect(cache.size).toBe(3);

      // Advance past key1's expiration
      vi.advanceTimersByTime(1500);

      // Accessing size should trigger lazy cleanup
      expect(cache.size).toBe(2);
      // Ensure the cleanup actually removed the expired key
      expect(cache._store.has('key1')).toBe(false);

      // Advance past key2's expiration
      vi.advanceTimersByTime(1000);
      expect(cache.size).toBe(1);
    });
  });
});
