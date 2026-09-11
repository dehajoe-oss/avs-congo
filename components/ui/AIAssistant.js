'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { Bot, X, Send, MessageCircleWarning, ExternalLink, Phone, Globe, Mail } from 'lucide-react'
import { useTheme } from '@/lib/theme'

const HOUR = new Date().getHours()

const GREETINGS_DAY = [
  "Bonjour ! 👋 Bienvenue chez Agro Véto Services Congo. Vous recherchez des poussins Cobb 500, des aliments équilibrés, une consultation vétérinaire ou un audit QHSE ?",
  "Bienvenue ! 🐔🐾 Agro Véto Services vous accompagne de la santé animale à l'excellence QHSE. Comment pouvons-nous vous aider aujourd'hui ?",
  "Bonjour ! 🌿 Je suis le conseiller agropastoral virtuel d'Agro Véto Services Congo. Besoin d'un devis d'aliments, de commander des poussins ou d'une intervention ?",
  "Salut ! 👋 Besoin de conseils zootechniques, de réserver un lot de poussins d'un jour ou d'une formation à la ferme-école ? Je suis à votre écoute.",
]

const GREETINGS_NIGHT = [
  "Bonsoir ! 🌙 Notre clinique vétérinaire de Pointe-Noire assure une permanence 24h/24 & 7j/7 pour les urgences médicales et chirurgicales. Que puis-je faire pour vous ?",
  "Bonsoir ! 👀 Vous planifiez votre élevage ou vos besoins en provenderie ? Posez-moi vos questions, je vous réponds immédiatement.",
]

const GREETINGS_LUNCH = [
  "Bonjour ! ☀️ Besoin d'informations rapides sur nos poussins Cobb 500, nos formules alimentaires ou nos audits QHSE ? Je vous réponds !",
  "Bienvenue chez Agro Véto Services Congo ! 🌾 Une question sur la santé de votre cheptel ou sur nos produits ? Dites-moi tout.",
]

const GREETING = (HOUR >= 23 || HOUR < 6)
  ? GREETINGS_NIGHT[Math.floor(Math.random() * GREETINGS_NIGHT.length)]
  : (HOUR >= 12 && HOUR < 14)
    ? GREETINGS_LUNCH[Math.floor(Math.random() * GREETINGS_LUNCH.length)]
    : GREETINGS_DAY[Math.floor(Math.random() * GREETINGS_DAY.length)]
    
/* Regex pour détecter les liens dans les messages */
const URL_REGEX = /(https?:\/\/[^\s]+)/g
const WA_REGEX = /https:\/\/wa\.me\/\S+/g
const PORTFOLIO_REGEX = /https:\/\/agrovetoservices\.cg\/clinique\/?/g
const SITE_REGEX = /https:\/\/agrovetoservices\.cg\/?/g
const LINKEDIN_REGEX = /https:\/\/www\.linkedin\.com\/in\/[^\s]+/g
const GITHUB_REGEX = /https:\/\/github\.com\/[^\s]+/g

