'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence, Variants } from 'motion/react'
import {
  X,
  ChevronRight,
  ShoppingBag,
  User,
  LogOut,
  Phone,
  Facebook,
  Instagram,
  Youtube,
  Heart,
  Globe,
} from 'lucide-react'
import Link from 'next/link'
import LogoUi from '~/components/shared/logo-ui'
import { Menu } from '~/features/admin/menu/types'
import { useAuthStore } from '~/store/auth-store'

interface MobileNavbarProps {
  isOpen: boolean
  onClose: () => void
  isAuthenticated: boolean
  handleLogout: () => Promise<void>
  navLinks: Menu[]
  logoUrl?: string | null
  logoAlt?: string | null
}

const MobileNavbar = ({
  isOpen,
  onClose,
  isAuthenticated,
  handleLogout,
  navLinks,
  logoUrl,
  logoAlt,
}: MobileNavbarProps) => {
  const { user } = useAuthStore()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const menuVariants: Variants = {
    closed: {
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 350,
        damping: 38,
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.06,
        delayChildren: 0.12,
      },
    },
  }

  const itemVariants: Variants = {
    closed: { opacity: 0, x: 25, scale: 0.96 },
    open: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='fixed inset-0 bg-zinc-950/40 backdrop-blur-[4px] z-[190]'
          />

          {/* Menu Panel */}
          <motion.div
            variants={menuVariants}
            initial='closed'
            animate='open'
            exit='closed'
            className='fixed top-0 right-0 h-full w-[85%] max-w-[380px] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md text-zinc-900 dark:text-zinc-50 z-[200] shadow-[0_0_50px_rgba(0,0,0,0.12)] flex flex-col border-l border-zinc-100 dark:border-zinc-900'
          >
            {/* Header */}
            <div className='flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-900/80'>
              <LogoUi className='scale-90 origin-left' logoUrl={logoUrl} logoAlt={logoAlt} />
              <button
                onClick={onClose}
                className='p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-full transition-all duration-300 hover:rotate-90'
                aria-label='Close menu'
              >
                <X className='w-5.5 h-5.5 stroke-[2]' />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className='flex-1 px-6 py-6 overflow-y-auto space-y-6'>
              <div className='flex flex-col space-y-1'>
                {navLinks.map((link) => (
                  <motion.div key={link.id} variants={itemVariants}>
                    <Link
                      href={link.href || '#'}
                      onClick={onClose}
                      className='flex items-center justify-between group py-3 px-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/40 text-[15px] font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 hover:text-primary dark:hover:text-primary transition-all duration-300'
                    >
                      <span className='relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 group-hover:after:w-full'>
                        {link.label}
                      </span>
                      <ChevronRight className='w-4 h-4 text-zinc-400 group-hover:text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300' />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions (Mobile only features) */}
              <motion.div
                variants={itemVariants}
                className='pt-6 border-t border-zinc-100 dark:border-zinc-900/80'
              >
                <h3 className='text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mb-4'>
                  Tài khoản & Hỗ trợ
                </h3>

                {isAuthenticated ? (
                  /* Premium User Profile Widget */
                  <div className='p-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-100 dark:border-zinc-900/60 flex items-center justify-between gap-3 shadow-sm'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-cyan-400 flex items-center justify-center text-white font-extrabold text-sm shadow-inner shrink-0'>
                        {user?.name?.slice(0, 2).toUpperCase() || 'U'}
                      </div>
                      <div className='min-w-0'>
                        <p className='text-[11px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider'>
                          Xin chào,
                        </p>
                        <Link
                          href='/profile'
                          onClick={onClose}
                          className='text-sm font-extrabold text-zinc-800 dark:text-zinc-200 hover:text-primary truncate block max-w-[140px]'
                        >
                          {user?.name || 'Thành viên'}
                        </Link>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        await handleLogout()
                        onClose()
                      }}
                      className='p-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-zinc-400 hover:text-red-500 rounded-xl transition-all duration-300'
                      title='Đăng xuất'
                    >
                      <LogOut className='w-5 h-5' />
                    </button>
                  </div>
                ) : (
                  /* Premium Login Promo Card */
                  <div className='p-4 bg-gradient-to-br from-zinc-50 to-zinc-100/60 dark:from-zinc-900/60 dark:to-zinc-900/30 rounded-2xl border border-zinc-100/80 dark:border-zinc-900/60 flex flex-col gap-2.5 shadow-sm'>
                    <p className='text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed'>
                      Đăng nhập để nhận nhiều ưu đãi thành viên và theo dõi đơn
                      hàng dễ dàng.
                    </p>
                    <Link
                      href='/auth/sign-in'
                      onClick={onClose}
                      className='w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-md hover:scale-[1.01]'
                    >
                      <User className='w-4 h-4 stroke-[2]' />
                      Đăng nhập / Đăng ký
                    </Link>
                  </div>
                )}

                {/* Additional Utilities */}
                <div className='mt-4 flex flex-col space-y-1'>
                  <Link
                    href='/wishlist'
                    onClick={onClose}
                    className='flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/40 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:text-primary transition-all duration-300'
                  >
                    <Heart className='w-4.5 h-4.5 stroke-[1.8]' />
                    <span>Sản phẩm yêu thích</span>
                  </Link>

                  <button className='flex items-center justify-between w-full py-2.5 px-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/40 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:text-primary transition-all duration-300'>
                    <div className='flex items-center gap-3'>
                      <Globe className='w-4.5 h-4.5 stroke-[1.8]' />
                      <span>Ngôn ngữ / Tiền tệ</span>
                    </div>
                    <span className='text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest'>
                      VN / VND
                    </span>
                  </button>
                </div>

                {/* Hotline support widget */}
                <div className='mt-6 p-4 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/10 flex items-center gap-3.5'>
                  <div className='w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-md shadow-primary/20 animate-pulse'>
                    <Phone className='w-4.5 h-4.5 stroke-[2]' />
                  </div>
                  <div>
                    <div className='text-[10px] uppercase font-extrabold text-primary/80 tracking-widest'>
                      Hotline hỗ trợ 24/7
                    </div>
                    <div className='text-sm font-extrabold text-zinc-900 dark:text-zinc-100'>
                      1800 6013
                    </div>
                  </div>
                </div>

                {/* Social icons row */}
                <div className='flex items-center justify-center gap-4 mt-6'>
                  <a
                    href='#'
                    className='w-9 h-9 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 flex items-center justify-center text-zinc-500 hover:text-[#1877f2] hover:bg-[#1877f2]/10 hover:border-[#1877f2]/20 transition-all duration-300 shadow-sm'
                  >
                    <Facebook className='w-4.5 h-4.5' />
                  </a>
                  <a
                    href='#'
                    className='w-9 h-9 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 flex items-center justify-center text-zinc-500 hover:text-[#e1306c] hover:bg-[#e1306c]/10 hover:border-[#e1306c]/20 transition-all duration-300 shadow-sm'
                  >
                    <Instagram className='w-4.5 h-4.5' />
                  </a>
                  <a
                    href='#'
                    className='w-9 h-9 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 flex items-center justify-center text-zinc-500 hover:text-[#ff0000] hover:bg-[#ff0000]/10 hover:border-[#ff0000]/20 transition-all duration-300 shadow-sm'
                  >
                    <Youtube className='w-4.5 h-4.5' />
                  </a>
                </div>
              </motion.div>
            </nav>

            {/* Footer Action (Giỏ hàng) */}
            <div className='p-5 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10'>
              <Link
                href='/cart'
                onClick={onClose}
                className='w-full bg-primary hover:bg-primary/95 text-white py-3.5 rounded-xl flex items-center justify-center gap-3 font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-lg shadow-md hover:scale-[1.01] text-sm'
              >
                <div className='relative'>
                  <ShoppingBag className='w-5 h-5 stroke-[2]' />
                  <span className='absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold border border-white'>
                    0
                  </span>
                </div>
                <span>Xem giỏ hàng</span>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileNavbar
