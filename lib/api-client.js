// lib/api-client.js
/**
 * Client API universel pour Agro Véto Services Congo
 * Communique de manière transparente avec le backend Node.js / Express
 */

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_BACKEND_URL || 'https://avs-backend-q4uo.onrender.com'
  }
  return process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://avs-backend-q4uo.onrender.com'
}

/**
 * Wrapper de requête HTTP sécurisé
 */
async function request(endpoint, options = {}) {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  // Injection automatique du token JWT en environnement client
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('avs_token')
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    })

    const contentType = res.headers.get('content-type')
    const data = contentType && contentType.includes('application/json')
      ? await res.json()
      : { message: await res.text() }

    if (!res.ok) {
      // Session expirée ou révoquée : purge locale + retour connexion
      // (style AFI : auto-logout centralisé sur 401, sans boucle sur /connexion).
      if (res.status === 401 && typeof window !== 'undefined' && localStorage.getItem('avs_token')) {
        localStorage.removeItem('avs_token')
        localStorage.removeItem('avs_user')
        if (!window.location.pathname.startsWith('/connexion')) {
          window.location.href = `/connexion?redirect=${encodeURIComponent(window.location.pathname)}`
        }
      }
      throw new Error(data.message || `Erreur HTTP ${res.status}`)
    }

    return data
  } catch (err) {
    console.error(`[AVS API Error] ${endpoint}:`, err.message)
    throw err
  }
}

export const api = {
  // ── Authentification ──
  auth: {
    login: (credentials) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    verifyEmail: (token) => request('/api/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) }),
    resendVerification: (identifier) => request('/api/auth/resend-verification', { method: 'POST', body: JSON.stringify({ identifier, email: identifier }) }),
    forgotPassword: (identifier) => request('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ identifier }) }),
    resetPassword: (token, password) => request('/api/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),
    me: () => request('/api/auth/me'),
    updateProfile: (data) => request('/api/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
    updatePassword: (data) => request('/api/auth/password', { method: 'PUT', body: JSON.stringify(data) }),
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('avs_token')
        localStorage.removeItem('avs_user')
      }
    },
  },

  // ── Catalogue Produits & Catégories ──
  products: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString()
      return request(`/api/products${query ? `?${query}` : ''}`)
    },
    getBySlug: (slug) => request(`/api/products/${slug}`),
    getCategories: () => request('/api/products/categories'),
    create: (data) => request('/api/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/api/products/${id}`, { method: 'DELETE' }),
  },

  // ── Commandes & Livraisons ──
  orders: {
    create: (orderData) => request('/api/orders', { method: 'POST', body: JSON.stringify(orderData) }),
    track: (orderNumber) => request(`/api/orders/track/${encodeURIComponent(orderNumber)}`),
    getMyOrders: () => request('/api/orders/my-orders'),
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString()
      return request(`/api/orders${query ? `?${query}` : ''}`)
    },
    updateStatus: (id, statusData) => request(`/api/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify(statusData) }),
  },

  // ── Paiements (KKiaPay & Mobile Money) ──
  payments: {
    verifyKKiaPay: (data) => request('/api/payments/kkiapay/verify', { method: 'POST', body: JSON.stringify(data) }),
    initiateMoMo: (data) => request('/api/payments/momo/initiate', { method: 'POST', body: JSON.stringify(data) }),
  },

  // ── Clinique Vétérinaire ──
  appointments: {
    create: (data) => request('/api/appointments', { method: 'POST', body: JSON.stringify(data) }),
    getAll: () => request('/api/appointments'),
    updateStatus: (id, status) => request(`/api/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },

  // ── Formations Ferme-École ──
  formations: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString()
      return request(`/api/formations${query ? `?${query}` : ''}`)
    },
    getBySlug: (slug) => request(`/api/formations/${slug}`),
    create: (data) => request('/api/formations/create', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/api/formations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/api/formations/${id}`, { method: 'DELETE' }),
    register: (data) => request('/api/formations/register', { method: 'POST', body: JSON.stringify(data) }),
    getRegistrations: (params = {}) => {
      const query = new URLSearchParams(params).toString()
      return request(`/api/formations/registrations${query ? `?${query}` : ''}`)
    },
    updateRegistrationStatus: (id, statusData) => request(`/api/formations/registrations/${id}/status`, { method: 'PATCH', body: JSON.stringify(statusData) }),
  },

  // ── Témoignages & Avis Clients ──
  testimonials: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString()
      return request(`/api/testimonials${query ? `?${query}` : ''}`)
    },
    getAllAdmin: (params = {}) => {
      const query = new URLSearchParams(params).toString()
      return request(`/api/testimonials/admin${query ? `?${query}` : ''}`)
    },
    create: (data) => request('/api/testimonials', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/api/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    toggleApproval: (id, isApproved) => request(`/api/testimonials/${id}/approve`, { method: 'PATCH', body: JSON.stringify({ isApproved }) }),
    delete: (id) => request(`/api/testimonials/${id}`, { method: 'DELETE' }),
  },

  // ── Gestion des Utilisateurs (Admin) ──
  users: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString()
      return request(`/api/users${query ? `?${query}` : ''}`)
    },
    getById: (id) => request(`/api/users/${id}`),
    create: (data) => request('/api/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    toggleStatus: (id) => request(`/api/users/${id}/status`, { method: 'PATCH' }),
    delete: (id) => request(`/api/users/${id}`, { method: 'DELETE' }),
  },

  // ── Contact, Leads & Devis ──
  contact: {
    send: (data) => request('/api/contact', { method: 'POST', body: JSON.stringify(data) }),
  },
  leads: {
    create: (data) => request('/api/leads', { method: 'POST', body: JSON.stringify(data) }),
    getAll: () => request('/api/leads'),
    updateStatus: (id, status) => request(`/api/leads/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },

  // ── Factures ──
  invoices: {
    create: (data) => request('/api/invoices', { method: 'POST', body: JSON.stringify(data) }),
    getAll: () => request('/api/invoices'),
    getById: (id) => request(`/api/invoices/${id}`),
    updateStatus: (id, status) => request(`/api/invoices/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },

  // ── Statistiques Dashboard & Tracking ──
  stats: {
    getDashboard: () => request('/api/stats/dashboard'),
    trackPageView: (data) => request('/api/stats/track', { method: 'POST', body: JSON.stringify(data) }),
  },

  // ── Téléversement d'images (FormData, max 10 Mo côté backend) ──
  uploads: {
    image: async (file, folder = 'avs-uploads') => {
      const baseUrl = getBaseUrl()
      const url = `${baseUrl.replace(/\/+$/, '')}/api/uploads/image`
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', folder)
      const headers = {}
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('avs_token')
        if (token) headers['Authorization'] = `Bearer ${token}`
      }
      const res = await fetch(url, { method: 'POST', headers, body: fd })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data.success === false) {
        throw new Error(data.message || `Échec de l'envoi (${res.status})`)
      }
      return data
    },
  },

  // ── Santé du serveur ──
  health: () => request('/api/health'),
}

export default api
