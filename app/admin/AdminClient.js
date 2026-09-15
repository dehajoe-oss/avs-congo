'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Calendar,
  Users,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Plus,
  ArrowRight,
  LogOut,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Shield,
  Save,
  Trash2,
  Eye,
  Check,
  Building,
  UserCheck,
  GraduationCap,
  Award,
  Star,
  BookOpen,
  MessageSquare,
  UserPlus,
  ShieldAlert,
  Pencil,
  Sun,
  Moon,
  X,
} from 'lucide-react'
import { useTheme } from '@/lib/theme'
import api from '@/lib/api-client'
import ImageUploadButton from '@/components/admin/ImageUploadButton'

export default function AdminClient() {
  const T = useTheme()

  // ── Authentification ──
  const [token, setToken] = useState(null)
  const [adminUser, setAdminUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [loginForm, setLoginForm] = useState({
    email: 'admin@agrovetoservices.cg',
    password: '',
  })
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // ── Onglet Actif ──
  // 'dashboard' | 'orders' | 'products' | 'formations' | 'testimonials' | 'users' | 'appointments' | 'leads'
  // ?tab= permet d'arriver directement sur l'onglet concerné (retour des pages de création)
  const searchParams = useSearchParams()
  const requestedTab = searchParams.get('tab')
  const VALID_TABS = ['dashboard', 'orders', 'products', 'formations', 'testimonials', 'users', 'appointments', 'leads']
  const [activeTab, setActiveTab] = useState(VALID_TABS.includes(requestedTab) ? requestedTab : 'dashboard')

  // ── Données Backend ──
  const [dashboardData, setDashboardData] = useState(null)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [formations, setFormations] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [users, setUsers] = useState([])
  const [appointments, setAppointments] = useState([])
  const [leads, setLeads] = useState([])
  const [loadingData, setLoadingData] = useState(false)
  const [toast, setToast] = useState(null)

  // ── Filtres & Recherche ──
  const [orderFilter, setOrderFilter] = useState('ALL')
  const [formationTab, setFormationTab] = useState('catalog') // 'catalog' | 'registrations'
  const [userRoleFilter, setUserRoleFilter] = useState('ALL')
  const [userSearch, setUserSearch] = useState('')

  // ── Modals & Formulaires ──
  const [editingProduct, setEditingProduct] = useState(null)
  const [editProductForm, setEditProductForm] = useState({
    title: '',
    description: '',
    price: '',
    promoPrice: '',
    stock: 0,
    unit: '',
    image: '',
    badge: '',
  })

  const [editingFormation, setEditingFormation] = useState(null)
  const [editFormationForm, setEditFormationForm] = useState({
    title: '',
    category: 'Santé Animale',
    duration: '',
    price: '',
    priceAmount: 0,
    target: '',
    nextSession: '',
    description: '',
    modulesCovered: '',
    image: '',
  })

  const showNotification = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
    setTimeout(() => setToast(null), 3500)
  }

  // ── 1. Vérification session Admin ──
  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('avs_token') : null
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem('avs_user') : null

    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        if (parsed.role === 'ADMIN' || parsed.role === 'STAFF') {
          setToken(savedToken)
          setAdminUser(parsed)
        }
      } catch (err) {
        console.error('Erreur parsing session:', err)
      }
    }
    setAuthLoading(false)
  }, [])

  // ── 2. Chargement de toutes les données du Backend ──
  const loadAllData = useCallback(async () => {
    setLoadingData(true)
    try {
      const [
        dashRes,
        ordersRes,
        prodsRes,
        formsRes,
        regisRes,
        testsRes,
        usersRes,
        apptsRes,
        leadsRes,
      ] = await Promise.allSettled([
        api.stats.getDashboard(),
        api.orders.getAll({ limit: 100 }),
        api.products.getAll({ limit: 100 }),
        api.formations.getAll({ all: 'true' }),
        api.formations.getRegistrations(),
        api.testimonials.getAllAdmin(),
        api.users.getAll(),
        api.appointments.getAll(),
        api.leads.getAll(),
      ])

      if (dashRes.status === 'fulfilled' && dashRes.value?.data) {
        setDashboardData(dashRes.value.data)
      }
      if (ordersRes.status === 'fulfilled' && ordersRes.value?.data) {
        setOrders(ordersRes.value.data)
      }
      if (prodsRes.status === 'fulfilled' && prodsRes.value?.data) {
        setProducts(prodsRes.value.data)
      }
      if (formsRes.status === 'fulfilled' && formsRes.value?.data) {
        setFormations(formsRes.value.data)
      }
      if (regisRes.status === 'fulfilled' && regisRes.value?.data) {
        setRegistrations(regisRes.value.data)
      }
      if (testsRes.status === 'fulfilled' && testsRes.value?.data) {
        setTestimonials(testsRes.value.data)
      }
      if (usersRes.status === 'fulfilled' && usersRes.value?.data) {
        setUsers(usersRes.value.data)
      }
      if (apptsRes.status === 'fulfilled' && apptsRes.value?.data) {
        setAppointments(apptsRes.value.data)
      }
      if (leadsRes.status === 'fulfilled' && leadsRes.value?.data) {
        setLeads(leadsRes.value.data)
      }
    } catch (err) {
      console.error('Erreur chargement données admin:', err)
      showNotification('Impossible de charger certaines données', 'error')
    } finally {
      setLoadingData(false)
    }
  }, [])

  useEffect(() => {
    if (adminUser) {
      loadAllData()
    }
  }, [adminUser, loadAllData])

  // ── 3. Connexion & Déconnexion ──
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setIsLoggingIn(true)

    try {
      const res = await api.auth.login({
        email: loginForm.email.trim(),
        password: loginForm.password.trim(),
      })

      const user = res?.data?.user
      const receivedToken = res?.data?.token

      if (user && receivedToken) {
        if (user.role !== 'ADMIN' && user.role !== 'STAFF') {
          setLoginError('Ce compte ne possède pas les autorisations requises.')
          setIsLoggingIn(false)
          return
        }
        localStorage.setItem('avs_token', receivedToken)
        localStorage.setItem('avs_user', JSON.stringify(user))
        setToken(receivedToken)
        setAdminUser(user)
        showNotification(`Connecté en tant que ${user.name}`)
      } else {
        setLoginError('Réponse serveur invalide.')
      }
    } catch (err) {
      setLoginError(err.message || 'Identifiants invalides')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('avs_token')
    localStorage.removeItem('avs_user')
    setToken(null)
    setAdminUser(null)
  }

  // ── 4. Actions Commandes ──
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.orders.updateStatus(orderId, { status: newStatus })
      setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)))
      showNotification(`Commande mise à jour : ${newStatus}`)
    } catch (err) {
      showNotification(err.message || 'Échec de mise à jour', 'error')
    }
  }

  // ── 5. Actions Produits ──
  const handleStockAdjust = async (productId, delta) => {
    const prod = products.find(p => p.id === productId)
    if (!prod) return
    const newStock = Math.max(0, (prod.stock || 0) + delta)
    try {
      await api.products.update(productId, { stock: newStock })
      setProducts(prev => prev.map(p => (p.id === productId ? { ...p, stock: newStock } : p)))
      showNotification(`Stock ajusté : ${newStock} ${prod.unit}`)
    } catch (err) {
      showNotification('Erreur mise à jour stock', 'error')
    }
  }

  const openEditProduct = (prod) => {
    setEditProductForm({
      title: prod.title || '',
      description: prod.description || '',
      price: prod.price ?? '',
      promoPrice: prod.promoPrice ?? '',
      stock: prod.stock ?? 0,
      unit: prod.unit || '',
      image: prod.image || '',
      badge: prod.badge || '',
    })
    setEditingProduct(prod)
  }

  const handleEditProductSubmit = async (e) => {
    e.preventDefault()
    if (!editingProduct) return
    try {
      const res = await api.products.update(editingProduct.id, {
        ...editProductForm,
        price: Number(editProductForm.price),
        stock: Number(editProductForm.stock),
        promoPrice: editProductForm.promoPrice === '' || editProductForm.promoPrice === null
          ? null
          : Number(editProductForm.promoPrice),
      })
      if (res?.data) {
        setProducts(prev => prev.map(p => (p.id === editingProduct.id ? res.data : p)))
        setEditingProduct(null)
        showNotification(`Produit "${res.data.title}" mis à jour`)
      }
    } catch (err) {
      showNotification(err.message || 'Erreur mise à jour produit', 'error')
    }
  }

  const handleDeleteProduct = async (prodId, prodTitle) => {
    if (!confirm(`Voulez-vous vraiment supprimer "${prodTitle}" du catalogue ?`)) return
    try {
      await api.products.delete(prodId)
      setProducts(prev => prev.filter(p => p.id !== prodId))
      showNotification('Produit supprimé avec succès')
    } catch (err) {
      showNotification(err.message || 'Erreur suppression produit', 'error')
    }
  }

  // ── 6. Actions Formations ──
  const handleToggleFormationStatus = async (formId, currentActive) => {
    try {
      await api.formations.update(formId, { isActive: !currentActive })
      setFormations(prev => prev.map(f => (f.id === formId ? { ...f, isActive: !currentActive } : f)))
      showNotification(!currentActive ? 'Formation activée' : 'Formation masquée du site public')
    } catch (err) {
      showNotification('Erreur statut formation', 'error')
    }
  }

  const handleDeleteFormation = async (formId) => {
    if (!confirm('Voulez-vous vraiment supprimer cette formation ?')) return
    try {
      await api.formations.delete(formId)
      setFormations(prev => prev.filter(f => f.id !== formId))
      showNotification('Formation supprimée avec succès')
    } catch (err) {
      showNotification('Erreur suppression formation', 'error')
    }
  }

  const openEditFormation = (f) => {
    setEditFormationForm({
      title: f.title || '',
      category: f.category || 'Santé Animale',
      duration: f.duration || '',
      price: f.price || '',
      priceAmount: f.priceAmount ?? 0,
      target: f.target || '',
      nextSession: f.nextSession || '',
      description: f.description || '',
      modulesCovered: Array.isArray(f.modulesCovered) ? f.modulesCovered.join('\n') : (f.modulesCovered || ''),
      image: f.image || '',
    })
    setEditingFormation(f)
  }

  const handleEditFormationSubmit = async (e) => {
    e.preventDefault()
    if (!editingFormation) return
    try {
      const modulesArr = editFormationForm.modulesCovered
        ? editFormationForm.modulesCovered.split('\n').map(s => s.trim()).filter(Boolean)
        : []
      const res = await api.formations.update(editingFormation.id, {
        ...editFormationForm,
        priceAmount: Number(editFormationForm.priceAmount) || 0,
        modulesCovered: modulesArr,
      })
      if (res?.data) {
        setFormations(prev => prev.map(f => (f.id === editingFormation.id ? res.data : f)))
        setEditingFormation(null)
        showNotification(`Formation "${res.data.title}" mise à jour`)
      }
    } catch (err) {
      showNotification(err.message || 'Erreur mise à jour formation', 'error')
    }
  }

  const handleUpdateRegistrationStatus = async (regId, status) => {
    try {
      await api.formations.updateRegistrationStatus(regId, { status })
      setRegistrations(prev => prev.map(r => (r.id === regId ? { ...r, status } : r)))
      showNotification(`Statut inscription : ${status}`)
    } catch (err) {
      showNotification('Erreur mise à jour inscription', 'error')
    }
  }

  // ── 7. Actions Témoignages ──
  // ── 7b. Actions Témoignages : approbation / suppression ──

  const handleToggleTestimonialApproval = async (testId, currentApproved) => {
    try {
      await api.testimonials.toggleApproval(testId, !currentApproved)
      setTestimonials(prev => prev.map(t => (t.id === testId ? { ...t, isApproved: !currentApproved } : t)))
      showNotification(!currentApproved ? 'Avis client approuvé et visible' : 'Avis masqué du site')
    } catch (err) {
      showNotification('Erreur statut avis', 'error')
    }
  }

  const handleDeleteTestimonial = async (testId) => {
    if (!confirm('Supprimer définitivement ce témoignage ?')) return
    try {
      await api.testimonials.delete(testId)
      setTestimonials(prev => prev.filter(t => t.id !== testId))
      showNotification('Témoignage supprimé')
    } catch (err) {
      showNotification('Erreur suppression avis', 'error')
    }
  }

  // ── 8. Actions Utilisateurs ──
  // Garde anti auto-dégradation (façon AFI) : on ne se bloque / rétrograde /
  // supprime jamais son propre compte admin depuis cette interface.
  const isSelf = (userId) => adminUser && userId === adminUser.id

  const handleToggleUserStatus = async (userId) => {
    if (isSelf(userId)) {
      showNotification('Vous ne pouvez pas suspendre votre propre compte.', 'error')
      return
    }
    try {
      const res = await api.users.toggleStatus(userId)
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, isActive: res.data.isActive } : u)))
      showNotification(res.message || 'Statut utilisateur mis à jour')
    } catch (err) {
      showNotification(err.message || 'Erreur statut utilisateur', 'error')
    }
  }

  const handleUpdateUserRole = async (userId, newRole) => {
    if (isSelf(userId) && newRole !== 'ADMIN') {
      if (!confirm('Attention : en quittant le rôle Direction, vous perdrez l’accès à ce back-office. Continuer ?')) return
    }
    try {
      await api.users.update(userId, { role: newRole })
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: newRole } : u)))
      showNotification(`Rôle modifié : ${newRole}`)
    } catch (err) {
      showNotification('Erreur mise à jour rôle', 'error')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (isSelf(userId)) {
      showNotification('Vous ne pouvez pas supprimer votre propre compte.', 'error')
      return
    }
    if (!confirm('Voulez-vous supprimer définitivement ce compte utilisateur ?')) return
    try {
      await api.users.delete(userId)
      setUsers(prev => prev.filter(u => u.id !== userId))
      showNotification('Compte utilisateur supprimé')
    } catch (err) {
      showNotification(err.message || 'Erreur suppression', 'error')
    }
  }

  // ── Écran de Connexion Admin ──
  if (!adminUser) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.bg, padding: '2rem 1rem', fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ width: '100%', maxWidth: '440px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: '24px', padding: '2.5rem 2rem', boxShadow: '0 25px 60px rgba(0,0,0,0.35)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(180, 112, 39, 0.12)', border: '1px solid rgba(180, 112, 39, 0.3)', color: '#b47027', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
              <Shield size={32} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: T.textMain, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
              Back-Office AVS Congo
            </h1>
            <p style={{ fontSize: '0.82rem', color: T.textMuted, margin: 0 }}>
              Accès sécurisé réservé à la direction et au personnel autorisé
            </p>
          </div>

          {loginError && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', fontSize: '0.82rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: T.textMain, marginBottom: '0.4rem' }}>
                Email de direction
              </label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={e => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="admin@agrovetoservices.cg"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: T.textMain, marginBottom: '0.4rem' }}>
                Mot de passe sécurisé
              </label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••••••"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, fontSize: '0.9rem', outline: 'none' }}
              />
              <div style={{ fontSize: '0.7rem', color: T.textMuted, marginTop: '0.3rem' }}>
                Identifiant prédéfini : <code>Admin@Avs2026!</code>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              style={{ width: '100%', padding: '13px', borderRadius: '100px', border: 'none', background: '#b47027', color: '#ffffff', fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', marginTop: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: isLoggingIn ? 0.7 : 1 }}
            >
              {isLoggingIn ? 'Connexion en cours...' : 'Se connecter au Tableau de Bord'}
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link href="/" style={{ fontSize: '0.82rem', color: T.textMuted, textDecoration: 'none' }}>
              ← Retour au site public Agro Véto Services
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.textMain, fontFamily: "'Poppins', sans-serif" }}>
      {/* ── Toast de confirmation ── */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, padding: '12px 20px', borderRadius: '12px', background: toast.type === 'error' ? '#ef4444' : '#10b981', color: '#ffffff', fontSize: '0.88rem', fontWeight: 600, boxShadow: '0 10px 30px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* ── Barre Supérieure Header ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: T.surface, borderBottom: `1px solid ${T.border}`, padding: '0.9rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ height: 40, padding: '4px 12px', borderRadius: 10, background: '#ffffff', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center' }}>
              <img src="/images/logo.webp" alt="Agro Véto Services Congo" style={{ height: '100%', width: 'auto', display: 'block' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '-0.02em', color: T.textMain }}>
                DIRECTION & GESTION GÉNÉRALE
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#10b981' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                PostgreSQL & API en Ligne (Port 5000)
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button
            onClick={T.toggle}
            title={T.light ? 'Passer en mode sombre' : 'Passer en mode clair'}
            style={{ width: 36, height: 36, borderRadius: '50%', border: `1px solid ${T.border}`, background: 'transparent', color: '#b47027', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            {T.light ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <button
            onClick={loadAllData}
            title="Rafraîchir les données"
            style={{ width: 36, height: 36, borderRadius: '50%', border: `1px solid ${T.border}`, background: 'transparent', color: T.textMain, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <RefreshCw size={16} />
          </button>

          <Link
            href="/"
            target="_blank"
            title="Ouvrir le site public"
            style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', padding: '6px 12px', borderRadius: 8, border: `1px solid ${T.border}`, color: T.textMain, textDecoration: 'none' }}
          >
            <ExternalLink size={14} />
            Site Public
          </Link>

          <button
            onClick={handleLogout}
            title="Se déconnecter"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', padding: '6px 12px', borderRadius: 8, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#ef4444', cursor: 'pointer' }}
          >
            <LogOut size={14} />
            Déconnexion
          </button>
        </div>
      </header>

      {/* ── Navigation Onglets Principaux ── */}
      <nav style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: '0.4rem 1.5rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {[
          { id: 'dashboard', label: 'Vue d’ensemble', icon: LayoutDashboard, count: null },
          { id: 'orders', label: 'Commandes', icon: ShoppingCart, count: orders.length },
          { id: 'products', label: 'Catalogue & Stocks', icon: Package, count: products.length },
          { id: 'formations', label: 'Formations & Inscriptions', icon: GraduationCap, count: formations.length },
          { id: 'testimonials', label: 'Témoignages & Avis', icon: Award, count: testimonials.length },
          { id: 'users', label: 'Utilisateurs & Éleveurs', icon: Users, count: users.length },
          { id: 'appointments', label: 'Rendez-vous Clinique', icon: Calendar, count: appointments.length },
          { id: 'leads', label: 'Prospects & Devis', icon: Mail, count: leads.length },
        ].map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.65rem 1rem',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? '#b47027' : 'transparent',
                color: isActive ? '#ffffff' : T.textSub,
                fontSize: '0.82rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  style={{
                    padding: '2px 6px',
                    borderRadius: '100px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(180, 112, 39, 0.15)',
                    color: isActive ? '#ffffff' : '#b47027',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* ── Contenu de la Vue ── */}
      <main style={{ padding: '2rem 1.5rem', maxWidth: '1440px', margin: '0 auto' }}>
        {/* ══════════════════════════════════════════════════
            ONGLET 1 : DASHBOARD & STATISTIQUES
        ══════════════════════════════════════════════════ */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1.5rem', borderRadius: '18px', background: T.surface, border: `1px solid ${T.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: T.textMuted, fontSize: '0.82rem' }}>
                  <span>Chiffre d’Affaires</span>
                  <CreditCard size={18} color="#b47027" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#b47027', marginTop: '0.6rem' }}>
                  {(dashboardData?.kpis?.revenue || 0).toLocaleString('fr-FR')} FCFA
                </div>
                <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.3rem' }}>
                  Paiements KKiaPay & espèces validés
                </div>
              </div>

              <div style={{ padding: '1.5rem', borderRadius: '18px', background: T.surface, border: `1px solid ${T.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: T.textMuted, fontSize: '0.82rem' }}>
                  <span>Commandes Total</span>
                  <ShoppingCart size={18} color="#b47027" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: T.textMain, marginTop: '0.6rem' }}>
                  {dashboardData?.kpis?.ordersCount || orders.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: T.textMuted, marginTop: '0.3rem' }}>
                  Intrants, provendes & poussins
                </div>
              </div>

              <div style={{ padding: '1.5rem', borderRadius: '18px', background: T.surface, border: `1px solid ${T.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: T.textMuted, fontSize: '0.82rem' }}>
                  <span>Formations & Apprenants</span>
                  <GraduationCap size={18} color="#10b981" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: T.textMain, marginTop: '0.6rem' }}>
                  {formations.length} <span style={{ fontSize: '0.9rem', color: T.textMuted, fontWeight: 500 }}>({registrations.length} inscrits)</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.3rem' }}>
                  Ferme-École & Ateliers AVS
                </div>
              </div>

              <div style={{ padding: '1.5rem', borderRadius: '18px', background: T.surface, border: `1px solid ${T.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: T.textMuted, fontSize: '0.82rem' }}>
                  <span>Utilisateurs & Éleveurs</span>
                  <Users size={18} color="#3b82f6" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: T.textMain, marginTop: '0.6rem' }}>
                  {users.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginTop: '0.3rem' }}>
                  Fermes et clients référencés
                </div>
              </div>
            </div>

            {/* Alertes de Stock Faible */}
            {dashboardData?.lowStockProducts && dashboardData.lowStockProducts.length > 0 && (
              <div style={{ padding: '1.5rem', borderRadius: '18px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: 700, marginBottom: '0.8rem' }}>
                  <AlertTriangle size={18} />
                  <span>Alertes de Réapprovisionnement de Stock</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  {dashboardData.lowStockProducts.map(p => (
                    <div key={p.id} style={{ background: T.surface, padding: '1rem', borderRadius: '12px', border: `1px solid ${T.border}` }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: T.textMain }}>{p.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 600, marginTop: '4px' }}>
                        Reste : {p.stock} {p.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            ONGLET 2 : GESTION DES COMMANDES
        ══════════════════════════════════════════════════ */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: T.textMain }}>Commandes & Règlements</h2>
                <p style={{ fontSize: '0.8rem', color: T.textMuted, margin: '0.2rem 0 0' }}>Suivi des livraisons et des paiements KKiaPay</p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['ALL', 'PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'].map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${orderFilter === st ? '#b47027' : T.border}`,
                      background: orderFilter === st ? '#b47027' : 'transparent',
                      color: orderFilter === st ? '#fff' : T.textSub,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {st === 'ALL' ? 'Toutes' : st}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: T.surface, borderRadius: '16px', border: `1px solid ${T.border}`, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: T.bg, borderBottom: `1px solid ${T.border}`, color: T.textMuted }}>
                      <th style={{ padding: '12px 16px' }}>N° Commande</th>
                      <th style={{ padding: '12px 16px' }}>Client</th>
                      <th style={{ padding: '12px 16px' }}>Montant</th>
                      <th style={{ padding: '12px 16px' }}>Paiement</th>
                      <th style={{ padding: '12px 16px' }}>Statut Commande</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: T.textMuted }}>
                          Aucune commande enregistrée.
                        </td>
                      </tr>
                    ) : (
                      orders
                        .filter(o => orderFilter === 'ALL' || o.status === orderFilter)
                        .map(order => (
                          <tr key={order.id} style={{ borderBottom: `1px solid ${T.border}` }}>
                            <td style={{ padding: '14px 16px', fontWeight: 800, color: '#b47027' }}>
                              {order.orderNumber}
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ fontWeight: 600, color: T.textMain }}>{order.customerName}</div>
                              <div style={{ fontSize: '0.72rem', color: T.textMuted }}>{order.customerPhone}</div>
                            </td>
                            <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                              {Number(order.totalAmount).toLocaleString('fr-FR')} FCFA
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ padding: '3px 8px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 700, background: order.paymentStatus === 'PAID' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: order.paymentStatus === 'PAID' ? '#10b981' : '#f59e0b' }}>
                                {order.paymentStatus}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ padding: '3px 8px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 700, background: order.status === 'DELIVERED' ? 'rgba(16, 185, 129, 0.15)' : order.status === 'CANCELLED' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(180, 112, 39, 0.15)', color: order.status === 'DELIVERED' ? '#10b981' : order.status === 'CANCELLED' ? '#ef4444' : '#b47027' }}>
                                {order.status}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                              <select
                                value={order.status}
                                onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                                style={{ padding: '4px 8px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, fontSize: '0.75rem', outline: 'none' }}
                              >
                                <option value="PENDING">En attente</option>
                                <option value="CONFIRMED">Confirmée</option>
                                <option value="PROCESSING">Préparation</option>
                                <option value="SHIPPED">En livraison</option>
                                <option value="DELIVERED">Livrée</option>
                                <option value="CANCELLED">Annulée</option>
                              </select>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            ONGLET 3 : CATALOGUE PRODUITS & STOCKS
        ══════════════════════════════════════════════════ */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: T.textMain }}>Catalogue Produits & Intrants</h2>
                <p style={{ fontSize: '0.8rem', color: T.textMuted, margin: '0.2rem 0 0' }}>Gérez les prix, disponibilités et stocks en temps réel</p>
              </div>

              <Link
                href="/admin/produits/nouveau"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', background: '#b47027', color: '#fff', fontSize: '0.82rem', fontWeight: 700, border: 'none', cursor: 'pointer', textDecoration: 'none' }}
              >
                <Plus size={16} />
                Nouveau Produit
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
              {products.map(prod => (
                <div key={prod.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '16px', padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  {prod.image && (
                    <div style={{ marginBottom: '0.8rem', borderRadius: '12px', overflow: 'hidden', background: T.bg, height: '150px' }}>
                      <img src={prod.image} alt={prod.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    </div>
                  )}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 6, background: 'rgba(180, 112, 39, 0.15)', color: '#b47027', fontWeight: 700 }}>
                        {prod.unit}
                      </span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: prod.stock > 50 ? '#10b981' : '#ef4444' }}>
                        {prod.stock > 0 ? `${prod.stock} en stock` : 'Rupture'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.4rem', color: T.textMain }}>
                      {prod.title}
                    </h3>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#b47027', marginBottom: '0.8rem' }}>
                      {Number(prod.price).toLocaleString('fr-FR')} FCFA
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '1rem', borderTop: `1px solid ${T.border}` }}>
                    <span style={{ fontSize: '0.75rem', color: T.textMuted }}>Ajuster stock :</span>
                    <button
                      onClick={() => handleStockAdjust(prod.id, -10)}
                      style={{ padding: '4px 10px', borderRadius: 6, border: `1px solid ${T.border}`, background: 'transparent', color: T.textMain, cursor: 'pointer' }}
                    >
                      -10
                    </button>
                    <button
                      onClick={() => handleStockAdjust(prod.id, 50)}
                      style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: 700, cursor: 'pointer' }}
                    >
                      +50
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '0.6rem' }}>
                    <button
                      onClick={() => openEditProduct(prod)}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '7px', borderRadius: 8, border: `1px solid ${T.border}`, background: 'transparent', color: T.textMain, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      <Pencil size={13} />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id, prod.title)}
                      title="Supprimer ce produit"
                      style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            ONGLET 4 : FORMATIONS & INSCRIPTIONS (NOUVEAU)
        ══════════════════════════════════════════════════ */}
        {activeTab === 'formations' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: T.textMain }}>
                  Formations & Fermes-Écoles
                </h2>
                <p style={{ fontSize: '0.8rem', color: T.textMuted, margin: '0.2rem 0 0' }}>
                  Pilotage des 8 modules certifiants et gestion des inscriptions apprenants
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', background: T.surface, padding: '3px', borderRadius: '10px', border: `1px solid ${T.border}` }}>
                  <button
                    onClick={() => setFormationTab('catalog')}
                    style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: formationTab === 'catalog' ? '#b47027' : 'transparent', color: formationTab === 'catalog' ? '#fff' : T.textSub, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Catalogue ({formations.length})
                  </button>
                  <button
                    onClick={() => setFormationTab('registrations')}
                    style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: formationTab === 'registrations' ? '#b47027' : 'transparent', color: formationTab === 'registrations' ? '#fff' : T.textSub, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Pré-inscriptions ({registrations.length})
                  </button>
                </div>

                <Link
                  href="/admin/formations/nouveau"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', background: '#b47027', color: '#fff', fontSize: '0.82rem', fontWeight: 700, border: 'none', cursor: 'pointer', textDecoration: 'none' }}
                >
                  <Plus size={16} />
                  Nouvelle Formation
                </Link>
              </div>
            </div>

            {/* Vue 1 : Catalogue des Formations */}
            {formationTab === 'catalog' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.4rem' }}>
                {formations.map(f => (
                  <div
                    key={f.id}
                    style={{
                      background: T.surface,
                      border: `1px solid ${T.border}`,
                      borderRadius: '18px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      opacity: f.isActive ? 1 : 0.6,
                    }}
                  >
                    {f.image && (
                      <div style={{ marginBottom: '0.8rem', borderRadius: '12px', overflow: 'hidden', background: T.bg || '#f1f5f9', height: '150px' }}>
                        <img src={f.image} alt={f.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
                      </div>
                    )}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                        <span style={{ fontSize: '0.7rem', padding: '3px 9px', borderRadius: 6, background: 'rgba(180, 112, 39, 0.15)', color: '#b47027', fontWeight: 700 }}>
                          {f.category}
                        </span>
                        <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: 6, background: f.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: f.isActive ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                          {f.isActive ? 'Active' : 'Masquée'}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 0.5rem', color: T.textMain, lineHeight: 1.4 }}>
                        {f.title}
                      </h3>

                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#b47027', marginBottom: '0.6rem' }}>
                        {f.price}
                      </div>

                      <div style={{ fontSize: '0.78rem', color: T.textSub, marginBottom: '0.4rem' }}>
                        ⏱️ <strong>Durée :</strong> {f.duration}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: T.textSub, marginBottom: '0.8rem' }}>
                        📅 <strong>Session :</strong> {f.nextSession}
                      </div>

                      {f.description && (
                        <p style={{ fontSize: '0.78rem', color: T.textMuted, lineHeight: 1.5, margin: '0 0 1rem' }}>
                          {f.description}
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', paddingTop: '1rem', borderTop: `1px solid ${T.border}` }}>
                      <button
                        onClick={() => openEditFormation(f)}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '7px', borderRadius: 8, border: `1px solid ${T.border}`, background: 'transparent', color: T.textMain, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        <Pencil size={13} />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleToggleFormationStatus(f.id, f.isActive)}
                        style={{ flex: 1, padding: '7px', borderRadius: 8, border: `1px solid ${T.border}`, background: 'transparent', color: T.textMain, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        {f.isActive ? 'Masquer' : 'Activer'}
                      </button>
                      <button
                        onClick={() => handleDeleteFormation(f.id)}
                        style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Vue 2 : Liste des Pré-inscriptions */}
            {formationTab === 'registrations' && (
              <div style={{ background: T.surface, borderRadius: '16px', border: `1px solid ${T.border}`, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ background: T.bg, borderBottom: `1px solid ${T.border}`, color: T.textMuted }}>
                        <th style={{ padding: '12px 16px' }}>Candidat</th>
                        <th style={{ padding: '12px 16px' }}>Module Choisi</th>
                        <th style={{ padding: '12px 16px' }}>Participants</th>
                        <th style={{ padding: '12px 16px' }}>Statut</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: T.textMuted }}>
                            Aucune inscription enregistrée pour le moment.
                          </td>
                        </tr>
                      ) : (
                        registrations.map(reg => (
                          <tr key={reg.id} style={{ borderBottom: `1px solid ${T.border}` }}>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ fontWeight: 700, color: T.textMain }}>{reg.fullName}</div>
                              <div style={{ fontSize: '0.72rem', color: T.textMuted }}>📞 {reg.phone} {reg.email && `• ${reg.email}`}</div>
                            </td>
                            <td style={{ padding: '14px 16px', fontWeight: 600, color: '#b47027' }}>
                              {reg.formationType}
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              {reg.participantsCount || 1} personne(s)
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ padding: '3px 8px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 700, background: reg.status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.15)' : reg.status === 'CANCELLED' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: reg.status === 'CONFIRMED' ? '#10b981' : reg.status === 'CANCELLED' ? '#ef4444' : '#f59e0b' }}>
                                {reg.status}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <a
                                  href={`https://wa.me/${(reg.phone || '').replace(/[^0-9]/g, '')}?text=Bonjour%20${encodeURIComponent(reg.fullName)}%2C%20Agro%20V%C3%A9to%20Services%20vous%20contacte%20concernant%20votre%20inscription...`}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ padding: '5px 10px', borderRadius: 6, background: '#25D366', color: '#fff', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none' }}
                                >
                                  WhatsApp
                                </a>
                                <button
                                  onClick={() => handleUpdateRegistrationStatus(reg.id, 'CONFIRMED')}
                                  style={{ padding: '5px 10px', borderRadius: 6, border: 'none', background: '#10b981', color: '#fff', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  Confirmer
                                </button>
                                <button
                                  onClick={() => handleUpdateRegistrationStatus(reg.id, 'CANCELLED')}
                                  style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid rgba(239, 68, 68, 0.3)', background: 'transparent', color: '#ef4444', fontSize: '0.72rem', cursor: 'pointer' }}
                                >
                                  Annuler
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            ONGLET 5 : TÉMOIGNAGES & AVIS CLIENTS (NOUVEAU)
        ══════════════════════════════════════════════════ */}
        {activeTab === 'testimonials' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: T.textMain }}>
                  Témoignages & Avis Clients
                </h2>
                <p style={{ fontSize: '0.8rem', color: T.textMuted, margin: '0.2rem 0 0' }}>
                  Modération et publication des retours d’expérience des éleveurs et partenaires
                </p>
              </div>

              <Link
                href="/admin/temoignages/nouveau"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', background: '#b47027', color: '#fff', fontSize: '0.82rem', fontWeight: 700, border: 'none', cursor: 'pointer', textDecoration: 'none' }}
              >
                <Plus size={16} />
                Ajouter un Témoignage
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.4rem' }}>
              {testimonials.map(t => (
                <div
                  key={t.id}
                  style={{
                    background: T.surface,
                    border: `1px solid ${t.isApproved ? T.border : 'rgba(245, 158, 11, 0.4)'}`,
                    borderRadius: '18px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} size={14} fill="#b47027" color="#b47027" />
                        ))}
                      </div>

                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 6, background: t.isApproved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: t.isApproved ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                        {t.isApproved ? '✓ Approuvé & Public' : '⏳ En attente'}
                      </span>
                    </div>

                    <blockquote style={{ fontSize: '0.88rem', color: T.textMain, fontStyle: 'italic', lineHeight: 1.6, margin: '0 0 1.2rem' }}>
                      "{t.text}"
                    </blockquote>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.8rem' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(180, 112, 39, 0.15)', color: '#b47027', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                        {t.name[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: T.textMain }}>{t.name}</div>
                        <div style={{ fontSize: '0.72rem', color: T.textMuted }}>{t.role}</div>
                      </div>
                    </div>

                    {t.result && (
                      <div style={{ display: 'inline-block', fontSize: '0.7rem', fontWeight: 700, color: '#b47027', background: 'rgba(180, 112, 39, 0.1)', padding: '3px 8px', borderRadius: 6, marginBottom: '1rem' }}>
                        {t.result}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', paddingTop: '1rem', borderTop: `1px solid ${T.border}` }}>
                    <button
                      onClick={() => handleToggleTestimonialApproval(t.id, t.isApproved)}
                      style={{ flex: 1, padding: '7px', borderRadius: 8, border: 'none', background: t.isApproved ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: t.isApproved ? '#f59e0b' : '#10b981', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      {t.isApproved ? 'Masquer' : 'Approuver'}
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(t.id)}
                      style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            ONGLET 6 : GESTION DES UTILISATEURS (NOUVEAU)
        ══════════════════════════════════════════════════ */}
        {activeTab === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: T.textMain }}>
                  Comptes Utilisateurs & Éleveurs
                </h2>
                <p style={{ fontSize: '0.8rem', color: T.textMuted, margin: '0.2rem 0 0' }}>
                  Gestion des accès éleveurs, fermes partenaires, techniciens et administrateurs
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: T.textMuted }} />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Nom, email, téléphone…"
                    style={{ padding: '7px 12px 7px 30px', borderRadius: '8px', border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, fontSize: '0.78rem', outline: 'none', width: '200px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {['ALL', 'CLIENT', 'STAFF', 'ADMIN'].map(r => (
                    <button
                      key={r}
                      onClick={() => setUserRoleFilter(r)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: `1px solid ${userRoleFilter === r ? '#b47027' : T.border}`,
                        background: userRoleFilter === r ? '#b47027' : 'transparent',
                        color: userRoleFilter === r ? '#fff' : T.textSub,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {r === 'ALL' ? 'Tous' : r}
                    </button>
                  ))}
                </div>

                <Link
                  href="/admin/utilisateurs/nouveau"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', background: '#b47027', color: '#fff', fontSize: '0.82rem', fontWeight: 700, border: 'none', cursor: 'pointer', textDecoration: 'none' }}
                >
                  <UserPlus size={16} />
                  Créer un Compte
                </Link>
              </div>
            </div>

            <div style={{ background: T.surface, borderRadius: '16px', border: `1px solid ${T.border}`, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: T.bg, borderBottom: `1px solid ${T.border}`, color: T.textMuted }}>
                      <th style={{ padding: '12px 16px' }}>Utilisateur</th>
                      <th style={{ padding: '12px 16px' }}>Type de Compte</th>
                      <th style={{ padding: '12px 16px' }}>Rôle Système</th>
                      <th style={{ padding: '12px 16px' }}>État du Compte</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(u => userRoleFilter === 'ALL' || u.role === userRoleFilter)
                      .filter(u => {
                        const q = userSearch.trim().toLowerCase()
                        if (!q) return true
                        return [u.name, u.email, u.phone].filter(Boolean).some(v => String(v).toLowerCase().includes(q))
                      })
                      .map(user => (
                        <tr key={user.id} style={{ borderBottom: `1px solid ${T.border}` }}>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 700, color: T.textMain }}>{user.name}</div>
                            <div style={{ fontSize: '0.72rem', color: T.textMuted }}>
                              {user.email} • {user.phone || 'Sans tél'}
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: '0.72rem', background: user.userType === 'company' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(107, 114, 128, 0.15)', color: user.userType === 'company' ? '#3b82f6' : T.textSub, fontWeight: 600 }}>
                              {user.companyName ? `🏢 ${user.companyName}` : '👨‍🌾 Éleveur Individuel'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ padding: '3px 9px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 800, background: user.role === 'ADMIN' ? 'rgba(239, 68, 68, 0.15)' : user.role === 'STAFF' ? 'rgba(180, 112, 39, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: user.role === 'ADMIN' ? '#ef4444' : user.role === 'STAFF' ? '#b47027' : '#10b981' }}>
                              {user.role}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ padding: '3px 8px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 700, background: user.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: user.isActive ? '#10b981' : '#ef4444' }}>
                              {user.isActive ? 'Actif' : 'Suspendu'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              <select
                                value={user.role}
                                onChange={e => handleUpdateUserRole(user.id, e.target.value)}
                                style={{ padding: '4px 6px', borderRadius: 6, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, fontSize: '0.72rem' }}
                              >
                                <option value="CLIENT">Client</option>
                                <option value="STAFF">Staff AVS</option>
                                <option value="ADMIN">Direction</option>
                              </select>

                              <button
                                onClick={() => handleToggleUserStatus(user.id)}
                                style={{ padding: '4px 8px', borderRadius: 6, border: `1px solid ${T.border}`, background: 'transparent', color: user.isActive ? '#ef4444' : '#10b981', fontSize: '0.72rem', cursor: 'pointer' }}
                              >
                                {user.isActive ? 'Bloquer' : 'Activer'}
                              </button>

                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer' }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            ONGLET 7 : RENDEZ-VOUS CLINIQUE VÉTÉRINAIRE
        ══════════════════════════════════════════════════ */}
        {activeTab === 'appointments' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: T.textMain }}>Clinique & Suivi Sanitaire</h2>
              <p style={{ fontSize: '0.8rem', color: T.textMuted, margin: '0.2rem 0 0' }}>Consultations au cabinet et urgences vétérinaires 24h/24</p>
            </div>

            <div style={{ background: T.surface, borderRadius: '16px', border: `1px solid ${T.border}`, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: T.bg, borderBottom: `1px solid ${T.border}`, color: T.textMuted }}>
                      <th style={{ padding: '12px 16px' }}>Client</th>
                      <th style={{ padding: '12px 16px' }}>Animal / Élevage</th>
                      <th style={{ padding: '12px 16px' }}>Date</th>
                      <th style={{ padding: '12px 16px' }}>Type</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: T.textMuted }}>
                          Aucun rendez-vous enregistré.
                        </td>
                      </tr>
                    ) : (
                      appointments.map(appt => (
                        <tr key={appt.id} style={{ borderBottom: `1px solid ${T.border}` }}>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 700, color: T.textMain }}>{appt.clientName}</div>
                            <div style={{ fontSize: '0.72rem', color: T.textMuted }}>📞 {appt.clientPhone}</div>
                          </td>
                          <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                            {appt.animalType || 'Cheptel avicole'}
                          </td>
                          <td style={{ padding: '14px 16px', color: T.textMain }}>
                            {new Date(appt.appointmentDate || appt.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ padding: '3px 8px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 700, background: 'rgba(180, 112, 39, 0.15)', color: '#b47027' }}>
                              {appt.serviceType || 'Consultation'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <a
                              href={`https://wa.me/${(appt.clientPhone || '').replace(/[^0-9]/g, '')}?text=Bonjour%20${encodeURIComponent(appt.clientName)}%2C%20Dr%20POUTYA%20d%27Agro%20V%C3%A9to%20Services...`}
                              target="_blank"
                              rel="noreferrer"
                              style={{ padding: '5px 10px', borderRadius: 6, background: '#25D366', color: '#fff', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none' }}
                            >
                              WhatsApp
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            ONGLET 8 : PROSPECTS & DEVIS
        ══════════════════════════════════════════════════ */}
        {activeTab === 'leads' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: T.textMain }}>Leads, Contacts & Devis</h2>
              <p style={{ fontSize: '0.8rem', color: T.textMuted, margin: '0.2rem 0 0' }}>Prospects qualifiés avec scoring automatique pour suivi commercial</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' }}>
              {leads.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: T.textMuted, gridColumn: '1 / -1' }}>
                  Aucun prospect pour le moment.
                </div>
              ) : (
                leads.map(lead => (
                  <div key={lead.id} style={{ padding: '1.4rem', borderRadius: '16px', background: T.surface, border: `1px solid ${T.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: T.textMain }}>{lead.name}</div>
                        <div style={{ fontSize: '0.75rem', color: T.textMuted }}>{lead.email || 'Sans email'}</div>
                      </div>
                      <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: 8, background: lead.status === 'QUALIFIED' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(234, 179, 8, 0.15)', color: lead.status === 'QUALIFIED' ? '#a855f7' : '#eab308', fontWeight: 700 }}>
                        Score: {lead.score || 50}/100 ({lead.status})
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#b47027', marginBottom: '0.4rem' }}>
                      Besoin : {lead.service || 'Accompagnement agropastoral'}
                    </div>

                    <p style={{ fontSize: '0.78rem', color: T.textSub, lineHeight: 1.5, margin: '0 0 1.2rem' }}>
                      "{lead.message || 'Demande de devis et tarifs intrants.'}"
                    </p>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <a
                        href={`https://wa.me/${(lead.phone || '').replace(/[^0-9]/g, '')}?text=Bonjour%20${encodeURIComponent(lead.name)}%2C%20suite%20%C3%A0%20votre%20demande%20sur%20Agro%20V%C3%A9to%20Services...`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ flex: 1, padding: '8px', borderRadius: 8, background: '#25D366', color: '#fff', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                      >
                        Contacter WhatsApp
                      </a>
                      <a
                        href={`tel:${lead.phone}`}
                        style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${T.border}`, color: T.textMain, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Phone size={15} />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── MODAL 4 : ÉDITION PRODUIT ── */}
      {editingProduct && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '520px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: '20px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: T.textMain }}>Modifier le Produit</h3>
              <button onClick={() => setEditingProduct(null)} style={{ background: 'transparent', border: 'none', color: T.textMuted, cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleEditProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Titre du Produit</label>
                <input required type="text" value={editProductForm.title} onChange={e => setEditProductForm(prev => ({ ...prev, title: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Description</label>
                <textarea rows={3} value={editProductForm.description} onChange={e => setEditProductForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Description détaillée du produit..." style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Prix (FCFA)</label>
                  <input required type="number" min="0" value={editProductForm.price} onChange={e => setEditProductForm(prev => ({ ...prev, price: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Prix promo (vide = aucun)</label>
                  <input type="number" min="0" value={editProductForm.promoPrice} onChange={e => setEditProductForm(prev => ({ ...prev, promoPrice: e.target.value }))} placeholder="Optionnel" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Stock</label>
                  <input required type="number" min="0" value={editProductForm.stock} onChange={e => setEditProductForm(prev => ({ ...prev, stock: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Conditionnement</label>
                  <input type="text" value={editProductForm.unit} onChange={e => setEditProductForm(prev => ({ ...prev, unit: e.target.value }))} placeholder="sac 50kg, unité, etc." style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Image (chemin / URL)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <input type="text" value={editProductForm.image} onChange={e => setEditProductForm(prev => ({ ...prev, image: e.target.value }))} placeholder="/images/products/..." style={{ width: '100%', flex: 1, padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
                  <ImageUploadButton folder="avs-produits" onUploaded={(url) => setEditProductForm(prev => ({ ...prev, image: url }))} />
                </div>
                {editProductForm.image && (
                  <div style={{ marginTop: '8px', borderRadius: '10px', overflow: 'hidden', background: T.bg, height: '140px', border: `1px solid ${T.border}` }}>
                    <img src={editProductForm.image} alt="Aperçu produit" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Badge (vide = aucun)</label>
                <input type="text" value={editProductForm.badge} onChange={e => setEditProductForm(prev => ({ ...prev, badge: e.target.value }))} placeholder="Nouveau, Promo, Top vente..." style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
              </div>
              <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: '#b47027', color: '#fff', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}>
                Enregistrer les Modifications
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 5 : ÉDITION FORMATION ── */}
      {editingFormation && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '540px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: '20px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: T.textMain }}>Modifier la Formation</h3>
              <button onClick={() => setEditingFormation(null)} style={{ background: 'transparent', border: 'none', color: T.textMuted, cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleEditFormationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Intitulé de la formation</label>
                <input required type="text" value={editFormationForm.title} onChange={e => setEditFormationForm(prev => ({ ...prev, title: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Catégorie</label>
                  <select value={editFormationForm.category} onChange={e => setEditFormationForm(prev => ({ ...prev, category: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }}>
                    <option value="Santé Animale">Santé Animale</option>
                    <option value="Conduite d'Élevage">Conduite d'Élevage</option>
                    <option value="Hygiène Alimentaire">Hygiène Alimentaire</option>
                    <option value="HACCP & Qualité">HACCP & Qualité</option>
                    <option value="Sécurité au Travail">Sécurité au Travail</option>
                    <option value="Fabrication Détergents">Fabrication Détergents</option>
                    <option value="Cosmétique & Artisanat">Cosmétique & Artisanat</option>
                    <option value="Sur-Mesure & Conseil">Sur-Mesure & Conseil</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Tarif (Texte)</label>
                  <input required type="text" value={editFormationForm.price} onChange={e => setEditFormationForm(prev => ({ ...prev, price: e.target.value }))} placeholder="75 000 FCFA" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Montant (FCFA, calculs)</label>
                  <input required type="number" min="0" value={editFormationForm.priceAmount} onChange={e => setEditFormationForm(prev => ({ ...prev, priceAmount: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Durée</label>
                  <input type="text" value={editFormationForm.duration} onChange={e => setEditFormationForm(prev => ({ ...prev, duration: e.target.value }))} placeholder="5 Jours (30h) - Terrain" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Prochaine Session</label>
                  <input type="text" value={editFormationForm.nextSession} onChange={e => setEditFormationForm(prev => ({ ...prev, nextSession: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Public Cible</label>
                  <input type="text" value={editFormationForm.target} onChange={e => setEditFormationForm(prev => ({ ...prev, target: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Description</label>
                <textarea rows={3} value={editFormationForm.description} onChange={e => setEditFormationForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Présentation détaillée de la formation..." style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Modules / Compétences (1 par ligne)</label>
                <textarea rows={3} value={editFormationForm.modulesCovered} onChange={e => setEditFormationForm(prev => ({ ...prev, modulesCovered: e.target.value }))} placeholder="Module 1&#10;Module 2&#10;Module 3" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Image (chemin / URL)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <input type="text" value={editFormationForm.image} onChange={e => setEditFormationForm(prev => ({ ...prev, image: e.target.value }))} placeholder="/images/..." style={{ width: '100%', flex: 1, padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
                  <ImageUploadButton folder="avs-formations" onUploaded={(url) => setEditFormationForm(prev => ({ ...prev, image: url }))} />
                </div>
                {editFormationForm.image && (
                  <div style={{ marginTop: '8px', borderRadius: '10px', overflow: 'hidden', background: T.bg, height: '140px', border: `1px solid ${T.border}` }}>
                    <img src={editFormationForm.image} alt="Aperçu formation" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
                  </div>
                )}
              </div>
              <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: '#b47027', color: '#fff', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}>
                Enregistrer les Modifications
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
