import './globals.css'
import { ThemeProvider } from '@/lib/theme'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { BackToTop, FloatingWA } from '@/components/ui/index'
import Loader from '@/components/ui/Loader'
import ScrollToTop from '@/components/ui/ScrollToTop'
import { cld } from '@/lib/cloudinary'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import { Poppins } from 'next/font/google'
import { PageTransitionProvider } from '@/components/layout/PageTransition'
import { BlobTransitionProvider } from '@/components/layout/BlobTransition'
import { ShopProvider } from '@/lib/shopContext'
import Toast from '@/components/ui/Toast'
import { SitewideStructuredData } from './seo/StructuredData'
import BreadcrumbTrail from './seo/BreadcrumbTrail'

const AIAssistant = dynamic(() => import('@/components/ui/AIAssistant'), { ssr: false })
const CartDrawer = dynamic(() => import('@/components/shop/CartDrawer'), { ssr: false })
const AuthModal = dynamic(() => import('@/components/auth/AuthModal'), { ssr: false })
const CookieConsent = dynamic(() => import('@/components/ui/CookieConsent'), { ssr: false })
const VisitorTracker = dynamic(() => import('@/components/ui/VisitorTracker'), { ssr: false })

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-poppins',
  preload: false,
})

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
  authors: [{ name: "Dr POUTYA SAIZONOU Marie-Rose Edwige Rakié", url: SITE_URL }],
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
  themeColor: '#c47b2d',
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
  name: 'AGRO VÉTO SERVICES CONGO S.A.R.L.U.',
  alternateName: "Agro Véto Services Pointe-Noire",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.webp`,
  image: cld('/images/og-cover.webp'),
  description: "Entreprise pluridisciplinaire : santé animale & intrants agropastoraux, management QHSE, transformation agroalimentaire, cosmétique & hygiène, centre de formation et événementiel à Pointe-Noire (Congo).",
  founder: { '@type': 'Person', name: "Dr POUTYA SAIZONOU Marie-Rose Edwige Rakié" },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Quartier Socoprise, Avenue Nelson Mandela, Rue Bissoute',
    addressLocality: 'Pointe-Noire',
    addressCountry: 'CG',
  },
  areaServed: [
    { '@type': 'Country', name: "République du Congo" },
    { '@type': 'Place', name: 'Afrique Centrale' },
  ],
  priceRange: '1 500 FCFA - 1 200 000 FCFA',
  telephone: ['+242 05 633 70 50', '+242 06 967 75 67'],
  email: 'agrovetoservicescongo@gmail.com',
  sameAs: [
    'https://facebook.com/agrovetoservicescongo',
    'https://wa.me/242069677567',
  ],
  knowsAbout: [
    'Médecine vétérinaire', 'Santé animale & intrants agropastoraux', 'Provenderie certifiée',
    'Management QHSE', 'Méthode HACCP', 'Normes ISO 9001 / 14001 / 45001 / 22000',
    'Transformation agroalimentaire & sécurité sanitaire', 'Cosmétique & hygiène',
    'Formations professionnelles & Ferme-école', 'Événementiel & commerce général'
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Les 6 Pôles d\'activités AGRO VÉTO SERVICES CONGO',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pôle 1 — Santé animale & intrants agropastoraux' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pôle 2 — Management QHSE & Externalisation' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pôle 3 — Transformation agroalimentaire & sécurité sanitaire' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pôle 4 — Cosmétique, hygiène & artisanat' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pôle 5 — Centre de formation & renforcement des capacités' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pôle 6 — Événementiel & commerce général' } },
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={poppins.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="96x96" />
        <link rel="icon" href="/icon-512.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <SitewideStructuredData organization={ORG_JSON_LD} />
      </head>
      <body className={poppins.className}>
        <ThemeProvider>
          <PageTransitionProvider>
            <BlobTransitionProvider>
              <ShopProvider>
                <ScrollToTop />
                <Loader />
                <Navbar />
                <BreadcrumbTrail />
                <main>{children}</main>
                <Footer />
                <CartDrawer />
                <AuthModal />
                <Toast />
                <FloatingWA />
                <BackToTop />
                <AIAssistant />
                <VisitorTracker />
                <CookieConsent />
              </ShopProvider>
            </BlobTransitionProvider>
          </PageTransitionProvider>
        </ThemeProvider>
        <Script src="https://cdn.kkiapay.me/k.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}
