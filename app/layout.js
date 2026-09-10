import './globals.css'
import { ThemeProvider } from '@/lib/theme'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { BackToTop, FloatingWA } from '@/components/ui/index'
import Loader from '@/components/ui/Loader'
import ScrollToTop from '@/components/ui/ScrollToTop'
import AIAssistant from '@/components/ui/AIAssistant'
import VisitorTracker from '@/components/ui/VisitorTracker'
import CookieConsent from '@/components/ui/CookieConsent'
import { cld } from '@/lib/cloudinary'
import { Analytics } from '@vercel/analytics/next'
import { PageTransitionProvider } from '@/components/layout/PageTransition'
import { BlobTransitionProvider } from '@/components/layout/BlobTransition'
import { SitewideStructuredData } from './seo/StructuredData'
import BreadcrumbTrail from './seo/BreadcrumbTrail'

const SITE_URL = 'https://agrovetoservices.cg'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AGRO VÉTO SERVICES CONGO — De la santé animale à l'excellence QHSE",
    template: "%s | Agro Véto Services",
  },
  description: "Clinique vétérinaire 24h/24 & 7j/7, provenderie certifiée, poussins d'un jour Cobb 500 et accompagnement en management QHSE / normes ISO à Pointe-Noire (Congo).",
  keywords: [
    "clinique vétérinaire pointe-noire", "vétérinaire congo", "poussins d'un jour cobb 500 congo",
    "provenderie pointe-noire", "aliment volaille congo", "audit QHSE congo",
    "norme iso 22000 afrique", "méthode haccp congo", "dr poutya saizonou",
    "agro véto services congo", "ferme école congo",
  ],
  authors: [{ name: "Dr Marie-Rose Edwige Rakié POUTYA SAIZONOU", url: SITE_URL }],
  creator: 'Agro Véto Services',
  publisher: 'Agro Véto Services',
  category: 'agriculture & veterinary',
  alternates: { canonical: '/' },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_CG',
    siteName: 'Agro Véto Services',
    title: "AGRO VÉTO SERVICES CONGO — De la santé animale à l'excellence QHSE",
    description: "Santé animale, provenderie certifiée, élevage de poussins et excellence QHSE à Pointe-Noire, République du Congo.",
    url: SITE_URL,
    images: [{ url: cld('/images/og-cover.webp'), width: 1200, height: 630, alt: 'Agro Véto Services Congo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "AGRO VÉTO SERVICES CONGO — Pointe-Noire",
    description: "Santé animale, provenderie de pointe et excellence QHSE au Congo.",
    images: [cld('/images/og-cover.webp')],
  },
}

export const viewport = {
  themeColor: '#5a8738',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

/* ════════════════════════════════════════════════════════════
   JSON-LD — ProfessionalService / LocalBusiness
   Sert de socle d'identité pour :
   • SEO  : rich snippets Google (note, adresse, horaires)
   • AEO  : permet aux moteurs de réponse (Google AI Overviews,
            assistants vocaux) de citer Agro Véto Services directement
            comme réponse à "qui fait des sites web à Pointe-Noire"
   • GEO  : structure factuelle exploitable par les LLM
            (ChatGPT, Perplexity...) pour recommander Agro Véto Services
   ════════════════════════════════════════════════════════════ */
const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#organization`,
  name: 'Agro Véto Services',
  alternateName: "Agro Véto Services Pointe-Noire",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.webp`,
  image: cld('/images/og-cover.webp'),
  description: "Complexe agropastoral et clinique vétérinaire 24/7 à Pointe-Noire (Congo). Poussins Cobb 500, provenderie certifiée, formations ferme-école et audits QHSE.",
  founder: { '@type': 'Person', name: "Dr Marie-Rose Edwige Rakié POUTYA SAIZONOU" },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Pointe-Noire',
    addressCountry: 'CG',
  },
  areaServed: [
    { '@type': 'Country', name: "République du Congo" },
    { '@type': 'Place', name: 'Afrique Centrale' },
  ],
  priceRange: '10 000 FCFA - 1 200 000 FCFA',
  telephone: '+242-06-000-00-00',
  email: 'contact@agrovetoservices.cg',
  sameAs: [
    'https://facebook.com/agrovetoservicescongo',
    'https://wa.me/242060000000',
  ],
  knowsAbout: [
    'Médecine vétérinaire', 'Santé animale', 'Provenderie industrielle', 'Poussins Cobb 500',
    'Management QHSE', 'Méthode HACCP', 'Normes ISO 22000', 'Fermes-écoles', 'Biosécurité',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Prestations Agro Véto Services Congo',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Clinique Vétérinaire & Urgences 24/7' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Provenderie & Nutrition Animale' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Poussins d’un Jour (Cobb 500 & Lohmann)' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Formations Certifiantes & Ferme-École' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Audits QHSE & Normes ISO' } },
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="96x96" />
        <link rel="icon" href="/icon-512.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Dancing+Script:wght@700&family=JetBrains+Mono:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <SitewideStructuredData organization={ORG_JSON_LD} />
      </head>
      <body>
        <ThemeProvider>
          <PageTransitionProvider>
            <BlobTransitionProvider>
              <ScrollToTop />
              <Loader />
              <Navbar />
              <BreadcrumbTrail />
              <main>{children}</main>
              <Footer />
              <FloatingWA />
              <BackToTop />
              <AIAssistant />
              <VisitorTracker />
              <CookieConsent />
              <Analytics />
            </BlobTransitionProvider>
          </PageTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
