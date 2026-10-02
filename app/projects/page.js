import ProjectsResponsive from './ProjectsResponsive'
import { PROJECTS } from '@/lib/data'
import { BreadcrumbJsonLd } from '../seo/StructuredData'
import { SITE_URL } from '@/lib/site'

export const metadata = {
  title: "Réalisations & Cheptels — Agro Véto Services | Pointe-Noire, Congo",
  description: `+${PROJECTS.length} projets et élevages accompagnés au Congo : poussins Cobb 500 & Lohmann, provenderie certifiée, audits HACCP et clinique vétérinaire.`,
  alternates: { canonical: '/projects' },
  openGraph: { title: "Réalisations & Cheptels — Agro Véto Services", description: `${PROJECTS.length}+ projets agropastoraux et fermes accompagnées en République du Congo.`, locale: 'fr_CG', type: 'website', siteName: 'Agro Véto Services', url: `${SITE_URL}/projects` },
}

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Accueil', url: `${SITE_URL}/` },
        { name: 'Réalisations', url: `${SITE_URL}/projects` },
      ]} />
      <ProjectsResponsive />
    </>
  )
}
