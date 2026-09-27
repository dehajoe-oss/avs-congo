'use client'

import { useState, useEffect } from 'react'
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  CreditCard,
  Smartphone,
  Phone,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { useShop } from '@/lib/shopContext'
import { useTheme } from '@/lib/theme'
import api from '@/lib/api-client'

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
    currentUser,
    openAuthModal,
    addLocalOrder,
    showToast,
  } = useShop()

  const T = useTheme()

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('whatsapp') // 'whatsapp' | 'cash' | 'pawapay'
  const [momoOperator, setMomoOperator] = useState('MTN_MOMO_COG') // 'MTN_MOMO_COG' | 'AIRTEL_COG'
  const [momoPhoneOverride, setMomoPhoneOverride] = useState('')
  const [pawaPaySession, setPawaPaySession] = useState(null)
  const [pawaPayStatus, setPawaPayStatus] = useState(null) // 'ACCEPTED' | 'COMPLETED' | 'FAILED'
  const [pawaPayError, setPawaPayError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderCompleted, setOrderCompleted] = useState(null)

  // Pré-remplissage avec l'utilisateur connecté s'il existe
  const activeName = customerInfo.name || currentUser?.fullName || ''
  const activePhone = customerInfo.phone || currentUser?.phone || ''

  const handleInputChange = (e) => {
    setCustomerInfo(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Polling automatique de la validation pawaPay
  useEffect(() => {
    if (!pawaPaySession?.depositId || pawaPayStatus === 'COMPLETED' || pawaPayStatus === 'FAILED') {
      return
    }

    const interval = setInterval(async () => {
      try {
        const res = await api.payments.getPawaPayStatus(pawaPaySession.depositId)
        if (res?.status === 'COMPLETED') {
          setPawaPayStatus('COMPLETED')
          const updated = {
            ...pawaPaySession.order,
            paymentStatus: 'PAID',
            paymentMethod: pawaPaySession.operator === 'MTN_MOMO_COG' ? 'MTN_MOMO' : 'AIRTEL_MONEY',
            paymentRef: pawaPaySession.depositId,
          }
          addLocalOrder(updated)
          setOrderCompleted(updated)
          clearCart()
          showToast('Paiement Mobile Money validé avec succès !', 'success')
        } else if (res?.status === 'FAILED') {
          setPawaPayStatus('FAILED')
          setPawaPayError(res?.failureReason?.failureMessage || 'Paiement non approuvé ou rejeté sur votre téléphone.')
          showToast('Paiement Mobile Money non abouti', 'error')
        }
      } catch (err) {
        console.warn('[pawaPay Polling Error]', err)
      }
    }, 2500)

    return () => clearInterval(interval)
  }, [pawaPaySession, pawaPayStatus])

  const handleCheckout = async (e) => {
    e.preventDefault()

    if (cartItems.length === 0) return

    const name = activeName.trim()
    const phone = activePhone.trim()
    const address = customerInfo.address.trim()

    if (!name || !phone || !address) {
      showToast('Veuillez renseigner votre nom, téléphone et adresse de livraison', 'warning')
      return
    }

    setIsSubmitting(true)

    try {
      // 1. Enregistrement initial de la commande dans le backend Node.js
      const paymentLabel = paymentMethod === 'pawapay'
        ? (momoOperator === 'MTN_MOMO_COG' ? 'MTN_MOMO' : 'AIRTEL_MONEY')
        : paymentMethod === 'whatsapp' ? 'WHATSAPP' : 'CASH'

      const orderPayload = {
        userId: currentUser?.id || null,
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        notes: customerInfo.notes.trim() || null,
        items: cartItems.map(item => ({
          productId: item.id,
          id: item.id,
          slug: item.slug,
          name: item.name || item.title,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: cartTotal,
        paymentMethod: paymentLabel,
        paymentStatus: 'UNPAID',
      }

      let order
      try {
        const res = await api.orders.create(orderPayload)
        order = res?.data?.order || res?.data || res?.order || res
      } catch (backendErr) {
        console.warn('Tentative fallback local /api/orders...', backendErr.message)
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Erreur lors de la commande')
        order = data.order
      }

      if (!order) {
        showToast('Erreur lors de la validation de la commande', 'error')
        setIsSubmitting(false)
        return
      }

      addLocalOrder(order)

      // 2. Traitement selon le mode de paiement
      if (paymentMethod === 'whatsapp') {
        // Commande transmise sur WhatsApp
        let msg = `🛒 *NOUVELLE COMMANDE - AGRO VÉTO SERVICES CONGO*\n`
        msg += `Réf: *${order.orderNumber}*\n\n`
        msg += `👤 *Client :* ${name}\n`
        msg += `📞 *Téléphone :* ${phone}\n`
        msg += `📍 *Adresse de livraison :* ${address}\n`
        if (customerInfo.notes) msg += `📝 *Notes :* ${customerInfo.notes}\n`
        msg += `\n📦 *ARTICLES COMMANDÉS :*\n`
        cartItems.forEach((item, idx) => {
          const itemTotal = item.price * item.quantity
          msg += `${idx + 1}. *${item.name || item.title}* (x${item.quantity}) = ${itemTotal.toLocaleString('fr-FR')} FCFA\n`
        })
        msg += `\n💰 *TOTAL À PAYER : ${cartTotal.toLocaleString('fr-FR')} FCFA*\n`
        msg += `_Commande effectuée sur le site officiel agrovetoservices.cg_`

        const waUrl = `https://wa.me/242056337050?text=${encodeURIComponent(msg)}`
        window.open(waUrl, '_blank')

        setOrderCompleted(order)
        clearCart()
        showToast('Commande transmise au service commercial WhatsApp !', 'success')
      } else if (paymentMethod === 'cash') {
        // Règlement au siège
        setOrderCompleted(order)
        clearCart()
        showToast('Commande validée ! Règlement prévu au siège Socoprise.', 'success')
      } else {
        // Mode pawaPay Mobile Money Congo (MTN MoMo ou Airtel Money)
        const targetPhone = momoPhoneOverride.trim() || phone
        showToast('Envoi de l’invite de paiement sur votre téléphone...', 'info')

        const initRes = await api.payments.initiatePawaPay({
          orderId: order.id,
          phone: targetPhone,
          provider: momoOperator,
        })

        if (!initRes?.success) {
          showToast(initRes?.error || 'Échec lors de l’envoi de la demande Mobile Money', 'error')
          setIsSubmitting(false)
          return
        }

        setPawaPayStatus('ACCEPTED')
        setPawaPayError(null)
        setPawaPaySession({
          order,
          depositId: initRes.depositId,
          operator: momoOperator,
          phone: initRes.phone || targetPhone,
          isMock: initRes.isMock,
        })
      }
    } catch (err) {
      console.error('Erreur checkout:', err)
      showToast('Impossible de finaliser la commande', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Action pour tester manuellement en mode Sandbox
  const handleSimulatePawaPayAction = async (action) => {
    if (!pawaPaySession?.depositId) return
    try {
      if (action === 'fail') {
        await api.payments.simulatePawaPay({
          depositId: pawaPaySession.depositId,
          action: 'fail',
        })
        setPawaPayStatus('FAILED')
        setPawaPayError('Paiement rejeté (simulation d’échec Sandbox)')
        showToast('Simulation de rejet effectuée', 'info')
      } else {
        await api.payments.simulatePawaPay({
          depositId: pawaPaySession.depositId,
          action: 'complete',
        })
        showToast('Validation instantanée simulée !', 'success')
      }
    } catch (err) {
      console.error('Erreur simulation pawaPay:', err)
      showToast('Erreur simulation', 'error')
    }
  }

  if (!isCartOpen) return null

  return (
    <div
      onClick={closeCart}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          height: '100%',
          background: T.light ? '#ffffff' : '#0a120c',
          borderLeft: '1px solid rgba(180, 112, 39, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-20px 0 50px rgba(0,0,0,0.8)',
          color: T.light ? '#111827' : '#f3f4f6',
          fontFamily: "'Poppins', sans-serif",
          position: 'relative',
        }}
      >
        {/* En-tête */}
        <div
          style={{
            padding: '1.4rem 1.6rem',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: T.light ? '#f9fafb' : '#0e1710',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'rgba(180, 112, 39, 0.15)',
                color: '#b47027',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingCart size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Votre Chariot AVS</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: T.light ? '#6b7280' : '#9ca3af' }}>
                {cartCount} article{cartCount > 1 ? 's' : ''} sélectionné{cartCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <button
            onClick={closeCart}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'inherit',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Corps du panier */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.4rem 1.6rem' }}>
          {orderCompleted ? (
            /* Écran de confirmation de commande */
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: 'rgba(180, 112, 39, 0.18)',
                  color: '#b47027',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.2rem',
                }}
              >
                <CheckCircle2 size={40} />
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
                Commande Confirmée !
              </h3>
              <p style={{ fontSize: '0.85rem', color: T.light ? '#4b5563' : '#9ca3af', marginBottom: '1.5rem' }}>
                Merci pour votre confiance. Votre commande porte le numéro de suivi :
              </p>

              <div
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: 'rgba(180, 112, 39, 0.12)',
                  border: '1px dashed #b47027',
                  color: '#b47027',
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                  display: 'inline-block',
                  marginBottom: '1.5rem',
                }}
              >
                {orderCompleted.orderNumber}
              </div>

              <div
                style={{
                  textAlign: 'left',
                  background: T.light ? '#f9fafb' : '#0e1710',
                  padding: '1rem',
                  borderRadius: '16px',
                  fontSize: '0.82rem',
                  lineHeight: 1.6,
                  marginBottom: '1.8rem',
                }}
              >
                <div><strong>Client :</strong> {orderCompleted.customerName}</div>
                <div><strong>Contact :</strong> {orderCompleted.customerPhone}</div>
                <div><strong>Livraison :</strong> {orderCompleted.customerAddress}</div>
                <div><strong>Total :</strong> {orderCompleted.totalAmount.toLocaleString('fr-FR')} FCFA</div>
                <div>
                  <strong>Statut paiement :</strong>{' '}
                  <span style={{ color: orderCompleted.paymentStatus === 'PAID' ? '#b47027' : '#f59e0b', fontWeight: 700 }}>
                    {orderCompleted.paymentStatus === 'PAID' ? 'PAYÉ VIA KKIAPAY' : 'EN ATTENTE'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setOrderCompleted(null)
                  closeCart()
                }}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  borderRadius: '100px',
                  border: 'none',
                  background: '#b47027',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Continuer mes achats
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            /* Panier vide */
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                  color: T.light ? '#9ca3af' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
              >
                <ShoppingCart size={32} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.4rem' }}>
                Votre chariot est vide
              </h4>
              <p style={{ fontSize: '0.82rem', color: T.light ? '#6b7280' : '#9ca3af', marginBottom: '1.5rem' }}>
                Découvrez nos poussins Cobb 500, provenderies et kits de prophylaxie dans notre catalogue.
              </p>
              <button
                onClick={closeCart}
                style={{
                  padding: '10px 22px',
                  borderRadius: '100px',
                  border: '1px solid #b47027',
                  background: 'rgba(180, 112, 39, 0.1)',
                  color: '#b47027',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Parcourir les intrants
              </button>
            </div>
          ) : (
            /* Liste des articles + Formulaire de commande */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Alerte compte non connecté */}
              {!currentUser && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(180, 112, 39, 0.1)',
                    border: '1px solid rgba(180, 112, 39, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                  }}
                >
                  <span>Vous avez déjà un compte ?</span>
                  <button
                    type="button"
                    onClick={openAuthModal}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#b47027',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Se connecter
                  </button>
                </div>
              )}

              {/* Liste des articles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.6 }}>
                  Articles ({cartCount})
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '12px',
                      borderRadius: '14px',
                      background: T.light ? '#f9fafb' : '#0e1710',
                      border: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '2px' }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#b47027', fontWeight: 600 }}>
                        {item.price.toLocaleString('fr-FR')} FCFA <span style={{ opacity: 0.7 }}>/ unité</span>
                      </div>
                    </div>

                    {/* Contrôles de quantité */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.15)',
                          background: 'transparent',
                          color: 'inherit',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, minWidth: '24px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.15)',
                          background: 'transparent',
                          color: 'inherit',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '4px',
                        opacity: 0.7,
                      }}
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Formulaire de livraison */}
              <form onSubmit={handleCheckout} id="checkout-form" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.6 }}>
                  Coordonnées de livraison (Pointe-Noire)
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '3px' }}>
                    Nom du réceptionnaire ou Ferme *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={activeName}
                    onChange={handleInputChange}
                    placeholder="Ex: Jean BISSOUA"
                    required
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      background: T.light ? '#f9fafb' : '#080d09',
                      color: 'inherit',
                      fontSize: '0.82rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '3px' }}>
                    Téléphone WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={activePhone}
                    onChange={handleInputChange}
                    placeholder="06 123 45 67 ou +242 05 678 90 12"
                    required
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      background: T.light ? '#f9fafb' : '#080d09',
                      color: 'inherit',
                      fontSize: '0.82rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, marginBottom: '3px' }}>
                    Adresse de livraison / Localisation de la ferme *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    placeholder="Ex: Socoprise / Tié-Tié / Loandjili, Pointe-Noire"
                    required
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      background: T.light ? '#f9fafb' : '#080d09',
                      color: 'inherit',
                      fontSize: '0.82rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Modes de paiement */}
                <div style={{ marginTop: '6px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.6, marginBottom: '8px' }}>
                    Mode de Paiement
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* WhatsApp (Option principale active) */}
                    <div
                      onClick={() => setPaymentMethod('whatsapp')}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        border: `2px solid ${paymentMethod === 'whatsapp' ? '#25d366' : 'rgba(255,255,255,0.08)'}`,
                        background: paymentMethod === 'whatsapp' ? 'rgba(37, 211, 102, 0.1)' : (T.light ? '#f9fafb' : '#0e1710'),
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: `2px solid ${paymentMethod === 'whatsapp' ? '#25d366' : 'rgba(255,255,255,0.3)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {paymentMethod === 'whatsapp' && (
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#25d366' }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>💬 Commander via WhatsApp Pro</span>
                          <span style={{ fontSize: '0.65rem', padding: '2px 7px', borderRadius: '100px', background: '#25d366', color: '#050505', fontWeight: 800 }}>
                            +242 05 633 70 50
                          </span>
                        </div>
                        <div style={{ fontSize: '0.72rem', opacity: 0.75, marginTop: '2px' }}>
                          Confirmation rapide de disponibilité, conseils vétérinaires et livraison
                        </div>
                      </div>
                    </div>

                    {/* Au siège */}
                    <div
                      onClick={() => setPaymentMethod('cash')}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: `2px solid ${paymentMethod === 'cash' ? '#b47027' : 'rgba(255,255,255,0.08)'}`,
                        background: paymentMethod === 'cash' ? 'rgba(180, 112, 39, 0.12)' : (T.light ? '#f9fafb' : '#0e1710'),
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: `2px solid ${paymentMethod === 'cash' ? '#b47027' : 'rgba(255,255,255,0.3)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {paymentMethod === 'cash' && (
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#b47027' }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>🏢 Paiement au Siège / Comptoir</div>
                        <div style={{ fontSize: '0.72rem', opacity: 0.7 }}>
                          Règlement à la clinique vétérinaire de Socoprise (Pointe-Noire)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal interactif d'attente de validation pawaPay Mobile Money */}
        {pawaPaySession && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.88)',
              backdropFilter: 'blur(6px)',
              zIndex: 20,
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: pawaPayStatus === 'FAILED' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(180, 112, 39, 0.2)',
                color: pawaPayStatus === 'FAILED' ? '#EF4444' : '#b47027',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              {pawaPayStatus === 'FAILED' ? (
                <AlertCircle size={32} />
              ) : (
                <Smartphone size={32} className="animate-pulse" />
              )}
            </div>

            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.4rem', color: '#ffffff' }}>
              {pawaPayStatus === 'FAILED' ? 'Paiement non abouti' : 'Validation sur votre mobile...'}
            </h4>

            <div style={{ fontSize: '0.85rem', color: '#e5e7eb', marginBottom: '1rem', lineHeight: 1.5 }}>
              Montant : <strong style={{ color: '#b47027', fontSize: '1.05rem' }}>{pawaPaySession.order.totalAmount.toLocaleString('fr-FR')} FCFA</strong><br />
              Réseau : <strong>{pawaPaySession.operator === 'MTN_MOMO_COG' ? '🟡 MTN MoMo Congo' : '🔴 Airtel Money Congo'}</strong><br />
              Numéro : <code>{pawaPaySession.phone}</code>
            </div>

            {pawaPayStatus === 'FAILED' ? (
              <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.78rem', color: '#fca5a5', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                  {pawaPayError || 'Le paiement a été refusé ou a expiré.'}
                </div>
                <button
                  type="button"
                  onClick={() => setPawaPaySession(null)}
                  style={{
                    padding: '11px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#b47027',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Réessayer
                </button>
              </div>
            ) : (
              <div style={{ width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.78rem', color: '#9ca3af' }}>
                  <Loader2 size={16} className="animate-spin" />
                  <span>En attente de saisie de votre code PIN...</span>
                </div>

                {/* Panneau Sandbox de test */}
                <div
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px dashed rgba(180, 112, 39, 0.4)',
                    borderRadius: '10px',
                    padding: '12px',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#b47027', textTransform: 'uppercase' }}>
                      🧪 Simulateur Sandbox pawaPay
                    </span>
                    <span style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Auto-succès (4s)</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#d1d5db', marginBottom: '8px' }}>
                    Vous pouvez laisser le simulateur valider automatiquement ou tester manuellement :
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleSimulatePawaPayAction('complete')}
                      style={{
                        flex: 1,
                        padding: '7px 8px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#15803d',
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      ✓ Simuler Succès
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSimulatePawaPayAction('fail')}
                      style={{
                        flex: 1,
                        padding: '7px 8px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#b91c1c',
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      ✗ Simuler Refus
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPawaPaySession(null)}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'transparent',
                    color: '#9ca3af',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  Annuler la transaction
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pied du panier avec récapitulatif des montants & bouton d'action */}
        {cartItems.length > 0 && !orderCompleted && (
          <div
            style={{
              padding: '1.4rem 1.6rem',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              background: T.light ? '#f9fafb' : '#0e1710',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: T.light ? '#6b7280' : '#9ca3af', fontWeight: 600 }}>Total de la commande :</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#b47027' }}>
                {cartTotal.toLocaleString('fr-FR')} FCFA
              </span>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '14px 24px',
                borderRadius: '100px',
                border: 'none',
                background: paymentMethod === 'whatsapp' ? '#25d366' : '#b47027',
                color: paymentMethod === 'whatsapp' ? '#050505' : '#ffffff',
                fontSize: '0.92rem',
                fontWeight: 800,
                cursor: isSubmitting ? 'default' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: paymentMethod === 'whatsapp' ? '0 10px 25px -5px rgba(37, 211, 102, 0.4)' : '0 10px 25px -5px rgba(180, 112, 39, 0.4)',
              }}
            >
              {isSubmitting ? (
                'Traitement en cours...'
              ) : paymentMethod === 'whatsapp' ? (
                <>
                  <span>Envoyer la Commande sur WhatsApp (+242 05 633 70 50)</span>
                  <ArrowRight size={18} />
                </>
              ) : (
                <>
                  <span>Valider la Commande (Paiement au Siège)</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
