'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Clock, Tag, ArrowRight, MessageCircle } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { cld } from '@/lib/cloudinary'
import { PageCTA } from '@/components/ui/index'
import { BLOG_POSTS } from '@/lib/data'

const FULL_ARTICLES = {
  'reussir-le-demarrage-de-ses-poussins-cobb-500': [
    { type: 'lead', text: "Les 14 premiers jours conditionnent 80% de la performance finale d'une bande de poulets de chair Cobb 500. Une gestion rigoureuse de la température, de la litière et de l'abreuvement est le secret des élevages rentables au Congo." },
    { type: 'h2', text: '1. La préparation du bâtiment et le vide sanitaire' },
    { type: 'p', text: "Avant toute arrivée, le local d'élevage doit avoir subi un nettoyage complet, un décapage, une désinfection certifiée et un vide sanitaire d'au moins 14 jours. Saupoudrez une litière de copeaux de bois secs et non poussiéreux d'au moins 5 à 7 cm d'épaisseur pour isoler les poussins du sol froid." },
    { type: 'h2', text: '2. Le préchauffage de la poussinière : 32°C à 35°C impératifs' },
    { type: 'p', text: "Allumez vos radiants ou éleveuses au moins 24 heures avant l'arrivée des cartons. La température au niveau du sol doit être stabilisée entre 32°C et 35°C. Les poussins ne régulent pas leur température corporelle durant leurs premiers jours : un coup de froid se traduit immédiatement par des retards de croissance et des mortalités." },
    { type: 'h2', text: '3. La mise à disposition immédiate de l\'eau et de l\'aliment de démarrage' },
    { type: 'p', text: "Dès l'installation, proposez de l'eau tiède additionnée d'anti-stress et de vitamines de démarrage (ou sérum glucosé léger). L'aliment démarrage AVS, calibré en miettes avec 21% à 22% de protéines brutes, doit être étalé sur des alvéoles ou papiers de démarrage pour stimuler l'appétit instantanément." },
    { type: 'h2', text: '4. Le test du jabot à 24 heures' },
    { type: 'p', text: "À H+24 après réception, palpez le jabot d'un échantillon de 100 poussins. Au moins 95% d'entre eux doivent avoir le jabot plein, souple et hydraté. Si les jabots sont durs ou vides, réajustez sans attendre l'éclairage, la hauteur des abreuvoirs ou la température." },
    { type: 'cta', text: "Besoin de poussins d'un jour Cobb 500 certifiés ou d'un suivi vétérinaire ?", href: '/contact' },
  ],
  'plan-de-prophylaxie-pourquoi-il-est-indispensable': [
    { type: 'lead', text: "Dans les pays tropicaux comme le Congo, l'absence de plan de prophylaxie vaccinale et médicale expose l'éleveur à la perte totale de son capital en moins de 48 heures." },
    { type: 'h2', text: '1. Comprendre la prophylaxie médicale et sanitaire' },
    { type: 'p', text: "La prophylaxie regroupe l'ensemble des mesures destinées à prévenir l'apparition, la propagation ou l'aggravation des maladies chez les animaux. Elle est double : sanitaire (hygiène, désinfection, sas de biosécurité) et médicale (vaccinations, vermifugations, vitamines)." },
    { type: 'h2', text: '2. Les vaccins fondamentaux en aviculture congolaise' },
    { type: 'p', text: "La maladie de Newcastle (pseudo-peste aviaire) et la bursite infectieuse (Gumboro) sont omniprésentes sous nos latitudes. Un calendrier rigoureux impose une vaccination précoce : premier vaccin Newcastle + Bronchite infectieuse dès J1 à J7, rappel Gumboro à J10-J14, et renforcement selon la pression épidémiologique locale." },
    { type: 'h2', text: '3. La gestion de la chaîne du froid' },
    { type: 'p', text: "Un vaccin vivant exposé à la chaleur ou dilué dans une eau chlorée perd 100% de son efficacité. Chez Agro Véto Services, nos vaccins sont conservés sous monitoring thermique continu et nous formons les éleveurs aux protocoles de reconstitution (eau sans chlore, lait écrémé protecteur, administration le matin tôt)." },
    { type: 'h2', text: '4. Un accompagnement vétérinaire sur-mesure' },
    { type: 'p', text: "Chaque zone agro-écologique possède son propre écosystème pathologique. Un calendrier standard téléchargé sur internet ne remplace jamais le plan de prophylaxie adapté par un docteur vétérinaire en fonction de l'historique sanitaire de votre exploitation." },
    { type: 'cta', text: "Faites valider votre calendrier de prophylaxie par notre équipe médicale", href: '/contact' },
  ],
  'pourquoi-les-pme-agroalimentaires-doivent-adopter-haccp': [
    { type: 'lead', text: "L'approche HACCP (Hazard Analysis Critical Control Point) n'est pas réservée aux multinationales : elle est le passeport indispensable des PME congolaises vers les supermarchés, les marchés publics et l'exportation." },
    { type: 'h2', text: "1. Qu'est-ce que la démarche HACCP ?" },
    { type: 'p', text: "L'HACCP est une méthode systématique et préventive d'assurance de la sécurité sanitaire des denrées alimentaires. Elle identifie, évalue et maîtrise les dangers significatifs au regard de la sécurité des aliments : dangers biologiques (bactéries, salmonelles), chimiques (résidus de détergents, mycotoxines) et physiques (corps étrangers)." },
    { type: 'h2', text: '2. Les 7 principes fondateurs simplifiés' },
    { type: 'p', text: "La démarche s'articule autour de 7 piliers : analyser les dangers, déterminer les points critiques de contrôle (CCP), établir les limites critiques, surveiller chaque CCP, définir les actions correctives, vérifier le bon fonctionnement du système et documenter l'ensemble des procédures." },
    { type: 'h2', text: '3. Les avantages compétitifs pour une PME au Congo' },
    { type: 'p', text: "Mettre en œuvre l'HACCP permet de réduire drastiquement les pertes et réclamations clients, de fidéliser les consommateurs et de négocier son référencement en grandes surfaces (Casino, Score, etc.) ou auprès des bases de vie industrielles pétrolières et minières." },
    { type: 'h2', text: '4. L\'accompagnement Agro Véto Services en QHSE' },
    { type: 'p', text: "Notre pôle QHSE et Conseil accompagne les entreprises agroalimentaires locales de bout en bout : diagnostic initial, rédaction du Plan de Maîtrise Sanitaire (PMS), formation du personnel aux Bonnes Pratiques d'Hygiène (BPH) et préparation aux audits de certification." },
    { type: 'cta', text: "Programmez un audit sanitaire et QHSE de votre unité de production", href: '/contact' },
  ],
  'regles-biosecurite-indispensables-ferme-tropicale': [
    { type: 'lead', text: "La biosécurité est la barrière invisible mais la plus efficace qui sépare un cheptel sain d'une épidémie dévastatrice. Voici les 5 réflexes incontournables sur toute ferme moderne." },
    { type: 'h2', text: '1. La clôture et le contrôle strict des accès' },
    { type: 'p', text: "Votre exploitation doit être clôturée pour empêcher l'intrusion d'animaux errants (chiens, rongeurs, oiseaux sauvages) vecteurs de pathogènes. Tout visiteur ou véhicule doit passer par un point d'enregistrement et respecter les consignes sanitaires." },
    { type: 'h2', text: '2. Le rotoluve et le pédiluve actif' },
    { type: 'p', text: "À l'entrée du site et devant chaque bâtiment d'élevage, installez un pédiluve contenant une solution désinfectante homologuée (virucide et bactéricide), renouvelée au minimum deux fois par semaine. Les bottes doivent être systématiquement brossées et trempées." },
    { type: 'h2', text: '3. Le sas sanitaire avec tenue dédiée' },
    { type: 'p', text: "On n'entre jamais dans un poulailler ou une porcherie avec ses vêtements de ville. Prévoyez un sas où le personnel et les intervenants enfilent des combinaisons ou blouses lavables et des bottes réservées exclusivement à la zone d'élevage." },
    { type: 'h2', text: '4. Le principe de la marche en avant' },
    { type: 'p', text: "Lors des soins quotidiens, visitez toujours les lots les plus jeunes et les plus sains en premier, pour terminer par les animaux les plus âgés ou convalescents. Cela évite le transfert de charges bactériennes vers les sujets les plus fragiles." },
    { type: 'h2', text: '5. L\'élimination hygiénique des cadavres et des déchets' },
    { type: 'p', text: "Tout animal mort doit être retiré immédiatement et enfoui dans une fosse à cadavres sécurisée avec de la chaux vive ou incinéré. Ne jetez jamais un cadavre à ciel ouvert ou aux abords des cours d'eau." },
    { type: 'cta', text: "Besoin d'un audit de biosécurité et d'équipements de désinfection ?", href: '/contact' },
  ],
}

