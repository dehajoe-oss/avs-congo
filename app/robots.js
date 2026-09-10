export const dynamic = 'force-static'

const SITE_URL = 'https://agrovetoservices.cg'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
