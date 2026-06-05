import { Heart, Minus, Plus, Share2, ShoppingBag, Star, Loader2, Ruler, Truck, RotateCcw, ShieldCheck } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { Product } from '~/features/admin/product/types'
import { cn } from '~/lib/utils'
import { _cartService } from '~/features/public/cart/cart.query'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

interface ProductInfoProps {
  product: Product
  onReviewsClick?: () => void
}

const colorHexMap: Record<string, string> = {
  'Trắng': '#FFFFFF',
  'Đen': '#000000',
  'Be': '#F5EFE6',
  'Kem': '#FFFDD0',
  'Xám': '#9E9E9E',
  'Nâu': '#8B4513',
  'Hồng': '#FFC0CB',
  'Xanh rêu': '#556B2F',
  'Xanh lá': '#4CAF50',
  'Xanh dương': '#2196F3',
  'Xanh biển': '#03A9F4',
  'Cam': '#FF9800',
  'Đỏ': '#F44336',
  'Vàng': '#FFEB3B',
  'Trắng kem': '#FBF6F0',
  'white': '#FFFFFF',
  'black': '#000000',
  'beige': '#F5EFE6',
  'cream': '#FFFDD0',
  'grey': '#9E9E9E',
  'gray': '#9E9E9E',
  'brown': '#8B4513',
  'pink': '#FFC0CB',
  'sage': '#8F9779',
  'green': '#4CAF50',
  'blue': '#2196F3',
  'orange': '#FF9800',
  'red': '#F44336',
  'yellow': '#FFEB3B',
}

