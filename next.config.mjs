/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['geoip-lite'],
  allowedDevOrigins: ['192.168.68.129', '192.168.1.15', '192.168.1.13', '192.168.1.11', '192.168.68.107', '192.168.1.7', '192.168.1.9'],

  // Enable compression (gzip/brotli) for all responses
  compress: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Cache-control headers for static assets and pages
  async headers() {
    return [
      {
        // Public static files (logos, images, etc.)
        source: '/noskywhite.webp',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // llms.txt
        source: '/llms.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // llms-full.txt
        source: '/llms-full.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
