'use client'

import { useAuthStore } from '~/store/auth-store'
import { User } from 'lucide-react'
import { Link } from 'next-view-transitions'
import { AUTH_QUERY } from '~/features/public/auth/auth.query'

export function AvatarIcon() {
  const { user } = useAuthStore()
  const { data: meData } = AUTH_QUERY.useMe()

  // Prefer fresh server data for avatar, fall back to store
  const avatarUrl = meData?.result?.avatarUrl || user?.avatarUrl
  const name = meData?.result?.name || user?.name || ''

  const href = '/profile'

  return (
    <Link
      href={href}
      title='Trang cá nhân'
      className="relative p-0.5 rounded-full hover:ring-2 hover:ring-primary hover:ring-offset-1 transition-all duration-200"
    >
      {avatarUrl ? (
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden border-2 border-gray-200">
          <img
            src={avatarUrl}
            alt={name}
            width={36}
            height={36}
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:bg-primary/10 transition-colors">
          {name ? (
            <span className="text-xs font-black uppercase text-gray-600">
              {name.slice(0, 2)}
            </span>
          ) : (
            <User className="w-4 h-4 stroke-[1.8]" />
          )}
        </div>
      )}
    </Link>
  )
}
