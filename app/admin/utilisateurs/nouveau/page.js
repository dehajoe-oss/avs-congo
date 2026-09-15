import NewUserClient from './NewUserClient'

export const metadata = {
  title: 'Créer un Compte — Administration',
  description: 'Créer un compte utilisateur AVS.',
  robots: { index: false, follow: false },
}

export default function NewUserPage() {
  return <NewUserClient />
}
