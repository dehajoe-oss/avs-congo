import { BLOG_POSTS } from '@/lib/data'
import { SITE_URL } from '@/lib/site'

export default function sitemap() {
  const staticRoutes = [
    { url: `${SITE_URL}/`, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/boutique`, priority: 0.95, changeFrequency: 'daily' },
    { url: `${SITE_URL}/clinique`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/formations`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/services`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/pricing`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/projects`, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/about`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/contact`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/blog`, priority: 0.75, changeFrequency: 'weekly' },
  ].map(r => ({ ...r, lastModified: new Date() }))

  const blogRoutes = (BLOG_POSTS || []).map(post => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.65,
  }))

  return [...staticRoutes, ...blogRoutes]
}
