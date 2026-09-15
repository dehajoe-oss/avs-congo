'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import api from '@/lib/api-client'
import AdminGuard from '@/components/admin/AdminGuard'
import { fLabel, fInput, fGrid2, fSubmit, fError, fPage, fCard, fBack } from '@/components/admin/adminFormStyles'

export default function NewTestimonialClient() {
  const T = useTheme()
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    role: 'Éleveur Avicole',
    project: 'Poussins & Provenderie',
    rating: 5,
    text: '',
    result: '',
    img: '',
    isApproved: true,
    isFeatured: false,
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
    if (!form.name.trim() || !form.project.trim() || !form.text.trim()) {
      setError('Nom, prestation et commentaire sont obligatoires.')
      return
    }
    setLoading(true)
    try {
      const res = await api.testimonials.create({
        ...form,
        name: form.name.trim(),
        project: form.project.trim(),
        text: form.text.trim(),
        rating: Number(form.rating) || 5,
      })
      if (res?.data) router.push('/admin?tab=testimonials')
      else setError(res?.message || 'Création impossible.')
    } catch (err) {
      setError(err.message || 'Erreur création témoignage.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminGuard>
      <div style={fPage(T)}>
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <Link href="/admin?tab=testimonials" style={fBack(T)}>
            <ArrowLeft size={15} /> Retour aux témoignages
          </Link>
          <div style={fCard(T)}>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.3rem' }}>Nouveau Témoignage</h1>
            <p style={{ fontSize: '0.82rem', color: T.textMuted, margin: '0 0 1.5rem' }}>
              Publiez un retour d&apos;expérience éleveur ou partenaire.
            </p>
            {error && <div style={fError}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={fGrid2}>
                <div>
                  <label style={fLabel}>Nom du client *</label>
                  <input required type="text" value={form.name} onChange={set('name')} placeholder="Ex : Jean-Paul Moukoko" style={fInput(T)} />
                </div>
                <div>
                  <label style={fLabel}>Rôle / Ferme</label>
                  <input type="text" value={form.role} onChange={set('role')} placeholder="Gérant · Ferme du Kouilou" style={fInput(T)} />
                </div>
              </div>
              <div style={fGrid2}>
                <div>
                  <label style={fLabel}>Prestation *</label>
                  <input required type="text" value={form.project} onChange={set('project')} placeholder="Poussins & Provenderie" style={fInput(T)} />
                </div>
                <div>
                  <label style={fLabel}>Note (1-5)</label>
                  <select value={form.rating} onChange={set('rating')} style={fInput(T)}>
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} / 5</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={fLabel}>Commentaire *</label>
                <textarea required rows={4} value={form.text} onChange={set('text')} placeholder="Retour d'expérience détaillé..." style={{ ...fInput(T), resize: 'vertical' }} />
              </div>
              <div style={fGrid2}>
                <div>
                  <label style={fLabel}>Badge résultat (optionnel)</label>
                  <input type="text" value={form.result} onChange={set('result')} placeholder="↑ Mortalité réduite" style={fInput(T)} />
                </div>
                <div>
                  <label style={fLabel}>Photo (chemin / URL)</label>
                  <input type="text" value={form.img} onChange={set('img')} placeholder="Vide = initiale" style={fInput(T)} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.isApproved} onChange={set('isApproved')} style={{ accentColor: '#b47027' }} />
                  Approuvé (visible sur le site)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.isFeatured} onChange={set('isFeatured')} style={{ accentColor: '#b47027' }} />
                  Mettre en avant
                </label>
              </div>
              <button type="submit" disabled={loading} style={{ ...fSubmit, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Publication…' : 'Publier le Témoignage'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}
