// lib/api-client.js
/**
 * Client API universel pour Agro Véto Services Congo
 * Communique de manière transparente avec le backend Node.js / Express
 */

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
  }
  return process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
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
    register: (data) => request('/api/formations', { method: 'POST', body: JSON.stringify(data) }),
    getAll: () => request('/api/formations'),
    updateStatus: (id, status) => request(`/api/formations/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
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

  // ── Santé du serveur ──
  health: () => request('/api/health'),
}

export default api
