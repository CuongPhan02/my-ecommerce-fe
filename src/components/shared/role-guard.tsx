'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRole } from '~/hooks/use-role'
import { Role } from '~/lib/auth-utils'
import { Loader2 } from 'lucide-react'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: Role[]
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
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
    } else if (role && !allowedRoles.includes(role as Role)) {
      router.push('/error-403')
    }
  }, [isAuthenticated, role, isMounted, allowedRoles, router])

  if (!isMounted) {
    return (
      <div className='p-8 flex justify-center items-center'>
        <Loader2 className='w-6 h-6 animate-spin text-[#231f20]' />
      </div>
    )
  }

  if (!isAuthenticated || !role || !allowedRoles.includes(role as Role)) {
    return null
  }

  return <>{children}</>
}
