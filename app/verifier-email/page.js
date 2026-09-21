// app/verifier-email/page.js
import { Suspense } from 'react'
import VerifyEmailClient from './VerifyEmailClient'

export const metadata = {
  title: 'Activation de compte — Agro Véto Services Congo',
  description: 'Validez votre adresse email pour activer votre espace client et éleveur Agro Véto Services Congo.',
  robots: { index: false, follow: false },
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#070f09' }} />}>
      <VerifyEmailClient />
    </Suspense>
  )
}
