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
  Sun,
  Moon,
  Save,
  Trash2,
  Eye,
  Check,
  Building,
  UserCheck,
} from 'lucide-react'
import { useTheme } from '@/lib/theme'
import api from '@/lib/api-client'

export default function AdminClient() {
  const T = useTheme()

  // ── État d'authentification ──
  const [token, setToken] = useState(null)
  const [adminUser, setAdminUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [loginForm, setLoginForm] = useState({
    email: 'admin@agrovetoservices.cg',
    password: '',
  })
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // ── Onglet actif ──
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard' | 'orders' | 'products' | 'appointments' | 'leads'

  // ── Données du Backend ──
  const [dashboardData, setDashboardData] = useState(null)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [appointments, setAppointments] = useState([])
  const [leads, setLeads] = useState([])
  const [loadingData, setLoadingData] = useState(false)
  const [toast, setToast] = useState(null)

  // ── Filtres et Recherche ──
  const [orderFilter, setOrderFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  // ── Formulaire d'ajout de produit ──
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

  const showNotification = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
    setTimeout(() => setToast(null), 3500)
  }

  // ── 1. Vérification session Admin ──
  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('avs_token') : null
    if (savedToken) {
      setToken(savedToken)
      api.auth.me()
        .then(res => {
          const user = res?.data?.user
          if (user && (user.role === 'ADMIN' || user.role === 'STAFF')) {
            setAdminUser(user)
          } else {
            // Pas les droits admin
            setToken(null)
          }
        })
        .catch(() => {
          setToken(null)
        })
        .finally(() => setAuthLoading(false))
    } else {
      setAuthLoading(false)
    }
  }, [])

  // ── 2. Chargement des données ──
  const loadAllData = useCallback(async () => {
    setLoadingData(true)
    try {
      const [dashRes, ordersRes, prodsRes, apptsRes, leadsRes] = await Promise.allSettled([
        api.stats.getDashboard(),
        api.orders.getAll({ limit: 100 }),
        api.products.getAll({ limit: 100 }),
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

  // ── 3. Connexion Admin ──
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
        setLoginError('Réponse invalide du serveur.')
      }
    } catch (err) {
      setLoginError(err.message || 'Identifiants administrateur invalides.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = () => {
    api.auth.logout()
    setToken(null)
    setAdminUser(null)
    setDashboardData(null)
    showNotification('Déconnexion réussie', 'info')
  }

  // ── 4. Actions Commandes ──
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.orders.updateStatus(orderId, { status })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
      showNotification(`Commande mise à jour : ${status}`)
    } catch (err) {
      showNotification(err.message || 'Erreur lors de la mise à jour', 'error')
    }
  }

  // ── 5. Actions Produits & Stocks ──
  const handleUpdateStock = async (productId, delta) => {
    const currentProd = products.find(p => p.id === productId)
    if (!currentProd) return
    const nextStock = Math.max(0, (currentProd.stock || 0) + delta)

    try {
      await api.products.update(productId, { stock: nextStock, inStock: nextStock > 0 })
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: nextStock, inStock: nextStock > 0 } : p))
      showNotification(`Stock ajusté : ${currentProd.title} (${nextStock})`)
    } catch (err) {
      showNotification(err.message || 'Erreur mise à jour stock', 'error')
    }
  }

  const handleCreateProduct = async (e) => {
    e.preventDefault()
    if (!newProduct.title.trim() || !newProduct.price) {
      showNotification('Veuillez remplir le nom et le prix', 'warning')
      return
    }

    try {
      const res = await api.products.create({
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10) || 0,
      })
      if (res?.data) {
        setProducts(prev => [res.data, ...prev])
        setShowAddProduct(false)
        setNewProduct({
          title: '',
          description: '',
          price: '',
          stock: 100,
          unit: 'sac 50kg',
          categorySlug: 'provenderie-nutrition',
          image: '/images/products/aliment-demarrage.jpg',
          badge: 'Nouveau',
        })
        showNotification('Nouveau produit ajouté au catalogue !')
      }
    } catch (err) {
      showNotification(err.message || 'Erreur création produit', 'error')
    }
  }

  // ── 6. Actions Rendez-vous Vétérinaires ──
  const handleUpdateAppointment = async (apptId, status) => {
    try {
      await api.appointments.updateStatus(apptId, status)
      setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, status } : a))
      showNotification(`Rendez-vous mis à jour : ${status}`)
    } catch (err) {
      showNotification(err.message || 'Erreur mise à jour rendez-vous', 'error')
    }
  }

  // ── Écran de chargement initial ──
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.bg, color: T.textMain, fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div className="spinner" style={{ width: 44, height: 44, border: '4px solid rgba(180, 112, 39, 0.2)', borderTopColor: '#b47027', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ fontSize: '0.9rem', color: T.textMuted }}>Connexion au Back-Office AVS...</p>
        </div>
      </div>
    )
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
              Accès réservé à la direction et au personnel autorisé
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
                Identifiant démo préconfiguré : <code>Admin@Avs2026!</code>
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

  // ── Tableau de Bord Administrateur Authentifié ──
  const kpis = dashboardData?.kpis || {
    revenue: orders.filter(o => o.paymentStatus === 'PAID').reduce((sum, o) => sum + o.totalAmount, 0),
    ordersCount: orders.length,
    leadsCount: leads.length,
    qualifiedLeads: leads.filter(l => l.status === 'QUALIFIED').length,
    appointmentsCount: appointments.length,
  }

  const lowStock = dashboardData?.lowStockProducts || products.filter(p => (p.stock || 0) <= 200)

  // Filtrage des commandes
  const filteredOrders = orders.filter(o => {
    const matchStatus = orderFilter === 'ALL' || o.status === orderFilter
    const matchSearch =
      o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone?.includes(searchQuery)
    return matchStatus && matchSearch
  })

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.textMain, fontFamily: "'Poppins', sans-serif" }}>
      {/* ── Toast de notification ── */}
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
                DIRECTION & GESTION
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#10b981' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                API Backend Connectée (Port 5000)
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
            <RefreshCw size={16} className={loadingData ? 'spin-anim' : ''} />
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
          { id: 'appointments', label: 'Rendez-vous Clinique', icon: Calendar, count: appointments.length },
          { id: 'leads', label: 'Leads & Devis', icon: Users, count: leads.length },
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
                transition: 'all 0.2s',
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: 10, background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)', color: isActive ? '#fff' : T.textMuted }}>
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* ── Contenu Principal selon l'onglet ── */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.8rem 1.5rem 4rem' }}>
        
        {/* ══════════════════════════════════════════════════
            ONGLET 1 : TABLEAU DE BORD (VUE D'ENSEMBLE)
        ══════════════════════════════════════════════════ */}
        {activeTab === 'dashboard' && (
          <div>
            {/* 4 KPIs Clés */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1.4rem', borderRadius: '16px', background: T.surface, border: `1px solid ${T.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.78rem', color: T.textMuted, fontWeight: 600 }}>Chiffre d’Affaires Réalisé</span>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={18} />
                  </div>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: T.textMain, letterSpacing: '-0.02em' }}>
                  {Number(kpis.revenue || 0).toLocaleString('fr-FR')} <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#b47027' }}>FCFA</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: T.textSub, marginTop: '0.3rem' }}>
                  Total encaissé (KKiaPay, Vente directe)
                </div>
              </div>

              <div style={{ padding: '1.4rem', borderRadius: '16px', background: T.surface, border: `1px solid ${T.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.78rem', color: T.textMuted, fontWeight: 600 }}>Commandes Traitées</span>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(180, 112, 39, 0.12)', color: '#b47027', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingCart size={18} />
                  </div>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: T.textMain, letterSpacing: '-0.02em' }}>
                  {kpis.ordersCount || 0}
                </div>
                <div style={{ fontSize: '0.72rem', color: T.textSub, marginTop: '0.3rem' }}>
                  Dont {orders.filter(o => o.status === 'PENDING').length} en attente de livraison
                </div>
              </div>

              <div style={{ padding: '1.4rem', borderRadius: '16px', background: T.surface, border: `1px solid ${T.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.78rem', color: T.textMuted, fontWeight: 600 }}>Rendez-vous Vétérinaires</span>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={18} />
                  </div>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: T.textMain, letterSpacing: '-0.02em' }}>
                  {kpis.appointmentsCount || 0}
                </div>
                <div style={{ fontSize: '0.72rem', color: T.textSub, marginTop: '0.3rem' }}>
                  Consultations et suivis de cheptel
                </div>
              </div>

              <div style={{ padding: '1.4rem', borderRadius: '16px', background: T.surface, border: `1px solid ${T.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.78rem', color: T.textMuted, fontWeight: 600 }}>Prospets & Leads Qualifiés</span>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(168, 85, 247, 0.12)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={18} />
                  </div>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: T.textMain, letterSpacing: '-0.02em' }}>
                  {kpis.qualifiedLeads || 0} <span style={{ fontSize: '0.85rem', color: T.textMuted, fontWeight: 500 }}>/ {kpis.leadsCount || 0}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: T.textSub, marginTop: '0.3rem' }}>
                  Scoring automatique d'opportunités
                </div>
              </div>
            </div>

            {/* Alertes de Stock Bas */}
            {lowStock.length > 0 && (
              <div style={{ marginBottom: '2rem', padding: '1.2rem 1.4rem', borderRadius: '16px', background: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#eab308', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                  <AlertTriangle size={18} />
                  <span>Alertes de Stock Bas ({lowStock.length} articles sous le seuil d'alerte)</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.8rem' }}>
                  {lowStock.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 1rem', borderRadius: '10px', background: T.surface, border: `1px solid ${T.border}` }}>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: T.textMain }}>{item.title}</div>
                        <div style={{ fontSize: '0.72rem', color: '#eab308' }}>Stock restant : <strong>{item.stock} {item.unit || 'unités'}</strong></div>
                      </div>
                      <button
                        onClick={() => handleUpdateStock(item.id, 50)}
                        style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', background: '#b47027', color: '#fff', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        +50 Réappro
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deux Colonnes : Commandes récentes & Demandes récentes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {/* Dernières Commandes */}
              <div style={{ padding: '1.4rem', borderRadius: '16px', background: T.surface, border: `1px solid ${T.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: T.textMain }}>Dernières Commandes</h3>
                  <button onClick={() => setActiveTab('orders')} style={{ fontSize: '0.75rem', color: '#b47027', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                    Voir toutes →
                  </button>
                </div>
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: `1px solid ${T.border}` }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: T.textMain }}>{order.orderNumber}</div>
                      <div style={{ fontSize: '0.75rem', color: T.textMuted }}>{order.customerName} · {order.customerPhone}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#b47027' }}>{order.totalAmount?.toLocaleString('fr-FR')} FCFA</div>
                      <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 10, background: order.status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)', color: order.status === 'CONFIRMED' ? '#10b981' : '#eab308', fontWeight: 700 }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Derniers Rendez-vous */}
              <div style={{ padding: '1.4rem', borderRadius: '16px', background: T.surface, border: `1px solid ${T.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: T.textMain }}>Rendez-vous Vétérinaires Récents</h3>
                  <button onClick={() => setActiveTab('appointments')} style={{ fontSize: '0.75rem', color: '#b47027', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                    Gérer la clinique →
                  </button>
                </div>
                {appointments.slice(0, 5).map(appt => (
                  <div key={appt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: `1px solid ${T.border}` }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: T.textMain }}>{appt.clientName || appt.name}</div>
                      <div style={{ fontSize: '0.75rem', color: T.textMuted }}>{appt.animalType || 'Cheptel'} · {appt.reason || 'Consultation'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.78rem', color: T.textMain, fontWeight: 600 }}>{new Date(appt.date || appt.createdAt).toLocaleDateString('fr-FR')}</div>
                      <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 10, background: appt.urgent ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)', color: appt.urgent ? '#ef4444' : '#3b82f6', fontWeight: 700 }}>
                        {appt.urgent ? 'URGENCE 24/7' : appt.status || 'PROGRAMMÉ'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            ONGLET 2 : GESTION DES COMMANDES
        ══════════════════════════════════════════════════ */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: T.textMain }}>Gestion des Commandes</h2>
                <p style={{ fontSize: '0.8rem', color: T.textMuted, margin: '0.2rem 0 0' }}>Suivi des livraisons et validation des paiements KKiaPay / Airtel Money</p>
              </div>

              {/* Barre de recherche et filtres */}
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Rechercher réf, client, tel..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ padding: '8px 12px 8px 34px', borderRadius: '10px', border: `1px solid ${T.border}`, background: T.surface, color: T.textMain, fontSize: '0.85rem' }}
                  />
                  <Search size={15} style={{ position: 'absolute', left: 10, top: 11, color: T.textMuted }} />
                </div>

                <select
                  value={orderFilter}
                  onChange={e => setOrderFilter(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '10px', border: `1px solid ${T.border}`, background: T.surface, color: T.textMain, fontSize: '0.85rem' }}
                >
                  <option value="ALL">Tous les statuts</option>
                  <option value="PENDING">En attente (PENDING)</option>
                  <option value="CONFIRMED">Confirmée (CONFIRMED)</option>
                  <option value="SHIPPED">Expédiée (SHIPPED)</option>
                  <option value="DELIVERED">Livrée (DELIVERED)</option>
                  <option value="CANCELLED">Annulée (CANCELLED)</option>
                </select>
              </div>
            </div>

            {/* Tableau des commandes */}
            <div style={{ background: T.surface, borderRadius: '16px', border: `1px solid ${T.border}`, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ background: T.light ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.02)', borderBottom: `1px solid ${T.border}`, color: T.textMuted }}>
                      <th style={{ padding: '12px 16px' }}>RÉFÉRENCE</th>
                      <th style={{ padding: '12px 16px' }}>CLIENT & CONTACT</th>
                      <th style={{ padding: '12px 16px' }}>LIVRAISON</th>
                      <th style={{ padding: '12px 16px' }}>ARTICLES</th>
                      <th style={{ padding: '12px 16px' }}>MONTANT TOTAL</th>
                      <th style={{ padding: '12px 16px' }}>STATUT</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>ACTIONS RAPIDES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: T.textMuted }}>
                          Aucune commande ne correspond aux filtres sélectionnés.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => (
                        <tr key={order.id} style={{ borderBottom: `1px solid ${T.border}` }}>
                          <td style={{ padding: '14px 16px', fontWeight: 800, color: '#b47027' }}>
                            {order.orderNumber}
                            <div style={{ fontSize: '0.7rem', color: T.textMuted, fontWeight: 400 }}>
                              {new Date(order.createdAt).toLocaleString('fr-FR')}
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 700, color: T.textMain }}>{order.customerName}</div>
                            <a href={`tel:${order.customerPhone}`} style={{ fontSize: '0.75rem', color: '#b47027', textDecoration: 'none' }}>
                              {order.customerPhone}
                            </a>
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: T.textSub }}>
                            {order.customerAddress || 'Retrait au siège'}
                            {order.customerCity && ` (${order.customerCity})`}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontSize: '0.78rem', color: T.textMain }}>
                              {order.items?.map((it, idx) => (
                                <div key={idx}>
                                  {it.quantity}× {it.title}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px', fontWeight: 900, color: T.textMain }}>
                            {order.totalAmount?.toLocaleString('fr-FR')} FCFA
                            <div style={{ fontSize: '0.68rem', color: order.paymentStatus === 'PAID' ? '#10b981' : '#eab308' }}>
                              {order.paymentStatus === 'PAID' ? '✓ Payé' : 'Non payé'}
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: 12,
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              background:
                                order.status === 'DELIVERED' ? 'rgba(16, 185, 129, 0.15)' :
                                order.status === 'SHIPPED' ? 'rgba(59, 130, 246, 0.15)' :
                                order.status === 'CONFIRMED' ? 'rgba(180, 112, 39, 0.15)' :
                                order.status === 'CANCELLED' ? 'rgba(239, 68, 68, 0.15)' :
                                'rgba(234, 179, 8, 0.15)',
                              color:
                                order.status === 'DELIVERED' ? '#10b981' :
                                order.status === 'SHIPPED' ? '#3b82f6' :
                                order.status === 'CONFIRMED' ? '#b47027' :
                                order.status === 'CANCELLED' ? '#ef4444' :
                                '#eab308',
                            }}>
                              {order.status}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                              {order.status !== 'CONFIRMED' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'CONFIRMED')}
                                  title="Confirmer la commande"
                                  style={{ padding: '4px 8px', borderRadius: 6, border: 'none', background: '#b47027', color: '#fff', fontSize: '0.72rem', cursor: 'pointer' }}
                                >
                                  Confirmer
                                </button>
                              )}
                              {order.status !== 'DELIVERED' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'DELIVERED')}
                                  title="Marquer comme livrée"
                                  style={{ padding: '4px 8px', borderRadius: 6, border: 'none', background: '#10b981', color: '#fff', fontSize: '0.72rem', cursor: 'pointer' }}
                                >
                                  Livrée
                                </button>
                              )}
                              {order.status !== 'CANCELLED' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'CANCELLED')}
                                  title="Annuler la commande"
                                  style={{ padding: '4px 8px', borderRadius: 6, border: 'none', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: '0.72rem', cursor: 'pointer' }}
                                >
                                  Annuler
                                </button>
                              )}
                            </div>
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
            ONGLET 3 : GESTION DES PRODUITS & DU STOCK
        ══════════════════════════════════════════════════ */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: T.textMain }}>Catalogue & Gestion des Stocks</h2>
                <p style={{ fontSize: '0.8rem', color: T.textMuted, margin: '0.2rem 0 0' }}>Mise à jour immédiate des prix et disponibilités en base PostgreSQL</p>
              </div>

              <button
                onClick={() => setShowAddProduct(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '9px 18px', borderRadius: '100px', border: 'none', background: '#b47027', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
              >
                <Plus size={16} />
                Ajouter un Produit
              </button>
            </div>

            {/* Modal Ajout Produit */}
            {showAddProduct && (
              <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                <div style={{ width: '100%', maxWidth: '520px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: '20px', padding: '2rem', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 1rem', color: T.textMain }}>Nouveau Produit au Catalogue</h3>
                  <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: T.textMain }}>Nom de l’intrant / produit</label>
                      <input
                        type="text"
                        required
                        value={newProduct.title}
                        onChange={e => setNewProduct(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Ex: Poussins Cobb 500 ou Provende Finition"
                        style={{ width: '100%', padding: '10px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, fontSize: '0.85rem' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: T.textMain }}>Prix (FCFA)</label>
                        <input
                          type="number"
                          required
                          value={newProduct.price}
                          onChange={e => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="650"
                          style={{ width: '100%', padding: '10px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, fontSize: '0.85rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: T.textMain }}>Stock Initial</label>
                        <input
                          type="number"
                          required
                          value={newProduct.stock}
                          onChange={e => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                          placeholder="1000"
                          style={{ width: '100%', padding: '10px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: T.textMain }}>Description</label>
                      <textarea
                        rows={2}
                        value={newProduct.description}
                        onChange={e => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Caractéristiques et recommandations d'élevage..."
                        style={{ width: '100%', padding: '10px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.textMain, fontSize: '0.85rem' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                      <button
                        type="button"
                        onClick={() => setShowAddProduct(false)}
                        style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${T.border}`, background: 'transparent', color: T.textMain, cursor: 'pointer' }}
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#b47027', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Enregistrer
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Grille des produits */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' }}>
              {products.map(p => (
                <div key={p.id} style={{ padding: '1.2rem', borderRadius: '16px', background: T.surface, border: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                      <div>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#b47027', textTransform: 'uppercase' }}>
                          {p.category?.name || 'Intrant AVS'}
                        </span>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: T.textMain, margin: '0.2rem 0 0' }}>
                          {p.title}
                        </h4>
                      </div>
                      <span style={{ fontSize: '0.68rem', padding: '3px 8px', borderRadius: 10, background: p.stock > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: p.stock > 0 ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                        {p.stock > 0 ? 'En Stock' : 'Rupture'}
                      </span>
                    </div>

                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: T.textMain, marginBottom: '0.8rem' }}>
                      {Number(p.promoPrice || p.price).toLocaleString('fr-FR')} FCFA <span style={{ fontSize: '0.75rem', fontWeight: 400, color: T.textMuted }}>/ {p.unit || 'unité'}</span>
                    </div>

                    <p style={{ fontSize: '0.78rem', color: T.textSub, lineHeight: 1.5, margin: '0 0 1.2rem' }}>
                      {p.description?.slice(0, 100)}...
                    </p>
                  </div>

                  {/* Contrôle du Stock */}
                  <div style={{ padding: '0.8rem 1rem', borderRadius: 12, background: T.bg, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: T.textMuted }}>Stock disponible</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 900, color: p.stock <= 200 ? '#eab308' : T.textMain }}>
                        {p.stock} <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>{p.unit || 'unités'}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleUpdateStock(p.id, -10)}
                        title="-10 unités"
                        style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.textMain, fontWeight: 800, cursor: 'pointer' }}
                      >
                        -10
                      </button>
                      <button
                        onClick={() => handleUpdateStock(p.id, +50)}
                        title="+50 unités"
                        style={{ width: 36, height: 32, borderRadius: 8, border: 'none', background: '#b47027', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                      >
                        +50
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            ONGLET 4 : RENDEZ-VOUS VÉTÉRINAIRES
        ══════════════════════════════════════════════════ */}
        {activeTab === 'appointments' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: T.textMain }}>Clinique Vétérinaire 24/7 & Visites de Fermes</h2>
              <p style={{ fontSize: '0.8rem', color: T.textMuted, margin: '0.2rem 0 0' }}>Planning des interventions zootechniques et consultations sous la direction du Dr POUTYA</p>
            </div>

            <div style={{ background: T.surface, borderRadius: '16px', border: `1px solid ${T.border}`, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ background: T.light ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.02)', borderBottom: `1px solid ${T.border}`, color: T.textMuted }}>
                      <th style={{ padding: '12px 16px' }}>CLIENT / ÉLEVEUR</th>
                      <th style={{ padding: '12px 16px' }}>ANIMAL / CHEPTEL</th>
                      <th style={{ padding: '12px 16px' }}>MOTIF / SYMPTÔMES</th>
                      <th style={{ padding: '12px 16px' }}>DATE SOUHAITÉE</th>
                      <th style={{ padding: '12px 16px' }}>URGENCE</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>ACTIONS CLINIQUE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: T.textMuted }}>
                          Aucune demande de consultation vétérinaire enregistrée.
                        </td>
                      </tr>
                    ) : (
                      appointments.map(appt => (
                        <tr key={appt.id} style={{ borderBottom: `1px solid ${T.border}` }}>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 700, color: T.textMain }}>{appt.clientName || appt.name}</div>
                            <a href={`tel:${appt.clientPhone || appt.phone}`} style={{ fontSize: '0.75rem', color: '#b47027', textDecoration: 'none' }}>
                              {appt.clientPhone || appt.phone}
                            </a>
                          </td>
                          <td style={{ padding: '14px 16px', fontWeight: 600, color: T.textMain }}>
                            {appt.animalType || 'Cheptel avicole'}
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: T.textSub, maxWidth: '240px' }}>
                            {appt.reason || appt.notes || 'Visite zootechnique préventive'}
                          </td>
                          <td style={{ padding: '14px 16px', color: T.textMain }}>
                            {new Date(appt.date || appt.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ padding: '3px 8px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 700, background: appt.urgent ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: appt.urgent ? '#ef4444' : '#10b981' }}>
                              {appt.urgent ? 'URGENCE' : 'Standard'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => handleUpdateAppointment(appt.id, 'CONFIRMED')}
                                style={{ padding: '4px 8px', borderRadius: 6, border: 'none', background: '#10b981', color: '#fff', fontSize: '0.72rem', cursor: 'pointer' }}
                              >
                                Confirmer
                              </button>
                              <button
                                onClick={() => handleUpdateAppointment(appt.id, 'COMPLETED')}
                                style={{ padding: '4px 8px', borderRadius: 6, border: 'none', background: '#b47027', color: '#fff', fontSize: '0.72rem', cursor: 'pointer' }}
                              >
                                Fait
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
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            ONGLET 5 : LEADS & OPPORTUNITÉS
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
                      Besoin : {lead.subject || lead.service || 'Accompagnement agropastoral'}
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
    </div>
  )
}
