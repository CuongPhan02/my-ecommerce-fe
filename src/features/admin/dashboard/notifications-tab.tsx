'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import { ScrollArea } from '~/components/ui/core/scroll-area'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/components/ui/core/avatar'

import * as React from 'react'

interface NotificationItem {
  id: string
  type: 'ORDER' | 'LOW_STOCK' | 'REFUND' | 'REVIEW'
  title: string
  description: string
  createdAt: string
}

interface NotificationsTabProps {
  notifications?: NotificationItem[]
}

function getRelativeTimeString(dateString: string): string {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Vừa xong'
  
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) {
    return 'Vừa xong'
  }
  if (diffMin < 60) {
    return `${diffMin} phút trước`
  }
  if (diffHour < 24) {
    return `${diffHour} giờ trước`
  }
  if (diffDay < 7) {
    return `${diffDay} ngày trước`
  }
  
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

const getNotificationMeta = (type: string) => {
  switch (type) {
    case 'ORDER':
      return { avatar: 'DH', color: 'bg-emerald-500' }
    case 'LOW_STOCK':
      return { avatar: 'KH', color: 'bg-amber-500' }
    case 'REFUND':
      return { avatar: 'DT', color: 'bg-rose-500' }
    case 'REVIEW':
      return { avatar: 'DG', color: 'bg-indigo-500' }
    default:
      return { avatar: 'TB', color: 'bg-slate-500' }
  }
}

export function NotificationsTab({ notifications = [] }: NotificationsTabProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Card className='h-full border-muted/50 shadow-sm'>
      <CardHeader>
        <CardTitle className="text-sm font-black uppercase tracking-widest">Thông báo hệ thống</CardTitle>
        <CardDescription className="text-xs font-bold uppercase tracking-widest">
          Cập nhật về hoạt động cửa hàng, đơn hàng và khách hàng.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[400px] pr-4'>
          <div className='space-y-6'>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground text-xs font-bold uppercase tracking-widest">
                Chưa có thông báo nào
              </div>
            ) : (
              notifications.map((notification) => {
                const meta = getNotificationMeta(notification.type)
                return (
                  <div key={notification.id} className='flex items-start gap-4 hover:bg-muted/10 p-1.5 rounded-lg transition-colors'>
                    <Avatar className='mt-1 h-9 w-9 shadow-sm'>
                      <AvatarFallback
                        className={`text-white font-bold text-xs ${meta.color}`}
                      >
                        {meta.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 space-y-1'>
                      <p className='text-sm leading-none font-bold text-slate-800 dark:text-slate-200'>
                        {notification.title}
                      </p>
                      <p className='text-muted-foreground text-xs leading-relaxed'>
                        {notification.description}
                      </p>
                    </div>
                    <div className='text-muted-foreground text-[10px] font-bold whitespace-nowrap tracking-wider uppercase'>
                      {mounted ? getRelativeTimeString(notification.createdAt) : '...'}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
