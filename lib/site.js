// lib/site.js
// Configuration centralisée de l'URL du site pour le SEO, les balises canoniques,
// OpenGraph, Twitter Cards, robots.txt et sitemap.xml.
//
// Permet de fonctionner immédiatement sur le domaine de déploiement (avs-wine.vercel.app),
// tout en permettant de basculer en 1 clic vers un nom de domaine personnalisé (ex: agrovetoservices.cg)
// simplement en renseignant la variable d'environnement NEXT_PUBLIC_SITE_URL sur Vercel.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null) ||
  'https://avs-wine.vercel.app'
).replace(/\/$/, '')
