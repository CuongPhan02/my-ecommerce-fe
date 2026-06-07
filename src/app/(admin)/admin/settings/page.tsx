'use client'

import { StoreSettings } from '~/features/admin/settings/store-settings'
import { RoleGuard } from '~/components/shared/role-guard'
import { ROLES } from '~/lib/auth-utils'

export default function SettingsPage() {
  return (
    <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
      <StoreSettings />
    </RoleGuard>
  )
}
