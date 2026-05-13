'use client'

import { useAuthStore } from '~/store/auth-store'
import { isManagementRole, ROLES, Role } from '~/lib/auth-utils'

export const useRole = () => {
  const { user, isAuthenticated } = useAuthStore()
  const userRole = user?.role as string | undefined

  return {
    role: userRole,
    isAuthenticated,
    isAdmin: userRole === ROLES.ADMIN,
    isSuperAdmin: userRole === ROLES.SUPER_ADMIN,
    isStaff: userRole === ROLES.STAFF,
    isManagement: isManagementRole(userRole),
    isUser: userRole === ROLES.USER,
    hasRole: (roles: Role[]) => {
      if (!userRole) return false
      return roles.includes(userRole as Role)
    },
  }
}
