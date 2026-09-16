'use client'
import { useState, useEffect } from 'react'
import ContactClient       from './ContactClient'
import ContactClientMobile from './ContactClientMobile'

export default function ContactResponsive() {
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

  return mobile ? <ContactClientMobile /> : <ContactClient />
}
