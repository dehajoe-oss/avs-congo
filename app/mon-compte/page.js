import AccountClient from './AccountClient'

export const metadata = {
  title: 'Mon Espace Client & Éleveur — Suivi des Commandes',
  description: 'Gérez vos informations de compte éleveur/entreprise, consultez l’historique de vos commandes d’intrants et vos paiements KKiaPay chez Agro Véto Services Congo.',
  alternates: { canonical: '/mon-compte' },
}

export default function MonComptePage() {
  return <AccountClient />
}
