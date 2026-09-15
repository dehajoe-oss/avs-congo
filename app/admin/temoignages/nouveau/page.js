import NewTestimonialClient from './NewTestimonialClient'

export const metadata = {
  title: 'Nouveau Témoignage — Administration',
  description: 'Publier un témoignage client AVS.',
  robots: { index: false, follow: false },
}

export default function NewTestimonialPage() {
  return <NewTestimonialClient />
}
