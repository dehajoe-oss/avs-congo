import ServicesResponsive from './ServicesResponsive'
import { BreadcrumbJsonLd } from '../seo/StructuredData'

export const metadata = {
  title: 'Nos 3 Domaines d’Activité — Agro · Véto · Services | Pointe-Noire, Congo',
  description: "3 domaines d'excellence intégrés : Agro (cultures, transformation, artisanat), Véto (clinique 24/7, provenderie certifiée, élevage, labo) et Services (management QHSE, formations, salons, commerce) à Pointe-Noire.",
  alternates: { canonical: '/services' },
  openGraph: { title: 'Nos 3 Domaines d’Activité — Agro Véto Services Congo', description: "Complexe agropastoral, vétérinaire et QHSE de référence au Congo : 3 domaines d'excellence intégrés.", locale: 'fr_CG', type: 'website', siteName: 'Agro Véto Services', url: 'https://agrovetoservices.cg/services' },
}

const SERVICES_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [
    {
      '@type': 'Service',
      position: 1,
      name: 'Domaine AGRO — Productions agricoles, transformation agroalimentaire & bio-cosmétique, équipements, artisanat',
      areaServed: 'République du Congo',
      provider: { '@type': 'Organization', name: 'Agro Véto Services Congo' }
    },
    {
      '@type': 'Service',
      position: 2,
      name: 'Domaine VÉTO — Productions animales (Élevage), provenderie certifiée, pharmacie & clinique vétérinaire 24/7, laboratoire bromatologique',
      areaServed: 'République du Congo',
      provider: { '@type': 'VeterinaryCare', name: 'Agro Véto Services Congo' }
    },
    {
      '@type': 'Service',
      position: 3,
      name: 'Domaine SERVICES — Management QHSE, suivi transversal, fermes-écoles, formations qualifiantes, salons & commerce général',
      areaServed: 'République du Congo',
      provider: { '@type': 'Organization', name: 'Agro Véto Services Congo' }
    },
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICES_JSON_LD) }} />
      <BreadcrumbJsonLd items={[
        { name: 'Accueil', url: 'https://agrovetoservices.cg/' },
        { name: 'Services', url: 'https://agrovetoservices.cg/services' },
      ]} />
      <ServicesResponsive />
    </>
  )
}
