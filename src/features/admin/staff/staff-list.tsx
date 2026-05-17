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
import { Search, Filter, Edit, UserPlus, Shield } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/core/avatar'

const staffs = [
  {
    id: 'STF-001',
    name: 'Nguyễn Quản Trị',
    email: 'admin@ecommerce.com',
    role: 'Admin',
    status: 'Đang hoạt động',
    avatar: 'AD',
    lastLogin: '2023-10-25 08:30',
  },
  {
    id: 'STF-002',
    name: 'Trần Bán Hàng',
    email: 'sales@ecommerce.com',
    role: 'Sales',
    status: 'Đang hoạt động',
    avatar: 'SA',
    lastLogin: '2023-10-25 09:15',
  },
  {
    id: 'STF-003',
    name: 'Lê Nội Dung',
    email: 'content@ecommerce.com',
    role: 'Editor',
    status: 'Tạm khóa',
    avatar: 'ED',
    lastLogin: '2023-10-10 14:00',
  },
  {
    id: 'STF-004',
    name: 'Phạm Kho Vận',
    email: 'warehouse@ecommerce.com',
    role: 'Inventory',
    status: 'Đang hoạt động',
    avatar: 'IN',
    lastLogin: '2023-10-24 16:45',
  },
]

export function StaffList() {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>Quản lý nhân viên</h1>
        <Button>
          <UserPlus className='mr-2 h-4 w-4' />
          Thêm nhân viên
        </Button>
      </div>

      <Card>
        <CardHeader className='pb-3'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div>
              <CardTitle>Danh sách nhân viên</CardTitle>
              <CardDescription>
                Quản lý tài khoản và phân quyền truy cập hệ thống.
              </CardDescription>
            </div>
            <div className='flex items-center gap-2'>
              <div className='relative'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  placeholder='Tìm tên, email...'
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
                <TableHead>Nhân viên</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Đăng nhập lần cuối</TableHead>
                <TableHead className='text-right'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffs.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-9 w-9'>
                        <AvatarFallback className='bg-primary/10 text-primary'>
                          {staff.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col'>
                        <span className='font-medium'>{staff.name}</span>
                        <span className='text-muted-foreground text-xs'>
                          {staff.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1.5'>
                      {staff.role === 'Admin' && <Shield className='h-3.5 w-3.5 text-blue-500' />}
                      <span>{staff.role}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={staff.status === 'Đang hoạt động' ? 'default' : 'secondary'}
                    >
                      {staff.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{staff.lastLogin}</TableCell>
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
