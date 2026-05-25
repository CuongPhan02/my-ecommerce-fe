import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { useState } from 'react'
import { Product } from '~/features/admin/product/types'
import { cn } from '~/lib/utils'

interface ProductGalleryProps {
  product: Product
}

const ProductGallery = ({ product }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)

  // Combine thumbnail and additional media
  const allMedia = [
    product.thumbnail ? { url: product.thumbnail.url, type: product.thumbnail.fileType || 'IMAGE' } : null,
    ...(product.images?.map((img) => img.media ? { url: img.media.url, type: img.media.fileType || 'IMAGE' } : null) || []),
  ].filter(Boolean) as { url: string, type: string }[]

  return (
    <div className='flex flex-col md:flex-row gap-4'>
      {/* Thumbnails */}
      <div className='order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar max-h-[600px]'>
        {allMedia.map((media, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              'relative w-20 aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all flex-shrink-0',
              activeIndex === idx
                ? 'border-black shadow-md'
                : 'border-transparent opacity-60 hover:opacity-100',
            )}
          >
            {media.type === 'VIDEO' ? (
              <div className="relative w-full h-full bg-black flex items-center justify-center">
                <video src={media.url} className='absolute inset-0 object-cover w-full h-full opacity-50' />
                <Play className="w-8 h-8 text-white z-10" />
              </div>
            ) : (
              <img src={media.url} alt={`Thumb ${idx}`} className='object-cover w-full h-full' />
            )}
          </button>
        ))}
      </div>

      {/* Main Media */}
      <div className='order-1 md:order-2 flex-1 relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100'>
        {allMedia[activeIndex]?.type === 'VIDEO' ? (
          <video
            src={allMedia[activeIndex].url}
            controls
            autoPlay
            loop
            muted
            className='object-cover w-full h-full'
          />
        ) : (
          <img
            src={allMedia[activeIndex]?.url || '/placeholder-product.png'}
            alt={product.name || 'Main product'}
            className='object-cover w-full h-full transition-all duration-700 hover:scale-105'
          />
        )}

        {/* Navigation Arrows */}
        <button
          onClick={() =>
            setActiveIndex((prev) =>
              prev > 0 ? prev - 1 : allMedia.length - 1,
            )
          }
          className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-lg'
        >
          <ChevronLeft className='w-6 h-6' />
        </button>
        <button
          onClick={() =>
            setActiveIndex((prev) =>
              prev < allMedia.length - 1 ? prev + 1 : 0,
            )
          }
          className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-lg'
        >
          <ChevronRight className='w-6 h-6' />
        </button>

        {/* Promo Banner */}
        <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12'>
          <div className='bg-orange-600 text-white py-2 px-6 rounded-full w-fit mx-auto font-black text-sm tracking-widest animate-pulse'>
            TẶNG 01 TÚI TOTE ĐƠN TỪ 499K
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductGallery
