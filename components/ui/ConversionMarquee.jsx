'use client'
/**
 * ConversionMarquee — "CONVERSION CTA"
 * Remplace le MarqueeStrip après WhyUs (desktop) / Process (mobile).
 * Objectif : pousser à l'action. Bande d'urgence qui défile en
 * continu + CTA fixe et pulsant qui ne défile jamais.
 */
import { ArrowRight, Bolt, Clock3, PhoneCall } from 'lucide-react'
import { HoverSlideText } from '@/components/ui/index'
import './ConversionMarquee.css'

const ITEMS = [
  { Icon: Bolt, pre: 'Poussins Cobb 500 ', strong: 'Arrivages hebdomadaires', post: '' },
  { Icon: Clock3, pre: 'Clinique Vétérinaire ', strong: 'Urgences 24h/24 & 7j/7', post: '' },
  { Icon: PhoneCall, pre: 'Devis QHSE & Audits sous ', strong: '24h à 48h', post: '' },
]

const WA_HREF = "https://wa.me/242060000000?text=Bonjour+Agro+V%C3%A9to+Services,+je+souhaite+des+renseignements+!"

function TickerSet({ hidden }) {
  return (
    <div className="ccta-set" aria-hidden={hidden || undefined}>
      {ITEMS.map((it, i) => (
        <span className="ccta-item" key={i}>
          <it.Icon size={16} strokeWidth={2.4} aria-hidden="true" />
          {it.pre}<strong>{it.strong}</strong>{it.post}
          <span className="ccta-sep">·</span>
        </span>
      ))}
    </div>
  )
}

export default function ConversionMarquee() {
  return (
    <section className="ccta-section" aria-label="Créneaux disponibles — démarrer un projet">
      <div className="ccta-band">
        <div className="ccta-track-wrap">
          <div className="ccta-track">
            <TickerSet hidden={false} />
            <TickerSet hidden={true} />
          </div>
        </div>
      </div>

      <div className="ccta-fixed">
        <a href={WA_HREF} target="_blank" rel="noreferrer" className="btn-raised btn-sm">
          <HoverSlideText text="Commander sur WhatsApp" />
          <ArrowRight size={15} strokeWidth={2.4} />
        </a>
      </div>
    </section>
  )
}