/* Détecte et transforme les liens en boutons cliquables */
function renderMessageContent(text) {
  if (!text) return text

  // D'abord, remplace les liens spécifiques par des boutons stylés
  let processed = text

  // WhatsApp
  processed = processed.replace(WA_REGEX, (match) => {
    return `\n[BUTTON_WA:${match}]\n`
  })

  // Portfolio
  processed = processed.replace(PORTFOLIO_REGEX, (match) => {
    return `\n[BUTTON_PORTFOLIO:${match}]\n`
  })

  // Site AKATech
  processed = processed.replace(SITE_REGEX, (match) => {
    return `\n[BUTTON_SITE:${match}]\n`
  })

  // LinkedIn
  processed = processed.replace(LINKEDIN_REGEX, (match) => {
    return `\n[BUTTON_LINKEDIN:${match}]\n`
  })

  // GitHub
  processed = processed.replace(GITHUB_REGEX, (match) => {
    return `\n[BUTTON_GITHUB:${match}]\n`
  })

  // Autres liens génériques
  processed = processed.replace(URL_REGEX, (match) => {
    if (match.includes('wa.me') || match.includes('agrovetoservices') || 
        match.includes('linkedin.com') || match.includes('github.com')) {
      return match // Déjà traité
    }
    return `\n[BUTTON_LINK:${match}]\n`
  })

  // Maintenant, on split et on rend chaque partie
  const parts = processed.split(/\n/)

  return parts.map((part, i) => {
    // Bouton WhatsApp
    if (part.startsWith('[BUTTON_WA:')) {
      const url = part.replace('[BUTTON_WA:', '').replace(']', '')
      return <WhatsAppButton key={i} url={url} />
    }

    // Bouton Portfolio
    if (part.startsWith('[BUTTON_PORTFOLIO:')) {
      const url = part.replace('[BUTTON_PORTFOLIO:', '').replace(']', '')
      return <PortfolioButton key={i} url={url} />
    }

    // Bouton Site
    if (part.startsWith('[BUTTON_SITE:')) {
      const url = part.replace('[BUTTON_SITE:', '').replace(']', '')
      return <SiteButton key={i} url={url} />
    }

    // Bouton LinkedIn
    if (part.startsWith('[BUTTON_LINKEDIN:')) {
      const url = part.replace('[BUTTON_LINKEDIN:', '').replace(']', '')
      return <LinkedInButton key={i} url={url} />
    }

    // Bouton GitHub
    if (part.startsWith('[BUTTON_GITHUB:')) {
      const url = part.replace('[BUTTON_GITHUB:', '').replace(']', '')
      return <GitHubButton key={i} url={url} />
    }

    // Bouton lien générique
    if (part.startsWith('[BUTTON_LINK:')) {
      const url = part.replace('[BUTTON_LINK:', '').replace(']', '')
      return <LinkButton key={i} url={url} label="Voir le lien" />
    }

    // Texte normal
    if (part.trim()) {
      return <span key={i}>{part}</span>
    }

    return <br key={i} />
  })
}

/* ── Boutons stylés ── */
function WhatsAppButton({ url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="ai-assistant-btn ai-assistant-btn-wa"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '.5rem',
        padding: '.55rem 1rem', borderRadius: 10,
        background: '#25d366',
        color: '#fff', fontSize: '.8rem', fontWeight: 600,
        textDecoration: 'none', margin: '.3rem 0',
        boxShadow: '0 2px 8px rgba(37,211,102,.3)',
        transition: 'transform .15s, box-shadow .15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,211,102,.4)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(37,211,102,.3)' }}
    >
      <Phone size={15} />
      Continuer sur WhatsApp
      <ExternalLink size={12} style={{ opacity: .7 }} />
    </a>
  )
}

function PortfolioButton({ url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="ai-assistant-btn ai-assistant-btn-portfolio"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '.5rem',
        padding: '.55rem 1rem', borderRadius: 10,
        background: '#c47b2d',
        color: '#fff', fontSize: '.8rem', fontWeight: 600,
        textDecoration: 'none', margin: '.3rem 0',
        boxShadow: '0 2px 8px rgba(196, 123, 45,.3)',
        transition: 'transform .15s, box-shadow .15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(196, 123, 45,.4)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(196, 123, 45,.3)' }}
    >
      <Globe size={15} />
      Prendre RDV en Clinique
      <ExternalLink size={12} style={{ opacity: .7 }} />
    </a>
  )
}

function SiteButton({ url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="ai-assistant-btn ai-assistant-btn-site"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '.5rem',
        padding: '.55rem 1rem', borderRadius: 10,
        background: '#4f46e5',
        color: '#fff', fontSize: '.8rem', fontWeight: 600,
        textDecoration: 'none', margin: '.3rem 0',
        boxShadow: '0 2px 8px rgba(102,126,234,.3)',
        transition: 'transform .15s, box-shadow .15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(102,126,234,.4)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(102,126,234,.3)' }}
    >
      <Globe size={15} />
      Visiter Agro Véto Services
      <ExternalLink size={12} style={{ opacity: .7 }} />
    </a>
  )
}

