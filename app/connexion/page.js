import AuthContainer from '@/components/auth/AuthContainer'

export const metadata = {
  title: 'Connexion — Espace Éleveur & Client',
  description: 'Connectez-vous à votre espace Agro Véto Services Congo pour suivre vos commandes, rendez-vous clinique et formations.',
  alternates: { canonical: '/connexion' },
}

export default function ConnexionPage() {
  return <AuthContainer initialMode="signin" />
}
