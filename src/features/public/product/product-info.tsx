import { Heart, Minus, Plus, Star, Loader2, Ruler, Truck, RotateCcw, ShieldCheck } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Product } from '~/features/admin/product/types'
import { cn } from '~/lib/utils'
import { _cartService } from '~/features/public/cart/cart.query'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useWishlist } from '~/providers/wishlist-provider'

interface ProductInfoProps {
  product: Product
  onReviewsClick?: () => void
}

// Bảng màu hex cho color swatch
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
  'Đỏ tươi': '#DC2626',
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

// Helper: kiểm tra tên thuộc tính có phải màu sắc không
const isColorAttr = (name: string) => {
  const lower = name.toLowerCase()
  return lower.includes('màu') || lower.includes('color') || lower.includes('mau')
}

// Helper: kiểm tra tên thuộc tính có phải kích thước không (để hiển thị nút Hướng dẫn size)
const isSizeAttr = (name: string) => {
  const lower = name.toLowerCase()
  return lower.includes('kích thước') || lower.includes('size') || lower.includes('kich thuoc')
}

// Kiểu dữ liệu một nhóm thuộc tính
interface AttrGroup {
  name: string
  values: { id: string; value: string }[]
}

const ProductInfo = ({ product, onReviewsClick }: ProductInfoProps) => {
  const router = useRouter()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const [quantity, setQuantity] = useState(1)

  // ─── 1. Trích xuất TẤT CẢ nhóm thuộc tính từ variants (color luôn đứng đầu) ──
  const attrGroups = useMemo<AttrGroup[]>(() => {
    const groupMap = new Map<string, { id: string; value: string }[]>()

    product.variants?.forEach((v) => {
      ;(v.attributes as any[])?.forEach((a: any) => {
        const attrName: string = a.attributeValue?.attribute?.name || ''
        const val: string = a.attributeValue?.value || ''
        const id: string = a.attributeValue?.id || ''
        if (!attrName || !val) return

        if (!groupMap.has(attrName)) groupMap.set(attrName, [])
        const list = groupMap.get(attrName)!
        if (!list.some((x) => x.value === val)) list.push({ id, value: val })
      })
    })

    // Sắp xếp: màu sắc lên đầu, kích thước lên thứ 2, còn lại theo thứ tự thêm vào
    return Array.from(groupMap.entries())
      .map(([name, values]) => ({ name, values }))
      .sort((a, b) => {
        const aIsColor = isColorAttr(a.name) ? 0 : isSizeAttr(a.name) ? 1 : 2
        const bIsColor = isColorAttr(b.name) ? 0 : isSizeAttr(b.name) ? 1 : 2
        return aIsColor - bIsColor
      })
  }, [product.variants])

  // ─── 2. State chọn dạng Record<attrName, selectedValue> ──────────────────
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    const firstV = product.variants?.[0]
    ;(firstV?.attributes as any[])?.forEach((a: any) => {
      const attrName: string = a.attributeValue?.attribute?.name || ''
      const val: string = a.attributeValue?.value || ''
      if (attrName && val) init[attrName] = val
    })
    return init
  })

  const selectAttr = (attrName: string, value: string) => {
    setSelectedAttrs((prev) => ({ ...prev, [attrName]: value }))
  }

  // ─── 3. Tìm variant khớp TẤT CẢ thuộc tính đã chọn ─────────────────────
  const activeVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return null

    // Tìm chính xác: khớp tất cả thuộc tính đang chọn
    const exactMatch = product.variants.find((v) =>
      attrGroups.every((group) => {
        const selected = selectedAttrs[group.name]
        if (!selected) return true
        return (v.attributes as any[])?.some((a: any) => {
          const name: string = a.attributeValue?.attribute?.name || ''
          const val: string = a.attributeValue?.value || ''
          return name === group.name && val === selected
        })
      })
    )

    if (exactMatch) return exactMatch

    // Fallback: tìm variant khớp ít nhất 1 thuộc tính ưu tiên nhất
    const fallback = product.variants.find((v) =>
      (v.attributes as any[])?.some((a: any) => {
        const name: string = a.attributeValue?.attribute?.name || ''
        const val: string = a.attributeValue?.value || ''
        const selected = selectedAttrs[name]
        return selected && val === selected
      })
    )

    return fallback || product.variants[0]
  }, [product.variants, selectedAttrs, attrGroups])

  // ─── 4. Các giá trị từ variant đang active ───────────────────────────────
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

  const originalPriceFormatted =
    (variant as any)?.originalPriceFormatted || (product as any)?.originalPriceFormatted

  // ─── 5. Add to cart ──────────────────────────────────────────────────────
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
      { productVariantId: variant.id, quantity },
      {
        onSuccess: () => toast.success('Đã thêm sản phẩm vào giỏ hàng thành công!'),
        onError: (err: any) => {
          console.error(err)
          toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng')
        },
      }
    )
  }

  // ─── 6. Render ───────────────────────────────────────────────────────────
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
          {[1, 2, 3, 4, 5].map((s) => {
            const ratingAvg = (product as any).ratingAverage ?? 0
            const filled = s <= Math.floor(ratingAvg)
            const half = !filled && s === Math.ceil(ratingAvg) && ratingAvg % 1 >= 0.5
            return (
              <Star
                key={s}
                className={cn(
                  'w-3.5 h-3.5 stroke-[1]',
                  filled || half ? 'fill-black text-black' : 'fill-neutral-200 text-neutral-200'
                )}
              />
            )
          })}
        </div>
        <button onClick={onReviewsClick} className='hover:underline font-bold text-neutral-800'>
          {(() => {
            const ratingAvg = (product as any).ratingAverage ?? 0
            const reviewsCount = (product as any).reviewsCount ?? 0
            if (reviewsCount === 0) return 'Chưa có đánh giá'
            return `${ratingAvg.toFixed(1)} (${reviewsCount} đánh giá)`
          })()}
        </button>
        <span className='text-neutral-300'>|</span>
        <span>Đã bán {(product as any).soldCount ?? 0}</span>
      </div>

      {/* Summary Description */}
      <p className='text-xs text-neutral-600 font-semibold leading-relaxed'>
        {product.summary ||
          'Thiết kế tối giản từ chất liệu cao cấp, mềm mịn và thoáng mát mang đến cảm giác dễ chịu suốt ngày dài. Phù hợp phối cùng nhiều phong cách khác nhau.'}
      </p>

      {/* ── Dynamic Attribute Selectors ── */}
      {attrGroups.map((group) => {
        const selected = selectedAttrs[group.name] || ''
        const isColor = isColorAttr(group.name)
        const isSize = isSizeAttr(group.name)

        if (isColor) {
          // ── Color Swatch Selector ──
          // Tìm tên màu để hiển thị label: nếu là hex code thì tra ngược lại tên
          const selectedLabel = (() => {
            if (!selected) return ''
            // Nếu value lưu là hex (#DC2626), tìm tên từ colorHexMap
            const nameFromHex = Object.entries(colorHexMap).find(
              ([, v]) => v.toLowerCase() === selected.toLowerCase()
            )?.[0]
            return nameFromHex || selected
          })()

          return (
            <div key={group.name} className='space-y-3 pt-2'>
              <span className='text-xs font-black uppercase tracking-wider text-black block'>
                {group.name}:{' '}
                <span className='font-medium text-neutral-500 normal-case'>{selectedLabel}</span>
              </span>
              <div className='flex flex-wrap gap-3 pt-0.5'>
                {group.values.map((option) => {
                  const isChecked = selected === option.value
                  // Nếu value đã là hex code (#...), dùng trực tiếp; ngược lại tra bảng
                  const hex = option.value.startsWith('#')
                    ? option.value
                    : colorHexMap[option.value] || option.value || '#E5E7EB'
                  const isLight = hex === '#FFFFFF' || hex === '#FFFDD0' || hex === '#FBF6F0' || hex === '#FFEB3B'
                  return (
                    <button
                      key={option.id}
                      onClick={() => selectAttr(group.name, option.value)}
                      className={cn(
                        'w-8 h-8 rounded-full transition-all cursor-pointer flex items-center justify-center hover:scale-110 shadow-sm',
                        isLight ? 'border border-neutral-300' : 'border border-transparent',
                        isChecked ? 'ring-2 ring-black ring-offset-2' : 'ring-0'
                      )}
                      style={{ backgroundColor: hex }}
                      title={option.value}
                      type='button'
                    />
                  )
                })}
              </div>
            </div>
          )
        }

        // ── Button Selector (size, form dáng, chất liệu, v.v.) ──
        return (
          <div key={group.name} className='space-y-3 pt-2'>
            <span className='text-xs font-black uppercase tracking-wider text-black block'>
              {group.name}:{' '}
              <span className='font-medium text-neutral-500 normal-case'>{selected}</span>
            </span>
            <div className='flex flex-wrap gap-2 pt-0.5'>
              {group.values.map((option) => {
                const isChecked = selected === option.value
                return (
                  <button
                    key={option.id}
                    onClick={() => selectAttr(group.name, option.value)}
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
            {isSize && (
              <button className='flex items-center gap-1.5 text-[11px] font-bold text-neutral-500 hover:text-black tracking-wide pt-1'>
                <Ruler className='w-4 h-4 text-neutral-400' />
                Hướng dẫn chọn size
              </button>
            )}
          </div>
        )
      })}

      {/* Stock Status */}
      <div className='flex items-center gap-2 pt-1'>
        <div
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            isOutOfStock ? 'bg-red-500' : isStockLow ? 'bg-amber-500 animate-pulse' : 'bg-green-500'
          )}
        />
        <span
          className={cn(
            'text-[9px] font-black uppercase tracking-widest',
            isOutOfStock ? 'text-red-500' : isStockLow ? 'text-amber-600' : 'text-green-600'
          )}
        >
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
        <div className='flex gap-3'>
          <button
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending || isOutOfStock || quantity > stockQuantity}
            className='flex-1 h-12 bg-black hover:bg-neutral-800 text-white flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-50'
          >
            {addToCartMutation.isPending ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              'Thêm vào giỏ hàng'
            )}
          </button>
          <button
            onClick={() => {
              const isCurrentlyWishlisted = isWishlisted(product.id)
              toggleWishlist(product.id)
              if (isCurrentlyWishlisted) {
                toast.success('Đã xóa khỏi danh sách yêu thích')
              } else {
                toast.success('Đã thêm vào danh sách yêu thích!')
              }
            }}
            type='button'
            className={cn(
              'w-12 h-12 border flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 rounded-sm',
              isWishlisted(product.id)
                ? 'border-rose-500 bg-rose-50/50 text-rose-500 hover:bg-rose-100/50'
                : 'border-neutral-200 bg-white text-neutral-600 hover:border-black hover:text-black'
            )}
            title={isWishlisted(product.id) ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
          >
            <Heart
              className={cn(
                'w-5 h-5 transition-transform duration-200 active:scale-90',
                isWishlisted(product.id) && 'fill-current'
              )}
            />
          </button>
        </div>
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
