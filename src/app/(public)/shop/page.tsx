import React, { Suspense } from 'react'
import Image from 'next/image'
import FilterSidebar from '~/features/public/shop/filter-sidebar'
import ProductCard from '~/components/ui/core/product-card'
import { ArrowLeft, ArrowRight, Filter } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '~/components/ui/core/sheet'
import { shopApi, ShopFilters } from '~/features/public/shop/shop.api'
import ShopPagination from '~/features/public/shop/shop-pagination'
import SortDropdown from '~/features/public/shop/sort-dropdown'
import ScrollToTop from '~/features/public/shop/scroll-to-top'

const NewArrivals = ({ products }: { products: any[] }) => {
  if (!products || products.length === 0) return null;
  
  return (
    <section className='py-20 border-t mt-20'>
      <div className='flex items-center justify-between mb-10'>
        <h2 className='text-2xl md:text-3xl font-black uppercase tracking-tight'>
          SẢN PHẨM NỔI BẬT
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
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

const ProductGridSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Skeleton dynamic count info */}
      <div className="h-4 w-48 bg-gray-100 animate-pulse rounded-md" />
      
      {/* Skeleton product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="flex flex-col gap-4 w-full animate-pulse">
            <div className="aspect-[3/4] w-full bg-gray-100 rounded-3xl" />
            <div className="space-y-2">
              <div className="h-4 w-2/3 bg-gray-100 rounded-md" />
              <div className="h-4 w-1/3 bg-gray-100 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const ProductListContent = async ({ filters }: { filters: ShopFilters }) => {
  const productsResponse = await shopApi.fetchProducts(filters).catch((e) => {
    console.error('Failed to fetch shop products:', e)
    return null
  })

  const products = productsResponse?.data || []
  const totalPages = productsResponse?.meta?.totalPages || 1
  const total = productsResponse?.meta?.total || 0

  return (
    <>
      <div className='text-sm text-gray-500 mb-8'>
        Hiển thị{' '}
        <span className='font-bold text-black'>{products.length}</span>{' '}
        trên tổng số{' '}
        <span className='font-bold text-black'>{total}</span> sản phẩm
      </div>

      {products.length === 0 ? (
        <div className='py-20 flex flex-col items-center justify-center text-center bg-gray-50 rounded-2xl border border-dashed'>
          <p className='text-xl font-semibold text-gray-500 mb-2'>
            Không tìm thấy sản phẩm nào
          </p>
          <p className='text-sm text-gray-400'>
            Vui lòng thử điều chỉnh lại bộ lọc hoặc tìm kiếm với từ khóa khác.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12'>
          {products.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      )}

      {totalPages > 1 && <ShopPagination totalPages={totalPages} />}
    </>
  )
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Await searchParams in Next.js 15+
  const resolvedParams = await searchParams

  const page =
    typeof resolvedParams.page === 'string'
      ? parseInt(resolvedParams.page, 10)
      : 1
  const limit =
    typeof resolvedParams.limit === 'string'
      ? parseInt(resolvedParams.limit, 10)
      : 12
  const sort =
    typeof resolvedParams.sort === 'string' ? resolvedParams.sort : undefined
  const search =
    typeof resolvedParams.search === 'string'
      ? resolvedParams.search
      : undefined
  const categoryId =
    typeof resolvedParams.categoryId === 'string'
      ? resolvedParams.categoryId
      : undefined
  const collectionId =
    typeof resolvedParams.collectionId === 'string'
      ? resolvedParams.collectionId
      : undefined
  const brandIds =
    typeof resolvedParams.brandIds === 'string'
      ? resolvedParams.brandIds.split(',')
      : Array.isArray(resolvedParams.brandIds) ? resolvedParams.brandIds : undefined
  const attributeValueIds =
    typeof resolvedParams.attributeValueIds === 'string'
      ? resolvedParams.attributeValueIds.split(',')
      : Array.isArray(resolvedParams.attributeValueIds) ? resolvedParams.attributeValueIds : undefined
  const minPrice =
    typeof resolvedParams.minPrice === 'string'
      ? parseInt(resolvedParams.minPrice, 10)
      : undefined
  const maxPrice =
    typeof resolvedParams.maxPrice === 'string'
      ? parseInt(resolvedParams.maxPrice, 10)
      : undefined

  // Construct filters
  const filters: ShopFilters = {
    page,
    limit,
    sort,
    search,
    categoryId,
    collectionId,
    brandIds,
    attributeValueIds,
    minPrice,
    maxPrice,
  }

  // Fetch filters & arrivals data in parallel
  const [categories, brands, collections, attributes, newArrivals] = await Promise.all([
    shopApi.fetchCategories(),
    shopApi.fetchBrands(),
    shopApi.fetchCollections(),
    shopApi.fetchAttributes(),
    shopApi.fetchNewArrivals(),
  ])

  return (
    <div className='bg-white min-h-screen pb-20'>
      {/* Scroll to top when search parameters change */}
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>

      {/* Top Shop Banner */}
      <div className='w-full relative h-[250px] md:h-[320px] bg-[#FAF6F0] mb-12 select-none overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <Image
            src='/lune-shop-banner.png'
            alt='Shop Banner'
            fill
            priority
            className='object-cover object-center'
            sizes='100vw'
          />
          {/* Subtle light overlay to blend text */}
          <div className='absolute inset-0 bg-black/10 lg:bg-transparent lg:bg-gradient-to-r lg:from-[#FAF6F0]/85 lg:to-transparent' />
        </div>
        <div className='max-w-[1400px] mx-auto px-6 md:px-12 h-full flex flex-col justify-center relative z-10 text-left space-y-3 md:space-y-4'>
          <span className='text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400'>
            SHOP
          </span>
          <h1 className='font-heading text-2xl md:text-3xl lg:text-4xl font-black text-black uppercase tracking-wider leading-tight max-w-lg'>
            Khám phá phong cách<br />của riêng bạn
          </h1>
          <div className='text-xs md:text-sm text-neutral-500 font-medium leading-relaxed max-w-sm'>
            <p>Những thiết kế tối giản, tinh tế và chất lượng vượt thời gian.</p>
            <p>Dành cho những người theo đuổi sự thanh lịch trong từng chi tiết.</p>
          </div>
        </div>
      </div>

      <div className='main-container mx-auto px-6 md:px-12'>
        <div className='flex flex-col lg:flex-row gap-12'>
          {/* Sidebar (Desktop) */}
          <div className='hidden lg:block'>
            <Suspense
              fallback={
                <div className='w-64 animate-pulse bg-gray-100 h-96 rounded-xl' />
              }
            >
              <FilterSidebar 
                categories={categories}
                brands={brands}
                collections={collections}
                attributes={attributes}
              />
            </Suspense>
          </div>

          {/* Main Content */}
          <main className='flex-1'>
            {/* Top Bar */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b pb-6'>
              <div className='flex items-center gap-4'>
                <Sheet>
                  <SheetTrigger asChild>
                    <button className='lg:hidden flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium hover:bg-gray-50'>
                      <Filter className='w-4 h-4' />
                      Bộ lọc
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 overflow-y-auto">
                    <div className="p-6">
                      <FilterSidebar 
                        categories={categories}
                        brands={brands}
                        collections={collections}
                        attributes={attributes}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              <Suspense
                fallback={
                  <div className='w-32 h-10 bg-gray-100 animate-pulse rounded-full' />
                }
              >
                <SortDropdown />
              </Suspense>
            </div>

            {/* Suspended Product Grid & Pagination */}
            <Suspense key={JSON.stringify(filters)} fallback={<ProductGridSkeleton />}>
              <ProductListContent filters={filters} />
            </Suspense>

            {/* New Arrivals */}
            <NewArrivals products={newArrivals} />
          </main>
        </div>
      </div>
    </div>
  )
}
