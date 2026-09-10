// ── SHARED DATA — AGRO VÉTO SERVICES CONGO (A.V.S.) ───────────────────
import { cld } from './cloudinary'

export const SERVICES = [
  {
    icon: 'ShieldCheck',
    n: '// 01',
    title: 'Clinique Vétérinaire & Santé Animale',
    desc: "Soins médicaux, chirurgies, vaccinations, urgences 24h/24 & 7j/7 et suivi sanitaire d'élevage à Pointe-Noire. Consultations en cabinet ou directement sur vos exploitations agropastorales.",
    price: 'À partir de 15 000 FCFA',
    del: 'Disponible 24/7',
    img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
    features: ['Consultations & chirurgies', 'Vaccinations & carnets', 'Urgences 24h/24 & 7j/7', 'Visites sanitaires en ferme', 'Analyses de laboratoire'],
    slug: 'clinique-veterinaire',
    color: '#0284c7',
  },
  {
    icon: 'Package',
    n: '// 02',
    title: 'Provenderie & Nutrition Animale',
    desc: "Formulation et fabrication d'aliments équilibrés à haute valeur nutritionnelle pour volailles (démarrage, croissance, finition, ponte), porcs et poissons. Analyses bromatologiques rigoureuses.",
    price: 'À partir de 19 800 FCFA/sac',
    del: 'Stock continu',
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    features: ['Aliment démarrage 21% protéines', 'Aliment finition croissance', 'Aliments porcs & bétail', 'Contrôle bromatologique certifié', 'Formules sur-mesure'],
    slug: 'provenderie-nutrition',
    color: '#5a8738',
  },
  {
    icon: 'Layers',
    n: '// 03',
    title: 'Poussins d’un Jour & Reproduction',
    desc: "Distribution de poussins d'un jour vigoureux (chair Cobb 500 et pondeuses Lohmann Brown), vaccinés au couvoir (Marek + Newcastle), œufs à couver certifiés et géniteurs sélectionnés.",
    price: 'À partir de 650 FCFA/unité',
    del: 'Arrivages hebdomadaires',
    img: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
    features: ['Souche chair Cobb 500', 'Pondeuses Lohmann Brown', 'Vaccinés Marek + Newcastle', 'Taux de viabilité > 98%', 'Conditionnement sécurisé'],
    slug: 'poussins-reproduction',
    color: '#f59e0b',
  },
  {
    icon: 'Award',
    n: '// 04',
    title: 'Management QHSE, RSE & Normes ISO',
    desc: "Accompagnement normatif ISO 9001, 14001, 45001, 22000, démarche HACCP et formule novatrice « QHSE Partagé » pour externaliser la gestion qualité des PME à coût maîtrisé.",
    price: 'Sur devis personnalisé',
    del: 'Diagnostic sous 48h',
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    features: ['Audits ISO 9001 / 14001 / 22000', 'Méthode HACCP & sécurité SPS', 'Offre « QHSE Partagé » PME', 'Plans de prévention & Document Unique', 'Études d’impact RSE'],
    slug: 'management-qhse',
    color: '#15803d',
  },
  {
    icon: 'GraduationCap',
    n: '// 05',
    title: 'Centre de Formation & Ferme-École',
    desc: "Formations pratiques certifiantes : conduite d'un cheptel avicole, maîtrise de l'hygiène HACCP, fabrication artisanale de savon et formation d'auditeurs internes d'entreprise.",
    price: 'À partir de 60 000 FCFA',
    del: 'Sessions mensuelles',
    img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    features: ['100% pratique en ferme-école', 'Élevage avicole & prophylaxie', 'Norme HACCP & hygiène alimentaire', 'Fabrication savons & détergents', 'Certificat officiel AVS délivré'],
    slug: 'formations-pratiques',
    color: '#6366f1',
  },
  {
    icon: 'Sparkles',
    n: '// 06',
    title: 'Cosmétique, Hygiène & Biosécurité',
    desc: "Formulation locale de produits d'hygiène professionnelle : détergents désinfectants haute efficacité, virucides pour bâtiments d'élevage et savons noirs écologiques enrichis en huiles locales.",
    price: 'À partir de 1 500 FCFA',
    del: 'Disponible en boutique',
    img: 'https://images.unsplash.com/photo-1608248597359-0091873130d2?auto=format&fit=crop&w=800&q=80',
    features: ['Désinfectant virucide d’élevage', 'Détergent pro multi-surfaces', 'Savon noir saponifié à froid', 'Protocoles de biosécurité', 'Conditionnements 250g à 20L'],
    slug: 'hygiene-biosecurite',
    color: '#a855f7',
  },
]

