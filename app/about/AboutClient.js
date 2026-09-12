'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Users, Monitor, Code, Check, Award, Heart, Globe, Zap, Star, Target, Rocket, MessageCircle, ExternalLink, ShieldCheck, GraduationCap } from 'lucide-react'
import TrustStacksMarquee from '@/components/ui/TrustStacksMarquee'

/* ─── BlurReveal ─────────────────────────────────────────── */
function BlurReveal({ children, delay = 0, direction = 'up', style = {}, once = true }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-60px' })
  const dirMap = { up: { y: 40, x: 0 }, right: { y: 0, x: 40 }, down: { y: -40, x: 0 }, left: { y: 0, x: -40 } }
  const off = dirMap[direction] || { y: 40, x: 0 }
  return (
    <motion.div ref={ref} style={style}
      initial={{ opacity: 0, filter: 'blur(12px)', ...off }}
      animate={inView ? { opacity: 1, filter: 'blur(0px)', x: 0, y: 0 } : {}}
      transition={{ duration: 0.85, ease: [0.2, 0.8, 0.2, 1], delay }}>
      {children}
    </motion.div>
  )
}


/* ─── WordRevealP — scroll-reveal mot par mot + tilt ────── */
function useWordReveal(sectionRef, textRef, wordsRef) {
  useEffect(() => {
    const container = sectionRef.current
    const textEl    = textRef.current
    if (!container || !textEl) return
    const onScroll = () => {
      const rect     = container.getBoundingClientRect()
      const winH     = window.innerHeight
      const progress = Math.max(0, Math.min(1, (winH - rect.top) / (winH + container.offsetHeight)))
      textEl.style.transform = `rotate(${3 * (1 - Math.min(progress / 0.20, 1))}deg)`
      textEl.style.opacity   = String(Math.min(1, 0.35 + progress * 1.4))
      const words = wordsRef.current
      if (!words.length) return
      const wProg = Math.max(0, Math.min(1, (progress - 0.05) / (0.50 - 0.05)))
      words.forEach((span, i) => {
        if (!span) return
        const local = Math.max(0, Math.min(1, (wProg - (i / (words.length - 1)) * 0.76) / 0.26))
        span.style.opacity = String(0.08 + local * 0.92)
        span.style.filter  = `blur(${((1 - local) * 9).toFixed(1)}px)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
}

function WordRevealP({ text, greenWords = [], sectionRef, extraStyle = {} }) {
  const textRef  = useRef(null)
  const wordsRef = useRef([])
  const green    = new Set(greenWords)
  useWordReveal(sectionRef, textRef, wordsRef)
  return (
    <p ref={textRef} style={{
      fontFamily: "'Poppins', sans-serif",
      fontSize: 'clamp(1.6rem,3.2vw,2.6rem)',
      fontWeight: 700,
      lineHeight: 1.32,
      paddingLeft: 'var(--body-indent)',
      paddingRight: 'var(--body-indent)',
      transformOrigin: '0% 50%',
      transition: 'transform .05s linear',
      margin: 0,
      ...extraStyle,
    }}>
      {text.split(' ').map((word, i) => (
        <span key={i} ref={el => { wordsRef.current[i] = el }}
          style={{ display: 'inline-block', marginRight: '0.28em', opacity: 0.08,
            filter: 'blur(9px)',
            color: green.has(word) ? '#b47027' : 'inherit' }}>
          {word}
        </span>
      ))}
    </p>
  )
}

/* ─── TiltCard ───────────────────────────────────────────── */
function TiltCard({ children, style = {}, intensity = 12, perspective = 900 }) {
  const ref = useRef(null)
  const glowRef = useRef(null)
  const rafRef = useRef(null)
  const apply = (mx, my) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    const rx = ((my - r.top - r.height / 2) / (r.height / 2)) * -intensity
    const ry = ((mx - r.left - r.width / 2) / (r.width / 2)) * intensity
    const px = ((mx - r.left) / r.width) * 100
    const py = ((my - r.top) / r.height) * 100
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`
      el.style.transition = 'transform .07s linear'
      if (glowRef.current) { glowRef.current.style.background = `none`; glowRef.current.style.opacity = '1' }
    })
  }
  const reset = () => {
    const el = ref.current; if (!el) return
    cancelAnimationFrame(rafRef.current)
    el.style.transition = 'transform .45s cubic-bezier(.25,.46,.45,.94)'
    el.style.transform = `perspective(${perspective}px) rotateX(0) rotateY(0) scale3d(1,1,1)`
    if (glowRef.current) glowRef.current.style.opacity = '0'
  }
  return (
    <div ref={ref} style={{ ...style, transformStyle: 'preserve-3d', position: 'relative' }}
      onMouseMove={e => apply(e.clientX, e.clientY)} onMouseLeave={reset}>
      <div ref={glowRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0, transition: 'opacity .12s', borderRadius: 18 }} />
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>{children}</div>
    </div>
  )
}

import { useTheme } from '@/lib/theme'
import { GhostTitle, AnimatedCounter, LazyImg, GreenUnderline, PageCTA, HoverSlideText } from '@/components/ui/index'
import AuroraHero from '@/components/ui/AuroraHero'
import { STATS, PROJECTS } from '@/lib/data'
import { cld } from '@/lib/cloudinary'

const SKILLS = [
  'Médecine Vétérinaire & Chirurgie',
  'Management QHSE & Normes ISO',
  'Sécurité Sanitaire des Aliments & HACCP',
  'Provenderie & Nutrition Animale',
  'Analyses Bromatologiques',
  'Conduite d’Élevage Avicole & Porcin',
  'Biosécurité & Décontamination',
  'Formations Pratiques en Ferme-École',
  'Transformation Agroalimentaire'
]

const VALUES = [
  {
    icon: Award,
    title: 'Excellence scientifique & rigueur',
    desc: "Des protocoles vétérinaires éprouvés, des analyses fiables et des méthodes QHSE alignées sur les meilleures pratiques internationales.",
  },
  {
    icon: Heart,
    title: 'Éthique & bien-être animal',
    desc: "Le respect de l'animal, de l'environnement et de la santé publique au cœur de chaque intervention.",
  },
  {
    icon: Zap,
    title: 'Proximité & engagement terrain',
    desc: "Une écoute attentive, des interventions rapides et un accompagnement sur mesure auprès des éleveurs et des entreprises.",
  },
  {
    icon: Star,
    title: 'Innovation & durabilité',
    desc: "La valorisation des ressources locales, l'adoption de pratiques écoresponsables et la recherche constante de solutions durables.",
  },
]


/* ────────────────────────────────────────────────
   HERO
──────────────────────────────────────────────── */
function HeroAbout() {
  const T = useTheme()
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

      {/* Titre géant bas-gauche + bloc texte centré verticalement à droite — gabarit hero "page title" (réf. Helious) */}
      <div ref={layerMidRef} className="hr-row" style={{ transition: 'transform .1s ease-out' }}>
        <motion.h1 className="hr-title" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: 'easeOut' }}>
          <GhostTitle text="A.V.S." />
          A.V.S.
          
        </motion.h1>

        <div className="hr-side">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .2 }}>
            <p className="hr-kicker">De la santé animale</p>
            <p className="hr-desc"> à l'excellence QHSE.</p>
          </motion.div>
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
          font-size: clamp(4.5rem, 13vw, 15rem); line-height: .92; letter-spacing: -.04em;
          color: rgba(255,255,255,.95);
        }
        .hr-star {
          display: inline-block; position: relative; top: -.5em;
          margin-left: .15em; font-size: .3em; color: #b47027;
        }
        .hr-side {
          position: absolute; right: 8vw; top: 0; bottom: 0;
          margin: auto 0; max-width: 360px; height: fit-content;
        }
        .hr-kicker {
          font-family: 'Poppins', sans-serif; font-size: .62rem; font-weight: 700;
          color: #b47027; letter-spacing: .3em; text-transform: uppercase; margin: 0 0 .9rem;
        }
        .hr-desc { font-size: .95rem; color: rgba(255,255,255,.6); line-height: 1.7; margin: 0; }
      `}</style>
    </section>
  )
}


// ── ABOUT STATS SLIDE AUTO (miroir exact de App.jsx) ─────────
const ABOUT_STATS = [
  { target: 6,    suffix: '',  label: 'Pôles',      sub: "D'expertise agropastorale et vétérinaire intégrée" },
  { target: 500,  suffix: '+', label: 'Éleveurs',   sub: 'Producteurs et PME accompagnés au Congo' },
  { target: 99,   suffix: '%', label: 'Conformité', sub: 'Respect strict des normes HACCP & ISO' },
  { target: 24,   suffix: '/7',label: 'Urgences',   sub: 'Permanence clinique et assistance cheptel' },
  { target: 10,   suffix: '+', label: 'Années',     sub: "D'expertise vétérinaire et de direction QHSE" },
  { target: 98,   suffix: '%', label: 'Viabilité',  sub: 'Taux de survie garanti sur nos poussins Cobb 500' },
]
const SLIDE_MS = 4000

function AboutStatNumber({ target, suffix }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    setVal(0)
    const dur = 900
    const start = performance.now()
    let raf
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * target))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target])
  return <span>{val}{suffix}</span>
}

function AboutStatsSlide() {
  const T = useTheme()
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI(v => (v + 1) % ABOUT_STATS.length), SLIDE_MS)
    return () => clearInterval(id)
  }, [])
  const cur = ABOUT_STATS[i]
  return (
    <div style={{
      position: 'sticky', top: '14vh',
      display: 'flex', flexDirection: 'column', gap: '1.4rem',
      paddingTop: '.4rem',
      borderTop: '1px solid rgba(180, 112, 39,.18)',
    }}>
      {/* compteur */}
      <div>
        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.65rem', letterSpacing: '.15em', color: T.textMuted, opacity: .6 }}>
          {String(i + 1).padStart(2, '0')}/{String(ABOUT_STATS.length).padStart(2, '0')}
        </span>
      </div>
      {/* chiffre */}
      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '.3rem', minHeight: 92, animation: 'aboutStatIn .45s cubic-bezier(.22,1,.36,1)' }}>
        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(2.6rem,4vw,3.4rem)', fontWeight: 800, lineHeight: 1, color: T.textMain, letterSpacing: '-.02em' }}>
          <AboutStatNumber target={cur.target} suffix={cur.suffix} />
        </span>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.85rem', fontWeight: 700, letterSpacing: '.04em', color: T.textMain, margin: 0 }}>{cur.label}</p>
        <p style={{ fontSize: '.74rem', lineHeight: 1.5, color: T.textMuted, opacity: .75, margin: 0, maxWidth: 190 }}>{cur.sub}</p>
      </div>
      {/* barre de progression */}
      <div style={{ width: '100%', height: 2, borderRadius: 2, background: 'rgba(180, 112, 39,.16)', overflow: 'hidden', marginTop: '.4rem' }}>
        <span key={i} style={{
          display: 'block', height: '100%', width: '100%',
          background: '#b47027',
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
          animation: `aboutStatsProgress ${SLIDE_MS}ms linear forwards`,
        }} />
      </div>
      <style>{`
        @keyframes aboutStatIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes aboutStatsProgress { from { transform:scaleX(0); } to { transform:scaleX(1); } }
      `}</style>
    </div>
  )
}

// ── 2. VISION & MISSION (Section 11 officielle) ───────────────
function VisionMissionSection() {
  const T = useTheme()
  const sectionRef = useRef(null)

  return (
    <section ref={sectionRef} style={{ padding: '7rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto 3rem', textAlign: 'center' }}>
        <BlurReveal delay={0.12}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.3rem .9rem', borderRadius: 100, background: 'rgba(180, 112, 39,.1)', border: `1px solid ${T.border}`, fontFamily: "'Poppins', sans-serif", fontSize: '.72rem', fontWeight: 600, color: '#b47027', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '.08em' }}>
            Orientation Stratégique & Engagements
          </div>
          <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(3.2rem,6vw,5.2rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", color: T.textMain }}>
            <GhostTitle text="VISION & MISSION" />
            Vision & <GreenUnderline><span className="text-gradient">Mission</span></GreenUnderline>
          </h2>
        </BlurReveal>
      </div>

      <div className="stats-founder-grid">
        {/* COLONNE GAUCHE — slide auto stats */}
        <BlurReveal direction="left">
          <AboutStatsSlide />
        </BlurReveal>

        {/* COLONNE DROITE — Vision & Mission officielles */}
        <BlurReveal direction="right" delay={0.15}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="sku-card" style={{ padding: '2.4rem', borderRadius: 20, border: `1px solid ${T.border}`, background: T.surface }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.6rem', padding: '.25rem .75rem', borderRadius: 100, background: 'rgba(180, 112, 39,.12)', color: '#b47027', fontFamily: "'Poppins', sans-serif", fontSize: '.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '1rem' }}>
                <Target size={14} /> Notre Vision
              </div>
              <blockquote style={{ margin: 0, fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(1.1rem,2vw,1.35rem)', fontWeight: 700, fontStyle: 'italic', color: T.textMain, lineHeight: 1.55 }}>
                « Être la référence agropastorale, vétérinaire et QHSE en République du Congo et un acteur reconnu du développement durable en Afrique Centrale. »
              </blockquote>
            </div>

            <div className="sku-card" style={{ padding: '2.4rem', borderRadius: 20, border: `1px solid ${T.border}`, background: T.surface }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.6rem', padding: '.25rem .75rem', borderRadius: 100, background: 'rgba(180, 112, 39,.12)', color: '#b47027', fontFamily: "'Poppins', sans-serif", fontSize: '.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '1rem' }}>
                <Rocket size={14} /> Notre Mission
              </div>
              <blockquote style={{ margin: 0, fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(1.1rem,2vw,1.35rem)', fontWeight: 700, fontStyle: 'italic', color: T.textMain, lineHeight: 1.55 }}>
                « Accompagner durablement les éleveurs, les acteurs des filières agropastorales et les entreprises dans l'amélioration de leur productivité, la garantie de la sécurité sanitaire et l'atteinte des standards de qualité internationaux. »
              </blockquote>
            </div>
          </div>
        </BlurReveal>
      </div>
      <style>{`
        .stats-founder-grid {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: clamp(2.5rem,6vw,5rem);
          align-items: start;
          max-width: 1200px;
          margin: 0 auto;
        }
        @media(max-width:900px) {
          .stats-founder-grid { grid-template-columns: 1fr; gap: 3rem; }
        }
      `}</style>
    </section>
  )
}

// ── 3. PRÉSENTATION DE LA FONDATRICE (Section 13 officielle) ──
function FounderSection() {
  const T = useTheme()
  return (
    <section style={{ padding: '7rem 5%', background: T.bg, position: 'relative', overflow: 'hidden', borderTop: `1px solid ${T.border}` }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .18 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <BlurReveal delay={0.12}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.3rem .9rem', borderRadius: 100, background: 'rgba(180, 112, 39,.1)', border: `1px solid ${T.border}`, fontFamily: "'Poppins', sans-serif", fontSize: '.72rem', fontWeight: 600, color: '#b47027', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '.08em' }}>
              Leadership & Gouvernance
            </div>
            <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(3.2rem,6vw,5.2rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", color: T.textMain }}>
              <GhostTitle text="LA FONDATRICE" />
              La <GreenUnderline><span className="text-gradient">Fondatrice</span></GreenUnderline> & Direction
            </h2>
          </BlurReveal>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '3.5rem', alignItems: 'start' }}>
          <BlurReveal direction="left">
            <div style={{ borderRadius: 24, overflow: 'hidden', border: `1px solid ${T.border}`, background: T.surface, padding: '1.2rem', boxShadow: '0 12px 36px rgba(0,0,0,.25)' }}>
              <div style={{ height: 420, borderRadius: 18, overflow: 'hidden', position: 'relative', border: '1px solid rgba(180, 112, 39,.2)' }}>
                <LazyImg
                  src={cld('/images/dr_poutya.jpeg')}
                  alt="Dr POUTYA SAIZONOU Marie-Rose Edwige Rakié"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
                  placeholder={<div style={{ height: '100%', background: '#1c1917', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={48} style={{ color: 'rgba(180, 112, 39,.3)' }} /></div>}
                />
              </div>
              <div style={{ padding: '1.4rem .4rem .4rem' }}>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: '1.15rem', color: T.textMain, lineHeight: 1.25, marginBottom: '.3rem' }}>
                  Dr POUTYA SAIZONOU Marie-Rose Edwige Rakié
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.72rem', fontWeight: 700, color: '#b47027', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '1rem' }}>
                  Fondatrice & Directrice Générale
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginBottom: '1.2rem' }}>
                  <span style={{ padding: '.25rem .6rem', borderRadius: 6, background: 'rgba(180, 112, 39,.08)', border: `1px solid ${T.border}`, fontSize: '.68rem', color: T.textSub, fontWeight: 600 }}>Docteur Vétérinaire</span>
                  <span style={{ padding: '.25rem .6rem', borderRadius: 6, background: 'rgba(180, 112, 39,.08)', border: `1px solid ${T.border}`, fontSize: '.68rem', color: T.textSub, fontWeight: 600 }}>Spécialiste QHSE</span>
                  <span style={{ padding: '.25rem .6rem', borderRadius: 6, background: 'rgba(180, 112, 39,.08)', border: `1px solid ${T.border}`, fontSize: '.68rem', color: T.textSub, fontWeight: 600 }}>Expert HACCP & ISO</span>
                </div>
                <a href="https://wa.me/242069677567" target="_blank" rel="noreferrer" className="btn-raised" style={{ width: '100%', justifyContent: 'center', padding: '.75rem 1rem', fontSize: '.84rem' }}>
                  <HoverSlideText text="Échanger directement" /> <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </BlurReveal>

          <BlurReveal direction="right" delay={0.15}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
              <div className="sku-card" style={{ padding: '2rem 2.2rem', borderRadius: 18, border: `1px solid ${T.border}`, background: T.surface }}>
                <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.1rem', fontWeight: 800, color: '#b47027', marginBottom: '.8rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                  <Award size={18} /> Pratique clinique & Gestion agropastorale
                </h3>
                <p style={{ fontSize: '.95rem', color: T.textSub, lineHeight: 1.8, margin: 0 }}>
                  Médecin vétérinaire passionnée par le développement agropastoral et experte en management de la qualité, de l'hygiène, de la sécurité et de l'environnement, le <strong>Dr POUTYA SAIZONOU</strong> cumule une solide expérience alliant pratique clinique, gestion d'élevages, conseil stratégique et audit de conformité.
                </p>
              </div>

              <div className="sku-card" style={{ padding: '2rem 2.2rem', borderRadius: 18, border: `1px solid ${T.border}`, background: T.surface }}>
                <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.1rem', fontWeight: 800, color: '#b47027', marginBottom: '.8rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                  <ShieldCheck size={18} /> Rigueur scientifique & Standards internationaux
                </h3>
                <p style={{ fontSize: '.95rem', color: T.textSub, lineHeight: 1.8, margin: 0 }}>
                  Diplômée d'un <strong>Doctorat d'État en Médecine Vétérinaire</strong> et titulaire de certifications spécialisées en QHSE (normes <strong>ISO 9001, ISO 14001, ISO 45001, ISO 22000</strong> et démarche <strong>HACCP</strong>), elle a fondé <strong>AGRO VÉTO SERVICES CONGO</strong> avec une ambition claire : structurer, moderniser et sécuriser les filières agropastorales et agroalimentaires en République du Congo.
                </p>
              </div>

              <div className="sku-card" style={{ padding: '2rem 2.2rem', borderRadius: 18, border: `1px solid ${T.border}`, background: T.surface }}>
                <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.1rem', fontWeight: 800, color: '#b47027', marginBottom: '.8rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                  <GraduationCap size={18} /> Conseil stratégique & Transmission de compétences
                </h3>
                <p style={{ fontSize: '.95rem', color: T.textSub, lineHeight: 1.8, margin: 0 }}>
                  Formatrice chevronnée et consultante auprès d'organisations nationales et internationales, elle met son expertise au service des éleveurs, des PME agroalimentaires et des grandes entreprises industrielles pour bâtir un écosystème agropastoral performant, résilient et conforme aux exigences du XXIe siècle.
                </p>
              </div>
            </div>
          </BlurReveal>
        </div>
      </div>
      <style>{`
        @media(max-width:960px) {
          div[style*="grid-template-columns: 360px 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}

// ── 4. MOT DE LA DIRECTION (Section 14 officielle) ─────────────
function DirectorWordSection() {
  const T = useTheme()
  return (
    <section style={{ padding: '7rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden', borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <BlurReveal delay={0.12}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.3rem .9rem', borderRadius: 100, background: 'rgba(180, 112, 39,.1)', border: `1px solid ${T.border}`, fontFamily: "'Poppins', sans-serif", fontSize: '.72rem', fontWeight: 600, color: '#b47027', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '.08em' }}>
              Message institutionnel
            </div>
            <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.8rem,5.5vw,4.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", color: T.textMain, margin: '0 0 1rem' }}>
              <GhostTitle text="MOT DE LA DIRECTION" />
              Mot de la <GreenUnderline><span className="text-gradient">Direction</span></GreenUnderline>
            </h2>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.15rem', fontStyle: 'italic', fontWeight: 700, color: '#b47027', maxWidth: 700, margin: '0 auto' }}>
              « Bâtir un avenir agropastoral fort, durable et conforme aux standards mondiaux. »
            </p>
          </div>
        </BlurReveal>

        <BlurReveal delay={0.2} direction="up">
          <div style={{ padding: 'clamp(2rem,4vw,3.5rem)', borderRadius: 24, border: `1px solid rgba(180, 112, 39,.25)`, background: T.surface, boxShadow: '0 20px 50px rgba(0,0,0,.15)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '1.5rem', left: '2rem', fontSize: '5rem', color: 'rgba(180, 112, 39,.15)', fontFamily: 'serif', lineHeight: 1, pointerEvents: 'none' }}>“</div>
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '1.02rem', lineHeight: 1.85, color: T.textMain }}>
              <p style={{ margin: 0 }}>
                L'agriculture, l'élevage et l'agroalimentaire sont les piliers indispensables de l'indépendance économique et de la souveraineté alimentaire de notre pays. Pourtant, les acteurs de ces filières font face à des défis majeurs : précarité sanitaire du cheptel, faible accès aux intrants de qualité, absence de formation pratique adaptée et méconnaissance des exigences réglementaires et de sécurité sanitaire.
              </p>
              <p style={{ margin: 0 }}>
                <strong>AGRO VÉTO SERVICES CONGO</strong> est née pour apporter des réponses concrètes, professionnelles et durables à ces défis. Nous ne sommes pas seulement des prestataires de services ; nous sommes des partenaires de terrain. Que vous soyez un petit éleveur désireux d'améliorer la rentabilité de sa bande, un transformateur agroalimentaire cherchant à structurer sa démarche qualité, ou une entreprise industrielle ayant besoin d'externaliser son management QHSE, notre équipe s'engage à vos côtés avec rigueur, intégrité et passion.
              </p>
              <p style={{ margin: 0, fontFamily: "'Poppins', sans-serif", fontSize: '1.15rem', fontWeight: 800, fontStyle: 'italic', color: '#b47027' }}>
                Ensemble, élevons les standards. Ensemble, construisons l'excellence.
              </p>
            </div>

            <div style={{ marginTop: '2.5rem', paddingTop: '1.8rem', borderTop: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: '1.05rem', color: T.textMain }}>
                  Dr POUTYA SAIZONOU Marie-Rose Edwige Rakié
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.76rem', color: T.textMuted }}>
                  Docteure en Médecine Vétérinaire & Spécialiste QHSE
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.72rem', color: '#b47027', fontWeight: 600 }}>
                  Fondatrice & Directrice Générale — AGRO VÉTO SERVICES CONGO S.A.R.L.U.
                </div>
              </div>
              <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', border: '2px solid #b47027' }}>
                <LazyImg src={cld('/images/dr_poutya.jpeg')} alt="Signature Dr POUTYA" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
              </div>
            </div>
          </div>
        </BlurReveal>
      </div>
    </section>
  )
}

// ── 4. VALEURS ───────────────────────────────────────────────
function ValuesSection() {
  const T = useTheme()
  const dirs = ['right', 'up', 'left', 'up']
  return (
    <section style={{ padding: '7rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: '-2%', top: '50%', transform: 'translateY(-50%)', fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(10rem,18vw,18rem)', fontWeight: 900, color: T.light ? 'rgba(180, 112, 39,.04)' : 'rgba(180, 112, 39,.03)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>VALUES</div>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* h2 — trait rouge, aligné à gauche */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <BlurReveal delay={0.12}>
            <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(3.4rem,6.5vw,5.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", color: T.textMain }}>
              <GhostTitle text="CE QUI NOUS DISTINGUE" />
              Ce qui nous <GreenUnderline><span className="text-gradient">distingue</span></GreenUnderline>
            </h2>
          </BlurReveal>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.2rem' }}>
          {VALUES.map(({ icon: Icon, title, desc }, i) => (
            <BlurReveal key={title} delay={i * 0.1} direction={dirs[i % dirs.length]}>
              <motion.div className="sku-card" whileHover={{ y: -5 }} style={{ padding: '2rem', height: '100%', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: 'none', pointerEvents: 'none' }} />
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(180, 112, 39,.1)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                  <Icon size={24} style={{ color: T.green }} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: T.textMain, fontFamily: "'Poppins', sans-serif", marginBottom: '.5rem' }}>{title}</h3>
                <p style={{ fontSize: '.82rem', color: T.textSub, lineHeight: 1.65 }}>{desc}</p>
              </motion.div>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 5. STACK TECHNIQUE ───────────────────────────────────────
function SkillsSection() {
  const T = useTheme()
  const ref = useRef(null)
  const sectionRef = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <section ref={el => { ref.current = el; sectionRef.current = el }} style={{ padding: '7rem 5%', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .2 }} />
      {/* h2 — au-dessus des 2 colonnes, aligné à gauche, même style que les autres sections */}
      <div style={{ maxWidth: 1200, margin: '0 auto 3rem', textAlign: 'left', position: 'relative', zIndex: 1 }}>
        <BlurReveal delay={0.12}>
          <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(3.4rem,6.5vw,5.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", color: T.textMain }}>
            <GhostTitle text="EXCELLENCE VÉTÉRINAIRE & QHSE" />
            Excellence vétérinaire &{' '}
            <GreenUnderline><span className="text-gradient">normes QHSE</span></GreenUnderline>
          </h2>
        </BlurReveal>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <BlurReveal direction="left">
          <WordRevealP
            sectionRef={sectionRef}
            text="Nous combinons l'art médical vétérinaire, la nutrition animale contrôlée en laboratoire et les normes internationales pour propulser votre réussite."
            greenWords={['médical', 'vétérinaire,', 'laboratoire', "normes", 'réussite.']}
            extraStyle={{ color: T.textSub, marginBottom: '2rem', paddingLeft: 0, paddingRight: 0 }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
            {SKILLS.map((s, i) => (
              <motion.span key={s} initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .3 + i * .04 }}
                whileHover={{ y: -2, background: 'rgba(180, 112, 39,.15)' }}
                style={{ padding: '.35rem .85rem', background: 'rgba(180, 112, 39,.07)', border: `1px solid ${T.border}`, borderRadius: 100, fontFamily: "'Poppins', sans-serif", fontSize: '.65rem', fontWeight: 600, color: T.green, letterSpacing: '.06em', cursor: 'default', transition: 'all .2s' }}>
                {s}
              </motion.span>
            ))}
          </div>
        </BlurReveal>
        <BlurReveal direction="right" delay={0.2}>
          <TiltCard intensity={10} style={{ borderRadius: 16 }}>
            <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${T.border}`, boxShadow: '8px 8px 32px rgba(0,0,0,.3)', height: 400 }}>
              <LazyImg src={'https://images.unsplash.com/photo-1441122456239-401e92b73c65?auto=format&fit=crop&w=800&q=80'} alt="Clinique Vétérinaire AVS" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                placeholder={<div style={{ height: '100%', background: '#1c1917', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Award size={48} style={{ color: 'rgba(180, 112, 39,.3)' }} /></div>} />
            </div>
          </TiltCard>
        </BlurReveal>
      </div>
    </section>
  )
}

// ── 6. RAYON D'ACTION ────────────────────────────────────────
const PAYS = [
  { code: 'CG', name: "République du Congo", note: 'Siège — Pointe-Noire (Socoprise)', primary: true },
  { code: 'CD', name: 'RD Congo (Kinshasa)', note: 'Partenariats Élevage & Intrants' },
  { code: 'GA', name: 'Gabon', note: 'Distribution & Audits QHSE' },
  { code: 'CM', name: 'Cameroun', note: 'Réseau Agropastoral CEMAC' },
  { code: 'AO', name: 'Angola (Cabinda)', note: 'Coopération frontalière' },
  { code: 'FR', name: 'International', note: 'Partenariats & Diaspora' },
]

function FlagBadge({ code, primary }) {
  const colors = {
    CG: ['#009543', '#fbde4a', '#dc241f'],
    CD: ['#007fff', '#f7d618', '#ce1021'],
    GA: ['#009e60', '#fcd116', '#3a75c4'],
    CM: ['#007a5e', '#ce1126', '#fcd116'],
    AO: ['#c8102e', '#000000', '#fcd116'],
    FR: ['#002395', '#fff',     '#ed2939'],
  }
  const [c1, c2, c3] = colors[code] || ['#b47027', '#fff', '#b47027']
  return (
    <div style={{ width: 36, height: 36, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: primary ? '1.5px solid rgba(180, 112, 39,.5)' : '1px solid rgba(255,255,255,.12)', display: 'flex', flexDirection: 'column', boxShadow: primary ? '0 0 10px rgba(180, 112, 39,.2)' : '0 2px 8px rgba(0,0,0,.2)' }}>
      <div style={{ flex: 1, background: c1 }} />
      <div style={{ flex: 1, background: c2 }} />
      <div style={{ flex: 1, background: c3 }} />
    </div>
  )
}

function RayonSection() {
  const T = useTheme()
  const sectionRef = useRef(null)
  return (
    <section ref={sectionRef} style={{ padding: '7rem 5%', background: T.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .18 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          <BlurReveal direction="left">
            <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(3.4rem,6.5vw,5.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", color: T.textMain, marginBottom: '1.2rem' }}>
              <GhostTitle text="OÙ INTERVENONS-NOUS ?" />
              Où intervenons-<GreenUnderline><span className="text-gradient">nous ?</span></GreenUnderline>
            </h2>
            <WordRevealP
              sectionRef={sectionRef}
              text="Basés à Pointe-Noire (Quartier Socoprise), nous intervenons sur l'ensemble de la République du Congo et accompagnons les acteurs agropastoraux d'Afrique Centrale. Soins en clinique, visites de cheptel en exploitation et expédition sécurisée d'intrants."
              greenWords={['Pointe-Noire', 'Socoprise),', 'Congo', 'Afrique', 'Centrale.', 'clinique,', 'exploitation']}
              extraStyle={{ color: T.textSub, marginBottom: '2rem', paddingLeft: 0, paddingRight: 0 }}
            />
            <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
              {['Pointe-Noire & Kouilou', 'Interventions en Ferme', 'Urgences 24/7', 'FCFA (XAF)'].map(b => (
                <span key={b} style={{ padding: '.3rem .85rem', borderRadius: 100, background: 'rgba(180, 112, 39,.08)', border: '1px solid rgba(180, 112, 39,.2)', fontFamily: "'Poppins', sans-serif", fontSize: '.7rem', fontWeight: 600, color: '#b47027' }}>{b}</span>
              ))}
            </div>
          </BlurReveal>
          <BlurReveal direction="right" delay={0.15}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.85rem' }}>
              {PAYS.map(({ code, name, note, primary }, i) => (
                <motion.div key={name}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * .06, duration: .45, ease: [.22,1,.36,1] }}
                  whileHover={{ y: -4 }}
                  style={{ padding: '1.1rem 1.2rem', borderRadius: 14, background: primary ? 'rgba(180, 112, 39, 0.08)' : (T.light ? 'rgba(0,0,0,.03)' : 'rgba(255,255,255,.03)'), border: `1px solid ${primary ? 'rgba(180, 112, 39,.35)' : T.border}`, display: 'flex', alignItems: 'center', gap: '.8rem', position: 'relative', overflow: 'hidden' }}>
                  {primary && <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, background: 'none', pointerEvents: 'none' }} />}
                  <FlagBadge code={code} primary={primary} />
                  <div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '.82rem', color: primary ? '#b47027' : T.textMain }}>{name}</div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.62rem', color: T.textMuted }}>{note}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </BlurReveal>
        </div>
      </div>
      <style>{`@media(max-width:768px){.rayon-grid{grid-template-columns:1fr !important;gap:2rem !important}}`}</style>
    </section>
  )
}

// ── PAGE ─────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div>
      {/* 1 */}<HeroAbout />
      {/* 2 */}<VisionMissionSection />
      {/* 3 */}<FounderSection />
      {/* 4 */}<DirectorWordSection />
      <TrustStacksMarquee />
      {/* 5 */}<ValuesSection />
      {/* 6 */}<SkillsSection />
      {/* 7 */}<RayonSection />

      <PageCTA
        message="Prêt à collaborer avec Agro Véto Services ? Discutons de vos besoins agropastoraux dès maintenant."
        cta="Nous contacter"
      />
    </div>
  )
}