import ShopClient from './ShopClient'
import { BreadcrumbJsonLd } from '../seo/StructuredData'
import { SITE_URL } from '@/lib/site'

export const metadata = {
  title: 'Boutique d’Intrants Agropastoraux — Poussins Cobb 500, Provenderie & Soins',
  description: 'Commandez en ligne vos poussins d’un jour Cobb 500 certifiés, provende industrielle, vaccins et matériel d’élevage via WhatsApp direct (+242 05 633 70 50) et retrait à Pointe-Noire.',
  alternates: { canonical: '/boutique' },
  openGraph: {
    title: 'Boutique d’Intrants Agropastoraux — Agro Véto Services Congo',
    description: 'Commandez en ligne vos poussins d’un jour Cobb 500, provende industrielle certifiée, vaccins et matériel d’élevage à Pointe-Noire.',
    url: `${SITE_URL}/boutique`,
    locale: 'fr_CG',
    type: 'website',
    siteName: 'Agro Véto Services',
  },
}

export default function BoutiquePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Accueil', url: `${SITE_URL}/` },
        { name: 'Boutique', url: `${SITE_URL}/boutique` },
      ]} />
      <ShopClient />
    </>
  )
}