export const PROJECTS = [
  {
    id: 11,
    title: "Poussins Cobb 500 (Chair)",
    type: "Intrant Élevage",
    subtitle: "Poussins d'un Jour Haute Performance",
    desc: "Souche leader mondiale de poulets de chair. Croissance rapide, robustesse exceptionnelle en climat tropical et indice de consommation optimisé pour les éleveurs congolais.",
    img: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
    imgMobile: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80',
    tech: ['Cobb 500', 'Vacciné Marek & Newcastle', 'Viabilité > 98%', 'Écloserie contrôlée'],
    url: '/contact',
    result: '↑ Croissance rapide',
    problem: "Les éleveurs locaux faisaient face à des taux de mortalité élevés au démarrage dus à des souches mal adaptées ou non vaccinées.",
    solution: "Fourniture de poussins Cobb 500 vaccinés dès le couvoir, accompagnés d'un protocole de démarrage clé en main.",
    impact: "Taux de mortalité moyen réduit à moins de 2% sur les bandes suivies à Pointe-Noire.",
    live: true,
    year: '2026',
    progress: 100,
  },
  {
    id: 12,
    title: "Aliment Démarrage Haute Énergie",
    type: "Provenderie",
    subtitle: "Sac de 50kg — 21% Protéines Brutes",
    desc: "Formule enrichie en acides aminés, vitamines et minéraux digestibles pour assurer un développement squelettique et un système immunitaire robuste dès les premiers jours.",
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    imgMobile: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    tech: ['Sac 50kg', '21% Protéines', 'Anti-coccidien', 'Contrôle bromatologique'],
    url: '/contact',
    result: '↑ Poids vif à J14',
    problem: "Aliments du commerce irréguliers en nutriments, causant des retards de croissance et des troubles digestifs fréquents.",
    solution: "Formulation industrielle stricte avec analyse en laboratoire bromatologique pour garantir une teneur protéique constante.",
    impact: "Poids moyen à J14 supérieur de 18% aux moyennes observées avec des mélanges artisanaux non contrôlés.",
    live: true,
    year: '2026',
    progress: 100,
  },
  {
    id: 15,
    title: "Suivi Sanitaire Cheptel Kouilou",
    type: "Clinique Vétérinaire",
    subtitle: "Accompagnement Ferme Pilote 5 000 Sujets",
    desc: "Plan complet de prophylaxie médicale et sanitaire, visites zootechniques hebdomadaires, autopsies préventives et gestion de l'alimentation en immersion.",
    img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
    imgMobile: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80',
    tech: ['Prophylaxie', 'Urgences 24/7', 'Autopsies', 'Biosécurité'],
    url: '/contact',
    result: '↑ Mortalité < 1.8%',
    problem: "Pertes récurrentes de 10 à 15% par vague sans diagnostic clinique précis sur l'exploitation.",
    solution: "Mise en place d'un protocole rigoureux de biosécurité, désinfection des locaux et visites vétérinaires régulières par Dr POUTYA.",
    impact: "Rentabilité de la ferme rétablie et extension de la capacité d'élevage à 8 000 sujets.",
    live: true,
    year: '2026',
    progress: 100,
  },
  {
    id: 16,
    title: "Accompagnement HACCP & Qualité SPS",
    type: "Audit QHSE",
    subtitle: "Unité de Transformation Agroalimentaire",
    desc: "Diagnostic hygiène, mise en place des 7 principes HACCP, identification des points critiques (CCP) et validation du Plan de Maîtrise Sanitaire.",
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    imgMobile: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
    tech: ['Norme ISO 22000', 'HACCP', 'Audit SPS', 'Traçabilité'],
    url: '/contact',
    result: '↑ 100% Conformité',
    problem: "Difficultés pour l'unité agroalimentaire à distribuer ses produits en grandes surfaces par manque de certification sanitaire formelle.",
    solution: "Audit complet de conformité, réaménagement du circuit propre/sale et formation de tout le personnel aux règles d'hygiène.",
    impact: "Agrément sanitaire obtenu et contractualisation avec 3 chaînes de distribution à Pointe-Noire.",
    live: true,
    year: '2026',
    progress: 100,
  },
  {
    id: 17,
    title: "Immersion Ferme-École Avicole",
    type: "Formation Pratique",
    subtitle: "Session Certifiante Conduite d’Élevage",
    desc: "Formation intensive de 5 jours sur le terrain : préparation du bâtiment, démarrage des poussins, plans de vaccination, alimentation et calcul de rentabilité.",
    img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    imgMobile: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    tech: ['5 Jours (30h)', 'Ferme-École', 'Pratique 100%', 'Certificat officiel'],
    url: '/contact',
    result: '↑ +45 Éleveurs formés',
    problem: "Nombreux échecs d'éleveurs débutants causés par un manque de compétences pratiques en gestion de la litière et conduite zootechnique.",
    solution: "Ateliers pratiques en situation réelle avec manipulation directe des poussins et élaboration du calendrier de prophylaxie.",
    impact: "94% des participants ont lancé ou optimisé leur élevage avec succès dans les 3 mois suivants.",
    live: true,
    year: '2026',
    progress: 100,
  },
  {
    id: 18,
    title: "Désinfectant Virucide & Savon Éco",
    type: "Hygiène & Biosécurité",
    subtitle: "Gamme Sanitaire Locale Pointe-Noire",
    desc: "Détergent professionnel multi-surfaces et savon noir saponifié à froid formulés pour les exigences de biosécurité des fermes et cliniques.",
    img: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80',
    imgMobile: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80',
    tech: ['Saponification à froid', 'Virucide', 'Biosécurité', 'Production locale'],
    url: '/contact',
    result: '↑ Protection continue',
    problem: "Coût élevé et disponibilité incertaine des produits de désinfection importés sur le marché congolais.",
    solution: "Production locale aux normes vétérinaires d'une gamme accessible et ultra-efficace pour les pédiluves et locaux.",
    impact: "Coût de désinfection réduit de 35% pour les fermes partenaires d'AVS Congo.",
    live: true,
    year: '2026',
    progress: 100,
  },
  {
    id: 19,
    title: "Poussins Pondeuses Lohmann Brown",
    type: "Intrant Élevage",
    subtitle: "Poussins Femelles Sexées 99%",
    desc: "La référence pour la production d'œufs de consommation. Entrée en ponte précoce (18-20 semaines), coquille solide et persistance de ponte jusqu'à 320 œufs par an.",
    img: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80',
    imgMobile: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80',
    tech: ['Lohmann Brown', 'Sexage garanti 99%', 'Pic de ponte durable', 'Calibre œufs M/L'],
    url: '/contact',
    result: '↑ Jusqu’à 320 œufs/an',
    problem: "Rareté des souches pondeuses de qualité certifiée au Congo, obligeant les éleveurs à des importations risquées.",
    solution: "Disponibilité régulière de poussins Lohmann Brown avec carnet de prophylaxie adapté aux conditions climatiques de Pointe-Noire.",
    impact: "Approvisionnement sécurisé pour plus de 30 fermes de ponte régionales.",
    live: true,
    year: '2026',
    progress: 100,
  },
]

