'use client'
import { useState, useEffect } from 'react'
import ProjectsClient       from './ProjectsClient'
import ProjectsClientMobile from './ProjectsClientMobile'

export default function ProjectsResponsive() {
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

  return mobile ? <ProjectsClientMobile /> : <ProjectsClient />
}
