'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { ArrowLeft, KeyRound, MailCheck } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import api from '@/lib/api-client'

function ForgotPasswordForm() {
  const T = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRequest = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!identifier.trim()) {
      setError("Renseignez votre email ou téléphone WhatsApp.")
      return
    }
    setLoading(true)
    try {
      const res = await api.auth.forgotPassword(identifier.trim())
      setMessage(res?.message || 'Demande envoyée.')
    } catch (err) {
      setError(err.message || 'Envoi impossible pour le moment.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!password || password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    if (password !== password2) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    setLoading(true)
    try {
      const res = await api.auth.resetPassword(token, password)
      setMessage(res?.message || 'Mot de passe réinitialisé.')
      setTimeout(() => router.push('/connexion'), 2500)
    } catch (err) {
      setError(err.message || 'Lien expiré ou invalide.')
    } finally {
      setLoading(false)
    }
  }

  const input = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: `1px solid ${T.border}`, background: T.bg, color: T.textMain,
    fontSize: '0.88rem', fontFamily: "'Poppins', sans-serif",
    outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.textMain, fontFamily: "'Poppins', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '460px', width: '100%' }}>
        <Link href="/connexion" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#b47027', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none', marginBottom: '1.2rem' }}>
          <ArrowLeft size={15} /> Retour à la connexion
        </Link>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '20px', padding: '2.2rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(180, 112, 39, 0.12)', color: '#b47027', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
            {token ? <KeyRound size={24} /> : <MailCheck size={24} />}
          </div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.4rem' }}>
            {token ? 'Nouveau mot de passe' : 'Mot de passe oublié'}
          </h1>
          <p style={{ fontSize: '0.83rem', color: T.textMuted, lineHeight: 1.6, margin: '0 0 1.5rem' }}>
            {token
              ? 'Choisissez un nouveau mot de passe (8 caractères minimum, lettres et chiffres).'
              : "Recevez un lien de réinitialisation par email (valable 1 heure). Compte créé avec téléphone uniquement ? Ajoutez d'abord un email via WhatsApp."}
          </p>

          {error && <div style={{ background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '10px', padding: '8px 12px', fontSize: '12px', color: '#dc2626', marginBottom: '12px' }}>{error}</div>}
          {message && <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '10px', padding: '8px 12px', fontSize: '12px', color: '#10b981', marginBottom: '12px' }}>{message}</div>}

          {!token ? (
            <form onSubmit={handleRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Email ou téléphone *</label>
                <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="vous@email.com ou 06 123 45 67" style={input} />
              </div>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: '#b47027', color: '#fff', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Envoi…' : 'Envoyer le lien'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Nouveau mot de passe *</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8 caractères min., lettres et chiffres" style={input} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Confirmation *</label>
                <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="Répétez le mot de passe" style={input} />
              </div>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: '#b47027', color: '#fff', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Réinitialisation…' : 'Réinitialiser'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ForgotPasswordClient() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  )
}