export const TESTIMONIALS = [
  { 
    name: 'Jean-Paul Moukoko', 
    role: 'Gérant · Ferme Avicole du Kouilou', 
    project: 'Poussins & Provenderie', 
    rating: 5, 
    text: "Grâce aux poussins Cobb 500 et à l'aliment de démarrage AVS, la mortalité sur ma bande de 2 000 sujets est tombée à 1.6%. Un suivi vétérinaire rigoureux et des conseils toujours pertinents.", 
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', 
    result: '↑ Mortalité réduite à 1.6%' 
  },
  { 
    name: 'Sylvie Kimbembé', 
    role: 'Directrice Qualité · Unité Agroalimentaire', 
    project: 'Audit QHSE & HACCP', 
    rating: 5, 
    text: "L'expertise du Dr POUTYA et la formule « QHSE Partagé » ont transformé notre chaîne de conditionnement. Nous avons obtenu notre agrément sanitaire en un temps record !", 
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80', 
    result: '↑ Agrément SPS obtenu' 
  },
  { 
    name: 'Alain Boukoulou', 
    role: 'Éleveur Avicole & Porteur de Projet', 
    project: 'Formation Ferme-École', 
    rating: 5, 
    text: "La formation de 5 jours en immersion m'a évité toutes les erreurs classiques du débutant. Aujourd'hui, mon élevage tourne à plein régime et génère des revenus constants.", 
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', 
    result: '↑ Rentabilité garantie' 
  },
]

