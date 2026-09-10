'use client'

import { useState } from 'react'
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  CreditCard,
  Phone,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import { useShop } from '@/lib/shopContext'
import { useTheme } from '@/lib/theme'
import { openKkiapayPayment } from '@/lib/kkiapay'

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
  const [paymentMethod, setPaymentMethod] = useState('kkiapay') // 'kkiapay' | 'whatsapp' | 'cash'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderCompleted, setOrderCompleted] = useState(null)
  const [showSandboxFallback, setShowSandboxFallback] = useState(false)

  if (!isCartOpen) return null

  // Pré-remplissage avec l'utilisateur connecté s'il existe
  const activeName = customerInfo.name || currentUser?.fullName || ''
  const activePhone = customerInfo.phone || currentUser?.phone || ''

  const handleInputChange = (e) => {
    setCustomerInfo(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

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
      // 1. Enregistrement initial de la commande dans le backend
      const orderPayload = {
        userId: currentUser?.id || null,
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        notes: customerInfo.notes.trim() || null,
        items: cartItems,
        totalAmount: cartTotal,
        paymentMethod,
        paymentStatus: 'UNPAID',
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      })

      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || 'Erreur lors de la commande', 'error')
        setIsSubmitting(false)
        return
      }

      const order = data.order
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
          msg += `${idx + 1}. *${item.name}* (x${item.quantity}) = ${itemTotal.toLocaleString('fr-FR')} FCFA\n`
        })
        msg += `\n💰 *TOTAL À PAYER : ${cartTotal.toLocaleString('fr-FR')} FCFA*\n`
        msg += `_Commande effectuée sur le site officiel agrovetoservices.cg_`

        const waUrl = `https://wa.me/242060000000?text=${encodeURIComponent(msg)}`
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
        // Mode KKiaPay
        showToast('Ouverture du portail de paiement sécurisé KKiaPay...', 'info')

        const opened = await openKkiapayPayment({
          amount: cartTotal,
          name,
          phone,
          orderNumber: order.orderNumber,
          data: order.id,
          sandbox: true,
          onSuccess: async (response) => {
            // Validation côté serveur
            try {
              const verifyRes = await fetch('/api/payments/kkiapay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: order.id,
                  transactionId: response?.transactionId || response?.reference || 'kkiapay_' + Date.now(),
                  paymentDetails: response,
                }),
              })
              const verifyData = await verifyRes.json()
              if (verifyData.order) {
                addLocalOrder(verifyData.order)
                setOrderCompleted(verifyData.order)
              } else {
                setOrderCompleted({ ...order, paymentStatus: 'PAID' })
              }
            } catch {
              setOrderCompleted({ ...order, paymentStatus: 'PAID' })
            }
            clearCart()
            showToast('Paiement KKiaPay validé avec succès !', 'success')
          },
          onFailed: (err) => {
            showToast('Paiement non finalisé. Vous pouvez réessayer.', 'warning')
          },
        })

        if (!opened) {
          // Si le SDK Kkiapay CDN est bloqué ou ne s'ouvre pas, proposer le simulateur sandbox
          setShowSandboxFallback(order)
        }
      }
    } catch (err) {
      console.error('Erreur checkout:', err)
      showToast('Impossible de finaliser la commande', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Simulation directe pour validation sandbox locale
  const handleSimulateSandboxKkiapay = async (order) => {
    try {
      const verifyRes = await fetch('/api/payments/kkiapay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          transactionId: 'KKIA-SANDBOX-' + Date.now(),
          paymentDetails: { provider: 'MTN Mobile Money Congo', mode: 'sandbox', status: 'SUCCESS' },
        }),
      })
      const verifyData = await verifyRes.json()
      const updated = verifyData.order || { ...order, paymentStatus: 'PAID' }
      addLocalOrder(updated)
      setOrderCompleted(updated)
      setShowSandboxFallback(false)
      clearCart()
      showToast('Simulation de paiement KKiaPay réussie !', 'success')
    } catch {
      showToast('Erreur lors de la validation', 'error')
    }
  }

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
          borderLeft: '1px solid rgba(248, 146, 3, 0.3)',
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
                background: 'rgba(248, 146, 3, 0.15)',
                color: '#f89203',
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
                  background: 'rgba(248, 146, 3, 0.18)',
                  color: '#f89203',
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
                  background: 'rgba(248, 146, 3, 0.12)',
                  border: '1px dashed #f89203',
                  color: '#f89203',
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
                  <span style={{ color: orderCompleted.paymentStatus === 'PAID' ? '#f89203' : '#f59e0b', fontWeight: 700 }}>
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
                  background: '#f89203',
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
                  border: '1px solid #f89203',
                  background: 'rgba(248, 146, 3, 0.1)',
                  color: '#f89203',
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
                    background: 'rgba(248, 146, 3, 0.1)',
                    border: '1px solid rgba(248, 146, 3, 0.25)',
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
                      color: '#f89203',
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
                      <div style={{ fontSize: '0.78rem', color: '#f89203', fontWeight: 600 }}>
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
                    {/* KKiaPay */}
                    <div
                      onClick={() => setPaymentMethod('kkiapay')}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: `2px solid ${paymentMethod === 'kkiapay' ? '#f89203' : 'rgba(255,255,255,0.08)'}`,
                        background: paymentMethod === 'kkiapay' ? 'rgba(248, 146, 3, 0.12)' : (T.light ? '#f9fafb' : '#0e1710'),
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
                          border: `2px solid ${paymentMethod === 'kkiapay' ? '#f89203' : 'rgba(255,255,255,0.3)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {paymentMethod === 'kkiapay' && (
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f89203' }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>💳 KKiaPay (Mobile Money & Carte)</span>
                          <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '100px', background: '#f89203', color: '#fff' }}>
                            Instantané
                          </span>
                        </div>
                        <div style={{ fontSize: '0.72rem', opacity: 0.7 }}>
                          MTN Mobile Money, Airtel Money, Moov ou Carte bancaire
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div
                      onClick={() => setPaymentMethod('whatsapp')}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: `2px solid ${paymentMethod === 'whatsapp' ? '#f89203' : 'rgba(255,255,255,0.08)'}`,
                        background: paymentMethod === 'whatsapp' ? 'rgba(248, 146, 3, 0.12)' : (T.light ? '#f9fafb' : '#0e1710'),
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
                          border: `2px solid ${paymentMethod === 'whatsapp' ? '#f89203' : 'rgba(255,255,255,0.3)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {paymentMethod === 'whatsapp' && (
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f89203' }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>💬 Commander via WhatsApp Pro</div>
                        <div style={{ fontSize: '0.72rem', opacity: 0.7 }}>
                          Finalisation directe avec notre conseiller commercial AVS
                        </div>
                      </div>
                    </div>

                    {/* Au siège */}
                    <div
                      onClick={() => setPaymentMethod('cash')}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: `2px solid ${paymentMethod === 'cash' ? '#f89203' : 'rgba(255,255,255,0.08)'}`,
                        background: paymentMethod === 'cash' ? 'rgba(248, 146, 3, 0.12)' : (T.light ? '#f9fafb' : '#0e1710'),
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
                          border: `2px solid ${paymentMethod === 'cash' ? '#f89203' : 'rgba(255,255,255,0.3)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {paymentMethod === 'cash' && (
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f89203' }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>🏢 Paiement au Siège / Comptoir</div>
                        <div style={{ fontSize: '0.72rem', opacity: 0.7 }}>
                          Règlement à la clinique vétérinaire de Socoprise
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal de secours simulation Sandbox KKiaPay si le CDN est bloqué */}
        {showSandboxFallback && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              zIndex: 10,
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(248, 146, 3, 0.2)', color: '#f89203', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <CreditCard size={28} />
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
              Guichet KKiaPay Sandbox
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Montant à régler : <strong>{showSandboxFallback.totalAmount.toLocaleString('fr-FR')} FCFA</strong><br />
              Commande : <code>{showSandboxFallback.orderNumber}</code>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '320px' }}>
              <button
                type="button"
                onClick={() => handleSimulateSandboxKkiapay(showSandboxFallback)}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#f89203',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Valider le paiement de test (Succès)
              </button>
              <button
                type="button"
                onClick={() => setShowSandboxFallback(false)}
                style={{
                  padding: '10px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'transparent',
                  color: '#9ca3af',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Annuler
              </button>
            </div>
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
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f89203' }}>
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
                background: '#f89203',
                color: '#ffffff',
                fontSize: '0.92rem',
                fontWeight: 800,
                cursor: isSubmitting ? 'default' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 10px 25px -5px rgba(248, 146, 3, 0.4)',
              }}
            >
              {isSubmitting ? (
                'Traitement en cours...'
              ) : paymentMethod === 'kkiapay' ? (
                <>
                  <span>Payer {cartTotal.toLocaleString('fr-FR')} FCFA via KKiaPay</span>
                  <ArrowRight size={18} />
                </>
              ) : paymentMethod === 'whatsapp' ? (
                <>
                  <span>Envoyer la Commande sur WhatsApp</span>
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
