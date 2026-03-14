'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema, ResetPasswordSchemaType } from '../auth.validate'
import { Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import { AUTH_QUERY } from '../auth.query'
import BannerImage from './banner-image'
import { useEffect } from 'react'

const ResetPasswordForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email || '',
      password: '',
      token: token || '',
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form

  useEffect(() => {
    if (email) setValue('email', email)
    if (token) setValue('token', token)
  }, [email, token, setValue])

  const {
    mutate: resetPassword,
    isPending,
    isSuccess,
  } = AUTH_QUERY.useResetPassword()

  const onSubmit = (data: ResetPasswordSchemaType) => {
    resetPassword(data, {
      onSuccess: () => {
        toast.success('Password reset successfully')
        router.push('/auth/sign-in')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to reset password')
      },
    })
  }

  if (!email || !token) {
    return (
      <div className='grid lg:grid-cols-2 gap-4 min-h-[80vh]'>
        <BannerImage />
        <div className='w-full flex items-center justify-center p-8 sm:p-12 md:p-24 bg-background-light dark:bg-background-dark'>
          <div className='w-full max-w-xl text-center'>
            <h1 className='text-2xl font-semibold mb-4 text-red-500'>
              Invalid Link
            </h1>
            <p className='mb-6'>
              The validation link is missing required information.
            </p>
            <Link href='/auth/sign-in'>
              <Button variant='outline'>Back to Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='grid lg:grid-cols-2 gap-4 min-h-[80vh]'>
      <BannerImage />
      <div className='w-full flex items-center justify-center p-8 sm:p-12 md:p-24 bg-background-light dark:bg-background-dark'>
        <div className='w-full max-w-xl'>
          <div className='space-y-2 mb-10'>
            <h1 className='text-3xl font-semibold tracking-tight'>
              Reset Password
            </h1>
            <p className='text-slate-500 dark:text-gray-400 font-light'>
              Enter your new password below
            </p>
          </div>

          <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
            <input type='hidden' {...register('email')} />
            <input type='hidden' {...register('token')} />

            <div className='space-y-4'>
              <Input
                label='New Password'
                id='password'
                placeholder='New Password'
                type='password'
                {...register('password')}
                errorMessage={errors.password?.message}
              />
            </div>

            <Button className='w-full' type='submit' disabled={isPending}>
              {isPending ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                'Reset Password'
              )}
            </Button>

            <div className='text-center'>
              <Link
                href='/auth/sign-in'
                className='inline-flex items-center text-sm text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors'
              >
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back to Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordForm
