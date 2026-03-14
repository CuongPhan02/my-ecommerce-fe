'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence, Variants } from 'motion/react'
import { X, ChevronRight, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import LogoUi from '~/components/shared/logo-ui'

interface MobileNavbarProps {
  isOpen: boolean
  onClose: () => void
  isAuthenticated: boolean
  handleLogout: () => Promise<void>
}

const MobileNavbar = ({
  isOpen,
  onClose,
  isAuthenticated,
  handleLogout,
}: MobileNavbarProps) => {
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
        stiffness: 300,
        damping: 30,
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  }

  const navLinks = [
    { name: 'Shop', href: '/shop' },
    { name: 'Best Sellers', href: '/best-sellers' },
    { name: 'Collections', href: '/collections' },
    { name: 'About', href: '/about' },
    { name: 'Help', href: '/help' },
  ]

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
            className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[190]'
          />

          {/* Menu Panel */}
          <motion.div
            variants={menuVariants}
            initial='closed'
            animate='open'
            exit='closed'
            className='fixed top-0 right-0 h-full w-[85%] max-w-[400px] bg-black text-white z-[200] shadow-2xl flex flex-col border-l border-neutral-800'
          >
            {/* Header */}
            <div className='flex items-center justify-between p-6 border-b border-neutral-800'>
              <LogoUi />
              <button
                onClick={onClose}
                className='p-2 hover:bg-neutral-800 rounded-full transition-colors'
                aria-label='Close menu'
              >
                <X className='w-6 h-6' />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className='flex-1 px-6 py-8 overflow-y-auto'>
              <div className='flex flex-col space-y-2'>
                {navLinks.map((link) => (
                  <motion.div key={link.name} variants={itemVariants}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className='flex items-center justify-between group py-4 text-xl font-bold uppercase tracking-widest text-neutral-200 hover:text-white transition-colors'
                    >
                      <span>{link.name}</span>
                      <ChevronRight className='w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all' />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions (Mobile only features) */}
              <motion.div
                variants={itemVariants}
                className='mt-10 pt-10 border-t border-neutral-800'
              >
                <h3 className='text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 mb-6'>
                  Account & Support
                </h3>
                <div className='flex flex-col space-y-6'>
                  {isAuthenticated ? (
                    <>
                      <Link
                        href='/profile'
                        onClick={onClose}
                        className='text-lg font-bold uppercase hover:text-neutral-400'
                      >
                        Profile
                      </Link>
                      <button
                        onClick={async () => {
                          await handleLogout()
                          onClose()
                        }}
                        className='text-lg font-bold uppercase text-neutral-400 hover:text-white text-left'
                      >
                        Log out
                      </button>
                    </>
                  ) : (
                    <Link
                      href='/auth/sign-in'
                      onClick={onClose}
                      className='text-lg font-bold uppercase hover:text-neutral-400'
                    >
                      Log In
                    </Link>
                  )}
                  <button className='flex items-center gap-2 text-lg font-bold uppercase hover:text-neutral-300'>
                    VN / VND <ChevronRight className='w-4 h-4 rotate-90' />
                  </button>
                </div>
              </motion.div>
            </nav>

            {/* Footer Action */}
            <div className='p-6 border-t border-neutral-800 bg-neutral-900/50'>
              <Link
                href='/cart'
                onClick={onClose}
                className='w-full bg-white text-black py-4 flex items-center justify-center gap-3 font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors'
              >
                <ShoppingBag className='w-5 h-5' />
                View Cart (0)
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileNavbar
