import AboutResponsive from './AboutResponsive'
import { PROJECTS } from '@/lib/data'
import { BreadcrumbJsonLd } from '../seo/StructuredData'

export const metadata = {
  title: 'À propos — Agro Véto Services | Complexe Vétérinaire & Agropastoral Pointe-Noire',
  description: `Découvrez AGRO VÉTO SERVICES CONGO S.A.R.L.U., dirigé par le Dr Marie-Rose Edwige Rakié POUTYA SAIZONOU à Pointe-Noire (Socoprise). Plus de 10 ans d'expertise agropastorale, vétérinaire et QHSE.`,
  alternates: { canonical: '/about' },
  openGraph: { title: 'À propos — Agro Véto Services', description: `Complexe agropastoral et clinique vétérinaire de référence à Pointe-Noire, Congo.`, locale: 'fr_CG', type: 'website', siteName: 'Agro Véto Services', url: 'https://agrovetoservices.cg/about' },
}

const ABOUT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  about: { '@type': 'VeterinaryCare', name: 'Agro Véto Services Congo', founder: { '@type': 'Person', name: "Dr Marie-Rose Edwige Rakié POUTYA SAIZONOU" } },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_JSON_LD) }} />
      <BreadcrumbJsonLd items={[
        { name: 'Accueil', url: 'https://agrovetoservices.cg/' },
        { name: 'À propos', url: 'https://agrovetoservices.cg/about' },
      ]} />
      <AboutResponsive />
    </>
  )
}
