'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import {
  Moon, Sun, ShoppingCart, User, UserCheck, X, Menu,
  ShoppingBag, Stethoscope, Layers, GraduationCap,
  Home, Info, Award, BookOpen, PhoneCall, ArrowRight,
  MessageCircle, ChevronRight, ShieldCheck
} from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useTheme } from '@/lib/theme'
import { useShop } from '@/lib/shopContext'
import TransitionLink from './TransitionLink'
import './StaggeredMenu.css'

const PRIMARY_SERVICES = [
  {
    label: 'Boutique & Intrants',
    sub: 'Poussins Cobb 500, provenderie & matériel',
    href: '/boutique',
    icon: ShoppingBag,
    badge: 'Boutique',
  },
  {
    label: 'Clinique Vétérinaire',
    sub: 'Soins, chirurgie & urgences 24h/24 & 7j/7',
    href: '/clinique',
    icon: Stethoscope,
    badge: '24h/24',
  },
  {
    label: 'Nos 6 Pôles d’Activité',
    sub: 'Santé, nutrition, biosécurité, audits QHSE',
    href: '/services',
    icon: Layers,
    badge: null,
  },
  {
    label: 'Formations Ferme-École',
    sub: 'Apprentissage avicole pratique & certifications',
    href: '/formations',
    icon: GraduationCap,
    badge: 'Certifiante',
  },
]

const SECONDARY_LINKS = [
  { label: 'Accueil', href: '/', icon: Home },
  { label: 'À Propos d’AVS Congo', href: '/about', icon: Info },
  { label: 'Réalisations & Partenariats', href: '/projects', icon: Award },
  { label: 'Blog & Fiches Conseils', href: '/blog', icon: BookOpen },
  { label: 'Contact & Siège Social', href: '/contact', icon: PhoneCall },
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
      {/* ── Header mobile fixe ── */}
      <header className={'sm-header' + (scrolled ? ' sm-header--scrolled' : '')}>
        <TransitionLink href="/" className="sm-header-logo" onClick={closeMenu} aria-label="Accueil Agro Véto Services">
          <Logo size={19} showTag={false} animate={false} />
        </TransitionLink>

        <div className="sm-header-right">
          {/* Bouton Chariot */}
          <button
            onClick={openCart}
            className="sm-header-icon-btn"
            title="Mon Chariot AVS"
            type="button"
            aria-label="Ouvrir le chariot d'achat"
          >
            <ShoppingCart size={16} />
            {cartCount > 0 && (
              <span className="sm-cart-badge">{cartCount}</span>
            )}
          </button>

          {/* Bouton Compte Client */}
          <TransitionLink
            href="/mon-compte"
            className="sm-header-icon-btn"
            title={currentUser ? ('Connecté : ' + currentUser.fullName) : 'Mon Compte Éleveur'}
            aria-label="Mon compte"
            onClick={closeMenu}
          >
            {currentUser ? (
              <UserCheck size={16} style={{ color: '#c47b2d' }} />
            ) : (
              <User size={16} />
            )}
          </TransitionLink>

          {/* Bouton Thème */}
          <button
            onClick={T.toggle}
            className="sm-header-icon-btn"
            title={T.light ? 'Mode sombre' : 'Mode clair'}
            type="button"
            aria-label="Basculer le thème"
          >
            {T.light ? <Moon size={15} /> : <Sun size={15} />}
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
              transition={{ duration: 0.25 }}
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
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              aria-label="Menu de navigation"
            >
              {/* Drawer Top Header */}
              <div className="sm-drawer-header">
                <TransitionLink href="/" className="sm-drawer-brand" onClick={closeMenu}>
                  <Logo size={22} showTag={false} animate={false} />
                  <span className="sm-drawer-badge">AVS CONGO</span>
                </TransitionLink>

                <div className="sm-drawer-actions">
                  <button
                    onClick={T.toggle}
                    className="sm-drawer-icon-btn"
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
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="sm-drawer-body">
                {/* ── Accès Rapide : Compte & Panier ── */}
                <div className="sm-quick-grid">
                  <TransitionLink
                    href="/mon-compte"
                    className={'sm-quick-card' + (isActive('/mon-compte') ? ' sm-quick-card--active' : '')}
                    onClick={closeMenu}
                  >
                    <div className="sm-quick-icon">
                      {currentUser ? <UserCheck size={16} /> : <User size={16} />}
                    </div>
                    <div className="sm-quick-text">
                      <span className="sm-quick-title">{currentUser ? 'Mon Espace' : 'Mon Compte'}</span>
                      <span className="sm-quick-sub">{currentUser ? currentUser.fullName.split(' ')[0] : 'Connexion'}</span>
                    </div>
                  </TransitionLink>

                  <button
                    type="button"
                    className="sm-quick-card"
                    onClick={handleOpenCart}
                  >
                    <div className="sm-quick-icon sm-quick-icon--cart">
                      <ShoppingCart size={16} />
                      {cartCount > 0 && <span className="sm-quick-badge">{cartCount}</span>}
                    </div>
                    <div className="sm-quick-text">
                      <span className="sm-quick-title">Panier</span>
                      <span className="sm-quick-sub">{cartCount > 0 ? (cartCount + ' article(s)') : '0 article'}</span>
                    </div>
                  </button>
                </div>

                {/* ── Section Pôles Clés & Commandes ── */}
                <div className="sm-section">
                  <div className="sm-section-label">PÔLES CLÉS & COMMANDE</div>
                  <div className="sm-services-list">
                    {PRIMARY_SERVICES.map((srv) => {
                      const Icon = srv.icon
                      const active = isActive(srv.href)
                      return (
                        <TransitionLink
                          key={srv.href}
                          href={srv.href}
                          className={'sm-service-item' + (active ? ' sm-service-item--active' : '')}
                          onClick={closeMenu}
                        >
                          <div className="sm-service-icon-box">
                            <Icon size={18} />
                          </div>
                          <div className="sm-service-content">
                            <div className="sm-service-top">
                              <span className="sm-service-title">{srv.label}</span>
                              {srv.badge && (
                                <span className="sm-service-badge">{srv.badge}</span>
                              )}
                            </div>
                            <span className="sm-service-sub">{srv.sub}</span>
                          </div>
                          <ChevronRight size={16} className="sm-service-arrow" />
                        </TransitionLink>
                      )
                    })}
                  </div>
                </div>

                {/* ── Section Découvrir le Complexe ── */}
                <div className="sm-section">
                  <div className="sm-section-label">DÉCOUVRIR LE COMPLEXE</div>
                  <div className="sm-links-list">
                    {SECONDARY_LINKS.map((link) => {
                      const Icon = link.icon
                      const active = isActive(link.href)
                      return (
                        <TransitionLink
                          key={link.href}
                          href={link.href}
                          className={'sm-link-item' + (active ? ' sm-link-item--active' : '')}
                          onClick={closeMenu}
                        >
                          <div className="sm-link-left">
                            <Icon size={16} className="sm-link-icon" />
                            <span className="sm-link-label">{link.label}</span>
                          </div>
                          <ChevronRight size={14} className="sm-link-arrow" />
                        </TransitionLink>
                      )
                    })}
                  </div>
                </div>

                {/* ── Bloc Urgences & Sécurité ── */}
                <div className="sm-security-card">
                  <ShieldCheck size={18} className="sm-security-icon" />
                  <div>
                    <div className="sm-security-title">Clinique Vétérinaire 24h/24 & 7j/7</div>
                    <div className="sm-security-sub">Prise en charge immédiate à Pointe-Noire</div>
                  </div>
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
                  <MessageCircle size={18} />
                  <span>URGENCE & COMMANDE WHATSAPP</span>
                  <ArrowRight size={16} />
                </a>
                <p className="sm-footer-info">
                  Quartier Socoprise, Pointe-Noire · +242 06 967 75 67 / +242 05 633 70 50
                </p>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
