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
1. **Lancement de la page Facebook AVS Congo** avec un contenu authentique, professionnel et humain.
2. **Contrôle humain (Human-in-the-loop)** : L'IA prépare les textes, Joseph relit et valide tranquillement sur son téléphone/ordinateur en passant le statut à "Validé".
3. **Publication automatique** : Make.com détecte la ligne validée et la publie aux heures programmées (matin et soir).
4. **RÈGLE ÉDITORIALE STRICTE (ZÉRO CLICHÉ IA)** :
   - Strictement AUCUNE icône IA (interdiction de ✨, 🤖, 🌟, 🚀, 💡, 🔮).
   - Style sobre, direct, professionnel et naturel.
   - Doit refléter fidèlement la voix humaine d'un cabinet vétérinaire et agropastoral de référence au Congo (Dr Marie-Rose Edwige).
5. **Agent répondeur** : Réponse personnalisée et humaine aux commentaires et messages privés 24/7.

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

## 4. LE POST 1 (VERSION HUMAINE SANS ICÔNES IA)
```text
Bienvenue sur la page officielle d’Agro Véto Services Congo (A.V.S.).

Fondé et dirigé par le Dr Marie-Rose Edwige Rakié POUTYA SAIZONOU, Médecin Vétérinaire et Spécialiste QHSE, notre complexe agropastoral basé à Pointe-Noire accompagne au quotidien les éleveurs, les producteurs et les familles congolaises pour un élevage sain, rentable et durable.

Notre action s'articule autour de trois pôles complémentaires :

1. Pôle Vétérinaire & Élevage :
- Clinique vétérinaire ouverte 24h/24 et 7j/7 (urgences, consultations, chirurgie, pharmacie).
- Provenderie certifiée avec aliments complets pour volailles, porcs et bétail.
- Fourniture de poussins d'un jour de souche Cobb 500 certifiés.

2. Pôle Agricole & Transformation :
- Productions végétales et valorisation de produits agroalimentaires locaux.

3. Pôle Formations & QHSE :
- Formations pratiques pour éleveurs et porteurs de projets agropastoraux.
- Accompagnement en biosécurité, hygiène et normes HACCP.

Pour nous rencontrer :
Quartier Socoprise, Avenue Nelson Mandela, Rue Bissoute — Pointe-Noire.

Urgences et renseignements :
- Téléphone : +242 05 633 70 50
- WhatsApp : +242 06 967 75 67
- Site internet : https://agrovetoservices.cg

Suivez notre page pour nos conseils d'élevage, nos diagnostics et nos arrivages réguliers.

#AgroVetoServices #PointeNoire #Congo #ElevageCongo #CliniqueVeterinaire #Cobb500
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
