'use client'
import React from 'react'
import { motion, Variants } from 'motion/react'
import { ShoppingBag, Package } from 'lucide-react'

interface LoadingDataProps {
  message?: string
  submessage?: string
  size?: 'small' | 'medium' | 'large'
  fullscreen?: boolean
}

interface SizeConfig {
  icon: string
  card: string
  title: string
  sparkle: string
  sparkleRadius: number
  dot: string
  progress: string
}

const LoadingData: React.FC<LoadingDataProps> = ({
  message = 'Loading',
  submessage = 'Please wait a moment...',
  size = 'medium',
  fullscreen = true,
}) => {
  const sizeConfig: Record<'small' | 'medium' | 'large', SizeConfig> = {
    small: {
      icon: 'w-12 h-12',
      card: 'p-8',
      title: 'text-lg',
      sparkle: 'w-3 h-3',
      sparkleRadius: 50,
      dot: 'w-2 h-2',
      progress: 'w-40',
    },
    medium: {
      icon: 'w-20 h-20',
      card: 'p-12',
      title: 'text-2xl',
      sparkle: 'w-4 h-4',
      sparkleRadius: 80,
      dot: 'w-3 h-3',
      progress: 'w-64',
    },
    large: {
      icon: 'w-28 h-28',
      card: 'p-16',
      title: 'text-3xl',
      sparkle: 'w-5 h-5',
      sparkleRadius: 100,
      dot: 'w-4 h-4',
      progress: 'w-80',
    },
  }

  const config = sizeConfig[size]

  const bagVariants: Variants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: [0.8, 1.1, 1],
      opacity: 1,
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatDelay: 0.5,
      },
    },
  }

  const dotVariants: Variants = {
    animate: (i: number) => ({
      y: [0, -10, 0],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        delay: i * 0.15,
        ease: 'easeInOut',
      },
    }),
  }

  const shimmerVariants: Variants = {
    animate: {
      x: ['-100%', '100%'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  const containerClass = fullscreen
    ? 'flex items-center justify-center min-h-screen '
    : 'flex items-center justify-center p-8 my-20'

  return (
    <div className={containerClass}>
      <div className='relative'>
        <div
          className={`bg-muted rounded-2xl shadow-2xl ${config.card} relative overflow-hidden`}
        >
          <motion.div
            variants={shimmerVariants}
            animate='animate'
            className='absolute inset-0 bg-gradient-to-r from-transparent to-transparent'
            style={{ width: '50%' }}
          />

          <motion.div
            variants={bagVariants}
            initial='initial'
            animate='animate'
            className='flex justify-center mb-8'
          >
            <div className='relative'>
              <ShoppingBag
                className={`${config.icon} text-primary`}
                strokeWidth={1.5}
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className='absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-30'
              />
            </div>
          </motion.div>

          <div className='text-center mb-6'>
            <h3 className={`${config.title} font-bold  mb-2 text-sm`}>
              {message}
            </h3>
            <p className='text-gray-400 text-sm'>{submessage}</p>
          </div>

          <div className='flex justify-center items-center space-x-2'>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                custom={i}
                variants={dotVariants}
                animate='animate'
                className={`${config.dot} bg-primary rounded-full`}
              />
            ))}
          </div>

          <div
            className={`mt-8 ${config.progress} h-1.5 bg-gray-200 rounded-full overflow-hidden mx-auto`}
          >
            <motion.div
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className='h-full w-1/2  bg-primary'
            />
          </div>
        </div>

        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className='absolute -right-6 -top-6'
        >
          <Package className='w-12 h-12 text-orange-500 opacity-30' />
        </motion.div>

        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
          className='absolute -left-6 -bottom-6'
        >
          <Package className='w-10 h-10 text-orange-600 opacity-30' />
        </motion.div>
      </div>
    </div>
  )
}

export default LoadingData
