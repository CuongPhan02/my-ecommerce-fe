'use client'

import { StaffList } from '~/features/admin/staff/staff-list'
import { RoleGuard } from '~/components/shared/role-guard'
import { ROLES } from '~/lib/auth-utils'

export default function StaffPage() {
  return (
    <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
      <StaffList />
    </RoleGuard>
  )
}
