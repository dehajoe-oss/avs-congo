// ── BASE DE CONNAISSANCES MULTI-MARQUES — AGENT IA CENTRAL ───────────────────
// Fichier de configuration du portefeuille de marques piloté par l'Agent IA.
// Chaque marque possède son identité, son ton de voix, ses règles et sa page Facebook.

export const AGENCY_BRANDS = {
  // ── CONFIGURATION DE L'ADMINISTRATEUR (VOUS) ──────────────────────────────
  admin: {
    whatsapp: "0162108694", // Votre numéro WhatsApp personnel pour piloter l'Agent
    role: "Directeur d'Agence & Administrateur Principal"
  },

  // ── 1. MARQUE PERSONNELLE / AGENCE TECH (JOHAODEV) ─────────────────────────
  tech: {
    id: 'tech',
    code: 'JOHAODEV',
    nom: "Johaodev — Cybersécurité · Dév Web · Solutions IA · Marketing Digital",
    pageFacebookName: "Johaodev",
    pageFacebookId: "", // Détecté automatiquement via Meta
    secteurs: [
      "Cybersécurité & Hygiène numérique des entreprises",
      "Développement Web moderne & Applications sur mesure (Next.js, Node, React)",
      "Solutions d'Intelligence Artificielle (Agents autonomes, Automatisations Make/n8n, Chatbots)",
      "Marketing Digital de performance (Tunnels de vente, E-commerce, SEO, Acquisition)"
    ],
    cible: "Dirigeants de PME, commerçants, startups, professionnels et organisations en Afrique et à l'international cherchant à digitaliser, automatiser et sécuriser leurs activités.",
    tonDeVoix: "Expert, pédagogue, visionnaire, pragmatique et orienté résultats/ROI. Pas de jargon abscons, vulgarisation claire de concepts techniques avec des cas concrets.",
    reglesEditoriales: [
      "Mettre l'accent sur les gains concrets pour le client (temps gagné, chiffre d'affaires, protection contre les cyberattaques).",
      "Terminer par un appel à l'action clair (audit offert, consultation stratégique, message privé).",
      "Format aéré, professionnel, chiffres percutants et retours d'expérience."
    ],
    motsClesHashtags: [
      "#Cybersecurite", "#DeveloppementWeb", "#IntelligenceArtificielle", "#MarketingDigital",
      "#TransformationDigitale", "#AfriqueTech", "#Innovation", "#Automatisation"
    ]
  },

  // ── 2. AGRO VÉTO SERVICES CONGO (A.V.S.) ───────────────────────────────────
  avs: {
    id: 'avs',
    code: 'AVS',
    nom: "AGRO VÉTO SERVICES CONGO S.A.R.L.U.",
    direction: "Dr Marie-Rose Edwige Rakié POUTYA SAIZONOU (Médecin Vétérinaire & Spécialiste QHSE)",
    siege: "Quartier Socoprise, Avenue Nelson Mandela, Rue Bissoute, Pointe-Noire, République du Congo.",
    pageFacebookName: "Agro Véto Services Congo",
    pageFacebookId: "", // ID de votre page Facebook AVS
    secteurs: [
      "Domaine VÉTO : Clinique 24/7, chirurgie, provenderie certifiée, poussins Cobb 500, poulettes Lohmann Brown, porcs, matériel zootechnique, pharmacie sous chaîne du froid, laboratoire bromatologique.",
      "Domaine AGRO : Maraîchage périurbain intensif, vivrier, irrigation goutte-à-goutte, motopompes solaires, transformation agroalimentaire (séchage/conservation), bio-cosmétique (savonnerie SAF).",
      "Domaine SERVICES : Management QHSE, formule « QHSE Partagé » pour PME, démarche HACCP, audits ISO (9001, 22000), fermes-écoles d'expérimentation, formations qualifiantes certifiantes, suivi transversal."
    ],
    cible: "Éleveurs avicoles et porcins, agriculteurs maraîchers, agro-industriels, propriétaires d'animaux de compagnie, entreprises en quête de conformité QHSE à Pointe-Noire et au Congo.",
    tonDeVoix: "Médical, rigoureux, scientifique, ancré dans les réalités de terrain à Pointe-Noire, bienveillant et rassurant.",
    reglesEditoriales: [
      "STRICTEMENT AUCUNE ICÔNE IA (bannir ✨, 🤖, 🌟, 🚀, 💡, 🔮).",
      "Style sobre, direct, professionnel, humain.",
      "Toujours mentionner les coordonnées officielles (Socoprise, téléphone 24/7, WhatsApp et site web)."
    ],
    contacts: {
      telephoneUrgence247: "+242 05 633 70 50",
      whatsappDirect: "+242 06 967 75 67",
      siteWeb: "https://avs-wine.vercel.app",
      email: "agrovetoservicescongo@gmail.com"
    },
    motsClesHashtags: [
      "#AgroVetoServices", "#PointeNoire", "#Congo", "#SanteAnimale",
      "#ElevageCongo", "#CliniqueVeterinaire", "#Cobb500", "#DomaineAgro", "#DomaineServices"
    ]
  }

  // ── 3. EMPLACEMENT POUR VOS FUTURS CLIENTS (Ex: Restauration, Artisanat...) ──
  // Il suffira d'ajouter vos clients ici :
  // restaurant: { ... },
  // artisanat: { ... }
};

export default AGENCY_BRANDS;
