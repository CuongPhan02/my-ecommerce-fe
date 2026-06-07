'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRole } from '~/hooks/use-role'
import { isManagementRole } from '~/lib/auth-utils'
import { Loader2 } from 'lucide-react'

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter()
  const { role, isAuthenticated } = useRole()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    if (!isAuthenticated) {
      router.push('/admin/login')
    } else if (!isManagementRole(role)) {
      router.push('/error-403')
    }
  }, [isAuthenticated, role, isMounted, router])

  if (!isMounted) {
    return (
      <div className='min-h-screen w-full flex items-center justify-center bg-[#FAF6F0]'>
        <Loader2 className='w-8 h-8 animate-spin text-[#231f20]' />
      </div>
    )
  }

  // Double check client side roles
  if (!isAuthenticated || !isManagementRole(role)) {
    return (
      <div className='min-h-screen w-full flex items-center justify-center bg-[#FAF6F0]'>
        <Loader2 className='w-8 h-8 animate-spin text-[#231f20]' />
      </div>
    )
  }

  return <>{children}</>
}
