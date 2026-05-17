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
    customer: 'Nguyen Van A',
    email: 'nguyenvana@example.com',
    status: 'Hoàn thành',
    date: '2023-10-25',
    amount: '$250.00',
  },
  {
    id: 'ORD-7351',
    customer: 'Tran Thi B',
    email: 'tranthib@example.com',
    status: 'Đang xử lý',
    date: '2023-10-24',
    amount: '$120.50',
  },
  {
    id: 'ORD-7350',
    customer: 'Le Van C',
    email: 'levanc@example.com',
    status: 'Đã hủy',
    date: '2023-10-23',
    amount: '$45.00',
  },
  {
    id: 'ORD-7349',
    customer: 'Phạm D',
    email: 'phamd@example.com',
    status: 'Hoàn thành',
    date: '2023-10-22',
    amount: '$890.00',
  },
  {
    id: 'ORD-7348',
    customer: 'Hoang E',
    email: 'hoange@example.com',
    status: 'Đang xử lý',
    date: '2023-10-22',
    amount: '$55.00',
  },
  {
    id: 'ORD-7347',
    customer: 'Vo Thi F',
    email: 'vothif@example.com',
    status: 'Hoàn thành',
    date: '2023-10-21',
    amount: '$340.20',
  },
]

export function ReportsTab() {
  return (
    <Card className='h-full'>
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
              <TableRow key={order.id}>
                <TableCell className='font-medium'>{order.id}</TableCell>
                <TableCell>
                  <div>
                    <p>{order.customer}</p>
                    <p className='text-muted-foreground text-xs'>
                      {order.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === 'Hoàn thành'
                        ? 'default'
                        : order.status === 'Đang xử lý'
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell className='text-right'>{order.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
