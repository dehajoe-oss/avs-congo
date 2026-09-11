// ── SHARED DATA — AGRO VÉTO SERVICES CONGO (A.V.S.) ───────────────────
import { cld } from './cloudinary'

export const COMPANY_INFO = {
  name: "AGRO VÉTO SERVICES CONGO S.A.R.L.U.",
  legalForm: "Société à Responsabilité Limitée Unipersonnelle (SARLU)",
  address: "Quartier Socoprise, Avenue Nelson Mandela, Rue Bissoute, Pointe-Noire, République du Congo.",
  founder: {
    name: "Dr POUTYA SAIZONOU Marie-Rose Edwige Rakié",
    title: "Fondatrice & Directrice Générale",
    role: "Médecin Vétérinaire Praticienne & Spécialiste QHSE",
    bio: [
      "Médecin vétérinaire praticienne et spécialiste en Management de la Qualité, Hygiène, Sécurité et Environnement (QHSE), le Docteur Marie-Rose Edwige Rakié POUTYA possède une expertise transversale dans la santé animale, la sécurité sanitaire des aliments et le développement agropastoral.",
      "Ancienne responsable qualité dans l'industrie et entrepreneure engagée, elle fonde AGRO VÉTO SERVICES CONGO avec l'ambition de proposer une offre intégrée répondant aux enjeux de l'élevage, de la transformation agroalimentaire et de la conformité normative.",
      "Passionnée par la transmission des compétences, elle contribue également au renforcement des capacités des producteurs et professionnels à travers des formations pratiques dans les domaines vétérinaire, agroalimentaire et QHSE."
    ]
  },
  directorWord: {
    title: "Mot de la Direction",
    text: [
      "Bienvenue chez AGRO VÉTO SERVICES CONGO.",
      "Notre entreprise est née d'une conviction profonde : la santé animale, la qualité agroalimentaire et la gestion environnementale sont étroitement liées et constituent des piliers essentiels d'un développement économique durable.",
      "Nous mettons notre expertise scientifique et technique au service des éleveurs, producteurs, PME, industries et institutions afin de répondre à leurs enjeux de performance, de qualité, de sécurité sanitaire et de conformité.",
      "De la médecine vétérinaire aux fermes-écoles, de la production d'aliments pour animaux au contrôle qualité, jusqu'à l'accompagnement QHSE et RSE, nous proposons des solutions adaptées aux réalités du terrain.",
      "Ensemble, bâtissons une agriculture forte, des entreprises performantes et une alimentation saine pour tous."
    ],
    signature: "Dr Marie-Rose Edwige Rakié POUTYA SAIZONOU",
    signatureRole: "Fondatrice & Directrice Générale"
  },
  phones: [
    { display: "+242 05 633 70 50", raw: "242056337050", href: "tel:+242056337050" },
    { display: "+242 06 967 75 67", raw: "242069677567", href: "tel:+242069677567", isWhatsApp: true }
  ],
  whatsappUrl: "https://wa.me/242069677567",
  email: "agrovetoservicescongo@gmail.com",
  domain: "agrovetoservices.cg",
  slogans: {
    primary: "De la santé animale à l'excellence QHSE.",
    institutional: "L'expertise au service de la santé animale, de la qualité agroalimentaire et de la performance QHSE."
  },
  hero: {
    title: "L'Excellence Vétérinaire, Agropastorale & QHSE au Congo",
    subtitle: "Soins vétérinaires, solutions agropastorales, contrôle qualité, conseil en management QHSE et formations pratiques : nous accompagnons les éleveurs, producteurs, PME, entreprises et institutions vers la performance, la conformité et la durabilité."
  },
  presentation: [
    "AGRO VÉTO SERVICES CONGO est une entreprise pluridisciplinaire qui intervient dans la santé animale, la production agropastorale, la sécurité sanitaire des aliments, la transformation agroalimentaire, le management QHSE et la formation professionnelle.",
    "Notre approche repose sur une vision intégrée : accompagner les producteurs, entreprises, PME, industries et institutions avec des solutions scientifiques, techniques et pratiques adaptées à leurs besoins.",
    "De la médecine vétérinaire au suivi des élevages, de la provenderie au contrôle qualité, de la transformation agroalimentaire au conseil QHSE, AGRO VÉTO SERVICES CONGO œuvre pour une agriculture performante, une alimentation saine et des organisations plus sûres et durables."
  ],
  vision: "Devenir la référence en Afrique Centrale dans l'intégration des services vétérinaires, de la performance agropastorale et du management QHSE, en impulsant une agriculture durable, une alimentation saine et des entreprises biologiquement et normativement conformes.",
  mission: "Contribuer au développement d'une agriculture performante, d'une alimentation saine et d'organisations conformes et durables à travers l'expertise vétérinaire, l'accompagnement agropastoral, la qualité, le QHSE, la transformation locale et la formation.",
  values: [
    {
      title: "Excellence scientifique & rigueur",
      desc: "Une approche fondée sur la précision scientifique, les données de laboratoire et le respect des normes."
    },
    {
      title: "Éthique & bien-être animal",
      desc: "Une pratique respectueuse de la vie animale et de l'environnement."
    },
    {
      title: "Proximité & engagement terrain",
      desc: "Des solutions adaptées aux réalités des producteurs, entreprises et apprenants."
    },
    {
      title: "Innovation & durabilité",
      desc: "Des solutions innovantes et viables répondant aux enjeux agricoles, alimentaires et environnementaux."
    }
  ]
}

