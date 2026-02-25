import React from 'react'
import LayoutAdmin from '~/components/layouts/admin-layout'
import { AppSidebar } from '~/components/layouts/admin-layout/sidebar/app-sidebar'
import { SidebarProvider } from '~/components/layouts/admin-layout/sidebar/nav-sidebar'

import { SearchProvider } from '~/providers/search-context'

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className='min-h-screen'>
      <SearchProvider>
        <SidebarProvider>
          <AppSidebar />
          <LayoutAdmin>{children}</LayoutAdmin>
        </SidebarProvider>
      </SearchProvider>
    </div>
  )
}

export default Layout
