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
import { Search, Filter, Edit, PackagePlus } from 'lucide-react'

const inventoryItems = [
  {
    id: 'INV-1001',
    productName: 'Áo thun cotton nam',
    sku: 'TS-COT-M-BLK',
    category: 'Quần áo',
    quantity: 150,
    status: 'Còn hàng',
    lastUpdated: '2023-10-25 10:00',
  },
  {
    id: 'INV-1002',
    productName: 'Giày thể thao nữ',
    sku: 'SNK-W-38-WHT',
    category: 'Giày dép',
    quantity: 12,
    status: 'Sắp hết',
    lastUpdated: '2023-10-24 15:30',
  },
  {
    id: 'INV-1003',
    productName: 'Tai nghe Bluetooth 5.0',
    sku: 'EAR-BT-BLK',
    category: 'Điện tử',
    quantity: 0,
    status: 'Hết hàng',
    lastUpdated: '2023-10-20 09:15',
  },
  {
    id: 'INV-1004',
    productName: 'Balo laptop 15.6 inch',
    sku: 'BP-15-GRY',
    category: 'Phụ kiện',
    quantity: 45,
    status: 'Còn hàng',
    lastUpdated: '2023-10-22 14:20',
  },
]

export function InventoryList() {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>Quản lý kho</h1>
        <Button>
          <PackagePlus className='mr-2 h-4 w-4' />
          Nhập hàng
        </Button>
      </div>

      <Card>
        <CardHeader className='pb-3'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div>
              <CardTitle>Tồn kho sản phẩm</CardTitle>
              <CardDescription>
                Theo dõi số lượng và trạng thái của các sản phẩm trong kho.
              </CardDescription>
            </div>
            <div className='flex items-center gap-2'>
              <div className='relative'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  placeholder='Tìm sản phẩm, SKU...'
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
                <TableHead>Mã phiếu</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead className='text-right'>Số lượng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Cập nhật cuối</TableHead>
                <TableHead className='text-right'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='font-medium'>{item.id}</TableCell>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className='text-right font-medium'>{item.quantity}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === 'Còn hàng'
                          ? 'default'
                          : item.status === 'Sắp hết'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.lastUpdated}</TableCell>
                  <TableCell className='text-right'>
                    <Button variant='ghost' size='icon' title='Chỉnh sửa'>
                      <Edit className='h-4 w-4' />
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
