'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ShoppingCart,
  Search,
  Check,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
  User,
  MessageCircle,
} from 'lucide-react'
import { useShop } from '@/lib/shopContext'
import { useTheme } from '@/lib/theme'
import { GhostTitle, GreenUnderline, HoverSlideText } from '@/components/ui/index'
import AuroraHero from '@/components/ui/AuroraHero'
import { PRODUCTS_CATALOG, PRODUCT_CATEGORIES } from '@/lib/products'
import api from '@/lib/api-client'

/* ────────────────────────────────────────────────
   HERO BOUTIQUE — Gabarit signature Helious / Services
──────────────────────────────────────────────── */
function HeroShopDesktop() {
  const layerBgRef   = useRef(null)
  const layerMidRef  = useRef(null)
  const layerForeRef = useRef(null)

  useEffect(() => {
    const onMouse = (e) => {
      const x = (e.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2)
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)
      const rX = y * -5, rY = x * 5
      const apply = (el, sp) => { if (el) el.style.transform = `translate3d(${x*50*sp}px,${y*50*sp}px,0) rotateX(${rX}deg) rotateY(${rY}deg)` }
      apply(layerBgRef.current, 0.2); apply(layerMidRef.current, 0.5); apply(layerForeRef.current, 0.8)
    }
    window.addEventListener('mousemove', onMouse)
    return () => window.removeEventListener('mousemove', onMouse)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const s = window.pageYOffset
      if (layerBgRef.current) { layerBgRef.current.style.transform = `scale(${1 + s * 0.0005}) translateY(${s * 0.2}px)`; layerBgRef.current.style.filter = `blur(${Math.min(s / 60, 12)}px)` }
      if (layerMidRef.current) { layerMidRef.current.style.opacity = Math.max(0, 1 - s / 700); layerMidRef.current.style.transform = `translateY(${s * 0.4}px)`; layerMidRef.current.style.filter = `blur(${s / 100}px)` }
      if (layerForeRef.current) { layerForeRef.current.style.transform = `translateY(${-s * 0.96}px)`; layerForeRef.current.style.opacity = Math.max(0, 1 - s / 400) }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section style={{ height: '100vh', minHeight: 640, position: 'relative', overflow: 'hidden', background: '#0c0a09' }}>
      <div ref={layerBgRef} suppressHydrationWarning style={{ position: 'absolute', inset: '-8%', zIndex: 1, transition: 'transform .1s ease-out' }}>
        <AuroraHero labels={[]} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(12, 10, 9, 0.85)' }} />
      </div>

      {/* Titre géant bas-gauche + bloc texte centré verticalement à droite — gabarit hero "page title" (réf. Helious / Services) */}
      <div ref={layerMidRef} suppressHydrationWarning className="hr-row" style={{ transition: 'transform .1s ease-out' }}>
        <motion.h1 className="hr-title" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: 'easeOut' }}>
          <GhostTitle text="BOUTIQUE" />
          BOUTIQUE
        </motion.h1>

        <div className="hr-side">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .2 }}>
            <p className="hr-kicker">De la ferme à l'assiette</p>
            <p className="hr-desc">
              Poussins d’un jour Cobb 500 certifiés, provendes industrielles équilibrées et produits vétérinaires sous la supervision du Dr POUTYA. Livraison à Pointe-Noire et au Kouilou.
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1.8rem' }}>
            <a
              href="#catalogue"
              className="btn-raised"
              style={{ fontSize: '0.95rem' }}
            >
              <HoverSlideText text="Explorer le catalogue" />
              <ArrowRight size={16} />
            </a>

            <a
              href="https://wa.me/242069677567?text=Bonjour%20AGRO%20V%C3%89TO%20SERVICES%2C%20je%20souhaite%20commander%20des%20poussins%20ou%20intrants."
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
              style={{ fontSize: '0.95rem', background: 'rgba(3,8,6,.55)', backdropFilter: 'blur(6px)', color: '#f5c57a', borderColor: '#b47027', textShadow: '0 1px 8px rgba(0,0,0,.8)' }}
            >
              <HoverSlideText text="WhatsApp Pro" />
              <MessageCircle size={16} />
            </a>
          </div>
        </div>
      </div>

      <div ref={layerForeRef} suppressHydrationWarning style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', transition: 'transform .1s ease-out' }}>
        {[{left:'8%',top:'25%',s:4,op:.18,dur:3.8,dy:0},{left:'22%',top:'68%',s:3,op:.11,dur:5.1,dy:1.2},{left:'60%',top:'22%',s:4,op:.20,dur:4.4,dy:0.6},{left:'75%',top:'70%',s:3,op:.09,dur:6.2,dy:1.8},{left:'88%',top:'15%',s:4,op:.15,dur:3.2,dy:0.3}].map((p,i) => (
          <motion.div key={i} style={{ position:'absolute', width:p.s, height:p.s, borderRadius:'50%', background:'#b47027', left:p.left, top:p.top, opacity:p.op }}
            animate={{ y:[0,-18,0] }} transition={{ duration:p.dur, repeat:Infinity, ease:'easeInOut', delay:p.dy }} />
        ))}
      </div>
    </section>
  )
}

