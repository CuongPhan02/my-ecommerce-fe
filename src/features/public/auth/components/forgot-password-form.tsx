'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  forgotPasswordSchema,
  ForgotPasswordSchemaType,
} from '../auth.validate'
import { Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import { SETTING_AUTH } from '~/constants'
import { AUTH_QUERY } from '../auth.query'
import BannerImage from './banner-image'

const ForgotPasswordForm = () => {
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
        toast.success('Reset link sent to your email')
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || 'Failed to send reset link',
        )
      },
    })
  }

  return (
    <div className='grid lg:grid-cols-2 gap-4 min-h-[80vh]'>
      <BannerImage />
      <div className='w-full flex items-center justify-center p-8 sm:p-12 md:p-24 bg-background-light dark:bg-background-dark'>
        <div className='w-full max-w-xl'>
          <div className='space-y-2 mb-10'>
            <h1 className='text-3xl font-semibold tracking-tight'>
              Forgot Password
            </h1>
            <p className='text-slate-500 dark:text-gray-400 font-light'>
              Enter your email to receive a password reset link
            </p>
          </div>

          {isSuccess ? (
            <div className='space-y-6'>
              <div className='p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg'>
                Check your email for the password reset link.
              </div>
              <Button
                variant='outline'
                className='w-full'
                onClick={() => router.push('/auth/sign-in')}
              >
                Back to Sign in
              </Button>
            </div>
          ) : (
            <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
              <div className='space-y-4'>
                <Input
                  label='Email address'
                  id='email'
                  placeholder='Email address'
                  type='email'
                  {...register('email')}
                  errorMessage={errors.email?.message}
                />
              </div>

              <Button className='w-full' type='submit' disabled={isPending}>
                {isPending ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  'Send Reset Link'
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
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordForm
