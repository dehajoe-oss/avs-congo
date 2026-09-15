'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import api from '@/lib/api-client'
import AdminGuard from '@/components/admin/AdminGuard'
import ImageUploadButton from '@/components/admin/ImageUploadButton'
import { fLabel, fInput, fGrid2, fSubmit, fError, fPage, fCard, fBack } from '@/components/admin/adminFormStyles'

const CATEGORIES = [
  'Santé Animale',
  "Conduite d'Élevage",
  'Hygiène Alimentaire',
  'HACCP & Qualité',
  'Sécurité au Travail',
  'Fabrication Détergents',
  'Cosmétique & Artisanat',
  'Sur-Mesure & Conseil',
]

export default function NewFormationClient() {
  const T = useTheme()
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    category: 'Santé Animale',
    duration: '4 Jours (24h) - Terrain',
    price: '70 000 FCFA',
    priceAmount: 70000,
    target: 'Éleveurs, techniciens vétérinaires',
    nextSession: 'Sessions bimensuelles',
    description: '',
    modulesCovered: '',
    image: '/images/ferme_ecole_avicole_1789164251928.jpg',
    featured: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [k]: v }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.price.trim()) {
      setError('Intitulé et tarif sont obligatoires.')
      return
    }
    setLoading(true)
    try {
      const res = await api.formations.create({
        ...form,
        title: form.title.trim(),
        price: form.price.trim(),
        priceAmount: Number(form.priceAmount) || 0,
        modulesCovered: form.modulesCovered
          ? form.modulesCovered.split('\n').map(s => s.trim()).filter(Boolean)
          : [],
      })
      if (res?.data) router.push('/admin?tab=formations')
      else setError(res?.message || 'Création impossible.')
    } catch (err) {
      setError(err.message || 'Erreur création formation.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminGuard>
      <div style={fPage(T)}>
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <Link href="/admin?tab=formations" style={fBack(T)}>
            <ArrowLeft size={15} /> Retour aux formations
          </Link>
          <div style={fCard(T)}>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.3rem' }}>Nouvelle Formation</h1>
            <p style={{ fontSize: '0.82rem', color: T.textMuted, margin: '0 0 1.5rem' }}>
              Ajoutez un module certifiant au catalogue ferme-école.
            </p>
            {error && <div style={fError}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={fLabel}>Intitulé *</label>
                <input required type="text" value={form.title} onChange={set('title')} placeholder="Ex : Conduite Pratique de l'Élevage Porcin" style={fInput(T)} />
              </div>
              <div style={fGrid2}>
                <div>
                  <label style={fLabel}>Catégorie *</label>
                  <select value={form.category} onChange={set('category')} style={fInput(T)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={fLabel}>Tarif (texte) *</label>
                  <input required type="text" value={form.price} onChange={set('price')} placeholder="75 000 FCFA" style={fInput(T)} />
                </div>
              </div>
              <div style={fGrid2}>
                <div>
                  <label style={fLabel}>Montant (FCFA, calculs)</label>
                  <input required type="number" min="0" value={form.priceAmount} onChange={set('priceAmount')} style={fInput(T)} />
                </div>
                <div>
                  <label style={fLabel}>Durée</label>
                  <input type="text" value={form.duration} onChange={set('duration')} style={fInput(T)} />
                </div>
              </div>
              <div style={fGrid2}>
                <div>
                  <label style={fLabel}>Prochaine session</label>
                  <input type="text" value={form.nextSession} onChange={set('nextSession')} style={fInput(T)} />
                </div>
                <div>
                  <label style={fLabel}>Public cible</label>
                  <input type="text" value={form.target} onChange={set('target')} placeholder="Éleveurs, techniciens..." style={fInput(T)} />
                </div>
              </div>
              <div>
                <label style={fLabel}>Description</label>
                <textarea rows={3} value={form.description} onChange={set('description')} placeholder="Présentation détaillée..." style={{ ...fInput(T), resize: 'vertical' }} />
              </div>
              <div>
                <label style={fLabel}>Modules (1 par ligne)</label>
                <textarea rows={3} value={form.modulesCovered} onChange={set('modulesCovered')} placeholder={'Module 1\nModule 2\nModule 3'} style={{ ...fInput(T), resize: 'vertical' }} />
              </div>
              <div>
                <label style={fLabel}>Image (chemin / URL)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <input type="text" value={form.image} onChange={set('image')} style={{ ...fInput(T), flex: 1 }} />
                  <ImageUploadButton folder="avs-formations" onUploaded={(url) => setForm(f => ({ ...f, image: url }))} />
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.featured} onChange={set('featured')} style={{ accentColor: '#b47027' }} />
                Mettre en avant sur le site public
              </label>
              <button type="submit" disabled={loading} style={{ ...fSubmit, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Création…' : 'Créer la Formation'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}
