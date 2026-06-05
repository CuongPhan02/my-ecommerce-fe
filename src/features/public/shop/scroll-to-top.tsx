'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function ScrollToTop() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Smooth scroll to top of the page when search parameters change
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [searchParams])

  return null
}
