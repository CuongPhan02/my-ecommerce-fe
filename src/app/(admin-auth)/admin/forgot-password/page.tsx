'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  forgotPasswordSchema,
  ForgotPasswordSchemaType,
} from '~/features/public/auth/auth.validate'
import { Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import { SETTING_AUTH } from '~/constants'
import { AUTH_QUERY } from '~/features/public/auth/auth.query'

const AdminForgotPassword = () => {
  const router = useRouter()
  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
      urlRedirect: SETTING_AUTH.URL_REDIRECT,
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  const {
    mutate: forgotPassword,
    isPending,
    isSuccess,
  } = AUTH_QUERY.useForgotPassword()

  const onSubmit = (data: ForgotPasswordSchemaType) => {
    forgotPassword(data, {
      onSuccess: () => {
        toast.success('Liên kết đặt lại mật khẩu đã được gửi đến email quản trị')
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || 'Gửi liên kết đặt lại mật khẩu thất bại',
        )
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

        <div className='space-y-2 mb-8 text-center'>
          <h3 className='text-md font-bold uppercase tracking-widest text-[#231f20]'>
            Khôi phục mật khẩu admin
          </h3>
          <p className='text-xs text-neutral-500 font-medium'>
            Nhập email quản trị để nhận liên kết khôi phục
          </p>
        </div>

        {isSuccess ? (
          <div className='space-y-6'>
            <div className='p-4 bg-[#FAF6F0] border border-[#5c4e43]/30 text-[#5c4e43] rounded-sm text-xs font-medium leading-relaxed'>
              Kiểm tra hộp thư email của bạn để lấy liên kết khôi phục mật khẩu.
            </div>
            <Button
              variant='outline'
              className='w-full py-6 rounded-none font-bold text-xs uppercase tracking-widest border-neutral-200 hover:bg-neutral-50 bg-white text-neutral-700 h-11'
              onClick={() => router.push('/admin/login')}
            >
              Quay lại đăng nhập
            </Button>
          </div>
        ) : (
          <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className='text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 block'>
                Địa chỉ email quản trị
              </label>
              <Input
                id='email'
                placeholder='admin@example.com'
                type='email'
                {...register('email')}
                errorMessage={errors.email?.message}
                className='rounded-none border-neutral-200 bg-white focus:bg-white focus:border-[#231f20] transition-colors font-medium text-sm py-5'
              />
            </div>

            <Button 
              className='w-full py-6 bg-[#231f20] hover:bg-[#5c4e43] text-white rounded-none font-bold text-xs uppercase tracking-widest transition-colors shadow-none' 
              type='submit' 
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                'Gửi liên kết khôi phục'
              )}
            </Button>

            <div className='text-center mt-6'>
              <Link
                href='/admin/login'
                className='inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-[#231f20] transition-colors'
              >
                <ArrowLeft className='w-4 h-4 mr-2' />
                Quay lại Đăng nhập
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default AdminForgotPassword
