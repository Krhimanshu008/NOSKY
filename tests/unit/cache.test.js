import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import cache from '@/lib/cache';

describe('CacheStore', () => {
  beforeEach(() => {
    cache.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('sets and gets a value before it expires', () => {
    cache.set('test-key', 'test-value', 10000);
    expect(cache.get('test-key')).toBe('test-value');
  });

  it('returns undefined and removes entry when cache expires on get', () => {
    cache.set('expire-key', 'expire-value', 5000);

    // Advance time past the TTL
    vi.advanceTimersByTime(5001);

    expect(cache.get('expire-key')).toBeUndefined();
    // Cache size should be 0 because size getter cleans up as well,
    // but the get() already deleted it.
    expect(cache.size).toBe(0);
  });

  it('removes expired entries when checking size', () => {
    cache.set('size-key-1', 'value-1', 5000);
    cache.set('size-key-2', 'value-2', 10000);

    // Initial size
    expect(cache.size).toBe(2);

    // Advance time past the first TTL but before the second
    vi.advanceTimersByTime(5001);

    // size getter should clean up 'size-key-1'
    expect(cache.size).toBe(1);
    expect(cache.get('size-key-1')).toBeUndefined(); // Should already be gone
    expect(cache.get('size-key-2')).toBe('value-2');
  });

  it('invalidates a specific key', () => {
    cache.set('key-to-invalidate', 'value');
    expect(cache.get('key-to-invalidate')).toBe('value');

    cache.invalidate('key-to-invalidate');
    expect(cache.get('key-to-invalidate')).toBeUndefined();
  });

  it('invalidates keys matching a prefix', () => {
    cache.set('prefix:1', 'value1');
    cache.set('prefix:2', 'value2');
    cache.set('other:1', 'value3');

    cache.invalidatePrefix('prefix:');

    expect(cache.get('prefix:1')).toBeUndefined();
    expect(cache.get('prefix:2')).toBeUndefined();
    expect(cache.get('other:1')).toBe('value3');
  });

  it('clears all entries', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');

    cache.clear();

    expect(cache.get('key1')).toBeUndefined();
    expect(cache.get('key2')).toBeUndefined();
    expect(cache.size).toBe(0);
  });

  it('returns undefined for non-existent keys', () => {
    expect(cache.get('non-existent')).toBeUndefined();
  });
});
