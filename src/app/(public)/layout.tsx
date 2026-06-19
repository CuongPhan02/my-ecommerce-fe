import React from 'react'
import type { Metadata } from 'next'
import Footer from '~/components/layouts/public-layout/footer'
import Header from '~/components/layouts/public-layout/header/header'
import ComingSoonWrapper from '~/components/shared/coming-soon-wrapper'
import AIChatbot from '~/components/shared/ai-chatbot'
import { API_BASE_URL } from '~/constants'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(`${API_BASE_URL}/settings/seo-meta`, {
      next: { revalidate: 300 }, // Cache 5 phút
    })
    if (res.ok) {
      const data = await res.json()
      const seo = data?.result
      if (seo) {
        return {
          title: seo.metaTitle || seo.title || 'Lune Shop',
          description: seo.metaDescription || seo.description || 'Lune Shop',
          keywords: seo.metaKeywords || seo.keywords || '',
          openGraph: seo.ogImage
            ? {
                images: [{ url: seo.ogImage }],
              }
            : undefined,
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch SEO metadata on server:', error)
  }

  return {
    title: 'Lune Shop - Thời Trang Nữ Cao Cấp, Thanh Lịch & Hiện Đại',
    description: 'Cửa hàng thời trang Lune Shop',
  }
}

// Đặt biến này thành true để hiển thị giao diện Coming Soon cho người dùng
// Đặt thành false để hiển thị đầy đủ giao diện trang chủ/công khai hiện tại
const isComingSoon = false

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let initialMenus = []
  let logoUrl = null
  let logoAlt = null

  try {
    const [menusRes, logoRes] = await Promise.all([
      fetch(`${API_BASE_URL}/navigate/tree`, {
        next: { revalidate: 300 }, // Cache 5 phút để có tốc độ phản hồi tối ưu
      }),
      fetch(`${API_BASE_URL}/settings/logo`, {
        next: { revalidate: 300 }, // Cache 5 phút để có tốc độ phản hồi tối ưu
      }),
    ])

    if (menusRes.ok) {
      const data = await menusRes.json()
      initialMenus = data?.result || []
    }

    if (logoRes.ok) {
      const data = await logoRes.json()
      logoUrl = data?.result?.imageUrl || null
      logoAlt = data?.result?.alt || null
    }
  } catch (error) {
    console.error('Failed to fetch initial page data on server:', error)
  }

  return (
    <ComingSoonWrapper isEnabled={isComingSoon}>
      <div className='flex flex-col min-h-screen relative'>
        <Header
          initialMenus={initialMenus}
          logoUrl={logoUrl}
          logoAlt={logoAlt}
        />
        <main className='w-full h-fit flex-1'>{children}</main>
        <Footer />
        <AIChatbot />
      </div>
    </ComingSoonWrapper>
  )
}
