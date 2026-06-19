'use client'
import { useAuthStore } from '~/store/auth-store'
import { useEffect, useState } from 'react'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react'
import { https, logout } from '~/config/https'
import TopBar from './top-bar'
import { Search, ChevronDown, ShoppingBag, Menu, X } from 'lucide-react'
import ShopDropdown from './shop-dropdown'
import LogoUi from '~/components/shared/logo-ui'
import MobileNavbar from './mobile-navbar'
import { AvatarIcon } from './avatar'
import { Link, useTransitionRouter } from 'next-view-transitions'

import { User, Heart } from 'lucide-react'
import { Menu as DbMenu } from '~/features/admin/menu/types'
import { _menuService } from '~/features/admin/menu/menu.query'
import { useMemo } from 'react'
import { _cartService } from '~/features/public/cart/cart.query'
import { useWishlist } from '~/providers/wishlist-provider'

const Header = ({ initialMenus, logoUrl, logoAlt }: { initialMenus?: DbMenu[]; logoUrl?: string | null; logoAlt?: string | null }) => {
  const [isLogin, setIsLogin] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useTransitionRouter()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

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

  const { data: cartData } = _cartService.useCart({
    enabled: isAuthenticated
  })

  const cartItemsCount = useMemo(() => {
    if (!isAuthenticated || !cartData?.result?.items) return 0
    return cartData.result.items.reduce((total, item) => total + item.quantity, 0)
  }, [isAuthenticated, cartData])

  const { count: wishlistCount } = useWishlist()

  useEffect(() => {
    setIsLogin(isAuthenticated)
  }, [isAuthenticated])

  const [hoveredMegaMenuId, setHoveredMegaMenuId] = useState<string | null>(null)

  useEffect(() => {
    if (hoveredMegaMenuId) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [hoveredMegaMenuId])

  return (
    <>
      <div className='flex flex-col w-full font-heading relative z-[999]'>
        <TopBar />
        <AnimatePresence>
          {hoveredMegaMenuId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='fixed inset-0 top-[65px] md:top-[80px] bg-black/40 z-[998] backdrop-blur-sm pointer-events-none'
            />
          )}
        </AnimatePresence>
        <motion.header
          className={`w-full z-[999] transition-all duration-300 border-b border-neutral-100 ${
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
              <LogoUi logoUrl={logoUrl} logoAlt={logoAlt} />
            </div>

            {/* Desktop Navigation - Centered */}
            <nav className='hidden lg:flex items-center space-x-1 xl:space-x-6 text-[13.5px] xl:text-[14.5px] font-bold tracking-wider'>
              {navigationTree.map((item: any) => (
                <div
                  key={item.id}
                  className={`group h-full flex items-center ${item.isMegaMenu ? '' : 'relative'}`}
                  onMouseEnter={() => {
                    if (item.isMegaMenu) {
                      setHoveredMegaMenuId(item.id)
                    }
                  }}
                  onMouseLeave={() => {
                    if (item.isMegaMenu) {
                      setHoveredMegaMenuId(null)
                    }
                  }}
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
                    <div className='absolute left-0 right-0 w-full top-full invisible group-hover:visible z-[1000] transition-all duration-300 opacity-0 transform translate-y-2 group-hover:translate-y-0 group-hover:opacity-100'>
                      <ShopDropdown config={item.megaMenu} />
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className='flex items-center gap-3 sm:gap-4 md:gap-6 text-[#231f20]'>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className='hover:text-primary transition-colors relative p-1.5 hover:scale-105 duration-200'
                aria-label='Toggle Search'
              >
                {isSearchOpen ? (
                  <X className='w-[22px] h-[22px] md:w-6 md:h-6 stroke-[1.8]' />
                ) : (
                  <Search className='w-[22px] h-[22px] md:w-6 md:h-6 stroke-[1.8]' />
                )}
              </button>

              {isLogin ? (
                <AvatarIcon />
              ) : (
                <Link
                  href='/auth/sign-in'
                  className='hover:text-primary transition-colors relative p-1.5 hover:scale-105 duration-200'
                >
                  <User className='w-[22px] h-[22px] md:w-6 md:h-6 stroke-[1.8]' />
                </Link>
              )}

              <Link
                href='/wishlist'
                className='hover:text-primary transition-colors relative p-1.5 hover:scale-105 duration-200'
              >
                <Heart className='w-[22px] h-[22px] md:w-6 md:h-6 stroke-[1.8]' />
                {wishlistCount > 0 && (
                  <span className='absolute top-1.5 right-1.5 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold scale-90 border border-white'>
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href='/cart'
                className='hover:text-primary transition-colors relative p-1.5 hover:scale-105 duration-200'
              >
                <ShoppingBag className='w-[22px] h-[22px] md:w-6 md:h-6 stroke-[1.8]' />
                <span className='absolute top-1.5 right-1.5 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold scale-90 border border-white'>
                  {cartItemsCount}
                </span>
              </Link>

              <button
                className='lg:hidden hover:text-primary p-1.5 hover:scale-105 duration-200'
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className='w-6 h-6 stroke-[1.8]' />
              </button>
            </div>
          </div>

          {/* Search slide down container */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className='overflow-hidden bg-[#FBF8F3] border-t border-neutral-200/45'
              >
                <div className='container-layout px-4 md:px-8 py-3 md:py-4 flex items-center justify-center'>
                  <form
                    onSubmit={handleSearchSubmit}
                    className='relative w-full max-w-xl flex items-center'
                  >
                    <input
                      type='text'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder='Tìm kiếm sản phẩm...'
                      className='w-full bg-white border border-neutral-200 rounded-full py-2 px-5 pr-12 text-xs outline-none focus:border-black transition-all font-medium placeholder-neutral-400 text-neutral-900 shadow-sm'
                      autoFocus
                    />
                    <button
                      type='submit'
                      className='absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#231f20] hover:bg-black text-white rounded-full flex items-center justify-center transition-colors shadow-sm cursor-pointer'
                    >
                      <Search className='w-3.5 h-3.5' />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        <MobileNavbar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
          navLinks={navigationTree}
          logoUrl={logoUrl}
          logoAlt={logoAlt}
        />
      </div>
    </>
  )
}

export default Header