export const TEAM = [
  { 
    name: "Dr Marie-Rose Edwige Rakié POUTYA SAIZONOU", 
    role: 'Fondatrice & Directrice Générale', 
    skills: ['Médecine Vétérinaire', 'Management QHSE', 'Sécurité Sanitaire HACCP / ISO 22000', 'Formations Agropastorales', 'Provenderie'], 
    bio: "Médecin Vétérinaire praticienne et Spécialiste en Management QHSE avec plus de 10 ans d'expérience. Ancienne Responsable Qualité dans l'industrie, elle dirige AGRO VÉTO SERVICES CONGO pour propulser l'excellence agropastorale et sanitaire en République du Congo.", 
    img: '/images/dr_poutya.jpeg' 
  },
]

export const STATS = [
  { val: 6, suffix: '', label: "Pôles d'expertise intégrés" },
  { val: 500, suffix: '+', label: 'Éleveurs & PME accompagnés' },
  { val: 99, suffix: '%', label: 'Conformité sanitaire' },
  { val: 24, suffix: '/7', label: 'Urgences cliniques' },
]

export const BLOG_POSTS = [
  {
    slug: 'reussir-le-demarrage-de-ses-poussins-cobb-500',
    title: "Comment réussir à coup sûr le démarrage de ses poussins d'un jour",
    excerpt: "Les 14 premiers jours conditionnent 80% de la performance finale d'une bande de poulets de chair. Température, litière, plan d'hydratation et démarrage : les recommandations clés d'AVS.",
    category: 'Santé Animale',
    date: '2026-08-15',
    readTime: '4 min',
    img: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'plan-de-prophylaxie-pourquoi-il-est-indispensable',
    title: "Le calendrier de prophylaxie : l'assurance-vie de votre élevage",
    excerpt: "Mieux vaut prévenir que guérir. Pourquoi et comment vacciner contre Newcastle, Gumboro et Marek au bon moment pour préserver la totalité de votre cheptel.",
    category: 'Médecine Vétérinaire',
    date: '2026-08-28',
    readTime: '5 min',
    img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'pourquoi-les-pme-agroalimentaires-doivent-adopter-haccp',
    title: "La méthode HACCP expliquée simplement pour les PME congolaises",
    excerpt: "Comment identifier les dangers microbiologiques et chimiques pour garantir des aliments sains, séduire la grande distribution et respecter les normes internationales.",
    category: 'Management QHSE',
    date: '2026-09-02',
    readTime: '4 min',
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'regles-biosecurite-indispensables-ferme-tropicale',
    title: "Les 5 règles d'or de la biosécurité dans un bâtiment d'élevage moderne",
    excerpt: "Pédiluves, sas sanitaire, rotation des désinfectants et contrôle des visiteurs : protégez votre investissement des pathogènes extérieurs.",
    category: 'Biosécurité',
    date: '2026-09-06',
    readTime: '3 min',
    img: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80',
  },
]

