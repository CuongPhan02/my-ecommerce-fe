import React from 'react'
import Footer from '~/components/layouts/public-layout/footer'
import Header from '~/components/layouts/public-layout/header/header'
import ComingSoonWrapper from '~/components/shared/coming-soon-wrapper'
import { API_BASE_URL } from '~/constants'

// Đặt biến này thành true để hiển thị giao diện Coming Soon cho người dùng
// Đặt thành false để hiển thị đầy đủ giao diện trang chủ/công khai hiện tại
const isComingSoon = false

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let initialMenus = []
  try {
    const res = await fetch(`${API_BASE_URL}/navigate/tree`, {
      next: { revalidate: 300 }, // Cache 5 phút để có tốc độ phản hồi tối ưu
    })
    if (res.ok) {
      const data = await res.json()
      initialMenus = data?.result || []
    }
  } catch (error) {
    console.error('Failed to fetch navigation tree on server:', error)
  }

  return (
    <ComingSoonWrapper isEnabled={isComingSoon}>
      <div className='flex flex-col min-h-screen'>
        <Header initialMenus={initialMenus} />
        <main className='w-full h-fit flex-1'>{children}</main>
        <Footer />
      </div>
    </ComingSoonWrapper>
  )
}
