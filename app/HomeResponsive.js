'use client'
import { useState, useEffect } from 'react'
import HomeClientDesktop from './HomeClientDesktop'
import HomeClientMobile  from './HomeClientMobile'

export default function HomeResponsive() {
  const [mounted, setMounted] = useState(false)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const check = () => setMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!mounted) return <HomeClientDesktop />

  return mobile ? <HomeClientMobile /> : <HomeClientDesktop />
}