export const FAQ_ITEMS = [
  { 
    q: 'Comment commander des poussins d’un jour Cobb 500 ou Lohmann Brown ?', 
    a: "Les commandes se font par téléphone, au siège à Socoprise Pointe-Noire ou directement via WhatsApp. Les arrivages ont lieu chaque semaine par cartons de 50 poussins, vaccinés au couvoir. Un acompte confirme la réservation pour le lot suivant." 
  },
  { 
    q: 'Comment fonctionne le service d’urgence vétérinaire 24h/24 ?', 
    a: "Notre clinique vétérinaire assure une permanence continue 24h/24 et 7j/7 pour les urgences médicales et chirurgicales, sur appel direct ou présentation à notre siège de Pointe-Noire." 
  },
  { 
    q: "Qu’est-ce qui distingue les aliments de la provenderie AVS Congo ?", 
    a: "Nos formules d'aliments (Démarrage, Finition, Pondeuses, Porcs) sont équilibrées par des spécialistes en nutrition animale et contrôlées dans notre laboratoire bromatologique pour garantir un taux protéique et minéral optimal sans carences." 
  },
  { 
    q: 'En quoi consiste l’offre « QHSE Partagé » pour les PME ?', 
    a: "Elle permet à une entreprise de bénéficier des compétences d'un ingénieur/expert QHSE à temps partagé sans supporter le coût d'un recrutement à plein temps : mise en place de la démarche HACCP, audits internes ISO, conformité sanitaire et formations d'équipes." 
  },
  { 
    q: 'Comment se déroulent les formations pratiques à la ferme-école ?', 
    a: "Nos formations durent de 3 à 5 jours selon les modules (aviculture, HACCP, fabrication de détergents, auditeur interne). Elles associent apports méthodologiques et pratique immersive sur le terrain avec remise d'un certificat officiel." 
  },
  { 
    q: 'Quels sont les moyens de paiement acceptés ?', 
    a: "Nous acceptons MTN Mobile Money, Airtel Money, virement bancaire ou règlement en espèces directement au siège de la société à Pointe-Noire." 
  },
  { 
    q: "Le Dr POUTYA et son équipe se déplacent-ils sur les exploitations ?", 
    a: "Oui, nous réalisons des audits zootechniques, des visites sanitaires de cheptel et des interventions vétérinaires directement sur vos fermes et sites d'élevage à Pointe-Noire et dans les départements voisins." 
  },
]

export const PRICING = {
  poussins: {
    label: "Poussins d'un Jour & Intrants",
    plans: [
      {
        badge: 'COBB 500 (CHAIR)', price: '650 FCFA / unité', del: 'Hebdomadaire', popular: true,
        features: ['Carton de 50 poussins', 'Vaccinés Marek + Newcastle', 'Taux de croissance exceptionnel', 'Indice de consommation optimal', 'Protocole de démarrage offert'],
      },
      {
        badge: 'LOHMANN BROWN (PONTE)', price: '950 FCFA / unité', del: 'Sur réservation',
        features: ['Poussins femelles sexées à 99%', 'Entrée en ponte 18-20 semaines', 'Pic de ponte jusqu’à 320 œufs/an', 'Coquille résistante', 'Calendrier de ponte inclus'],
      },
      {
        badge: 'ŒUFS À COUVER (OAC)', price: 'Sur devis', del: 'Selon disponibilité',
        features: ['Sélection génétique rigoureuse', 'Taux de fertilité élevé', 'Conditionnement alvéoles protectrices', 'Contrôle sanitaire certifié'],
      },
    ],
  },
  provenderie: {
    label: 'Provenderie & Nutrition',
    plans: [
      {
        badge: 'DÉMARRAGE VOLAILLE', price: '21 500 FCFA / sac', del: 'Sac 50 kg', popular: true,
        features: ['21% de protéines brutes', 'Enrichi en minéraux & vitamines', 'Anti-coccidien inclus', 'Pour poussins J1 à J14', 'Haute digestibilité'],
      },
      {
        badge: 'FINITION VOLAILLE', price: '19 800 FCFA / sac', del: 'Sac 50 kg',
        features: ['18.5% de protéines brutes', 'Gain de poids accéléré', 'Chair ferme et savoureuse', 'Idéal à partir de J28', 'Rendement carcasse maximal'],
      },
      {
        badge: 'ALIMENT PORC & BÉTAIL', price: 'Sur devis', del: 'Formule adaptée',
        features: ['Aliment truies, porcelets & engraissement', 'Richesse en énergie métabolisable', 'Contrôle bromatologique', 'Tarif dégressif par tonne'],
      },
    ],
  },
  formations: {
    label: 'Formations Certifiantes',
    plans: [
      {
        badge: 'ÉLEVAGE AVICOLE', price: '75 000 FCFA', del: '5 jours (30h)', popular: true,
        features: ['Immersion ferme-école', 'Biosécurité & poulailler moderne', 'Conduite démarrage & litière', 'Prophylaxie vétérinaire', 'Certificat officiel AVS délivré'],
      },
      {
        badge: 'MÉTHODE HACCP / ISO 22000', price: '120 000 FCFA', del: '3 jours (18h)',
        features: ['Norme sanitaire internationale', 'Points critiques CCP', 'Plan de Maîtrise Sanitaire (PMS)', 'Pour cuisiniers & transformateurs', 'Attestation certifiante'],
      },
      {
        badge: 'FABRICATION SAVONS & HYGIÈNE', price: '60 000 FCFA', del: '4 jours (24h)',
        features: ['Saponification à froid', 'Savons durs & savons liquides', 'Détergents désinfectants pro', 'Calcul des coûts de revient', 'Kit pratique inclus'],
      },
    ],
  },
  clinique: {
    label: 'Clinique & Soins Vétérinaires',
    plans: [
      {
        badge: 'CONSULTATION MÉDICALE', price: '15 000 FCFA', del: 'En clinique / sur RDV',
        features: ['Diagnostic clinique complet', 'Auscultation & prescription', 'Conseils zootechniques', 'Suivi du carnet sanitaire'],
      },
      {
        badge: 'SUIVI D’ÉLEVAGE EN FERME', price: 'Sur devis', del: 'Demi-journée / journée', popular: true,
        features: ['Déplacement sur votre exploitation', 'Audit de biosécurité du cheptel', 'Autopsie aviaire si nécessaire', 'Ajustement plan de prophylaxie', 'Rapport vétérinaire détaillé'],
      },
      {
        badge: 'URGENCES 24H/24 & 7J/7', price: 'Sur appel', del: 'Intervention immédiate',
        features: ['Chirurgie & réanimation', 'Stérilisations & césariennes', 'Prise en charge traumatismes', 'Disponible nuit, week-ends & fériés'],
      },
    ],
  },
  qhse: {
    label: 'Audits QHSE & Normes ISO',
    plans: [
      {
        badge: 'DIAGNOSTIC SANITAIRE', price: 'Sur devis', del: 'Sous 48h',
        features: ['Audit de conformité SPS', 'Inspection des flux & installations', 'Identification des non-conformités', 'Plan d’actions correctives immédiat'],
      },
      {
        badge: '« QHSE PARTAGÉ » PME', price: 'Formule mensuelle', del: 'Accompagnement continu', popular: true,
        features: ['Cadre QHSE dédié à temps partiel', 'Préparation aux certifications ISO', 'Formation du personnel aux bonnes pratiques', 'Suivi documentaire & audits internes'],
      },
      {
        badge: 'AUDIT ISO 9001 / 14001 / 45001', price: 'Étude sur-mesure', del: 'Selon périmètre',
        features: ['Audit à blanc pré-certification', 'Analyse environnementale & risques', 'Revue de direction & amélioration continue'],
      },
    ],
  },
}

