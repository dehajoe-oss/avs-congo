import ForgotPasswordClient from './ForgotPasswordClient'

export const metadata = {
  title: 'Mot de passe oublié — Agro Véto Services Congo',
  description: 'Réinitialisez votre mot de passe espace éleveur AVS.',
  alternates: { canonical: '/mot-de-passe-oublie' },
  robots: { index: false, follow: false },
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />
}
