import { ChevronLeft, ChevronRight, Play, Search } from 'lucide-react'
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
              'relative w-20 aspect-[3/4] rounded-sm overflow-hidden border transition-all flex-shrink-0',
              activeIndex === idx
                ? 'border-black'
                : 'border-neutral-200 opacity-60 hover:opacity-100',
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
      <div className='order-1 md:order-2 flex-1 relative aspect-[3/4] rounded-sm overflow-hidden bg-gray-50 border border-neutral-100'>
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
            className='object-cover w-full h-full transition-all duration-700 hover:scale-102'
          />
        )}

        {/* Navigation Arrows */}
        {allMedia.length > 1 && (
          <>
            <button
              onClick={() =>
                setActiveIndex((prev) =>
                  prev > 0 ? prev - 1 : allMedia.length - 1,
                )
              }
              className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center hover:bg-white transition-all shadow-md text-neutral-800'
            >
              <ChevronLeft className='w-5 h-5' />
            </button>
            <button
              onClick={() =>
                setActiveIndex((prev) =>
                  prev < allMedia.length - 1 ? prev + 1 : 0,
                )
              }
              className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center hover:bg-white transition-all shadow-md text-neutral-800'
            >
              <ChevronRight className='w-5 h-5' />
            </button>
          </>
        )}

        {/* Zoom Button */}
        <button className='absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md text-neutral-800 hover:scale-105 active:scale-95 transition-all z-20'>
          <Search className='w-4.5 h-4.5 stroke-[2]' />
        </button>
      </div>
    </div>
  )
}

export default ProductGallery
