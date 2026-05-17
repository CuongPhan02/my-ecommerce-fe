'use client'
import { useAuthStore } from '~/store/auth-store'
import { useEffect, useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'motion/react'
import { https, logout } from '~/config/https'
import TopBar from './top-bar'
import { Search, ChevronDown, ShoppingBag, Menu, X } from 'lucide-react'
import ShopDropdown from './shop-dropdown'
import LogoUi from '~/components/shared/logo-ui'
import MobileNavbar from './mobile-navbar'
import { AvatarDropdown } from './avatar'
import { Link } from 'next-view-transitions'

import PromotionBar from './promotion-bar'
import { User, Search as SearchIcon } from 'lucide-react'
import { _menuService } from '~/features/admin/menu/menu.query'
import { useMemo } from 'react'

const Header = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 40)
  })

  const { data: menusData } = _menuService.useMenus()

  const navigationTree = useMemo(() => {
    return menusData?.result || []
  }, [menusData])

  const { isAuthenticated, logout: logoutStore } = useAuthStore()
  const handleLogout = async () => {
    try {
      await https.post('/auth/logout')
    } catch (error) {
      console.log(error)
    } finally {
      logoutStore()
      logout()
    }
  }

  useEffect(() => {
    setIsLogin(isAuthenticated)
  }, [isAuthenticated])

  return (
    <>
      <div className='flex flex-col w-full font-heading relative z-50'>
        <TopBar />
        <motion.header
          className={`w-full z-50 transition-all duration-300 border-b border-neutral-100 ${
            isScrolled
              ? 'fixed top-0 left-0 bg-white/95 backdrop-blur-md shadow-sm'
              : 'relative bg-white'
          }`}
          initial={{ y: 0 }}
          animate={{ y: isScrolled ? [-80, 0] : 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className='flex items-center justify-between container-layout px-4 md:px-8 h-[65px] md:h-[80px]'>
            {/* Logo Section */}
            <div className='flex-shrink-0'>
              <LogoUi />
            </div>

            {/* Desktop Navigation - Centered */}
            <nav className='hidden lg:flex items-center space-x-1 xl:space-x-4 text-[13px] xl:text-[14px] font-bold tracking-tight'>
              {navigationTree.map((item) => (
                <div key={item.id} className='group h-full flex items-center relative'>
                  <Link
                    href={item.href || '#'}
                    className={`hover:text-primary transition-colors uppercase px-3 py-4 flex items-center gap-1 ${
                      item.label.toLowerCase() === 'sale' ? 'text-red-500' : 'text-[#231f20]'
                    }`}
                  >
                    {item.label}
                    {item.label.toLowerCase() === 'sale' && (
                      <span className='text-[8px] bg-red-500 text-white px-1 rounded-sm ml-0.5 leading-tight'>
                        -50%
                      </span>
                    )}
                  </Link>
                  {item.isMegaMenu && (
                    <div className='absolute left-0 top-full w-screen -ml-[40vw] invisible group-hover:visible z-50 transition-all duration-300 opacity-0 group-hover:opacity-100'>
                      <ShopDropdown config={item.megaMenu} />
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className='flex items-center gap-2 md:gap-5'>
              {/* Search Bar */}
              <div className='hidden md:flex items-center relative group max-w-[200px] xl:max-w-[280px]'>
                <input
                  type='text'
                  placeholder='Tìm kiếm...'
                  className='w-full bg-[#f1f1f1] rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all'
                />
                <SearchIcon className='w-4 h-4 absolute right-4 text-neutral-500 group-hover:text-primary transition-colors cursor-pointer' />
              </div>

              <div className='flex items-center gap-4 text-[#231f20]'>
                <button className='hover:text-primary transition-colors relative'>
                  <User className='w-6 h-6' />
                </button>

                <button className='hover:text-primary transition-colors relative'>
                  <ShoppingBag className='w-6 h-6' />
                  <span className='absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold'>
                    0
                  </span>
                </button>

                <button
                  className='lg:hidden hover:text-primary p-1'
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className='w-7 h-7' />
                </button>
              </div>
            </div>
          </div>
        </motion.header>
        <PromotionBar />

        <MobileNavbar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
          navLinks={navigationTree}
        />
      </div>
    </>
  )
}

export default Header
