import ShopClient from './ShopClient'

export const metadata = {
  title: 'Boutique d’Intrants Agropastoraux — Poussins Cobb 500, Provenderie & Soins',
  description: 'Commandez en ligne vos poussins d’un jour Cobb 500 certifiés, provende industrielle, vaccins et matériel d’élevage avec paiement Mobile Money KKiaPay et livraison à Pointe-Noire.',
  alternates: { canonical: '/boutique' },
}

export default function BoutiquePage() {
  return <ShopClient />
}
