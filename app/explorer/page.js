import ExplorerClient from './ExplorerClient'
import { SITE_URL } from '@/lib/site'

export const metadata = {
  title: "Explorer 3D — Les Réalisations Agro Véto Services",
  description: "Explorez nos activités et réalisations en 3D : un tunnel WebGL immersif au cœur des expertises d'Agro Véto Services au Congo.",
  alternates: { canonical: '/explorer' },
  openGraph: {
    title: "Explorer — Agro Véto Services",
    description: "Le tunnel interactif de nos réalisations agropastorales.",
    locale: 'fr_CG', type: 'website', siteName: 'Agro Véto Services', url: `${SITE_URL}/explorer`,
  },
  robots: { index: true, follow: true },
}

export default function Page() {
  return <ExplorerClient />
}
