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
import { User, Heart } from 'lucide-react'
import { Menu as DbMenu } from '~/features/admin/menu/types'
import { _menuService } from '~/features/admin/menu/menu.query'
import { useMemo } from 'react'

const Header = ({ initialMenus }: { initialMenus?: DbMenu[] }) => {
  const [isLogin, setIsLogin] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 40)
  })

  const { data: menusData } = _menuService.useMenus(
    initialMenus
      ? { success: true, message: 'Success', result: initialMenus }
      : undefined,
  )

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
            <nav className='hidden lg:flex items-center space-x-1 xl:space-x-6 text-[13.5px] xl:text-[14.5px] font-bold tracking-wider'>
              {navigationTree.map((item: any) => (
                <div
                  key={item.id}
                  className={`group h-full flex items-center ${item.isMegaMenu ? '' : 'relative'}`}
                >
                  <Link
                    href={item.href || '#'}
                    className={`hover:text-primary transition-all duration-300 uppercase px-4 py-6 flex items-center gap-1 relative after:content-[""] after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[3px] after:bg-primary after:transform after:scale-x-0 after:transition-transform after:duration-300 group-hover:after:scale-x-100 ${
                      item.label.toLowerCase() === 'sale'
                        ? 'text-red-500 font-extrabold'
                        : 'text-[#231f20]'
                    }`}
                  >
                    {item.label}
                    {item.label.toLowerCase() === 'sale' && (
                      <span className='text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded-md ml-1 animate-pulse leading-none'>
                        -50%
                      </span>
                    )}
                  </Link>
                  {item.isMegaMenu && (
                    <div className='absolute left-0 right-0 w-full top-full invisible group-hover:visible z-50 transition-all duration-300 opacity-0 transform translate-y-2 group-hover:translate-y-0 group-hover:opacity-100'>
                      <ShopDropdown config={item.megaMenu} />
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className='flex items-center gap-3 sm:gap-4 md:gap-6 text-[#231f20]'>
              <button className='hover:text-primary transition-colors relative p-1.5 hover:scale-105 duration-200'>
                <User className='w-[22px] h-[22px] md:w-6 md:h-6 stroke-[1.8]' />
              </button>

              <button className='hover:text-primary transition-colors relative p-1.5 hover:scale-105 duration-200'>
                <Heart className='w-[22px] h-[22px] md:w-6 md:h-6 stroke-[1.8]' />
              </button>

              <button className='hover:text-primary transition-colors relative p-1.5 hover:scale-105 duration-200'>
                <ShoppingBag className='w-[22px] h-[22px] md:w-6 md:h-6 stroke-[1.8]' />
                <span className='absolute top-1.5 right-1.5 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold scale-90 border border-white'>
                  0
                </span>
              </button>

              <button
                className='lg:hidden hover:text-primary p-1.5 hover:scale-105 duration-200'
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className='w-6 h-6 stroke-[1.8]' />
              </button>
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