function LinkedInButton({ url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="ai-assistant-btn ai-assistant-btn-linkedin"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '.5rem',
        padding: '.55rem 1rem', borderRadius: 10,
        background: '#0077b5',
        color: '#fff', fontSize: '.8rem', fontWeight: 600,
        textDecoration: 'none', margin: '.3rem 0',
        boxShadow: '0 2px 8px rgba(0,119,181,.3)',
        transition: 'transform .15s, box-shadow .15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,119,181,.4)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,119,181,.3)' }}
    >
      <ExternalLink size={15} />
      LinkedIn d'Aka
      <ExternalLink size={12} style={{ opacity: .7 }} />
    </a>
  )
}

function GitHubButton({ url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="ai-assistant-btn ai-assistant-btn-github"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '.5rem',
        padding: '.55rem 1rem', borderRadius: 10,
        background: '#222222',
        color: '#fff', fontSize: '.8rem', fontWeight: 600,
        textDecoration: 'none', margin: '.3rem 0',
        boxShadow: '0 2px 8px rgba(0,0,0,.3)',
        transition: 'transform .15s, box-shadow .15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.4)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,.3)' }}
    >
      <ExternalLink size={15} />
      GitHub d'Aka
      <ExternalLink size={12} style={{ opacity: .7 }} />
    </a>
  )
}

function LinkButton({ url, label }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="ai-assistant-btn ai-assistant-btn-link"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '.5rem',
        padding: '.55rem 1rem', borderRadius: 10,
        background: 'rgba(196, 123, 45,.15)', border: '1px solid rgba(196, 123, 45,.3)',
        color: '#c47b2d', fontSize: '.8rem', fontWeight: 600,
        textDecoration: 'none', margin: '.3rem 0',
        transition: 'transform .15s, background .15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.background = 'rgba(196, 123, 45,.25)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = 'rgba(196, 123, 45,.15)' }}
    >
      <ExternalLink size={15} />
      {label}
      <ExternalLink size={12} style={{ opacity: .7 }} />
    </a>
  )
}

const AI_STIFFNESS = 0.18
const AI_FRICTION = 0.65
const AI_PANEL_W = 380
const AI_PANEL_H = 560
const AI_BTN_SIZE = 54
const AI_GAP = 14

