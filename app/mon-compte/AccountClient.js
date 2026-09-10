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
} from 'lucide-react'
import { useShop } from '@/lib/shopContext'
import { useTheme } from '@/lib/theme'

export default function AccountClient() {
  const T = useTheme()
  const { currentUser, logout, openAuthModal, orders } = useShop()
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
          fontFamily: "'Space Grotesk', sans-serif",
          padding: '0 1rem',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            width: '100%',
            background: T.light ? '#ffffff' : '#0e1710',
            border: '1px solid rgba(90, 135, 56, 0.35)',
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
              background: 'rgba(90, 135, 56, 0.15)',
              color: '#5a8738',
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
            <button
              onClick={openAuthModal}
              style={{
                width: '100%',
                padding: '13px 20px',
                borderRadius: '100px',
                border: 'none',
                background: '#5a8738',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>Se Connecter / Créer un Compte</span>
              <ArrowRight size={16} />
            </button>

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

  return (
    <div
      style={{
        paddingTop: '110px',
        paddingBottom: '100px',
        background: T.light ? '#f6f8fa' : '#070d06',
        color: T.light ? '#0f172a' : '#f3f4f6',
        minHeight: '100vh',
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Bannière Profil */}
        <div
          style={{
            background: T.light ? '#ffffff' : '#0e1710',
            border: '1px solid rgba(90, 135, 56, 0.3)',
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
                background: '#5a8738',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                fontWeight: 900,
              }}
            >
              {currentUser.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                  {currentUser.fullName}
                </h1>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: '100px',
                    background: 'rgba(90, 135, 56, 0.15)',
                    border: '1px solid rgba(90, 135, 56, 0.3)',
                    color: '#5a8738',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  {isCompany ? 'Compte Ferme / Entreprise' : 'Compte Éleveur'}
                </span>
              </div>

              {currentUser.companyName && (
                <div style={{ fontSize: '0.85rem', color: '#5a8738', fontWeight: 600, marginTop: '2px' }}>
                  {currentUser.companyName}
                </div>
              )}

              <div style={{ fontSize: '0.8rem', color: T.light ? '#6b7280' : '#9ca3af', marginTop: '4px' }}>
                📞 {currentUser.phone} • Membre actif AVS Congo • Pointe-Noire
              </div>
            </div>
          </div>

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
              background: '#5a8738',
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
            <Package size={40} color="#5a8738" style={{ margin: '0 auto 1rem', opacity: 0.7 }} />
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
                background: '#5a8738',
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
                    border: `1px solid ${isPaid ? 'rgba(90, 135, 56, 0.4)' : 'rgba(255,255,255,0.08)'}`,
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
                        <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#5a8738' }}>
                          {order.orderNumber}
                        </span>
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: '100px',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            background: isPaid ? 'rgba(90, 135, 56, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: isPaid ? '#5a8738' : '#f59e0b',
                            border: `1px solid ${isPaid ? 'rgba(90, 135, 56, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
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
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#5a8738' }}>
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
                          {it.name} <strong style={{ color: '#5a8738' }}>x{it.quantity}</strong>
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
                        background: 'rgba(90, 135, 56, 0.08)',
                        fontSize: '0.75rem',
                        color: T.light ? '#4b5563' : '#9ca3af',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <ShieldCheck size={14} color="#5a8738" />
                      <span>Réf. transaction KKiaPay : <code>{order.transactionId}</code></span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
