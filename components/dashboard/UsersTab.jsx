// components/dashboard/UsersTab.jsx
'use client'

import { useState, useEffect } from 'react'
import {
  Users, UserPlus, Shield, ShieldCheck, UserCheck,
  UserX, Search, X, Check, Phone, Mail, Lock
} from 'lucide-react'

const ROLES = [
  { id: 'ADMIN', label: 'Administrateur', color: '#ef4444', desc: 'Accès total au système, gestion des droits et finances' },
  { id: 'STAFF', label: 'Équipe AVS (Staff)', color: '#ea8025', desc: 'Gestion des produits, commandes, clinique et leads' },
  { id: 'CLIENT', label: 'Client / Éleveur', color: '#3b82f6', desc: 'Accès boutique et historique de ses commandes' },
]

export default function UsersTab({ T, CARD }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'STAFF',
    companyName: '',
  })

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      if (data.users) setUsers(data.users)
    } catch (err) {
      console.error('Erreur chargement utilisateurs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
      await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole }),
      })
    } catch (err) {
      fetchUsers()
    }
  }

  const handleToggleActive = async (user) => {
    const nextState = !user.isActive
    try {
      setUsers(users.map(u => u.id === user.id ? { ...u, isActive: nextState } : u))
      await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, isActive: nextState }),
      })
    } catch (err) {
      fetchUsers()
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    if (!form.fullName || !form.password) {
      alert('Nom complet et mot de passe requis')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setIsModalOpen(false)
        setForm({ fullName: '', email: '', phone: '', password: '', role: 'STAFF', companyName: '' })
        fetchUsers()
      } else {
        const err = await res.json()
        alert(err.error || 'Erreur lors de la création')
      }
    } catch (err) {
      alert('Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  const filteredUsers = users.filter(u => {
    if (roleFilter && u.role !== roleFilter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (u.fullName || u.name)?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q)
    )
  })

  return (
    <div>
      {/* Barre d'actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 240 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '.6rem .9rem' }}>
            <Search size={16} color={T.textMuted} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, email ou téléphone..."
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: T.textMain, fontSize: '.84rem' }}
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '.6rem .9rem', color: T.textMain, fontSize: '.84rem', outline: 'none' }}
          >
            <option value="">Tous les rôles</option>
            {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#ea8025', color: '#fff', border: 'none', borderRadius: 12,
            padding: '.65rem 1.3rem', fontFamily: "'Poppins', sans-serif", fontWeight: 700,
            fontSize: '.85rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(234, 128, 37, 0.35)',
          }}
        >
          <UserPlus size={18} /> Ajouter un utilisateur
        </button>
      </div>

      {/* Liste des utilisateurs */}
      {loading && users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: T.textMuted }}>Chargement des utilisateurs...</div>
      ) : filteredUsers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: T.card, border: `1px solid ${T.border}`, borderRadius: 16 }}>
          <Users size={40} color={T.textMuted} style={{ marginBottom: 12 }} />
          <div style={{ fontSize: '1rem', fontWeight: 700, color: T.textMain, marginBottom: 4 }}>Aucun utilisateur trouvé</div>
          <p style={{ fontSize: '.82rem', color: T.textSub }}>Créez un compte administrateur ou personnel soignant ci-dessus.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredUsers.map((user) => {
            const roleObj = ROLES.find(r => r.id === user.role) || ROLES[2]
            const name = user.fullName || user.name || 'Utilisateur sans nom'

            return (
              <div
                key={user.id}
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
                {/* Infos identité */}
                <div style={{ minWidth: 220, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%',
                      background: `${roleObj.color}22`, color: roleObj.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '.9rem', flexShrink: 0,
                    }}>
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: '.9rem', fontWeight: 800, color: T.textMain }}>{name}</div>
                      <div style={{ fontSize: '.74rem', color: T.textMuted, display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                        {user.email && <span>{user.email}</span>}
                        {user.phone && <span>· {user.phone}</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sélecteur de rôle (Droits d'accès) */}
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontSize: '.68rem', color: T.textMuted, marginBottom: 3, textTransform: 'uppercase' }}>Droit d'accès</div>
                  <select
                    value={user.role || 'CLIENT'}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    style={{
                      background: `${roleObj.color}18`,
                      color: roleObj.color,
                      border: `1px solid ${roleObj.color}44`,
                      borderRadius: 8,
                      padding: '5px 10px',
                      fontSize: '.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    {ROLES.map(r => (
                      <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                  </select>
                </div>

                {/* Statut du compte */}
                <div>
                  <button
                    onClick={() => handleToggleActive(user)}
                    style={{
                      background: user.isActive ? 'rgba(76, 175, 80, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                      color: user.isActive ? '#2e7d32' : '#d32f2f',
                      border: `1px solid ${user.isActive ? 'rgba(76, 175, 80, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      borderRadius: 100,
                      padding: '4px 12px',
                      fontSize: '.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    {user.isActive ? <><UserCheck size={12} /> Actif</> : <><UserX size={12} /> Suspendu</>}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* MODAL CRÉER UN UTILISATEUR */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, maxWidth: 480, width: '100%', padding: '1.8rem', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: T.textMain, fontFamily: "'Poppins', sans-serif" }}>
                Ajouter un utilisateur
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: T.textMuted, cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: T.textSub, marginBottom: 4, textTransform: 'uppercase' }}>Nom complet *</label>
                <input
                  required
                  value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Ex: Dr. Martin POUTYA"
                  style={{ width: '100%', padding: '.65rem .85rem', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, outline: 'none', fontSize: '.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: T.textSub, marginBottom: 4, textTransform: 'uppercase' }}>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="agent@agrovetoservices.cg"
                    style={{ width: '100%', padding: '.65rem .85rem', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, outline: 'none', fontSize: '.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: T.textSub, marginBottom: 4, textTransform: 'uppercase' }}>Téléphone</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+242 06..."
                    style={{ width: '100%', padding: '.65rem .85rem', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, outline: 'none', fontSize: '.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: T.textSub, marginBottom: 4, textTransform: 'uppercase' }}>Rôle & Permissions *</label>
                <select
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  style={{ width: '100%', padding: '.65rem .85rem', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, outline: 'none', fontSize: '.85rem' }}
                >
                  {ROLES.map(r => (
                    <option key={r.id} value={r.id}>{r.label} ({r.desc})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: T.textSub, marginBottom: 4, textTransform: 'uppercase' }}>Mot de passe initial *</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Minimum 8 caractères"
                  style={{ width: '100%', padding: '.65rem .85rem', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, outline: 'none', fontSize: '.85rem' }}
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
                  style={{ background: '#ea8025', color: '#fff', border: 'none', borderRadius: 10, padding: '.6rem 1.4rem', fontWeight: 700, cursor: saving ? 'default' : 'pointer' }}
                >
                  {saving ? 'Création...' : 'Créer l’accès'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
