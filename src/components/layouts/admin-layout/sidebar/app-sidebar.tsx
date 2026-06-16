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

import { useRouter } from 'next/navigation'
import { useAuthStore } from '~/store/auth-store'
import { AUTH_QUERY } from '~/features/public/auth/auth.query'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useMemo } from 'react'
import { _userService } from '~/features/admin/user/user.query'
import { _settingsService } from '~/features/admin/settings/settings.query'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const { logout, user } = useAuthStore()
  const queryClient = useQueryClient()
  const { mutate: logoutMutation } = AUTH_QUERY.useLogout(queryClient)

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'
  const { data: usersData } = _userService.useUsers(
    { page: 1, limit: 1 },
    { enabled: !!user && isAdmin },
  )
  const totalUsers = usersData?.result?.meta?.total

  const navGroups = useMemo(() => {
    return sidebarData.navGroups.map((group) => ({
      ...group,
      items: group.items.map((item) => {
        if (item.title === 'Người dùng') {
          return {
            ...item,
            badge: totalUsers !== undefined ? String(totalUsers) : undefined,
          }
        }
        return item
      }),
    }))
  }, [totalUsers])

  const { data: logoData } = _settingsService.useLogoSettings()
  const logoUrl = logoData?.result?.imageUrl || null
  const logoAlt = logoData?.result?.alt || null

  const handleLogout = () => {
    logoutMutation(undefined, {
      onSuccess: () => {
        logout()
        toast.success('Đăng xuất thành công')
        router.push('/admin/login')
      },
      onError: () => {
        logout()
        router.push('/admin/login')
      },
    })
  }

  return (
    <Sidebar collapsible='icon' variant='sidebar' {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-primary/10 data-[state=open]:text-primary'
        >
          <LogoUi 
            logoUrl={logoUrl} 
            logoAlt={logoAlt} 
            onClick={() => router.push('/admin/dashboard')} 
          />
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className='h-full'>
          {navGroups.map((props) => (
            <NavGroup key={props.title} {...props} />
          ))}
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenuButton 
          onClick={handleLogout}
          className='font-medium gap-3 h-9 rounded-md bg-muted dark:bg-background hover:bg-primary/10 hover:text-primary [&>svg]:size-auto'
        >
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
