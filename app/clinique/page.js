import ClinicClient from './ClinicClient'
import { BreadcrumbJsonLd } from '../seo/StructuredData'

export const metadata = {
  title: 'Clinique Vétérinaire & Urgences 24/7 — Agro Véto Services Congo',
  description: "Consultations médicales, chirurgie, vaccinations, visites sanitaires d'élevage et urgences vétérinaires 24h/24 & 7j/7 au Quartier Socoprise, Pointe-Noire.",
  alternates: { canonical: '/clinique' },
  openGraph: {
    title: 'Clinique Vétérinaire & Urgences 24/7 — Agro Véto Services',
    description: "Médecine vétérinaire d'excellence sous la direction du Dr POUTYA. Urgences 24/7 et soins spécialisés à Pointe-Noire.",
    locale: 'fr_CG',
    type: 'website',
    siteName: 'Agro Véto Services',
    url: 'https://agrovetoservices.cg/clinique',
  },
}

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Accueil', url: 'https://agrovetoservices.cg/' },
        { name: 'Clinique Vétérinaire', url: 'https://agrovetoservices.cg/clinique' },
      ]} />
      <ClinicClient />
    </>
  )
}
