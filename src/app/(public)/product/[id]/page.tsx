'use client'

import React from 'react'
import ProductGallery from '~/features/public/product/product-gallery'
import ProductInfo from '~/features/public/product/product-info'
import ProductReviews from '~/features/public/product/product-reviews'
import ProductCard from '~/components/ui/core/product-card'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const mockProduct = {
  id: 1,
  name: 'Áo Nỉ chui đầu Lifewear',
  price: 199000,
  originalPrice: 399000,
  images: [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1556821957-3a189f7609a7?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1556821957-6060c500644d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1556821957-08034c28108c?auto=format&fit=crop&q=80&w=800',
  ],
  colors: [
    { name: 'Đen', hex: '#000000' },
    { name: 'Xám', hex: '#808080' },
    { name: 'Xanh Navy', hex: '#000080' },
  ],
  sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL']
}

const suggestedProducts = [
  {
    id: 101,
    name: 'Quần Shorts Nam K...',
    price: 343000,
    originalPrice: 429000,
    rating: 4.8,
    reviews: 120,
    badge: 'NEW',
    colors: [{ name: 'Beige', hex: '#f5f5dc', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=600' }]
  },
  {
    id: 102,
    name: 'Quần Shorts Thể Thao',
    price: 119000,
    originalPrice: 149000,
    rating: 4.9,
    reviews: 450,
    badge: 'BÁN CHẠY',
    colors: [{ name: 'Black', hex: '#000000', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=600' }]
  },
  {
    id: 103,
    name: 'Quần Bơi Splice...',
    price: 249000,
    rating: 4.7,
    reviews: 85,
    colors: [{ name: 'Navy', hex: '#000080', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=600' }]
  },
  {
    id: 104,
    name: 'Áo Polo Pique Cotton',
    price: 299000,
    rating: 4.8,
    reviews: 890,
    badge: 'BÁN CHẠY',
    colors: [{ name: 'Gray', hex: '#808080', image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&q=80&w=600' }]
  }
]

export default function ProductDetailPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs & Back */}
      <div className="main-container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
           <Link href="/shop" className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest group">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
             Quay lại cửa hàng
           </Link>
           <div className="flex items-center gap-2 text-[10px] text-gray-300 font-bold uppercase tracking-widest">
              <Link href="/" className="hover:text-black transition-colors">Trang chủ</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/shop" className="hover:text-black transition-colors">Đồ Nam</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-400">Áo Sweater</span>
           </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="main-container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={mockProduct.images} />
          </div>

          {/* Info */}
          <div className="lg:col-span-5">
            <ProductInfo {...mockProduct} />
          </div>
        </div>
      </div>

      {/* Product Description */}
      <section className="py-24 border-t border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black uppercase tracking-tight mb-10">MÔ TẢ SẢN PHẨM</h2>
          <div className="space-y-6 text-gray-600 font-medium leading-loose text-lg">
             <p className="font-black text-black text-xl italic mb-8">
               Áo Nỉ Chui Đầu Lifewear – Sự Ấm Áp Nhỏ Gọn Cho Ngày Se Lạnh
             </p>
             <p>
               Được định hình bởi sự tối giản và tính ứng dụng cao, <span className="font-bold text-black">Áo Nỉ Chui Đầu Lifewear</span> là lựa chọn thông minh để làm mới tủ đồ thu đông. 
               Điểm nhấn của chiếc áo nam này nằm ở chất liệu nỉ chân cua độc đáo, là sự pha trộn giữa 60% Cotton mang lại sự mềm mại và 40% Polyester giúp áo bền form, hạn chế xù lông.
             </p>
             <div className="relative pt-8 group cursor-pointer">
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                <button className="bg-gray-100 px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-lg group-hover:scale-105 transform">
                  XEM THÊM CHI TIẾT
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ProductReviews />

      {/* Suggested Products */}
      <section className="py-24 bg-white">
        <div className="main-container mx-auto px-4">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-12">GỢI Ý SẢN PHẨM</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {suggestedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
