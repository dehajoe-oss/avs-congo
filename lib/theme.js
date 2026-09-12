'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { flushSync } from 'react-dom'

import { MotionConfig } from 'framer-motion'

const ThemeCtx = createContext({ light: false, toggle: () => {} })

export function ThemeProvider({ children }) {
  const [light, setLight] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('akatech-theme')
    if (saved === 'light') { setLight(true); document.body.classList.add('light-mode') }
  }, [])

  const applyTheme = () => {
    setLight(l => {
      const next = !l
      if (next) document.body.classList.add('light-mode')
      else document.body.classList.remove('light-mode')
      localStorage.setItem('akatech-theme', next ? 'light' : 'dark')
      return next
    })
  }

  // Bascule clair/sombre avec un cercle qui se révèle depuis le bouton cliqué
  // (View Transitions API). Si le navigateur ne supporte pas l'API
  // (Firefox notamment), on retombe simplement sur le switch instantané.
  const toggle = (e) => {
    const supported = typeof document !== 'undefined' && document.startViewTransition

    if (!supported) {
      applyTheme()
      return
    }

    const x = e?.clientX ?? window.innerWidth / 2
    const y = e?.clientY ?? window.innerHeight / 2
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    document.documentElement.style.setProperty('--theme-x', `${x}px`)
    document.documentElement.style.setProperty('--theme-y', `${y}px`)
    document.documentElement.style.setProperty('--theme-radius', `${endRadius}px`)

    document.startViewTransition(() => {
      flushSync(() => applyTheme())
    })
  }

  const T = {
    light,
    bg: light ? 'var(--bg-light)' : 'var(--bg-dark)',
    bgAlt: light ? 'var(--bg-light)' : 'var(--bg-dark)',
    card: light ? 'var(--bg-light-card)' : 'var(--bg-dark-card)',
    textMain: light ? '#111111' : 'rgba(255,255,255,.85)',
    textSub: light ? '#444444' : 'rgba(255,255,255,.5)',
    textMuted: light ? '#888888' : 'rgba(255,255,255,.3)',
    green: light ? '#8c5218' : '#b47027',
    orange: light ? '#8c5218' : '#b47027',
    greenSub: light ? '#9e5f20' : 'rgba(180, 112, 39,.45)',
    orangeSub: light ? '#9e5f20' : 'rgba(180, 112, 39,.45)',
    border: light ? 'rgba(0,0,0,.08)' : 'rgba(180, 112, 39,.14)',
    border2: light ? 'rgba(140, 82, 24,.25)' : 'rgba(180, 112, 39,.26)',
  }

  return (
    <ThemeCtx.Provider value={{ ...T, toggle }}>
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)
