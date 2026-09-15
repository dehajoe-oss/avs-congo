'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/theme'

// ── Bouton flottant clair/sombre pour le back-office ─────────────────────────
// La navbar (qui porte la bascule du site public) est masquée sur /admin* :
// ce bouton circulaire fixe prend le relais sur les pages d'administration.
export default function ThemeToggle() {
  const T = useTheme()
  return (
    <button
      onClick={T.toggle}
      title={T.light ? 'Passer en mode sombre' : 'Passer en mode clair'}
      aria-label={T.light ? 'Passer en mode sombre' : 'Passer en mode clair'}
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 900,
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: T.surface,
        border: `1px solid ${T.border}`,
        color: '#b47027',
        cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
      }}
    >
      {T.light ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}
