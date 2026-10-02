import FormationsClient from './FormationsClient'
import { BreadcrumbJsonLd } from '../seo/StructuredData'
import { SITE_URL } from '@/lib/site'

export const metadata = {
  title: 'Centre de Formation & Fermes-Écoles — Agro Véto Services Congo',
  description: "Formations pratiques certifiantes en élevage avicole (Cobb 500 & Lohmann), méthode HACCP, fabrication artisanale de détergents et audits internes ISO à Pointe-Noire.",
  alternates: { canonical: '/formations' },
  openGraph: {
    title: 'Centre de Formation & Fermes-Écoles — Agro Véto Services',
    description: "Apprenez sur le terrain avec des vétérinaires et experts QHSE. Formations pratiques et certifiantes au Congo.",
    locale: 'fr_CG',
    type: 'website',
    siteName: 'Agro Véto Services',
    url: `${SITE_URL}/formations`,
  },
}

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Accueil', url: `${SITE_URL}/` },
        { name: 'Formations', url: `${SITE_URL}/formations` },
      ]} />
      <FormationsClient />
    </>
  )
}
