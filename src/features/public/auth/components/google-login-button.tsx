'use client'

import { useGoogleLogin } from '@react-oauth/google'
import { useQueryClient } from '@tanstack/react-query'
import { AUTH_QUERY } from '../auth.query'
import { toast } from 'react-toastify'
import { setAccessToken } from '~/config/https'
import { useAuthStore } from '~/store/auth-store'
import { useRouter } from 'next/navigation'
import { SETTING_AUTH } from '~/constants'
import IconGoogle from '~/components/ui/icon/icon-google'

export default function GoogleLoginButton() {
  const queryClient = useQueryClient()
  const { login } = useAuthStore()
  const router = useRouter()

  const { mutate: loginWithGoogle, isPending } =
    AUTH_QUERY.useLoginWithGoogle(queryClient)

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      loginWithGoogle(
        {
          code: codeResponse.code,
          urlRedirect: SETTING_AUTH.URL_REDIRECT,
          isMobile: false,
        },
        {
          onSuccess: (data) => {
            toast.success('Login success')
            setAccessToken(data.result.accessToken)
            login(data.result.user)
            const role = data.result.user.role
            document.cookie = `isLoggedIn=true; path=/; max-age=31536000`
            document.cookie = `userRole=${role}; path=/; max-age=31536000`
            if (
              role === 'ADMIN' ||
              role === 'SUPER_ADMIN' ||
              role === 'STAFF'
            ) {
              router.push('/admin/dashboard')
            } else {
              router.push('/')
            }
            router.refresh()
          },
          onError: (error: any) => {
            console.log(error, '====>')
            toast.error(error.response?.data?.message || 'Login failed')
          },
        },
      )
    },
    flow: 'auth-code',
    onError: (errorResponse) => {
      console.log(errorResponse)
      toast.error('Google Login Failed')
    },
  })

  return (
    <div className='w-full flex justify-center'>
      <button
        className='flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors w-full'
        type='button'
        onClick={() => googleLogin()}
        disabled={isPending}
      >
        <IconGoogle />
        <span className='text-sm font-medium'>Google</span>
      </button>
    </div>
  )
}
