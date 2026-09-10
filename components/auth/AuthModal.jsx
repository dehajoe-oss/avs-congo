'use client'

import { useState } from 'react'
import { X, User, Phone, Lock, Building, CheckCircle2, ArrowRight } from 'lucide-react'
import { useShop } from '@/lib/shopContext'
import { useTheme } from '@/lib/theme'

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, showToast } = useShop()
  const T = useTheme()
  const [isRegister, setIsRegister] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    companyName: '',
    userType: 'breeder', // 'breeder' (éleveur) | 'company' (entreprise)
  })

  if (!isAuthModalOpen) return null

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.phone.trim() || !formData.password.trim()) {
      showToast('Veuillez renseigner votre téléphone et mot de passe', 'warning')
      return
    }

    if (isRegister && !formData.fullName.trim()) {
      showToast('Veuillez renseigner votre nom complet ou raison sociale', 'warning')
      return
    }

    setLoading(true)

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'
      const payload = isRegister
        ? {
            fullName: formData.fullName.trim(),
            phone: formData.phone.trim(),
            password: formData.password.trim(),
            companyName: formData.companyName.trim(),
            userType: formData.userType,
          }
        : {
            phone: formData.phone.trim(),
            password: formData.password.trim(),
          }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || 'Une erreur est survenue', 'error')
        setLoading(false)
        return
      }

      login(data.user)
      closeAuthModal()
      setFormData({ fullName: '', phone: '', password: '', companyName: '', userType: 'breeder' })
    } catch (err) {
      console.error('Erreur auth:', err)
      showToast('Impossible de contacter le serveur', 'error')
    } finally {
      setLoading(false)
    }
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
          border: '1px solid rgba(90, 135, 56, 0.35)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 30px rgba(90, 135, 56, 0.15)',
          padding: '2rem',
          position: 'relative',
          color: T.light ? '#111827' : '#f3f4f6',
          fontFamily: "'Space Grotesk', sans-serif",
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

        {/* En-tête */}
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '6px 14px',
              borderRadius: '100px',
              background: 'rgba(90, 135, 56, 0.15)',
              border: '1px solid rgba(90, 135, 56, 0.3)',
              color: '#5a8738',
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.8rem',
            }}
          >
            Espace Éleveur & Partenaire
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
            {isRegister ? 'Créer un Compte Express' : 'Connexion à votre Espace'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: T.light ? '#6b7280' : '#9ca3af', margin: 0, lineHeight: 1.4 }}>
            {isRegister
              ? 'Passez vos commandes d’intrants et suivez vos livraisons à Pointe-Noire.'
              : 'Accédez à votre historique de commandes et vos paiements.'}
          </p>
        </div>

        {/* Bascule Inscription / Connexion */}
        <div
          style={{
            display: 'flex',
            background: T.light ? '#f3f4f6' : 'rgba(255,255,255,0.05)',
            padding: '4px',
            borderRadius: '14px',
            marginBottom: '1.5rem',
          }}
        >
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: isRegister ? '#5a8738' : 'transparent',
              color: isRegister ? '#ffffff' : (T.light ? '#4b5563' : '#9ca3af'),
              transition: 'all 0.2s ease',
            }}
          >
            Inscription Express
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: !isRegister ? '#5a8738' : 'transparent',
              color: !isRegister ? '#ffffff' : (T.light ? '#4b5563' : '#9ca3af'),
              transition: 'all 0.2s ease',
            }}
          >
            Connexion
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                    border: `1px solid ${formData.userType === 'breeder' ? '#5a8738' : 'rgba(255,255,255,0.1)'}`,
                    background: formData.userType === 'breeder' ? 'rgba(90, 135, 56, 0.15)' : 'transparent',
                    color: formData.userType === 'breeder' ? '#5a8738' : 'inherit',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  🐥 Éleveur Particulier
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'company' }))}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '10px',
                    border: `1px solid ${formData.userType === 'company' ? '#5a8738' : 'rgba(255,255,255,0.1)'}`,
                    background: formData.userType === 'company' ? 'rgba(90, 135, 56, 0.15)' : 'transparent',
                    color: formData.userType === 'company' ? '#5a8738' : 'inherit',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  🏢 Entreprise / Ferme
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
                    placeholder="Ex: Jean BISSOUA ou Ferme de Loandjili"
                    required={isRegister}
                    style={{
                      width: '100%',
                      padding: '11px 12px 11px 38px',
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
                        padding: '11px 12px 11px 38px',
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
            </>
          )}

          {/* Téléphone WhatsApp */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', opacity: 0.85 }}>
              Téléphone WhatsApp (Congo +242) *
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="06 123 45 67 ou +242 05 678 90 12"
                required
                style={{
                  width: '100%',
                  padding: '11px 12px 11px 38px',
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
                placeholder="Votre mot de passe sécurisé"
                required
                style={{
                  width: '100%',
                  padding: '11px 12px 11px 38px',
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
              marginTop: '0.5rem',
              padding: '13px 20px',
              borderRadius: '100px',
              border: 'none',
              background: '#5a8738',
              color: '#ffffff',
              fontSize: '0.9rem',
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
            {loading ? 'Traitement en cours...' : (
              <>
                <span>{isRegister ? 'Créer mon Compte' : 'Se Connecter'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