const ProductInfo = ({ product, onReviewsClick }: ProductInfoProps) => {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)

  // Extract color attribute values
  const colorAttrGroup = useMemo(() => {
    const list: { id: string; value: string }[] = []
    product.variants?.forEach((v) => {
      const colorAttr = v.attributes?.find((a: any) => {
        const name = (a.attributeValue?.attribute?.name || a.name || '').toLowerCase()
        return name.includes('màu') || name.includes('color')
      })
      if (colorAttr && !list.some((item) => item.value === colorAttr.value)) {
        list.push({ id: colorAttr.id, value: colorAttr.value })
      }
    })
    return list
  }, [product.variants])

  // Extract size attribute values
  const sizeAttrGroup = useMemo(() => {
    const list: { id: string; value: string }[] = []
    product.variants?.forEach((v) => {
      const sizeAttr = v.attributes?.find((a: any) => {
        const name = (a.attributeValue?.attribute?.name || a.name || '').toLowerCase()
        return name.includes('kích thước') || name.includes('size')
      })
      if (sizeAttr && !list.some((item) => item.value === sizeAttr.value)) {
        list.push({ id: sizeAttr.id, value: sizeAttr.value })
      }
    })
    return list
  }, [product.variants])

  const [selectedColor, setSelectedColor] = useState<string>(() => {
    const firstV = product.variants?.[0]
    const colorAttr = firstV?.attributes?.find((a: any) => {
      const name = (a.attributeValue?.attribute?.name || a.name || '').toLowerCase()
      return name.includes('màu') || name.includes('color')
    })
    return colorAttr?.value || ''
  })

  const [selectedSize, setSelectedSize] = useState<string>(() => {
    const firstV = product.variants?.[0]
    const sizeAttr = firstV?.attributes?.find((a: any) => {
      const name = (a.attributeValue?.attribute?.name || a.name || '').toLowerCase()
      return name.includes('kích thước') || name.includes('size')
    })
    return sizeAttr?.value || ''
  })

  // Select matching variant based on selections
  const activeVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return null

    let match = product.variants.find((v) => {
      const hasColor = !selectedColor || v.attributes?.some((a: any) => {
        const name = (a.attributeValue?.attribute?.name || a.name || '').toLowerCase()
        return (name.includes('màu') || name.includes('color')) && a.value === selectedColor
      })
      const hasSize = !selectedSize || v.attributes?.some((a: any) => {
        const name = (a.attributeValue?.attribute?.name || a.name || '').toLowerCase()
        return (name.includes('kích thước') || name.includes('size')) && a.value === selectedSize
      })
      return hasColor && hasSize
    })

    if (!match && selectedColor) {
      match = product.variants.find((v) => {
        return v.attributes?.some((a: any) => {
          const name = (a.attributeValue?.attribute?.name || a.name || '').toLowerCase()
          return (name.includes('màu') || name.includes('color')) && a.value === selectedColor
        })
      })
    }

    return match || product.variants[0]
  }, [product.variants, selectedColor, selectedSize])

  // Sync state values when variant details change
  useEffect(() => {
    if (activeVariant) {
      const colorAttr = activeVariant.attributes?.find((a: any) => {
        const name = (a.attributeValue?.attribute?.name || a.name || '').toLowerCase()
        return name.includes('màu') || name.includes('color')
      })
      if (colorAttr && colorAttr.value !== selectedColor) {
        setSelectedColor(colorAttr.value)
      }

      const sizeAttr = activeVariant.attributes?.find((a: any) => {
        const name = (a.attributeValue?.attribute?.name || a.name || '').toLowerCase()
        return name.includes('kích thước') || name.includes('size')
      })
      if (sizeAttr && sizeAttr.value !== selectedSize) {
        setSelectedSize(sizeAttr.value)
      }
    }
  }, [activeVariant])

  const variant = activeVariant
  const stockQuantity = variant?.stockQuantity ?? (product as any).stock ?? 0
  const isOutOfStock = stockQuantity <= 0
  const isStockLow = stockQuantity > 0 && stockQuantity <= 5

  const price = variant?.price || 0
  const priceFormatted = (variant as any)?.priceFormatted || (product as any)?.priceFormatted

  const originalPrice = product.discountValue
    ? product.discountType === 'PERCENTAGE'
      ? price / (1 - product.discountValue / 100)
      : price + product.discountValue
    : undefined

  const originalPriceFormatted = (variant as any)?.originalPriceFormatted || (product as any)?.originalPriceFormatted

  const addToCartMutation = _cartService.useAddToCart()

  const handleAddToCart = () => {
    if (!variant) {
      toast.error('Vui lòng chọn một phiên bản sản phẩm')
      return
    }

    if (quantity > stockQuantity) {
      toast.error(`Rất tiếc, chỉ còn ${stockQuantity} sản phẩm trong kho`)
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
    <div className='flex flex-col gap-6 text-left'>
      {/* New Arrival Badge */}
      <div className="flex items-center">
        <span className="text-[9px] font-black tracking-widest text-[#5c4e43] bg-[#FBF8F3] px-3 py-1 uppercase border border-[#e8dfd5]">
          NEW IN
        </span>
      </div>

      {/* Brand, Category & Title */}
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-heading font-black text-[#231f20] tracking-tight uppercase leading-snug'>
          {product.name}
        </h1>
        
        {/* Price */}
        <div className='flex items-baseline gap-4 mt-2'>
          <span className='text-2xl font-black text-black tracking-tight'>
            {priceFormatted || `${price.toLocaleString('vi-VN')}đ`}
          </span>
          {originalPrice && originalPrice > price && (
            <span className='text-base text-gray-400 line-through font-medium decoration-rose-500/50'>
              {originalPriceFormatted || `${Math.round(originalPrice).toLocaleString('vi-VN')}đ`}
            </span>
          )}
        </div>
      </div>

      {/* Star Ratings Row */}
      <div className='flex items-center gap-3 text-xs text-neutral-500 font-medium pb-2 border-b border-neutral-100'>
        <div className='flex items-center gap-0.5'>
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className='w-3.5 h-3.5 fill-black text-black stroke-[1]'
            />
          ))}
        </div>
        <button 
          onClick={onReviewsClick} 
          className='hover:underline font-bold text-neutral-800'
        >
          4.9 (128 đánh giá)
        </button>
        <span className='text-neutral-300'>|</span>
        <span>Đã bán 356</span>
      </div>

      {/* Summary Description */}
      <p className='text-xs text-neutral-600 font-semibold leading-relaxed'>
        {product.summary || 'Thiết kế tối giản từ chất liệu cao cấp, mềm mịn và thoáng mát mang đến cảm giác dễ chịu suốt ngày dài. Phù hợp phối cùng nhiều phong cách khác nhau.'}
      </p>

      {/* Colors Swatches Selector */}
      {colorAttrGroup.length > 0 && (
        <div className='space-y-3 pt-2'>
          <span className='text-xs font-black uppercase tracking-wider text-black block'>
            Màu sắc: <span className='font-medium text-neutral-500 normal-case'>{selectedColor}</span>
          </span>
          <div className='flex flex-wrap gap-2.5 pt-0.5'>
            {colorAttrGroup.map((option) => {
              const isChecked = selectedColor === option.value
              const hex = colorHexMap[option.value] || option.value || '#E5E7EB'
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedColor(option.value)}
                  className={cn(
                    'w-6 h-6 rounded-full border border-neutral-200 transition-all cursor-pointer relative flex items-center justify-center hover:scale-110',
                    isChecked && 'ring-1 ring-black ring-offset-2'
                  )}
                  style={{ backgroundColor: hex }}
                  title={option.value}
                  type='button'
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Sizes Boxed Selector */}
      {sizeAttrGroup.length > 0 && (
        <div className='space-y-3 pt-2'>
          <span className='text-xs font-black uppercase tracking-wider text-black block'>
            Kích thước: <span className='font-medium text-neutral-500 normal-case'>{selectedSize}</span>
          </span>
          <div className='flex flex-wrap gap-2 pt-0.5'>
            {sizeAttrGroup.map((option) => {
              const isChecked = selectedSize === option.value
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedSize(option.value)}
                  className={cn(
                    'h-10 px-4 border text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center min-w-[44px]',
                    isChecked 
                      ? 'border-black bg-black text-white' 
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-black'
                  )}
                  type='button'
                >
                  {option.value}
                </button>
              )
            })}
          </div>
          <button className='flex items-center gap-1.5 text-[11px] font-bold text-neutral-500 hover:text-black tracking-wide pt-1'>
            <Ruler className='w-4 h-4 text-neutral-400' />
            Hướng dẫn chọn size
          </button>
        </div>
      )}

      {/* Stock Status */}
      <div className='flex items-center gap-2 pt-1'>
        <div className={cn(
          'w-1.5 h-1.5 rounded-full',
          isOutOfStock ? 'bg-red-500' : isStockLow ? 'bg-amber-500 animate-pulse' : 'bg-green-500'
        )} />
        <span className={cn(
          'text-[9px] font-black uppercase tracking-widest',
          isOutOfStock ? 'text-red-500' : isStockLow ? 'text-amber-600' : 'text-green-600'
        )}>
          {isOutOfStock ? 'Hết hàng' : isStockLow ? `Sắp hết (Còn ${stockQuantity})` : 'Còn hàng'}
        </span>
      </div>

      {/* Quantity Counter */}
      <div className='flex items-center gap-4 pt-2'>
        <span className='text-xs font-black uppercase tracking-wider text-black'>Số lượng</span>
        <div className='flex items-center bg-[#FBF8F3] border border-neutral-200/50 rounded-sm p-0.5 h-10 w-28'>
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || isOutOfStock}
            className='w-8 h-full flex items-center justify-center text-neutral-600 hover:text-black transition-colors disabled:opacity-30'
          >
            <Minus className='w-3.5 h-3.5' />
          </button>
          <span className='flex-1 text-center font-bold text-xs'>{isOutOfStock ? 0 : quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            disabled={quantity >= stockQuantity || isOutOfStock}
            className='w-8 h-full flex items-center justify-center text-neutral-600 hover:text-black transition-colors disabled:opacity-30'
          >
            <Plus className='w-3.5 h-3.5' />
          </button>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className='space-y-3 pt-4 border-t border-neutral-100'>
        <button
          onClick={handleAddToCart}
          disabled={addToCartMutation.isPending || isOutOfStock || quantity > stockQuantity}
          className='w-full h-12 bg-black hover:bg-neutral-800 text-white flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-50'
        >
          {addToCartMutation.isPending ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            'Thêm vào giỏ hàng'
          )}
        </button>
        <button
          onClick={() => {
            if (!isOutOfStock) {
              handleAddToCart()
              router.push('/cart')
            }
          }}
          disabled={isOutOfStock}
          className='w-full h-12 border border-black bg-white hover:bg-neutral-50 text-black flex items-center justify-center text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-50'
        >
          Mua ngay
        </button>
      </div>

      {/* Row-based Brand Benefits */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-neutral-100 pt-6 mt-4'>
        <div className='flex items-center gap-2.5 text-[9px] text-neutral-500 font-bold uppercase tracking-wider'>
          <Truck className='w-4 h-4 text-neutral-400 stroke-[1.2]' />
          <span>Miễn phí vận chuyển cho đơn từ 800.000đ</span>
        </div>
        <div className='flex items-center gap-2.5 text-[9px] text-neutral-500 font-bold uppercase tracking-wider'>
          <RotateCcw className='w-4 h-4 text-neutral-400 stroke-[1.2]' />
          <span>Đổi trả dễ dàng trong vòng 7 ngày</span>
        </div>
        <div className='flex items-center gap-2.5 text-[9px] text-neutral-500 font-bold uppercase tracking-wider'>
          <ShieldCheck className='w-4 h-4 text-neutral-400 stroke-[1.2]' />
          <span>Thanh toán an toàn bảo mật</span>
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