function HeroShopMobile() {
  return (
    <section style={{ height: '100vh', minHeight: 600, width: '100%', background: '#0c0a09', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      <AuroraHero labels={[]} />
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, padding: '72px 5% 0' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <h1 style={{ position: 'relative', fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", color: '#fff', letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1.2rem', textShadow: '0 2px 16px rgba(0,0,0,.85)' }}>
            <GhostTitle text="NOTRE BOUTIQUE" />
            NOTRE{' '}
            <GreenUnderline><span style={{ color: '#f5c57a', textShadow: '0 2px 18px rgba(0,0,0,.9), 0 0 3px rgba(0,0,0,.9)' }}>BOUTIQUE</span></GreenUnderline>
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.75, maxWidth: 620, margin: '0 auto 2.5rem' }}>
            Poussins Cobb 500, provenderie et intrants certifiés.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <a href="#catalogue" className="btn-raised" style={{ fontSize: '1rem' }}>
              <HoverSlideText text="Explorer le catalogue" /> <ArrowRight size={16} />
            </a>
            <a
              href="https://wa.me/242069677567?text=Bonjour%20AGRO%20V%C3%89TO%20SERVICES%2C%20je%20souhaite%20commander%20des%20poussins%20ou%20intrants."
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
              style={{ fontSize: '1rem', background: 'rgba(3,8,6,.55)', backdropFilter: 'blur(6px)', color: '#f5c57a', borderColor: '#b47027', textShadow: '0 1px 8px rgba(0,0,0,.8)' }}
            >
              <HoverSlideText text="WhatsApp Pro" /> <MessageCircle size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function HeroShop() {
  return (
    <>
      <div className="view-desktop">
        <HeroShopDesktop />
      </div>
      <div className="view-mobile">
        <HeroShopMobile />
      </div>
    </>
  )
}

export default function ShopClient() {
  const T = useTheme()
  const { addToCart, openCart, cartCount, cartTotal, currentUser, openAuthModal } = useShop()

  const [products, setProducts] = useState(PRODUCTS_CATALOG)
  const [selectedCat, setSelectedCat] = useState('all')
  const [search, setSearch] = useState('')
  const [quantities, setQuantities] = useState({})

  // Chargement en temps réel depuis PostgreSQL via le backend Node.js
  useEffect(() => {
    let isMounted = true
    api.products.getAll({ limit: 50 })
      .then(res => {
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const normalized = res.data.map(p => ({
            id: p.id,
            slug: p.slug,
            name: p.title,
            category: p.category?.slug?.includes('poussin') ? 'poussins'
              : p.category?.slug?.includes('provende') ? 'provenderie'
              : p.category?.slug?.includes('sante') ? 'sante'
              : p.category?.slug?.includes('hygiene') ? 'hygiene'
              : p.category?.slug?.includes('materiel') ? 'materiel'
              : 'provenderie',
            categoryLabel: p.category?.name || 'Intrants Agropastoraux',
            price: p.promoPrice || p.price,
            priceUnit: `FCFA / ${p.unit || 'unité'}`,
            minOrder: 1,
            inStock: p.inStock && p.stock > 0,
            stock: p.stock,
            badge: p.badge || (p.stock > 0 ? 'En stock' : 'Sur commande'),
            image: p.image,
            fallbackImage: p.image,
            description: p.description,
            specs: p.features || [],
          }))
          setProducts(normalized)
        }
      })
      .catch(err => {
        console.warn('[Shop] Fallback catalogue local:', err.message)
      })
    return () => { isMounted = false }
  }, [])

  const filtered = products.filter(p => {
    const matchCat = selectedCat === 'all' || p.category === selectedCat
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const getQty = (id, min = 1) => quantities[id] || min

  const changeQty = (id, delta, min = 1) => {
    setQuantities(prev => {
      const current = prev[id] || min
      const next = Math.max(min, current + delta)
      return { ...prev, [id]: next }
    })
  }

  const handleBuyNow = (product) => {
    const qty = getQty(product.id, product.minOrder || 1)
    addToCart(product, qty)
    openCart()
  }

  return (
    <div>
      {/* ── HERO BOUTIQUE PRESTIGE (STYLE SERVICES / HELIOUS) ── */}
      <HeroShop />

      {/* ── Section Catalogue ── */}
      <div
        style={{
          paddingTop: '4rem',
          paddingBottom: '100px',
          background: T.light ? '#f6f8fa' : '#070d06',
          color: T.light ? '#0f172a' : '#f3f4f6',
          minHeight: '100vh',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
          
          {/* 3 Piliers de Service */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '14px',
              marginBottom: '3rem',
            }}
          >
            <div
              style={{
                padding: '16px 18px',
                borderRadius: '16px',
                background: T.light ? '#ffffff' : '#0e1710',
                border: `1px solid ${T.border}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                boxShadow: T.light ? '0 4px 14px rgba(0,0,0,.03)' : '0 4px 20px rgba(0,0,0,.25)',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'rgba(180, 112, 39,.12)',
                  color: '#b47027',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CreditCard size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: T.textMain, marginBottom: '3px' }}>
                  Paiement Mobile Money KKiaPay
                </div>
                <div style={{ fontSize: '0.75rem', color: T.textSub, lineHeight: 1.45 }}>
                  MTN MoMo, Airtel Money, CB sécurisé ou règlement cash à la livraison.
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '16px 18px',
                borderRadius: '16px',
                background: T.light ? '#ffffff' : '#0e1710',
                border: `1px solid ${T.border}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                boxShadow: T.light ? '0 4px 14px rgba(0,0,0,.03)' : '0 4px 20px rgba(0,0,0,.25)',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'rgba(180, 112, 39,.12)',
                  color: '#b47027',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Truck size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: T.textMain, marginBottom: '3px' }}>
                  Livraison Pointe-Noire & Kouilou
                </div>
                <div style={{ fontSize: '0.75rem', color: T.textSub, lineHeight: 1.45 }}>
                  Socoprise, Tié-Tié, Loandjili, Vindoulou et expéditions régionales.
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '16px 18px',
                borderRadius: '16px',
                background: T.light ? '#ffffff' : '#0e1710',
                border: `1px solid ${T.border}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                boxShadow: T.light ? '0 4px 14px rgba(0,0,0,.03)' : '0 4px 20px rgba(0,0,0,.25)',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'rgba(180, 112, 39,.12)',
                  color: '#b47027',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: T.textMain, marginBottom: '3px' }}>
                  Suivi Zootechnique & Conseil Vétérinaire
                </div>
                <div style={{ fontSize: '0.75rem', color: T.textSub, lineHeight: 1.45 }}>
                  Fiche technique de démarrage et guide prophylactique offerts par le Dr POUTYA.
                </div>
              </div>
            </div>
          </div>

        {/* Barre de filtre & Recherche */}
        <div
          id="catalogue"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '2.5rem',
            scrollMarginTop: '120px',
          }}
        >
          {/* Recherche */}
          <div style={{ position: 'relative', maxWidth: '480px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: T.light ? '#9ca3af' : '#6b7280',
              }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit (ex: Cobb 500, provende, désinfectant...)"
              style={{
                width: '100%',
                padding: '12px 16px 12px 42px',
                borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: T.light ? '#ffffff' : '#0e1710',
                color: 'inherit',
                fontSize: '0.88rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Catégories pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {PRODUCT_CATEGORIES.map(cat => {
              const active = selectedCat === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '100px',
                    border: `1px solid ${active ? '#b47027' : 'rgba(255,255,255,0.1)'}`,
                    background: active ? '#b47027' : (T.light ? '#ffffff' : 'rgba(255,255,255,0.04)'),
                    color: active ? '#ffffff' : 'inherit',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Grille des Produits */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <p style={{ fontSize: '1.1rem', color: T.light ? '#6b7280' : '#9ca3af' }}>
              Aucun produit ne correspond à votre recherche.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {filtered.map(product => {
              const min = product.minOrder || 1
              const qty = getQty(product.id, min)

              return (
                <div
                  key={product.id}
                  style={{
                    background: T.light ? '#ffffff' : '#0e1710',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: T.light ? '0 4px 20px rgba(0,0,0,0.06)' : '0 10px 30px rgba(0,0,0,0.4)',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                  }}
                >
                  {/* Image & Badge */}
                  <div style={{ position: 'relative', height: '210px', background: '#0a100a', overflow: 'hidden' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        if (product.fallbackImage && e.target.src !== product.fallbackImage) {
                          e.target.src = product.fallbackImage
                        }
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {product.badge && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          padding: '4px 10px',
                          borderRadius: '100px',
                          background: 'rgba(180, 112, 39, 0.95)',
                          color: '#ffffff',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          letterSpacing: '0.04em',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        }}
                      >
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Détails du produit */}
                  <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '0.72rem', color: '#b47027', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                      {product.categoryLabel}
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                      {product.name}
                    </h3>

                    <p style={{ fontSize: '0.82rem', color: T.light ? '#4b5563' : '#9ca3af', lineHeight: 1.5, margin: '0 0 1rem', flex: 1 }}>
                      {product.description}
                    </p>

                    {/* Spécifications */}
                    {product.specs && (
                      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.2rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {product.specs.slice(0, 3).map((spec, i) => (
                          <li key={i} style={{ fontSize: '0.75rem', color: T.light ? '#6b7280' : '#d1d5db', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Check size={13} color="#b47027" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Prix */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1.2rem' }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#b47027' }}>
                        {product.price.toLocaleString('fr-FR')} FCFA
                      </span>
                      <span style={{ fontSize: '0.75rem', color: T.light ? '#6b7280' : '#9ca3af' }}>
                        {product.priceUnit.includes('/') ? `/${product.priceUnit.split('/')[1]}` : ''}
                      </span>
                    </div>

                    {/* Contrôle de quantité & Boutons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '10px',
                            background: T.light ? '#f9fafb' : '#080d09',
                          }}
                        >
                          <button
                            onClick={() => changeQty(product.id, -1, min)}
                            style={{
                              padding: '8px 12px',
                              background: 'transparent',
                              border: 'none',
                              color: 'inherit',
                              cursor: 'pointer',
                            }}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, minWidth: '32px', textAlign: 'center' }}>
                            {qty}
                          </span>
                          <button
                            onClick={() => changeQty(product.id, 1, min)}
                            style={{
                              padding: '8px 12px',
                              background: 'transparent',
                              border: 'none',
                              color: 'inherit',
                              cursor: 'pointer',
                            }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => addToCart(product, qty)}
                          aria-label="Ajouter au panier"
                          title="Ajouter au panier"
                          style={{
                            flex: 1,
                            padding: '10px 14px',
                            borderRadius: '10px',
                            border: '1px solid #b47027',
                            background: 'rgba(180, 112, 39, 0.15)',
                            color: '#b47027',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                          }}
                        >
                          <ShoppingCart size={17} />
                        </button>
                      </div>

                      <button
                        onClick={() => handleBuyNow(product)}
                        style={{
                          width: '100%',
                          padding: '11px 16px',
                          borderRadius: '10px',
                          border: 'none',
                          background: '#b47027',
                          color: '#ffffff',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>Commander</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Barre Panier Flottante Fixe en bas si des articles sont présents */}
        {cartCount > 0 && (
          <div
            style={{
              position: 'fixed',
              bottom: '1.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 90,
              background: '#0e1710',
              border: '2px solid #b47027',
              borderRadius: '100px',
              padding: '10px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 25px rgba(180, 112, 39, 0.4)',
              color: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#b47027',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                }}
              >
                {cartCount}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Total : <strong>{cartTotal.toLocaleString('fr-FR')} FCFA</strong>
              </span>
            </div>

            <button
              onClick={openCart}
              style={{
                padding: '9px 18px',
                borderRadius: '100px',
                border: 'none',
                background: '#b47027',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>Voir le Panier & Payer</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
