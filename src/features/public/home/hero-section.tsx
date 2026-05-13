'use client'

import React from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const marqueeItems = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=400',
    alt: 'Blue Shirt',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400',
    alt: 'Red Shoes',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=400',
    alt: 'Jeans',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=400',
    alt: 'Hoodie',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400',
    alt: 'Leather Jacket',
  },
]

import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

const HeroSection = () => {
  return (
    <div className='relative w-full h-[60vh] md:h-[85vh] overflow-hidden bg-[#f4f4f4]'>
      {/* Background Image */}
      <div className='absolute inset-0 z-0'>
        <Image
          src='https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=2000'
          alt='Fitness Community'
          fill
          priority
          className='object-cover object-center'
        />
        {/* Subtle overlay for readability if needed, but the image is bright */}
        <div className='absolute inset-0 bg-black/10' />
      </div>

      {/* Content Overlay */}
      <div className='relative z-10 h-full flex flex-col justify-center px-4 md:px-20 lg:px-32'>
        <div className='max-w-4xl space-y-6 md:space-y-8'>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className='text-3xl md:text-5xl lg:text-7xl font-black text-white leading-tight uppercase tracking-tight'
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
          >
            MORE THAN A BRAND — <br />
            WE ARE A COMMUNITY IN MOTION
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-white text-sm md:text-lg lg:text-xl font-medium max-w-2xl leading-relaxed drop-shadow-sm'
          >
            Coolmate đồng hành cùng hàng nghìn cá nhân, câu lạc bộ và tổ chức để lan toả lối sống tích cực, năng động và bền bỉ mỗi ngày
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              href='/auth/sign-up'
              className='inline-flex items-center gap-3 bg-white text-[#231f20] px-6 md:px-10 py-3 md:py-4 rounded-full font-bold text-sm md:text-base hover:bg-primary hover:text-white transition-all group'
            >
              ĐĂNG KÝ NGAY
              <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className='absolute inset-y-0 left-4 md:left-8 flex items-center z-20'>
        <button className='w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors'>
          <ChevronLeft className='w-8 h-8' />
        </button>
      </div>
      <div className='absolute inset-y-0 right-4 md:right-8 flex items-center z-20'>
        <button className='w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors'>
          <ChevronRight className='w-8 h-8' />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === 1 ? 'bg-white w-6' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSection
