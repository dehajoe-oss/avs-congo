'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import {
  Moon, Sun, ShoppingCart, X, Menu, ArrowRight
} from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useTheme } from '@/lib/theme'
import { useShop } from '@/lib/shopContext'
import TransitionLink from './TransitionLink'
import './StaggeredMenu.css'

const PRIMARY_SERVICES = [
  {
    num: '01',
    label: 'Boutique & Intrants',
    sub: 'Poussins Cobb 500, provenderie & matériel',
    href: '/boutique',
    badge: 'Boutique',
  },
  {
    num: '02',
    label: 'Clinique Vétérinaire',
    sub: 'Soins, chirurgie & urgences 24h/24 & 7j/7',
    href: '/clinique',
    badge: '24h/24',
  },
  {
    num: '03',
    label: 'Nos 3 Domaines d’Activité',
    sub: 'Agro, Véto & Services d\'excellence intégrés',
    href: '/services',
    badge: '3 Domaines',
  },
  {
    num: '04',
    label: 'Formations Ferme-École',
    sub: 'Apprentissage avicole pratique & certifications',
    href: '/formations',
    badge: 'Certifiante',
  },
]

const SECONDARY_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'À Propos d’AVS Congo', href: '/about' },
  { label: 'Réalisations & Partenariats', href: '/projects' },
  { label: 'Blog & Fiches Conseils', href: '/blog' },
  { label: 'Contact & Siège Social', href: '/contact' },
]

export default function StaggeredMenu({ items = [], isActive: externalIsActive, onOpenChange }) {
  const T = useTheme()
  const pathname = usePathname()
  const { cartCount, openCart, currentUser } = useShop()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isActive = useCallback((href) => {
    if (externalIsActive) return externalIsActive(href)
    return href === '/' ? pathname === '/' : pathname.startsWith(href)
  }, [externalIsActive, pathname])

  const closeMenu = useCallback(() => {
    setOpen(false)
    onOpenChange?.(false)
  }, [onOpenChange])

  const toggleMenu = useCallback(() => {
    setOpen(prev => {
      const next = !prev
      onOpenChange?.(next)
      return next
    })
  }, [onOpenChange])

  // Fermeture automatique lors du changement de route
  useEffect(() => {
    closeMenu()
  }, [pathname, closeMenu])

  // Verrouillage du scroll quand le menu est ouvert
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Fermeture avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeMenu])

  // Détection du scroll pour le style glassmorphism du header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleOpenCart = () => {
    closeMenu()
    openCart()
  }

  return (
    <>
      {/* ── Header mobile fixe : épuré, seulement Panier + Menu ── */}
      <header className={'sm-header' + (scrolled ? ' sm-header--scrolled' : '')}>
        <TransitionLink href="/" className="sm-header-logo" onClick={closeMenu} aria-label="Accueil Agro Véto Services">
          <Logo size={19} showTag={false} animate={false} />
        </TransitionLink>

        <div className="sm-header-right">
          {/* Bouton Thème Clair / Sombre */}
          <button
            onClick={T.toggle}
            className="sm-header-theme-btn"
            title={T.light ? 'Mode sombre' : 'Mode clair'}
            type="button"
            aria-label="Basculer le thème"
          >
            {T.light ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Bouton Panier */}
          <button
            onClick={openCart}
            className="sm-header-cart-btn"
            title="Mon Panier AVS"
            type="button"
            aria-label="Ouvrir le panier d'achat"
          >
            <ShoppingCart size={17} />
            {cartCount > 0 && (
              <span className="sm-cart-badge">{cartCount}</span>
            )}
          </button>

          {/* Bouton Menu Toggle */}
          <button
            className={'sm-toggle-btn' + (open ? ' sm-toggle-btn--open' : '')}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            onClick={toggleMenu}
            type="button"
          >
            {open ? <X size={15} /> : <Menu size={15} />}
            <span>{open ? 'Fermer' : 'Menu'}</span>
          </button>
        </div>
      </header>

      {/* ── Drawer & Overlay animé ── */}
      <AnimatePresence>
        {open && (
          <div className="sm-portal-root">
            <motion.div
              key="sm-backdrop"
              className="sm-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={closeMenu}
              aria-hidden="true"
            />

            <motion.aside
              key="sm-drawer"
              id="sm-drawer"
              className="sm-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              aria-label="Menu de navigation"
            >
              {/* Drawer Top Header */}
              <div className="sm-drawer-header">
                <TransitionLink href="/" className="sm-drawer-brand" onClick={closeMenu}>
                  <Logo size={21} showTag={false} animate={false} />
                  <span className="sm-drawer-badge">AVS CONGO</span>
                </TransitionLink>

                <div className="sm-drawer-actions">
                  <button
                    onClick={T.toggle}
                    className="sm-drawer-theme-btn"
                    title={T.light ? 'Mode sombre' : 'Mode clair'}
                    type="button"
                    aria-label="Basculer le thème"
                  >
                    {T.light ? <Moon size={15} /> : <Sun size={15} />}
                  </button>
                  <button
                    type="button"
                    className="sm-drawer-close"
                    onClick={closeMenu}
                    aria-label="Fermer le menu"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="sm-drawer-body">
                {/* ── Accès Rapide : Compte & Panier épuré ── */}
                <div className="sm-quick-row">
                  <TransitionLink
                    href="/mon-compte"
                    className={'sm-quick-pill' + (isActive('/mon-compte') ? ' sm-quick-pill--active' : '') + (currentUser ? ' sm-quick-pill--logged' : '')}
                    onClick={closeMenu}
                  >
                    {currentUser && (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', flexShrink: 0 }} />
                    )}
                    <span className="sm-quick-pill-label">
                      {currentUser ? ((currentUser.fullName || currentUser.name || 'Mon Compte').split(' ')[0]) : 'Mon Compte'}
                    </span>
                  </TransitionLink>

                  <button
                    type="button"
                    className="sm-quick-pill"
                    onClick={handleOpenCart}
                  >
                    <span className="sm-quick-pill-label">Panier</span>
                    <span className="sm-quick-pill-count">{cartCount}</span>
                  </button>
                </div>

                {/* ── Section Pôles Stratégiques ── */}
                <div className="sm-section">
                  <div className="sm-section-label">PÔLES STRATÉGIQUES</div>
                  <div className="sm-services-list">
                    {PRIMARY_SERVICES.map((srv) => {
                      const active = isActive(srv.href)
                      return (
                        <TransitionLink
                          key={srv.href}
                          href={srv.href}
                          className={'sm-service-item' + (active ? ' sm-service-item--active' : '')}
                          onClick={closeMenu}
                        >
                          <span className="sm-service-num">{srv.num}</span>
                          <div className="sm-service-content">
                            <div className="sm-service-top">
                              <span className="sm-service-title">{srv.label}</span>
                              {srv.badge && (
                                <span className="sm-service-badge">{srv.badge}</span>
                              )}
                            </div>
                            <span className="sm-service-sub">{srv.sub}</span>
                          </div>
                        </TransitionLink>
                      )
                    })}
                  </div>
                </div>

                {/* ── Section Entreprise & Informations ── */}
                <div className="sm-section">
                  <div className="sm-section-label">ENTREPRISE & INFORMATIONS</div>
                  <div className="sm-links-list">
                    {SECONDARY_LINKS.map((link) => {
                      const active = isActive(link.href)
                      return (
                        <TransitionLink
                          key={link.href}
                          href={link.href}
                          className={'sm-link-item' + (active ? ' sm-link-item--active' : '')}
                          onClick={closeMenu}
                        >
                          <span className="sm-link-label">{link.label}</span>
                        </TransitionLink>
                      )
                    })}
                  </div>
                </div>

                {/* ── Permanence Vétérinaire ── */}
                <div className="sm-security-card">
                  <div className="sm-security-title">Clinique Vétérinaire 24h/24 & 7j/7</div>
                  <div className="sm-security-sub">Permanence continue & soins d'urgence à Pointe-Noire</div>
                </div>
              </div>

              {/* Drawer Footer Fixé */}
              <div className="sm-drawer-footer">
                <a
                  href="https://wa.me/242069677567"
                  target="_blank"
                  rel="noreferrer"
                  className="sm-whatsapp-cta"
                  onClick={closeMenu}
                >
                  <span>URGENCE & COMMANDE WHATSAPP</span>
                  <ArrowRight size={15} />
                </a>
                <p className="sm-footer-info">
                  Quartier Socoprise, Pointe-Noire · (+242) 06 967 75 67 / 05 633 70 50
                </p>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
