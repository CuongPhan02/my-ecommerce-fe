'use client'

import React from 'react'
import { motion } from 'motion/react'
import ProductCard from '~/components/ui/core/product-card'
import Image from 'next/image'
import Link from 'next/link'

interface ProductSectionProps {
  title?: string
  banner?: {
    image: string
    title: string
    cta: string
    link: string
  }
  products: any[]
}

const ProductSection = ({ title, banner, products }: ProductSectionProps) => {
  return (
    <section className="py-10 bg-white">
      <div className="main-container mx-auto px-4">
        {/* Title for Basics Section */}
        {title && (
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">{title}</h2>
            <Link href="#" className="text-sm font-bold text-gray-500 hover:text-black transition-colors underline underline-offset-4">
              Xem tất cả
            </Link>
          </div>
        )}

        {/* Banner for Excool Section */}
        {banner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative h-[250px] md:h-[450px] rounded-[30px] overflow-hidden mb-10 group"
          >
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
            <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-center">
              <h2 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight">
                {banner.title.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h2>
              <Link
                href={banner.link}
                className="bg-white text-black px-10 py-3 rounded-full font-bold text-sm w-fit hover:bg-primary hover:text-white transition-all shadow-lg"
              >
                {banner.cta}
              </Link>
            </div>
          </motion.div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductSection
