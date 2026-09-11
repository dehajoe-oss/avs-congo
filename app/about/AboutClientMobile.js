'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Users, Heart, Zap, Star, Target, MessageCircle, ExternalLink, ShieldCheck, GraduationCap, Award, Rocket, Check } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { GhostTitle, AnimatedCounter, LazyImg, PageCTA, GreenUnderline, HoverSlideText } from '@/components/ui/index'
import TrustStacksMarquee from '@/components/ui/TrustStacksMarquee'
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
  const [c1,c2,c3] = colors[code] || ['#ea8025','#fff','#ea8025']
  return (
    <div style={{ width:32,height:32,borderRadius:8,overflow:'hidden',flexShrink:0,border:primary?'1.5px solid rgba(234, 128, 37,.5)':'1px solid rgba(255,255,255,.12)',display:'flex',flexDirection:'column',boxShadow:primary?'0 0 10px rgba(234, 128, 37,.2)':'none' }}>
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
        <div style={{ position: 'absolute', inset: 0, background: `${T.bg}`, opacity: T.light ? 1 : .95 }} />
      </div>
      <div style={{ position: 'relative', zIndex: 10, width: '100%', padding: '7rem 5% 4rem' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: [.22,1,.36,1] }}>
          <h1 style={{ position: 'relative', fontSize: 'clamp(2rem,7vw,3rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", color: T.textMain, letterSpacing: '-.04em', lineHeight: 1.1, marginBottom: '1.2rem' }}>
            <GhostTitle text="DE LA SANTÉ ANIMALE À L'EXCELLENCE QHSE." />
            De la santé animale,<br />
            <GreenUnderline><span className="text-gradient">à l'excellence QHSE.</span></GreenUnderline>
          </h1>
          <p style={{ fontSize: '.95rem', color: T.textSub, lineHeight: 1.75, marginBottom: '2rem', maxWidth: 480 }}>
            L'expertise au service de la santé animale, de la qualité agroalimentaire et de la performance QHSE en République du Congo.
          </p>
        </motion.div>
        {/* Photo fondatrice */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .2 }}
          style={{ borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(234, 128, 37,.25)', boxShadow: '0 8px 24px rgba(0,0,0,.3)', height: 280 }}>
          <LazyImg src={cld('/images/dr_poutya.jpeg')} alt="Dr POUTYA - Directrice Générale AVS Congo" style={{ width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 20%' }}
            placeholder={<div style={{ height:'100%',background:'#1c1917',display:'flex',alignItems:'center',justifyContent:'center' }}><Users size={36} style={{color:'rgba(234, 128, 37,.3)'}}/></div>} />
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
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 320, borderRadius: '50%', background: 'none', pointerEvents: 'none' }} />

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
                fontFamily: "'Poppins', sans-serif",
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
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(.65rem,2.5vw,.78rem)',
                fontWeight: 700,
                color: T.light ? '#c9680a' : '#ea8025',
                letterSpacing: '.02em',
                marginBottom: '.15rem',
              }}>
                {s.label}
              </div>

              {/* Sous-label */}
              <div style={{
                fontFamily: "'Poppins', sans-serif",
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

// ── 3. VISION & MISSION (Section 11 officielle) ───────────────
function VisionMissionSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section ref={ref} style={{ padding: '4.5rem 5%', background: T.bg, position: 'relative' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', padding: '.25rem .75rem', borderRadius: 100, background: 'rgba(234, 128, 37,.1)', border: `1px solid ${T.border}`, fontFamily: "'Poppins', sans-serif", fontSize: '.64rem', fontWeight: 600, color: '#ea8025', marginBottom: '.8rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Orientation Stratégique
          </div>
          <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.1rem,8vw,3.2rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text="VISION & MISSION" />
            Vision & <GreenUnderline><span className="text-gradient">Mission</span></GreenUnderline>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="sku-card" style={{ padding: '1.5rem', borderRadius: 16, border: `1px solid ${T.border}`, background: T.card }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.2rem .65rem', borderRadius: 100, background: 'rgba(234, 128, 37,.12)', color: '#ea8025', fontFamily: "'Poppins', sans-serif", fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '.8rem' }}>
              <Target size={13} /> Notre Vision
            </div>
            <blockquote style={{ margin: 0, fontFamily: "'Poppins', sans-serif", fontSize: '.95rem', fontWeight: 700, fontStyle: 'italic', color: T.textMain, lineHeight: 1.6 }}>
              « Être la référence agropastorale, vétérinaire et QHSE en République du Congo et un acteur reconnu du développement durable en Afrique Centrale. »
            </blockquote>
          </div>

          <div className="sku-card" style={{ padding: '1.5rem', borderRadius: 16, border: `1px solid ${T.border}`, background: T.card }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.2rem .65rem', borderRadius: 100, background: 'rgba(234, 128, 37,.12)', color: '#ea8025', fontFamily: "'Poppins', sans-serif", fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '.8rem' }}>
              <Rocket size={13} /> Notre Mission
            </div>
            <blockquote style={{ margin: 0, fontFamily: "'Poppins', sans-serif", fontSize: '.95rem', fontWeight: 700, fontStyle: 'italic', color: T.textMain, lineHeight: 1.6 }}>
              « Accompagner durablement les éleveurs, les acteurs des filières agropastorales et les entreprises dans l'amélioration de leur productivité, la garantie de la sécurité sanitaire et l'atteinte des standards de qualité internationaux. »
            </blockquote>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

// ── 4. LA FONDATRICE (Section 13 officielle) ──────────────────
function FounderSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section ref={ref} style={{ padding: '4.5rem 5%', background: T.bgAlt, position: 'relative', borderTop: `1px solid ${T.border}` }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', padding: '.25rem .75rem', borderRadius: 100, background: 'rgba(234, 128, 37,.1)', border: `1px solid ${T.border}`, fontFamily: "'Poppins', sans-serif", fontSize: '.64rem', fontWeight: 600, color: '#ea8025', marginBottom: '.8rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Direction Générale
          </div>
          <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.1rem,8vw,3.2rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
            <GhostTitle text="LA FONDATRICE" />
            La <GreenUnderline><span className="text-gradient">Fondatrice</span></GreenUnderline>
          </h2>
        </div>

        {/* Carte Identité */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', borderRadius: 16, background: 'rgba(234, 128, 37,.06)', border: '1px solid rgba(234, 128, 37,.25)', marginBottom: '1.5rem' }}>
          <div style={{ width: 62, height: 62, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(234, 128, 37,.5)', boxShadow: '0 0 14px rgba(234, 128, 37,.2)' }}>
            <LazyImg
              src={cld('/images/dr_poutya.jpeg')}
              alt="Dr POUTYA SAIZONOU Marie-Rose Edwige Rakié"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
              placeholder={<div style={{ width: 62, height: 62, background: 'rgba(234, 128, 37,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea8025', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.1rem' }}>E</div>}
            />
          </div>
          <div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: '.95rem', color: T.textMain, lineHeight: 1.25, marginBottom: '.2rem' }}>
              Dr POUTYA SAIZONOU Marie-Rose Edwige Rakié
            </div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.62rem', color: '#ea8025', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '.45rem' }}>
              Fondatrice & Directrice Générale
            </div>
            <a href="https://wa.me/242069677567" target="_blank" rel="noreferrer" className="btn-ghost btn-sm" style={{ padding: '.3rem .7rem', fontSize: '.68rem' }}>
              <ExternalLink size={11} /> <HoverSlideText text="Échanger en direct" />
            </a>
          </div>
        </div>

        {/* 3 paragraphes officiels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="sku-card" style={{ padding: '1.3rem', borderRadius: 14 }}>
            <p style={{ fontSize: '.84rem', color: T.textSub, lineHeight: 1.7, margin: 0 }}>
              Médecin vétérinaire passionnée par le développement agropastoral et experte en management de la qualité, de l'hygiène, de la sécurité et de l'environnement, le <strong>Dr POUTYA SAIZONOU</strong> cumule une solide expérience alliant pratique clinique, gestion d'élevages, conseil stratégique et audit de conformité.
            </p>
          </div>

          <div className="sku-card" style={{ padding: '1.3rem', borderRadius: 14 }}>
            <p style={{ fontSize: '.84rem', color: T.textSub, lineHeight: 1.7, margin: 0 }}>
              Diplômée d'un <strong>Doctorat d'État en Médecine Vétérinaire</strong> et titulaire de certifications spécialisées en QHSE (normes <strong>ISO 9001, ISO 14001, ISO 45001, ISO 22000</strong> et démarche <strong>HACCP</strong>), elle a fondé <strong>AGRO VÉTO SERVICES CONGO</strong> avec une ambition claire : structurer, moderniser et sécuriser les filières agropastorales et agroalimentaires en République du Congo.
            </p>
          </div>

          <div className="sku-card" style={{ padding: '1.3rem', borderRadius: 14 }}>
            <p style={{ fontSize: '.84rem', color: T.textSub, lineHeight: 1.7, margin: 0 }}>
              Formatrice chevronnée et consultante auprès d'organisations nationales et internationales, elle met son expertise au service des éleveurs, des PME agroalimentaires et des grandes entreprises industrielles pour bâtir un écosystème agropastoral performant, résilient et conforme aux exigences du XXIe siècle.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

// ── 5. MOT DE LA DIRECTION (Section 14 officielle) ─────────────
function DirectorWordSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section ref={ref} style={{ padding: '4.5rem 5%', background: T.bg, position: 'relative', borderTop: `1px solid ${T.border}` }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', padding: '.25rem .75rem', borderRadius: 100, background: 'rgba(234, 128, 37,.1)', border: `1px solid ${T.border}`, fontFamily: "'Poppins', sans-serif", fontSize: '.64rem', fontWeight: 600, color: '#ea8025', marginBottom: '.8rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Message institutionnel
          </div>
          <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.1rem,8vw,3.2rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", color: T.textMain, letterSpacing: '-.03em', margin: '0 0 .8rem' }}>
            <GhostTitle text="MOT DE LA DIRECTION" />
            Mot de la <GreenUnderline><span className="text-gradient">Direction</span></GreenUnderline>
          </h2>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.92rem', fontStyle: 'italic', fontWeight: 700, color: '#ea8025' }}>
            « Bâtir un avenir agropastoral fort, durable et conforme aux standards mondiaux. »
          </p>
        </div>

        <div style={{ padding: '1.5rem', borderRadius: 18, border: `1px solid rgba(234, 128, 37,.25)`, background: T.card, position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', fontSize: '.86rem', lineHeight: 1.75, color: T.textMain }}>
            <p style={{ margin: 0 }}>
              L'agriculture, l'élevage et l'agroalimentaire sont les piliers indispensables de l'indépendance économique et de la souveraineté alimentaire de notre pays. Pourtant, les acteurs de ces filières font face à des défis majeurs : précarité sanitaire du cheptel, faible accès aux intrants de qualité, absence de formation pratique adaptée et méconnaissance des exigences réglementaires et de sécurité sanitaire.
            </p>
            <p style={{ margin: 0 }}>
              <strong>AGRO VÉTO SERVICES CONGO</strong> est née pour apporter des réponses concrètes, professionnelles et durables à ces défis. Nous ne sommes pas seulement des prestataires de services ; nous sommes des partenaires de terrain. Que vous soyez un petit éleveur désireux d'améliorer la rentabilité de sa bande, un transformateur agroalimentaire cherchant à structurer sa démarche qualité, ou une entreprise industrielle ayant besoin d'externaliser son management QHSE, notre équipe s'engage à vos côtés avec rigueur, intégrité et passion.
            </p>
            <p style={{ margin: 0, fontFamily: "'Poppins', sans-serif", fontSize: '.95rem', fontWeight: 800, fontStyle: 'italic', color: '#ea8025' }}>
              Ensemble, élevons les standards. Ensemble, construisons l'excellence.
            </p>
          </div>

          <div style={{ marginTop: '1.6rem', paddingTop: '1.2rem', borderTop: `1px solid ${T.border}` }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: '.92rem', color: T.textMain }}>
              Dr POUTYA SAIZONOU Marie-Rose Edwige Rakié
            </div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.68rem', color: T.textMuted }}>
              Docteure en Médecine Vétérinaire & Spécialiste QHSE
            </div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.64rem', color: '#ea8025', fontWeight: 600 }}>
              Fondatrice & Directrice Générale — AGRO VÉTO SERVICES CONGO S.A.R.L.U.
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

// ── 6. VALEURS ───────────────────────────────────────────────
function ValuesSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section ref={ref} style={{ padding: '5rem 5%', background: T.bgAlt }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.3rem,8.5vw,3.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", color: T.textMain, letterSpacing: '-.03em' }}>
          <GhostTitle text="CE QUI NOUS DISTINGUE" />
          Ce qui nous <GreenUnderline><span className="text-gradient">distingue</span></GreenUnderline>
        </h2>
      </motion.div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        {VALUES.map(({ icon: Icon, title, desc }, i) => (
          <motion.div key={title} className="sku-card"
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .1 }}
            style={{ padding: '1.5rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(234, 128, 37,.1)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Icon size={20} style={{ color: T.green }} />
            </div>
            <h3 style={{ fontSize: '.95rem', fontWeight: 700, color: T.textMain, fontFamily: "'Poppins', sans-serif", marginBottom: '.4rem' }}>{title}</h3>
            <p style={{ fontSize: '.8rem', color: T.textSub, lineHeight: 1.65 }}>{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ── 7. EXCELLENCE VÉTÉRINAIRE & QHSE ─────────────────────────
function SkillsSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section ref={ref} style={{ padding: '5rem 5%', background: T.bg }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: '2rem' }}>
        <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.3rem,8.5vw,3.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", color: T.textMain, letterSpacing: '-.03em', marginBottom: '.8rem' }}>
          <GhostTitle text="EXCELLENCE VÉTÉRINAIRE & QHSE" />
          Excellence vétérinaire &{' '}
          <GreenUnderline><span className="text-gradient">normes QHSE</span></GreenUnderline>
        </h2>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(.9rem,3.4vw,1.05rem)', fontWeight: 600, lineHeight: 1.6, color: T.textSub, marginBottom: '1.5rem' }}>
          Notre équipe pluridisciplinaire combine l'art médical vétérinaire, la nutrition animale contrôlée en laboratoire et les normes internationales pour propulser votre réussite.
        </p>
      </motion.div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.45rem' }}>
        {SKILLS.map((s, i) => (
          <motion.span key={s} initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .2 + i * .04 }}
            style={{ padding: '.32rem .8rem', background: 'rgba(234, 128, 37,.07)', border: `1px solid ${T.border}`, borderRadius: 100, fontFamily: "'Poppins', sans-serif", fontSize: '.62rem', fontWeight: 600, color: T.green, letterSpacing: '.05em' }}>
            {s}
          </motion.span>
        ))}
      </div>
      {/* Image Clinique */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: .35 }}
        style={{ marginTop: '2rem', borderRadius: 14, overflow: 'hidden', border: `1px solid ${T.border}`, height: 220 }}>
        <LazyImg src={'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80'} alt="Clinique Vétérinaire AVS" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          placeholder={<div style={{ height: '100%', background: '#1c1917', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Award size={36} style={{ color: 'rgba(234, 128, 37,.3)' }} /></div>} />
      </motion.div>
    </section>
  )
}

// ── 8. RAYON D'ACTION ────────────────────────────────────────
function RayonSection() {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section ref={ref} style={{ padding: '5rem 5%', background: T.bgAlt, position: 'relative' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .18 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} style={{ marginBottom: '2rem' }}>
          <h2 className="section-title-big" style={{ position: 'relative', textAlign: 'center', fontSize: 'clamp(2.3rem,8.5vw,3.6rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", color: T.textMain, letterSpacing: '-.03em', marginBottom: '.8rem' }}>
            <GhostTitle text="OÙ INTERVENONS-NOUS ?" />
            Où intervenons-<GreenUnderline><span className="text-gradient">nous ?</span></GreenUnderline>
          </h2>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(1rem,3.6vw,1.2rem)', fontWeight: 700, lineHeight: 1.5, color: T.textMain, marginBottom: '1.2rem' }}>
            Basés à <strong style={{ color: T.textMain }}>Pointe-Noire (Socoprise)</strong>, nous accompagnons les éleveurs et PME à travers la République du Congo et l'Afrique Centrale.
          </p>
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1.8rem' }}>
            {['Clinique 24/7', 'Intervention terrain', 'FCFA & Mobile Money'].map(b => (
              <span key={b} style={{ padding: '.28rem .75rem', borderRadius: 100, background: 'rgba(234, 128, 37,.08)', border: '1px solid rgba(234, 128, 37,.2)', fontFamily: "'Poppins', sans-serif", fontSize: '.65rem', fontWeight: 600, color: '#ea8025' }}>{b}</span>
            ))}
          </div>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.65rem' }}>
          {PAYS.map(({ code, name, note, primary }, i) => (
            <motion.div key={name}
              initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .07 }}
              style={{ padding: '.85rem 1rem', borderRadius: 12, background: primary ? 'rgba(234, 128, 37, 0.08)' : (T.light ? 'rgba(0,0,0,.03)' : 'rgba(255,255,255,.03)'), border: `1px solid ${primary ? 'rgba(234, 128, 37,.35)' : T.border}`, display: 'flex', alignItems: 'center', gap: '.65rem' }}>
              <FlagBadge code={code} primary={primary} />
              <div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '.75rem', color: primary ? '#ea8025' : T.textMain }}>{name}</div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.58rem', color: T.textMuted }}>{note}</div>
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
      {/* 3 */}<VisionMissionSection />
      {/* 4 */}<FounderSection />
      {/* 5 */}<DirectorWordSection />
      <TrustStacksMarquee />
      {/* 6 */}<ValuesSection />
      {/* 7 */}<SkillsSection />
      {/* 8 */}<RayonSection />
      <PageCTA message="Prêt à collaborer avec Agro Véto Services ? Discutons de vos besoins agropastoraux." cta="Nous contacter" />
    </div>
  )
}