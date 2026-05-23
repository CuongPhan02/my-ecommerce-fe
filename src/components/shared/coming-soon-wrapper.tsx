'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import ComingSoon from './coming-soon'

interface ComingSoonWrapperProps {
  children: React.ReactNode
  isEnabled: boolean
}

export default function ComingSoonWrapper({ children, isEnabled }: ComingSoonWrapperProps) {
  const pathname = usePathname()
  const isAuthRoute = pathname?.startsWith('/auth')

  if (isEnabled && !isAuthRoute) {
    return <ComingSoon />
  }

  return <>{children}</>
}
