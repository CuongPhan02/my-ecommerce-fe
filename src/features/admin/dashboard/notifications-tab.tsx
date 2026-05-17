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

const notifications = [
  {
    id: 1,
    title: 'Đơn hàng mới #ORD-7352',
    description: 'Nguyen Van A vừa đặt một đơn hàng trị giá $250.00.',
    time: '5 phút trước',
    avatar: 'NA',
    color: 'bg-blue-500',
  },
  {
    id: 2,
    title: 'Sản phẩm sắp hết hàng',
    description: 'Sản phẩm "Áo thun nam" chỉ còn 3 mặt hàng trong kho.',
    time: '1 giờ trước',
    avatar: 'SP',
    color: 'bg-amber-500',
  },
  {
    id: 3,
    title: 'Đánh giá 5 sao mới',
    description: 'Tran Thi B đã để lại đánh giá 5 sao cho "Giày sneaker X".',
    time: '3 giờ trước',
    avatar: 'TB',
    color: 'bg-green-500',
  },
  {
    id: 4,
    title: 'Cập nhật hệ thống',
    description: 'Hệ thống sẽ bảo trì vào lúc 00:00 ngày mai.',
    time: '5 giờ trước',
    avatar: 'HT',
    color: 'bg-purple-500',
  },
  {
    id: 5,
    title: 'Khách hàng mới đăng ký',
    description: 'Có 12 khách hàng mới đăng ký trong hôm nay.',
    time: '1 ngày trước',
    avatar: 'KH',
    color: 'bg-blue-500',
  },
]

export function NotificationsTab() {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Thông báo hệ thống</CardTitle>
        <CardDescription>
          Cập nhật về hoạt động cửa hàng, đơn hàng và khách hàng.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[400px] pr-4'>
          <div className='space-y-6'>
            {notifications.map((notification) => (
              <div key={notification.id} className='flex items-start gap-4'>
                <Avatar className='mt-1 h-9 w-9'>
                  <AvatarFallback
                    className={`text-white ${notification.color}`}
                  >
                    {notification.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1 space-y-1'>
                  <p className='text-sm leading-none font-medium'>
                    {notification.title}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    {notification.description}
                  </p>
                </div>
                <div className='text-muted-foreground text-xs'>
                  {notification.time}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
