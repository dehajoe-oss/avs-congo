/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async rewrites() {
    return [
      { source: '/poles', destination: '/services' },
      { source: '/boutique', destination: '/pricing' },
      { source: '/a-propos', destination: '/about' },
    ]
  },
}
module.exports = nextConfig

