export const ROLES = {
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  STAFF: 'STAFF',
  USER: 'USER',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const MANAGEMENT_ROLES: Role[] = [
  ROLES.ADMIN,
  ROLES.SUPER_ADMIN,
  ROLES.STAFF,
]

/**
 * Checks if a given role is a management role (Admin, Super Admin, or Staff)
 */
export const isManagementRole = (role?: string | null): boolean => {
  if (!role) return false
  return MANAGEMENT_ROLES.includes(role as Role)
}

/**
 * Checks if a user has any of the required roles
 */
export const hasRequiredRole = (
  userRole: string | undefined | null,
  requiredRoles: Role[],
): boolean => {
  if (!userRole) return false
  return requiredRoles.includes(userRole as Role)
}
