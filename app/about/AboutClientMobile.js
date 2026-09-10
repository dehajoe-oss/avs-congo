'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Users, Monitor, Code, Heart, Zap, Star, Target, MessageCircle, ExternalLink } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { GhostTitle, AnimatedCounter, LazyImg, PageCTA, GreenUnderline, HoverSlideText } from '@/components/ui/index'
import TrustStacksMarquee from '@/components/ui/TrustStacksMarquee'
import AuroraHero from '@/components/ui/AuroraHero'
import { STATS, PROJECTS } from '@/lib/data'
import { cld } from '@/lib/cloudinary'

const SKILLS = ['Médecine Vétérinaire','Management QHSE','Norme ISO 22000','Méthode HACCP','Provenderie Industrielle','Analyses Bromatologiques','Élevage Avicole','Biosécurité','Ferme-École']

const VALUES = [
  { icon: Target, title: 'Excellence Scientifique', desc: "Une démarche médicale et technique encadrée par des données vérifiées et les standards internationaux (ISO, HACCP)." },
  { icon: Heart, title: 'Bien-être & Éthique Animale', desc: "Une pratique vétérinaire et un élevage respectueux de la vie animale et des écosystèmes." },
  { icon: Zap, title: 'Proximité & Terrain', desc: "Un accompagnement sur mesure, au plus près des réalités des éleveurs et des PME à Pointe-Noire et au Congo." },
  { icon: Star, title: 'Qualité & Durabilité', desc: "Des solutions agropastorales et écologiques viables pour répondre aux défis alimentaires de demain." },
]

const TIMELINE = [
  { year: '2021', title: 'Création & Statuts SARLU', desc: "Immatriculation officielle selon l'Acte uniforme OHADA sous l'impulsion du Dr POUTYA SAIZONOU à Pointe-Noire." },
  { year: '2023', title: 'Provenderie & Laboratoire', desc: "Mise en service de notre unité de provenderie industrielle et du laboratoire de contrôle bromatologique des aliments." },
  { year: '2024', title: 'Lancement du « QHSE Partagé »', desc: "Déploiement d'une formule novatrice d'externalisation QHSE pour accompagner les PME congolaises vers les normes ISO et HACCP." },
  { year: '2026', title: 'Ferme-École & Urgences 24/7', desc: "Ouverture des sessions de formations pratiques immersives et consolidation du service d'urgences vétérinaires 24h/24." },
]

const PAYS = [
  { code: 'CG', name: "Congo", note: 'Siège — Socoprise Pointe-Noire', primary: true },
  { code: 'CD', name: 'RD Congo', note: 'Kinshasa & Régions' },
  { code: 'GA', name: 'Gabon', note: 'Partenariats Intrants' },
  { code: 'CM', name: 'Cameroun', note: 'Échanges Élevage' },
  { code: 'AO', name: 'Angola', note: 'Cabinda & Frontière' },
  { code: 'FR', name: 'International', note: 'Partenariats & Diaspora' },
]

function FlagBadge({ code, primary }) {
  const colors = {
    CG: ['#009543','#fbde4a','#dc241f'],
    CD: ['#007fff','#f7d618','#ce1021'],
    GA: ['#009e60','#fcd116','#3a75c4'],
    CM: ['#007a5e','#ce1126','#fcd116'],
    AO: ['#c8102e','#000000','#fcd116'],
    FR: ['#002395','#fff','#ed2939'],
  }
  const [c1,c2,c3] = colors[code] || ['#5a8738','#fff','#5a8738']
  return (
    <div style={{ width:32,height:32,borderRadius:8,overflow:'hidden',flexShrink:0,border:primary?'1.5px solid rgba(90, 135, 56,.5)':'1px solid rgba(255,255,255,.12)',display:'flex',flexDirection:'column',boxShadow:primary?'0 0 10px rgba(90, 135, 56,.2)':'none' }}>
      <div style={{flex:1,background:c1}}/><div style={{flex:1,background:c2}}/><div style={{flex:1,background:c3}}/>
    </div>
  )
}