export default function AIAssistant() {
  const T = useTheme()
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const listRef = useRef(null)
  const abortRef = useRef(null)

  const sessionIdRef = useRef(null)
  if (!sessionIdRef.current) sessionIdRef.current = crypto.randomUUID()

  const messagesRef = useRef(messages)
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const endConversation = useCallback((messagesList) => {
    if (!messagesList || messagesList.length < 2) return
    const payload = JSON.stringify({ sessionId: sessionIdRef.current })
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' })
      navigator.sendBeacon('/api/assistant/end', blob)
    } else {
      fetch('/api/assistant/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {})
    }
  }, [])

  useEffect(() => {
    const handleBeforeUnload = () => {
      endConversation(messagesRef.current)
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      abortRef.current?.abort()
      endConversation(messagesRef.current)
    }
  }, [endConversation])

  // ── Morph bouton → panneau (même mécanique que ProjectFormHome : le
  // formulaire est désormais toujours visible, donc ce bouton hérite de
  // l'effet ressort. Contrairement au formulaire, le bouton garde une
  // taille fixe (cercle) — seule sa position bascule du coin bas-gauche
  // vers le coin haut-droit du panneau ouvert) ──
  const wrapRef = useRef(null)
  const panelRef = useRef(null)
  const btnRef = useRef(null)
  const openRef = useRef(false)
  const panelAnim = useRef({ currentW: 0, currentH: 0, currentOpacity: 0, targetW: 0, targetH: 0, targetOpacity: 0, vxW: 0, vxH: 0, vxO: 0 })
  const btnAnim = useRef({ currentX: 0, currentY: 0, targetX: 0, targetY: 0, vxX: 0, vxY: 0 })

  const getPanelSize = () => (typeof window === 'undefined'
    ? { w: AI_PANEL_W, h: AI_PANEL_H }
    : { w: Math.min(AI_PANEL_W, window.innerWidth - 38), h: Math.min(AI_PANEL_H, window.innerHeight - 128) })

  const openPanel = () => {
    const { w, h } = getPanelSize()
    panelAnim.current.targetW = w
    panelAnim.current.targetH = h
    panelAnim.current.targetOpacity = 1
    btnAnim.current.targetX = w - AI_BTN_SIZE - AI_GAP
    btnAnim.current.targetY = h - AI_BTN_SIZE - AI_GAP
    if (reduceMotion) {
      Object.assign(panelAnim.current, { currentW: w, currentH: h, currentOpacity: 1 })
      Object.assign(btnAnim.current, { currentX: btnAnim.current.targetX, currentY: btnAnim.current.targetY })
    }
    setOpen(true)
    openRef.current = true
  }

  const closePanel = () => {
    panelAnim.current.targetW = 0
    panelAnim.current.targetH = 0
    panelAnim.current.targetOpacity = 0
    btnAnim.current.targetX = 0
    btnAnim.current.targetY = 0
    if (reduceMotion) {
      Object.assign(panelAnim.current, { currentW: 0, currentH: 0, currentOpacity: 0 })
      Object.assign(btnAnim.current, { currentX: 0, currentY: 0 })
    }
    setOpen(false)
    openRef.current = false
    endConversation(messagesRef.current)
  }

  const toggleOpen = () => { openRef.current ? closePanel() : openPanel() }

  // Boucle à ressort — identique à ProjectFormHome. En reduceMotion, les
  // valeurs current sont déjà égales aux target (voir openPanel/closePanel
  // ci-dessus) donc la boucle tourne mais n'anime rien.
  useEffect(() => {
    let raf = 0
    const tick = () => {
      const p = panelAnim.current
      const b = btnAnim.current
      p.vxW += (p.targetW - p.currentW) * AI_STIFFNESS; p.vxW *= AI_FRICTION; p.currentW += p.vxW
      p.vxH += (p.targetH - p.currentH) * AI_STIFFNESS; p.vxH *= AI_FRICTION; p.currentH += p.vxH
      p.vxO += (p.targetOpacity - p.currentOpacity) * AI_STIFFNESS; p.vxO *= AI_FRICTION; p.currentOpacity += p.vxO
      b.vxX += (b.targetX - b.currentX) * AI_STIFFNESS; b.vxX *= AI_FRICTION; b.currentX += b.vxX
      b.vxY += (b.targetY - b.currentY) * AI_STIFFNESS; b.vxY *= AI_FRICTION; b.currentY += b.vxY
      if (panelRef.current) {
        panelRef.current.style.width = `${p.currentW}px`
        panelRef.current.style.height = `${p.currentH}px`
        panelRef.current.style.opacity = String(p.currentOpacity)
        panelRef.current.style.visibility = p.currentOpacity > 0.05 ? 'visible' : 'hidden'
      }
      if (btnRef.current) {
        btnRef.current.style.transform = `translate3d(${b.currentX}px, ${-b.currentY}px, 0)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, streaming])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || streaming) return

    setErrorMsg(null)
    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages([...nextMessages, { role: 'assistant', content: '' }])
    setInput('')
    setStreaming(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages, sessionId: sessionIdRef.current }),
        signal: controller.signal,
      })

      if (!res.ok || !res.body) throw new Error('Réponse invalide du serveur')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        const snapshot = acc
        setMessages(curr => {
          const copy = [...curr]
          copy[copy.length - 1] = { role: 'assistant', content: snapshot }
          return copy
        })
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setErrorMsg("La connexion a été interrompue. Réessayez, ou écrivez directement sur WhatsApp.")
      }
    } finally {
      setStreaming(false)
    }
  }, [input, streaming, messages])

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  if (pathname?.startsWith('/explorer')) return null
  if (!mounted) return null

  return createPortal(
    <motion.div
      ref={wrapRef}
      initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: reduceMotion ? 0 : 2.4, type: 'spring', stiffness: 260, damping: 20 }}
      style={{ position: 'fixed', bottom: '2rem', left: '2rem', zIndex: 9000 }}
    >
      {/* ── Fenêtre de chat ── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Assistant Agro Véto Services"
        aria-hidden={!open}
        style={{
          position: 'absolute', bottom: 0, left: 0, zIndex: 1, overflow: 'hidden',
          background: T.card,
          border: `3px solid ${T.green}`,
          borderRadius: 12,
          boxShadow: '8px 8px 0px #050505',
        }}
      >
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{
            padding: '1rem 4.2rem 1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '.7rem',
            borderBottom: `2px solid ${T.green}`,
            background: T.light ? 'rgba(196, 123, 45,.07)' : 'rgba(196, 123, 45,.06)',
            flexShrink: 0,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 6, background: T.green,
              border: '2px solid #050505',
              boxShadow: '2px 2px 0px #050505',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#08120a', flexShrink: 0,
            }}>
              <Bot size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.1rem', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', color: T.textMain, letterSpacing: '.02em' }}>
                ASSISTANT AGRO VÉTO
              </div>
              <div style={{ fontSize: '.7rem', color: T.green, fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
                ⚡ Répond en direct
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '.85rem', background: T.bg }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '86%',
                background: m.role === 'user' ? T.green : T.card,
                color: m.role === 'user' ? '#08120a' : T.textMain,
                padding: '.7rem .95rem', borderRadius: 8,
                border: m.role === 'user'
                  ? ('2px solid #050505')
                  : `2px solid ${T.green}`,
                boxShadow: m.role === 'user'
                  ? ('3px 3px 0px #050505')
                  : `3px 3px 0px ${T.green}`,
                fontSize: '.85rem', fontWeight: m.role === 'user' ? 700 : 500, lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>
                {m.role === 'assistant' && m.content === '' && streaming && i === messages.length - 1
                  ? <TypingDots color={T.green} />
                  : renderMessageContent(m.content)}
              </div>
            ))}
            {errorMsg && (
              <div style={{ display: 'flex', gap: '.4rem', alignItems: 'flex-start', fontSize: '.78rem', color: '#e08a4a', background: 'rgba(224,138,74,.1)', padding: '.5rem', border: '1px solid #e08a4a', borderRadius: 6 }}>
                <MessageCircleWarning size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                {errorMsg}
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: '.8rem', borderTop: `2px solid ${T.green}`, background: T.card, display: 'flex', gap: '.6rem', flexShrink: 0 }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Décrivez votre projet…"
              rows={1}
              disabled={streaming}
              tabIndex={open ? 0 : -1}
              aria-label="Votre message"
              style={{
                flex: 1, resize: 'none', minHeight: 42, maxHeight: 90,
                background: T.light ? '#f7f7f7' : '#040d06',
                border: `2px solid ${T.green}`, borderRadius: 6,
                boxShadow: '3px 3px 0px #050505',
                padding: '.65rem .85rem', fontSize: '.85rem', color: T.textMain,
                fontFamily: 'inherit', outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={send}
              disabled={streaming || !input.trim()}
              tabIndex={open ? 0 : -1}
              aria-label="Envoyer"
              style={{
                width: 44, height: 44, minWidth: 44, borderRadius: 6, flexShrink: 0,
                background: streaming || !input.trim() ? (T.light ? 'rgba(196, 123, 45,.2)' : '#1a3320') : T.green,
                border: '2px solid #050505',
                boxShadow: '3px 3px 0px #050505',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: streaming || !input.trim() ? 'default' : 'pointer',
                color: '#08120a', transition: 'transform .1s, background .15s',
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Bouton flottant ── */}
      <button
        ref={btnRef}
        type="button"
        onClick={toggleOpen}
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant Agro Véto Services"}
        style={{
          position: 'absolute', bottom: 0, left: 0, zIndex: 2,
          width: AI_BTN_SIZE, height: AI_BTN_SIZE, minWidth: 44, minHeight: 44, borderRadius: 12,
          background: `${T.green}`,
          border: '3px solid #050505',
          boxShadow: '4px 4px 0px #050505',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#08120a', padding: 0, willChange: 'transform',
        }}
      >
        {open ? <X size={24} /> : <Bot size={26} />}
      </button>
    </motion.div>,
    document.body
  )
}

function TypingDots({ color }) {
  return (
    <span style={{ display: 'inline-flex', gap: 4, padding: '.15rem 0' }} aria-label="L'assistant écrit…">
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: '50%', background: color,
          animation: 'dot-blink 1.2s ease-in-out infinite',
          animationDelay: `${i * 0.15}s`,
        }} />
      ))}
    </span>
  )
}