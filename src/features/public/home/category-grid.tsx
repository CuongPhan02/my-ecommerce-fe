'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '~/lib/utils'

const categories = {
  NAM: [
    { id: 1, title: 'ÁO POLO', image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&q=80&w=600' },
    { id: 2, title: 'ÁO THUN', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600' },
    { id: 3, title: 'QUẦN SHORTS', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=600' },
    { id: 4, title: 'SƠ MI', image: 'https://images.unsplash.com/photo-1596755094514-f87034a264c1?auto=format&fit=crop&q=80&w=600' },
    { id: 5, title: 'QUẦN DÀI', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600' },
    { id: 6, title: 'QUẦN LÓT', image: 'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?auto=format&fit=crop&q=80&w=600' },
  ],
  NU: [
    { id: 7, title: 'ÁO THUN NỮ', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600' },
    { id: 8, title: 'QUẦN SHORTS NỮ', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=600' },
    { id: 9, title: 'VÁY', image: 'https://images.unsplash.com/photo-1539008835279-43d0dfa90983?auto=format&fit=crop&q=80&w=600' },
    { id: 10, title: 'ĐỒ TẬP', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=600' },
    { id: 11, title: 'PHỤ KIỆN', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600' },
    { id: 12, title: 'ÁO KHOÁC', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600' },
  ]
}

const CategoryGrid = () => {
  const [activeTab, setActiveTab] = useState<'NAM' | 'NU'>('NAM')

  return (
    <section className="py-10 bg-white">
      <div className="main-container mx-auto px-4">
        {/* Gender Tabs */}
        <div className="flex gap-2 mb-10">
          <button
            onClick={() => setActiveTab('NAM')}
            className={cn(
              "px-8 py-3 rounded-full font-bold text-sm transition-all",
              activeTab === 'NAM' ? "bg-black text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            )}
          >
            NAM
          </button>
          <button
            onClick={() => setActiveTab('NU')}
            className={cn(
              "px-8 py-3 rounded-full font-bold text-sm transition-all",
              activeTab === 'NU' ? "bg-black text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            )}
          >
            NỮ
          </button>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          <AnimatePresence mode="wait">
            {categories[activeTab].map((cat, index) => (
              <motion.div
                key={`${activeTab}-${cat.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 bg-gradient-to-b from-[#87ceeb] to-white">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-center font-bold text-xs md:text-sm tracking-wider text-gray-800 group-hover:text-primary transition-colors uppercase">
                  {cat.title}
                </h3>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default CategoryGrid
