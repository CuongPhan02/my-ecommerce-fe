'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Footer from '~/components/layouts/public-layout/footer'
import Header from '~/components/layouts/public-layout/header/header'
import ComingSoon from '~/components/shared/coming-soon'

// Đặt biến này thành true để hiển thị giao diện Coming Soon cho người dùng
// Đặt thành false để hiển thị đầy đủ giao diện trang chủ/công khai hiện tại
const isComingSoon = false

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const pathname = usePathname()
  const isAuthRoute = pathname?.startsWith('/auth')

  if (isComingSoon && !isAuthRoute) {
    return <ComingSoon />
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='w-full h-fit flex-1'>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout

