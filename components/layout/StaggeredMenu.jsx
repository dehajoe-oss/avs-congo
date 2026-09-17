'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  ShoppingCart,
  Moon,
  Sun,
  User,
  LogIn,
  LogOut,
  ChevronRight,
  Stethoscope,
  ShoppingBag,
  Layers,
  GraduationCap,
  Home,
  Award,
  FileText,
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Building2,
  X,
} from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { useShop } from '@/lib/shopContext'
import TransitionLink from './TransitionLink'
import './StaggeredMenu.css'

/* ── Pôles Stratégiques AVS Congo (Grille 2x2 Professionnelle — Zéro Badge) ── */
const STRATEGIC_POLES = [
  {
    icon: ShoppingBag,
    title: 'Boutique & Intrants',
    desc: 'Poussins Cobb 500, provenderie & matériel',
    href: '/boutique',
  },
  {
    icon: Stethoscope,
    title: 'Clinique Vétérinaire',
    desc: 'Soins, chirurgie & urgences 24/7',
    href: '/clinique',
  },
  {
    icon: Layers,
    title: 'Nos 3 Domaines',
    desc: 'Agro, Véto & Services intégrés',
    href: '/services',
  },
  {
    icon: GraduationCap,
    title: 'Formations Ferme-École',
    desc: 'Aviculture pratique & certificats',
    href: '/formations',
  },
]

/* ── Liens de navigation principale (Icônes Professionnelles) ── */
const MAIN_NAV_LINKS = [
  { label: 'Accueil', href: '/', icon: Home },
  { label: 'À Propos d’AVS Congo', href: '/about', icon: Building2, desc: 'Direction Dr POUTYA & Mission' },
  { label: 'Réalisations & Partenariats', href: '/projects', icon: Award, desc: 'Cas clients & Fermes suivies' },
  { label: 'Blog & Fiches Conseils', href: '/blog', icon: FileText, desc: 'Guides d’élevage & biosécurité' },
  { label: 'Contact & Siège Social', href: '/contact', icon: MapPin, desc: 'Quartier Socoprise, Pointe-Noire' },
]

