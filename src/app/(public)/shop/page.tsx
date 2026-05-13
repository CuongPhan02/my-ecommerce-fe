'use client'

import React from 'react'
import FilterSidebar from '~/features/public/shop/filter-sidebar'
import ProductCard from '~/components/ui/core/product-card'
import { motion } from 'motion/react'
import { ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '~/lib/utils'

const shopProducts = [
  {
    id: 1,
    name: 'Áo Tshirt nam Regular Fit 100% Cotton 180gsm',
    price: 199000,
    rating: 4.8,
    reviews: 1240,
    badge: 'NEW',
    colors: [
      {
        name: 'Black',
        hex: '#000000',
        image:
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600',
      },
      {
        name: 'White',
        hex: '#ffffff',
        image:
          'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=600',
      },
      {
        name: 'Beige',
        hex: '#f5f5dc',
        image:
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600',
      },
    ],
  },
  {
    id: 2,
    name: 'Áo thun thể thao thoáng khí Essentials',
    price: 189000,
    rating: 4.9,
    reviews: 562,
    badge: 'NEW',
    colors: [
      {
        name: 'Blue',
        hex: '#0000ff',
        image:
          'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600',
      },
      {
        name: 'Gray',
        hex: '#808080',
        image:
          'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600',
      },
    ],
  },
  {
    id: 3,
    name: 'Áo Khoác Nam có mũ Daily Wear',
    price: 499000,
    rating: 4.7,
    reviews: 845,
    badge: 'BÁN CHẠY',
    colors: [
      {
        name: 'White',
        hex: '#ffffff',
        image:
          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600',
      },
      {
        name: 'Black',
        hex: '#000000',
        image:
          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600',
      },
    ],
  },
  {
    id: 4,
    name: 'Áo Polo Nam Thể Thao Promax-S1',
    price: 239000,
    rating: 4.6,
    reviews: 2100,
    badge: 'BÁN CHẠY',
    colors: [
      {
        name: 'Gray',
        hex: '#808080',
        image:
          'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&q=80&w=600',
      },
      {
        name: 'Green',
        hex: '#008000',
        image:
          'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&q=80&w=600',
      },
    ],
  },
  {
    id: 5,
    name: 'Quần Shorts Nam thể thao 5"',
    price: 159000,
    rating: 4.8,
    reviews: 342,
    colors: [
      {
        name: 'Black',
        hex: '#000000',
        image:
          'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=600',
      },
    ],
  },
  {
    id: 6,
    name: 'Tất Pickleball Nam Cổ Trung',
    price: 89000,
    rating: 4.9,
    reviews: 156,
    badge: 'NEW',
    colors: [
      {
        name: 'White',
        hex: '#ffffff',
        image:
          'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=600',
      },
    ],
  },
  {
    id: 7,
    name: 'Áo in C&S Kỷ yếu trên bản - Em làm duyên',
    price: 199000,
    rating: 4.9,
    reviews: 89,
    colors: [
      {
        name: 'Black',
        hex: '#000000',
        image:
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600',
      },
    ],
  },
  {
    id: 8,
    name: 'Biker Shorts nữ chạy bộ 8inch',
    price: 249000,
    originalPrice: 499000,
    rating: 4.8,
    reviews: 234,
    badge: 'OUTLET',
    colors: [
      {
        name: 'Black',
        hex: '#000000',
        image:
          'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600',
      },
    ],
  },
]

const RecentlyViewed = () => {
  return (
    <section className='py-20 border-t mt-20'>
      <div className='flex items-center justify-between mb-10'>
        <h2 className='text-2xl md:text-3xl font-black uppercase tracking-tight'>
          SẢN PHẨM BẠN ĐÃ XEM
        </h2>
        <div className='flex gap-2'>
          <button className='w-10 h-10 rounded-full border flex items-center justify-center hover:bg-black hover:text-white transition-all'>
            <ArrowLeft className='w-5 h-5' />
          </button>
          <button className='w-10 h-10 rounded-full border flex items-center justify-center hover:bg-black hover:text-white transition-all'>
            <ArrowRight className='w-5 h-5' />
          </button>
        </div>
      </div>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
        {shopProducts.slice(4, 8).map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  )
}

export default function ShopPage() {
  return (
    <div className='bg-white min-h-screen pt-10'>
      <div className='main-container mx-auto px-4'>
        <div className='flex flex-col lg:flex-row gap-12'>
          {/* Sidebar */}
          <FilterSidebar />

          {/* Main Content */}
          <main className='flex-1'>
            {/* Top Bar */}
            <div className='flex items-center justify-end mb-8'>
              <div className='flex items-center gap-4'>
                <span className='text-xs font-bold text-gray-400 uppercase tracking-widest'>
                  Phân loại
                </span>
                <button className='flex items-center gap-4 bg-gray-100 px-6 py-2.5 rounded-full text-sm font-bold group hover:bg-gray-200 transition-all'>
                  Mặc định
                  <ChevronDown className='w-4 h-4 text-gray-400 group-hover:text-black transition-colors' />
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12'>
              {shopProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ProductCard {...product} />
                </motion.div>
              ))}
            </div>

            {/* Pagination Placeholder */}
            <div className='flex justify-center mt-20 gap-2'>
              {[1, 2, 3, '...', 12].map((p, idx) => (
                <button
                  key={idx}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                    p === 1
                      ? 'bg-black text-white'
                      : 'hover:bg-gray-100 text-gray-400 hover:text-black',
                  )}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Recently Viewed */}
            <RecentlyViewed />
          </main>
        </div>
      </div>
    </div>
  )
}
