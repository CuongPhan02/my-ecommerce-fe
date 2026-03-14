'use client'

import Link from 'next/link'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { SETTING_AUTH } from '~/constants'
import { useQueryClient } from '@tanstack/react-query'
import { signUpSchema, SignUpSchemaType } from '../auth.validate'
import { AUTH_QUERY } from '../auth.query'
import BannerImage from './banner-image'
import GoogleLoginButton from './google-login-button'

const SignUpForm = () => {
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      phone: '',
      address: '',
      urlRedirect: SETTING_AUTH.URL_REDIRECT,
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form

  const queryClient = useQueryClient()

  const {
    mutate: registerMutation,
    isPending,
    isSuccess,
  } = AUTH_QUERY.useRegister(queryClient)

  const onSubmit = (data: SignUpSchemaType) => {
    registerMutation(data, {
      onSuccess: () => {
        toast.success('Register success')
        reset()
      },
      onError: (error: any) => {
        console.log(error, '====>')
        toast.error(error.response?.data?.message || 'Register failed')
      },
    })
  }

  return (
    <div className='grid lg:grid-cols-2 gap-4'>
      <BannerImage />
      <div className='w-full flex items-center justify-center p-8 sm:p-12 md:p-24 bg-background-light dark:bg-background-dark'>
        <div className='w-full max-w-xl'>
          <div className='space-y-2 mb-10'>
            <h1 className='text-3xl font-semibold tracking-tight'>
              Welcome back
            </h1>
            <p className='text-slate-500 dark:text-gray-400 font-light'>
              Please sign up to your account
            </p>
          </div>

          <div className='mb-2'>
            {isSuccess && (
              <p className='text-green-500'>
                Register success .Please check your email to verify your account
                before login
              </p>
            )}
          </div>
          <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <Input
                  label='Email address'
                  id='email'
                  placeholder='Email address'
                  type='email'
                  {...register('email')}
                  errorMessage={errors.email?.message}
                />
                <Input
                  label='Password'
                  id='password'
                  placeholder='Password'
                  type='password'
                  {...register('password')}
                  errorMessage={errors.password?.message}
                />
                <Input
                  label='Name'
                  id='name'
                  placeholder='Name'
                  type='text'
                  {...register('name')}
                  errorMessage={errors.name?.message}
                />
                <Input
                  label='Phone'
                  id='phone'
                  placeholder='Phone'
                  type='text'
                  {...register('phone')}
                  errorMessage={errors.phone?.message}
                />
              </div>

              <Input
                label='Address'
                id='address'
                placeholder='Address'
                type='text'
                {...register('address')}
                errorMessage={errors.address?.message}
              />
            </div>
            <Button className='w-full' type='submit' disabled={isPending}>
              {isPending ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                'Sign up'
              )}
            </Button>
            <div className='relative py-4'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-slate-200 dark:border-white/10'></div>
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background-light dark:bg-background-dark px-4 text-slate-500 dark:text-gray-500 font-medium tracking-widest'>
                  or continue with
                </span>
              </div>
            </div>
            <div className='w-full'>
              <GoogleLoginButton />
            </div>
            <p className='text-center text-sm text-slate-500 dark:text-gray-400 mt-8'>
              Already have an account?
              <Link
                className='font-semibold text-slate-900 dark:text-white hover:underline ml-1'
                href='/auth/sign-in'
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUpForm
