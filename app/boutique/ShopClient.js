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
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* En-tête Hero Boutique */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '100px',
              background: 'rgba(90, 135, 56, 0.15)',
              border: '1px solid rgba(90, 135, 56, 0.35)',
              color: '#5a8738',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={14} />
            Catalogue Intrants & Élevage Certifié
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              margin: '0 0 1rem',
              lineHeight: 1.1,
            }}
          >
            Boutique Agropastorale & Provenderie
          </h1>

          <p
            style={{
              fontSize: '1rem',
              color: T.light ? '#4b5563' : '#9ca3af',
              lineHeight: 1.6,
              margin: '0 0 2rem',
            }}
          >
            Commandez vos poussins d’un jour Cobb 500 certifiés, provendes industrielles haute énergie et kits de prophylaxie.
            Réglez instantanément par <strong>Mobile Money KKiaPay</strong> (MTN / Airtel) ou sur <strong>WhatsApp Pro</strong> avec livraison rapide à Pointe-Noire.
          </p>

          {/* 3 Avantages clés */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '14px',
                background: T.light ? '#ffffff' : '#0e1710',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <CreditCard size={20} color="#5a8738" />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>Paiement KKiaPay</div>
                <div style={{ fontSize: '0.72rem', color: T.light ? '#6b7280' : '#9ca3af' }}>Mobile Money & CB sécurisé</div>
              </div>
            </div>

            <div
              style={{
                padding: '12px 16px',
                borderRadius: '14px',
                background: T.light ? '#ffffff' : '#0e1710',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <Truck size={20} color="#5a8738" />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>Livraison Pointe-Noire</div>
                <div style={{ fontSize: '0.72rem', color: T.light ? '#6b7280' : '#9ca3af' }}>Socoprise, Tié-Tié, Loandjili</div>
              </div>
            </div>

            <div
              style={{
                padding: '12px 16px',
                borderRadius: '14px',
                background: T.light ? '#ffffff' : '#0e1710',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <ShieldCheck size={20} color="#5a8738" />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>Contrôle Vétérinaire</div>
                <div style={{ fontSize: '0.72rem', color: T.light ? '#6b7280' : '#9ca3af' }}>Garantie Dr POUTYA</div>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de filtre & Recherche */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '2.5rem',
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
                    border: `1px solid ${active ? '#5a8738' : 'rgba(255,255,255,0.1)'}`,
                    background: active ? '#5a8738' : (T.light ? '#ffffff' : 'rgba(255,255,255,0.04)'),
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
                          background: 'rgba(90, 135, 56, 0.95)',
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
                    <div style={{ fontSize: '0.72rem', color: '#5a8738', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
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
                            <Check size={13} color="#5a8738" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Prix */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1.2rem' }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#5a8738' }}>
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
                            border: '1px solid #5a8738',
                            background: 'rgba(90, 135, 56, 0.15)',
                            color: '#5a8738',
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
                          background: '#5a8738',
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
              border: '2px solid #5a8738',
              borderRadius: '100px',
              padding: '10px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 25px rgba(90, 135, 56, 0.4)',
              color: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#5a8738',
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
                background: '#5a8738',
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
