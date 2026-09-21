# RÉCAPITULATIF COMPLET — AGENT IA RÉSEAUX SOCIAUX (AVS CONGO)
Date de sauvegarde : 19 Septembre 2026

---

## 1. IDENTITÉ DE L'ENTREPRISE (BASE DE CONNAISSANCES DE L'AGENT)
* **Entreprise :** AGRO VÉTO SERVICES CONGO S.A.R.L.U. (A.V.S.)
* **Direction :** Dr Marie-Rose Edwige Rakié POUTYA SAIZONOU (Fondatrice & Directrice Générale, Médecin Vétérinaire & Spécialiste QHSE).
* **Siège social :** Quartier Socoprise, Avenue Nelson Mandela, Rue Bissoute, Pointe-Noire, République du Congo.
* **Contacts officiels :**
  - Téléphone direct : +242 05 633 70 50
  - WhatsApp officiel : +242 06 967 75 67
  - Email : agrovetoservicescongo@gmail.com
  - Site internet : https://agrovetoservices.cg
* **Piliers d'excellence (3 Domaines) :**
  1. **Domaine VÉTO :** Clinique vétérinaire d'urgence 24h/24 & 7j/7, pharmacie vétérinaire, provenderie industrielle certifiée (volailles, porcs, ruminants), poussins d'un jour Cobb 500 certifiés, laboratoire.
  2. **Domaine AGRO :** Productions agricoles durables, transformation agroalimentaire et bio-cosmétique locale.
  3. **Domaine SERVICES :** Formations qualifiantes, fermes-écoles pour éleveurs, audit QHSE / biosécurité (normes HACCP, ISO 22000).

---

## 2. OBJECTIFS DU SYSTÈME AUTOMATISÉ
1. **Lancement de la page Facebook AVS Congo** (actuellement 0 post) avec une chronologie de marque claire et rassurante pour l'audience.
2. **Contrôle humain (Human-in-the-loop)** : L'IA prépare les textes, Joseph relit et modifie tranquillement sur son téléphone/ordinateur, et change le statut en "Validé".
3. **Publication automatique** : Make.com détecte la ligne validée et la publie sur la page Facebook officielle.
4. **Futurs ajouts** : Publication multi-canale (LinkedIn & Instagram) et agent répondeur pour les questions en commentaires et DMs.

---

## 3. CE QUI A ÉTÉ RÉALISÉ ET TESTÉ AUJOURD'HUI
* ✅ **Clé API Gemini configurée** : Connectée avec succès à Make.com (`gemini-3.8-flash`).
* ✅ **Génération multi-réseaux testée** : Gemini a généré avec succès les formats LinkedIn, Facebook et Instagram au format JSON.
* ✅ **Découpage JSON validé** : Module `Parse JSON` opérationnel pour extraire les textes.
* ✅ **Module Facebook Pages connecté** : Connecté officiellement à la page Facebook via l'API Meta.
* ❌ **Notion abandonné** : Abandonné en raison de blocages récurrents liés aux permissions privées de pages Notion.
* ✅ **Google Sheets adopté (Méthode B)** :
  - Feuille créée : `Publications AVS Congo`
  - Colonnes configurées :
    - `A1` : Titre
    - `B1` : Statut (ex: Validé, Publié)
    - `C1` : Texte Facebook
  - Ligne 2 pré-remplie avec le **Post 1 fondateur**.

---

## 4. LE POST 1 (PRÉ-REMPLI DANS GOOGLE SHEETS)
```text
🇨🇬 Bienvenue sur la page officielle d’AGRO VÉTO SERVICES CONGO (A.V.S.) !

Fondé et dirigé par le Dr Marie-Rose Edwige Rakié POUTYA SAIZONOU (Médecin Vétérinaire Praticienne & Spécialiste QHSE), notre complexe vétérinaire et agropastoral basé à Pointe-Noire s'engage au quotidien pour le développement d'une agriculture performante, d'un élevage rentable et d'une alimentation saine.

🌟 Notre expertise intégrée s'articule autour de 3 domaines d'excellence :

1️⃣ Le Domaine VÉTO :
• Clinique Vétérinaire & Soins d'Urgence 24h/24 et 7j/7 (chirurgie, vaccination, pharmacie).
• Provenderie industrielle certifiée pour vos élevages (volailles, porcs, ruminants).
• Poussins d'un jour Cobb 500 certifiés à forte croissance.

2️⃣ Le Domaine AGRO :
• Productions agricoles durables et transformation locale de qualité.

3️⃣ Le Domaine SERVICES :
• Formations pratiques et fermes-écoles pour professionnaliser vos exploitations.
• Accompagnement qualité, hygiène et biosécurité (QHSE / HACCP).

📍 Où nous trouver ?
Quartier Socoprise, Avenue Nelson Mandela, Rue Bissoute — Pointe-Noire, Congo.

📞 Contacts & Urgences :
• WhatsApp direct : +242 06 967 75 67
• Téléphone : +242 05 633 70 50
• Site web : https://agrovetoservices.cg

Abonnez-vous à notre page pour suivre nos conseils vétérinaires, nos actualités et nos arrivages ! 🤝

#AgroVetoServices #PointeNoire #Congo #CliniqueVeterinaire #ElevageCongo #Cobb500 #Agrobusiness #SanteAnimale
```

---

## 5. LA CHRONOLOGIE DES 6 PROCHAINS POSTS DE LANCEMENT
1. **Post 1 :** Lancement officiel & Présentation globale d'AVS Congo (ci-dessus).
2. **Post 2 (Clinique 24/7) :** Urgences vétérinaires, consultations, chirurgies et pharmacie à Socoprise.
3. **Post 3 (Provenderie Certifiée) :** L'importance d'un aliment de qualité pour éviter les pertes et maximiser la rentabilité en élevage.
4. **Post 4 (Poussins Cobb 500) :** Robustesse, vigueur hybride et accompagnement technique des éleveurs de volailles.
5. **Post 5 (Formations & Fermes-Écoles) :** Professionnalisation et accompagnement des porteurs de projets agropastoraux.
6. **Post 6 (Qualité & QHSE) :** Biosécurité des fermes et hygiène alimentaire.

---

## 6. PROCHAINE ÉTAPE POUR REPRENDRE
* Dans Make.com : Finaliser la liaison du module **Google Sheets** (action `Search Rows`, fichier `Publications AVS Congo`, limite `1`) vers le module **Facebook Pages** (créer le post avec le champ `Texte Facebook`).
* Dès que vous cliquerez sur "Run once", le Post 1 stocké dans Google Sheets sera publié sur Facebook.
