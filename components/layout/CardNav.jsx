'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { Moon, Sun, Orbit, ShoppingCart, User, UserCheck } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { useShop } from '@/lib/shopContext'
import { HoverSlideText } from '@/components/ui/index'
import TransitionLink from './TransitionLink'
import { useBlobTransition } from './BlobTransition'
import './CardNav.css'

/* ── Slogans cycle — navJAX ─────────────────────────── */
const NAV_SLOGANS = [
  "De la santé animale à\nl'excellence QHSE.",
  "L'expertise au service de la santé\nanimale et du QHSE.",
  "Clinique vétérinaire 24/7\n& Provenderie certifiée.",
  "6 Pôles d'expertise intégrés\nà Pointe-Noire (Congo).",
]

function NavSlogan() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI(v => (v + 1) % NAV_SLOGANS.length), 4000)
    return () => clearInterval(id)
  }, [])
  const lines = NAV_SLOGANS[i].split('\n')
  return (
    <div style={{ position: 'relative', minHeight: '2.8em', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          className="aka-card-slogan"
          initial={{ y: 14, opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -14, opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          style={{ margin: 0, position: 'absolute', width: '100%' }}
        >
          {lines[0]}<br />{lines[1]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   CardNav — Agro Véto Services (desktop uniquement)
   Port fidèle du mockup akatech_UI.html :
   barre pill compacte → hamburger ouvre une grille
   de 3 cartes (Services / Réalisations / Agence)
   avec timeline GSAP (hauteur de la nav + stagger
   cards). Palette émeraude Agro Véto Services.
   ═══════════════════════════════════════════════ */

const ArrowIcon = () => (
  <svg className="aka-link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M7 17L17 7M17 7H7M17 7V17" />
  </svg>
)

/* ── Lien de carte, texte sous effet V-Slide au survol ── */
function CardLinkWithGhost({ href, label, sub, onClick }) {
  return (
    <TransitionLink href={href} className="aka-card-link" onClick={onClick}>
      <ArrowIcon />
      <span className="aka-card-link-textWrap">
        <span className="aka-card-link-label"><HoverSlideText text={label} /></span>
        <em className="aka-link-sub">{sub}</em>
      </span>
    </TransitionLink>
  )
}

export default function CardNav() {
  const T = useTheme()
  const { cartCount, openCart, currentUser } = useShop()
  const pathname = usePathname()
  const blobNavigate = useBlobTransition()
  const inExplorer = pathname?.startsWith('/explorer')

  const handleExplorerToggle = (e) => {
    blobNavigate(inExplorer ? '/' : '/explorer/', e)
  }

  const navRef = useRef(null)
  const contentRef = useRef(null)
  const cardsRef = useRef([])
  const tlRef = useRef(null)
  const openRef = useRef(false)
  const [open, setOpen] = useState(false)

  /* ── Transparent partout, le fond ne revient que quand le menu est déployé ── */

  useEffect(() => {
    const nav = navRef.current
    const content = contentRef.current
    const cards = cardsRef.current
    if (!nav || !content) return

    // Init cards hors écran
    gsap.set(cards, { y: 45, opacity: 0 })

    const tl = gsap.timeline({ paused: true })
    tl.to(nav, {
      height: () => content.scrollHeight + 64,
      duration: 0.55,
      ease: 'power3.inOut',
    })
    tl.to(cards, {
      y: 0, opacity: 1,
      duration: 0.4,
      stagger: 0.08,
      ease: 'power3.out',
    }, '-=0.25')
    tlRef.current = tl

    const onResize = () => {
      if (openRef.current) gsap.set(nav, { height: content.scrollHeight + 64 })
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      tl.kill()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = () => {
    const tl = tlRef.current
    if (!tl) return
    const next = !openRef.current
    openRef.current = next
    if (next) tl.play()
    else tl.reverse()
    setOpen(next)
  }

  const closeNav = () => {
    if (!openRef.current) return
    openRef.current = false
    tlRef.current?.reverse()
    setOpen(false)
  }

  return (
    <div className="aka-nav-container">
      <nav ref={navRef} className={'aka-card-nav' + (open ? ' is-open' : '')} style={{
        '--nav-bg': open
          ? (T.light ? 'rgba(252, 252, 250, 0.96)' : 'rgba(18, 15, 13, 0.96)')
          : (T.light ? 'rgba(255, 255, 255, 0.92)' : 'rgba(14, 11, 10, 0.92)'),
        '--nav-blur': 'blur(20px) saturate(180%)',
        '--nav-border': T.light ? '1.5px solid rgba(0, 0, 0, 0.12)' : '1.5px solid rgba(255, 255, 255, 0.18)',
        '--nav-shadow': T.light
          ? '0 12px 36px -4px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(234, 128, 37, 0.2)'
          : '0 16px 44px -4px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(234, 128, 37, 0.35)',
        '--nav-hline': '#ffffff',
        '--card1-bg': T.light ? '#fbf8f5' : '#1c1917',
        '--card2-bg': T.light ? '#fff7ed' : '#261a10',
        '--card3-bg': T.light ? '#ffffff' : '#0c0a09',
        '--card-text': T.light ? '#0a0c16' : '#f2ede8',
        '--card1-border': T.light ? '2px solid #050505' : '2px solid #050505',
        '--card2-border': T.light ? '2px solid #050505' : '2px solid #050505',
        '--card3-border': T.light ? '2px solid #050505' : '2px solid #050505',
        '--card-shadow': T.light ? '4px 4px 0px #050505' : '4px 4px 0px #050505',
        '--card3-label': T.light ? 'rgba(10,20,10,0.5)' : 'rgba(242,237,232,0.5)',
        '--card1-link-hover': T.light ? '#c9680a' : '#ea8025',
        '--theme-green': T.light ? '#c9680a' : '#ea8025',
      }}>
        <div className="aka-nav-top">
          <button className={'aka-nav-menu-btn' + (open ? ' open' : '')} onClick={toggle} aria-label="Menu de navigation" type="button">
            <div className="aka-hamburger">
              <div className="aka-hline" />
              <div className="aka-hline" />
            </div>
            <span className="aka-menu-label">Menu</span>
          </button>

          <TransitionLink href="/" className="aka-nav-logo" onClick={closeNav}>
            <Image src="/images/logo.webp" alt="Agro Véto Services" width={47} height={50} style={{ objectFit: 'contain' }} priority />
          </TransitionLink>

          <div className="aka-nav-right">
            {/* Bouton Chariot — icône seule */}
            <button
              onClick={openCart}
              className="aka-nav-pill aka-nav-pill--icon-only"
              title="Mon Chariot AVS"
              type="button"
              aria-label="Mon Chariot AVS"
            >
              <ShoppingCart size={16} className="aka-nav-pill-icon" />
              {cartCount > 0 && (
                <span className="aka-cart-badge">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Bouton Compte Client — icône seule */}
            <TransitionLink
              href="/mon-compte"
              className="aka-nav-pill aka-nav-pill--icon-only"
              title={currentUser ? `Connecté : ${currentUser.fullName}` : "Mon Compte Éleveur"}
              aria-label={currentUser ? `Connecté : ${currentUser.fullName}` : "Mon Compte Éleveur"}
            >
              {currentUser ? (
                <UserCheck size={16} className="aka-nav-pill-icon aka-user-active" />
              ) : (
                <User size={16} className="aka-nav-pill-icon" />
              )}
            </TransitionLink>

            <button
              onClick={handleExplorerToggle}
              className={`aka-nav-pill ${inExplorer ? 'aka-nav-pill--active' : ''}`}
              title={inExplorer ? "Retour au site" : "Mode Explorer — globe des projets"}
              aria-pressed={inExplorer}
              type="button"
            >
              <Orbit size={14} className="aka-nav-pill-icon" />
              <span className="aka-nav-pill-label"><HoverSlideText text="Explorer" /></span>
            </button>
            <button onClick={T.toggle} className="aka-theme-btn" title={T.light ? 'Mode sombre' : 'Mode clair'} type="button">
              {T.light ? <Moon size={13} /> : <Sun size={13} />}
            </button>
            <a href="https://wa.me/242069677567" target="_blank" rel="noreferrer" className="btn-raised btn-sm">
              <HoverSlideText text="WHATSAPP" />
            </a>
          </div>
        </div>

        <div className="aka-nav-content" ref={contentRef}>
          <div className="aka-nav-card aka-card-1" ref={el => cardsRef.current[0] = el}>
            <div className="aka-card-label">AGRO VÉTO SERVICES</div>
            <div className="aka-card-brand">
              <TransitionLink href="/" onClick={closeNav} className="aka-card-logo-link" aria-label="Retour à l'accueil">
                <Image src="/images/logo.webp" alt="Agro Véto Services" width={87} height={92} style={{ objectFit: 'contain' }} />
              </TransitionLink>
              <NavSlogan />
            </div>
          </div>

          <div className="aka-nav-card aka-card-2" ref={el => cardsRef.current[1] = el}>
            <div className="aka-card-label">Prestations & Intrants</div>
            <div className="aka-card-links">
              <CardLinkWithGhost href="/boutique" label="Boutique" sub="Poussins Cobb 500 & Provende" onClick={closeNav} />
              <CardLinkWithGhost href="/mon-compte" label="Mon Compte" sub="Suivi des commandes & Profil" onClick={closeNav} />
              <CardLinkWithGhost href="/clinique" label="Clinique" sub="Urgences 24/7 & Soins" onClick={closeNav} />
              <CardLinkWithGhost href="/formations" label="Formations" sub="Fermes-Écoles & Certificats" onClick={closeNav} />
            </div>
          </div>

          <div className="aka-nav-card aka-card-3" ref={el => cardsRef.current[2] = el}>
            <div className="aka-card-label">L'Entreprise</div>
            <div className="aka-card-links">
              <CardLinkWithGhost href="/services" label="Nos 6 Pôles" sub="Santé, Provende, QHSE" onClick={closeNav} />
              <CardLinkWithGhost href="/about" label="À Propos" sub="Dr POUTYA & Direction" onClick={closeNav} />
              <CardLinkWithGhost href="/projects" label="Réalisations" sub="Cas clients & Résultats" onClick={closeNav} />
              <CardLinkWithGhost href="/blog" label="Blog" sub="Conseils & Guides d'élevage" onClick={closeNav} />
              <CardLinkWithGhost href="/contact" label="Contact" sub="Clinique & Siège Socoprise" onClick={closeNav} />
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
