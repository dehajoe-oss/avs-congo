'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight, Check, Globe, ShoppingCart, Cpu, Server, Palette, Wrench, 
  Zap, Timer, MessageCircle, Map, MapPin, Sprout, Stethoscope, ShieldCheck, 
  Award, Package, Sparkles, GraduationCap, Layers, ChevronRight 
} from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { GhostTitle, LazyImg, PageCTA, LaserBeam, GreenUnderline, HoverSlideText } from '@/components/ui/index'
import ConversionMarquee from '@/components/ui/ConversionMarquee'
import AuroraHero from '@/components/ui/AuroraHero'
import { DOMAINS, SERVICES } from '@/lib/data'

const ICON_MAP = { 
  Globe, ShoppingCart, Cpu, Server, Palette, Wrench, Map, MapPin,
  Sprout, Stethoscope, ShieldCheck, Award, Package, Sparkles, GraduationCap, Layers
}

const TECH_STACK = [
  { cat: 'Domaine Agro', items: ['Maraîchage & Vivrier', 'Séchage & Conservation', 'Cosmétique Naturelle', 'Irrigation Goutte-à-Goutte'] },
  { cat: 'Domaine Véto', items: ['Clinique 24/7 & Chirurgie', 'Poussins Cobb 500', 'Provenderie Haute Énergie', 'Analyses Bromatologiques'] },
  { cat: 'Domaine Services', items: ['ISO 9001 / 22000', 'Démarche HACCP & PMS', 'Fermes-Écoles Pilotes', 'Commerce & Import/Export'] },
  { cat: 'Formations & Compétences', items: ['Conduite d\'Élevage', 'Hygiène Alimentaire', 'Sécurité au Travail (HSE)', 'Fabrication Détergents'] },
]

/* ────────────────────────────────────────────────
   HERO — Gabarit Helious "Page Title"
──────────────────────────────────────────────── */
function HeroServices() {
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
      <div ref={layerBgRef} style={{ position: 'absolute', inset: '-8%', zIndex: 1, transition: 'transform .1s ease-out' }}>
        <AuroraHero labels={[]} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(12, 10, 9, 0.85)' }} />
      </div>

      {/* Titre géant bas-gauche + bloc texte centré verticalement à droite */}
      <div ref={layerMidRef} className="hr-row" style={{ transition: 'transform .1s ease-out' }}>
        <motion.h1 className="hr-title" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: 'easeOut' }}>
          <GhostTitle text="DOMAINES" />
          DOMAINES
        </motion.h1>

        <div className="hr-side">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .2 }}>
            <p className="hr-kicker">3 Piliers Stratégiques</p>
            <p className="hr-desc">
              <strong>Agro · Véto · Services</strong> — Une architecture intégrée pour bâtir une agriculture moderne, sécuriser la santé animale et hisser les entreprises vers les standards internationaux de qualité.
            </p>
          </motion.div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1.5rem' }}>
            <a href="#domaines-showcase" className="btn-raised" style={{ fontSize: '0.9rem' }}>
              <HoverSlideText text="Explorer les 3 domaines" /> <ArrowRight size={14} />
            </a>
            <a href="https://wa.me/242069677567" target="_blank" rel="noreferrer" className="btn-ghost" style={{ fontSize: '0.9rem', color: '#f5c57a', borderColor: '#b47027' }}>
              <HoverSlideText text="Conseil direct" /> <MessageCircle size={14} />
            </a>
          </div>
        </div>
      </div>

      <div ref={layerForeRef} style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', transition: 'transform .1s ease-out' }}>
        {[{left:'8%',top:'25%',s:4,op:.18,dur:3.8,dy:0},{left:'22%',top:'68%',s:3,op:.11,dur:5.1,dy:1.2},{left:'60%',top:'22%',s:4,op:.20,dur:4.4,dy:0.6},{left:'75%',top:'70%',s:3,op:.09,dur:6.2,dy:1.8},{left:'88%',top:'15%',s:4,op:.15,dur:3.2,dy:0.3}].map((p,i) => (
          <motion.div key={i} style={{ position:'absolute', width:p.s, height:p.s, borderRadius:'50%', background:'#b47027', left:p.left, top:p.top, opacity:p.op }}
            animate={{ y:[0,-18,0] }} transition={{ duration:p.dur, repeat:Infinity, ease:'easeInOut', delay:p.dy }} />
        ))}
      </div>

      <style>{`
        .hr-row { position: relative; z-index: 10; height: 100%; }
        .hr-title {
          position: absolute; left: 8vw; bottom: 4.5rem; margin: 0;
          font-family: 'Poppins', sans-serif; font-weight: 800;
          font-size: clamp(4rem, 11vw, 13rem); line-height: .92; letter-spacing: -.04em;
          color: rgba(255,255,255,.95);
        }
        .hr-side {
          position: absolute; right: 8vw; top: 0; bottom: 0;
          margin: auto 0; max-width: 380px; height: fit-content;
        }
        .hr-kicker {
          font-family: 'Poppins', sans-serif; font-size: .65rem; font-weight: 700;
          color: #b47027; letter-spacing: .3em; text-transform: uppercase; margin: 0 0 .9rem;
        }
        .hr-desc { font-size: .95rem; color: rgba(255,255,255,.68); line-height: 1.7; margin: 0; }
      `}</style>
    </section>
  )
}

