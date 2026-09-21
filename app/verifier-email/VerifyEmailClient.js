'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, AlertCircle, Mail, Loader2, ArrowRight, Home } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import api from '@/lib/api-client'

export default function VerifyEmailClient() {
  const T = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const [status, setStatus] = useState(token ? 'verifying' : 'manual') // 'verifying' | 'success' | 'error' | 'manual'
  const [message, setMessage] = useState('')
  const [resendEmail, setResendEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const [resendError, setResendError] = useState('')

  const verifiedRef = useRef(false)

  useEffect(() => {
    if (!token || verifiedRef.current) return
    verifiedRef.current = true

    let isMounted = true
    setStatus('verifying')

    async function executeVerification() {
      try {
        let res
        try {
          res = await api.auth.verifyEmail(token)
        } catch (apiErr) {
          // Fallback direct sur la route Next.js locale
          const fallbackRes = await fetch('/api/auth/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          })
          res = await fallbackRes.json()
          if (!fallbackRes.ok) throw new Error(res.error || res.message || 'Erreur lors de la validation')
        }

        if (isMounted) {
          setStatus('success')
          setMessage(res?.message || 'Votre adresse email a été validée avec succès !')
        }
      } catch (err) {
        if (isMounted) {
          setStatus('error')
          setMessage(err.message || 'Le lien de validation est invalide ou a expiré.')
        }
      }
    }

    executeVerification()

    return () => {
      isMounted = false
    }
  }, [token])

  const handleResend = async (e) => {
    e.preventDefault()
    setResendError('')
    setResendMessage('')

    const email = resendEmail.trim()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setResendError('Veuillez renseigner une adresse email valide.')
      return
    }

    setResendLoading(true)
    try {
      let res
      try {
        res = await api.auth.resendVerification(email)
      } catch (apiErr) {
        const fallbackRes = await fetch('/api/auth/resend-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })
        res = await fallbackRes.json()
        if (!fallbackRes.ok) throw new Error(res.error || res.message || 'Erreur lors de l’envoi')
      }

      setResendMessage(res?.message || 'Un nouveau lien de validation a été envoyé par email.')
      setResendEmail('')
    } catch (err) {
      setResendError(err.message || 'Impossible d’envoyer le lien pour le moment.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: T.bg,
      color: T.textMain,
      fontFamily: "'Poppins', sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        boxShadow: T.light ? '0 10px 30px rgba(0,0,0,0.06)' : '0 20px 40px rgba(0,0,0,0.45)',
        textAlign: 'center',
      }}>

        {/* ── STATUT : EN COURS DE VÉRIFICATION ── */}
        {status === 'verifying' && (
          <div>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(180, 112, 39, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: '#b47027',
            }}>
              <Loader2 size={32} className="animate-spin" />
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
              Validation en cours…
            </h1>
            <p style={{ fontSize: '0.85rem', color: T.textMuted, lineHeight: 1.6 }}>
              Nous vérifions votre lien d’activation. Veuillez patienter un instant.
            </p>
          </div>
        )}

        {/* ── STATUT : VALIDATION RÉUSSIE ── */}
        {status === 'success' && (
          <div>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '2px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: '#10b981',
            }}>
              <CheckCircle2 size={38} />
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 0.5rem', color: T.textMain }}>
              Adresse email validée !
            </h1>
            <p style={{ fontSize: '0.88rem', color: T.textMuted, lineHeight: 1.6, marginBottom: '2rem' }}>
              {message || 'Votre compte Agro Véto Services est maintenant activé. Vous pouvez dès à présent vous connecter et accéder à votre espace éleveur.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <Link
                href="/connexion"
                className="btn-raised"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '13px 20px',
                  borderRadius: '10px',
                  background: '#b47027',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  border: '1px solid #050505',
                  boxSizing: 'border-box',
                }}
              >
                <span>Accéder à la connexion</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '0.82rem',
                  color: T.textMuted,
                  textDecoration: 'none',
                  padding: '8px',
                }}
              >
                <Home size={14} /> Retour à l’accueil
              </Link>
            </div>
          </div>
        )}

        {/* ── STATUT : ERREUR / LIEN EXPIRÉ ── */}
        {(status === 'error' || status === 'manual') && (
          <div>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: status === 'error' ? 'rgba(220, 38, 38, 0.12)' : 'rgba(180, 112, 39, 0.12)',
              border: `1px solid ${status === 'error' ? 'rgba(220, 38, 38, 0.3)' : 'rgba(180, 112, 39, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: status === 'error' ? '#ef4444' : '#b47027',
            }}>
              {status === 'error' ? <AlertCircle size={32} /> : <Mail size={32} />}
            </div>

            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
              {status === 'error' ? 'Lien invalide ou expiré' : 'Validation de votre adresse email'}
            </h1>

            <p style={{ fontSize: '0.84rem', color: T.textMuted, lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {status === 'error'
                ? (message || 'Ce lien d’activation a expiré ou n’est plus valide. Les liens sont valables 24 heures.')
                : 'Indiquez votre adresse email ci-dessous pour recevoir un nouveau lien d’activation de compte.'}
            </p>

            {resendError && (
              <div style={{
                background: 'rgba(220,38,38,0.08)',
                border: '1px solid rgba(220,38,38,0.25)',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '0.82rem',
                color: '#ef4444',
                marginBottom: '1rem',
                textAlign: 'left',
              }}>
                {resendError}
              </div>
            )}

            {resendMessage && (
              <div style={{
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.25)',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '0.82rem',
                color: '#10b981',
                marginBottom: '1rem',
                textAlign: 'left',
              }}>
                {resendMessage}
              </div>
            )}

            <form onSubmit={handleResend} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.5rem' }}>
              <input
                type="email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder="Votre adresse email (ex: vous@domaine.com)"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: `1px solid ${T.border}`,
                  background: T.bg,
                  color: T.textMain,
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="submit"
                disabled={resendLoading}
                className="btn-raised"
                style={{
                  width: '100%',
                  padding: '13px 20px',
                  borderRadius: '10px',
                  background: '#b47027',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  border: '1px solid #050505',
                  cursor: resendLoading ? 'default' : 'pointer',
                  opacity: resendLoading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {resendLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Envoi en cours…</span>
                  </>
                ) : (
                  <span>Renvoyer le lien d’activation</span>
                )}
              </button>
            </form>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.82rem' }}>
              <Link href="/connexion" style={{ color: '#b47027', fontWeight: 600, textDecoration: 'none' }}>
                Retour à la connexion
              </Link>
              <span style={{ color: T.textMuted }}>•</span>
              <Link href="/" style={{ color: T.textMuted, textDecoration: 'none' }}>
                Accueil
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
