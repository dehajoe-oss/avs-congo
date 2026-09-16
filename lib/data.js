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
    institutional: "L'expertise intégrée au service des 3 domaines : Agro, Véto et Services."
  },
  hero: {
    title: "L'Excellence Agro, Véto & Services au Congo",
    subtitle: "Productions agricoles, médecine vétérinaire 24/7, provenderie certifiée, management QHSE, formations professionnelles et commerce général : nous accompagnons éleveurs, producteurs, PME et institutions vers la rentabilité, la conformité et la durabilité."
  },
  presentation: [
    "AGRO VÉTO SERVICES CONGO (A.V.S.) est une entreprise congolaise pluridisciplinaire structurée autour de 3 grands domaines d'excellence : le domaine Agro (cultures, transformation, équipements, artisanat), le domaine Véto (élevage, provenderie certifiée, clinique vétérinaire 24/7, laboratoire bromatologique) et le domaine Services (management QHSE, fermes-écoles, formations qualifiantes, services aux entreprises et commerce général).",
    "Notre approche repose sur une vision intégrée : accompagner les producteurs, entreprises, PME, industries et institutions avec des solutions scientifiques, techniques et pratiques adaptées aux réalités du terrain.",
    "De la médecine vétérinaire au suivi transversal des exploitations, de la provenderie au contrôle qualité en laboratoire, de la transformation agroalimentaire au conseil QHSE certifiant, AGRO VÉTO SERVICES CONGO œuvre pour une agriculture forte, des entreprises performantes et une alimentation saine pour tous."
  ],
  vision: "Devenir la référence en Afrique Centrale dans l'intégration des 3 domaines (Agro, Véto et Services), en impulsant une agriculture durable, une alimentation saine et des organisations biologiquement et normativement conformes.",
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

