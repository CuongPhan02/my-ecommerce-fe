'use client'

import React, { useState, useRef, useMemo } from 'react'
import { useParams } from 'next/navigation'
import ProductGallery from '~/features/public/product/product-gallery'
import ProductInfo from '~/features/public/product/product-info'
import ProductReviews from '~/features/public/product/product-reviews'
import ProductCard from '~/components/ui/core/product-card'
import { ChevronRight, ArrowLeft, Loader2, ChevronDown, Heart } from 'lucide-react'
import Link from 'next/link'
import { _productService } from '~/features/public/product/product.query'
import { shopApi } from '~/features/public/shop/shop.api'
import { useQuery } from '@tanstack/react-query'
import { cn } from '~/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/components/ui/core/carousel'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { data: productData, isLoading, isError } = _productService.useProductDetail(id as string)
  const product = productData?.result

  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'care' | 'reviews'>('description')
  const [isExpanded, setIsExpanded] = useState(false)
  const tabsRef = useRef<HTMLDivElement>(null)

  // Fetch reviews count dynamically
  const { data: reviewsData } = _productService.useProductReviews(product?.id || '', {
    page: 1,
    limit: 1,
  })
  const reviewsCount = reviewsData?.result?.meta?.total ?? 0

  // Fetch related products (featured fallback)
  const { data: relatedProductsResponse } = useQuery({
    queryKey: ['products', 'featured-related', product?.categoryId],
    queryFn: () => shopApi.fetchProducts({ limit: 20 }),
    enabled: !!product?.id
  })

  const allProducts = relatedProductsResponse?.data || []
  
  const featuredProducts = useMemo(() => {
    if (!product) return []
    // Exclude current product and prioritize featured ones
    const featured = allProducts.filter((p) => p.isFeatured && p.id !== product.id)
    const others = allProducts.filter((p) => !p.isFeatured && p.id !== product.id)
    return [...featured, ...others].slice(0, 10)
  }, [allProducts, product])

  const handleReviewsClick = () => {
    setActiveTab('reviews')
    setTimeout(() => {
      tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

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

  const tabs = [
    { id: 'description', title: 'Mô tả sản phẩm' },
    { id: 'details', title: 'Thông tin chi tiết' },
    { id: 'care', title: 'Hướng dẫn bảo quản' },
    { id: 'reviews', title: `Đánh giá (${reviewsCount})` }
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs & Back */}
      <div className="main-container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
           <Link href="/shop" className="flex items-center gap-2 text-[10px] font-black text-neutral-400 hover:text-black transition-colors uppercase tracking-widest group">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
             Quay lại shop
           </Link>
           <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-semibold uppercase tracking-widest">
              <Link href="/" className="hover:text-black transition-colors">Trang chủ</Link>
              <ChevronRight className="w-3 h-3 text-neutral-300" />
              <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
              <ChevronRight className="w-3 h-3 text-neutral-300" />
              <span className="text-neutral-500 font-bold truncate max-w-[150px] md:max-w-none">{product.name}</span>
           </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="main-container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery product={product} />
          </div>

          {/* Info */}
          <div className="lg:col-span-5">
            <ProductInfo product={product} onReviewsClick={handleReviewsClick} />
          </div>
        </div>

        {/* Charity Beige Banner */}
        <div className="mt-16 bg-[#FAF6F0] p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-[#e8dfd5]/60 rounded-sm">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#5c4e43] border border-[#e8dfd5]/60">
              <Heart className="w-4 h-4 fill-current text-[#5c4e43]" />
            </div>
            <p className="text-xs md:text-sm text-[#5c4e43] font-semibold leading-relaxed">
              <strong>10% lợi nhuận</strong> được trích từ mỗi đơn hàng để thực hiện các hoạt động thiện nguyện,<br className="hidden md:inline" /> hỗ trợ trẻ em và cộng đồng có hoàn cảnh khó khăn.
            </p>
          </div>
          <Link href="/about" className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black hover:opacity-75 transition-opacity whitespace-nowrap">
            Xem hành trình yêu thương
            <span className="text-base">→</span>
          </Link>
        </div>
      </div>

      {/* Product Details Tabs Section */}
      <section ref={tabsRef} className="py-16 border-t border-neutral-100 bg-white">
        <div className="main-container mx-auto px-4">
          {/* Tab Headers */}
          <div className="flex border-b border-neutral-200 overflow-x-auto gap-8 md:gap-16 mb-12 scrollbar-none justify-start md:justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "pb-4 font-black text-xs uppercase tracking-widest border-b-2 transition-all whitespace-nowrap cursor-pointer",
                  activeTab === tab.id
                    ? "border-black text-black"
                    : "border-transparent text-neutral-400 hover:text-neutral-600"
                )}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {activeTab === 'description' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* Left Column: text description */}
                <div className="space-y-6">
                  <div className="prose prose-neutral max-w-none text-neutral-600 font-medium leading-loose text-sm">
                    <div 
                      className={cn(
                        "overflow-hidden transition-all duration-500",
                        isExpanded ? "max-h-none" : "max-h-[280px]"
                      )}
                      dangerouslySetInnerHTML={{ __html: product.description || '' }}
                    />
                  </div>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-1.5 font-black text-[10px] uppercase tracking-widest text-neutral-800 hover:text-black mt-4 cursor-pointer"
                  >
                    {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                    <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
                  </button>
                </div>
                {/* Right Column: product image */}
                <div className="aspect-[4/3] relative rounded-sm overflow-hidden bg-neutral-100 border border-neutral-100">
                  <img
                    src={product.images?.[0]?.url || product.thumbnail?.url || '/placeholder-product.png'}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="max-w-2xl mx-auto">
                <table className="w-full text-sm text-neutral-600 border-collapse">
                  <tbody>
                    <tr className="border-b border-neutral-100">
                      <td className="py-4 font-black text-xs uppercase tracking-wider text-black w-1/3">Thương hiệu</td>
                      <td className="py-4">{product.brand?.name || 'LUNÉ'}</td>
                    </tr>
                    <tr className="border-b border-neutral-100">
                      <td className="py-4 font-black text-xs uppercase tracking-wider text-black">Danh mục</td>
                      <td className="py-4">{product.category?.name || 'Cửa hàng'}</td>
                    </tr>
                    <tr className="border-b border-neutral-100">
                      <td className="py-4 font-black text-xs uppercase tracking-wider text-black">Mã sản phẩm</td>
                      <td className="py-4 font-bold text-black">{product.slug?.toUpperCase() || product.id}</td>
                    </tr>
                    <tr className="border-b border-neutral-100">
                      <td className="py-4 font-black text-xs uppercase tracking-wider text-black">Xuất xứ</td>
                      <td className="py-4">Việt Nam</td>
                    </tr>
                    <tr className="border-b border-neutral-100">
                      <td className="py-4 font-black text-xs uppercase tracking-wider text-black">Tình trạng</td>
                      <td className="py-4">Mới chính hãng</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="max-w-xl mx-auto space-y-4 text-sm text-neutral-600 font-medium leading-relaxed">
                <p className="font-bold text-black mb-2">Hướng dẫn bảo quản trang phục LUNÉ:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Giặt tay hoặc giặt máy bằng nước lạnh (không quá 30 độ C) với chu kỳ xả nhẹ nhàng.</li>
                  <li>Sử dụng xà phòng trung tính, tránh dùng chất tẩy trắng mạnh.</li>
                  <li>Không ngâm chung đồ tối màu với đồ sáng màu để tránh loang màu.</li>
                  <li>Phơi khô trong bóng râm, tránh tiếp xúc trực tiếp dưới ánh nắng gay gắt.</li>
                  <li>Ủi (là) sản phẩm ở nhiệt độ thấp hoặc trung bình khi cần thiết.</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <ProductReviews product={product} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-white border-t border-neutral-100">
          <div className="main-container mx-auto px-4">
            <h2 className="text-base font-black uppercase tracking-widest text-center text-[#231f20] mb-12">
              Sản phẩm liên quan
            </h2>
            
            <Carousel
              opts={{
                align: 'start',
                loop: featuredProducts.length > 5,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {featuredProducts.map((p) => (
                  <CarouselItem
                    key={p.id}
                    className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5"
                  >
                    <ProductCard product={p} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {featuredProducts.length > 5 && (
                <div className="hidden md:block">
                  <CarouselPrevious className="-left-12 hover:bg-black hover:text-white border-none shadow-md" />
                  <CarouselNext className="-right-12 hover:bg-black hover:text-white border-none shadow-md" />
                </div>
              )}
            </Carousel>
          </div>
        </section>
      )}
    </div>
  )
}
