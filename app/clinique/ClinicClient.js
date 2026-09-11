'use client'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { 
  Stethoscope, 
  ShieldCheck, 
  Clock, 
  PhoneCall, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Activity,
  Heart,
  MessageCircle,
  Sparkles
} from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { PageCTA } from '@/components/ui/index'
import { CLINIC_SERVICES } from '@/lib/data'

export default function ClinicClient() {
  const T = useTheme()
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })

  const [bookingData, setBookingData] = useState({
    ownerName: '',
    phone: '',
    animalType: 'Chien / Animal de compagnie',
    animalName: '',
    serviceId: 'CONSULT',
    location: 'Clinique AVS (Socoprise, Pointe-Noire)',
    preferredDate: '',
    preferredTime: 'Matin (08h00 - 12h30)',
    notes: ''
  })

  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e) => {
    setBookingData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const selectedService = CLINIC_SERVICES.find(s => s.id === bookingData.serviceId)?.name || 'Consultation Vétérinaire'

    let message = `🩺 *PRISE DE RENDEZ-VOUS CLINIQUE VÉTÉRINAIRE - AVS CONGO*\n\n`
    message += `👤 *Propriétaire / Éleveur :* ${bookingData.ownerName}\n`
    message += `📞 *Téléphone :* ${bookingData.phone}\n`
    message += `🐾 *Animal / Cheptel :* ${bookingData.animalType} ${bookingData.animalName ? `(${bookingData.animalName})` : ''}\n`
    message += `🩺 *Prestation souhaitée :* ${selectedService}\n`
    message += `📍 *Lieu :* ${bookingData.location}\n`
    message += `📅 *Date souhaitée :* ${bookingData.preferredDate || 'Dès que possible'}\n`
    message += `⏰ *Créneau :* ${bookingData.preferredTime}\n`
    if (bookingData.notes) {
      message += `📝 *Symptômes / Précisions :* ${bookingData.notes}\n`
    }

    const whatsappUrl = `https://wa.me/242069677567?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setSubmitted(true)
  }

  return (
    <div style={{ paddingTop: 72, background: T.bg, color: T.textMain, minHeight: '100vh' }}>
      
      {/* ── HERO CLINIQUE ── */}
      <section ref={heroRef} style={{ padding: '4.5rem 5% 3.5rem', position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${T.border}` }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />
        
        <div style={{ maxWidth: 1180, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.3rem .9rem', borderRadius: 100, background: T.light ? 'rgba(234, 88, 12,.1)' : 'rgba(234, 128, 37,.1)', border: `1px solid ${T.border}`, fontFamily: "'Poppins', sans-serif", fontSize: '.72rem', fontWeight: 600, color: T.green, marginBottom: '1.2rem' }}>
              <Stethoscope size={13} />
              PÔLE SANTÉ ANIMALE & CLINIQUE
            </div>

            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', lineHeight: 1.05, letterSpacing: '-.03em', marginBottom: '1.2rem', color: T.textMain }}>
              Clinique Vétérinaire & Urgences 24/7
            </h1>

            <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', color: T.textSub, maxWidth: 820, lineHeight: 1.7, marginBottom: '2rem' }}>
              Médecine vétérinaire de pointe sous la direction du <strong style={{ color: T.textMain }}>Dr Marie-Rose Edwige Rakié POUTYA SAIZONOU</strong>. Consultations complètes, chirurgies, vaccinations, pharmacie vétérinaire et astreinte d'urgence continue à Pointe-Noire (Quartier Socoprise).
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="#rdv-form" className="btn-raised" style={{ padding: '.85rem 1.8rem' }}>
                Prendre rendez-vous <ArrowRight size={14} />
              </a>
              <a href="tel:+242069677567" className="btn-ghost" style={{ padding: '.85rem 1.6rem', display: 'inline-flex', alignItems: 'center', gap: '.5rem', color: '#ff5555', borderColor: 'rgba(255,85,85,.3)' }}>
                <PhoneCall size={15} />
                Ligne Urgences 24/7
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── BANDEAU URGENCE 24/7 ── */}
      <section style={{ padding: '1.5rem 5%', background: T.light ? 'rgba(220, 38, 38, 0.05)' : 'rgba(220, 38, 38, 0.12)', borderBottom: `1px solid ${T.light ? 'rgba(220, 38, 38, 0.2)' : 'rgba(220, 38, 38, 0.3)'}` }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', flexShrink: 0 }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontFamily: "'Poppins', sans-serif", fontSize: '.9rem', color: T.textMain, display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                SERVICE D'URGENCES VÉTÉRINAIRES 24H/24 & 7J/7
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
              </div>
              <p style={{ margin: 0, fontSize: '.78rem', color: T.textMuted }}>
                Prise en charge chirurgicale et médicale immédiate en clinique ou déplacement urgent sur votre exploitation à Pointe-Noire.
              </p>
            </div>
          </div>
          <a href="tel:+242069677567" className="btn-raised" style={{ background: '#ef4444', borderColor: '#ef4444', padding: '.65rem 1.4rem', fontSize: '.8rem' }}>
            Appel direct 24/7 : +242 06 967 75 67
          </a>
        </div>
      </section>

      {/* ── PRESTATIONS ET FORMULAIRE ── */}
      <section style={{ padding: '4rem 5%', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          
          {/* Colonne Gauche : Liste des actes & Horaires */}
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.7rem', fontWeight: 700, color: T.green, letterSpacing: '.08em', textTransform: 'uppercase' }}>
                ACTES CLINIQUES & SOINS
              </span>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '2.2rem', fontWeight: 900, fontStyle: 'italic', color: T.textMain, margin: '.4rem 0 1rem' }}>
                Soins Médicaux & Chirurgie
              </h2>
              <p style={{ fontSize: '.88rem', color: T.textSub, lineHeight: 1.6 }}>
                Chaque patient bénéficie d'une attention médicale rigoureuse, d'équipements de diagnostic modernes et de prescriptions adaptées.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {CLINIC_SERVICES.map((srv) => (
                <div 
                  key={srv.id}
                  className="sku-card"
                  style={{ padding: '1.2rem', borderRadius: 14, cursor: 'pointer', transition: 'all .2s' }}
                  onClick={() => setBookingData(prev => ({ ...prev, serviceId: srv.id }))}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '.8rem', marginBottom: '.4rem' }}>
                    <h4 style={{ margin: 0, fontSize: '.95rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: T.textMain }}>
                      {srv.name}
                    </h4>
                    <span style={{ fontSize: '.7rem', fontFamily: "'Poppins', sans-serif", color: T.green, background: T.light ? 'rgba(234, 88, 12,.1)' : 'rgba(234, 128, 37,.1)', padding: '.2rem .6rem', borderRadius: 6, whiteSpace: 'nowrap' }}>
                      {srv.duration}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '.8rem', color: T.textMuted, lineHeight: 1.5 }}>
                    {srv.description}
                  </p>
                  <div style={{ marginTop: '.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '.75rem', fontWeight: 700, color: T.green }}>{srv.price}</span>
                    <span style={{ fontSize: '.72rem', color: T.textMuted }}>Cliquer pour sélectionner →</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Infos Pratiques */}
            <div style={{ padding: '1.5rem', borderRadius: 16, background: T.light ? 'rgba(0,0,0,.03)' : 'rgba(255,255,255,.03)', border: `1px solid ${T.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '1rem', color: T.green }}>
                <MapPin size={18} />
                <h4 style={{ margin: 0, fontSize: '.95rem', fontWeight: 800, fontFamily: "'Poppins', sans-serif", color: T.textMain }}>
                  Localisation & Permanence
                </h4>
              </div>
              <p style={{ margin: '0 0 .5rem', fontSize: '.84rem', color: T.textSub }}>
                📍 <strong>Quartier Socoprise</strong>, Avenue Nelson Mandela, Rue Bissoute, Pointe-Noire (Congo).
              </p>
              <p style={{ margin: '0 0 .5rem', fontSize: '.8rem', color: T.textMuted }}>
                🕒 <strong>Horaires réguliers :</strong> Du Lundi au Samedi : 08h00 – 18h00
              </p>
              <p style={{ margin: 0, fontSize: '.8rem', color: T.green, fontWeight: 600 }}>
                🚨 <strong>Urgences et garde vétérinaire :</strong> 24h/24, 7j/7 sans interruption.
              </p>
            </div>
          </div>

          {/* Colonne Droite : Formulaire interactif */}
          <div id="rdv-form" style={{ padding: '2.2rem', borderRadius: 20, background: T.light ? '#ffffff' : '#0a170d', border: `2px solid ${T.border}`, boxShadow: T.light ? '0 10px 30px rgba(0,0,0,.04)' : '0 10px 30px rgba(0,0,0,.4)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.2rem', borderBottom: `1px solid ${T.border}` }}>
              <img 
                src="/images/dr_poutya.jpeg" 
                alt="Dr POUTYA" 
                style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 20%', border: `2px solid ${T.green}`, boxShadow: '0 0 12px rgba(234, 128, 37,.25)' }}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, fontFamily: "'Poppins', sans-serif", color: T.textMain }}>
                  Demande de Consultation
                </h3>
                <p style={{ margin: 0, fontSize: '.75rem', color: T.textMuted }}>
                  Supervisée par le Dr Marie-Rose Edwige Rakié POUTYA
                </p>
              </div>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'rgba(234, 128, 37,.2)', color: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h4 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.2rem', fontWeight: 800, color: T.textMain, marginBottom: '.5rem' }}>
                  Demande transmise avec succès !
                </h4>
                <p style={{ fontSize: '.85rem', color: T.textMuted, maxWidth: 400, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                  Votre récapitulatif a été ouvert sur WhatsApp. Notre équipe médicale vous confirme l'horaire précis dès réception.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-ghost btn-sm"
                  style={{ padding: '.6rem 1.4rem' }}
                >
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: T.textSub, marginBottom: '.4rem' }}>
                      Votre Nom & Prénom *
                    </label>
                    <input
                      type="text"
                      name="ownerName"
                      required
                      placeholder="Ex: Jean Koumou"
                      value={bookingData.ownerName}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '.75rem 1rem', borderRadius: 10, background: T.light ? '#f5f5f5' : '#122415', border: `1px solid ${T.border}`, color: T.textMain, fontSize: '.85rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: T.textSub, marginBottom: '.4rem' }}>
                      Numéro Téléphone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="Ex: +242 06 123 45 67"
                      value={bookingData.phone}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '.75rem 1rem', borderRadius: 10, background: T.light ? '#f5f5f5' : '#122415', border: `1px solid ${T.border}`, color: T.textMain, fontSize: '.85rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: T.textSub, marginBottom: '.4rem' }}>
                      Espèce de l'animal / cheptel
                    </label>
                    <select
                      name="animalType"
                      value={bookingData.animalType}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '.75rem 1rem', borderRadius: 10, background: T.light ? '#f5f5f5' : '#122415', border: `1px solid ${T.border}`, color: T.textMain, fontSize: '.85rem', outline: 'none' }}
                    >
                      <option value="Chien / Chiot">Chien / Chiot</option>
                      <option value="Chat / Chaton">Chat / Chaton</option>
                      <option value="Bande de Volailles (Cobb 500 / Lohmann)">Bande de Volailles (Cobb 500 / Lohmann)</option>
                      <option value="Élevage Porcin">Élevage Porcin</option>
                      <option value="Bovins / Ovins / Caprins">Bovins / Ovins / Caprins</option>
                      <option value="Autre animal">Autre animal</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: T.textSub, marginBottom: '.4rem' }}>
                      Nom ou Réf. du lot (optionnel)
                    </label>
                    <input
                      type="text"
                      name="animalName"
                      placeholder="Ex: Rex / Lot Cobb 500 n°3"
                      value={bookingData.animalName}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '.75rem 1rem', borderRadius: 10, background: T.light ? '#f5f5f5' : '#122415', border: `1px solid ${T.border}`, color: T.textMain, fontSize: '.85rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: T.textSub, marginBottom: '.4rem' }}>
                    Prestation souhaitée *
                  </label>
                  <select
                    name="serviceId"
                    value={bookingData.serviceId}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '.75rem 1rem', borderRadius: 10, background: T.light ? '#f5f5f5' : '#122415', border: `1px solid ${T.border}`, color: T.textMain, fontSize: '.85rem', outline: 'none' }}
                  >
                    {CLINIC_SERVICES.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.duration})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: T.textSub, marginBottom: '.4rem' }}>
                      Lieu de l'intervention
                    </label>
                    <select
                      name="location"
                      value={bookingData.location}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '.75rem 1rem', borderRadius: 10, background: T.light ? '#f5f5f5' : '#122415', border: `1px solid ${T.border}`, color: T.textMain, fontSize: '.85rem', outline: 'none' }}
                    >
                      <option value="Clinique AVS (Socoprise, Pointe-Noire)">Clinique AVS (Socoprise, Pointe-Noire)</option>
                      <option value="Déplacement vétérinaire sur ferme / domicile">Déplacement vétérinaire sur ferme / domicile</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: T.textSub, marginBottom: '.4rem' }}>
                      Créneau horaire
                    </label>
                    <select
                      name="preferredTime"
                      value={bookingData.preferredTime}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: '.75rem 1rem', borderRadius: 10, background: T.light ? '#f5f5f5' : '#122415', border: `1px solid ${T.border}`, color: T.textMain, fontSize: '.85rem', outline: 'none' }}
                    >
                      <option value="Matin (08h00 - 12h30)">Matin (08h00 - 12h30)</option>
                      <option value="Après-midi (14h00 - 18h00)">Après-midi (14h00 - 18h00)</option>
                      <option value="URGENCE IMMÉDIATE">URGENCE IMMÉDIATE</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: T.textSub, marginBottom: '.4rem' }}>
                    Symptômes ou précisions utiles
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="Décrivez les symptômes, baisse de ponte, diarrhée, appétit, fièvre, blessure..."
                    value={bookingData.notes}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '.75rem 1rem', borderRadius: 10, background: T.light ? '#f5f5f5' : '#122415', border: `1px solid ${T.border}`, color: T.textMain, fontSize: '.85rem', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-raised"
                  style={{ width: '100%', justifyContent: 'center', padding: '.95rem', fontSize: '.9rem', marginTop: '.5rem' }}
                >
                  <MessageCircle size={16} />
                  Confirmer et Envoyer par WhatsApp
                </button>

                <p style={{ margin: 0, fontSize: '.72rem', color: T.textMuted, textAlign: 'center' }}>
                  Réponse médicale rapide · Consultation en clinique ou sur site d'élevage
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <PageCTA 
        message="Un doute sur l'état sanitaire de vos animaux ou de votre élevage ?" 
        cta="Consulter nos vétérinaires" 
      />
    </div>
  )
}
