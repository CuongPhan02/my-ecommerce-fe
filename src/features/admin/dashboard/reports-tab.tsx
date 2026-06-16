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

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'Chờ xử lý'
    case 'PROCESSING':
      return 'Đang xử lý'
    case 'SHIPPED':
      return 'Đang giao hàng'
    case 'DELIVERED':
      return 'Hoàn thành'
    case 'CANCELLED':
      return 'Đã hủy'
    case 'RETURNED':
      return 'Trả hàng'
    default:
      return status
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'DELIVERED':
      return 'success'
    case 'PENDING':
      return 'warning'
    case 'PROCESSING':
    case 'SHIPPED':
      return 'info'
    case 'CANCELLED':
      return 'destructive'
    default:
      return 'default'
  }
}

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}-${month}-${year}`
  } catch (e) {
    return dateStr
  }
}

export function ReportsTab({ orders }: { orders?: any[] }) {
  const ordersList = orders || []

  return (
    <Card className='h-full border-muted/50 shadow-sm'>
      <CardHeader>
        <CardTitle>Báo cáo đơn hàng gần đây</CardTitle>
        <CardDescription>
          Chi tiết các đơn hàng mới nhất và trạng thái thanh toán.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {ordersList.length === 0 ? (
          <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
            Không có đơn hàng nào gần đây
          </div>
        ) : (
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
              {ordersList.map((order) => (
                <TableRow key={order.id} className='hover:bg-muted/30 transition-colors'>
                  <TableCell className='font-bold text-slate-800 dark:text-slate-200 max-w-[100px] truncate' title={order.id}>
                    {order.id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className='font-medium text-sm'>{order.customer?.name || 'Khách vãng lai'}</p>
                      <p className='text-muted-foreground text-xs font-mono truncate max-w-[180px]' title={order.customer?.email}>
                        {order.customer?.email || '—'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-xs text-muted-foreground'>{formatDate(order.createdAt)}</TableCell>
                  <TableCell className='text-right font-bold text-slate-900 dark:text-slate-50'>
                    {order.totalAmountFormatted}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
