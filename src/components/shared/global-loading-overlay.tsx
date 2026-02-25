'use client'
import { Loader2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useEffect } from 'react'
import { useUiStore } from '~/store/useUiStore'

const GlobalLoadingOverlay = () => {
  const isLoading = useUiStore((s) => s.isGlobalLoading)

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isLoading])

  if (!isLoading) return null
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className='flex flex-col items-center gap-3 text-white'
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <Loader2 className='h-10 w-10 animate-spin text-white' />
            <span className='text-sm font-medium'>Processing...</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GlobalLoadingOverlay
