'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import ProductGallery from '~/features/public/product/product-gallery'
import ProductInfo from '~/features/public/product/product-info'
import ProductReviews from '~/features/public/product/product-reviews'
import ProductCard from '~/components/ui/core/product-card'
import { ChevronRight, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { _productService } from '~/features/public/product/product.query'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { data: productData, isLoading, isError } = _productService.useProductDetail(id as string)
  const product = productData?.result

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-2xl font-bold uppercase tracking-tight">Không tìm thấy sản phẩm</h2>
        <Link href="/shop" className="bg-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs">
          Quay lại cửa hàng
        </Link>
      </div>
    )
  }

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
              <Link href="/shop" className="hover:text-black transition-colors">{product.category?.name || 'Cửa hàng'}</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-400">{product.name}</span>
           </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="main-container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery product={product} />
          </div>

          {/* Info */}
          <div className="lg:col-span-5">
            <ProductInfo product={product} />
          </div>
        </div>
      </div>

      {/* Product Description */}
      <section className="py-24 border-t border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black uppercase tracking-tight mb-10">MÔ TẢ SẢN PHẨM</h2>
          <div className="space-y-6 text-gray-600 font-medium leading-loose text-lg">
             <p className="font-black text-black text-xl italic mb-8">
               {product.summary || product.name}
             </p>
             <div 
               className="prose max-w-none prose-neutral"
               dangerouslySetInnerHTML={{ __html: product.description || '' }}
             />
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
      <ProductReviews product={product} />

      {/* Suggested Products - For now keep as is or implement if there's an API */}
      {/* <section className="py-24 bg-white">
        <div className="main-container mx-auto px-4">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-12">GỢI Ý SẢN PHẨM</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {suggestedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section> */}
    </div>
  )
}
