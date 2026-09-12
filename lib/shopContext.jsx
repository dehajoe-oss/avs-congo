'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '@/lib/api-client'

const ShopContext = createContext(null)

const CART_STORAGE_KEY = 'avs_cart'
const USER_STORAGE_KEY = 'avs_user'
const ORDERS_STORAGE_KEY = 'avs_orders'

export function ShopProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [orders, setOrders] = useState([])
  const [toast, setToast] = useState(null)

  // Initialisation depuis localStorage au montage côté client
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) setCartItems(JSON.parse(savedCart))

      const savedUser = localStorage.getItem(USER_STORAGE_KEY)
      if (savedUser) setCurrentUser(JSON.parse(savedUser))

      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY)
      if (savedOrders) setOrders(JSON.parse(savedOrders))
    } catch (e) {
      console.warn('Erreur lecture localStorage', e)
    }
  }, [])

  // Persistance du panier
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
    } catch {}
  }, [cartItems])

  // Persistance de l'utilisateur
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser))
      } else {
        localStorage.removeItem(USER_STORAGE_KEY)
      }
    } catch {}
  }, [currentUser])

  // Persistance des commandes
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
    } catch {}
  }, [orders])

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
    setTimeout(() => {
      setToast(null)
    }, 3500)
  }, [])

  // Actions Panier
  const addToCart = useCallback((product, qty = 1) => {
    const quantity = Math.max(1, qty)
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
    showToast(`"${product.name}" ajouté au panier !`, 'success')
  }, [showToast])

  const updateQuantity = useCallback((productId, delta) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.id === productId) {
            const next = item.quantity + delta
            return next > 0 ? { ...item, quantity: next } : null
          }
          return item
        })
        .filter(Boolean)
    )
  }, [])

  const removeFromCart = useCallback((productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
    showToast('Article retiré du panier', 'info')
  }, [showToast])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Actions Auth
  const login = useCallback((userData, token) => {
    setCurrentUser(userData)
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('avs_token', token)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
    }
    const displayName = userData.fullName || userData.name || 'Client AVS'
    showToast(`Bienvenue, ${displayName} !`, 'success')
  }, [showToast])

  const logout = useCallback(() => {
    setCurrentUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('avs_token')
      localStorage.removeItem(USER_STORAGE_KEY)
    }
    showToast('Vous êtes déconnecté', 'info')
  }, [showToast])

  // Synchronisation des commandes depuis le serveur backend
  const refreshOrders = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('avs_token') : null
      if (token) {
        const data = await api.orders.getMyOrders()
        if (data?.data) {
          setOrders(data.data)
          return
        }
      }
      if (currentUser?.phone) {
        const res = await fetch(`/api/orders?phone=${encodeURIComponent(currentUser.phone)}`)
        const data = await res.json()
        if (data.orders) {
          setOrders(data.orders)
        }
      }
    } catch (err) {
      console.warn('[Shop] Erreur chargement commandes:', err.message)
    }
  }, [currentUser])

  // Vérification de validité de session au démarrage
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('avs_token') : null
    if (token) {
      api.auth.me()
        .then(res => {
          if (res?.data?.user) {
            setCurrentUser(res.data.user)
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data.user))
          }
        })
        .catch(() => {
          // Token expiré ou invalide
          if (typeof window !== 'undefined') {
            localStorage.removeItem('avs_token')
          }
        })
    }
  }, [])

  useEffect(() => {
    if (currentUser) {
      refreshOrders()
    }
  }, [currentUser, refreshOrders])

  const addLocalOrder = useCallback((order) => {
    setOrders(prev => [order, ...prev.filter(o => o.id !== order.id)])
  }, [])

  return (
    <ShopContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartTotal,
      cartCount,
      isCartOpen,
      setIsCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      currentUser,
      login,
      logout,
      isAuthModalOpen,
      setIsAuthModalOpen,
      openAuthModal: () => setIsAuthModalOpen(true),
      closeAuthModal: () => setIsAuthModalOpen(false),
      orders,
      refreshOrders,
      addLocalOrder,
      toast,
      showToast,
    }}>
      {children}
    </ShopContext.Provider>
  )
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) {
    throw new Error('useShop doit être utilisé à l’intérieur de ShopProvider')
  }
  return ctx
}
