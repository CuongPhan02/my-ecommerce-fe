'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import Link from 'next/link'
import { ArrowRight, Flame, Sparkles } from 'lucide-react'

const PromoBanners = () => {
  return (
    <section className="py-12 bg-white">
      <div className="main-container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Men Promo */}
          <motion.div
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative h-[350px] md:h-[520px] rounded-[32px] overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-500"
          >
            <Image
              src="https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=1000"
              alt="Men Promo"
              fill
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            {/* Rich multi-layer overlay for outstanding depth and legibility */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            {/* Top Badge & Logo */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-inner">
                <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                BÁN CHẠY NHẤT
              </span>
              <div className="bg-black/25 backdrop-blur-sm px-3.5 py-1.5 rounded-2xl border border-white/10 shadow-sm">
                <span className="text-white font-black text-sm italic tracking-tight uppercase">cool<span className="text-primary font-medium">mate</span></span>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-white z-10">
              <span className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2 block">
                BỘ SƯU TẬP CHO NAM 2026
              </span>
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase leading-none drop-shadow-md">
                ĐỒ NAM
              </h2>
              
              <Link
                href="/shop?search=Nam"
                className="inline-flex items-center justify-center gap-2 w-fit bg-white text-black px-8 py-3.5 rounded-full font-black text-sm hover:bg-primary hover:text-white transition-all duration-300 shadow-xl group/btn"
              >
                MUA NGAY
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </motion.div>

          {/* Women Promo */}
          <motion.div
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative h-[350px] md:h-[520px] rounded-[32px] overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-500"
          >
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000"
              alt="Women Promo"
              fill
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            {/* Rich multi-layer overlay for outstanding depth and legibility */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            {/* Top Badge & Logo */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                MỚI NHẤT
              </span>
              <div className="bg-black/25 backdrop-blur-sm px-3.5 py-1.5 rounded-2xl border border-white/10 shadow-sm">
                <span className="text-white font-black text-sm italic tracking-tight uppercase">cool<span className="text-primary font-medium">mate</span></span>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-white z-10">
              <span className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2 block">
                BỘ SƯU TẬP CHO NỮ 2026
              </span>
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase leading-none drop-shadow-md">
                ĐỒ NỮ
              </h2>
              
              <Link
                href="/shop?search=Nữ"
                className="inline-flex items-center justify-center gap-2 w-fit bg-white text-black px-8 py-3.5 rounded-full font-black text-sm hover:bg-primary hover:text-white transition-all duration-300 shadow-xl group/btn"
              >
                MUA NGAY
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default PromoBanners