export const SERVICES = [
  {
    icon: 'Stethoscope',
    n: '// 01',
    title: 'Santé animale & intrants agropastoraux',
    desc: "Clinique & cabinet vétérinaire, pharmacie vétérinaire & matériels, provenderie certifiée, poussins d'un jour, reproduction et laboratoire avec ferme-école d'expérimentation.",
    price: 'Consultations dès 15 000 FCFA',
    del: 'Disponible 24/7',
    img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
    features: [
      'Clinique vétérinaire : consultations, chirurgie, urgences 24/7 & suivi des élevages',
      'Pharmacie & matériels : médicaments vétérinaires, vaccins, antiparasitaires & kits',
      'Production biologique & provenderie : aliments bétail, volailles, poissons & OAC',
      'Poussins d’un jour certifiés Cobb 500 & géniteurs sélectionnés',
      'Laboratoire & ferme-école : analyses bromatologiques & contrôle qualité'
    ],
    subSections: [
      {
        title: 'Clinique & cabinet vétérinaire',
        items: ['Consultations', 'Diagnostics', 'Soins médicaux', 'Soins chirurgicaux', 'Urgences', 'Suivi sanitaire des élevages']
      },
      {
        title: 'Pharmacie vétérinaire & matériels',
        items: ['Médicaments vétérinaires', 'Vaccins', 'Antiparasitaires', 'Kits d\'hygiène', 'Équipements d\'élevage']
      },
      {
        title: 'Production biologique & provenderie',
        items: ['Œufs à couver (OAC)', 'Poussins d\'un jour', 'Géniteurs', 'Aliments pour bétail', 'Aliments pour volailles', 'Aliments pour poissons']
      },
      {
        title: 'Laboratoire & ferme-école',
        items: ['Analyses bromatologiques', 'Contrôle qualité', 'Recherche', 'Formation pratique', 'Expérimentation agropastorale']
      }
    ],
    slug: 'sante-animale-agropastoral',
    color: '#0284c7',
  },
  {
    icon: 'ShieldCheck',
    n: '// 02',
    title: 'Management QHSE & Externalisation',
    desc: "Conseil et audits dans les démarches ISO 9001, 14001, 45001, 22000 et HACCP. Formule novatrice de « QHSE Partagé » pour PME et accompagnement en développement durable & RSE.",
    price: 'Sur devis personnalisé',
    del: 'Diagnostic sous 48h',
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    features: [
      'Conseil & audits : démarches ISO 9001, 14001, 45001, 22000 & HACCP',
      'QHSE partagé : externalisation de la fonction qualité pour PME et industries',
      'Développement durable & RSE : transition écologique et audits d’impact',
      'Gestion des déchets industriels & respect des normes environnementales',
      'Études d’impact environnemental et social (EIES)'
    ],
    subSections: [
      {
        title: 'Conseil & audits',
        items: ['ISO 9001', 'ISO 14001', 'ISO 45001', 'ISO 22000', 'HACCP']
      },
      {
        title: 'QHSE partagé',
        items: ['Externalisation de tout ou partie de la fonction QHSE pour les PME et industries']
      },
      {
        title: 'Développement durable & RSE',
        items: ['Conseil en développement durable', 'RSE', 'Gestion des déchets', 'Études d\'impact environnemental et social', 'Transition écologique']
      }
    ],
    slug: 'management-qhse-externalisation',
    color: '#15803d',
  },
  {
    icon: 'Package',
    n: '// 03',
    title: 'Transformation agroalimentaire & sécurité sanitaire',
    desc: "Valorisation, séchage, pasteurisation, conservation, conditionnement et distribution de produits agricoles et agroalimentaires locaux. Hygiène alimentaire, traçabilité et conformité SPS.",
    price: 'Sur devis / cahier des charges',
    del: 'Accompagnement continu',
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    features: [
      'Valorisation & conservation : séchage, pasteurisation & conditionnement',
      'Distribution de produits agricoles et agroalimentaires locaux certifiés',
      'Conformité sanitaire : hygiène alimentaire, sécurité sanitaire & traçabilité',
      'Maîtrise des risques sanitaires & conformité SPS (normes sanitaires)',
      'Élaboration et audit de Plans de Maîtrise Sanitaire (PMS)'
    ],
    subSections: [
      {
        title: 'Valorisation & conservation',
        items: ['Séchage', 'Pasteurisation', 'Conservation', 'Conditionnement', 'Distribution de produits agricoles et agroalimentaires locaux']
      },
      {
        title: 'Conformité sanitaire',
        items: ['Hygiène alimentaire', 'Sécurité sanitaire', 'Traçabilité', 'Conformité SPS', 'Maîtrise des risques sanitaires']
      }
    ],
    slug: 'transformation-agroalimentaire',
    color: '#f89203',
  },
  {
    icon: 'Sparkles',
    n: '// 04',
    title: 'Cosmétique, hygiène & artisanat',
    desc: "Formulation et fabrication locale de produits d'hygiène et de soins : savons, détergents virucides et produits cosmétiques. Valorisation de matières premières locales et recyclage.",
    price: 'À partir de 1 500 FCFA',
    del: 'Disponible en boutique',
    img: 'https://images.unsplash.com/photo-1608248597359-0091873130d2?auto=format&fit=crop&w=800&q=80',
    features: [
      'Produits d’hygiène et soins : savons, détergents & cosmétiques',
      'Formulation & fabrication locale certifiées selon les règles de biosécurité',
      'Artisanat & recyclage : valorisation des matières premières locales',
      'Transformation artisanale & éco-responsable des ressources congolaises',
      'Conditionnements adaptés pour exploitations et grand public'
    ],
    subSections: [
      {
        title: 'Produits d\'hygiène et soins',
        items: ['Savons', 'Détergents', 'Produits cosmétiques', 'Formulation', 'Fabrication']
      },
      {
        title: 'Artisanat & recyclage',
        items: ['Valorisation de matières premières locales', 'Transformation artisanale', 'Recyclage']
      }
    ],
    slug: 'cosmetique-hygiene-artisanat',
    color: '#a855f7',
  },
  {
    icon: 'GraduationCap',
    n: '// 05',
    title: 'Centre de formation & renforcement des capacités',
    desc: "Formations certifiantes en santé animale, conduite d'élevage, hygiène alimentaire, HACCP, sécurité au travail, fabrication de détergents et cosmétique. Ingénierie de formation sur mesure.",
    price: 'À partir de 60 000 FCFA',
    del: 'Sessions régulières',
    img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    features: [
      'Santé animale & conduite pratique d’élevage en ferme-école',
      'Hygiène alimentaire, méthode HACCP & sécurité au travail',
      'Ateliers pratiques de fabrication de détergents & cosmétiques',
      'Formations professionnelles sur mesure pour équipes et techniciens',
      'Ingénierie de formation : programmes pour entreprises, ONG & institutions'
    ],
    subSections: [
      {
        title: 'Formations proposées',
        items: ['Santé animale', 'Conduite d\'élevage', 'Hygiène alimentaire', 'HACCP', 'Sécurité au travail', 'Fabrication de détergents', 'Cosmétique', 'Formations professionnelles sur mesure']
      },
      {
        title: 'Ingénierie de formation',
        items: ['Conception de programmes de renforcement des compétences destinés aux entreprises, ONG, institutions et professionnels']
      }
    ],
    slug: 'centre-de-formation',
    color: '#6366f1',
  },
  {
    icon: 'Globe',
    n: '// 06',
    title: 'Événementiel & commerce général',
    desc: "Organisation et régie d'événements professionnels (salons professionnels, foires agricoles, séminaires, conférences). Commerce général : import-export, négoce et distribution d'équipements non réglementés.",
    price: 'Sur devis / cahier des charges',
    del: 'Selon calendrier',
    img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    features: [
      'Événementiel professionnel : salons professionnels & foires agricoles',
      'Organisation de séminaires, conférences & journées techniques',
      'Régie complète et gestion logistique d’événements d’entreprise',
      'Commerce général : import-export, négoce & représentation commerciale',
      'Distribution d’équipements et matériels professionnels non réglementés'
    ],
    subSections: [
      {
        title: 'Événementiel professionnel',
        items: ['Salons professionnels', 'Foires agricoles', 'Séminaires', 'Conférences', 'Régie et gestion d\'événements']
      },
      {
        title: 'Commerce général',
        items: ['Import-export', 'Négoce', 'Représentation commerciale', 'Distribution d\'équipements non réglementés']
      }
    ],
    slug: 'evenementiel-commerce-general',
    color: '#f59e0b',
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
    name: "Dr POUTYA SAIZONOU Marie-Rose Edwige Rakié", 
    role: 'Fondatrice & Directrice Générale', 
    skills: ['Médecine Vétérinaire', 'Management QHSE', 'Sécurité Sanitaire HACCP / ISO 22000', 'Formations Agropastorales', 'Transformation Agroalimentaire', 'Provenderie'], 
    bio: "Médecin vétérinaire praticienne et spécialiste en Management de la Qualité, Hygiène, Sécurité et Environnement (QHSE), le Docteur Marie-Rose Edwige Rakié POUTYA possède une expertise transversale dans la santé animale, la sécurité sanitaire des aliments et le développement agropastoral. Ancienne responsable qualité dans l'industrie et entrepreneure engagée, elle fonde AGRO VÉTO SERVICES CONGO avec l'ambition de proposer une offre intégrée répondant aux enjeux de l'élevage, de la transformation agroalimentaire et de la conformité normative.", 
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
  'consultation-vet': 'Consultation vétérinaire',
  'produits-agropastoraux': 'Commande / produits agropastoraux',
  'devis-qhse': 'Demande de devis QHSE',
  'audit-accompagnement': 'Audit / accompagnement',
  'formation': 'Formation',
  'agroalimentaire': 'Agroalimentaire',
  'autre': 'Autre',
  // Alias pour rétro-compatibilité
  'clinique': 'Consultation vétérinaire',
  'provenderie': 'Commande / produits agropastoraux',
  'poussins': 'Commande / produits agropastoraux',
  'formations': 'Formation',
  'qhse': 'Demande de devis QHSE',
  'cosmetique': 'Produits d\'hygiène & soins',
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
    title: "Santé Animale & Prophylaxie Vétérinaire en Élevage",
    category: "Santé Animale",
    duration: "4 Jours (24h) - Clinique & Terrain",
    price: "70 000 FCFA",
    target: "Éleveurs, techniciens vétérinaires, régisseurs de cheptels",
    nextSession: "Sessions bimensuelles",
    modulesCovered: [
      "Reconnaissance des pathologies courantes (virales, bactériennes, parasitaires)",
      "Protocoles vaccinaux et calendrier de prophylaxie rigoureux",
      "Administration des soins et gestion de la pharmacie vétérinaire d'élevage",
      "Mesures de biosécurité, désinfection et vide sanitaire",
      "Autopsie aviaire de base et prélèvements diagnostiques"
    ]
  },
  {
    id: "TRAIN-02",
    title: "Conduite d'Élevage Moderne & Rentabilité (Aviculture & Porciculture)",
    category: "Conduite d'Élevage",
    duration: "5 Jours (30h) - Immersion Ferme-École",
    price: "75 000 FCFA",
    target: "Porteurs de projets agropastoraux, éleveurs de chair et ponte",
    nextSession: "Prochaine session hebdomadaire",
    modulesCovered: [
      "Bâtiments d'élevage tropicaux : ventilation, litière et densité",
      "Démarrage réussi des poussins d'un jour (Cobb 500 & Lohmann)",
      "Techniques d'alimentation, abreuvement et ratio coût/croissance",
      "Conduite de l'élevage porcin : reproduction, engraissement, hygiène",
      "Gestion économique, suivi des bandes et calcul des marges brutes"
    ]
  },
  {
    id: "TRAIN-03",
    title: "Hygiène Alimentaire & Bonnes Pratiques Sanitaires (BPH / BPF)",
    category: "Hygiène Alimentaire",
    duration: "3 Jours (18h) - Certifiant",
    price: "90 000 FCFA",
    target: "Professionnels des métiers de bouche, cantines, traiteurs, transformateurs",
    nextSession: "Sessions bimensuelles",
    modulesCovered: [
      "Microbiologie alimentaire et maîtrise des contaminations croisées",
      "La marche en avant et l'organisation rationnelle des espaces de préparation",
      "Plans de nettoyage, désinfection et lutte contre les nuisibles (3D)",
      "Respect de la chaîne du froid et gestion des températures réglementaires",
      "Contrôle à réception des denrées et traçabilité interne"
    ]
  },
  {
    id: "TRAIN-04",
    title: "Méthode HACCP & Sécurité Sanitaire des Aliments (Norme ISO 22000)",
    category: "HACCP & Qualité",
    duration: "4 Jours (24h) - Certifiant",
    price: "120 000 FCFA",
    target: "Responsables qualité, chefs de production agroalimentaire, auditeurs",
    nextSession: "Sessions mensuelles",
    modulesCovered: [
      "Les 7 principes et 12 étapes d'application de la démarche HACCP",
      "Analyse des dangers (biologiques, chimiques, physiques, allergènes)",
      "Détermination des Points Critiques de Contrôle (CCP) et seuils critiques",
      "Procédures de surveillance continue et actions correctives immédiates",
      "Constitution du Plan de Maîtrise Sanitaire (PMS) et préparation aux audits"
    ]
  },
  {
    id: "TRAIN-05",
    title: "Sécurité au Travail & Prévention des Risques Professionnels (QHSE)",
    category: "Sécurité au Travail",
    duration: "3 Jours (18h) - Certificat délivré",
    price: "150 000 FCFA",
    target: "Responsables HSE, délégués du personnel, superviseurs industriels",
    nextSession: "Sessions mensuelles",
    modulesCovered: [
      "Évaluation des risques professionnels et Document Unique (DUERP)",
      "Prévention des accidents, chutes, risques chimiques et gestes et postures",
      "Équipements de Protection Individuelle (EPI) et consignation",
      "Gestion des situations d'urgence, incendie et évacuation",
      "Culture sécurité et sensibilisation participative des équipes de terrain"
    ]
  },
  {
    id: "TRAIN-06",
    title: "Fabrication de Détergents & Produits d'Entretien Professionnels",
    category: "Fabrication Détergents",
    duration: "4 Jours (24h) - 100% Atelier Pratique",
    price: "65 000 FCFA",
    target: "Entrepreneurs, groupements d'artisans, agents d'hygiène et collectivités",
    nextSession: "Sessions mensuelles",
    modulesCovered: [
      "Chimie appliquée : tensioactifs, régulateurs de pH et conservateurs",
      "Formulation de savons liquides, liquides vaisselle et désinfectants de sol",
      "Fabrication d'eau de Javel stabilisée et détergents ménagers multi-usages",
      "Mesures de sécurité de manipulation des réactifs chimiques",
      "Conditionnement, étiquetage réglementaire et calcul du coût de revient"
    ]
  },
  {
    id: "TRAIN-07",
    title: "Cosmétique Naturelle, Savonnerie Artisanale & Valorisation Locale",
    category: "Cosmétique & Artisanat",
    duration: "4 Jours (24h) - 100% Atelier Pratique",
    price: "60 000 FCFA",
    target: "Créateurs de marques, coopératives féminines, porteurs de projets",
    nextSession: "Sessions mensuelles",
    modulesCovered: [
      "Procédé de saponification à froid (SAF) et calcul des indices de soude",
      "Surgraissage aux beurres et huiles végétales locales (karité, palmiste, coco)",
      "Formulation de baumes, crèmes et soins cosmétiques corporels",
      "Bonnes Pratiques de Fabrication (BPF cosmétiques / ISO 22716)",
      "Emballage écoresponsable, conservation saine et stratégie de vente"
    ]
  },
  {
    id: "TRAIN-08",
    title: "Formations Professionnelles Sur-Mesure & Ingénierie de Compétences",
    category: "Sur-Mesure & Conseil",
    duration: "Sur-mesure (intra ou extra-entreprise)",
    price: "Sur devis adapté",
    target: "Entreprises agroalimentaires, fermes, ONG, institutions publiques",
    nextSession: "À la demande",
    modulesCovered: [
      "Diagnostic préalable des besoins en compétences et audit terrain",
      "Co-conception de programmes et référentiels de compétences adaptés",
      "Formation-action directement sur vos sites d'exploitation",
      "Délivrance d'attestations et certificats de compétences professionnelles",
      "Suivi post-formation, coaching opérationnel et mesure d'impact"
    ]
  }
]

