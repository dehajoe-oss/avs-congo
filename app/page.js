import HomeResponsive from './HomeResponsive'
import { FAQ_ITEMS } from '@/lib/data'

const SITE_URL = 'https://agrovetoservices.cg'

export const metadata = {
  title: "AGRO VÉTO SERVICES CONGO — De la santé animale à l'excellence QHSE",
  description: "Clinique vétérinaire 24h/24 & 7j/7, provenderie industrielle certifiée, poussins Cobb 500 et management QHSE à Pointe-Noire.",
  alternates: { canonical: '/' },
  openGraph: {
    title: 'AGRO VÉTO SERVICES CONGO — Pointe-Noire',
    description: "Clinique vétérinaire, provenderie certifiée et management QHSE en République du Congo.",
    url: SITE_URL,
    locale: 'fr_CG', type: 'website', siteName: 'Agro Véto Services',
  },
}

// Les 6 premières questions de FAQ_ITEMS — mêmes questions, dans le même
// ordre, que celles réellement affichées sur la page (voir
// HomeClientDesktop.js : FAQ_ITEMS.slice(0, 6)). Avant, ce schema listait
// 3 questions codées en dur qui ne correspondaient à aucun texte visible
// sur la page — un schema FAQPage est censé refléter le contenu affiché,
// pas en inventer un autre. app/pricing/page.js suit déjà ce principe
// (schema généré depuis FAQ_ITEMS) ; on aligne l'accueil dessus.
const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.slice(0, 6).map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <HomeResponsive />
    </>
  )
}