// ── 3 DOMAINES STRATÉGIQUES AVS CONGO (AGRO · VÉTO · SERVICES) ────────
export const DOMAINS = [
  {
    id: 'agro',
    code: 'AGRO',
    n: '// 01',
    title: 'Domaine AGRO',
    tagline: 'Productions végétales, transformation agroalimentaire & bio-cosmétique, équipements et artisanat.',
    desc: "Le pôle végétal et de valorisation locale d'AVS Congo : de la culture des terres maraîchères et vivrières à la transformation agroalimentaire, la cosmétique naturelle et la fourniture d'équipements agronomiques.",
    icon: 'Sprout',
    color: '#84cc16',
    slug: 'domaine-agro',
    img: '/images/transformation-agroalimentaire.jpg',
    branches: [
      {
        id: 'productions-agricoles',
        title: 'Productions agricoles',
        desc: 'Cultures vivrières, maraîchage périurbain, semences sélectionnées et agronomie durable adaptée aux sols et climats congolais.',
        items: ['Cultures vivrières & céréalières', 'Maraîchage périurbain de haute intensité', 'Semences améliorées & fertilisation raisonnée', 'Arboriculture fruitière', 'Conseil agronomique & gestion des sols']
      },
      {
        id: 'transformation-agroalimentaire-cosmetique',
        title: 'Transformation agroalimentaire & bio-cosmétique',
        desc: 'Valorisation des récoltes, séchage solaire, pasteurisation, conservation, conditionnement et formulation locale de soins cosmétiques bio et savons surgras.',
        items: ['Séchage, pasteurisation & conservation de denrées', 'Conditionnement hermétique & étiquetage traçable', 'Formulation de savons saponifiés à froid (SAF)', 'Cosmétique naturelle aux huiles végétales locales', 'Détergents et produits d\'hygiène biodégradables']
      },
      {
        id: 'equipements-materiels-agricoles',
        title: 'Équipements & matériels agricoles',
        desc: 'Fourniture de motopompes, systèmes d\'irrigation goutte-à-goutte, pulvérisateurs professionnels, bâches d\'ensilage et outillage aratoire moderne.',
        items: ['Systèmes d\'irrigation goutte-à-goutte & aspersion', 'Motopompes thermiques & solaires', 'Pulvérisateurs à pression préalable & atomiseurs', 'Outillage agronomique professionnel', 'Matériel de récolte et de post-récolte']
      },
      {
        id: 'artisanat-valorisation',
        title: 'Artisanat & valorisation locale',
        desc: 'Transformation artisanale valorisant le génie et les matières premières du terroir congolais, éco-conception et recyclage vertueux.',
        items: ['Transformation artisanale de matières végétales', 'Valorisation de sous-produits agricoles', 'Éco-emballages artisanaux', 'Recyclage et valorisation des biodéchets']
      }
    ]
  },
  {
    id: 'veto',
    code: 'VÉTO',
    n: '// 02',
    title: 'Domaine VÉTO',
    tagline: 'Productions animales (Élevage), provenderie certifiée, clinique 24/7, matériels et laboratoire bromatologique.',
    desc: "Le socle historique d'AVS Congo : encadrement médical vétérinaire 24h/24, unités industrielles d'aliments équilibrés, cheptels de reproducteurs et contrôle de précision en laboratoire zootechnique.",
    icon: 'Stethoscope',
    color: '#0284c7',
    slug: 'domaine-veto',
    img: 'https://images.unsplash.com/photo-1441122456239-401e92b73c65?auto=format&fit=crop&w=800&q=80',
    branches: [
      {
        id: 'productions-animales-elevage',
        title: 'Productions animales (Élevage)',
        desc: 'Poussins d\'un jour haute performance (Cobb 500 pour la chair, Lohmann Brown pour la ponte), géniteurs porcins sélectionnés et petits ruminants.',
        items: ['Poussins d\'un jour certifiés Cobb 500 (chair)', 'Poulettes pondeuses Lohmann Brown (320 œufs/an)', 'Géniteurs porcins & conduite de verraterie', 'Sélection de petits ruminants (chèvres, moutons)', 'Protocoles de démarrage et suivi zootechnique']
      },
      {
        id: 'provenderie-aliments-betail',
        title: 'Provenderie (Aliments de bétail certifiés)',
        desc: 'Unité industrielle de fabrication d\'aliments complets et équilibrés pour volailles, porcs, bétail et poissons avec teneurs protéiques et énergétiques garanties.',
        items: ['Aliment démarrage haute énergie (21.5% protéines)', 'Aliment croissance performance pour poulets de chair', 'Aliment finition & engraissement carcasse ferme', 'Aliments pour poules pondeuses enrichis en calcium', 'Rations équilibrées pour porcs et poissons']
      },
      {
        id: 'pharmacie-clinique-veterinaire',
        title: 'Pharmacie & clinique vétérinaire',
        desc: 'Clinique ouverte 24h/24 et 7j/7 pour urgences, consultations, diagnostics précis, chirurgies, vaccinations, antiparasitaires et visites sanitaires d\'élevage.',
        items: ['Urgences médicales & chirurgicales 24h/24 & 7j/7', 'Consultations générales & spécialisées pour animaux', 'Pharmacie vétérinaire certifiée (médicaments & vaccins)', 'Protocoles de prophylaxie vaccinale et vermifugation', 'Visites sanitaires et audits réguliers de cheptel']
      },
      {
        id: 'equipements-materiels-production',
        title: 'Équipements & matériels de production',
        desc: 'Abreuvoirs automatiques, mangeoires anti-gaspillage, couveuses/éclosoirs contrôlés, radiants d\'élevage, cages de ponte et kits de biosécurité.',
        items: ['Abreuvoirs automatiques Siphoïdes & à pipettes', 'Mangeoires suspendues avec grilles anti-gaspillage', 'Couveuses automatiques & éclosoirs professionnels', 'Radiants d\'élevage pour poussinières et couveuses', 'Kits complets de biosécurité (pédiluves, désinfectants)']
      },
      {
        id: 'laboratoire-bromatologique-zootechnie',
        title: 'Laboratoire d\'analyses bromatologiques & zootechnie',
        desc: 'Analyses nutritionnelles des matières premières et provendes, détection des mycotoxines, autopsies aviaires diagnostiques et coprologie.',
        items: ['Analyses bromatologiques (protéines brutes, cendres, humidité)', 'Contrôle qualité des matières premières alimentaires', 'Autopsies aviaires & diagnostic de mortalité', 'Analyses parasitologiques & coprologie', 'Suivi des performances zootechniques (IC, GMQ)']
      }
    ]
  },
  {
    id: 'services',
    code: 'SERVICES',
    n: '// 03',
    title: 'Domaine SERVICES',
    tagline: 'Management QHSE, suivi transversal, fermes-écoles, formations, services entreprises et commerce général.',
    desc: "L'expertise transversale et institutionnelle d'AVS Congo : conformité normative, accompagnement sur site des 3 piliers, transfert de compétences et négoce international.",
    icon: 'ShieldCheck',
    color: '#15803d',
    slug: 'domaine-services',
    img: '/images/qhse-laboratoire.jpg',
    branches: [
      {
        id: 'management-qhse',
        title: 'Management QHSE & Formule « QHSE Partagé »',
        desc: 'Accompagnement aux certifications ISO (9001, 14001, 45001, 22000), démarche HACCP, audits à blanc, formule de QHSE partagé pour PME et RSE.',
        items: ['Conseil et audits ISO 9001, 14001, 45001, 22000', 'Démarche HACCP & Plans de Maîtrise Sanitaire (PMS)', 'Formule innovante de « QHSE Partagé » pour PME', 'Développement durable, RSE & gestion des déchets', 'Études d\'impact environnemental et social (EIES)']
      },
      {
        id: 'suivi-accompagnement-transversal',
        title: 'Suivi & accompagnement transversal (Agro · Véto · QHSE)',
        desc: 'Assistance technique intégrée sur le terrain combinant le conseil agronomique, la santé animale et l\'assurance qualité pour sécuriser la rentabilité.',
        items: ['Diagnostic holistique d\'exploitation agricole & d\'élevage', 'Visites périodiques de conformité zootechnique & sanitaire', 'Appui technique à la mise en place de barrières sanitaires', 'Optimisation des coûts de revient et suivi de rentabilité', 'Assistance continue directe avec le Dr POUTYA']
      },
      {
        id: 'fermes-ecoles',
        title: 'Fermes-écoles d\'expérimentation',
        desc: 'Centres d\'application pratique et d\'immersion technique en conditions réelles d\'élevage et de cultures maraîchères modernes.',
        items: ['Immersion sur cheptels vivants en conditions réelles', 'Ateliers pratiques de biosécurité et de prophylaxie', 'Démonstration de technologies agropastorales innovantes', 'Apprentissage des gestes professionnels de l\'éleveur', 'Pépinière de jeunes entrepreneurs agropastoraux']
      },
      {
        id: 'formations-professionnelles-qualifiantes',
        title: 'Formations professionnelles & qualifiantes',
        desc: 'Cursus certifiants en santé animale, conduite d\'élevage, méthode HACCP, hygiène alimentaire, sécurité au travail et formulation cosmétique.',
        items: ['Conduite d\'élevage avicole & porcin (certifiante)', 'Hygiène alimentaire, BPH & méthode HACCP', 'Sécurité au travail (HSE) & prévention des risques', 'Fabrication de détergents professionnels & savonnerie', 'Ingénierie de compétences sur-mesure pour entreprises & ONG']
      },
      {
        id: 'services-aux-entreprises',
        title: 'Services aux entreprises & ingénierie',
        desc: 'Études de faisabilité technico-économique de fermes et d\'ateliers agroalimentaires, dimensionnement d\'infrastructures et audits de conformité.',
        items: ['Études de faisabilité pour projets agropastoraux', 'Dimensionnement de bâtiments d\'élevage et d\'ateliers', 'Audits de conformité réglementaire & sanitaire', 'Plans de prévention et dossiers d\'agrément sanitaire']
      },
      {
        id: 'foires-et-salons',
        title: 'Foires, Salons & Événementiel professionnel',
        desc: 'Organisation de salons professionnels, foires agricoles régionales, séminaires agropastoraux, colloques techniques et régie événementielle.',
        items: ['Organisation de foires agropastorales & expositions', 'Salons professionnels de l\'agriculture et de l\'élevage', 'Séminaires, colloques et journées techniques', 'Régie et gestion logistique d\'événements professionnels']
      },
      {
        id: 'commerce-distribution-import-export',
        title: 'Commerce général, Distribution, Import / Export',
        desc: 'Négoce et distribution d\'équipements professionnels, représentation commerciale de marques de référence, approvisionnement et négoce sous-régional.',
        items: ['Commerce général et représentation commerciale', 'Import / Export d\'intrants & matériels agropastoraux', 'Distribution nationale et sous-régionale en gros et détail', 'Partenariats avec fabricants et distributeurs internationaux']
      }
    ]
  }
]

