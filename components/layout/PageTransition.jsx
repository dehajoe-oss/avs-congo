'use client'
/**
 * PageTransition.jsx — Agro Véto Services Congo
 * ─────────────────────────────────────────────────────────
 * Barre de progression ultra-légère en haut d'écran (top-loader).
 * Remplace l'ancien système de 40 blocs DOM clipPath qui retardait
 * la navigation de plus de 500ms.
 * Navigation instantanée sans blocage du thread principal.
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import './PageTransition.css'

const PageTransitionCtx = createContext(null)

export function PageTransitionProvider({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  // Dès que le pathname change, on éteint la barre de progression
  useEffect(() => {
    setLoading(false)
  }, [pathname])

  const runTransition = useCallback((href) => {
    if (!href || href === pathname) return
    setLoading(true)
    router.push(href)
  }, [pathname, router])

  return (
    <PageTransitionCtx.Provider value={runTransition}>
      {/* Barre de progression ultra-rapide en haut d'écran */}
      <div
        className={`aka-top-loader ${loading ? 'is-loading' : ''}`}
        aria-hidden="true"
      />
      {children}
    </PageTransitionCtx.Provider>
  )
}

export function useNavTransition() {
  const ctx = useContext(PageTransitionCtx)
  const router = useRouter()
  if (!ctx) return (href) => router.push(href)
  return ctx
}
