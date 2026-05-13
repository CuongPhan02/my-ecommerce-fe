'use client'

import React from 'react'
import { useRole } from '~/hooks/use-role'
import { Role } from '~/lib/auth-utils'

interface AuthorizedProps {
  children: React.ReactNode
  roles?: Role[]
  managementOnly?: boolean
  fallback?: React.ReactNode
}

export function Authorized({
  children,
  roles,
  managementOnly,
  fallback = null,
}: AuthorizedProps) {
  const { isManagement, hasRole, isAuthenticated } = useRole()

  if (!isAuthenticated) return <>{fallback}</>

  if (managementOnly && isManagement) {
    return <>{children}</>
  }

  if (roles && hasRole(roles)) {
    return <>{children}</>
  }

  if (!roles && !managementOnly) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
