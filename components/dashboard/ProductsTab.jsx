// components/dashboard/ProductsTab.jsx
'use client'

import { useState, useEffect } from 'react'
import {
  Plus, Search, Edit2, Trash2, Check, X, AlertTriangle,
  Package, Tag, DollarSign, Image as ImageIcon, Sparkles
} from 'lucide-react'

const CATEGORIES = [
  'Poussins & Volailles',
  'Provenderie & Nutrition',
  'Santé Animale & Vétérinaire',
  'Hygiène & Biosécurité',
  'Matériel & Équipements d’Élevage',
  'Autre',
]

export default function ProductsTab({ T, CARD }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: '',
    category: 'Provenderie & Nutrition',
    price: '',
    promoPrice: '',
    stock: '100',
    unit: 'sac 50kg',
    image: '',
    badge: '',
    description: '',
  })

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams()
      if (search) query.set('search', search)
      if (categoryFilter) query.set('category', categoryFilter)
      const res = await fetch(`/api/products?${query.toString()}`)
      const data = await res.json()
      if (data.products) setProducts(data.products)
    } catch (err) {
      console.error('Erreur chargement produits:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const t = setTimeout(fetchProducts, 250)
    return () => clearTimeout(t)
  }, [search, categoryFilter])

  const openCreateModal = () => {
    setEditingProduct(null)
    setForm({
      title: '',
      category: 'Provenderie & Nutrition',
      price: '',
      promoPrice: '',
      stock: '100',
      unit: 'sac 50kg',
      image: '/images/products/aliment-finition.jpg',
      badge: 'Nouveau',
      description: '',
    })
    setIsModalOpen(true)
  }

  const openEditModal = (p) => {
    setEditingProduct(p)
    setForm({
      title: p.title,
      category: p.category || 'Provenderie & Nutrition',
      price: p.price.toString(),
      promoPrice: p.promoPrice ? p.promoPrice.toString() : '',
      stock: p.stock.toString(),
      unit: p.unit || 'unité',
      image: p.image || '',
      badge: p.badge || '',
      description: p.description || '',
    })
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title || !form.price || !form.image) {
      alert('Veuillez remplir au moins le titre, le prix et l’URL de l’image.')
      return
    }

    setSaving(true)
    try {
      const url = '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'
      const payload = {
        ...(editingProduct && { id: editingProduct.id }),
        ...form,
        price: parseFloat(form.price),
        promoPrice: form.promoPrice ? parseFloat(form.promoPrice) : null,
        stock: parseInt(form.stock) || 0,
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setIsModalOpen(false)
        fetchProducts()
      } else {
        const err = await res.json()
        alert(err.error || 'Erreur lors de l’enregistrement')
      }
    } catch (err) {
      alert('Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer définitivement ce produit du catalogue ?')) return
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const toggleStock = async (p) => {
    try {
      const updatedStock = !p.inStock
      setProducts(products.map(item => item.id === p.id ? { ...item, inStock: updatedStock } : item))
      await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, inStock: updatedStock, stock: updatedStock ? (p.stock || 50) : 0 }),
      })
    } catch (err) {
      fetchProducts()
    }
  }

  return (
    <div>
      {/* Barre d'actions supérieure */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 260 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '.6rem .9rem' }}>
            <Search size={16} color={T.textMuted} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit AVS (Cobb 500, Provende, Virucide...)"
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: T.textMain, fontSize: '.84rem' }}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '.6rem .9rem', color: T.textMain, fontSize: '.84rem', outline: 'none' }}
          >
            <option value="">Toutes les catégories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button
          onClick={openCreateModal}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#b47027', color: '#fff', border: 'none', borderRadius: 12,
            padding: '.65rem 1.3rem', fontFamily: "'Poppins', sans-serif", fontWeight: 700,
            fontSize: '.85rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(180, 112, 39, 0.35)',
          }}
        >
          <Plus size={18} /> Ajouter un produit
        </button>
      </div>

      {/* Liste / Grille des produits */}
      {loading && products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: T.textMuted }}>Chargement du catalogue agropastoral...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: T.card, border: `1px solid ${T.border}`, borderRadius: 16 }}>
          <Package size={40} color={T.textMuted} style={{ marginBottom: 12 }} />
          <div style={{ fontSize: '1rem', fontWeight: 700, color: T.textMain, marginBottom: 4 }}>Aucun produit trouvé</div>
          <p style={{ fontSize: '.82rem', color: T.textSub, marginBottom: 16 }}>Cliquez sur "Ajouter un produit" pour enrichir le catalogue AVS.</p>
          <button onClick={openCreateModal} style={{ background: '#b47027', color: '#fff', border: 'none', borderRadius: 10, padding: '.5rem 1.2rem', fontWeight: 700, cursor: 'pointer' }}>
            Créer un produit
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                ...CARD,
                borderRadius: 16,
                padding: '1.2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                transition: 'transform .15s, box-shadow .15s',
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
                  <img
                    src={p.image || '/images/products/poussins-cobb500.jpg'}
                    alt={p.title}
                    style={{ width: 68, height: 68, borderRadius: 12, objectFit: 'cover', background: T.border, flexShrink: 0 }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '.68rem', fontWeight: 700, color: '#b47027', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 2 }}>
                      {p.category}
                    </div>
                    <h4 style={{ fontSize: '.92rem', fontWeight: 800, color: T.textMain, lineHeight: 1.3, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.title}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: 900, color: T.textMain }}>
                        {p.price?.toLocaleString('fr-FR')} FCFA
                      </span>
                      {p.unit && <span style={{ fontSize: '.72rem', color: T.textMuted }}>/ {p.unit}</span>}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '.78rem', color: T.textSub, lineHeight: 1.5, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {p.description}
                </p>
              </div>

              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => toggleStock(p)}
                  style={{
                    background: p.inStock ? 'rgba(76, 175, 80, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                    color: p.inStock ? '#2e7d32' : '#d32f2f',
                    border: `1px solid ${p.inStock ? 'rgba(76, 175, 80, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    borderRadius: 100,
                    padding: '3px 10px',
                    fontSize: '.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {p.inStock ? `● En Stock (${p.stock})` : '✕ Épuisé'}
                </button>

                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => openEditModal(p)}
                    title="Modifier"
                    style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 8, padding: '6px 10px', color: T.textMain, cursor: 'pointer' }}
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    title="Supprimer"
                    style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 8, padding: '6px 10px', color: '#d32f2f', cursor: 'pointer' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL CRÉATION / MODIFICATION */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, maxWidth: 560, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.8rem', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: T.textMain, fontFamily: "'Poppins', sans-serif" }}>
                {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: T.textMuted, cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: T.textSub, marginBottom: 4, textTransform: 'uppercase' }}>Titre du produit *</label>
                <input
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: Poussins Cobb 500 ou Aliment Démarrage 21%"
                  style={{ width: '100%', padding: '.65rem .85rem', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, outline: 'none', fontSize: '.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: T.textSub, marginBottom: 4, textTransform: 'uppercase' }}>Catégorie</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    style={{ width: '100%', padding: '.65rem .85rem', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, outline: 'none', fontSize: '.85rem' }}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: T.textSub, marginBottom: 4, textTransform: 'uppercase' }}>Unité de vente</label>
                  <input
                    value={form.unit}
                    onChange={e => setForm({ ...form, unit: e.target.value })}
                    placeholder="sac 50kg, carton de 100, unité, flacon 1L"
                    style={{ width: '100%', padding: '.65rem .85rem', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, outline: 'none', fontSize: '.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: T.textSub, marginBottom: 4, textTransform: 'uppercase' }}>Prix (FCFA) *</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="19800"
                    style={{ width: '100%', padding: '.65rem .85rem', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, outline: 'none', fontSize: '.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: T.textSub, marginBottom: 4, textTransform: 'uppercase' }}>Stock disponible</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    placeholder="100"
                    style={{ width: '100%', padding: '.65rem .85rem', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, outline: 'none', fontSize: '.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: T.textSub, marginBottom: 4, textTransform: 'uppercase' }}>URL de l'image *</label>
                <input
                  required
                  value={form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  style={{ width: '100%', padding: '.65rem .85rem', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, outline: 'none', fontSize: '.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: T.textSub, marginBottom: 4, textTransform: 'uppercase' }}>Badge / Étiquette</label>
                <input
                  value={form.badge}
                  onChange={e => setForm({ ...form, badge: e.target.value })}
                  placeholder="Ex: Populaire, Arrivage Hebdo, Cobb 500"
                  style={{ width: '100%', padding: '.65rem .85rem', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, outline: 'none', fontSize: '.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: T.textSub, marginBottom: 4, textTransform: 'uppercase' }}>Description complète</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Spécifications zootechniques, taux protéique, garantie vaccinale..."
                  style={{ width: '100%', padding: '.65rem .85rem', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, outline: 'none', fontSize: '.85rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 10, padding: '.6rem 1.2rem', color: T.textMain, cursor: 'pointer' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ background: '#b47027', color: '#fff', border: 'none', borderRadius: 10, padding: '.6rem 1.4rem', fontWeight: 700, cursor: saving ? 'default' : 'pointer' }}
                >
                  {saving ? 'Enregistrement...' : editingProduct ? 'Mettre à jour' : 'Créer le produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
