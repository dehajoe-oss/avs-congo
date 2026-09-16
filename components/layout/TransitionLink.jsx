'use client'
/**
 * TransitionLink — wrapper autour de next/link optimisé.
 * Permet une navigation instantanée avec préchargement natif Next.js
 * sans blocage ni délai artificiel.
 */
import Link from 'next/link'

function isInternal(href) {
  return typeof href === 'string' && href.startsWith('/')
}

export default function TransitionLink({ href, onClick, children, ...rest }) {
  const handleClick = (e) => {
    onClick?.(e)
  }

  return (
    <Link href={href} onClick={handleClick} prefetch={true} {...rest}>
      {children}
    </Link>
  )
}
