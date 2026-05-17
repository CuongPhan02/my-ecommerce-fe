'use client'
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
import { Input } from '~/components/ui/core/input'
import { Button } from '~/components/ui/core/button'
import { Search, Eye, Filter } from 'lucide-react'

const orders = [
  {
    id: 'ORD-7352',
    customer: 'Nguyen Van A',
    email: 'nguyenvana@example.com',
    status: 'Hoàn thành',
    paymentMethod: 'Chuyển khoản',
    date: '2023-10-25 14:30',
    amount: '$250.00',
  },
  {
    id: 'ORD-7351',
    customer: 'Tran Thi B',
    email: 'tranthib@example.com',
    status: 'Đang xử lý',
    paymentMethod: 'COD',
    date: '2023-10-24 09:15',
    amount: '$120.50',
  },
  {
    id: 'ORD-7350',
    customer: 'Le Van C',
    email: 'levanc@example.com',
    status: 'Đã hủy',
    paymentMethod: 'Thẻ tín dụng',
    date: '2023-10-23 16:45',
    amount: '$45.00',
  },
  {
    id: 'ORD-7349',
    customer: 'Phạm D',
    email: 'phamd@example.com',
    status: 'Đang giao hàng',
    paymentMethod: 'COD',
    date: '2023-10-22 10:20',
    amount: '$890.00',
  },
  {
    id: 'ORD-7348',
    customer: 'Hoang E',
    email: 'hoange@example.com',
    status: 'Hoàn thành',
    paymentMethod: 'Chuyển khoản',
    date: '2023-10-22 08:00',
    amount: '$55.00',
  },
]

export function OrderList() {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>Danh sách đơn hàng</h1>
        <Button>Xuất dữ liệu</Button>
      </div>

      <Card>
        <CardHeader className='pb-3'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div>
              <CardTitle>Đơn hàng</CardTitle>
              <CardDescription>
                Quản lý tất cả đơn hàng của bạn tại đây.
              </CardDescription>
            </div>
            <div className='flex items-center gap-2'>
              <div className='relative'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  placeholder='Tìm mã đơn, tên, email...'
                  className='pl-8 w-full md:w-[250px]'
                />
              </div>
              <Button variant='outline' size='icon'>
                <Filter className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px]'>Mã đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Thanh toán</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead className='text-right'>Tổng tiền</TableHead>
                <TableHead className='text-right'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className='font-medium'>{order.id}</TableCell>
                  <TableCell>
                    <div className='flex flex-col'>
                      <span>{order.customer}</span>
                      <span className='text-muted-foreground text-xs'>
                        {order.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === 'Hoàn thành'
                          ? 'default'
                          : order.status === 'Đang xử lý' || order.status === 'Đang giao hàng'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell className='text-right'>{order.amount}</TableCell>
                  <TableCell className='text-right'>
                    <Button variant='ghost' size='icon' title='Xem chi tiết'>
                      <Eye className='h-4 w-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
