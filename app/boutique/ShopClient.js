'use client'

import { useState } from 'react'
import {
  ShoppingBag,
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
import { PRODUCTS_CATALOG, PRODUCT_CATEGORIES } from '@/lib/products'

export default function ShopClient() {
  const T = useTheme()
  const { addToCart, openCart, cartCount, cartTotal, currentUser, openAuthModal } = useShop()

  const [selectedCat, setSelectedCat] = useState('all')
  const [search, setSearch] = useState('')
  const [quantities, setQuantities] = useState({})
  const [heroQty, setHeroQty] = useState(50)

  const featuredProduct = PRODUCTS_CATALOG[0] || {
    id: 'PROD-01',
    name: "Poussins d'un Jour Cobb 500 (Chair)",
    price: 650,
    minOrder: 50,
  }

  const filtered = PRODUCTS_CATALOG.filter(p => {
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

  const handleHeroAdd = () => {
    addToCart(featuredProduct, heroQty)
    openCart()
  }

  return (
    <div
      style={{
        paddingTop: '110px',
        paddingBottom: '100px',
        background: T.light ? '#f6f8fa' : '#070d06',
        color: T.light ? '#0f172a' : '#f3f4f6',
        minHeight: '100vh',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* ── HERO BOUTIQUE PRESTIGE (SANS AUCUN BADGE) ── */}
        <section
          style={{
            marginBottom: '3.5rem',
            position: 'relative',
            borderRadius: '28px',
            padding: '2.5rem 2rem',
            background: T.light
              ? 'linear-gradient(135deg, #ffffff 0%, #fdf8f3 100%)'
              : 'linear-gradient(135deg, rgba(14, 23, 16, 0.95) 0%, rgba(9, 14, 10, 0.98) 100%)',
            border: `1px solid ${T.border}`,
            boxShadow: T.light
              ? '0 12px 36px rgba(0,0,0,0.04)'
              : '0 16px 44px rgba(0,0,0,0.45), 0 0 40px rgba(234, 128, 37, 0.06)',
            overflow: 'hidden',
          }}
        >
          {/* Lueur d'ambiance d'arrière-plan */}
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              right: '15%',
              width: '420px',
              height: '320px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(234, 128, 37, 0.16) 0%, transparent 70%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            {/* Colonne Gauche : Titre, Explications, Chiffres & CTA */}
            <div>
              <h1
                style={{
                  fontSize: 'clamp(2.1rem, 4.4vw, 3.4rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  margin: '0 0 1.1rem',
                  lineHeight: 1.15,
                  fontFamily: "'Poppins', sans-serif",
                  color: T.textMain,
                }}
              >
                Boutique Agropastorale & <span className="text-gradient">Provenderie Certifiée</span>
              </h1>

              <p
                style={{
                  fontSize: 'clamp(0.92rem, 1.6vw, 1.02rem)',
                  color: T.light ? '#4b5563' : 'rgba(255,255,255,.75)',
                  lineHeight: 1.7,
                  margin: '0 0 1.8rem',
                  maxWidth: '620px',
                }}
              >
                Commandez vos intrants de haute productivité directement auprès de la référence vétérinaire au Congo : <strong>poussins d’un jour Cobb 500</strong> vigoureux, <strong>pondeuses Lohmann Brown</strong>, provendes industrielles enrichies et programmes de prophylaxie. Paiement 100% sécurisé via <strong>KKiaPay Mobile Money</strong> (MTN & Airtel) ou espèces à la livraison.
              </p>

              {/* Boutons d'Action */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
                <a
                  href="#catalogue"
                  className="btn-raised"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0.9rem 1.8rem',
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    borderRadius: '100px',
                    fontWeight: 800,
                  }}
                >
                  <ShoppingBag size={18} />
                  Parcourir le catalogue
                  <ArrowRight size={16} />
                </a>

                <a
                  href="https://wa.me/242069677567?text=Bonjour%20Dr%20POUTYA%2C%20je%20souhaite%20commander%20des%20poussins%20ou%20intrants%20agropastoraux."
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0.9rem 1.8rem',
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    borderRadius: '100px',
                    fontWeight: 700,
                  }}
                >
                  <MessageCircle size={18} />
                  Commander sur WhatsApp
                </a>
              </div>

              {/* 4 Piliers de réassurance & métriques */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '10px',
                  paddingTop: '1.2rem',
                  borderTop: `1px solid ${T.border}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: 'rgba(234, 128, 37, 0.15)',
                      color: '#ea8025',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Check size={14} />
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: T.textMain }}>
                    Viabilité &gt; 98% au démarrage
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: 'rgba(234, 128, 37, 0.15)',
                      color: '#ea8025',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Truck size={14} />
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: T.textMain }}>
                    Livraison Pointe-Noire & Kouilou
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: 'rgba(234, 128, 37, 0.15)',
                      color: '#ea8025',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <ShieldCheck size={14} />
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: T.textMain }}>
                    Supervisé par le Dr POUTYA
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: 'rgba(234, 128, 37, 0.15)',
                      color: '#ea8025',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <CreditCard size={14} />
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: T.textMain }}>
                    MTN & Airtel Mobile Money
                  </span>
                </div>
              </div>
            </div>

            {/* Colonne Droite : Carte Interactive Produit Vedette (Cobb 500) */}
            <div>
              <div
                style={{
                  borderRadius: 22,
                  overflow: 'hidden',
                  background: T.light ? '#ffffff' : '#0c140d',
                  border: `1px solid ${T.border}`,
                  boxShadow: T.light
                    ? '0 14px 34px rgba(0,0,0,.06)'
                    : '0 16px 44px rgba(0,0,0,.5), 0 0 30px rgba(234, 128, 37,.1)',
                  position: 'relative',
                }}
              >
                {/* Photo Produit Vedette */}
                <div style={{ height: 210, position: 'relative', overflow: 'hidden' }}>
                  <img
                    src="/images/cobb500.webp"
                    alt="Poussins d'un jour Cobb 500 certifiés"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Pastille Disponibilité */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: '100px',
                      background: 'rgba(5, 10, 6, 0.84)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(234, 128, 37, 0.4)',
                      color: '#ea8025',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: '#22c55e',
                        display: 'inline-block',
                        boxShadow: '0 0 8px #22c55e',
                      }}
                    />
                    Arrivages réguliers au couvoir
                  </div>
                </div>

                {/* Détails & Contrôles d'Achat Interactifs */}
                <div style={{ padding: '1.4rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      marginBottom: '0.6rem',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#ea8025',
                          textTransform: 'uppercase',
                          letterSpacing: '.06em',
                          marginBottom: '0.2rem',
                        }}
                      >
                        Souche Recommandée • Chair
                      </div>
                      <h3
                        style={{
                          fontSize: '1.18rem',
                          fontWeight: 900,
                          color: T.textMain,
                          margin: 0,
                          lineHeight: 1.25,
                        }}
                      >
                        Poussins d'un Jour Cobb 500
                      </h3>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div
                        style={{
                          fontSize: '1.35rem',
                          fontWeight: 900,
                          color: '#ea8025',
                          lineHeight: 1,
                        }}
                      >
                        650 FCFA
                      </div>
                      <div style={{ fontSize: '0.68rem', color: T.textMuted }}>/ sujet (carton de 50)</div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: T.textSub, lineHeight: 1.55, margin: '0 0 1rem' }}>
                    Vaccinés Marek et Newcastle. Croissance accélérée avec indice de consommation optimal pour maximiser la rentabilité de vos bandes.
                  </p>

                  {/* Sélecteur de Quantité Rapide */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      background: T.light ? '#f3f4f6' : '#141d16',
                      border: `1px solid ${T.border}`,
                      marginBottom: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: T.textMuted }}>Quantité :</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[50, 100, 200].map(val => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setHeroQty(val)}
                            style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              border: `1px solid ${heroQty === val ? '#ea8025' : T.border}`,
                              background: heroQty === val ? 'rgba(234, 128, 37, 0.2)' : 'transparent',
                              color: heroQty === val ? '#ea8025' : T.textMain,
                              fontSize: '0.72rem',
                              fontWeight: heroQty === val ? 800 : 600,
                              cursor: 'pointer',
                            }}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setHeroQty(q => Math.max(50, q - 50))}
                        disabled={heroQty <= 50}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          border: `1px solid ${T.border}`,
                          background: T.light ? '#ffffff' : '#1e2920',
                          color: T.textMain,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: heroQty <= 50 ? 'not-allowed' : 'pointer',
                          opacity: heroQty <= 50 ? 0.4 : 1,
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 900, minWidth: 28, textAlign: 'center', color: T.textMain }}>
                        {heroQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setHeroQty(q => q + 50)}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          border: `1px solid ${T.border}`,
                          background: T.light ? '#ffffff' : '#1e2920',
                          color: T.textMain,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Bouton d'Ajout Direct au Panier avec Sous-total */}
                  <button
                    type="button"
                    onClick={handleHeroAdd}
                    className="btn-raised"
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      marginBottom: '0.9rem',
                      cursor: 'pointer',
                      border: 'none',
                    }}
                  >
                    <ShoppingBag size={17} />
                    <span>Ajouter au panier • {(heroQty * 650).toLocaleString('fr-FR')} FCFA</span>
                  </button>

                  {/* Garantie Vétérinaire Dr POUTYA */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      borderRadius: '12px',
                      background: T.light ? '#f8f9fa' : 'rgba(234, 128, 37, 0.08)',
                      border: `1px solid ${T.border}`,
                    }}
                  >
                    <img
                      src="/images/dr_poutya.jpeg"
                      alt="Dr POUTYA"
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        objectPosition: 'center 20%',
                        border: '2px solid #ea8025',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.76rem', fontWeight: 800, color: T.textMain, lineHeight: 1.2 }}>
                        Garantie Vétérinaire AVS Congo
                      </div>
                      <div style={{ fontSize: '0.68rem', color: T.textMuted, lineHeight: 1.3 }}>
                        Supervisé par le Dr POUTYA • Fiche technique de démarrage incluse
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Piliers de Service */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '12px',
              marginTop: '2.2rem',
              paddingTop: '1.8rem',
              borderTop: `1px solid ${T.border}`,
            }}
          >
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '14px',
                background: T.light ? '#ffffff' : '#101a12',
                border: `1px solid ${T.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'rgba(234, 128, 37,.12)',
                  color: '#ea8025',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CreditCard size={19} />
              </div>
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: T.textMain }}>
                  Paiement Mobile Money & Cash
                </div>
                <div style={{ fontSize: '0.72rem', color: T.textSub, lineHeight: 1.35 }}>
                  MTN MoMo, Airtel Money, CB ou règlement à la livraison.
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '14px 16px',
                borderRadius: '14px',
                background: T.light ? '#ffffff' : '#101a12',
                border: `1px solid ${T.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'rgba(234, 128, 37,.12)',
                  color: '#ea8025',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Truck size={19} />
              </div>
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: T.textMain }}>
                  Livraison Pointe-Noire & Kouilou
                </div>
                <div style={{ fontSize: '0.72rem', color: T.textSub, lineHeight: 1.35 }}>
                  Socoprise, Tié-Tié, Loandjili, Vindoulou & exploitations.
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '14px 16px',
                borderRadius: '14px',
                background: T.light ? '#ffffff' : '#101a12',
                border: `1px solid ${T.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'rgba(234, 128, 37,.12)',
                  color: '#ea8025',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={19} />
              </div>
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: T.textMain }}>
                  Conseil Zootechnique Gratuit
                </div>
                <div style={{ fontSize: '0.72rem', color: T.textSub, lineHeight: 1.35 }}>
                  Protocole de prophylaxie et assistance continue offerts.
                </div>
              </div>
            </div>
          </div>
        </section>

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
                    border: `1px solid ${active ? '#ea8025' : 'rgba(255,255,255,0.1)'}`,
                    background: active ? '#ea8025' : (T.light ? '#ffffff' : 'rgba(255,255,255,0.04)'),
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
                          background: 'rgba(234, 128, 37, 0.95)',
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
                    <div style={{ fontSize: '0.72rem', color: '#ea8025', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
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
                            <Check size={13} color="#ea8025" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Prix */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1.2rem' }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ea8025' }}>
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
                          style={{
                            flex: 1,
                            padding: '10px 14px',
                            borderRadius: '10px',
                            border: '1px solid #ea8025',
                            background: 'rgba(234, 128, 37, 0.15)',
                            color: '#ea8025',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                          }}
                        >
                          <ShoppingBag size={15} />
                          <span>Au Panier</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleBuyNow(product)}
                        style={{
                          width: '100%',
                          padding: '11px 16px',
                          borderRadius: '10px',
                          border: 'none',
                          background: '#ea8025',
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
                        <span>Commander & Payer via KKiaPay</span>
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
              border: '2px solid #ea8025',
              borderRadius: '100px',
              padding: '10px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 25px rgba(234, 128, 37, 0.4)',
              color: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#ea8025',
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
                background: '#ea8025',
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
  )
}