// ── Rétro-compatibilité pour les composants appelant d'anciennes clés ──
for (const [alias, target] of [
  ['vitrine', 'poussins'],
  ['portfolio', 'clinique'],
  ['ecommerce', 'provenderie'],
  ['saas', 'qhse'],
  ['gbp', 'formations']
]) {
  Object.defineProperty(PRICING, alias, {
    get() { return PRICING[target] },
    enumerable: false,
    configurable: true
  })
}

export const PROJECT_TYPE_LABELS = {
  'clinique': 'Clinique & Soins Vétérinaires',
  'provenderie': 'Provenderie & Nutrition Animale',
  'poussins': 'Poussins d’un Jour (Cobb 500 / Lohmann)',
  'formations': 'Centre de Formation Professionnelle',
  'qhse': 'Management QHSE, RSE & Normes ISO',
  'cosmetique': 'Cosmétique, Hygiène & Biosécurité',
  'autre': 'Autre demande agropastorale',
}

// ── Conversion Cloudinary si disponible, sinon conservation du chemin local ──
for (const arr of [PROJECTS, TESTIMONIALS, TEAM, BLOG_POSTS]) {
  for (const item of arr) {
    if (item.img && typeof item.img === 'string' && item.img.startsWith('/images/')) {
      item.img = cld(item.img)
    }
    if (item.imgMobile && typeof item.imgMobile === 'string' && item.imgMobile.startsWith('/images/')) {
      item.imgMobile = cld(item.imgMobile)
    }
  }
}

