'use client'

import { useState } from 'react'
import {
  ShoppingBag,
  Search,
  Check,
  Plus,
  Minus,
  Sparkles,
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
        
        {/* ── NOUVEAU HERO BOUTIQUE PRESTIGE (SANS BADGE) ── */}
        <section style={{ marginBottom: '3.5rem', position: 'relative' }}>
          {/* Lueur d'ambiance d'arrière-plan */}
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              left: '10%',
              width: '450px',
              height: '350px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(234, 128, 37, 0.12) 0%, transparent 70%)',
              filter: 'blur(50px)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            {/* Colonne Gauche : Titre, Explications & CTA */}
            <div>
              <h1
                style={{
                  fontSize: 'clamp(2.3rem, 4.8vw, 3.6rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  margin: '0 0 1.2rem',
                  lineHeight: 1.15,
                  fontFamily: "'Poppins', sans-serif",
                  color: T.textMain,
                }}
              >
                Boutique Agropastorale & <span className="text-gradient">Provenderie Certifiée</span>
              </h1>

              <p
                style={{
                  fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)',
                  color: T.light ? '#4b5563' : 'rgba(255,255,255,.75)',
                  lineHeight: 1.7,
                  margin: '0 0 2rem',
                  maxWidth: '640px',
                }}
              >
                Approvisionnez votre cheptel avec des intrants haute performance testés et garantis au Congo : <strong>poussins d’un jour Cobb 500</strong> vigoureux, <strong>pondeuses Lohmann Brown</strong>, provendes industrielles enrichies et kits de prophylaxie. Réglez en toute sécurité par <strong>Mobile Money KKiaPay</strong> (MTN / Airtel) ou sur <strong>WhatsApp Pro</strong> avec livraison rapide sur vos fermes et sites d'élevage.
              </p>

              {/* Boutons d'Action */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '2.2rem' }}>
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
                  }}
                >
                  <ShoppingBag size={18} />
                  Voir le catalogue
                  <ArrowRight size={16} />
                </a>

                <a
                  href="https://wa.me/242069677567?text=Bonjour%20AGRO%20V%C3%89TO%20SERVICES%2C%20je%20souhaite%20commander%20des%20poussins%20ou%20intrants%20agropastoraux."
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
                  }}
                >
                  <MessageCircle size={18} />
                  Commander sur WhatsApp
                </a>
              </div>

              {/* Preuves d'engagement & réassurance */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.8rem',
                  paddingTop: '1.2rem',
                  borderTop: `1px solid ${T.border}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'rgba(234, 128, 37, 0.15)',
                      color: '#ea8025',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Check size={16} />
                  </div>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: T.textMain }}>
                    Viabilité &gt; 98% au démarrage
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'rgba(234, 128, 37, 0.15)',
                      color: '#ea8025',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Truck size={16} />
                  </div>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: T.textMain }}>
                    Livraison Pointe-Noire & Kouilou
                  </span>
                </div>
              </div>
            </div>

            {/* Colonne Droite : Carte Interactive Produit Vedette */}
            <div>
              <div
                style={{
                  borderRadius: 24,
                  overflow: 'hidden',
                  background: T.light ? '#ffffff' : '#0e1710',
                  border: `1px solid ${T.border}`,
                  boxShadow: T.light
                    ? '0 16px 40px rgba(0,0,0,.06)'
                    : '0 16px 48px rgba(0,0,0,.5), 0 0 32px rgba(234, 128, 37,.1)',
                  position: 'relative',
                }}
              >
                {/* Photo Produit Vedette */}
                <div style={{ height: 230, position: 'relative', overflow: 'hidden' }}>
                  <img
                    src="/images/cobb500.webp"
                    alt="Poussins d'un jour Cobb 500 certifiés"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Tag En stock */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '5px 12px',
                      borderRadius: '100px',
                      background: 'rgba(5, 10, 6, 0.82)',
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

                {/* Détails du produit vedette */}
                <div style={{ padding: '1.5rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      marginBottom: '0.8rem',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '0.72rem',
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
                          fontSize: '1.2rem',
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

                  <p style={{ fontSize: '0.82rem', color: T.textSub, lineHeight: 1.6, margin: '0 0 1.2rem' }}>
                    Vaccinés Marek et Newcastle. Croissance accélérée avec un indice de consommation remarquable pour rentabiliser votre cycle de production.
                  </p>

                  {/* Garantie Dr POUTYA */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: T.light ? '#f8f9fa' : 'rgba(234, 128, 37, 0.08)',
                      border: `1px solid ${T.border}`,
                    }}
                  >
                    <img
                      src="/images/dr_poutya.jpeg"
                      alt="Dr POUTYA"
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        objectPosition: 'center 20%',
                        border: '2px solid #ea8025',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: T.textMain, lineHeight: 1.2 }}>
                        Garantie Vétérinaire AVS Congo
                      </div>
                      <div style={{ fontSize: '0.7rem', color: T.textMuted, lineHeight: 1.3 }}>
                        Supervisé par le Dr POUTYA • Protocole de démarrage offert
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '14px',
              marginTop: '2.5rem',
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
                  background: 'rgba(234, 128, 37,.12)',
                  color: '#ea8025',
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
                  background: 'rgba(234, 128, 37,.12)',
                  color: '#ea8025',
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
                  background: 'rgba(234, 128, 37,.12)',
                  color: '#ea8025',
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
                  Fiche technique de démarrage et guide prophylactique offerts.
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
