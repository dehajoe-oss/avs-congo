import AdminClient from './AdminClient'

export const metadata = {
  title: 'Administration & Gestion — Agro Véto Services Congo',
  description: 'Tableau de bord de direction et back-office de gestion des commandes, stocks agropastoraux et rendez-vous vétérinaires.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminPage() {
  return <AdminClient />
}
