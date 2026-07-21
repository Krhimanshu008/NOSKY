import { describe, it, expect } from 'vitest';
import { sanitizeJsonLd } from '@/lib/sanitize';

describe('sanitizeJsonLd', () => {
  it('returns "{}" for falsy inputs', () => {
    expect(sanitizeJsonLd(null)).toBe('{}');
    expect(sanitizeJsonLd(undefined)).toBe('{}');
    expect(sanitizeJsonLd(false)).toBe('{}');
    expect(sanitizeJsonLd('')).toBe('{}');
    expect(sanitizeJsonLd(0)).toBe('{}');
  });

  it('correctly stringifies objects without special characters', () => {
    const obj = { name: 'John Doe', age: 30 };
    expect(sanitizeJsonLd(obj)).toBe('{"name":"John Doe","age":30}');
  });

  it('escapes <, >, and & characters', () => {
    const obj = {
      script: '<script>alert(1)</script>',
      html: '<div>&lt;test&gt;</div>',
      mixed: 'a & b < c > d'
    };
    const expected = '{"script":"\\u003cscript\\u003ealert(1)\\u003c/script\\u003e","html":"\\u003cdiv\\u003e\\u0026lt;test\\u0026gt;\\u003c/div\\u003e","mixed":"a \\u0026 b \\u003c c \\u003e d"}';
    expect(sanitizeJsonLd(obj)).toBe(expected);
  });

  it('handles deeply nested objects and arrays', () => {
    const obj = {
      level1: {
        level2: [
          { text: 'nested <script>' },
          { value: '1 & 2 > 0' }
        ]
      }
    };
    const expected = '{"level1":{"level2":[{"text":"nested \\u003cscript\\u003e"},{"value":"1 \\u0026 2 \\u003e 0"}]}}';
    expect(sanitizeJsonLd(obj)).toBe(expected);
  });

  it('throws TypeError for circular references', () => {
    const obj = {};
    obj.self = obj;

    // JSON.stringify will throw TypeError: Converting circular structure to JSON
    expect(() => sanitizeJsonLd(obj)).toThrow(TypeError);
  });
});