// ── SERVICES / PÔLES DÉTAILLÉS (Rétro-compatibilité & composants existants) ─
export const SERVICES = [
  {
    icon: 'Sprout',
    n: '// 01',
    domain: 'agro',
    domainCode: 'AGRO',
    domainTitle: 'Domaine Agro',
    title: 'Productions agricoles & agronomie',
    desc: "Cultures vivrières, maraîchage périurbain, semences sélectionnées, arboriculture et conseil agronomique de terrain pour maximiser les rendements des sols congolais.",
    price: 'Sur devis / cahier des charges',
    del: 'Selon saison de culture',
    img: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=800&q=80',
    features: [
      'Cultures vivrières & maraîchage périurbain à haute productivité',
      'Fourniture de semences certifiées et fertilisation raisonnée',
      'Conseil agronomique terrain et gestion durable des sols',
      'Techniques d\'irrigation éco-responsables et gestion de l\'eau',
      'Suivi cultural complet du semis jusqu\'à la récolte'
    ],
    subSections: [
      {
        title: 'Productions agricoles',
        items: ['Cultures vivrières', 'Maraîchage durable', 'Semences améliorées', 'Arboriculture fruitière', 'Gestion des sols']
      },
      {
        title: 'Équipements de culture',
        items: ['Systèmes d\'irrigation goutte-à-goutte', 'Motopompes', 'Pulvérisateurs professionnels', 'Outillage aratoire']
      }
    ],
    slug: 'productions-agricoles',
    color: '#84cc16',
  },
  {
    icon: 'Stethoscope',
    n: '// 02',
    domain: 'veto',
    domainCode: 'VÉTO',
    domainTitle: 'Domaine Véto',
    title: 'Pharmacie & clinique vétérinaire 24/7',
    desc: "Médecine vétérinaire préventive et curative, interventions chirurgicales d'urgence 24/7, délivrance de médicaments vétérinaires et suivi sanitaire régulier des cheptels.",
    price: 'Consultations dès 15 000 FCFA',
    del: 'Disponible 24h/24 & 7j/7',
    img: 'https://images.unsplash.com/photo-1441122456239-401e92b73c65?auto=format&fit=crop&w=800&q=80',
    features: [
      'Urgences médicales et chirurgicales 24/7 assurées par le Dr POUTYA',
      'Consultations complètes, auscultation et délivrance d\'ordonnance',
      'Pharmacie vétérinaire officielle : antibiotiques, vaccins, antiparasitaires',
      'Vaccination des animaux de compagnie et des volailles d\'élevage',
      'Visites sanitaires d\'élevage sur site à Pointe-Noire et dans le Kouilou'
    ],
    subSections: [
      {
        title: 'Clinique vétérinaire',
        items: ['Consultations', 'Diagnostics', 'Soins médicaux', 'Soins chirurgicaux', 'Urgences 24/7', 'Visites sanitaires']
      },
      {
        title: 'Pharmacie vétérinaire & matériels',
        items: ['Médicaments certifiés', 'Vaccins', 'Antiparasitaires', 'Kits d\'hygiène', 'Matériel de contention et soins']
      }
    ],
    slug: 'clinique-pharmacie-veterinaire',
    color: '#0284c7',
  },
  {
    icon: 'Package',
    n: '// 03',
    domain: 'veto',
    domainCode: 'VÉTO',
    domainTitle: 'Domaine Véto',
    title: 'Productions animales & provenderie certifiée',
    desc: "Vente de poussins d'un jour Cobb 500 (chair) et Lohmann Brown (ponte), géniteurs sélectionnés, aliments industriels pour bétail et matériel d'élevage complet.",
    price: 'Aliments dès 18 900 FCFA / sac',
    del: 'Livraison sous 24h-48h',
    img: '/images/products/poussins-cobb500.jpg',
    features: [
      'Poussins Cobb 500 vaccinés au couvoir (viabilité supérieure à 98%)',
      'Aliments industriels contrôlés : Démarrage (21.5%), Croissance, Finition & Ponte',
      'Géniteurs porcins et petits ruminants sélectionnés pour le climat tropical',
      'Matériel d\'élevage de pointe : mangeoires anti-gaspillage, abreuvoirs automatiques',
      'Guide technique de démarrage et conseils nutritionnels offerts'
    ],
    subSections: [
      {
        title: 'Productions animales',
        items: ['Poussins Cobb 500 (Chair)', 'Poussins Lohmann (Ponte)', 'Géniteurs porcins', 'Petits ruminants', 'OAC (Œufs à couver)']
      },
      {
        title: 'Provenderie & Équipements',
        items: ['Aliment démarrage 21%', 'Aliment croissance', 'Aliment finition', 'Aliments porcs et bétail', 'Mangeoires & abreuvoirs']
      }
    ],
    slug: 'productions-animales-provenderie',
    color: '#0ea5e9',
  },
  {
    icon: 'Layers',
    n: '// 04',
    domain: 'veto',
    domainCode: 'VÉTO',
    domainTitle: 'Domaine Véto',
    title: 'Laboratoire bromatologique & zootechnie',
    desc: "Analyses de laboratoire de haute précision : teneurs bromatologiques d'aliments, contrôle microbiologique, coprologie, autopsies aviaires et optimisation des performances zootechniques.",
    price: 'Sur devis / analyse',
    del: 'Résultats sous 48h-72h',
    img: '/images/qhse-laboratoire.jpg',
    features: [
      'Analyses bromatologiques complètes (protéines brutes, cendres, humidité, matière grasse)',
      'Détection précoce des mycotoxines et contaminants des aliments',
      'Autopsies aviaires et diagnostic différentiel des causes de mortalité',
      'Coprologie parasitaire et antibiogrammes d\'élevage',
      'Contrôle qualité des matières premières locales (maïs, soja, tourteaux)'
    ],
    subSections: [
      {
        title: 'Analyses bromatologiques',
        items: ['Dosage des protéines brutes', 'Taux d\'humidité & matière sèche', 'Teneur en cendres & minéraux', 'Contrôle mycotoxines']
      },
      {
        title: 'Diagnostic zootechnique',
        items: ['Autopsies aviaires', 'Coprologie parasitaire', 'Antibiogrammes', 'Audit des indices de consommation (IC)']
      }
    ],
    slug: 'laboratoire-bromatologique-zootechnie',
    color: '#38bdf8',
  },
  {
    icon: 'ShieldCheck',
    n: '// 05',
    domain: 'services',
    domainCode: 'SERVICES',
    domainTitle: 'Domaine Services',
    title: 'Management QHSE & « QHSE Partagé »',
    desc: "Accompagnement aux certifications ISO 9001, 14001, 45001, 22000, audits HACCP, formule novatrice de « QHSE Partagé » pour les PME congolaises et conseil RSE.",
    price: 'Sur devis personnalisé',
    del: 'Diagnostic sous 48h',
    img: '/images/qhse-laboratoire.jpg',
    features: [
      'Conseil et audits ISO 9001, ISO 14001, ISO 45001, ISO 22000 et démarche HACCP',
      'Formule « QHSE Partagé » : un responsable qualité dédié à temps partagé pour PME',
      'Élaboration et audit des Plans de Maîtrise Sanitaire (PMS) et traçabilité SPS',
      'Études d\'impact environnemental et social (EIES) & gestion des déchets',
      'Accompagnement en démarche RSE et transition écoresponsable'
    ],
    subSections: [
      {
        title: 'Conseil & audits normatifs',
        items: ['ISO 9001 (Qualité)', 'ISO 14001 (Environnement)', 'ISO 45001 (Santé & Sécurité)', 'ISO 22000 (Sécurité Aliments)', 'Démarche HACCP']
      },
      {
        title: 'QHSE partagé & RSE',
        items: ['Externalisation QHSE pour PME', 'Plans de Maîtrise Sanitaire', 'Audits à blanc', 'Études d\'impact (EIES)', 'Gestion des déchets']
      }
    ],
    slug: 'management-qhse-externalisation',
    color: '#15803d',
  },
  {
    icon: 'Sparkles',
    n: '// 06',
    domain: 'agro',
    domainCode: 'AGRO',
    domainTitle: 'Domaine Agro',
    title: 'Transformation agroalimentaire, bio-cosmétique & artisanat',
    desc: "Séchage, pasteurisation, valorisation locale des denrées agricoles, formulation de bio-cosmétiques, fabrication artisanale de savons et détergents biodégradables.",
    price: 'À partir de 1 500 FCFA',
    del: 'Disponible en boutique & sur commande',
    img: '/images/savon-artisanal.jpg',
    features: [
      'Technologies de transformation et conservation locale des récoltes',
      'Formulation locale de produits cosmétiques naturels et savons saponifiés à froid',
      'Fabrication de détergents virucides et désinfectants pour élevages et industries',
      'Valorisation artisanale des matières premières et ressources végétales congolaises',
      'Conditionnements adaptés pour collectivités, fermes et grand public'
    ],
    subSections: [
      {
        title: 'Transformation agroalimentaire',
        items: ['Séchage solaire & thermique', 'Pasteurisation', 'Conservation & conditionnement', 'Valorisation de fruits et légumes']
      },
      {
        title: 'Bio-cosmétique, hygiène & artisanat',
        items: ['Savons saponifiés à froid (SAF)', 'Détergents professionnels', 'Cosmétique naturelle', 'Artisanat local & recyclage']
      }
    ],
    slug: 'transformation-agroalimentaire-bio-cosmetique',
    color: '#b47027',
  },
  {
    icon: 'GraduationCap',
    n: '// 07',
    domain: 'services',
    domainCode: 'SERVICES',
    domainTitle: 'Domaine Services',
    title: 'Fermes-écoles & formations professionnelles',
    desc: "Immersion pratique en ferme-école et cursus certifiants : santé animale, conduite d'élevage, hygiène HACCP, fabrication de détergents, biosécurité et sécurité au travail.",
    price: 'À partir de 60 000 FCFA',
    del: 'Sessions bimensuelles & sur-mesure',
    img: '/images/formation-ferme-ecole.jpg',
    features: [
      'Fermes-écoles d\'expérimentation : apprentissage 100% pratique sur cheptels réels',
      'Formations certifiantes en conduite d\'élevage avicole, porcin et ruminants',
      'Formations certifiantes en hygiène alimentaire HACCP et sécurité sanitaire',
      'Ateliers pratiques de fabrication de détergents professionnels et savons',
      'Ingénierie de compétences et formations sur-mesure pour entreprises, ONG et institutions'
    ],
    subSections: [
      {
        title: 'Fermes-écoles & apprentissage',
        items: ['Conduite pratique d\'élevage', 'Biosécurité de terrain', 'Expérimentation agropastorale', 'Ateliers démonstrateurs']
      },
      {
        title: 'Formations qualifiantes',
        items: ['Santé animale & prophylaxie', 'Hygiène HACCP', 'Sécurité au travail (HSE)', 'Fabrication de détergents', 'Cursus sur-mesure']
      }
    ],
    slug: 'fermes-ecoles-formations',
    color: '#6366f1',
  },
  {
    icon: 'Globe',
    n: '// 08',
    domain: 'services',
    domainCode: 'SERVICES',
    domainTitle: 'Domaine Services',
    title: 'Suivi transversal, salons & commerce général',
    desc: "Suivi & accompagnement technique des 3 domaines (Agro, Véto, QHSE), organisation de foires et salons agropastoraux, services aux entreprises, négoce et import-export.",
    price: 'Sur devis / cahier des charges',
    del: 'Selon calendrier & convention',
    img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    features: [
      'Suivi et accompagnement transversal intégré sur les 3 domaines (Agro, Véto, QHSE)',
      'Organisation de foires agropastorales, salons professionnels et colloques techniques',
      'Services d\'ingénierie et d\'études de faisabilité pour entreprises et investisseurs',
      'Commerce général, négoce d\'intrants certifiés et représentation commerciale',
      'Import / Export d\'équipements agricoles et vétérinaires homologués'
    ],
    subSections: [
      {
        title: 'Suivi & Salons',
        items: ['Accompagnement transversal Agro-Véto-QHSE', 'Organisation de foires et salons', 'Séminaires professionnels', 'Régie événementielle']
      },
      {
        title: 'Commerce général & Import/Export',
        items: ['Import / Export d\'équipements', 'Négoce d\'intrants certifiés', 'Représentation commerciale', 'Distribution multicanale']
      }
    ],
    slug: 'suivi-salons-commerce-general',
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
    img: '/images/products/poussins-cobb500.jpg',
    imgMobile: '/images/products/poussins-cobb500.jpg',
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
    img: '/images/products/aliment-finition.jpg',
    imgMobile: '/images/products/aliment-finition.jpg',
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
    img: 'https://images.unsplash.com/photo-1441122456239-401e92b73c65?auto=format&fit=crop&w=800&q=80',
    imgMobile: 'https://images.unsplash.com/photo-1441122456239-401e92b73c65?auto=format&fit=crop&w=600&q=80',
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
    img: '/images/qhse-laboratoire.jpg',
    imgMobile: '/images/qhse-laboratoire.jpg',
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
    img: '/images/formation-ferme-ecole.jpg',
    imgMobile: '/images/formation-ferme-ecole.jpg',
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
    img: '/images/savon-artisanal.jpg',
    imgMobile: '/images/products/desinfectant-5l.jpg',
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
    img: '/images/products/pondeuses-lohmann.jpg',
    imgMobile: '/images/products/pondeuses-lohmann.jpg',
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
    img: 'https://cdn.pixabay.com/photo/2024/01/06/23/18/man-8492201_640.jpg', 
    result: '↑ Mortalité réduite à 1.6%' 
  },
  { 
    name: 'Sylvie Kimbembé', 
    role: 'Directrice Qualité · Unité Agroalimentaire', 
    project: 'Audit QHSE & HACCP', 
    rating: 5, 
    text: "L'expertise du Dr POUTYA et la formule « QHSE Partagé » ont transformé notre chaîne de conditionnement. Nous avons obtenu notre agrément sanitaire en un temps record !", 
    img: 'https://images.unsplash.com/photo-1757140448494-ad45016d456a?auto=format&fit=crop&w=300&q=80', 
    result: '↑ Agrément SPS obtenu' 
  },
  { 
    name: 'Alain Boukoulou', 
    role: 'Éleveur Avicole & Porteur de Projet', 
    project: 'Formation Ferme-École', 
    rating: 5, 
    text: "La formation de 5 jours en immersion m'a évité toutes les erreurs classiques du débutant. Aujourd'hui, mon élevage tourne à plein régime et génère des revenus constants.", 
    img: '/images/clients/alain-boukoulou.jpg', 
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
    img: '/images/products/poussins-cobb500.jpg',
  },
  {
    slug: 'plan-de-prophylaxie-pourquoi-il-est-indispensable',
    title: "Le calendrier de prophylaxie : l'assurance-vie de votre élevage",
    excerpt: "Mieux vaut prévenir que guérir. Pourquoi et comment vacciner contre Newcastle, Gumboro et Marek au bon moment pour préserver la totalité de votre cheptel.",
    category: 'Médecine Vétérinaire',
    date: '2026-08-28',
    readTime: '5 min',
    img: '/images/products/kit-prophylaxie.jpg',
  },
  {
    slug: 'pourquoi-les-pme-agroalimentaires-doivent-adopter-haccp',
    title: "La méthode HACCP expliquée simplement pour les PME congolaises",
    excerpt: "Comment identifier les dangers microbiologiques et chimiques pour garantir des aliments sains, séduire la grande distribution et respecter les normes internationales.",
    category: 'Management QHSE',
    date: '2026-09-02',
    readTime: '4 min',
    img: '/images/qhse-laboratoire.jpg',
  },
  {
    slug: 'regles-biosecurite-indispensables-ferme-tropicale',
    title: "Les 5 règles d'or de la biosécurité dans un bâtiment d'élevage moderne",
    excerpt: "Pédiluves, sas sanitaire, rotation des désinfectants et contrôle des visiteurs : protégez votre investissement des pathogènes extérieurs.",
    category: 'Biosécurité',
    date: '2026-09-06',
    readTime: '3 min',
    img: '/images/products/desinfectant-5l.jpg',
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
  'agro': 'Domaine Agro (Cultures, Transformation, Matériels)',
  'veto': 'Domaine Véto (Santé, Élevage, Provenderie, Labo)',
  'services': 'Domaine Services (QHSE, Formations, Salons, Commerce)',
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

