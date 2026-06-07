'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '~/store/auth-store'
import { AUTH_QUERY } from '~/features/public/auth/auth.query'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/components/ui/core/avatar'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '~/components/ui/core/dropdown-menu'

export function ProfileDropdown() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const queryClient = useQueryClient()
  const { mutate: logoutMutation } = AUTH_QUERY.useLogout(queryClient)
  const { data: meData } = AUTH_QUERY.useMe()

  const name = meData?.result?.name || user?.name || 'Admin'
  const email = meData?.result?.email || user?.email || 'admin@example.com'
  const avatarUrl = meData?.result?.avatarUrl || user?.avatarUrl

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
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Avatar className='h-9 w-9 cursor-pointer'>
          {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
          <AvatarFallback className='bg-primary/10 text-primary font-bold'>
            {name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm leading-none font-medium'>{name}</p>
            <p className='text-muted-foreground text-xs leading-none'>
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href='/admin/profile'>
              Hồ sơ
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/admin/settings'>
              Cài đặt
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className='cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20'>
          Đăng xuất
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
