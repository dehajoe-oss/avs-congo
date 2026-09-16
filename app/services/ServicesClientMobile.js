'use client'
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight, Check, Globe, ShoppingCart, Cpu, Server, Palette, Wrench, 
  Zap, Timer, MessageCircle, Map, MapPin, Sprout, Stethoscope, ShieldCheck, 
  Award, Package, Sparkles, GraduationCap, Layers, ChevronRight, ChevronDown 
} from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { GhostTitle, LazyImg, PageCTA, GreenUnderline, HoverSlideText } from '@/components/ui/index'
import ConversionMarquee from '@/components/ui/ConversionMarquee'
import AuroraHero from '@/components/ui/AuroraHero'
import { DOMAINS, SERVICES } from '@/lib/data'

const ICON_MAP = { 
  Globe, ShoppingCart, Cpu, Server, Palette, Wrench, Map, MapPin,
  Sprout, Stethoscope, ShieldCheck, Award, Package, Sparkles, GraduationCap, Layers
}

const TECH_STACK = [
  { cat: 'Domaine Agro', items: ['Maraîchage & Vivrier', 'Séchage & Conservation', 'Cosmétique Bio', 'Systèmes Irrigation'] },
  { cat: 'Domaine Véto', items: ['Clinique 24/7 & Soins', 'Poussins Cobb 500', 'Provenderie Certifiée', 'Analyses Bromato'] },
  { cat: 'Domaine Services', items: ['Audits ISO & HACCP', 'Fermes-Écoles Pilotes', 'Formations Pro', 'Import / Export'] },
]

