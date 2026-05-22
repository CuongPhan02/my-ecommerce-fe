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
    description: 'Nguyễn Văn An vừa đặt một đơn hàng trị giá 2.500.000 ₫.',
    time: '5 phút trước',
    avatar: 'DH',
    color: 'bg-emerald-500',
  },
  {
    id: 2,
    title: 'Kho hàng - Sản phẩm sắp hết',
    description: 'Áo khoác Blazer dáng rộng (Size M) chỉ còn 3 sản phẩm trong kho.',
    time: '45 phút trước',
    avatar: 'KH',
    color: 'bg-amber-500',
  },
  {
    id: 3,
    title: 'Yêu cầu đổi trả #REF-8820',
    description: 'Lê Văn Cường đã gửi yêu cầu hoàn tiền cho đơn hàng #ORD-7350.',
    time: '2 giờ trước',
    avatar: 'DT',
    color: 'bg-rose-500',
  },
  {
    id: 4,
    title: 'Đánh giá 5 sao mới',
    description: 'Trần Thị Bình đã đánh giá 5 sao cho sản phẩm "Áo sơ mi lụa tơ tằm".',
    time: '4 giờ trước',
    avatar: 'DG',
    color: 'bg-indigo-500',
  },
  {
    id: 5,
    title: 'Chiến dịch Voucher đã chạy',
    description: 'Khuyến mãi "SUMMER2026" đã được kích hoạt thành công trên toàn hệ thống.',
    time: '1 ngày trước',
    avatar: 'KM',
    color: 'bg-sky-500',
  },
]

export function NotificationsTab() {
  return (
    <Card className='h-full border-muted/50 shadow-sm'>
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
              <div key={notification.id} className='flex items-start gap-4 hover:bg-muted/10 p-1.5 rounded-lg transition-colors'>
                <Avatar className='mt-1 h-9 w-9 shadow-sm'>
                  <AvatarFallback
                    className={`text-white font-bold text-xs ${notification.color}`}
                  >
                    {notification.avatar}
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
                <div className='text-muted-foreground text-[10px] font-medium whitespace-nowrap'>
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
