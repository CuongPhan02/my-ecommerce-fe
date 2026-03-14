'use client'
import { Button } from '~/components/ui/core/button'
import { useAuthStore } from '~/store/auth-store'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'motion/react'
import Link from 'next/link'
import { https, logout } from '~/config/https'
import TopBar from './top-bar'
import {
  Search,
  HelpCircle,
  ChevronDown,
  ShoppingBag,
  Menu,
  X,
} from 'lucide-react'
import ShopDropdown from './shop-dropdown'
import LogoUi from '~/components/shared/logo-ui'
import MobileNavbar from './mobile-navbar'

const Header = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 40)
  })
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
      <div className='flex flex-col w-full font-heading relative'>
        <TopBar />
        {isScrolled && <div className='h-[65px] w-full' />}
        <motion.header
          className={`w-full z-[100] transition-colors duration-300 border-b border-neutral-800 ${
            isScrolled
              ? 'fixed top-0 left-0 bg-black/95 backdrop-blur-md shadow-xl'
              : 'relative bg-black'
          }`}
          initial={{ y: 0 }}
          animate={{ y: isScrolled ? [-80, 0] : 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className='flex items-center justify-between container-layout px-4 md:px-8'>
            {/* Logo Section & Mobile Toggle */}
            <div className='flex items-center gap-4 md:gap-10'>
              <LogoUi />

              {/* Desktop Navigation */}
              <nav className='hidden md:flex items-center space-x-5 text-lg font-bold tracking-wide'>
                <div className='group h-full flex items-center'>
                  <Link
                    href='/shop'
                    className='hover:text-neutral-300 transition-colors uppercase px-2 py-4'
                  >
                    Shop
                  </Link>

                  {/* Mega Menu Dropdown */}
                  <div className='absolute left-0 top-full w-full invisible group-hover:visible z-50 transition-all duration-300 opacity-0 group-hover:opacity-100'>
                    <ShopDropdown />
                  </div>
                </div>
                <Link
                  href='/best-sellers'
                  className='hover:text-neutral-300 transition-colors uppercase'
                >
                  Best Sellers
                </Link>
                <Link
                  href='/about'
                  className='hover:text-neutral-300 transition-colors uppercase'
                >
                  About
                </Link>
              </nav>
            </div>

            {/* Right Actions */}
            <div className='flex items-center gap-6 text-lg font-bold tracking-wide'>
              <button aria-label='Search' className='hover:text-neutral-300'>
                <Search className='w-5 h-5' />
              </button>

              <Link
                href='/help'
                className='hidden md:block hover:text-neutral-300 uppercase'
              >
                Help
              </Link>

              <button className='hidden md:flex items-center gap-1 hover:text-neutral-300 uppercase'>
                VN / VND <ChevronDown className='w-4 h-4' />
              </button>

              {/* Auth & Cart */}
              <div className='flex items-center gap-4'>
                <button className='flex items-center gap-1 hover:text-neutral-300 uppercase'>
                  <ShoppingBag className='w-6 h-6 md:hidden' />
                  <span className='hidden md:inline'>Cart (0)</span>
                </button>
                <div className='hidden md:contents'>
                  {isLogin ? (
                    <div className='flex items-center gap-4 text-lg font-bold tracking-wide'>
                      <Link
                        href='/profile'
                        className='hover:text-neutral-300 uppercase'
                      >
                        Profile
                      </Link>
                      <Button
                        onClick={handleLogout}
                        className='text-white hover:text-neutral-300 text-sm tracking-wide py-1 uppercase font-bold h-auto bg-transparent hover:bg-transparent'
                      >
                        Log out
                      </Button>
                    </div>
                  ) : (
                    <Link
                      href='/auth/sign-in'
                      className='hover:text-neutral-300 uppercase'
                    >
                      Log In
                    </Link>
                  )}
                </div>
              </div>

              <button
                className='md:hidden hover:text-neutral-300 p-2 rounded-full border border-neutral-600 bg-neutral-800'
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className='w-6 h-6' />
              </button>
            </div>
          </div>
        </motion.header>

        <MobileNavbar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
        />
      </div>
    </>
  )
}

export default Header