function HeroServices() {
  return (
    <section style={{ height: '100vh', minHeight: 580, width: '100%', background: '#0c0a09', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      <AuroraHero labels={[]} />
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, padding: '72px 5% 0' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.7rem', fontWeight: 700, color: '#b47027', letterSpacing: '.25em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
            Agro · Véto · Services Congo
          </div>
          <h1 style={{ position: 'relative', fontSize: 'clamp(2.2rem,8vw,3.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", color: '#fff', letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1.2rem', textShadow: '0 2px 16px rgba(0,0,0,.85)' }}>
            <GhostTitle text="3 DOMAINES" />
            NOS 3{' '}
            <GreenUnderline><span style={{ color: '#f5c57a', textShadow: '0 2px 18px rgba(0,0,0,.9), 0 0 3px rgba(0,0,0,.9)' }}>DOMAINES</span></GreenUnderline>
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,.6)', lineHeight: 1.65, maxWidth: 540, margin: '0 auto 2rem' }}>
            Productions agricoles, santé animale & provenderie, management QHSE et formations certifiantes à Pointe-Noire.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', justifyContent: 'center' }}>
            <a href="#domaines-section" className="btn-raised" style={{ fontSize: '0.9rem', padding: '.75rem 1.4rem' }}>
              <HoverSlideText text="Explorer les domaines" /> <ArrowRight size={15} />
            </a>
            <a href="https://wa.me/242069677567" target="_blank" rel="noreferrer" className="btn-ghost" style={{ fontSize: '0.9rem', padding: '.75rem 1.4rem', background: 'rgba(3,8,6,.55)', backdropFilter: 'blur(6px)', color: '#f5c57a', borderColor: '#b47027' }}>
              <HoverSlideText text="WhatsApp Direct" /> <MessageCircle size={15} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function DomainesSectionMobile() {
  const T = useTheme()
  const [selectedDomain, setSelectedDomain] = useState('agro')

  const activeDom = DOMAINS.find(d => d.id === selectedDomain) || DOMAINS[0]
  const DomIcon = ICON_MAP[activeDom.icon] || Award

  return (
    <section id="domaines-section" style={{ padding: '5rem 5%', background: T.bg, scrollMarginTop: '60px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.7rem', fontWeight: 700, color: '#b47027', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          Pôles Stratégiques
        </div>
        <h2 style={{ fontSize: 'clamp(1.9rem,6vw,2.8rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", color: T.textMain, margin: 0, letterSpacing: '-.03em' }}>
          Les 3 Domaines <GreenUnderline><span className="text-gradient">AVS</span></GreenUnderline>
        </h2>
      </div>

      {/* Boutons Sélecteurs de Domaines */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '2rem' }}>
        {DOMAINS.map(d => {
          const isSel = selectedDomain === d.id
          const Ic = ICON_MAP[d.icon] || Award
          return (
            <button
              key={d.id}
              onClick={() => setSelectedDomain(d.id)}
              style={{
                padding: '12px 6px',
                borderRadius: 14,
                border: `1.5px solid ${isSel ? d.color : T.border}`,
                background: isSel ? (T.light ? '#ffffff' : '#1e1b18') : 'transparent',
                color: isSel ? T.textMain : T.textMuted,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: isSel ? `0 6px 18px ${d.color}25` : 'none',
              }}
            >
              <div style={{ color: d.color }}>
                <Ic size={18} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: "'Poppins', sans-serif" }}>
                {d.code}
              </span>
            </button>
          )
        })}
      </div>

      {/* Détail du domaine mobile */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDom.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          style={{
            padding: '1.6rem 1.4rem',
            borderRadius: 20,
            background: T.card,
            border: `1px solid ${T.border}`,
            boxShadow: '0 8px 30px rgba(0,0,0,.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.2rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${activeDom.color}22`, color: activeDom.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <DomIcon size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: activeDom.color, letterSpacing: '.1em' }}>
                {activeDom.n} · PÔLE OFFICIEL
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: T.textMain, margin: '2px 0 0', fontFamily: "'Poppins', sans-serif" }}>
                {activeDom.title}
              </h3>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: T.textSub, lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {activeDom.desc}
          </p>

          {/* Liste des divisions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {activeDom.branches.map((b) => (
              <div
                key={b.id}
                style={{
                  padding: '1.1rem',
                  borderRadius: 14,
                  background: T.light ? '#ffffff' : '#141110',
                  border: `1px solid ${T.border}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: activeDom.color }} />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: T.textMain, margin: 0 }}>
                    {b.title}
                  </h4>
                </div>
                <p style={{ fontSize: '0.78rem', color: T.textSub, lineHeight: 1.5, margin: '0 0 10px' }}>
                  {b.desc}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {b.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: T.textSub }}>
                      <Check size={12} style={{ color: activeDom.color, flexShrink: 0 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <a
            href={`https://wa.me/242069677567?text=${encodeURIComponent(`Bonjour Agro Véto Services, je souhaite échanger avec le Dr POUTYA sur le ${activeDom.title}`)}`}
            target="_blank"
            rel="noreferrer"
            className="btn-raised"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
          >
            <HoverSlideText text={`Consulter sur le ${activeDom.code}`} /> <ArrowRight size={14} />
          </a>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

function ServicesListMobile() {
  const T = useTheme()
  const [active, setActive] = useState(0)
  const svc = SERVICES[active] || SERVICES[0]
  const Icon = ICON_MAP[svc.icon] || Globe

  return (
    <section id="services-list" style={{ padding: '5rem 5%', background: T.bgAlt }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.7rem', fontWeight: 700, color: '#b47027', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          Interventions de terrain
        </div>
        <h2 style={{ fontSize: 'clamp(1.9rem,6vw,2.8rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", color: T.textMain, margin: 0, letterSpacing: '-.03em' }}>
          Prestations <GreenUnderline><span className="text-gradient">détaillées</span></GreenUnderline>
        </h2>
      </div>

      {/* Tabs horizontaux défilables */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1.5rem', scrollbarWidth: 'none' }}>
        {SERVICES.map((s, i) => {
          const isActive = active === i
          const Ic = ICON_MAP[s.icon] || Globe
          return (
            <button
              key={s.title}
              onClick={() => setActive(i)}
              style={{
                flexShrink: 0,
                padding: '8px 14px',
                borderRadius: 100,
                border: '1px solid',
                borderColor: isActive ? T.green : T.border,
                background: isActive ? '#b47027' : 'transparent',
                color: isActive ? '#fff' : T.textSub,
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Ic size={13} />
              <span>{s.title}</span>
            </button>
          )
        })}
      </div>

      {/* Carte de la prestation active */}
      <div style={{ borderRadius: 20, overflow: 'hidden', background: T.card, border: `1px solid ${T.border}`, padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(180, 112, 39, .12)', color: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: T.greenSub, letterSpacing: '.1em', textTransform: 'uppercase' }}>
              {svc.domainTitle}
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: T.textMain, margin: 0 }}>
              {svc.title}
            </h3>
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: T.textSub, lineHeight: 1.6, marginBottom: '1.2rem' }}>
          {svc.desc}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1.4rem' }}>
          {svc.features.map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: T.textSub }}>
              <Check size={13} style={{ color: T.green, flexShrink: 0 }} />
              <span>{f}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: '1rem', borderRadius: 14, background: T.light ? 'rgba(180,112,39,.05)' : 'rgba(180,112,39,.08)', border: `1px solid ${T.border}`, marginBottom: '1.2rem' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: T.green, marginBottom: '2px' }}>
            {svc.price}
          </div>
          <div style={{ fontSize: '0.65rem', color: T.textMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Timer size={11} style={{ color: T.green }} />Délai : {svc.del}
          </div>
        </div>

        <a
          href={`https://wa.me/242069677567?text=${encodeURIComponent(`Bonjour Agro Véto Services, je souhaite un devis pour : ${svc.title}`)}`}
          target="_blank"
          rel="noreferrer"
          className="btn-raised"
          style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
        >
          <HoverSlideText text="Commander / Devis" /> <ArrowRight size={14} />
        </a>
      </div>
    </section>
  )
}

function TechSectionMobile() {
  const T = useTheme()
  return (
    <section style={{ padding: '4rem 5%', background: T.bg }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", color: T.textMain, margin: 0 }}>
          Standards <GreenUnderline><span className="text-gradient">éprouvés</span></GreenUnderline>
        </h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {TECH_STACK.map(({ cat, items }) => (
          <div key={cat} style={{ padding: '1.2rem', borderRadius: 14, border: `1px solid ${T.border}`, background: T.card }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: T.green, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '0.6rem' }}>
              {cat}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {items.map(item => (
                <span key={item} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 100, background: T.light ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)', color: T.textSub }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function ServicesClientMobile() {
  return (
    <div>
      <HeroServices />
      <DomainesSectionMobile />
      <ServicesListMobile />
      <ConversionMarquee />
      <TechSectionMobile />
      <PageCTA message="Besoin d'un accompagnement personnalisé pour votre exploitation ou votre entreprise ?" cta="Contact direct" />
    </div>
  )
}