'use client'

import React from 'react'
import LogsViewer from '~/features/admin/log/LogsViewer'
import { RoleGuard } from '~/components/shared/role-guard'
import { ROLES } from '~/lib/auth-utils'

const PageLog = () => {
  return (
    <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
      <div>
        <LogsViewer />
      </div>
    </RoleGuard>
  )
}

export default PageLog