export default function StaggeredMenu({ isActive: externalIsActive, onOpenChange }) {
  const T = useTheme()
  const pathname = usePathname()
  const { cartCount, openCart, currentUser, logout } = useShop()
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

  // Fermeture automatique lors d'un changement de route
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

  // Détection du scroll pour effet de surface sur le header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 25)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleOpenCart = () => {
    closeMenu()
    openCart()
  }

  const handleLogout = () => {
    logout()
    closeMenu()
  }

  const displayName = currentUser?.fullName || currentUser?.name || 'Client'
  const firstName = displayName.split(' ')[0]

  return (
    <>
      {/* ═════════════════════════════════════════════════════════════
          1. HEADER MOBILE FIXE (60px — Épuré, Élégant, Pro)
          ═════════════════════════════════════════════════════════════ */}
      <header className={`sm-header ${scrolled ? 'sm-header--scrolled' : ''}`}>
        {/* Identité de Marque (Logo uniquement) */}
        <TransitionLink
          href="/"
          className="sm-header-brand"
          onClick={closeMenu}
          aria-label="Agro Véto Services Congo — Accueil"
        >
          <div className="sm-header-logo-box">
            <Image
              src="/images/logo.webp"
              alt="Logo Agro Véto Services"
              width={40}
              height={42}
              priority
              className="sm-header-logo-img"
            />
          </div>
        </TransitionLink>

        {/* Actions à Droite : Thème + Panier + Profil + Menu */}
        <div className="sm-header-actions">
          {/* Bascule Thème Clair / Sombre */}
          <button
            onClick={T.toggle}
            className="sm-icon-btn sm-theme-btn"
            title={T.light ? 'Passer en mode sombre' : 'Passer en mode clair'}
            type="button"
            aria-label="Basculer le thème"
          >
            {T.light ? <Moon size={17} strokeWidth={1.75} /> : <Sun size={17} strokeWidth={1.75} />}
          </button>

          {/* Bouton Panier */}
          <button
            onClick={handleOpenCart}
            className="sm-icon-btn sm-cart-btn"
            title="Mon Panier AVS"
            type="button"
            aria-label={`Panier d'achat, ${cartCount} articles`}
          >
            <ShoppingCart size={18} strokeWidth={1.75} />
            {cartCount > 0 && (
              <span className="sm-cart-count">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* Bouton Compte Client */}
          {currentUser ? (
            <TransitionLink
              href="/mon-compte"
              className="sm-icon-btn sm-user-btn sm-user-btn--logged"
              title={`Connecté : ${displayName}`}
              aria-label={`Mon Compte : ${displayName}`}
              onClick={closeMenu}
            >
              <div className="sm-user-avatar-wrap">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt=""
                    className="sm-user-avatar-img"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                ) : (
                  <span className="sm-user-avatar-initial">
                    {firstName.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="sm-online-pip" />
              </div>
            </TransitionLink>
          ) : (
            <TransitionLink
              href="/connexion"
              className="sm-icon-btn sm-user-btn sm-user-btn--guest"
              title="Connexion à l'espace client"
              aria-label="Connexion à l'espace client"
              onClick={closeMenu}
            >
              <User size={18} strokeWidth={1.75} />
            </TransitionLink>
          )}

          {/* Bouton Hamburger Pro Animé */}
          <button
            onClick={toggleMenu}
            className={`sm-hamburger-btn ${open ? 'sm-hamburger-btn--open' : ''}`}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu de navigation'}
            aria-expanded={open}
            type="button"
          >
            <span className="sm-hamburger-bar sm-hamburger-bar--top" />
            <span className="sm-hamburger-bar sm-hamburger-bar--mid" />
            <span className="sm-hamburger-bar sm-hamburger-bar--bot" />
          </button>
        </div>
      </header>

      {/* ═════════════════════════════════════════════════════════════
          2. TIROIR MOBILE (Full-Height Drawer — Zéro Badge)
          ═════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {open && (
          <div className="sm-portal-container">
            {/* Arrière-plan flou */}
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

            {/* Panneau coulissant */}
            <motion.aside
              key="sm-drawer"
              id="sm-drawer-panel"
              className="sm-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              aria-label="Menu de navigation mobile"
            >
              {/* Barre supérieure du tiroir */}
              <div className="sm-drawer-topbar">
                <div className="sm-drawer-top-brand">
                  <Image
                    src="/images/logo.webp"
                    alt="AVS"
                    width={26}
                    height={28}
                    className="sm-drawer-logo-img"
                  />
                  <span className="sm-drawer-title">Menu Principal</span>
                </div>

                <div className="sm-drawer-topbar-right">
                  {/* Bascule Clair / Sombre */}
                  <button
                    onClick={T.toggle}
                    className="sm-drawer-icon-btn"
                    title={T.light ? 'Passer en mode sombre' : 'Passer en mode clair'}
                    type="button"
                    aria-label="Basculer le thème"
                  >
                    {T.light ? <Moon size={16} strokeWidth={1.75} /> : <Sun size={16} strokeWidth={1.75} />}
                  </button>

                  {/* Bouton Fermer */}
                  <button
                    onClick={closeMenu}
                    className="sm-drawer-icon-btn sm-drawer-close-btn"
                    title="Fermer le menu"
                    type="button"
                    aria-label="Fermer le menu"
                  >
                    <X size={18} strokeWidth={1.75} />
                  </button>
                </div>
              </div>

              {/* Corps défilable */}
              <div className="sm-drawer-scroll">
                {/* ── Bloc Utilisateur / Authentification ── */}
                {currentUser ? (
                  <div className="sm-profile-card">
                    <div className="sm-profile-top">
                      <div className="sm-profile-avatar-box">
                        {currentUser.avatar ? (
                          <img
                            src={currentUser.avatar}
                            alt=""
                            className="sm-profile-avatar-img"
                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                          />
                        ) : (
                          <span className="sm-profile-avatar-fallback">
                            {firstName.charAt(0).toUpperCase()}
                          </span>
                        )}
                        <span className="sm-profile-status-dot" />
                      </div>

                      <div className="sm-profile-text">
                        <span className="sm-profile-name">{displayName}</span>
                        <span className="sm-profile-sub">
                          {currentUser.email || currentUser.phone || 'Compte client vérifié'}
                        </span>
                      </div>
                    </div>

                    <div className="sm-profile-actions">
                      <TransitionLink
                        href="/mon-compte"
                        className="sm-profile-btn sm-profile-btn--primary"
                        onClick={closeMenu}
                      >
                        <User size={14} strokeWidth={1.75} />
                        <span>Mon Espace & Commandes</span>
                      </TransitionLink>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="sm-profile-btn sm-profile-btn--logout"
                        title="Se déconnecter"
                      >
                        <LogOut size={14} strokeWidth={1.75} />
                        <span>Quitter</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="sm-guest-card">
                    <div className="sm-guest-header">
                      <h3 className="sm-guest-title">Espace Client & Éleveurs</h3>
                      <p className="sm-guest-desc">
                        Suivez vos commandes de poussins Cobb 500, provenderie et devis.
                      </p>
                    </div>
                    <div className="sm-guest-actions">
                      <TransitionLink
                        href="/connexion"
                        className="sm-guest-btn sm-guest-btn--login"
                        onClick={closeMenu}
                      >
                        <LogIn size={15} strokeWidth={1.75} />
                        <span>Se connecter</span>
                      </TransitionLink>
                      <TransitionLink
                        href="/inscription"
                        className="sm-guest-btn sm-guest-btn--register"
                        onClick={closeMenu}
                      >
                        <User size={15} strokeWidth={1.75} />
                        <span>Créer un compte</span>
                      </TransitionLink>
                    </div>
                  </div>
                )}

                {/* ── Pôles Stratégiques (Grille 2x2 — Zéro Badge, Icônes Pro) ── */}
                <div className="sm-section">
                  <div className="sm-section-header">
                    <span className="sm-section-title">NOS PÔLES STRATÉGIQUES</span>
                  </div>

                  <div className="sm-poles-grid">
                    {STRATEGIC_POLES.map((pole) => {
                      const Icon = pole.icon
                      const active = isActive(pole.href)
                      return (
                        <TransitionLink
                          key={pole.href}
                          href={pole.href}
                          className={`sm-pole-card ${active ? 'sm-pole-card--active' : ''}`}
                          onClick={closeMenu}
                        >
                          <div className="sm-pole-icon-wrap">
                            <Icon size={20} strokeWidth={1.75} />
                          </div>
                          <div className="sm-pole-meta">
                            <span className="sm-pole-title">{pole.title}</span>
                            <span className="sm-pole-desc">{pole.desc}</span>
                          </div>
                        </TransitionLink>
                      )
                    })}
                  </div>
                </div>

                {/* ── Navigation Principale (Icônes Pro) ── */}
                <div className="sm-section">
                  <div className="sm-section-header">
                    <span className="sm-section-title">NAVIGATION GÉNÉRALE</span>
                  </div>

                  <div className="sm-nav-list">
                    {MAIN_NAV_LINKS.map((item) => {
                      const Icon = item.icon
                      const active = isActive(item.href)
                      return (
                        <TransitionLink
                          key={item.href}
                          href={item.href}
                          className={`sm-nav-row ${active ? 'sm-nav-row--active' : ''}`}
                          onClick={closeMenu}
                        >
                          <div className="sm-nav-row-left">
                            <div className="sm-nav-row-icon">
                              <Icon size={16} strokeWidth={1.75} />
                            </div>
                            <div className="sm-nav-row-text">
                              <span className="sm-nav-row-label">{item.label}</span>
                              {item.desc && (
                                <span className="sm-nav-row-sub">{item.desc}</span>
                              )}
                            </div>
                          </div>
                          <ChevronRight size={16} strokeWidth={1.75} className="sm-nav-row-chevron" />
                        </TransitionLink>
                      )
                    })}
                  </div>
                </div>

                {/* ── Permanence Clinique Vétérinaire ── */}
                <div className="sm-clinic-banner">
                  <div className="sm-clinic-icon-box">
                    <Clock size={18} strokeWidth={1.75} />
                  </div>
                  <div className="sm-clinic-body">
                    <strong className="sm-clinic-title">Clinique Vétérinaire 24h/24 & 7j/7</strong>
                    <p className="sm-clinic-desc">
                      Soins intensifs, chirurgie et pharmacie de garde à Pointe-Noire (Socoprise).
                    </p>
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════════
                  3. PIED DE PAGE (Contact Pro & WhatsApp)
                  ═══════════════════════════════════════════════════════ */}
              <div className="sm-drawer-footer">
                {/* Bouton WhatsApp Officiel */}
                <a
                  href="https://wa.me/242069677567"
                  target="_blank"
                  rel="noreferrer"
                  className="sm-footer-whatsapp-btn"
                  onClick={closeMenu}
                >
                  <Phone size={16} strokeWidth={1.8} />
                  <span>COMMANDES & URGENCE WHATSAPP</span>
                  <ExternalLink size={13} strokeWidth={1.8} className="sm-btn-ext-icon" />
                </a>

                {/* Appel direct & adresse */}
                <div className="sm-footer-contacts">
                  <a href="tel:+242069677567" className="sm-footer-phone-link">
                    Standard : (+242) 06 967 75 67 / 05 633 70 50
                  </a>
                  <p className="sm-footer-address">
                    Avenue Nelson Mandela, Socoprise, Pointe-Noire
                  </p>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
