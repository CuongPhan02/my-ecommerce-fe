'use client'

import { IconLogout2 } from '@tabler/icons-react'
import Link from 'next/link'
import { ScrollArea } from '~/components/ui/core/scroll-area'

import LogoUi from '~/components/shared/logo-ui'
import { sidebarData } from '~/components/layouts/admin-layout/sidebar-setting'

import { NavGroup } from './nav-group'
import { Sidebar, SidebarHeader } from './nav-sidebar'
import { SidebarContent } from './nav-sidebar'
import { SidebarMenuButton } from './nav-sidebar'
import { SidebarRail } from './nav-sidebar'
import { SidebarFooter } from './nav-sidebar'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' variant='sidebar' {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-primary/10 data-[state=open]:text-primary'
        >
          <Link href={'/'} className='inline-block'>
            <LogoUi />
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className='h-full'>
          {sidebarData.navGroups.map((props) => (
            <NavGroup key={props.title} {...props} />
          ))}
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenuButton className='font-medium gap-3 h-9 rounded-md bg-muted dark:bg-background hover:bg-primary/10 hover:text-primary [&>svg]:size-auto'>
          <IconLogout2
            className='text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary'
            size={22}
            aria-hidden='true'
          />
          <span>Đăng xuất</span>
        </SidebarMenuButton>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
