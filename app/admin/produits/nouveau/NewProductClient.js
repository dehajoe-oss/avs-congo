'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import api from '@/lib/api-client'
import AdminGuard from '@/components/admin/AdminGuard'
import ImageUploadButton from '@/components/admin/ImageUploadButton'
import { fLabel, fInput, fGrid2, fSubmit, fError, fPage, fCard, fBack } from '@/components/admin/adminFormStyles'

export default function NewProductClient() {
  const T = useTheme()
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    promoPrice: '',
    stock: 100,
    unit: 'sac 50kg',
    categoryId: '',
    image: '/images/products/aliment-demarrage.jpg',
    badge: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.products.getCategories()
      .then(res => {
        if (Array.isArray(res?.data)) setCategories(res.data)
      })
      .catch(() => {})
  }, [])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || form.price === '' || !form.image.trim()) {
      setError('Titre, prix et image sont obligatoires.')
      return
    }
    setLoading(true)
    try {
      const res = await api.products.create({
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        promoPrice: form.promoPrice === '' ? null : Number(form.promoPrice),
        stock: Number(form.stock) || 0,
        unit: form.unit.trim() || 'unité',
        categoryId: form.categoryId || null,
        image: form.image.trim(),
        badge: form.badge.trim() || null,
      })
      if (res?.data) router.push('/admin?tab=products')
      else setError(res?.message || 'Création impossible.')
    } catch (err) {
      setError(err.message || 'Erreur création produit.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminGuard>
      <div style={fPage(T)}>
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <Link href="/admin?tab=products" style={fBack(T)}>
            <ArrowLeft size={15} /> Retour au catalogue
          </Link>
          <div style={fCard(T)}>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.3rem' }}>Nouveau Produit</h1>
            <p style={{ fontSize: '0.82rem', color: T.textMuted, margin: '0 0 1.5rem' }}>
              Ajoutez un intrant au catalogue de la boutique AVS.
            </p>
            {error && <div style={fError}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={fLabel}>Titre du produit *</label>
                <input required type="text" value={form.title} onChange={set('title')} placeholder="Ex : Aliment Pondeuse Sac 50kg" style={fInput(T)} />
              </div>
              <div>
                <label style={fLabel}>Description</label>
                <textarea rows={3} value={form.description} onChange={set('description')} placeholder="Description détaillée..." style={{ ...fInput(T), resize: 'vertical' }} />
              </div>
              <div style={fGrid2}>
                <div>
                  <label style={fLabel}>Prix (FCFA) *</label>
                  <input required type="number" min="0" value={form.price} onChange={set('price')} placeholder="21500" style={fInput(T)} />
                </div>
                <div>
                  <label style={fLabel}>Prix promo (optionnel)</label>
                  <input type="number" min="0" value={form.promoPrice} onChange={set('promoPrice')} placeholder="Vide = aucun" style={fInput(T)} />
                </div>
              </div>
              <div style={fGrid2}>
                <div>
                  <label style={fLabel}>Stock initial</label>
                  <input required type="number" min="0" value={form.stock} onChange={set('stock')} style={fInput(T)} />
                </div>
                <div>
                  <label style={fLabel}>Conditionnement</label>
                  <input type="text" value={form.unit} onChange={set('unit')} placeholder="sac 50kg, unité..." style={fInput(T)} />
                </div>
              </div>
              <div style={fGrid2}>
                <div>
                  <label style={fLabel}>Catégorie</label>
                  <select value={form.categoryId} onChange={set('categoryId')} style={fInput(T)}>
                    <option value="">Sans catégorie</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={fLabel}>Badge (optionnel)</label>
                  <input type="text" value={form.badge} onChange={set('badge')} placeholder="Nouveau, Promo..." style={fInput(T)} />
                </div>
              </div>
              <div>
                <label style={fLabel}>Image (chemin / URL) *</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <input required type="text" value={form.image} onChange={set('image')} placeholder="/images/products/..." style={{ ...fInput(T), flex: 1 }} />
                  <ImageUploadButton folder="avs-produits" onUploaded={(url) => setForm(f => ({ ...f, image: url }))} />
                </div>
              </div>
              <button type="submit" disabled={loading} style={{ ...fSubmit, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Enregistrement…' : 'Enregistrer le Produit'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}
