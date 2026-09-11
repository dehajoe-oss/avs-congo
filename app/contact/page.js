import ContactResponsive from './ContactResponsive'
import { BreadcrumbJsonLd } from '../seo/StructuredData'

export const metadata = {
  title: 'Contact & Urgences 24/7 — Agro Véto Services | Pointe-Noire, Congo',
  description: "Contactez Agro Véto Services Congo. Clinique vétérinaire 24h/24, commandes de poussins, provenderie et formations. WhatsApp ou au siège Socoprise.",
  alternates: { canonical: '/contact' },
  openGraph: { title: 'Contact — Agro Véto Services', description: "Clinique vétérinaire 24/7 et complexe agropastoral à Pointe-Noire, République du Congo.", locale: 'fr_CG', type: 'website', siteName: 'Agro Véto Services', url: 'https://agrovetoservices.cg/contact' },
}

const CONTACT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  about: {
    '@type': 'VeterinaryCare',
    name: 'AGRO VÉTO SERVICES CONGO S.A.R.L.U.',
    telephone: ['+242 05 633 70 50', '+242 06 967 75 67'],
    email: 'agrovetoservicescongo@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Quartier Socoprise, Avenue Nelson Mandela, Rue Bissoute',
      addressLocality: 'Pointe-Noire',
      addressCountry: 'CG',
    },
  },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_JSON_LD) }} />
      <BreadcrumbJsonLd items={[
        { name: 'Accueil', url: 'https://agrovetoservices.cg/' },
        { name: 'Contact', url: 'https://agrovetoservices.cg/contact' },
      ]} />
      <ContactResponsive />
    </>
  )
}
