'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import api from '@/lib/api-client'
import AdminGuard from '@/components/admin/AdminGuard'
import { fLabel, fInput, fGrid2, fSubmit, fError, fPage, fCard, fBack } from '@/components/admin/adminFormStyles'

export default function NewUserClient() {
  const T = useTheme()
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'CLIENT',
    userType: 'individual',
    companyName: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.password) {
      setError('Nom, email, téléphone et mot de passe sont obligatoires.')
      return
    }
    setLoading(true)
    try {
      const res = await api.users.create({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      })
      if (res?.data) router.push('/admin?tab=users')
      else setError(res?.message || 'Création impossible.')
    } catch (err) {
      setError(err.message || 'Erreur création utilisateur.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminGuard>
      <div style={fPage(T)}>
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <Link href="/admin?tab=users" style={fBack(T)}>
            <ArrowLeft size={15} /> Retour aux utilisateurs
          </Link>
          <div style={fCard(T)}>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.3rem' }}>Créer un Compte</h1>
            <p style={{ fontSize: '0.82rem', color: T.textMuted, margin: '0 0 1.5rem' }}>
              Créez un compte client, staff ou direction.
            </p>
            {error && <div style={fError}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={fLabel}>Nom complet *</label>
                <input required type="text" value={form.name} onChange={set('name')} placeholder="Ex : Paul Ngoma" style={fInput(T)} />
              </div>
              <div style={fGrid2}>
                <div>
                  <label style={fLabel}>Email *</label>
                  <input required type="email" value={form.email} onChange={set('email')} placeholder="paul@ferme.cg" style={fInput(T)} />
                </div>
                <div>
                  <label style={fLabel}>Téléphone *</label>
                  <input required type="tel" value={form.phone} onChange={set('phone')} placeholder="+242 06 123 45 67" style={fInput(T)} />
                </div>
              </div>
              <div style={fGrid2}>
                <div>
                  <label style={fLabel}>Rôle système</label>
                  <select value={form.role} onChange={set('role')} style={fInput(T)}>
                    <option value="CLIENT">Client / Éleveur</option>
                    <option value="STAFF">Staff Technique</option>
                    <option value="ADMIN">Direction Générale</option>
                  </select>
                </div>
                <div>
                  <label style={fLabel}>Type de structure</label>
                  <select value={form.userType} onChange={set('userType')} style={fInput(T)}>
                    <option value="individual">Éleveur Individuel</option>
                    <option value="company">Ferme / Entreprise</option>
                  </select>
                </div>
              </div>
              {form.userType === 'company' && (
                <div>
                  <label style={fLabel}>Nom de la ferme / entreprise</label>
                  <input type="text" value={form.companyName} onChange={set('companyName')} placeholder="Ferme Avicole Espoir" style={fInput(T)} />
                </div>
              )}
              <div>
                <label style={fLabel}>Mot de passe initial *</label>
                <input required type="password" value={form.password} onChange={set('password')} placeholder="8 caractères min., lettres et chiffres" style={fInput(T)} />
              </div>
              <button type="submit" disabled={loading} style={{ ...fSubmit, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Création…' : "Créer l'Utilisateur"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}
