/**
 * Extracts IP and Geo information from Next.js Request headers.
 * Works seamlessly with Vercel or custom proxies passing `x-forwarded-for`.
 */
export function getGeoInfo(req) {
  // Use Next.js headers if available, or fallback to standard ones
  const headers = typeof req.headers.get === 'function' ? req.headers : new Map();
  
  const getHeader = (key) => typeof req.headers.get === 'function' ? req.headers.get(key) : req.headers[key];

  const ip = getHeader('x-forwarded-for')?.split(',')[0] || 
             getHeader('x-real-ip') || 
             '127.0.0.1';
             
  const country = getHeader('x-vercel-ip-country') || 'Unknown';
  const city = getHeader('x-vercel-ip-city') || 'Unknown';
  
  // Optional: In a future Phase B step, we could call an external API (like ip-api.com) 
  // here if country/city is Unknown.
  
  return {
    ip,
    country,
    city
  };
}
