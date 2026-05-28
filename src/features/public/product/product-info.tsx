import { Heart, Minus, Plus, Share2, ShoppingBag, Star, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Product } from '~/features/admin/product/types'
import { cn } from '~/lib/utils'
import { _cartService } from '~/features/public/cart/cart.query'
import { toast } from 'react-toastify'

interface ProductInfoProps {
  product: Product
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const variant = product.variants?.[selectedVariantIndex]
  const price = variant?.price || 0
  const priceFormatted = (variant as any)?.priceFormatted || (product as any)?.priceFormatted

  const originalPrice = product.discountValue
    ? product.discountType === 'PERCENTAGE'
      ? price / (1 - product.discountValue / 100)
      : price + product.discountValue
    : undefined

  const originalPriceFormatted = (variant as any)?.originalPriceFormatted || (product as any)?.originalPriceFormatted

  const discount =
    product.discountType === 'PERCENTAGE' ? product.discountValue : 0

  const addToCartMutation = _cartService.useAddToCart()

  const handleAddToCart = () => {
    if (!variant) {
      toast.error('Vui lòng chọn một phiên bản sản phẩm')
      return
    }
    addToCartMutation.mutate(
      {
        productVariantId: variant.id,
        quantity,
      },
      {
        onSuccess: () => {
          toast.success('Đã thêm sản phẩm vào giỏ hàng thành công!')
        },
        onError: (err: any) => {
          console.error(err)
          toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng')
        }
      }
    )
  }

  return (
    <div className='flex flex-col gap-8'>
      {/* Title & Rating */}
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest'>
          <span>{product.brand?.name || 'Coolmate'}</span>
          <span>/</span>
          <span>{product.category?.name || 'Sản phẩm'}</span>
        </div>
        <h1 className='text-3xl md:text-4xl font-black tracking-tight uppercase'>
          {product.name}
        </h1>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1'>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={cn(
                  'w-4 h-4 fill-current',
                  s <= 4 ? 'text-black' : 'text-gray-200',
                )}
              />
            ))}
            <span className='text-sm font-bold ml-1'>(4.9)</span>
          </div>
          <button className='flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline'>
            <Share2 className='w-4 h-4' />
            Chia sẻ
          </button>
        </div>
      </div>

      {/* Pricing */}
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-4'>
          <span className='text-3xl font-black text-black'>
            {priceFormatted || `${price.toLocaleString('vi-VN')} ₫`}
          </span>
          {originalPrice && originalPrice > price && (
            <>
              <span className='text-xl text-gray-400 line-through'>
                {originalPriceFormatted || `${Math.round(originalPrice).toLocaleString('vi-VN')} ₫`}
              </span>
              <span className='bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full'>
                -{discount}%
              </span>
            </>
          )}
        </div>
        <div className='flex items-center gap-2 text-sm text-gray-500 font-medium'>
          <span className='text-green-600 font-bold'>Freeship</span> đơn trên
          200K
        </div>
      </div>

      {/* CoolCash Promo */}
      <div className='bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-blue-100 transition-colors'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black'>
            C
          </div>
          <div>
            <p className='text-sm font-bold text-blue-900'>
              Được hoàn lên đến 14.000 CoolCash
            </p>
            <p className='text-xs text-blue-700'>
              Dành riêng cho thành viên CoolClub
            </p>
          </div>
        </div>
        <Plus className='w-5 h-5 text-blue-600 group-hover:rotate-90 transition-transform' />
      </div>

      {/* Variants Selection (Simplified if attributes missing) */}
      {product.variants && product.variants.length > 1 && (
        <div className='flex flex-col gap-4'>
          <p className='text-sm font-black uppercase tracking-wider'>
            Phiên bản:
          </p>
          <div className='flex flex-wrap gap-3'>
            {product.variants.map((v, idx) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariantIndex(idx)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-bold transition-all border-2',
                  selectedVariantIndex === idx
                    ? 'bg-black text-white border-black'
                    : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-200',
                )}
              >
                {v.sku || `Bản ${idx + 1}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Actions */}
      <div className='flex gap-4'>
        <div className='flex items-center bg-gray-100 rounded-2xl p-1 h-14'>
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className='w-12 h-full flex items-center justify-center hover:bg-white rounded-xl transition-all'
          >
            <Minus className='w-4 h-4' />
          </button>
          <span className='w-12 text-center font-black'>{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className='w-12 h-full flex items-center justify-center hover:bg-white rounded-xl transition-all'
          >
            <Plus className='w-4 h-4' />
          </button>
        </div>
        <button 
          onClick={handleAddToCart}
          disabled={addToCartMutation.isPending}
          className='flex-1 bg-black text-white rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-black/10 disabled:opacity-60'
        >
          {addToCartMutation.isPending ? (
            <Loader2 className='w-5 h-5 animate-spin' />
          ) : (
            <>
              <ShoppingBag className='w-5 h-5' />
              Thêm vào giỏ
            </>
          )}
        </button>
        <button className='w-14 h-14 border-2 border-gray-100 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:border-red-100 group transition-all'>
          <Heart className='w-6 h-6 group-hover:fill-red-500 group-hover:text-red-500 transition-all' />
        </button>
      </div>

      {/* Support Info Grid */}
      <div className='grid grid-cols-2 gap-4 border-t pt-8 mt-4'>
        {[
          { label: 'Free ship cho đơn từ 200k', icon: '🚚' },
          { label: 'Đổi trả trong 60 ngày', icon: '🔄' },
          { label: 'Hotline 1900.272737', icon: '📞' },
          { label: 'Kiểm tra hàng khi nhận', icon: '📦' },
        ].map((item, idx) => (
          <div
            key={idx}
            className='flex items-center gap-3 text-xs font-bold text-gray-500'
          >
            <span className='text-xl'>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductInfo
