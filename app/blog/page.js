import BlogResponsive from './BlogResponsive'
import { BreadcrumbJsonLd } from '../seo/StructuredData'
import { SITE_URL } from '@/lib/site'

export const metadata = {
  title: 'Conseils & Actualités — Agro Véto Services | Santé Animale & Élevage Congo',
  description: "Conseils pratiques en aviculture, prophylaxie vétérinaire, nutrition animale et normes HACCP pour éleveurs et PME au Congo.",
  alternates: { canonical: '/blog' },
  openGraph: { title: 'Conseils & Actualités — Agro Véto Services', description: "Conseils pratiques en aviculture, prophylaxie vétérinaire, nutrition animale et normes HACCP au Congo.", locale: 'fr_CG', type: 'website', siteName: 'Agro Véto Services', url: `${SITE_URL}/blog` },
}

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Accueil', url: `${SITE_URL}/` },
        { name: 'Blog', url: `${SITE_URL}/blog` },
      ]} />
      <BlogResponsive />
    </>
  )
}
