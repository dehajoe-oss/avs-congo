'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { 
  GraduationCap, 
  Award, 
  Calendar, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  MessageCircle,
  Briefcase,
  Target,
  Layers,
  Tractor,
  BadgeCheck
} from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { PageCTA } from '@/components/ui/index'
import { TRAINING_MODULES } from '@/lib/data'
import api from '@/lib/api-client'

export default function FormationsClient() {
  const T = useTheme()
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })

  const [modules, setModules] = useState(TRAINING_MODULES)
  const [selectedModule, setSelectedModule] = useState(TRAINING_MODULES[0])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    participantsCount: '1',
    notes: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Chargement en direct du catalogue de formations depuis PostgreSQL
  useEffect(() => {
    api.formations.getAll()
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setModules(res.data)
          setSelectedModule(res.data[0])
        }
      })
      .catch((err) => {
        console.warn('[Formations] Utilisation du catalogue local AVS:', err.message)
      })
  }, [])

  const handleOpenRegister = (module) => {
    setSelectedModule(module)
    setShowModal(true)
    setSubmitted(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 1. Enregistrement systématique dans la base de données PostgreSQL
    try {
      await api.formations.register({
        fullName: formData.name,
        phone: formData.phone,
        email: formData.email,
        formationId: selectedModule.id,
        formationType: selectedModule.title,
        participantsCount: Number(formData.participantsCount) || 1,
        notes: formData.notes,
      })
    } catch (backendErr) {
      console.warn('[Formations] Échec enregistrement API, transmission WhatsApp directe:', backendErr.message)
    }

    // 2. Préparation du message WhatsApp officiel AVS
    let message = `🎓 *PRÉ-INSCRIPTION FORMATION CERTIFIANTE - AVS CONGO*\n\n`
    message += `📚 *Module :* ${selectedModule.title}\n`
    message += `👤 *Candidat :* ${formData.name}\n`
    message += `📞 *Téléphone :* ${formData.phone}\n`
    message += `✉️ *Email :* ${formData.email || 'Non renseigné'}\n`
    message += `👥 *Nombre de participants :* ${formData.participantsCount}\n`
    message += `📅 *Session :* ${selectedModule.nextSession}\n`
    message += `💰 *Tarif :* ${selectedModule.price}\n`
    if (formData.notes) {
      message += `📝 *Notes / Attentes :* ${formData.notes}\n`
    }

    const whatsappUrl = `https://wa.me/242069677567?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setSubmitted(true)
    setIsSubmitting(false)
  }

  return (
    <div style={{ paddingTop: 72, background: T.bg, color: T.textMain, minHeight: '100vh' }}>
      
      {/* ── HERO FORMATIONS ── */}
      <section ref={heroRef} style={{ padding: '4.5rem 5% 3.5rem', position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${T.border}` }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />
        
        <div style={{ maxWidth: 1180, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.3rem .9rem', borderRadius: 100, background: T.light ? 'rgba(169, 106, 38,.1)' : 'rgba(180, 112, 39,.1)', border: `1px solid ${T.border}`, fontFamily: "'Poppins', sans-serif", fontSize: '.72rem', fontWeight: 600, color: T.green, marginBottom: '1.2rem' }}>
              <GraduationCap size={13} />
              CENTRE DE FORMATION & FERMES-ÉCOLES
            </div>

            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', lineHeight: 1.05, letterSpacing: '-.03em', marginBottom: '1.2rem', color: T.textMain }}>
              Formations Pratiques & Certifiantes
            </h1>

            <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', color: T.textSub, maxWidth: 820, lineHeight: 1.7, marginBottom: '2rem' }}>
              Apprenez sur le terrain avec des vétérinaires praticiens, des ingénieurs nutritionnistes et des auditeurs QHSE certifiés. Des programmes immersifs en ferme-école et ateliers conçus pour votre autonomie et votre rentabilité immédiate.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="#catalogue" className="btn-raised" style={{ padding: '.85rem 1.8rem' }}>
                Découvrir nos formations <ArrowRight size={14} />
              </a>
              <a href="https://wa.me/242069677567?text=Bonjour,%20je%20souhaite%20des%20renseignements%20sur%20les%20formations%20AVS" target="_blank" rel="noreferrer" className="btn-ghost" style={{ padding: '.85rem 1.6rem', display: 'inline-flex', alignItems: 'center', gap: '.5rem', background: 'rgba(3,8,6,.55)', backdropFilter: 'blur(6px)', color: '#f5c57a', borderColor: '#b47027', textShadow: '0 1px 8px rgba(0,0,0,.8)' }}>
                <MessageCircle size={15} />
                Conseiller Pédagogique WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 3 ENGAGEMENTS PÉDAGOGIQUES ── */}
      <section style={{ padding: '2.5rem 5%', borderBottom: `1px solid ${T.border}`, background: T.light ? 'rgba(0,0,0,.02)' : 'rgba(255,255,255,.02)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: T.light ? 'rgba(169, 106, 38,.1)' : 'rgba(180, 112, 39,.1)', color: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Award size={20} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 .3rem', fontSize: '.95rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: T.textMain }}>
                Attestations Certifiantes
              </h3>
              <p style={{ margin: 0, fontSize: '.8rem', color: T.textMuted, lineHeight: 1.5 }}>
                Validation officielle des compétences acquises et délivrance d'un certificat d'aptitude AVS Congo.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: T.light ? 'rgba(169, 106, 38,.1)' : 'rgba(180, 112, 39,.1)', color: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Users size={20} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 .3rem', fontSize: '.95rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: T.textMain }}>
                Immersion Ferme-École
              </h3>
              <p style={{ margin: 0, fontSize: '.8rem', color: T.textMuted, lineHeight: 1.5 }}>
                Manipulation sur cheptel vivant (Cobb 500, ponte), ateliers de fabrication et études de cas réels.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: T.light ? 'rgba(169, 106, 38,.1)' : 'rgba(180, 112, 39,.1)', color: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 .3rem', fontSize: '.95rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: T.textMain }}>
                Suivi Post-Formation
              </h3>
              <p style={{ margin: 0, fontSize: '.8rem', color: T.textMuted, lineHeight: 1.5 }}>
                Assistance continue de nos docteurs vétérinaires pour le suivi de votre premier lot ou audit sanitaire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATALOGUE DES MODULES ── */}
      <section id="catalogue" style={{ padding: '4.5rem 5%', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 3rem' }}>
          <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.7rem', fontWeight: 700, color: T.green, letterSpacing: '.08em', textTransform: 'uppercase' }}>
            PROGRAMMES DISPONIBLES
          </span>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, fontStyle: 'italic', color: T.textMain, margin: '.4rem 0 1rem' }}>
            Choisissez votre spécialisation
          </h2>
          <p style={{ fontSize: '.92rem', color: T.textSub, lineHeight: 1.6 }}>
            Formations adaptées aux débutants comme aux professionnels en quête de perfectionnement ou de mise en conformité.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {modules.map((mod) => (
            <div 
              key={mod.id || mod.slug}
              className="sku-card"
              style={{ padding: '2rem', borderRadius: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: `1.5px solid ${T.border}` }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.8rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '.7rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: T.green, background: T.light ? 'rgba(169, 106, 38,.1)' : 'rgba(180, 112, 39,.1)', padding: '.25rem .7rem', borderRadius: 6 }}>
                    {mod.category}
                  </span>
                  <span style={{ fontSize: '.72rem', color: T.textMuted, display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                    <Clock size={11} /> {mod.duration.split('-')[0]}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: "'Poppins', sans-serif", color: T.textMain, lineHeight: 1.35, marginBottom: '1rem' }}>
                  {mod.title}
                </h3>

                <div style={{ padding: '1rem', borderRadius: 12, background: T.light ? 'rgba(0,0,0,.03)' : 'rgba(255,255,255,.03)', marginBottom: '1.2rem', fontSize: '.8rem', color: T.textSub }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.4rem' }}>
                    <span style={{ color: T.textMuted }}>Session :</span>
                    <strong style={{ color: T.textMain }}>{mod.nextSession}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: T.textMuted }}>Public cible :</span>
                    <strong style={{ color: T.textMain }}>{mod.target}</strong>
                  </div>
                </div>

                <h4 style={{ fontSize: '.75rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: T.textSub, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.6rem' }}>
                  Programme & Compétences :
                </h4>
                <ul style={{ paddingLeft: '1.1rem', margin: '0 0 1.8rem', display: 'flex', flexDirection: 'column', gap: '.45rem' }}>
                  {mod.modulesCovered.map((item, idx) => (
                    <li key={idx} style={{ fontSize: '.8rem', color: T.textMuted, lineHeight: 1.4 }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ paddingTop: '1.2rem', borderTop: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '.7rem', color: T.textMuted }}>Tarif inscription :</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: "'Poppins', sans-serif", color: T.green }}>
                    {mod.price}
                  </span>
                </div>
                <button
                  onClick={() => handleOpenRegister(mod)}
                  className="btn-raised btn-sm"
                  style={{ padding: '.65rem 1.2rem' }}
                >
                  S'inscrire <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INGÉNIERIE DE FORMATION & PROGRAMMES SUR-MESURE (SECTION 9) ── */}
      <section style={{ padding: '4.5rem 5%', background: T.light ? 'rgba(0,0,0,.02)' : 'rgba(255,255,255,.02)', borderTop: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.3rem .9rem', borderRadius: 100, background: T.light ? 'rgba(169, 106, 38,.1)' : 'rgba(180, 112, 39,.1)', border: `1px solid ${T.border}`, fontFamily: "'Poppins', sans-serif", fontSize: '.72rem', fontWeight: 600, color: T.green, marginBottom: '1.2rem' }}>
                <Briefcase size={13} />
                INGÉNIERIE DE FORMATION & RENFORCEMENT DES CAPACITÉS
              </div>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 900, fontStyle: 'italic', color: T.textMain, lineHeight: 1.2, marginBottom: '1.2rem' }}>
                Des cursus sur-mesure pour entreprises, ONG et institutions
              </h2>
              <p style={{ fontSize: '.95rem', color: T.textSub, lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Conception de programmes de renforcement des compétences destinés aux entreprises, ONG, institutions et professionnels. Nos experts vétérinaires, agroalimentaires et auditeurs QHSE interviennent directement sur vos sites d'exploitation ou dans nos fermes-écoles partenaires.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/contact" className="btn-raised" style={{ padding: '.8rem 1.6rem' }}>
                  Demander une ingénierie de formation <ArrowRight size={14} />
                </Link>
                <a href="https://wa.me/242069677567?text=Bonjour,%20je%20souhaite%20une%20formation%20sur-mesure%20pour%20mon%20entreprise/ONG" target="_blank" rel="noreferrer" className="btn-ghost" style={{ padding: '.8rem 1.4rem', display: 'inline-flex', alignItems: 'center', gap: '.5rem' }}>
                  <MessageCircle size={15} />
                  Échanger sur WhatsApp
                </a>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
              {[
                { title: 'Diagnostic des Besoins', desc: 'Audit des équipes et identification précise des écarts de compétences et exigences normatives.', Icon: Target },
                { title: 'Ingénierie Pédagogique', desc: 'Conception de référentiels, supports didactiques et cas pratiques contextualisés au Congo.', Icon: Layers },
                { title: 'Immersion & Pratique', desc: 'Sessions en fermes-écoles, ateliers ou directement sur vos lignes de production et cheptels.', Icon: Tractor },
                { title: 'Certification & Suivi', desc: 'Attestations certifiées AVS Congo et accompagnement post-formation sur la performance réelle.', Icon: BadgeCheck },
              ].map((step, i) => (
                <div key={i} style={{ padding: '1.5rem', borderRadius: 16, background: T.light ? '#ffffff' : '#122415', border: `1px solid ${T.border}` }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: T.light ? 'rgba(169, 106, 38,.1)' : 'rgba(180, 112, 39,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.green, marginBottom: '1rem' }}>
                    <step.Icon size={22} />
                  </div>
                  <h4 style={{ margin: '0 0 .4rem', fontSize: '.95rem', fontWeight: 800, fontFamily: "'Poppins', sans-serif", color: T.textMain }}>{step.title}</h4>
                  <p style={{ margin: 0, fontSize: '.78rem', color: T.textMuted, lineHeight: 1.5 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MODAL PRÉ-INSCRIPTION ── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: T.light ? '#ffffff' : '#0a170d', border: `2px solid ${T.green}`, borderRadius: 20, maxWidth: 520, width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
              <div>
                <span style={{ fontSize: '.7rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: T.green }}>
                  {selectedModule.category}
                </span>
                <h3 style={{ margin: '.2rem 0 0', fontSize: '1.1rem', fontWeight: 800, fontFamily: "'Poppins', sans-serif", color: T.textMain }}>
                  {selectedModule.title}
                </h3>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: T.textMuted, fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(180, 112, 39,.2)', color: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <CheckCircle2 size={28} />
                </div>
                <h4 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.1rem', fontWeight: 800, color: T.textMain, marginBottom: '.5rem' }}>
                  Pré-inscription transmise !
                </h4>
                <p style={{ fontSize: '.82rem', color: T.textMuted, marginBottom: '1.5rem' }}>
                  Votre récapitulatif a été ouvert sur WhatsApp pour finaliser les modalités de paiement et réservation de place.
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-raised btn-sm"
                  style={{ padding: '.6rem 1.4rem' }}
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: T.textSub, marginBottom: '.4rem' }}>
                    Nom & Prénom du candidat *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Paul Malonga"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '.75rem 1rem', borderRadius: 10, background: T.light ? '#f5f5f5' : '#122415', border: `1px solid ${T.border}`, color: T.textMain, fontSize: '.85rem', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: T.textSub, marginBottom: '.4rem' }}>
                      Numéro Téléphone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: +242 06 967 75 67"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: '100%', padding: '.75rem 1rem', borderRadius: 10, background: T.light ? '#f5f5f5' : '#122415', border: `1px solid ${T.border}`, color: T.textMain, fontSize: '.85rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: T.textSub, marginBottom: '.4rem' }}>
                      Nombre de participants
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.participantsCount}
                      onChange={e => setFormData({ ...formData, participantsCount: e.target.value })}
                      style={{ width: '100%', padding: '.75rem 1rem', borderRadius: 10, background: T.light ? '#f5f5f5' : '#122415', border: `1px solid ${T.border}`, color: T.textMain, fontSize: '.85rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: T.textSub, marginBottom: '.4rem' }}>
                    Adresse Email (optionnelle)
                  </label>
                  <input
                    type="email"
                    placeholder="candidat@email.cg"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '.75rem 1rem', borderRadius: 10, background: T.light ? '#f5f5f5' : '#122415', border: `1px solid ${T.border}`, color: T.textMain, fontSize: '.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: T.textSub, marginBottom: '.4rem' }}>
                    Vos attentes ou situation actuelle
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Projet de démarrage de 500 poulets Cobb 500 à Pointe-Noire..."
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    style={{ width: '100%', padding: '.75rem 1rem', borderRadius: 10, background: T.light ? '#f5f5f5' : '#122415', border: `1px solid ${T.border}`, color: T.textMain, fontSize: '.85rem', outline: 'none', resize: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-ghost"
                    style={{ flex: 1, padding: '.8rem', justifyContent: 'center' }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn-raised"
                    style={{ flex: 2, padding: '.8rem', justifyContent: 'center' }}
                  >
                    <MessageCircle size={15} /> Confirmer sur WhatsApp
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <PageCTA 
        message="Besoin d'une session intra-entreprise sur-mesure pour votre personnel ?" 
        cta="Demander un devis formation" 
      />
    </div>
  )
}