/* ────────────────────────────────────────────────
   LES 3 DOMAINES STRATÉGIQUES (SHOWCASE INTERACTIF)
──────────────────────────────────────────────── */
function DomainesShowcase() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [activeDomainIndex, setActiveDomainIndex] = useState(0)

  const activeDomain = DOMAINS[activeDomainIndex] || DOMAINS[0]
  const IconActive = ICON_MAP[activeDomain.icon] || Award

  return (
    <section id="domaines-showcase" ref={ref} style={{ padding: '7rem 5%', background: T.bg, scrollMarginTop: '80px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        
        {/* En-tête */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.75rem', fontWeight: 700, color: '#b47027', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Architecture d'Activités & Marques AVS Congo
          </div>
          <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.6rem,5.5vw,4.5rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", color: T.textMain, letterSpacing: '-.03em', lineHeight: 1.1 }}>
            <GhostTitle text="3 DOMAINES D'EXCELLENCE" />
            Nos 3 Domaines <GreenUnderline><span className="text-gradient">d'Excellence</span></GreenUnderline>
          </h2>
          <p style={{ maxWidth: 700, margin: '1.2rem auto 0', color: T.textSub, fontSize: '0.95rem', lineHeight: 1.7 }}>
            Cliquez sur un domaine pour explorer ses divisions, ses filières de production et ses prestations de terrain.
          </p>
        </motion.div>

        {/* Sélecteur des 3 Domaines (Cartes onglets hautes performances) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3.5rem' }}>
          {DOMAINS.map((dom, i) => {
            const isSelected = activeDomainIndex === i
            const DomIcon = ICON_MAP[dom.icon] || Award
            return (
              <button
                key={dom.id}
                onClick={() => setActiveDomainIndex(i)}
                style={{
                  textAlign: 'left',
                  padding: '1.6rem 1.8rem',
                  borderRadius: 20,
                  border: isSelected ? `2px solid ${dom.color}` : `1px solid ${T.border}`,
                  background: isSelected 
                    ? (T.light ? 'rgba(255,255,255,0.98)' : 'rgba(28,25,23,0.98)') 
                    : (T.light ? 'rgba(255,255,255,0.45)' : 'rgba(18,15,13,0.45)'),
                  boxShadow: isSelected ? `0 12px 36px ${dom.color}25` : 'none',
                  cursor: 'pointer',
                  transition: 'all .25s ease',
                  transform: isSelected ? 'translateY(-3px)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 12,
                    background: isSelected ? dom.color : 'rgba(180, 112, 39, 0.1)',
                    color: isSelected ? '#fff' : dom.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all .25s',
                  }}>
                    <DomIcon size={22} />
                  </div>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.7rem', fontWeight: 800, color: isSelected ? dom.color : T.textMuted, letterSpacing: '.15em' }}>
                    {dom.n}
                  </span>
                </div>

                <div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.25rem', fontWeight: 900, color: T.textMain, marginBottom: '4px' }}>
                    {dom.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: T.textSub, lineHeight: 1.45 }}>
                    {dom.tagline}
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: isSelected ? dom.color : T.textMuted }}>
                  <span>{dom.branches.length} divisions d'activité</span>
                  <ChevronRight size={14} style={{ transform: isSelected ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }} />
                </div>
              </button>
            )
          })}
        </div>

        {/* Détail du Domaine Actif */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDomain.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            style={{
              padding: '2.5rem',
              borderRadius: 24,
              background: T.card,
              border: `1px solid ${T.border}`,
              boxShadow: '0 20px 60px rgba(0,0,0,.25)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Bannière titre du domaine */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '2.5rem', paddingBottom: '1.8rem', borderBottom: `1px solid ${T.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <div style={{ width: 62, height: 62, borderRadius: 16, background: `${activeDomain.color}22`, border: `1px solid ${activeDomain.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: activeDomain.color }}>
                  <IconActive size={32} />
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: activeDomain.color, letterSpacing: '.15em', textTransform: 'uppercase' }}>
                    Pôle Stratégique {activeDomain.code}
                  </span>
                  <h3 style={{ fontSize: '2rem', fontWeight: 900, color: T.textMain, margin: '2px 0 0', fontFamily: "'Poppins', sans-serif" }}>
                    {activeDomain.title}
                  </h3>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                <a
                  href={`https://wa.me/242069677567?text=${encodeURIComponent(`Bonjour Dr POUTYA, je souhaite des informations sur les activités du ${activeDomain.title}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-raised"
                  style={{ fontSize: '0.85rem' }}
                >
                  <HoverSlideText text={`Échanger sur le ${activeDomain.code}`} /> <ArrowRight size={14} />
                </a>
                <Link
                  href="/contact"
                  className="btn-ghost"
                  style={{ fontSize: '0.85rem' }}
                >
                  <HoverSlideText text="Demander un devis" />
                </Link>
              </div>
            </div>

            {/* Description générale du domaine */}
            <p style={{ fontSize: '1.02rem', color: T.textSub, lineHeight: 1.8, maxWidth: 900, marginBottom: '2.5rem' }}>
              {activeDomain.desc}
            </p>

            {/* Grille des divisions / branches du domaine */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.4rem' }}>
              {activeDomain.branches.map((branch, bi) => (
                <motion.div
                  key={branch.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: bi * 0.06 }}
                  style={{
                    padding: '1.6rem',
                    borderRadius: 16,
                    background: T.light ? '#ffffff' : '#141110',
                    border: `1px solid ${T.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: activeDomain.color }} />
                      <h4 style={{ fontSize: '1.12rem', fontWeight: 800, color: T.textMain, margin: 0, fontFamily: "'Poppins', sans-serif" }}>
                        {branch.title}
                      </h4>
                    </div>

                    <p style={{ fontSize: '0.83rem', color: T.textSub, lineHeight: 1.6, marginBottom: '1.2rem' }}>
                      {branch.desc}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.4rem' }}>
                      {branch.items.map((item, ii) => (
                        <div key={ii} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: T.textSub }}>
                          <Check size={13} style={{ color: activeDomain.color, flexShrink: 0 }} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/242069677567?text=${encodeURIComponent(`Bonjour Agro Véto Services, je souhaite échanger sur la division : ${branch.title}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: activeDomain.color,
                      textDecoration: 'none',
                      marginTop: '0.5rem',
                    }}
                  >
                    <span>En savoir plus / Devis</span>
                    <ArrowRight size={13} />
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────
   LISTE DES SERVICES & PRESTATIONS DÉTAILLÉES
──────────────────────────────────────────────── */
function ServicesList() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [active, setActive] = useState(0)
  const svc = SERVICES[active]
  const Icon = ICON_MAP[svc.icon] || Globe

  return (
    <section id="services-list" ref={ref} style={{ padding: '7rem 5%', background: T.bgAlt }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.75rem', fontWeight: 700, color: '#b47027', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Prestations de Terrain & Devis Immédiats
          </div>
          <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.6rem,5.5vw,4.5rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", color: T.textMain, letterSpacing: '-.04em', lineHeight: 1.08 }}>
            <GhostTitle text="PRESTATIONS DÉTAILLÉES" />
            Prestations & <GreenUnderline><span className="text-gradient">Interventions</span></GreenUnderline>
          </h2>
        </motion.div>

        {/* Onglets des prestations */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', justifyContent: 'center', marginBottom: '3rem' }}>
          {SERVICES.map((s, i) => {
            const Ic = ICON_MAP[s.icon] || Globe
            const isActive = active === i
            return (
              <button 
                key={s.title} 
                onClick={() => setActive(i)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '.45rem', 
                  padding: '.55rem 1.2rem', borderRadius: 100, 
                  border: '1px solid', borderColor: isActive ? T.green : T.border, 
                  background: isActive ? '#b47027' : 'transparent', 
                  color: isActive ? '#fff' : T.textSub, 
                  fontFamily: "'Poppins', sans-serif", fontSize: '.82rem', 
                  fontWeight: 600, cursor: 'pointer', transition: 'all .22s' 
                }}
              >
                <Ic size={14} />
                <span>{s.title}</span>
                <span style={{ fontSize: '.65rem', opacity: 0.7, padding: '1px 5px', borderRadius: 4, background: isActive ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.08)' }}>
                  {s.domainCode}
                </span>
              </button>
            )
          })}
        </div>

        <style>{`
          .svc-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: center; }
          @media (max-width: 768px) {
            .svc-detail-grid { display: flex; flex-direction: column; gap: 1.5rem; }
            .svc-detail-img  { order: 1; width: 100%; height: auto !important; }
            .svc-detail-body { order: 2; width: 100%; }
          }
        `}</style>

        {/* Détail de la prestation sélectionnée */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .35 }}
            className="svc-detail-grid">
            {/* Image */}
            <div className="svc-detail-img" style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${T.border}`, boxShadow: '8px 8px 40px rgba(0,0,0,.3)', aspectRatio: '1 / 1', height: 'auto' }}>
              <LazyImg src={svc.img} alt={svc.title} style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '1 / 1' }}
                placeholder={<div style={{ aspectRatio: '1 / 1', background: '#1c1917', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={48} style={{ color: 'rgba(180, 112, 39,.3)' }} /></div>} />
            </div>

            {/* Contenu */}
            <div className="svc-detail-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                <div style={{ width: 54, height: 54, borderRadius: 14, background: 'rgba(180, 112, 39,.12)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={24} style={{ color: T.green }} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.68rem', fontWeight: 700, color: T.greenSub, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                    {svc.n} · {svc.domainTitle}
                  </div>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: T.textMain, fontFamily: "'Poppins', sans-serif", margin: '2px 0 0' }}>
                    {svc.title}
                  </h3>
                </div>
              </div>

              <p style={{ fontSize: '.92rem', color: T.textSub, lineHeight: 1.75, marginBottom: '1.5rem' }}>{svc.desc}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginBottom: '1.8rem' }}>
                {svc.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '.6rem', fontSize: '.85rem', color: T.textSub }}>
                    <Check size={14} style={{ color: T.green, flexShrink: 0 }} />{f}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.2rem', borderRadius: 12, background: T.light ? 'rgba(169, 106, 38,.05)' : 'rgba(180, 112, 39,.06)', border: `1px solid ${T.border}`, marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.9rem', fontWeight: 800, color: T.green }}>{svc.price}</div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.6rem', color: T.textMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Timer size={10} style={{ color: T.green }} />Délai : {svc.del}
                  </div>
                </div>
                <a href={`https://wa.me/242069677567?text=${encodeURIComponent(`Bonjour Agro Véto Services, je souhaite commander / demander un devis pour : ${svc.title}`)}`} target="_blank" rel="noreferrer" className="btn-raised">
                  <HoverSlideText text="Demander un devis" /> <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

function TechSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <section ref={ref} style={{ padding: '7rem 5%', background: T.bg }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.6rem,5.5vw,4.5rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", color: T.textMain, letterSpacing: '-.04em', lineHeight: 1.08 }}>
            <GhostTitle text="NORMES & STANDARDS" />
            Normes & <GreenUnderline><span className="text-gradient">Standards Éprouvés</span></GreenUnderline>
          </h2>
          <p style={{ maxWidth: 640, margin: '1rem auto 0', color: T.textSub, fontSize: '0.9rem' }}>
            Une exigence scientifique rigoureuse certifiée par le laboratoire et validée sur les fermes partenaires du Kouilou.
          </p>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
          {TECH_STACK.map(({ cat, items }, i) => (
            <motion.div key={cat} className="sku-card"
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .08 }}
              style={{ padding: '1.5rem', borderRadius: 16, border: `1px solid ${T.border}`, background: T.card }}>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.75rem', fontWeight: 800, color: T.green, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: `1px solid ${T.border}`, paddingBottom: '.6rem' }}>{cat}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.45rem' }}>
                {items.map(item => (
                  <span key={item} style={{ fontSize: '.82rem', color: T.textSub, display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.green, flexShrink: 0 }} />{item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function ServicesPage() {
  return (
    <div>
      <HeroServices />
      <DomainesShowcase />
      <ServicesList />
      <ConversionMarquee />
      <TechSection />
      <PageCTA message="Prêt à développer votre projet agropastoral ou certifier votre entreprise ? Obtenez un accompagnement sur-mesure." cta="Obtenir mon devis" />
    </div>
  )
}