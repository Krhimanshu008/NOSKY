import { describe, it, expect } from 'vitest';
import { isBot } from '@/analytics/lib/botDetector';

describe('isBot', () => {
  it('returns false when userAgent is null', () => {
    expect(isBot(null)).toBe(false);
  });

  it('returns false when userAgent is undefined', () => {
    expect(isBot(undefined)).toBe(false);
  });

  it('returns false when userAgent is an empty string', () => {
    expect(isBot('')).toBe(false);
  });

  it('returns false for standard browser user agents', () => {
    const chromeAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    expect(isBot(chromeAgent)).toBe(false);

    const safariAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15';
    expect(isBot(safariAgent)).toBe(false);
  });

  it('returns true for known bot user agents', () => {
    expect(isBot('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')).toBe(true);
    expect(isBot('Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)')).toBe(true);
    expect(isBot('DuckDuckBot/1.0; (+http://duckduckgo.com/duckduckbot.html)')).toBe(true);
    expect(isBot('Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)')).toBe(true);
  });

  it('is case-insensitive for bot detection', () => {
    expect(isBot('SOME-Spider-BOT')).toBe(true);
  });
});
