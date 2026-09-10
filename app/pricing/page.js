import PricingResponsive from './PricingResponsive'
import { FAQ_ITEMS } from '@/lib/data'
import { BreadcrumbJsonLd } from '../seo/StructuredData'

export const metadata = {
  title: 'Tarifs & Formules — Agro Véto Services | Poussins, Provenderie, Formations Congo',
  description: "Tarifs clairs et transparents : poussins Cobb 500 dès 650 FCFA, provenderie démarrage dès 21 500 FCFA, formations ferme-école dès 60 000 FCFA, consultations vétérinaires.",
  alternates: { canonical: '/pricing' },
  openGraph: { title: 'Tarifs & Formules — Agro Véto Services', description: "Tarifs transparents : poussins Cobb 500 & Lohmann, provenderie, soins cliniques, formations à Pointe-Noire.", locale: 'fr_CG', type: 'website', siteName: 'Agro Véto Services', url: 'https://agrovetoservices.cg/pricing' },
}

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <BreadcrumbJsonLd items={[
        { name: 'Accueil', url: 'https://agrovetoservices.cg/' },
        { name: 'Tarifs', url: 'https://agrovetoservices.cg/pricing' },
      ]} />
      <PricingResponsive />
    </>
  )
}