export const CLINIC_SERVICES = [
  { id: "CONSULT", name: "Consultation Médicale Générale", duration: "30-45 min", description: "Diagnostic clinique complet, auscultation et ordonnance de traitement.", price: "15 000 FCFA" },
  { id: "VACCIN", name: "Vaccination & Carnet de Santé", duration: "20 min", description: "Vaccins chiots/chiens (Rage, Parvo, Maladie de Carré), chats et volailles.", price: "À partir de 10 000 FCFA" },
  { id: "CHIRURGIE", name: "Chirurgie & Soins d'Urgence", duration: "1h - 2h", description: "Stérilisation, césariennes, sutures de plaies et interventions d'urgence 24h/24.", price: "Sur devis / urgence" },
  { id: "ELEVAGE_SUIVI", name: "Visite Sanitaire & Suivi d'Élevage", duration: "Demi-journée", description: "Déplacement vétérinaire sur votre site d'élevage, audit zootechnique et prophylaxie.", price: "Sur devis" },
  { id: "LABO", name: "Analyses de Laboratoire & Bromatologie", duration: "Variable", description: "Autopsie aviaire, parasitologie, coprologie et analyses bromatologiques des aliments.", price: "Sur devis" }
]

export const TRAINING_MODULES = [
  {
    id: "TRAIN-01",
    title: "Maîtrise Complète de l'Élevage Avicole (Poulets de Chair & Pondeuses)",
    category: "Agropastoral",
    duration: "5 Jours (30h) - Théorie & Immersion Ferme-École",
    price: "75 000 FCFA",
    target: "Éleveurs débutants, porteurs de projets, techniciens agricoles",
    nextSession: "Prochaine session hebdomadaire",
    modulesCovered: [
      "Conception et biosécurité du poulailler moderne en climat tropical",
      "Conduite du démarrage des poussins et gestion de la litière",
      "Plan de prophylaxie vétérinaire : vaccins, vermifuges, vitamines",
      "Nutrition et calcul du ratio coût/croissance",
      "Gestion comptable et rentabilité d'un cheptel avicole"
    ]
  },
  {
    id: "TRAIN-02",
    title: "Méthode HACCP & Hygiène Sanitaire des Aliments (Norme ISO 22000)",
    category: "QHSE & Agroalimentaire",
    duration: "3 Jours (18h) - Certifiant",
    price: "120 000 FCFA",
    target: "Responsables qualité, cuisiniers, gérants de restaurants/hôtels, transformateurs",
    nextSession: "Sessions bimensuelles",
    modulesCovered: [
      "Les 7 principes et 12 étapes de la méthode HACCP",
      "Identification des dangers microbiologiques, chimiques et physiques",
      "Mise en place des Points Critiques de Contrôle (CCP) et surveillance",
      "Traçabilité, gestion des non-conformités et audits internes",
      "Validation d'un Plan de Maîtrise Sanitaire (PMS)"
    ]
  },
  {
    id: "TRAIN-03",
    title: "Fabrication Artisanale & Industrielle de Savons et Détergents",
    category: "Technique & Savoir-faire",
    duration: "4 Jours (24h) - Pratique 100% Atelier",
    price: "60 000 FCFA",
    target: "Femmes entrepreneures, jeunes, créateurs d'entreprises locales",
    nextSession: "Sessions mensuelles",
    modulesCovered: [
      "Chimie de la saponification à froid et règles de sécurité (soude)",
      "Formulation de savons durs, savons liquides et détergents ménagers",
      "Calcul des indices de saponification et surgraissage aux huiles locales",
      "Coloration naturelle, parfumerie et conditionnement commercial",
      "Calcul du coût de revient et stratégie de mise sur le marché"
    ]
  },
  {
    id: "TRAIN-04",
    title: "Auditeur Interne & Management Intégré QHSE (ISO 9001, 14001, 45001)",
    category: "Management & Entreprises",
    duration: "5 Jours (30h) - Certificat délivré",
    price: "250 000 FCFA",
    target: "Cadres HSE, directeurs d'exploitation, ingénieurs et consultants",
    nextSession: "Sessions trimestrielles",
    modulesCovered: [
      "Exigences communes de la structure HLS des normes ISO",
      "Évaluation des risques professionnels et analyse environnementale",
      "Méthodologie de conduite d'un audit interne (norme ISO 19011)",
      "Rédaction des fiches de non-conformité et plans d'actions correctives",
      "Pilotage des revues de direction et amélioration continue"
    ]
  }
]

