'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import BannerImage from './banner-image'
import Link from 'next/link'
import { Button } from '~/components/ui/core/button'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { AUTH_QUERY } from '../auth.query'

const VerifyEmailForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  const isVerifierCalled = useRef(false)

  const {
    mutate: verifyEmail,
    isPending,
    isSuccess,
    isError,
    error,
  } = AUTH_QUERY.useVerifyEmail()

  useEffect(() => {
    if (email && token && !isVerifierCalled.current) {
      isVerifierCalled.current = true
      verifyEmail({ email, token })
    }
  }, [email, token, verifyEmail])

  return (
    <div className='grid lg:grid-cols-2 gap-4 min-h-[80vh]'>
      <BannerImage />
      <div className='w-full flex items-center justify-center p-8 sm:p-12 md:p-24 bg-background-light dark:bg-background-dark'>
        <div className='w-full max-w-xl text-center space-y-6'>
          <div className='space-y-2 mb-10'>
            <h1 className='text-3xl font-semibold tracking-tight'>
              Xác thực Email
            </h1>
            <p className='text-slate-500 dark:text-gray-400 font-light'>
              Vui lòng chờ trong khi chúng tôi xác thực địa chỉ email của bạn.
            </p>
          </div>

          <div className='flex flex-col items-center justify-center gap-4 min-h-[150px]'>
            {isPending && (
              <div className='flex flex-col items-center gap-2'>
                <Loader2 className='w-10 h-10 animate-spin text-primary' />
                <p className='text-sm text-muted-foreground'>Đang xác thực...</p>
              </div>
            )}

            {isSuccess && (
              <div className='flex flex-col items-center gap-2'>
                <CheckCircle2 className='w-12 h-12 text-green-500' />
                <p className='text-lg font-medium text-green-600'>
                  Xác thực email thành công!
                </p>
                <p className='text-sm text-slate-500'>
                  Bây giờ bạn có thể đăng nhập vào tài khoản của mình.
                </p>
              </div>
            )}

            {isError && (
              <div className='flex flex-col items-center gap-2'>
                <XCircle className='w-12 h-12 text-red-500' />
                <p className='text-lg font-medium text-red-600'>
                  Xác thực thất bại
                </p>
                <p className='text-sm text-slate-500'>
                  {(error as any)?.response?.data?.message ||
                    'Mã xác thực không hợp lệ hoặc đã hết hạn.'}
                </p>
              </div>
            )}

            {!email || !token
              ? !isPending &&
                !isSuccess &&
                !isError && (
                  <p className='text-red-500'>
                    Liên kết xác thực không hợp lệ. Thiếu email hoặc mã xác thực.
                  </p>
                )
              : null}
          </div>

          <div className='pt-6'>
            <Link href='/auth/sign-in'>
              <Button className='w-full max-w-xs' variant='default'>
                Quay lại Đăng nhập
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailForm
