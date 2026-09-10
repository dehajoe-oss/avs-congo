'use client'
import { usePathname } from 'next/navigation'
import CardNav from './CardNav'
import StaggeredMenu from './StaggeredMenu'

const NAV_LINKS = [
  { label: 'Accueil',      href: '/'           },
  { label: 'À Propos',     href: '/about'      },
  { label: 'Nos 6 Pôles',  href: '/services'   },
  { label: 'Boutique',     href: '/boutique'   },
  { label: 'Clinique',     href: '/clinique'   },
  { label: 'Formations',   href: '/formations' },
  { label: 'Réalisations', href: '/projects'   },
  { label: 'Mon Compte',   href: '/mon-compte' },
  { label: 'Blog',         href: '/blog'       },
  { label: 'Contact',      href: '/contact'    },
]

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  if (pathname?.startsWith('/explorer')) return null

  return (
    <>
      <style>{`
        .nav-desktop-only { display: block; }
        .nav-mobile-only  { display: none; }
        @media (max-width: 920px) {
          .nav-desktop-only { display: none; }
          .nav-mobile-only  {
            display: block;
          }
        }
      `}</style>

      {/* ── Desktop : Card-Nav (port du mockup HTML) ── */}
      <div className="nav-desktop-only">
        <CardNav />
      </div>

      {/* ── Mobile : Staggered Menu (port du portfolio) ── */}
      <div className="nav-mobile-only">
        <StaggeredMenu items={NAV_LINKS} isActive={isActive} />
      </div>
    </>
  )
}
