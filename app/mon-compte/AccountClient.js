'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  User,
  ShoppingBag,
  CreditCard,
  LogOut,
  Package,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Camera,
  Save,
  Lock,
} from 'lucide-react'
import { useShop } from '@/lib/shopContext'
import { useTheme } from '@/lib/theme'
import api from '@/lib/api-client'
import ImageUploadButton from '@/components/admin/ImageUploadButton'

// ── Onglet Profil : avatar, infos, mot de passe ─────────────────────────────
function ProfileTab({ user }) {
  const T = useTheme()
  const { refreshProfile, showToast } = useShop()
  const [name, setName] = useState(user.name || user.fullName || '')
  const [phone, setPhone] = useState(user.phone || '')
  const [avatar, setAvatar] = useState(user.avatar || '')
  const [saving, setSaving] = useState(false)
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [newPwd2, setNewPwd2] = useState('')
  const [pwdMsg, setPwdMsg] = useState(null)

  const card = {
    background: T.light ? '#ffffff' : '#0e1710',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '1.6rem',
    marginBottom: '1.2rem',
  }
  const input = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: `1px solid ${T.light ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.15)'}`,
    background: T.light ? '#f9fafb' : '#080d09',
    color: T.light ? '#111827' : '#f3f4f6',
    fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box',
  }
  const label = { display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px', opacity: 0.85 }

  const handleSaveInfos = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      showToast('Le nom est obligatoire', 'warning')
      return
    }
    setSaving(true)
    try {
      await api.auth.updateProfile({ name: name.trim(), phone: phone.trim() || null, avatar: avatar || null })
      await refreshProfile()
      showToast('Profil mis à jour', 'success')
    } catch (err) {
      showToast(err.message || 'Mise à jour impossible', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handlePassword = async (e) => {
    e.preventDefault()
    setPwdMsg(null)
    if (!currentPwd || !newPwd) {
      setPwdMsg({ type: 'error', text: 'Renseignez le mot de passe actuel et le nouveau.' })
      return
    }
    if (newPwd.length < 8) {
      setPwdMsg({ type: 'error', text: 'Minimum 8 caractères, lettres et chiffres.' })
      return
    }
    if (newPwd !== newPwd2) {
      setPwdMsg({ type: 'error', text: 'La confirmation ne correspond pas.' })
      return
    }
    try {
      const res = await api.auth.updatePassword({ currentPassword: currentPwd, newPassword: newPwd })
      setPwdMsg({ type: 'success', text: res?.message || 'Mot de passe modifié.' })
      setCurrentPwd('')
      setNewPwd('')
      setNewPwd2('')
    } catch (err) {
      setPwdMsg({ type: 'error', text: err.message || 'Modification impossible.' })
    }
  }

  return (
    <div>
      <div style={card}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 1.2rem' }}>Photo & informations</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '20px', overflow: 'hidden', background: '#b47027', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 900, flexShrink: 0 }}>
            {avatar
              ? <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
              : (name?.charAt(0).toUpperCase() || 'U')}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Camera size={15} color="#b47027" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Photo de profil</span>
            </div>
            <ImageUploadButton folder="avs-avatars" onUploaded={(url) => setAvatar(url)} />
          </div>
        </div>
        <form onSubmit={handleSaveInfos} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div>
            <label style={label}>Nom complet</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={input} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={label}>Téléphone WhatsApp</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={input} />
            </div>
            <div>
              <label style={label}>Email</label>
              <input type="text" value={user.email || ''} disabled style={{ ...input, opacity: 0.6 }} />
            </div>
          </div>
          <button type="submit" disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px 22px', borderRadius: '100px', border: 'none', background: '#b47027', color: '#fff', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', opacity: saving ? 0.7 : 1, alignSelf: 'flex-start' }}>
            <Save size={15} /> {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </form>
      </div>

      <div style={card}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={16} color="#b47027" /> Changer le mot de passe
        </h3>
        {pwdMsg && (
          <div style={{ background: pwdMsg.type === 'error' ? 'rgba(220,38,38,0.07)' : 'rgba(16,185,129,0.08)', border: `1px solid ${pwdMsg.type === 'error' ? 'rgba(220,38,38,0.2)' : 'rgba(16,185,129,0.25)'}`, borderRadius: '10px', padding: '8px 12px', fontSize: '12px', color: pwdMsg.type === 'error' ? '#dc2626' : '#10b981', marginBottom: '12px' }}>
            {pwdMsg.text}
          </div>
        )}
        <form onSubmit={handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div>
            <label style={label}>Mot de passe actuel</label>
            <input type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} style={input} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={label}>Nouveau (8 min., lettres + chiffres)</label>
              <input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} style={input} />
            </div>
            <div>
              <label style={label}>Confirmation</label>
              <input type="password" value={newPwd2} onChange={(e) => setNewPwd2(e.target.value)} style={input} />
            </div>
          </div>
          <button type="submit" style={{ padding: '11px 22px', borderRadius: '100px', border: '1px solid rgba(180, 112, 39, 0.4)', background: 'transparent', color: '#b47027', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', alignSelf: 'flex-start' }}>
            Modifier le mot de passe
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AccountClient() {
  const T = useTheme()
  const { currentUser, logout, orders } = useShop()
  const [activeTab, setActiveTab] = useState('orders')

  if (!currentUser) {
    return (
      <div
        style={{
          paddingTop: '150px',
          paddingBottom: '120px',
          background: T.light ? '#f6f8fa' : '#070d06',
          color: T.light ? '#0f172a' : '#f3f4f6',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Poppins', sans-serif",
          padding: '0 1rem',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            width: '100%',
            background: T.light ? '#ffffff' : '#0e1710',
            border: '1px solid rgba(180, 112, 39, 0.35)',
            borderRadius: '24px',
            padding: '2.5rem',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(180, 112, 39, 0.15)',
              color: '#b47027',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.2rem',
            }}
          >
            <User size={32} />
          </div>

          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.6rem' }}>
            Espace Éleveur & Client
          </h1>

          <p style={{ fontSize: '0.88rem', color: T.light ? '#4b5563' : '#9ca3af', lineHeight: 1.6, margin: '0 0 2rem' }}>
            Connectez-vous ou créez votre compte express en 15 secondes pour suivre vos commandes, vos règlements KKiaPay et vos livraisons d’intrants.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link
              href="/connexion"
              style={{
                width: '100%',
                padding: '13px 20px',
                borderRadius: '100px',
                border: 'none',
                background: '#b47027',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textDecoration: 'none',
                boxSizing: 'border-box',
              }}
            >
              <span>Se Connecter / Créer un Compte</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/boutique"
              style={{
                display: 'inline-block',
                padding: '12px 20px',
                borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'transparent',
                color: 'inherit',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Retourner à la boutique
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isCompany = currentUser.userType === 'company'
  const displayName = currentUser.fullName || currentUser.name || 'Client AVS'

  return (
    <div
      style={{
        paddingTop: '110px',
        paddingBottom: '100px',
        background: T.light ? '#f6f8fa' : '#070d06',
        color: T.light ? '#0f172a' : '#f3f4f6',
        minHeight: '100vh',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Bannière Profil */}
        <div
          style={{
            background: T.light ? '#ffffff' : '#0e1710',
            border: '1px solid rgba(180, 112, 39, 0.3)',
            borderRadius: '24px',
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                overflow: 'hidden',
                background: '#b47027',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                fontWeight: 900,
                flexShrink: 0,
              }}
            >
              {currentUser.avatar
                ? <img src={currentUser.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
                : displayName.charAt(0).toUpperCase()}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                  {displayName}
                </h1>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: '100px',
                    background: (currentUser.role === 'ADMIN' || currentUser.role === 'STAFF') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(180, 112, 39, 0.15)',
                    border: (currentUser.role === 'ADMIN' || currentUser.role === 'STAFF') ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(180, 112, 39, 0.3)',
                    color: (currentUser.role === 'ADMIN' || currentUser.role === 'STAFF') ? '#ef4444' : '#b47027',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  {currentUser.role === 'ADMIN' ? '👑 Administrateur Direction' : currentUser.role === 'STAFF' ? '🛡️ Équipe Technique AVS' : isCompany ? 'Compte Ferme / Entreprise' : 'Compte Éleveur'}
                </span>
              </div>

              {currentUser.companyName && (
                <div style={{ fontSize: '0.85rem', color: '#b47027', fontWeight: 600, marginTop: '2px' }}>
                  {currentUser.companyName}
                </div>
              )}

              <div style={{ fontSize: '0.8rem', color: T.light ? '#6b7280' : '#9ca3af', marginTop: '4px' }}>
                📞 {currentUser.phone} • Membre actif AVS Congo • Pointe-Noire
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {(currentUser.role === 'ADMIN' || currentUser.role === 'STAFF') && (
              <Link
                href="/admin"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: '100px',
                  background: 'linear-gradient(135deg, #b47027, #8f551b)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(180, 112, 39, 0.35)',
                }}
              >
                <ShieldCheck size={16} />
                <span>Espace Back-Office Admin</span>
              </Link>
            )}

            <button
              onClick={logout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                borderRadius: '100px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <LogOut size={15} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Onglets Commandes / Profil */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.8rem' }}>
          {[
            { id: 'orders', label: 'Mes commandes', icon: ShoppingBag },
            { id: 'profile', label: 'Mon profil', icon: User },
          ].map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 20px', borderRadius: '100px',
                  border: isActive ? 'none' : '1px solid rgba(255,255,255,0.12)',
                  background: isActive ? '#b47027' : 'transparent',
                  color: isActive ? '#fff' : 'inherit',
                  fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                }}
              >
                <Icon size={15} /> {tab.label}
              </button>
            )
          })}
        </div>

        {activeTab === 'profile' ? (
          <ProfileTab user={currentUser} />
        ) : (
        <>
        {/* Section Commandes */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
              Mes Commandes & Règlements KKiaPay
            </h2>
            <p style={{ fontSize: '0.82rem', color: T.light ? '#6b7280' : '#9ca3af', margin: '4px 0 0' }}>
              Consultez le statut de vos commandes d’intrants et de poussins.
            </p>
          </div>

          <Link
            href="/boutique"
            style={{
              padding: '10px 18px',
              borderRadius: '100px',
              border: 'none',
              background: '#b47027',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShoppingBag size={15} />
            <span>Nouvelle Commande</span>
          </Link>
        </div>

        {orders.length === 0 ? (
          <div
            style={{
              background: T.light ? '#ffffff' : '#0e1710',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              padding: '3rem 2rem',
              textAlign: 'center',
            }}
          >
            <Package size={40} color="#b47027" style={{ margin: '0 auto 1rem', opacity: 0.7 }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
              Aucune commande enregistrée pour le moment
            </h3>
            <p style={{ fontSize: '0.85rem', color: T.light ? '#6b7280' : '#9ca3af', marginBottom: '1.5rem' }}>
              Vous n’avez pas encore passé de commande avec ce numéro de téléphone.
            </p>
            <Link
              href="/boutique"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 22px',
                borderRadius: '100px',
                background: '#b47027',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <span>Accéder au catalogue de la boutique</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order) => {
              const isPaid = order.paymentStatus === 'PAID'
              return (
                <div
                  key={order.id || order.orderNumber}
                  style={{
                    background: T.light ? '#ffffff' : '#0e1710',
                    border: `1px solid ${isPaid ? 'rgba(180, 112, 39, 0.4)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '20px',
                    padding: '1.6rem',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      marginBottom: '1rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#b47027' }}>
                          {order.orderNumber}
                        </span>
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: '100px',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            background: isPaid ? 'rgba(180, 112, 39, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: isPaid ? '#b47027' : '#f59e0b',
                            border: `1px solid ${isPaid ? 'rgba(180, 112, 39, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                          }}
                        >
                          {isPaid ? '✓ PAYÉ VIA KKIAPAY' : '⏳ EN ATTENTE DE RÈGLEMENT'}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.75rem', color: T.light ? '#6b7280' : '#9ca3af', marginTop: '3px' }}>
                        Date : {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {' · '}Livraison : {order.customerAddress}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#b47027' }}>
                        {Number(order.totalAmount).toLocaleString('fr-FR')} FCFA
                      </div>
                      <div style={{ fontSize: '0.72rem', color: T.light ? '#6b7280' : '#9ca3af' }}>
                        Mode : {order.paymentMethod === 'kkiapay' ? 'KKiaPay Mobile Money' : order.paymentMethod === 'whatsapp' ? 'WhatsApp' : 'Comptoir Siège'}
                      </div>
                    </div>
                  </div>

                  {/* Liste des articles commandés */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.5 }}>
                      Détail des articles :
                    </div>
                    {Array.isArray(order.items) && order.items.map((it, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.82rem',
                          padding: '4px 0',
                        }}
                      >
                        <span>
                          {it.name} <strong style={{ color: '#b47027' }}>x{it.quantity}</strong>
                        </span>
                        <span style={{ fontWeight: 600 }}>
                          {(it.price * it.quantity).toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Transaction ID si payé */}
                  {order.transactionId && (
                    <div
                      style={{
                        marginTop: '1rem',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: 'rgba(180, 112, 39, 0.08)',
                        fontSize: '0.75rem',
                        color: T.light ? '#4b5563' : '#9ca3af',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <ShieldCheck size={14} color="#b47027" />
                      <span>Réf. transaction KKiaPay : <code>{order.transactionId}</code></span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
        </>
        )}
      </div>
    </div>
  )
}
