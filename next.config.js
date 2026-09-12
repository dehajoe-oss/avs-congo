/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async headers() {
    const isProd = process.env.NODE_ENV === 'production'
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: isProd ? 'public, max-age=31536000, immutable' : 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: isProd ? 'public, max-age=31536000, immutable' : 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      { source: '/poles', destination: '/services' },
      { source: '/a-propos', destination: '/about' },
    ]
  },
}
module.exports = nextConfig

