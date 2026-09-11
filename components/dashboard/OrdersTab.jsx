// components/dashboard/OrdersTab.jsx
'use client'

import { useState, useEffect } from 'react'
import {
  Search, ShoppingCart, Eye, Trash2, CheckCircle2,
  Clock, Truck, AlertCircle, X, Phone, MapPin, DollarSign
} from 'lucide-react'

const STATUS_LABELS = {
  PENDING: { label: 'En attente', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
  CONFIRMED: { label: 'Confirmée', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
  PROCESSING: { label: 'En préparation', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)' },
  SHIPPED: { label: 'Expédiée / En route', color: '#f89203', bg: 'rgba(248, 146, 3, 0.15)' },
  DELIVERED: { label: 'Livrée', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
  CANCELLED: { label: 'Annulée', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' },
}

const PAYMENT_LABELS = {
  PAID: { label: 'Payé', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
  UNPAID: { label: 'Impayé', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' },
  PENDING: { label: 'En cours', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
}

export default function OrdersTab({ T, CARD }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams()
      if (statusFilter) query.set('status', statusFilter)
      const res = await fetch(`/api/orders?${query.toString()}`)
      const data = await res.json()
      if (data.orders) setOrders(data.orders)
    } catch (err) {
      console.error('Erreur chargement commandes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const updateStatus = async (orderId, newStatus) => {
    try {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      })
    } catch (err) {
      fetchOrders()
    }
  }

  const updatePayment = async (orderId, newPayment) => {
    try {
      setOrders(orders.map(o => o.id === orderId ? { ...o, paymentStatus: newPayment } : o))
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, paymentStatus: newPayment }),
      })
    } catch (err) {
      fetchOrders()
    }
  }

  const deleteOrder = async (orderId) => {
    if (!confirm('Supprimer définitivement cette commande ?')) return
    try {
      const res = await fetch(`/api/orders?id=${orderId}`, { method: 'DELETE' })
      if (res.ok) {
        setOrders(orders.filter(o => o.id !== orderId))
        if (selectedOrder?.id === orderId) setSelectedOrder(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filteredOrders = orders.filter(o => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      o.orderNumber?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.customerPhone?.toLowerCase().includes(q)
    )
  })

  return (
    <div>
      {/* Barre de filtres */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240, display: 'flex', alignItems: 'center', gap: 8, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '.6rem .9rem' }}>
          <Search size={16} color={T.textMuted} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par n° de commande, client ou téléphone..."
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: T.textMain, fontSize: '.84rem' }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '.6rem .9rem', color: T.textMain, fontSize: '.84rem', outline: 'none' }}
        >
          <option value="">Tous les statuts de livraison</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* Tableau des commandes */}
      {loading && orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: T.textMuted }}>Chargement des commandes...</div>
      ) : filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: T.card, border: `1px solid ${T.border}`, borderRadius: 16 }}>
          <ShoppingCart size={40} color={T.textMuted} style={{ marginBottom: 12 }} />
          <div style={{ fontSize: '1rem', fontWeight: 700, color: T.textMain, marginBottom: 4 }}>Aucune commande enregistrée</div>
          <p style={{ fontSize: '.82rem', color: T.textSub }}>Les commandes passées sur la boutique apparaîtront ici automatiquement.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredOrders.map((order) => {
            const st = STATUS_LABELS[order.status] || STATUS_LABELS.PENDING
            const pay = PAYMENT_LABELS[order.paymentStatus] || PAYMENT_LABELS.UNPAID
            const dateStr = new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

            return (
              <div
                key={order.id}
                style={{
                  ...CARD,
                  borderRadius: 14,
                  padding: '1rem 1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 14,
                  flexWrap: 'wrap',
                }}
              >
                {/* Infos commande */}
                <div style={{ minWidth: 200, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.9rem', fontWeight: 800, color: T.textMain }}>
                      {order.orderNumber}
                    </span>
                    <span style={{ fontSize: '.7rem', color: T.textMuted }}>
                      {dateStr}
                    </span>
                  </div>
                  <div style={{ fontSize: '.82rem', color: T.textSub }}>
                    <span style={{ fontWeight: 700, color: T.textMain }}>{order.customerName}</span> · {order.customerPhone}
                  </div>
                </div>

                {/* Montant */}
                <div style={{ minWidth: 120 }}>
                  <div style={{ fontSize: '.68rem', color: T.textMuted, textTransform: 'uppercase' }}>Total</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#f89203', fontFamily: "'Poppins', sans-serif" }}>
                    {order.totalAmount?.toLocaleString('fr-FR')} FCFA
                  </div>
                </div>

                {/* Statut Paiement */}
                <div>
                  <select
                    value={order.paymentStatus}
                    onChange={(e) => updatePayment(order.id, e.target.value)}
                    style={{
                      background: pay.bg,
                      color: pay.color,
                      border: `1px solid ${pay.color}44`,
                      borderRadius: 8,
                      padding: '4px 8px',
                      fontSize: '.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    <option value="UNPAID">Impayé</option>
                    <option value="PAID">Payé</option>
                  </select>
                </div>

                {/* Statut Commande */}
                <div>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    style={{
                      background: st.bg,
                      color: st.color,
                      border: `1px solid ${st.color}44`,
                      borderRadius: 8,
                      padding: '4px 8px',
                      fontSize: '.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    {Object.entries(STATUS_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    title="Voir les détails"
                    style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 8, padding: '6px 10px', color: T.textMain, cursor: 'pointer' }}
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => deleteOrder(order.id)}
                    title="Supprimer"
                    style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 8, padding: '6px 10px', color: '#d32f2f', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* MODAL DÉTAILS COMMANDE */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, maxWidth: 540, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.8rem', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: `1px solid ${T.border}`, paddingBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: T.textMain }}>
                  Commande {selectedOrder.orderNumber}
                </h3>
                <div style={{ fontSize: '.72rem', color: T.textMuted }}>
                  Passée le {new Date(selectedOrder.createdAt).toLocaleString('fr-FR')}
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', color: T.textMuted, cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {/* Infos client */}
            <div style={{ background: T.bg, padding: '1rem', borderRadius: 12, marginBottom: 16 }}>
              <div style={{ fontSize: '.72rem', fontWeight: 700, color: '#f89203', textTransform: 'uppercase', marginBottom: 6 }}>Coordonnées du client</div>
              <div style={{ fontSize: '.88rem', fontWeight: 800, color: T.textMain, marginBottom: 2 }}>{selectedOrder.customerName}</div>
              <div style={{ fontSize: '.8rem', color: T.textSub, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Phone size={12} /> {selectedOrder.customerPhone}
              </div>
              {selectedOrder.customerAddress && (
                <div style={{ fontSize: '.8rem', color: T.textSub, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={12} /> {selectedOrder.customerAddress}
                </div>
              )}
            </div>

            {/* Articles du panier */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '.72rem', fontWeight: 700, color: T.textSub, textTransform: 'uppercase', marginBottom: 8 }}>Articles commandés</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(Array.isArray(selectedOrder.items) ? selectedOrder.items : []).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: T.bg, padding: '.65rem .85rem', borderRadius: 10 }}>
                    <div>
                      <div style={{ fontSize: '.84rem', fontWeight: 700, color: T.textMain }}>{item.title || item.name}</div>
                      <div style={{ fontSize: '.72rem', color: T.textMuted }}>Quantité : {item.quantity} × {item.unitPrice || item.price} FCFA</div>
                    </div>
                    <div style={{ fontSize: '.9rem', fontWeight: 800, color: T.textMain }}>
                      {((item.quantity || 1) * (item.unitPrice || item.price || 0)).toLocaleString('fr-FR')} FCFA
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: '.9rem', fontWeight: 800, color: T.textMain }}>Montant Total</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f89203' }}>
                {selectedOrder.totalAmount?.toLocaleString('fr-FR')} FCFA
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{ background: '#f89203', color: '#fff', border: 'none', borderRadius: 10, padding: '.6rem 1.4rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
