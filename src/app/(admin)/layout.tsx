import React from 'react'
import LayoutAdmin from '~/components/layouts/admin-layout'
import { AppSidebar } from '~/components/layouts/admin-layout/sidebar/app-sidebar'
import { SidebarProvider } from '~/components/layouts/admin-layout/sidebar/nav-sidebar'
import 'filepond/dist/filepond.min.css'
import { SearchProvider } from '~/providers/search-context'
import { AdminGuard } from '~/components/shared/admin-guard'

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <AdminGuard>
      <div className='min-h-screen'>
        <SearchProvider>
          <SidebarProvider>
            <AppSidebar />
            <LayoutAdmin>{children}</LayoutAdmin>
          </SidebarProvider>
        </SearchProvider>
      </div>
    </AdminGuard>
  )
}

export default Layout