// ── 1. HERO ──────────────────────────────────────────────────
function HeroAbout() {
  const T = useTheme()
  return (
    <section style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', background: T.bg }}>
      <div style={{ position: 'absolute', inset: '-8%', zIndex: 1 }}>
        <AuroraHero labels={[]} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 20%, ${T.bg} 100%)`, opacity: T.light ? 1 : .95 }} />
      </div>
      <div style={{ position: 'relative', zIndex: 10, width: '100%', padding: '7rem 5% 4rem' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: [.22,1,.36,1] }}>
          <h1 style={{ position: 'relative', fontSize: 'clamp(2rem,7vw,3rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1.2rem' }}>
            <GhostTitle text="DE LA SANTÉ ANIMALE À L'EXCELLENCE QHSE." />
            De la santé animale,<br />
            <GreenUnderline><span className="text-gradient">à l'excellence QHSE.</span></GreenUnderline>
          </h1>
          <p style={{ fontSize: '.95rem', color: T.textSub, lineHeight: 1.75, marginBottom: '2rem', maxWidth: 480 }}>
            Agro Véto Services Congo accompagne les éleveurs et PME agropastorales vers la performance et la conformité sanitaire.
          </p>
        </motion.div>
        {/* Photo grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .2 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '180px 130px', gap: '.75rem' }}>
          <div style={{ gridRow: '1 / 3', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(90, 135, 56,.2)', boxShadow: '6px 6px 24px rgba(0,0,0,.3)' }}>
            <LazyImg src={cld('/images/dr_poutya.jpeg')} alt="Agro Véto Services Congo" style={{ width:'100%',height:'100%',objectFit:'cover' }}
              placeholder={<div style={{ height:'100%',background:'linear-gradient(135deg,#0a1a0e,#060e09)',display:'flex',alignItems:'center',justifyContent:'center' }}><Users size={28} style={{color:'rgba(90, 135, 56,.3)'}}/></div>} />
          </div>
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(90, 135, 56,.15)' }}>
            <LazyImg src={cld('/images/about-2.webp')} alt="Bureau" style={{ width:'100%',height:'100%',objectFit:'cover' }}
              placeholder={<div style={{ height:'100%',background:'linear-gradient(135deg,#0a1a0e,#060e09)',display:'flex',alignItems:'center',justifyContent:'center' }}><Monitor size={22} style={{color:'rgba(90, 135, 56,.3)'}}/></div>} />
          </div>
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(90, 135, 56,.15)' }}>
            <LazyImg src={cld('/images/about-3.webp')} alt="Dev" style={{ width:'100%',height:'100%',objectFit:'cover' }}
              placeholder={<div style={{ height:'100%',background:'linear-gradient(135deg,#0a1a0e,#060e09)',display:'flex',alignItems:'center',justifyContent:'center' }}><Code size={22} style={{color:'rgba(90, 135, 56,.3)'}}/></div>} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── 2. STATS — chiffres géants éditoriaux (miroir HomeClientMobile) ──
const ABOUT_STATS = [
  { target: 6,   suffix: '',  label: "Pôles d'expertise",      sub: 'De la ferme à l\'assiette' },
  { target: 500, suffix: '+', label: 'Éleveurs & PME',         sub: 'Accompagnés au Congo' },
  { target: 99,  suffix: '%', label: 'Conformité sanitaire',   sub: 'Normes HACCP & ISO' },
  { target: 24,  suffix: '/7',label: 'Urgences cliniques',     sub: 'Permanence vétérinaire' },
]

function StatsSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} style={{ padding: '5rem 5% 6rem', background: T.bg, position: 'relative', overflow: 'hidden' }}>

      {/* Halo */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 320, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(90, 135, 56,.04),transparent 65%)', pointerEvents: 'none' }} />

      {/* Séparateur haut */}
      <div style={{ position: 'absolute', top: 0, left: '5%', right: '5%', height: 1, background: T.border }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <style>{`
          .stats-editorial-about {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0;
          }
        `}</style>
        <div className="stats-editorial-about">
          {ABOUT_STATS.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: .7, delay: i * .1, ease: [.22,1,.36,1] }}
              style={{
                padding: 'clamp(1.4rem,4vw,2rem) clamp(.9rem,3vw,1.6rem)',
                borderLeft: `1px solid ${T.border}`,
                borderBottom: i < 2 ? `1px solid ${T.border}` : 'none',
              }}>

              {/* Chiffre géant */}
              <div style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontWeight: 900,
                fontSize: 'clamp(3rem,12vw,5rem)',
                lineHeight: 1,
                color: T.light ? '#111' : 'rgba(255,255,255,.92)',
                letterSpacing: '-.04em',
                marginBottom: '.4rem',
              }}>
                <AnimatedCounter target={s.target} suffix={s.suffix} />
              </div>

              {/* Label principal */}
              <div style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 'clamp(.65rem,2.5vw,.78rem)',
                fontWeight: 700,
                color: T.light ? '#3d6023' : '#5a8738',
                letterSpacing: '.02em',
                marginBottom: '.15rem',
              }}>
                {s.label}
              </div>

              {/* Sous-label */}
              <div style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 'clamp(.58rem,2.2vw,.68rem)',
                color: T.textMuted,
                letterSpacing: '.02em',
                lineHeight: 1.4,
              }}>
                {s.sub}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Séparateur bas */}
      <div style={{ position: 'absolute', bottom: 0, left: '5%', right: '5%', height: 1, background: T.border }} />
    </section>
  )
}

// ── 3. FONDATEUR ─────────────────────────────────────────────
function FounderSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section ref={ref} style={{ padding: '5rem 5%', background: T.bg, position: 'relative' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
        <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.3rem,8.5vw,3.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em', marginBottom: '1.2rem' }}>
          <GhostTitle text="MISSION & VISION" />
          Mission &  <GreenUnderline><span className="text-gradient">vision</span></GreenUnderline>
        </h2>
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(1rem,3.6vw,1.2rem)', fontWeight: 700, lineHeight: 1.5, color: T.textMain, marginBottom: '1.2rem' }}>
          <strong>AGRO VÉTO SERVICES CONGO</strong> accompagne les éleveurs, fermes et PME agropastorales au Congo pour propulser leur productivité et garantir la sécurité sanitaire.
        </p>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .08 }}
          style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(1rem,3.6vw,1.2rem)', fontWeight: 700, lineHeight: 1.5, color: T.textMain, marginBottom: '1rem' }}>
          {'Nous apportons aux exploitations un suivi vétérinaire de pointe, des intrants certifiés et des aliments '}
          <span style={{ color: '#5a8738' }}>haute performance</span>
          {', adaptés au climat et '}
          <span style={{ color: '#5a8738' }}>aux réalités locales</span>
          {"."}
        </motion.p>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .14 }}
          style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(1rem,3.6vw,1.2rem)', fontWeight: 700, lineHeight: 1.5, color: T.textMain, marginBottom: '2rem' }}>
          {'Notre engagement repose sur la '}
          <span style={{ color: '#5a8738' }}>rigueur scientifique</span>
          {', la '}
          <span style={{ color: '#5a8738' }}>biosécurité</span>
          {" et l'"}
          <span style={{ color: '#5a8738' }}>impact durable</span>
          {'.'}
        </motion.p>

        {/* Photo + identité + portfolio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.1rem', borderRadius: 14, background: 'rgba(90, 135, 56,.06)', border: '1px solid rgba(90, 135, 56,.2)', marginBottom: '1.5rem' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(90, 135, 56,.5)', boxShadow: '0 0 14px rgba(90, 135, 56,.2)' }}>
            <LazyImg
              src={cld('/images/dr_poutya.jpeg')}
              alt="Dr Marie-Rose Edwige Rakié POUTYA SAIZONOU"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 10%' }}
              placeholder={<div style={{ width: 56, height: 56, background: 'rgba(90, 135, 56,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a8738', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '1.1rem' }}>E</div>}
            />
          </div>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: '.9rem', color: T.textMain, marginBottom: '.15rem' }}>Dr Marie-Rose Edwige Rakié POUTYA SAIZONOU</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '.45rem' }}>Fondatrice & Directrice Générale · Vétérinaire & QHSE</div>
            <a href="https://wa.me/242060000000" target="_blank" rel="noreferrer" className="btn-ghost btn-sm">
              <ExternalLink size={10} /> <HoverSlideText text="Me contacter" />
            </a>
          </div>
        </div>

        
      </motion.div>
    </section>
  )
}

// ── 4. HISTOIRE ──────────────────────────────────────────────
function TimelineSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section ref={ref} style={{ padding: '5rem 5%', background: T.bgAlt, position: 'relative' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .18 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.3rem,8.5vw,3.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text="L'HISTOIRE D'AVS CONGO" />
            L'évolution d'<GreenUnderline><span className="text-gradient">AVS Congo</span></GreenUnderline>
          </h2>
        </motion.div>
        <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: `linear-gradient(to bottom, transparent, ${T.green}, transparent)` }} />
          {TIMELINE.map(({ year, title, desc }, i) => (
            <motion.div key={year}
              initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: i * .12 }}
              style={{ position: 'relative', marginBottom: '2rem' }}>
              <div style={{ position: 'absolute', left: '-1.8rem', top: '1.1rem', width: 12, height: 12, borderRadius: '50%', background: 'linear-gradient(135deg, #6e9f45, #5a8738)', border: '2.5px solid rgba(90, 135, 56,.3)', boxShadow: '0 0 10px rgba(90, 135, 56,.4)' }} />
              <div className="sku-card" style={{ padding: '1.2rem 1.4rem' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.85rem', fontWeight: 800, color: T.green, letterSpacing: '.08em', marginBottom: '.35rem' }}>{year}</div>
                <h3 style={{ fontSize: '.92rem', fontWeight: 700, color: T.textMain, fontFamily: "'JetBrains Mono',monospace", marginBottom: '.3rem' }}>{title}</h3>
                <p style={{ fontSize: '.78rem', color: T.textSub, lineHeight: 1.6 }}>{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 5. VALEURS ───────────────────────────────────────────────
function ValuesSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section ref={ref} style={{ padding: '5rem 5%', background: T.bg }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.3rem,8.5vw,3.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
          <GhostTitle text="CE QUI NOUS DISTINGUE" />
          Ce qui nous <GreenUnderline><span className="text-gradient">distingue</span></GreenUnderline>
        </h2>
      </motion.div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        {VALUES.map(({ icon: Icon, title, desc }, i) => (
          <motion.div key={title} className="sku-card"
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .1 }}
            style={{ padding: '1.5rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(90, 135, 56,.1)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Icon size={20} style={{ color: T.green }} />
            </div>
            <h3 style={{ fontSize: '.95rem', fontWeight: 700, color: T.textMain, fontFamily: "'JetBrains Mono',monospace", marginBottom: '.4rem' }}>{title}</h3>
            <p style={{ fontSize: '.8rem', color: T.textSub, lineHeight: 1.65 }}>{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ── 6. STACK TECHNIQUE ───────────────────────────────────────
function SkillsSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section ref={ref} style={{ padding: '5rem 5%', background: T.bgAlt }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: '2rem' }}>
        <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.3rem,8.5vw,3.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em', marginBottom: '.8rem' }}>
          <GhostTitle text="LES TECHNOLOGIES QUI FONT LA DIFFÉRENCE" />
          Les technologies qui font <GreenUnderline><span className="text-gradient">la différence</span></GreenUnderline>
        </h2>
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(1rem,3.6vw,1.2rem)', fontWeight: 700, lineHeight: 1.5, color: T.textMain, marginBottom: '1.5rem' }}>
          J'utilise les meilleures technologies modernes — sélectionnées pour leur performance, leur fiabilité et leur adéquation avec vos besoins réels.
        </p>
      </motion.div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.45rem' }}>
        {SKILLS.map((s, i) => (
          <motion.span key={s} initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .2 + i * .04 }}
            style={{ padding: '.32rem .8rem', background: 'rgba(90, 135, 56,.07)', border: `1px solid ${T.border}`, borderRadius: 100, fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', fontWeight: 600, color: T.green, letterSpacing: '.05em' }}>
            {s}
          </motion.span>
        ))}
      </div>
      {/* Image */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .35 }}
        style={{ marginTop: '2rem', borderRadius: 14, overflow: 'hidden', border: `1px solid ${T.border}`, height: 220 }}>
        <LazyImg src={cld('/images/about-4.webp')} alt="Développeur" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          placeholder={<div style={{ height: '100%', background: 'linear-gradient(135deg,#0a1a0e,#060e09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Code size={36} style={{ color: 'rgba(90, 135, 56,.3)' }} /></div>} />
      </motion.div>
    </section>
  )
}

// ── 7. RAYON D'ACTION ────────────────────────────────────────
function RayonSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section ref={ref} style={{ padding: '5rem 5%', background: T.bg, position: 'relative' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .18 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: '2rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.3rem,8.5vw,3.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Barlow Condensed',sans-serif", color: T.textMain, letterSpacing: '-.03em', marginBottom: '.8rem' }}>
            <GhostTitle text="OÙ INTERVENONS-NOUS ?" />
            Où intervenons-<GreenUnderline><span className="text-gradient">nous ?</span></GreenUnderline>
          </h2>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(1rem,3.6vw,1.2rem)', fontWeight: 700, lineHeight: 1.5, color: T.textMain, marginBottom: '1.2rem' }}>
            Basés à <strong style={{ color: T.textMain }}>Pointe-Noire (Socoprise)</strong>, nous accompagnons les éleveurs et PME à travers la République du Congo et l'Afrique Centrale.
          </p>
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1.8rem' }}>
            {['Clinique 24/7', 'Intervention terrain', 'FCFA & Mobile Money'].map(b => (
              <span key={b} style={{ padding: '.28rem .75rem', borderRadius: 100, background: 'rgba(90, 135, 56,.08)', border: '1px solid rgba(90, 135, 56,.2)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 600, color: '#5a8738' }}>{b}</span>
            ))}
          </div>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.65rem' }}>
          {PAYS.map(({ code, name, note, primary }, i) => (
            <motion.div key={name}
              initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .07 }}
              style={{ padding: '.85rem 1rem', borderRadius: 12, background: primary ? 'linear-gradient(135deg,rgba(90, 135, 56,.14),rgba(90, 135, 56,.05))' : (T.light ? 'rgba(0,0,0,.03)' : 'rgba(255,255,255,.03)'), border: `1px solid ${primary ? 'rgba(90, 135, 56,.35)' : T.border}`, display: 'flex', alignItems: 'center', gap: '.65rem' }}>
              <FlagBadge code={code} primary={primary} />
              <div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: '.75rem', color: primary ? '#5a8738' : T.textMain }}>{name}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', color: T.textMuted }}>{note}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── PAGE ─────────────────────────────────────────────────────
export default function AboutPageMobile() {
  return (
    <div>
      {/* 1 */}<HeroAbout />
      {/* 2 */}<StatsSection />
      {/* 3 */}<FounderSection />
      <TrustStacksMarquee />
      {/* 4 */}<TimelineSection />
      {/* 5 */}<ValuesSection />
      {/* 6 */}<SkillsSection />
      {/* 7 */}<RayonSection />
      <PageCTA message="Prêt à collaborer avec Agro Véto Services ? Discutons de vos besoins agropastoraux." cta="Nous contacter" />
    </div>
  )
}