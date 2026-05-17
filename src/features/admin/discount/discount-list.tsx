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
import { Search, Filter, Edit, Plus, Trash2 } from 'lucide-react'

const discounts = [
  {
    id: 'DISC-001',
    code: 'SUMMER24',
    description: 'Giảm 20% cho đơn hàng mùa hè',
    discountType: 'Phần trăm (%)',
    value: '20%',
    status: 'Đang diễn ra',
    usage: '150 / 500',
    validUntil: '2024-08-31',
  },
  {
    id: 'DISC-002',
    code: 'FREESHIP100K',
    description: 'Miễn phí vận chuyển cho đơn từ 100k',
    discountType: 'Vận chuyển',
    value: 'Miễn phí',
    status: 'Đang diễn ra',
    usage: '89 / Không giới hạn',
    validUntil: '2024-12-31',
  },
  {
    id: 'DISC-003',
    code: 'WELCOME50',
    description: 'Giảm 50k cho khách hàng mới',
    discountType: 'Số tiền cố định',
    value: '50.000đ',
    status: 'Đã kết thúc',
    usage: '1000 / 1000',
    validUntil: '2023-12-31',
  },
]

export function DiscountList() {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>Khuyến mãi / Voucher</h1>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Tạo mã mới
        </Button>
      </div>

      <Card>
        <CardHeader className='pb-3'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div>
              <CardTitle>Danh sách mã giảm giá</CardTitle>
              <CardDescription>
                Quản lý các chương trình khuyến mãi và mã voucher của cửa hàng.
              </CardDescription>
            </div>
            <div className='flex items-center gap-2'>
              <div className='relative'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  placeholder='Tìm mã voucher...'
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
                <TableHead>Mã (Code)</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Mức giảm</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Đã dùng</TableHead>
                <TableHead>Hạn sử dụng</TableHead>
                <TableHead className='text-right'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell className='font-bold text-primary'>{discount.code}</TableCell>
                  <TableCell className='max-w-[200px] truncate'>{discount.description}</TableCell>
                  <TableCell>{discount.discountType}</TableCell>
                  <TableCell className='font-medium'>{discount.value}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        discount.status === 'Đang diễn ra'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {discount.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{discount.usage}</TableCell>
                  <TableCell>{discount.validUntil}</TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button variant='ghost' size='icon' title='Chỉnh sửa'>
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button variant='ghost' size='icon' title='Xoá' className='text-red-500 hover:text-red-700 hover:bg-red-50'>
                        <Trash2 className='h-4 w-4' />
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
