'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import api from '@/lib/api-client'
import ThemeToggle from '@/components/admin/ThemeToggle'

// ── Garde d'accès back-office ─────────────────────────────────────────────
// Réservé aux sessions ADMIN / STAFF (même règle que AdminClient).
// Sans session valide : panneau "accès réservé" + lien vers /admin (login).
export default function AdminGuard({ children }) {
  const T = useTheme()
  const [status, setStatus] = useState('checking') // checking | ok | denied

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('avs_token') : null
    if (!token) {
      setStatus('denied')
      return
    }
    api.auth.me()
      .then(res => {
        const role = res?.data?.role
        setStatus(role === 'ADMIN' || role === 'STAFF' ? 'ok' : 'denied')
      })
      .catch(() => setStatus('denied'))
  }, [])

  const page = {
    minHeight: '100vh',
    background: T.bg,
    color: T.textMain,
    fontFamily: "'Poppins', sans-serif",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
  }

  if (status === 'checking') {
    return (
      <div style={page}>
        <p style={{ color: T.textMuted }}>Vérification des accès…</p>
      </div>
    )
  }

  if (status === 'denied') {
    return (
      <div style={page}>
        <ThemeToggle />
        <div style={{ maxWidth: '440px', width: '100%', background: T.surface, border: `1px solid ${T.border}`, borderRadius: '20px', padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
            <ShieldAlert size={28} />
          </div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.6rem' }}>Accès réservé</h1>
          <p style={{ fontSize: '0.85rem', color: T.textMuted, lineHeight: 1.6, margin: '0 0 1.8rem' }}>
            Cette page est réservée à la direction et au staff technique. Connectez-vous avec un compte autorisé.
          </p>
          <Link
            href="/admin"
            style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '10px', background: '#b47027', color: '#fff', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}
          >
            Aller à la connexion admin
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <ThemeToggle />
      {children}
    </>
  )
}
