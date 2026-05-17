'use client'
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import { Button } from '~/components/ui/core/button'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/core/avatar'

export function UserProfile() {
  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Hồ sơ cá nhân</h1>
        <p className='text-muted-foreground'>
          Quản lý thông tin cá nhân và bảo mật tài khoản của bạn.
        </p>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin tài khoản</CardTitle>
            <CardDescription>
              Cập nhật thông tin cá nhân để hiển thị trên hệ thống.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='flex items-center gap-6'>
              <Avatar className='h-20 w-20'>
                <AvatarImage src='/avatars/shadcn.jpg' alt='Avatar' />
                <AvatarFallback className='text-2xl'>AD</AvatarFallback>
              </Avatar>
              <Button variant='outline'>Đổi ảnh đại diện</Button>
            </div>
            
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='fullName'>Họ và tên</Label>
                <Input id='fullName' defaultValue='Admin' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Địa chỉ Email</Label>
                <Input id='email' type='email' defaultValue='admin@ecommerce.com' disabled />
                <p className='text-[0.8rem] text-muted-foreground'>Email này được dùng để đăng nhập và không thể thay đổi.</p>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='phone'>Số điện thoại</Label>
                <Input id='phone' defaultValue='+84 123 456 789' />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Lưu thay đổi</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Đổi mật khẩu</CardTitle>
            <CardDescription>
              Cập nhật mật khẩu để bảo vệ tài khoản của bạn.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='currentPassword'>Mật khẩu hiện tại</Label>
              <Input id='currentPassword' type='password' />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='newPassword'>Mật khẩu mới</Label>
              <Input id='newPassword' type='password' />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Xác nhận mật khẩu mới</Label>
              <Input id='confirmPassword' type='password' />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant='secondary'>Cập nhật mật khẩu</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
