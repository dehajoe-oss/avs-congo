'use client'
import { useState, useEffect } from 'react'
import BlogClient       from './BlogClient'
import BlogClientMobile from './BlogClientMobile'

export default function BlogResponsive() {
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

  return mobile ? <BlogClientMobile /> : <BlogClient />
}
