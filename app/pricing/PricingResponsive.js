'use client'
import { useState, useEffect } from 'react'
import PricingClient       from './PricingClient'
import PricingClientMobile from './PricingClientMobile'

export default function PricingResponsive() {
  const [mobile, setMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024
    }
    return false
  })

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 1024)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return mobile ? <PricingClientMobile /> : <PricingClient />
}
