import NewFormationClient from './NewFormationClient'

export const metadata = {
  title: 'Nouvelle Formation — Administration',
  description: 'Ajouter une formation au catalogue AVS.',
  robots: { index: false, follow: false },
}

export default function NewFormationPage() {
  return <NewFormationClient />
}
