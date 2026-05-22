import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/core/table'
import { Badge } from '~/components/ui/core/badge'

const recentOrders = [
  {
    id: 'ORD-7352',
    customer: 'Nguyễn Văn An',
    email: 'an.nguyen@email.com',
    status: 'Hoàn thành',
    date: '22-05-2026',
    amount: '2.500.000 ₫',
  },
  {
    id: 'ORD-7351',
    customer: 'Trần Thị Bình',
    email: 'binh.tran@email.com',
    status: 'Đang xử lý',
    date: '22-05-2026',
    amount: '1.200.500 ₫',
  },
  {
    id: 'ORD-7350',
    customer: 'Lê Văn Cường',
    email: 'cuong.le@email.com',
    status: 'Đã hủy',
    date: '21-05-2026',
    amount: '450.000 ₫',
  },
  {
    id: 'ORD-7349',
    customer: 'Phạm Minh Đức',
    email: 'duc.pham@email.com',
    status: 'Đang giao hàng',
    date: '21-05-2026',
    amount: '7.210.000 ₫',
  },
  {
    id: 'ORD-7348',
    customer: 'Hoàng Thu Em',
    email: 'em.hoang@email.com',
    status: 'Hoàn thành',
    date: '20-05-2026',
    amount: '550.000 ₫',
  },
  {
    id: 'ORD-7347',
    customer: 'Võ Quốc Thịnh',
    email: 'thinh.vo@email.com',
    status: 'Đang giao hàng',
    date: '20-05-2026',
    amount: '3.420.200 ₫',
  },
]

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Hoàn thành':
      return 'success'
    case 'Đang xử lý':
      return 'warning'
    case 'Đang giao hàng':
      return 'info'
    case 'Đã hủy':
      return 'destructive'
    default:
      return 'default'
  }
}

export function ReportsTab() {
  return (
    <Card className='h-full border-muted/50 shadow-sm'>
      <CardHeader>
        <CardTitle>Báo cáo đơn hàng gần đây</CardTitle>
        <CardDescription>
          Chi tiết các đơn hàng mới nhất và trạng thái thanh toán.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>Mã đơn</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày</TableHead>
              <TableHead className='text-right'>Số tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id} className='hover:bg-muted/30 transition-colors'>
                <TableCell className='font-bold text-slate-800 dark:text-slate-200'>{order.id}</TableCell>
                <TableCell>
                  <div>
                    <p className='font-medium text-sm'>{order.customer}</p>
                    <p className='text-muted-foreground text-xs font-mono'>
                      {order.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className='text-xs text-muted-foreground'>{order.date}</TableCell>
                <TableCell className='text-right font-bold text-slate-900 dark:text-slate-50'>{order.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
