'use client'

import { useEffect, useRef, useState } from 'react'
import api from '@/lib/api-client'
import { useShop } from '@/lib/shopContext'
import { useRouter } from 'next/navigation'

export default function GoogleAuthButton({
  text = 'Continuer avec Google',
  mode = 'signin', // 'signin' | 'signup'
  theme = 'outline', // 'outline' | 'filled_black' | 'filled_blue'
  redirectTo = '/mon-compte',
  onSuccess,
  onError,
}) {
  const { login, showToast } = useShop()
  const router = useRouter()
  const googleBtnRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  // Gestion du retour du token ID Google
  const handleCredentialResponse = async (response) => {
    if (!response?.credential) {
      const err = 'Aucun jeton d’authentification Google reçu.'
      if (onError) onError(err)
      else showToast(err, 'error')
      return
    }

    setLoading(true)
    try {
      // 1. Appel API backend
      let res
      try {
        res = await api.auth.google(response.credential)
      } catch (apiErr) {
        // Fallback sur la route interne Next.js
        const fallback = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: response.credential }),
        })
        res = await fallback.json()
      }

      if (!res?.success && !res?.user && !res?.data?.user) {
        throw new Error(res?.message || res?.error || 'Échec de la connexion Google.')
      }

      const user = res?.data?.user || res?.user
      const token = res?.data?.token || res?.token

      if (user) {
        login(user, token)
        showToast(`Bienvenue, ${user.name || 'Client AVS'} !`, 'success')
        if (onSuccess) {
          onSuccess(user, token)
        } else {
          router.push(redirectTo)
        }
      }
    } catch (err) {
      console.error('[Google Auth] Erreur:', err)
      const msg = err.message || 'Erreur lors de la connexion avec Google.'
      if (onError) onError(msg)
      else showToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Chargement du script Google Identity Services
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (window.google?.accounts?.id) {
      setScriptLoaded(true)
      return
    }

    const existingScript = document.getElementById('google-gsi-script')
    if (!existingScript) {
      const script = document.createElement('script')
      script.id = 'google-gsi-script'
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => setScriptLoaded(true)
      document.body.appendChild(script)
    } else {
      existingScript.addEventListener('load', () => setScriptLoaded(true))
    }
  }, [])

  // Initialisation et rendu du bouton officiel Google
  useEffect(() => {
    if (!scriptLoaded || !clientId || !googleBtnRef.current || !window.google?.accounts?.id) return

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      })

      // Rendu du bouton officiel Google avec dimensions responsives
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: 'standard',
        theme: theme || 'outline',
        size: 'large',
        text: mode === 'signup' ? 'signup_with' : 'signin_with',
        shape: 'pill',
        logo_alignment: 'left',
        width: googleBtnRef.current.parentElement?.offsetWidth || 340,
        locale: 'fr',
      })
    } catch (e) {
      console.warn('[Google Auth Init Error]', e)
    }
  }, [scriptLoaded, clientId, mode, theme])

  const handleCustomClick = () => {
    if (!clientId) {
      showToast(
        'Configuration requise : veuillez renseigner NEXT_PUBLIC_GOOGLE_CLIENT_ID dans vos fichiers d’environnement.',
        'info'
      )
      return
    }

    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt()
    }
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '14px 0' }}>
      {/* Conteneur pour le bouton officiel injecté par Google */}
      {clientId ? (
        <div
          ref={googleBtnRef}
          style={{
            minHeight: '44px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      ) : (
        /* Bouton stylé personnalisé avec logo Google SVG */
        <button
          type="button"
          onClick={handleCustomClick}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            background: theme === 'filled_black' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
            border: theme === 'filled_black' ? '1px solid rgba(255, 255, 255, 0.15)' : '1.5px solid #e2e8f0',
            borderRadius: '9999px',
            padding: '11px 20px',
            color: theme === 'filled_black' ? '#f8fafc' : '#1e293b',
            fontSize: '0.92rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: theme === 'filled_black' ? 'none' : '0 2px 6px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (theme === 'filled_black') {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.borderColor = '#b47027'
            } else {
              e.currentTarget.style.background = '#f8fafc'
              e.currentTarget.style.borderColor = '#b47027'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(180, 112, 39, 0.15)'
            }
          }}
          onMouseLeave={(e) => {
            if (theme === 'filled_black') {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
            } else {
              e.currentTarget.style.background = '#ffffff'
              e.currentTarget.style.borderColor = '#e2e8f0'
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)'
            }
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          {loading ? 'Connexion en cours...' : text}
        </button>
      )}
    </div>
  )
}
