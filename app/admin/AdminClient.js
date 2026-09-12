'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
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
  X,
} from 'lucide-react'
import { useTheme } from '@/lib/theme'
import api from '@/lib/api-client'

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
  const [activeTab, setActiveTab] = useState('dashboard')

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

  // ── Modals & Formulaires ──
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    stock: 100,
    unit: 'sac 50kg',
    categorySlug: 'provenderie-nutrition',
    image: '/images/products/aliment-demarrage.jpg',
    badge: 'Nouveau',
  })

  const [showAddFormation, setShowAddFormation] = useState(false)
  const [newFormation, setNewFormation] = useState({
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
  })

  const [showAddTestimonial, setShowAddTestimonial] = useState(false)
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    role: 'Éleveur Avicole',
    project: 'Poussins & Provenderie',
    rating: 5,
    text: '',
    result: '↑ Mortalité réduite',
    img: '',
    isApproved: true,
  })

  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'CLIENT',
    userType: 'individual',
    companyName: '',
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

  const handleAddProductSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.products.create({
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
      })
      if (res?.data) {
        setProducts(prev => [res.data, ...prev])
        setShowAddProduct(false)
        showNotification(`Produit "${res.data.title}" créé avec succès`)
      }
    } catch (err) {
      showNotification(err.message || 'Erreur création produit', 'error')
    }
  }

  // ── 6. Actions Formations ──
  const handleCreateFormationSubmit = async (e) => {
    e.preventDefault()
    try {
      const modulesArr = newFormation.modulesCovered
        ? newFormation.modulesCovered.split('\n').filter(Boolean)
        : []

      const res = await api.formations.create({
        ...newFormation,
        priceAmount: Number(newFormation.priceAmount) || 0,
        modulesCovered: modulesArr,
      })

      if (res?.data) {
        setFormations(prev => [res.data, ...prev])
        setShowAddFormation(false)
        setNewFormation({
          title: '',
          category: 'Santé Animale',
          duration: '4 Jours (24h) - Terrain',
          price: '70 000 FCFA',
          priceAmount: 70000,
          target: '',
          nextSession: 'Sessions bimensuelles',
          description: '',
          modulesCovered: '',
          image: '/images/ferme_ecole_avicole_1789164251928.jpg',
        })
        showNotification(`Formation "${res.data.title}" ajoutée au catalogue AVS`)
      }
    } catch (err) {
      showNotification(err.message || 'Erreur création formation', 'error')
    }
  }

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
  const handleCreateTestimonialSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.testimonials.create({
        ...newTestimonial,
        rating: Number(newTestimonial.rating) || 5,
        isApproved: true,
      })
      if (res?.data) {
        setTestimonials(prev => [res.data, ...prev])
        setShowAddTestimonial(false)
        setNewTestimonial({
          name: '',
          role: 'Éleveur Avicole',
          project: 'Poussins & Provenderie',
          rating: 5,
          text: '',
          result: '↑ Mortalité réduite',
          img: '',
          isApproved: true,
        })
        showNotification('Témoignage publié avec succès')
      }
    } catch (err) {
      showNotification(err.message || 'Erreur publication avis', 'error')
    }
  }

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
  const handleCreateUserSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.users.create(newUser)
      if (res?.data) {
        setUsers(prev => [res.data, ...prev])
        setShowAddUser(false)
        setNewUser({
          name: '',
          email: '',
          phone: '',
          password: '',
          role: 'CLIENT',
          userType: 'individual',
          companyName: '',
        })
        showNotification(`Utilisateur ${res.data.name} créé avec succès`)
      }
    } catch (err) {
      showNotification(err.message || 'Erreur création utilisateur', 'error')
    }
  }

  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await api.users.toggleStatus(userId)
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, isActive: res.data.isActive } : u)))
      showNotification(res.message || 'Statut utilisateur mis à jour')
    } catch (err) {
      showNotification(err.message || 'Erreur statut utilisateur', 'error')
    }
  }

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await api.users.update(userId, { role: newRole })
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: newRole } : u)))
      showNotification(`Rôle modifié : ${newRole}`)
    } catch (err) {
      showNotification('Erreur mise à jour rôle', 'error')
    }
  }

  const handleDeleteUser = async (userId) => {
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
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#b47027', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900 }}>
              AVS
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

              <button
                onClick={() => setShowAddProduct(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', background: '#b47027', color: '#fff', fontSize: '0.82rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
              >
                <Plus size={16} />
                Nouveau Produit
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
              {products.map(prod => (
                <div key={prod.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: '16px', padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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

                <button
                  onClick={() => setShowAddFormation(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', background: '#b47027', color: '#fff', fontSize: '0.82rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  <Plus size={16} />
                  Nouvelle Formation
                </button>
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

              <button
                onClick={() => setShowAddTestimonial(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', background: '#b47027', color: '#fff', fontSize: '0.82rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
              >
                <Plus size={16} />
                Ajouter un Témoignage
              </button>
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

              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
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

                <button
                  onClick={() => setShowAddUser(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', background: '#b47027', color: '#fff', fontSize: '0.82rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  <UserPlus size={16} />
                  Créer un Compte
                </button>
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

      {/* ── MODAL 1 : AJOUT PRODUIT ── */}
      {showAddProduct && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '500px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: '20px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: T.textMain }}>Nouveau Produit au Catalogue</h3>
              <button onClick={() => setShowAddProduct(false)} style={{ background: 'transparent', border: 'none', color: T.textMuted, cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Titre du Produit</label>
                <input required type="text" value={newProduct.title} onChange={e => setNewProduct(prev => ({ ...prev, title: e.target.value }))} placeholder="Ex: Aliment Pondeuse Sac 50kg" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Prix unitaire (FCFA)</label>
                <input required type="number" value={newProduct.price} onChange={e => setNewProduct(prev => ({ ...prev, price: e.target.value }))} placeholder="Ex: 21500" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Stock Initial</label>
                  <input required type="number" value={newProduct.stock} onChange={e => setNewProduct(prev => ({ ...prev, stock: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Conditionnement</label>
                  <input required type="text" value={newProduct.unit} onChange={e => setNewProduct(prev => ({ ...prev, unit: e.target.value }))} placeholder="sac 50kg, unité, etc." style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
                </div>
              </div>
              <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: '#b47027', color: '#fff', fontWeight: 700, cursor: 'pointer', marginTop: '1rem' }}>
                Enregistrer le Produit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2 : NOUVELLE FORMATION ── */}
      {showAddFormation && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '520px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: '20px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: T.textMain }}>Nouvelle Formation Certifiante</h3>
              <button onClick={() => setShowAddFormation(false)} style={{ background: 'transparent', border: 'none', color: T.textMuted, cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateFormationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Intitulé de la formation</label>
                <input required type="text" value={newFormation.title} onChange={e => setNewFormation(prev => ({ ...prev, title: e.target.value }))} placeholder="Ex: Conduite Pratique de l'Élevage Porcin" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Catégorie</label>
                  <select value={newFormation.category} onChange={e => setNewFormation(prev => ({ ...prev, category: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }}>
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
                  <input required type="text" value={newFormation.price} onChange={e => setNewFormation(prev => ({ ...prev, price: e.target.value }))} placeholder="75 000 FCFA" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Durée</label>
                  <input required type="text" value={newFormation.duration} onChange={e => setNewFormation(prev => ({ ...prev, duration: e.target.value }))} placeholder="5 Jours (30h) - Terrain" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Prochaine Session</label>
                  <input required type="text" value={newFormation.nextSession} onChange={e => setNewFormation(prev => ({ ...prev, nextSession: e.target.value }))} placeholder="Sessions bimensuelles" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Public Cible</label>
                <input type="text" value={newFormation.target} onChange={e => setNewFormation(prev => ({ ...prev, target: e.target.value }))} placeholder="Éleveurs, techniciens, entrepreneurs" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Modules / Compétences (1 par ligne)</label>
                <textarea rows={3} value={newFormation.modulesCovered} onChange={e => setNewFormation(prev => ({ ...prev, modulesCovered: e.target.value }))} placeholder="Module 1&#10;Module 2&#10;Module 3" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, resize: 'vertical' }} />
              </div>
              <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: '#b47027', color: '#fff', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}>
                Créer la Formation AVS
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 3 : AJOUT TÉMOIGNAGE ── */}
      {showAddTestimonial && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '480px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: '20px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: T.textMain }}>Nouveau Témoignage Éleveur</h3>
              <button onClick={() => setShowAddTestimonial(false)} style={{ background: 'transparent', border: 'none', color: T.textMuted, cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateTestimonialSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Nom du client / Éleveur</label>
                <input required type="text" value={newTestimonial.name} onChange={e => setNewTestimonial(prev => ({ ...prev, name: e.target.value }))} placeholder="Ex: Jean-Paul Moukoko" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Rôle ou Ferme</label>
                <input required type="text" value={newTestimonial.role} onChange={e => setNewTestimonial(prev => ({ ...prev, role: e.target.value }))} placeholder="Gérant · Ferme Avicole du Kouilou" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Projet / Prestation</label>
                  <input required type="text" value={newTestimonial.project} onChange={e => setNewTestimonial(prev => ({ ...prev, project: e.target.value }))} placeholder="Poussins & Provenderie" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Badge Résultat</label>
                  <input type="text" value={newTestimonial.result} onChange={e => setNewTestimonial(prev => ({ ...prev, result: e.target.value }))} placeholder="↑ Mortalité réduite à 1.6%" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Commentaire / Avis</label>
                <textarea required rows={4} value={newTestimonial.text} onChange={e => setNewTestimonial(prev => ({ ...prev, text: e.target.value }))} placeholder="Retour d'expérience détaillé sur les services d'Agro Véto Services..." style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, resize: 'vertical' }} />
              </div>
              <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: '#b47027', color: '#fff', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}>
                Publier le Témoignage
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 4 : CRÉATION UTILISATEUR ── */}
      {showAddUser && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '480px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: '20px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: T.textMain }}>Créer un Compte Utilisateur</h3>
              <button onClick={() => setShowAddUser(false)} style={{ background: 'transparent', border: 'none', color: T.textMuted, cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Nom complet</label>
                <input required type="text" value={newUser.name} onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))} placeholder="Ex: Paul Ngoma" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Email</label>
                  <input required type="email" value={newUser.email} onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))} placeholder="paul@ferme.cg" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Téléphone</label>
                  <input required type="tel" value={newUser.phone} onChange={e => setNewUser(prev => ({ ...prev, phone: e.target.value }))} placeholder="+242 06 123 45 67" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Rôle Système</label>
                  <select value={newUser.role} onChange={e => setNewUser(prev => ({ ...prev, role: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }}>
                    <option value="CLIENT">Client / Éleveur</option>
                    <option value="STAFF">Staff Technique</option>
                    <option value="ADMIN">Direction Générale</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Type de structure</label>
                  <select value={newUser.userType} onChange={e => setNewUser(prev => ({ ...prev, userType: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }}>
                    <option value="individual">Éleveur Individuel</option>
                    <option value="company">Ferme / Entreprise</option>
                  </select>
                </div>
              </div>
              {newUser.userType === 'company' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Nom de la Ferme / Entreprise</label>
                  <input type="text" value={newUser.companyName} onChange={e => setNewUser(prev => ({ ...prev, companyName: e.target.value }))} placeholder="Ferme Avicole Espoir" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Mot de passe initial</label>
                <input required type="password" value={newUser.password} onChange={e => setNewUser(prev => ({ ...prev, password: e.target.value }))} placeholder="Au moins 6 caractères" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain }} />
              </div>
              <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: '#b47027', color: '#fff', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}>
                Créer l'Utilisateur
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
