import NewProductClient from './NewProductClient'

export const metadata = {
  title: 'Nouveau Produit — Administration',
  description: 'Ajouter un produit au catalogue AVS.',
  robots: { index: false, follow: false },
}

export default function NewProductPage() {
  return <NewProductClient />
}
