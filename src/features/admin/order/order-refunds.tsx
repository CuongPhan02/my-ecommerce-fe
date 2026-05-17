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
import { Search, Filter, CheckCircle2, XCircle } from 'lucide-react'

const refunds = [
  {
    id: 'REF-001',
    orderId: 'ORD-7350',
    customer: 'Le Van C',
    reason: 'Sản phẩm lỗi kỹ thuật',
    status: 'Chờ duyệt',
    date: '2023-10-24 10:00',
    amount: '$45.00',
  },
  {
    id: 'REF-002',
    orderId: 'ORD-7210',
    customer: 'Mai Thi G',
    reason: 'Giao sai mẫu',
    status: 'Đã hoàn tiền',
    date: '2023-10-20 14:15',
    amount: '$150.00',
  },
  {
    id: 'REF-003',
    orderId: 'ORD-7199',
    customer: 'Tran Van H',
    reason: 'Thay đổi ý định',
    status: 'Từ chối',
    date: '2023-10-18 09:30',
    amount: '$89.00',
  },
]

export function OrderRefunds() {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>Đổi trả & Hoàn tiền</h1>
      </div>

      <Card>
        <CardHeader className='pb-3'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div>
              <CardTitle>Yêu cầu hoàn tiền</CardTitle>
              <CardDescription>
                Xử lý các yêu cầu đổi trả và hoàn tiền từ khách hàng.
              </CardDescription>
            </div>
            <div className='flex items-center gap-2'>
              <div className='relative'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  placeholder='Tìm mã yêu cầu, mã đơn...'
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
                <TableHead className='w-[100px]'>Mã Y/C</TableHead>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Lý do</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày yêu cầu</TableHead>
                <TableHead className='text-right'>Số tiền</TableHead>
                <TableHead className='text-right'>Xử lý</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {refunds.map((refund) => (
                <TableRow key={refund.id}>
                  <TableCell className='font-medium'>{refund.id}</TableCell>
                  <TableCell>{refund.orderId}</TableCell>
                  <TableCell>{refund.customer}</TableCell>
                  <TableCell className='max-w-[200px] truncate'>{refund.reason}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        refund.status === 'Đã hoàn tiền'
                          ? 'default'
                          : refund.status === 'Chờ duyệt'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {refund.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{refund.date}</TableCell>
                  <TableCell className='text-right font-medium text-destructive'>{refund.amount}</TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button variant='ghost' size='icon' title='Duyệt' className='text-green-600 hover:text-green-700 hover:bg-green-50'>
                        <CheckCircle2 className='h-4 w-4' />
                      </Button>
                      <Button variant='ghost' size='icon' title='Từ chối' className='text-red-600 hover:text-red-700 hover:bg-red-50'>
                        <XCircle className='h-4 w-4' />
                      </Button>
                    </div>
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
