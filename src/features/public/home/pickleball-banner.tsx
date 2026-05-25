'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import Link from 'next/link'
import { ArrowRight, Trophy } from 'lucide-react'

const PickleballBanner = () => {
  return (
    <section className="py-12 bg-white">
      <div className="main-container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-[450px] md:h-[650px] rounded-[48px] overflow-hidden group shadow-xl hover:shadow-2xl transition-shadow duration-500"
        >
          <Image
            src="https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?auto=format&fit=crop&q=80&w=1500"
            alt="Pickleball Collection"
            fill
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
          {/* Multi-layer overlay for visual clarity and dark premium mood */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/15 transition-colors duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
          
          {/* Floating Premium Badge */}
          <div className="absolute top-8 left-8 z-10">
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full uppercase tracking-widest shadow-inner">
              <Trophy className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              BỘ SƯU TẬP ĐỘC QUYỀN 2026
            </span>
          </div>

          <div className="absolute inset-0 p-8 md:p-20 flex flex-col items-center justify-center text-center z-10">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-white/80 text-xs md:text-sm font-black uppercase tracking-[0.3em] mb-4"
            >
              EXCLUSIVE SPORTING GEAR
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl md:text-9xl font-black text-white mb-8 tracking-tighter uppercase leading-none"
              style={{ textShadow: '0 8px 30px rgba(0,0,0,0.5)' }}
            >
              PICKLEBALL
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Link
                href="/shop?search=Pickleball"
                className="inline-flex items-center justify-center gap-2.5 bg-white text-black px-12 py-4 rounded-full font-black text-base hover:bg-primary hover:text-white transition-all duration-300 shadow-2xl group/btn"
              >
                MUA NGAY
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PickleballBanner
