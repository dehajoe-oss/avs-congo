// components/ui/HeroBackgroundSlider.js
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const DEFAULT_HERO_SLIDES = [
  {
    id: 1,
    url: 'https://res.cloudinary.com/dzxesa3wi/image/upload/f_auto,q_auto/v1789209407/Horse_Veterinary_Medicine_Veterinarian_Animal_Health_Products_PNG_rmcpvk.jpg',
    title: 'Santé & Médecine Vétérinaire',
    subtitle: 'Clinique 24/7 & Soins d\'Urgence',
  },
  {
    id: 2,
    url: 'https://res.cloudinary.com/dzxesa3wi/image/upload/f_auto,q_auto/v1789209391/jpeg_1_lhj9mz.jpg',
    title: 'Provenderie & Nutrition Animale',
    subtitle: 'Formulation bromatologique certifiée',
  },
  {
    id: 3,
    url: 'https://res.cloudinary.com/dzxesa3wi/image/upload/f_auto,q_auto/v1789207553/Rendement_d_un_poulailler_amateur_bio___Poulailler_bio_j2epgx.jpg',
    title: 'Poussins d\'un jour Cobb 500',
    subtitle: 'Ferme-École & Performance Avicole',
  },
]

export default function HeroBackgroundSlider({
  slides = DEFAULT_HERO_SLIDES,
  interval = 5500,
  overlayOpacity = 0.58,
  showIndicators = true,
  showArrows = false,
  indicatorsBottom = '24px',
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef(null)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  const goToIndex = (idx) => {
    setCurrentIndex(idx)
  }

  // Défilement automatique
  useEffect(() => {
    if (isPaused) return

    timerRef.current = setInterval(() => {
      goToNext()
    }, interval)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [goToNext, interval, isPaused])

  // Préchargement des images dans le cache du navigateur
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image()
      img.src = slide.url
    })
  }, [slides])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 1,
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Slides superposées avec fondu enchaîné (Crossfade GPU) ── */}
      {slides.map((slide, idx) => {
        const isActive = idx === currentIndex
        return (
          <div
            key={slide.id || idx}
            style={{
              position: 'absolute',
              inset: '-4%',
              width: '108%',
              height: '108%',
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'scale(1.03)' : 'scale(1.08)',
              transition: 'opacity 1.4s cubic-bezier(0.4, 0, 0.2, 1), transform 6.5s ease-out',
              pointerEvents: 'none',
              zIndex: isActive ? 2 : 1,
            }}
          >
            <img
              src={slide.url}
              alt={slide.title || ''}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 42%',
                display: 'block',
                filter: 'brightness(0.92) contrast(1.05)',
              }}
            />
          </div>
        )
      })}

      {/* ── Nappes de dégradés pour contraste & lisibilité parfaite du texte ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          background: `radial-gradient(ellipse at center, rgba(12, 10, 9, ${overlayOpacity - 0.12}) 0%, rgba(12, 10, 9, ${overlayOpacity + 0.18}) 100%)`,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          background: 'linear-gradient(180deg, rgba(8, 7, 6, 0.7) 0%, rgba(12, 10, 9, 0.35) 45%, rgba(12, 10, 9, 0.82) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Flèches de navigation latérales discrètes (Desktop & Tablette) ── */}
      {showArrows && (
        <div
          style={{
            position: 'absolute',
            inset: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 15,
            pointerEvents: 'none',
          }}
        >
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Photo précédente"
            style={{
              pointerEvents: 'auto',
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'rgba(18, 16, 15, 0.45)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              color: '#f2ede8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s, transform 0.15s, border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(180, 112, 39, 0.65)'
              e.currentTarget.style.borderColor = '#b47027'
              e.currentTarget.style.transform = 'scale(1.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(18, 16, 15, 0.45)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Photo suivante"
            style={{
              pointerEvents: 'auto',
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'rgba(18, 16, 15, 0.45)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              color: '#f2ede8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s, transform 0.15s, border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(180, 112, 39, 0.65)'
              e.currentTarget.style.borderColor = '#b47027'
              e.currentTarget.style.transform = 'scale(1.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(18, 16, 15, 0.45)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* ── Indicateurs de progression (3 barres élégantes) ── */}
      {showIndicators && (
        <div
          style={{
            position: 'absolute',
            bottom: indicatorsBottom,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 15,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'rgba(10, 8, 7, 0.55)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            pointerEvents: 'auto',
          }}
        >
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex
            return (
              <button
                key={slide.id || idx}
                type="button"
                onClick={() => goToIndex(idx)}
                aria-label={`Aller à la photo ${idx + 1}`}
                style={{
                  position: 'relative',
                  width: isActive ? '28px' : '9px',
                  height: '6px',
                  borderRadius: '999px',
                  background: isActive ? '#b47027' : 'rgba(255, 255, 255, 0.28)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isActive ? '0 0 10px rgba(180, 112, 39, 0.7)' : 'none',
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
