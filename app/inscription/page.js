import AuthContainer from '@/components/auth/AuthContainer'

export const metadata = {
  title: 'Inscription Express — Espace Éleveur & Client',
  description: "Créez votre compte express Agro Véto Services Congo en 15 secondes : commandes d'intrants, clinique vétérinaire 24/7 et ferme-école à Pointe-Noire.",
  alternates: { canonical: '/inscription' },
}

export default function InscriptionPage() {
  return <AuthContainer initialMode="signup" />
}
