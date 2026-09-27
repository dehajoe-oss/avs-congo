import ShopClient from './ShopClient'

export const metadata = {
  title: 'Boutique d’Intrants Agropastoraux — Poussins Cobb 500, Provenderie & Soins',
  description: 'Commandez en ligne vos poussins d’un jour Cobb 500 certifiés, provende industrielle, vaccins et matériel d’élevage via WhatsApp direct (+242 05 633 70 50) et retrait à Pointe-Noire.',
  alternates: { canonical: '/boutique' },
}

export default function BoutiquePage() {
  return <ShopClient />
}
