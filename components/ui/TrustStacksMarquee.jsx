'use client'
/**
 * TrustStacksMarquee — "TRUST & STACKS"
 * Remplace le MarqueeStrip après ArchiveTunnelSection (desktop)
 * / ProjectsSection (mobile).
 *
 * Objectif : prouver la crédibilité technique + montrer les
 * avantages concrets.
 *   Ligne 1 — Stack technique, bande sombre tournée en 2D,
 *             défile à gauche, survol → logo réel depuis /icons.
 *   Ligne 2 — Avantages clés, bande vert plein tournée à
 *             l'inverse, défile à droite. Même taille de texte
 *             que la Ligne 1.
 *   Ligne 3 — Métriques de performance, bande plate statique,
 *             même calibrage typographique.
 */
import { Truck, Palette, Search, Smartphone, Headset, ShieldCheck } from 'lucide-react'
import './TrustStacksMarquee.css'

const STACK = [
  { name: 'Cobb 500 (Chair)',         icon: '/images/logo.webp' },
  { name: 'Lohmann Brown (Ponte)',    icon: '/images/logo.webp' },
  { name: 'Méthode HACCP',            icon: '/images/logo.webp' },
  { name: 'Norme ISO 22000',          icon: '/images/logo.webp' },
  { name: 'Norme ISO 9001',           icon: '/images/logo.webp' },
  { name: 'Norme ISO 14001',          icon: '/images/logo.webp' },
  { name: 'Contrôle Bromatologique',  icon: '/images/logo.webp' },
  { name: 'Provenderie Haute Énergie',icon: '/images/logo.webp' },
  { name: 'Prophylaxie Vétérinaire',  icon: '/images/logo.webp' },
  { name: 'Ferme-École Immersive',    icon: '/images/logo.webp' },
  { name: 'Biosécurité & Virucides',  icon: '/images/logo.webp' },
  { name: 'Statuts OHADA Congo',      icon: '/images/logo.webp' },
]

const BADGES = [
  { label: 'Urgences Vétérinaires 24/7',  Icon: Truck },
  { label: 'Poussins Cobb 500 Vaccinés',    Icon: Palette },
  { label: 'Aliments Contrôlés en Labo',          Icon: Search },
  { label: 'MTN & Airtel Money',         Icon: Smartphone },
  { label: 'Normes HACCP & ISO 22000',          Icon: Headset },
  { label: 'Ferme-École Pratique',   Icon: ShieldCheck },
]

const METRICS = [
  { value: '6',  label: "Pôles d'expertise" },
  { value: '+500',  label: 'Éleveurs & PME' },
  { value: '99%', label: 'Conformité Sanitaire' },
  { value: '24/7',  label: 'Permanence Clinique' },
  { value: 'SARLU',  label: 'OHADA Congo' },
]

function StackBand() {
  const set = (keySuffix, hidden) => (
    <div className="ts-band-set" aria-hidden={hidden || undefined}>
      {STACK.map((t, i) => (
        <span className="ts-stack-item" key={`${keySuffix}-${i}`}>
          <span className="ts-stack-icon">
            <span className="ts-dot" />
            <span className="ts-icon-chip">
              <img src={t.icon} alt="" className="ts-icon-img" loading="lazy" />
            </span>
          </span>
          <span className="ts-stack-name">{t.name}</span>
        </span>
      ))}
    </div>
  )
  return (
    <div className="ts-band ts-band--stack">
      <div className="ts-band-track ts-band-track--left">
        {set('a', false)}
        {set('b', true)}
      </div>
    </div>
  )
}

function BadgesBand() {
  const set = (keySuffix, hidden) => (
    <div className="ts-band-set" aria-hidden={hidden || undefined}>
      {BADGES.map((b, i) => (
        <span className="ts-badge-item" key={`${keySuffix}-${i}`}>
          <b.Icon size={18} strokeWidth={2.4} />
          {b.label}
          <span className="ts-badge-sep">•</span>
        </span>
      ))}
    </div>
  )
  return (
    <div className="ts-band ts-band--badges">
      <div className="ts-band-track ts-band-track--right">
        {set('a', false)}
        {set('b', true)}
      </div>
    </div>
  )
}

function MetricsBand() {
  const set = (keySuffix, hidden) => (
    <div className="ts-band-set" aria-hidden={hidden || undefined}>
      {METRICS.map((m, i) => (
        <span className="ts-metric" key={`${keySuffix}-${i}`}>
          <strong>{m.value}</strong>{m.label}
          <span className="ts-metric-sep">•</span>
        </span>
      ))}
    </div>
  )

  return (
    <div className="ts-band ts-band--metrics">
      <div className="ts-band-track ts-band-track--left">
        {set('a', false)}
        {set('b', true)}
      </div>
    </div>
  )
}

export default function TrustStacksMarquee() {
  return (
    <section className="ts-section" aria-label="Expertise et engagements Agro Véto Services">
      <div className="ts-glow" />

      <span className="ts-eyebrow">Notre expertise · Nos engagements · Nos standards de qualité</span>

      <StackBand />
      <BadgesBand />
      <MetricsBand />
    </section>
  )
}
