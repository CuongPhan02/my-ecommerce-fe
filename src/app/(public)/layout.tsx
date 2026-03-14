import React from 'react'
import Footer from '~/components/layouts/public-layout/footer'
import Header from '~/components/layouts/public-layout/header/header'

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='w-full h-fit flex-1'>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