const defaultContent = (post) => [
  { type: 'lead', text: post.excerpt },
  { type: 'h2', text: "L'expertise technique au service de votre rentabilité" },
  { type: 'p', text: "Dans un secteur agropastoral et agroalimentaire en plein essor au Congo, maîtriser les protocoles zootechniques, la nutrition et les normes sanitaires est le levier clé de succès." },
  { type: 'p', text: "Chez Agro Véto Services Congo, nous ne fournissons pas seulement des intrants et des soins. Nous concevons des solutions techniques globales adaptées aux réalités climatiques et économiques locales — aliments équilibrés, poussins certifiés, urgences vétérinaires 24/7 et audits QHSE." },
  { type: 'p', text: "Chaque démarche est pensée pour sécuriser vos investissements, maximiser votre taux de ponte ou de croissance, et garantir une sécurité alimentaire exemplaire." },
  { type: 'cta', text: "Discutons de vos besoins d'élevage ou d'audit", href: '/contact' },
]

export default function BlogArticleClient({ slug }) {
  const T = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  const post = BLOG_POSTS.find(p => p.slug === slug) || BLOG_POSTS[0]
  const content = FULL_ARTICLES[post.slug] || defaultContent(post)
  const related = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 2)

  return (
    <div style={{ paddingTop: 72 }}>
      {/* Header */}
      <section style={{ padding: '5rem 5% 4rem', background: T.bg, position: 'relative', overflow: 'hidden' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .2 }} />
        <div style={{ maxWidth: 780, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
            <Link href="/blog"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', fontSize: '.8rem', color: T.textMuted, marginBottom: '1.5rem', textDecoration: 'none', transition: 'color .2s' }}
              onMouseEnter={e => e.currentTarget.style.color = T.green}
              onMouseLeave={e => e.currentTarget.style.color = T.textMuted}>
              <ArrowLeft size={14} /> Retour au blog
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
              <span style={{ padding: '.25rem .85rem', borderRadius: 100, background: T.light ? 'rgba(234, 88, 12,.08)' : 'rgba(234, 128, 37,.08)', border: `1px solid ${T.border}`, fontFamily: "'Poppins', sans-serif", fontSize: '.65rem', fontWeight: 600, color: T.green, display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                <Tag size={10} />{post.category}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem', fontSize: '.72rem', color: T.textMuted }}>
                <Clock size={11} />{post.readTime} de lecture
              </span>
              <span style={{ fontSize: '.72rem', color: T.textMuted }}>
                {new Date(post.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Poppins', sans-serif", color: T.textMain, letterSpacing: '-.04em', lineHeight: 1.15, marginBottom: '1.5rem' }}>
              {post.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '2rem' }}>
              <img
                src="/images/dr_poutya.jpeg"
                alt="Dr Marie-Rose Edwige Rakié POUTYA SAIZONOU"
                style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 20%', border: '2px solid #ea8025', flexShrink: 0 }}
              />
              <div>
                <div style={{ fontSize: '.85rem', fontWeight: 700, color: T.textMain, fontFamily: "'Poppins', sans-serif" }}>
                  Dr Marie-Rose Edwige Rakié POUTYA SAIZONOU
                </div>
                <div style={{ fontSize: '.72rem', color: T.textMuted }}>
                  Médecin Vétérinaire & Directrice Générale, AVS Congo
                </div>
              </div>
            </div>

            <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: '3rem', border: `1px solid ${T.border}` }}>
              <img src={post.img} alt={post.title} style={{ width: '100%', height: 340, objectFit: 'cover', display: 'block' }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article body */}
      <section ref={ref} style={{ padding: '0 5% 5rem', background: T.bg }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          {content.map((block, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * .07 }}>

              {block.type === 'lead' && (
                <p style={{ fontSize: '1.05rem', color: T.textSub, lineHeight: 1.85, marginBottom: '2rem', paddingLeft: '1.2rem', borderLeft: `3px solid ${T.green}`, fontStyle: 'italic' }}>
                  {block.text}
                </p>
              )}
              {block.type === 'h2' && (
                <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.4rem', fontWeight: 800, color: T.textMain, letterSpacing: '-.03em', marginTop: '2.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                  <span style={{ width: 20, height: 2, background: T.green, display: 'inline-block', flexShrink: 0 }} />
                  {block.text}
                </h2>
              )}
              {block.type === 'p' && (
                <p style={{ fontSize: '.95rem', color: T.textSub, lineHeight: 1.85, marginBottom: '1.2rem' }}>
                  {block.text}
                </p>
              )}
              {block.type === 'cta' && (
                <div style={{ margin: '2.5rem 0', padding: '2rem', borderRadius: 16, background: T.light ? 'rgba(234, 88, 12,.05)' : 'rgba(234, 128, 37,.05)', border: `1px solid ${T.border}`, textAlign: 'center' }}>
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: T.textMain, marginBottom: '1.2rem', fontSize: '1.05rem' }}>{block.text}</p>
                  <Link href={block.href} className="btn-raised" style={{ display: 'inline-flex', padding: '.8rem 2rem' }}>
                    Nous contacter <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </motion.div>
          ))}

          
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section style={{ padding: '4rem 5%', background: T.bgAlt }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: '1.4rem', color: T.textMain, marginBottom: '2rem' }}>
              Articles similaires
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.5rem' }}>
              {related.map((p, i) => (
                <motion.article key={p.slug} className="sku-card"
                  initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * .1 }}
                  style={{ overflow: 'hidden' }}>
                  <div style={{ height: 160, overflow: 'hidden' }}>
                    <img src={p.img} alt={p.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s', display: 'block' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                  </div>
                  <div style={{ padding: '1.3rem' }}>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '.65rem', fontWeight: 600, color: T.green, letterSpacing: '.06em', display: 'flex', alignItems: 'center', gap: '.3rem', marginBottom: '.7rem' }}>
                      <Clock size={10} />{p.readTime}
                    </span>
                    <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '.92rem', color: T.textMain, lineHeight: 1.4, marginBottom: '.9rem' }}>{p.title}</h3>
                    <Link href={`/blog/${p.slug}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontSize: '.8rem', fontWeight: 700, color: T.green, textDecoration: 'none' }}>
                      Lire <ArrowRight size={12} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      <PageCTA message="Besoin d'un diagnostic de votre cheptel ou d'un conseil vétérinaire ?" cta="Consulter nos experts" />
    </div>
  )
}
