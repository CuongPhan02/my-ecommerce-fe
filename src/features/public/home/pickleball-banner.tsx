'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import Link from 'next/link'

const PickleballBanner = () => {
  return (
    <section className="py-10 bg-white">
      <div className="main-container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative h-[400px] md:h-[600px] rounded-[40px] overflow-hidden group"
        >
          <Image
            src="https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?auto=format&fit=crop&q=80&w=1500"
            alt="Pickleball Collection"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
          
          <div className="absolute inset-0 p-8 md:p-20 flex flex-col items-center justify-center text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tight"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
            >
              PICKLEBALL
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/collections/pickleball"
                className="bg-white text-black px-12 py-4 rounded-full font-bold text-lg hover:bg-primary hover:text-white transition-all shadow-xl"
              >
                MUA NGAY
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PickleballBanner
