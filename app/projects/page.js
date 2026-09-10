import ProjectsResponsive from './ProjectsResponsive'
import { PROJECTS } from '@/lib/data'
import { BreadcrumbJsonLd } from '../seo/StructuredData'

export const metadata = {
  title: "Réalisations & Cheptels — Agro Véto Services | Pointe-Noire, Congo",
  description: `+${PROJECTS.length} projets et élevages accompagnés au Congo : poussins Cobb 500 & Lohmann, provenderie certifiée, audits HACCP et clinique vétérinaire.`,
  alternates: { canonical: '/projects' },
  openGraph: { title: "Réalisations & Cheptels — Agro Véto Services", description: `${PROJECTS.length}+ projets agropastoraux et fermes accompagnées en République du Congo.`, locale: 'fr_CG', type: 'website', siteName: 'Agro Véto Services', url: 'https://agrovetoservices.cg/projects' },
}

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Accueil', url: 'https://agrovetoservices.cg/' },
        { name: 'Réalisations', url: 'https://agrovetoservices.cg/projects' },
      ]} />
      <ProjectsResponsive />
    </>
  )
}
