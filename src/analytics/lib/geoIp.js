import geoip from 'geoip-lite';

// Checks if an IP address is a private, loopback, or link-local address
function isPrivateIp(ip) {
  if (!ip) return false;
  return /^(::f{4}:)?10\.|^(::f{4}:)?192\.168\.|^(::f{4}:)?172\.(1[6-9]|2[0-9]|3[0-1])\.|^(::f{4}:)?127\.|^::1$|^fd|^fc|^fe80/i.test(ip);
}

/**
 * Extracts IP and Geo information from Next.js Request headers using geoip-lite.
 * Works seamlessly with Vercel or custom proxies passing `x-forwarded-for`.
 */
export function getGeoInfo(req) {
  // Use Next.js headers if available, or fallback to standard ones
  const headers = typeof req.headers.get === 'function' ? req.headers : new Map();
  
  const getHeader = (key) => typeof req.headers.get === 'function' ? req.headers.get(key) : req.headers[key];

  const forwardedFor = getHeader('x-forwarded-for');
  let ip = null;

  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(i => i.trim());
    // Parse from right to left (most trusted proxies to least trusted client)
    // Find the first IP that is not a private/internal proxy IP
    for (let i = ips.length - 1; i >= 0; i--) {
      if (!isPrivateIp(ips[i])) {
        ip = ips[i];
        break;
      }
    }
    // Fallback to the rightmost IP if all were private (e.g., local testing behind proxy)
    if (!ip && ips.length > 0) {
      ip = ips[ips.length - 1];
    }
  }

  ip = ip || getHeader('x-real-ip') || '127.0.0.1';
           
  // Clean IPv6 mapped IPv4 addresses like ::ffff:192.168.1.1
  if (ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '');
  }

  // Lookup IP using geoip-lite
  const geo = geoip.lookup(ip);
  
  return {
    ip,
    country: geo?.country || getHeader('x-vercel-ip-country') || 'Unknown',
    city: geo?.city || getHeader('x-vercel-ip-city') || 'Unknown',
    latitude: geo?.ll ? geo.ll[0] : null,
    longitude: geo?.ll ? geo.ll[1] : null,
  };
}
