import ServicesResponsive from './ServicesResponsive'
import { BreadcrumbJsonLd } from '../seo/StructuredData'

export const metadata = {
  title: 'Nos Pôles & Services — Agro Véto Services | Pointe-Noire, Congo',
  description: "Clinique vétérinaire 24h/24, provenderie certifiée, poussins d’un jour Cobb 500 & Lohmann, ferme-école, audits QHSE & HACCP à Pointe-Noire.",
  alternates: { canonical: '/services' },
  openGraph: { title: 'Nos Pôles & Services — Agro Véto Services', description: "Complexe agropastoral et vétérinaire de référence au Congo : 6 pôles d'expertise intégrés.", locale: 'fr_CG', type: 'website', siteName: 'Agro Véto Services', url: 'https://agrovetoservices.cg/services' },
}

const SERVICES_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [
    { '@type': 'Service', position: 1, name: 'Clinique & Soins Vétérinaires 24/7', areaServed: 'République du Congo', provider: { '@type': 'VeterinaryCare', name: 'Agro Véto Services Congo' } },
    { '@type': 'Service', position: 2, name: 'Provenderie & Nutrition Animale Bromatologique', areaServed: 'République du Congo', provider: { '@type': 'VeterinaryCare', name: 'Agro Véto Services Congo' } },
    { '@type': 'Service', position: 3, name: 'Poussins d’un Jour Certifiés (Cobb 500 & Lohmann)', areaServed: 'République du Congo', provider: { '@type': 'VeterinaryCare', name: 'Agro Véto Services Congo' } },
    { '@type': 'Service', position: 4, name: 'Management QHSE & Audits Sanitaires HACCP', areaServed: 'République du Congo', provider: { '@type': 'VeterinaryCare', name: 'Agro Véto Services Congo' } },
    { '@type': 'Service', position: 5, name: 'Centre de Formation Ferme-École & Ateliers', areaServed: 'République du Congo', provider: { '@type': 'VeterinaryCare', name: 'Agro Véto Services Congo' } },
    { '@type': 'Service', position: 6, name: 'Cosmétique, Détergents & Biosécurité', areaServed: 'République du Congo', provider: { '@type': 'VeterinaryCare', name: 'Agro Véto Services Congo' } },
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
