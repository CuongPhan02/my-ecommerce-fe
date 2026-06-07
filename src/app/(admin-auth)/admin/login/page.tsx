'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '~/store/auth-store'
import Link from 'next/link'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, SignInSchemaType } from '~/features/public/auth/auth.validate'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { AUTH_QUERY } from '~/features/public/auth/auth.query'
import { useQueryClient } from '@tanstack/react-query'
import { ROLES, isManagementRole } from '~/lib/auth-utils'

const AdminLogin = () => {
  const { login } = useAuthStore()
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  const { mutate: loginMutation, isPending } = AUTH_QUERY.useLogin(queryClient)

  const onSubmit = async (data: SignInSchemaType) => {
    loginMutation(data, {
      onSuccess: (res) => {
        const { accessToken, refreshToken, user } = res.result
        const role = user.role

        if (!isManagementRole(role)) {
          toast.error('Tài khoản này không có quyền truy cập trang quản trị')
          return
        }

        toast.success('Đăng nhập thành công')
        login(user, accessToken, refreshToken)
        router.push('/admin/dashboard')
        router.refresh()
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Đăng nhập thất bại')
      },
    })
  }

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-[#FAF6F0] p-4'>
      <div className='bg-[#FBF8F3] border border-neutral-200 rounded-sm p-8 sm:p-12 shadow-sm max-w-md w-full'>
        <div className='flex flex-col items-center mb-8'>
          <h2 className='text-2xl font-bold uppercase tracking-widest text-[#231f20]'>LUNÉ</h2>
          <p className='text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-1'>Trang quản trị hệ thống</p>
        </div>

        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4'>
            <div>
              <label className='text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 block'>
                Địa chỉ email
              </label>
              <Input
                id='email'
                placeholder='Nhập email quản trị'
                type='email'
                {...register('email')}
                errorMessage={errors.email?.message}
                className='rounded-none border-neutral-200 bg-white focus:bg-white focus:border-[#231f20] transition-colors font-medium text-sm py-5'
              />
            </div>
            <div>
              <label className='text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 block'>
                Mật khẩu
              </label>
              <Input
                id='password'
                placeholder='Nhập mật khẩu'
                type='password'
                {...register('password')}
                errorMessage={errors.password?.message}
                className='rounded-none border-neutral-200 bg-white focus:bg-white focus:border-[#231f20] transition-colors font-medium text-sm py-5'
              />
            </div>
          </div>

          <div className='flex items-center justify-end'>
            <Link
              className='text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-[#231f20] transition-colors'
              href='/admin/forgot-password'
            >
              Quên mật khẩu?
            </Link>
          </div>

          <Button 
            className='w-full py-6 bg-[#231f20] hover:bg-[#5c4e43] text-white rounded-none font-bold text-xs uppercase tracking-widest transition-colors shadow-none' 
            type='submit' 
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              'Đăng nhập hệ thống'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
