'use client'
import React, { useState, useEffect } from 'react'
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
import { AUTH_QUERY } from '~/features/public/auth/auth.query'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Loader2 } from 'lucide-react'

export function UserProfile() {
  const queryClient = useQueryClient()
  const { data: profileRes, isLoading: isProfileLoading } = AUTH_QUERY.useMe()
  const updateProfileMutation = AUTH_QUERY.useUpdateProfile(queryClient)
  const changePasswordMutation = AUTH_QUERY.useChangePassword()

  const user = profileRes?.result

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    avatarUrl: ''
  })

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        avatarUrl: user.avatarUrl || ''
      })
    }
  }, [user])

  const handleUpdateProfile = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        name: profileData.name,
        phone: profileData.phone,
        avatarUrl: profileData.avatarUrl || undefined
      })
      toast.success('Cập nhật hồ sơ thành công!')
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Cập nhật thất bại')
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Mật khẩu mới không khớp!')
    }
    if (passwordData.newPassword.length < 6) {
      return toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!')
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      toast.success('Đổi mật khẩu thành công!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Đổi mật khẩu thất bại')
    }
  }

  if (isProfileLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Đang tải hồ sơ...</p>
      </div>
    )
  }

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
                <AvatarImage src={profileData.avatarUrl} alt='Avatar' />
                <AvatarFallback className='text-2xl'>
                  {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 flex-1">
                <Label htmlFor='avatarUrl' className="text-xs">URL Ảnh đại diện</Label>
                <Input 
                  id='avatarUrl' 
                  placeholder="https://..." 
                  value={profileData.avatarUrl}
                  onChange={(e) => setProfileData(prev => ({ ...prev, avatarUrl: e.target.value }))}
                />
              </div>
            </div>
            
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='fullName'>Họ và tên</Label>
                <Input 
                  id='fullName' 
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Địa chỉ Email</Label>
                <Input id='email' type='email' value={user?.email} disabled />
                <p className='text-[0.8rem] text-muted-foreground'>Email này được dùng để đăng nhập và không thể thay đổi.</p>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='phone'>Số điện thoại</Label>
                <Input 
                  id='phone' 
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleUpdateProfile}
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Lưu thay đổi
            </Button>
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
              <Input 
                id='currentPassword' 
                type='password' 
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='newPassword'>Mật khẩu mới</Label>
              <Input 
                id='newPassword' 
                type='password' 
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Xác nhận mật khẩu mới</Label>
              <Input 
                id='confirmPassword' 
                type='password' 
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant='secondary'
              onClick={handleChangePassword}
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Cập nhật mật khẩu
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
