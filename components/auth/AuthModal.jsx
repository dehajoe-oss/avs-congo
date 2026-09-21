'use client'

import { useState } from 'react'
import { X, User, Phone, Lock, Building, CheckCircle2, ArrowRight, Mail, Loader2, AlertCircle } from 'lucide-react'
import { useShop } from '@/lib/shopContext'
import { useTheme } from '@/lib/theme'
import api from '@/lib/api-client'
import GoogleAuthButton from './GoogleAuthButton'

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, showToast } = useShop()
  const T = useTheme()
  const [isRegister, setIsRegister] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    companyName: '',
    userType: 'breeder', // 'breeder' (éleveur) | 'company' (entreprise)
  })

  // ── État confirmation par email ──
  const [verificationPendingEmail, setVerificationPendingEmail] = useState('')
  const [devVerifyUrl, setDevVerifyUrl] = useState('')
  const [unverifiedLoginEmail, setUnverifiedLoginEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMsg, setResendMsg] = useState('')

  if (!isAuthModalOpen) return null

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleResend = async (targetEmail) => {
    const emailToSend = (targetEmail || verificationPendingEmail || unverifiedLoginEmail || formData.email || formData.phone).trim()
    if (!emailToSend) {
      showToast('Veuillez renseigner votre adresse email', 'warning')
      return
    }

    setResendLoading(true)
    setResendMsg('')
    try {
      let res
      try {
        res = await api.auth.resendVerification(emailToSend)
      } catch (apiErr) {
        const fallback = await fetch('/api/auth/resend-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailToSend, identifier: emailToSend }),
        })
        res = await fallback.json()
      }
      const devUrl = res?.data?.devVerifyUrl || res?.devVerifyUrl
      if (devUrl) setDevVerifyUrl(devUrl)
      setResendMsg(res?.message || `Un nouveau lien a été envoyé à ${emailToSend}.`)
      showToast('Lien de validation renvoyé !', 'success')
    } catch (err) {
      showToast(err.message || 'Erreur lors du renvoi de l’email', 'error')
    } finally {
      setResendLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const phone = formData.phone.trim()
    const password = formData.password.trim()
    const fullName = formData.fullName.trim()
    const email = formData.email.trim()

    if (!phone || !password) {
      showToast('Veuillez renseigner votre téléphone / email et mot de passe', 'warning')
      return
    }

    if (isRegister) {
      if (!fullName) {
        showToast('Veuillez renseigner votre nom complet ou raison sociale', 'warning')
        return
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Une adresse email valide est obligatoire pour valider votre compte', 'warning')
        return
      }
    }

    setLoading(true)
    setUnverifiedLoginEmail('')
    setResendMsg('')

    try {
      if (isRegister) {
        const displayName = formData.userType === 'company' && formData.companyName.trim()
          ? `${fullName} — ${formData.companyName.trim()}`
          : fullName

        const result = await api.auth.register({
          name: displayName,
          fullName: displayName,
          phone,
          email,
          password,
        })

        // L'utilisateur DOIT valider son compte par email
        const devUrl = result?.data?.devVerifyUrl || result?.devVerifyUrl
        if (devUrl) setDevVerifyUrl(devUrl)
        setVerificationPendingEmail(email)
        showToast('Compte créé ! Vérifiez votre boîte mail pour l’activer.', 'success')
      } else {
        const result = await api.auth.login({
          identifier: phone,
          email: phone.includes('@') ? phone : (email || undefined),
          phone: !phone.includes('@') ? phone : undefined,
          password,
        })

        const user = result?.data?.user || result?.user
        const token = result?.data?.token || result?.token

        if (user) {
          login(user, token)
          closeAuthModal()
          setFormData({ fullName: '', phone: '', email: '', password: '', companyName: '', userType: 'breeder' })
          showToast('Connexion réussie', 'success')
        } else {
          showToast(result?.message || 'Connexion réussie', 'success')
        }
      }
    } catch (err) {
      console.error('Erreur auth backend:', err)
      const msg = err.message || ''
      const lower = msg.toLowerCase()
      if (lower.includes('valid') || lower.includes('activ') || lower.includes('confirm')) {
        setUnverifiedLoginEmail(phone.includes('@') ? phone : email)
      }
      showToast(msg || 'Identifiants invalides ou impossible de contacter le serveur', 'error')
    } finally {
      setLoading(false)
    }
  }

  const resetToLogin = () => {
    setVerificationPendingEmail('')
    setUnverifiedLoginEmail('')
    setResendMsg('')
    setIsRegister(false)
  }

  return (
    <div
      onClick={closeAuthModal}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          background: T.light ? '#ffffff' : '#0e1710',
          border: '1px solid rgba(180, 112, 39, 0.35)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 30px rgba(180, 112, 39, 0.15)',
          padding: '2rem',
          position: 'relative',
          color: T.light ? '#111827' : '#f3f4f6',
          fontFamily: "'Poppins', sans-serif",
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Bouton fermer */}
        <button
          onClick={closeAuthModal}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: T.light ? '#4b5563' : '#9ca3af',
          }}
        >
          <X size={18} />
        </button>

        {/* ── CAS ÉCRAN DE CONFIRMATION EMAIL APRÈS INSCRIPTION ── */}
        {verificationPendingEmail ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(180, 112, 39, 0.15)',
                border: '1px solid rgba(180, 112, 39, 0.35)',
                color: '#b47027',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.2rem',
              }}
            >
              <Mail size={32} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
              Vérifiez votre boîte mail !
            </h2>
            <p style={{ fontSize: '0.84rem', color: T.light ? '#6b7280' : '#9ca3af', lineHeight: 1.5, marginBottom: '1rem' }}>
              Un lien d’activation a été envoyé à :
            </p>
            <div
              style={{
                padding: '8px 14px',
                background: 'rgba(180, 112, 39, 0.12)',
                border: '1px solid rgba(180, 112, 39, 0.28)',
                borderRadius: '10px',
                fontWeight: 700,
                color: '#b47027',
                display: 'inline-block',
                marginBottom: '1.2rem',
                fontSize: '0.86rem',
                wordBreak: 'break-all',
              }}
            >
              {verificationPendingEmail}
            </div>
            <p style={{ fontSize: '0.78rem', color: T.light ? '#6b7280' : 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Veuillez cliquer sur ce lien pour valider votre compte avant de vous connecter. Pensez également à vérifier vos courriers indésirables (spams).
            </p>

            {resendMsg && (
              <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', padding: '8px 12px', borderRadius: '8px', fontSize: '0.78rem', marginBottom: '1rem' }}>
                {resendMsg}
              </div>
            )}

            {devVerifyUrl && (
              <div style={{
                margin: '0 0 1.2rem',
                padding: '10px 14px',
                background: 'rgba(180, 112, 39, 0.12)',
                border: '1px dashed #b47027',
                borderRadius: '10px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '11px', color: '#b47027', fontWeight: 700, marginBottom: '4px' }}>
                  ⚡ Lien direct (mode test) :
                </div>
                <a
                  href={devVerifyUrl}
                  style={{ fontSize: '12px', color: '#ffffff', textDecoration: 'underline', fontWeight: 600, wordBreak: 'break-all' }}
                >
                  Valider mon adresse email &rarr;
                </a>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <button
                type="button"
                onClick={() => handleResend(verificationPendingEmail)}
                disabled={resendLoading}
                style={{
                  padding: '11px',
                  borderRadius: '10px',
                  border: '1px solid #b47027',
                  background: 'transparent',
                  color: '#b47027',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: resendLoading ? 'default' : 'pointer',
                  opacity: resendLoading ? 0.7 : 1,
                }}
              >
                {resendLoading ? 'Envoi en cours…' : 'Renvoyer l’email de validation'}
              </button>
              <button
                type="button"
                onClick={resetToLogin}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#b47027',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                Passer à la connexion
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* En-tête */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  padding: '6px 14px',
                  borderRadius: '100px',
                  background: 'rgba(180, 112, 39, 0.15)',
                  border: '1px solid rgba(180, 112, 39, 0.3)',
                  color: '#b47027',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.6rem',
                }}
              >
                Espace Éleveur & Partenaire
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.3rem', letterSpacing: '-0.02em' }}>
                {isRegister ? 'Créer un Compte Express' : 'Connexion à votre Espace'}
              </h2>
              <p style={{ fontSize: '0.8rem', color: T.light ? '#6b7280' : '#9ca3af', margin: 0, lineHeight: 1.4 }}>
                {isRegister
                  ? 'Activez votre compte pour suivre vos commandes et intrants.'
                  : 'Accédez à votre historique de commandes et vos services.'}
              </p>
            </div>

            {/* Bascule Inscription / Connexion */}
            <div
              style={{
                display: 'flex',
                background: T.light ? '#f3f4f6' : 'rgba(255,255,255,0.05)',
                padding: '4px',
                borderRadius: '14px',
                marginBottom: '1.3rem',
              }}
            >
              <button
                type="button"
                onClick={() => { setIsRegister(true); setUnverifiedLoginEmail(''); }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: isRegister ? '#b47027' : 'transparent',
                  color: isRegister ? '#ffffff' : (T.light ? '#4b5563' : '#9ca3af'),
                  transition: 'all 0.2s ease',
                }}
              >
                Inscription Express
              </button>
              <button
                type="button"
                onClick={() => { setIsRegister(false); }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: !isRegister ? '#b47027' : 'transparent',
                  color: !isRegister ? '#ffffff' : (T.light ? '#4b5563' : '#9ca3af'),
                  transition: 'all 0.2s ease',
                }}
              >
                Connexion
              </button>
            </div>

            {/* Connexion / Inscription rapide avec Google */}
            <GoogleAuthButton
              mode={isRegister ? 'signup' : 'signin'}
              text={isRegister ? "S'inscrire avec Google" : "Se connecter avec Google"}
              theme={T.light ? 'outline' : 'filled_black'}
              onSuccess={() => {
                closeAuthModal()
              }}
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                margin: '0.6rem 0 1rem',
                gap: '10px',
              }}
            >
              <div style={{ flex: 1, height: '1px', background: T.light ? '#e5e7eb' : 'rgba(255,255,255,0.1)' }} />
              <span
                style={{
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: T.light ? '#9ca3af' : '#6b7280',
                  fontWeight: 600,
                }}
              >
                ou {isRegister ? 'avec votre téléphone' : 'avec vos identifiants'}
              </span>
              <div style={{ flex: 1, height: '1px', background: T.light ? '#e5e7eb' : 'rgba(255,255,255,0.1)' }} />
            </div>

            {/* Alerte compte non vérifié à la connexion */}
            {unverifiedLoginEmail && (
              <div style={{
                background: 'rgba(180, 112, 39, 0.12)',
                border: '1px solid rgba(180, 112, 39, 0.35)',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '1rem',
                fontSize: '0.78rem',
                lineHeight: 1.5,
              }}>
                <div style={{ fontWeight: 700, color: '#b47027', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={15} /> Validation requise
                </div>
                <div style={{ color: T.light ? '#374151' : '#d1d5db', marginBottom: '8px' }}>
                  Votre compte n’a pas encore été activé par email.
                </div>
                <button
                  type="button"
                  onClick={() => handleResend(unverifiedLoginEmail)}
                  disabled={resendLoading}
                  style={{
                    background: '#b47027',
                    border: 'none',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: resendLoading ? 'default' : 'pointer',
                  }}
                >
                  {resendLoading ? 'Envoi…' : 'Renvoyer le lien de validation'}
                </button>
                {resendMsg && <div style={{ color: '#10b981', marginTop: '6px', fontWeight: 600 }}>{resendMsg}</div>}
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {isRegister && (
                <>
                  {/* Type de compte */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, userType: 'breeder' }))}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '10px',
                        border: `1px solid ${formData.userType === 'breeder' ? '#b47027' : 'rgba(255,255,255,0.1)'}`,
                        background: formData.userType === 'breeder' ? 'rgba(180, 112, 39, 0.15)' : 'transparent',
                        color: formData.userType === 'breeder' ? '#b47027' : 'inherit',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      🐥 Éleveur
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, userType: 'company' }))}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '10px',
                        border: `1px solid ${formData.userType === 'company' ? '#b47027' : 'rgba(255,255,255,0.1)'}`,
                        background: formData.userType === 'company' ? 'rgba(180, 112, 39, 0.15)' : 'transparent',
                        color: formData.userType === 'company' ? '#b47027' : 'inherit',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      🏢 Entreprise
                    </button>
                  </div>

                  {/* Nom complet */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', opacity: 0.85 }}>
                      Nom Complet ou Raison Sociale *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Ex: Jean BISSOUA"
                        required={isRegister}
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 38px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.15)',
                          background: T.light ? '#f9fafb' : '#080d09',
                          color: 'inherit',
                          fontSize: '0.85rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  {formData.userType === 'company' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', opacity: 0.85 }}>
                        Nom de l’exploitation / Ferme (Optionnel)
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Building size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          placeholder="Ex: Ferme Avicole de Tié-Tié"
                          style={{
                            width: '100%',
                            padding: '10px 12px 10px 38px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.15)',
                            background: T.light ? '#f9fafb' : '#080d09',
                            color: 'inherit',
                            fontSize: '0.85rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Email obligatoire pour l'activation */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', opacity: 0.85 }}>
                      Adresse email (activation requise) *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="vous@email.com"
                        required={isRegister}
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 38px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.15)',
                          background: T.light ? '#f9fafb' : '#080d09',
                          color: 'inherit',
                          fontSize: '0.85rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Téléphone WhatsApp ou Identifiant */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', opacity: 0.85 }}>
                  {isRegister ? 'Téléphone WhatsApp (Congo +242) *' : 'Téléphone WhatsApp ou Email *'}
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                  <input
                    type={isRegister ? 'tel' : 'text'}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={isRegister ? "06 123 45 67" : "06 123 45 67 ou vous@email.com"}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      background: T.light ? '#f9fafb' : '#080d09',
                      color: 'inherit',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', opacity: 0.85 }}>
                  Mot de passe *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Votre mot de passe"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      background: T.light ? '#f9fafb' : '#080d09',
                      color: 'inherit',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Bouton de validation */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '0.4rem',
                  padding: '12px 20px',
                  borderRadius: '100px',
                  border: 'none',
                  background: '#b47027',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: loading ? 'default' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'transform 0.15s ease, background 0.2s ease',
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Traitement en cours...</span>
                  </>
                ) : (
                  <>
                    <span>{isRegister ? 'Créer mon Compte' : 'Se Connecter'}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
