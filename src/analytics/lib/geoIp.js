import geoip from 'geoip-lite';

/**
 * Extracts IP and Geo information from Next.js Request headers using geoip-lite.
 * Works seamlessly with Vercel or custom proxies passing `x-forwarded-for`.
 */
export function getGeoInfo(req) {
  // Use Next.js headers if available, or fallback to standard ones
  const headers = typeof req.headers.get === 'function' ? req.headers : new Map();
  
  const getHeader = (key) => typeof req.headers.get === 'function' ? req.headers.get(key) : req.headers[key];

  let ip = getHeader('x-forwarded-for')?.split(',')[0] || 
           getHeader('x-real-ip') || 
           '127.0.0.1';
           
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
