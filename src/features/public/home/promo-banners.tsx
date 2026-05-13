'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import Link from 'next/link'

const PromoBanners = () => {
  return (
    <section className="py-10 bg-white">
      <div className="main-container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Men Promo */}
          <motion.div
            whileHover={{ y: -5 }}
            className="relative h-[300px] md:h-[500px] rounded-3xl overflow-hidden group"
          >
            <Image
              src="https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=1000"
              alt="Men Promo"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/60 via-transparent to-transparent" />
            
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-white">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">ĐỒ NAM</h2>
              <Link
                href="/products/men"
                className="inline-flex items-center justify-center w-fit bg-white text-black px-8 py-3 rounded-full font-bold text-sm hover:bg-primary hover:text-white transition-all"
              >
                MUA NGAY
              </Link>
            </div>

            {/* Logo Placeholder */}
            <div className="absolute top-8 right-8">
               <span className="text-white font-bold text-xl italic opacity-80">cool<br/>mate</span>
            </div>
          </motion.div>

          {/* Women Promo */}
          <motion.div
            whileHover={{ y: -5 }}
            className="relative h-[300px] md:h-[500px] rounded-3xl overflow-hidden group"
          >
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000"
              alt="Women Promo"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/50 via-transparent to-transparent" />
            
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-white">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">ĐỒ NỮ</h2>
              <Link
                href="/products/women"
                className="inline-flex items-center justify-center w-fit bg-white text-black px-8 py-3 rounded-full font-bold text-sm hover:bg-primary hover:text-white transition-all"
              >
                MUA NGAY
              </Link>
            </div>

            {/* Logo Placeholder */}
            <div className="absolute top-8 right-8">
               <span className="text-white font-bold text-xl italic opacity-80">cool<br/>mate</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default PromoBanners
