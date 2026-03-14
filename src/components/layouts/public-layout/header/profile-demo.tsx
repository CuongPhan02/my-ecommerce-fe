'use client'

import React, { useEffect, useState } from 'react'
import { ApiResponse } from '~/@types/api'
import { https } from '~/config/https'

interface User {
  id: string
  name: string
  email: string
  role: string
}

const ProfileDemo = () => {
  const [data, setData] = useState<User | null>(null)

  useEffect(() => {
    getAth()
  }, [])
  const getAth = async () => {
    try {
      const res = await https.get<ApiResponse<User>>('/auth/me')
      if (res.data.success) {
        setData(res.data.result)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='relative min-h-screen flex flex-col fashion-bg mt-10'>
      <main className='flex-1 flex flex-col items-center justify-center px-6 text-center z-10 text-white'>
        <div className='max-w-2xl w-full space-y-10'>
          <div className='space-y-6'>
            <h1 className='sans-minimal text-4xl md:text-6xl font-light tracking-tight text-white'>
              {data?.name}
            </h1>
            <div className='mb-8 flex justify-center items-center gap-4'>
              <div className='h-[1px] w-12 bg-white/40'></div>
              <span className='sans-minimal text-[10px] uppercase tracking-[0.5em] text-white/80'>
                {/* {data?.name} */}
              </span>
              <div className='h-[1px] w-12 bg-white/40'></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfileDemo
