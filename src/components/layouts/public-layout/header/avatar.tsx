'use client'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/components/ui/core/avatar'
import { Button } from '~/components/ui/core/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/core/dropdown-menu'
import { useAuthStore } from '~/store/auth-store'
import { useRole } from '~/hooks/use-role'
import { LayoutDashboard, LogOut, Settings, User } from 'lucide-react'
import { Link } from 'next-view-transitions'

interface Props {
  handleLogout: () => void
}

export function AvatarDropdown({ handleLogout }: Props) {
  const { user } = useAuthStore()
  const { isManagement } = useRole()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='rounded-full'>
          <Avatar>
            <AvatarImage src='https://github.com/shadcn.png' alt='shadcn' />
            <AvatarFallback>
              {user?.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-40' align='end'>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href='/profile' className='cursor-pointer w-full'>
              <User className='size-4' />
              Profile
            </Link>
          </DropdownMenuItem>
          {isManagement && (
            <DropdownMenuItem asChild>
              <Link
                href='/admin/dashboard'
                className='cursor-pointer w-full flex items-center gap-2'
              >
                <LayoutDashboard className='size-4' />
                Dashboard
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className='cursor-pointer'>
            <Settings className='size-4' />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant='destructive'
            onClick={handleLogout}
            className='cursor-pointer flex justify-between gap-2'
          >
            Log out
            <LogOut className='size-4' />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
