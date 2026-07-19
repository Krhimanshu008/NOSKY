import { describe, it, expect, vi } from 'vitest';
import { getGeoInfo } from './geoIp';

// Mock geoip-lite to prevent actual IP lookups during test
vi.mock('geoip-lite', () => ({
  default: {
    lookup: vi.fn(() => ({
      country: 'US',
      city: 'Test City',
      ll: [37.7749, -122.4194]
    }))
  }
}));

describe('getGeoInfo IP Extraction Security', () => {
  const createMockReq = (headers) => ({
    headers: {
      get: (key) => headers[key.toLowerCase()],
      ...headers
    }
  });

  it('extracts rightmost public IP from x-forwarded-for, ignoring spoofed leftmost IP', () => {
    // Client (1.2.3.4) spoofs (8.8.8.8) and connects through trusted private proxy (10.0.0.1)
    const req = createMockReq({
      'x-forwarded-for': '8.8.8.8, 1.2.3.4, 10.0.0.1'
    });

    const geoInfo = getGeoInfo(req);
    expect(geoInfo.ip).toBe('1.2.3.4');
  });

  it('falls back to x-real-ip if x-forwarded-for is missing', () => {
    const req = createMockReq({
      'x-real-ip': '2.3.4.5'
    });

    const geoInfo = getGeoInfo(req);
    expect(geoInfo.ip).toBe('2.3.4.5');
  });

  it('uses 127.0.0.1 as default if no headers are present', () => {
    const req = createMockReq({});
    const geoInfo = getGeoInfo(req);
    expect(geoInfo.ip).toBe('127.0.0.1');
  });

  it('handles IPv6-mapped IPv4 addresses correctly', () => {
    const req = createMockReq({
      'x-forwarded-for': '::ffff:3.4.5.6'
    });
    const geoInfo = getGeoInfo(req);
    expect(geoInfo.ip).toBe('3.4.5.6');
  });

  it('falls back to rightmost IP if only private IPs are provided', () => {
    // E.g. local testing with a local proxy
    const req = createMockReq({
      'x-forwarded-for': '192.168.1.100, 10.0.0.1'
    });
    const geoInfo = getGeoInfo(req);
    expect(geoInfo.ip).toBe('10.0.0.1');
  });
});
