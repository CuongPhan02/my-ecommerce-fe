'use client'

import React, { useState } from 'react'
import { Star, Search, MessageSquare, ThumbsUp, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Product } from '~/features/admin/product/types'
import { _productService } from './product.query'
import { getAccessToken } from '~/config/https'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'

interface ProductReviewsProps {
  product: Product
}

const ProductReviews = ({ product }: ProductReviewsProps) => {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [activeRatingFilter, setActiveRatingFilter] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // State for Review Submit Modal
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const [selectedVariantId, setSelectedVariantId] = useState('')
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Popular quick tags
  const POPULAR_TAGS = ['Sản phẩm đẹp', 'Giá tốt', 'Chất lượng cao', 'Đóng gói kỹ', 'Giao nhanh', 'Vải mềm mại']

  // Query reviews
  const { data: reviewsResponse, isLoading } = _productService.useProductReviews(product.id, {
    page,
    limit: 5,
  })

  // Large set query for statistics computation (up to 100 reviews)
  const { data: allReviewsForStats } = _productService.useProductReviews(product.id, {
    page: 1,
    limit: 100,
  })

  const submitMutation = _productService.useSubmitReview()

  const reviewsList = reviewsResponse?.result?.data || []
  const meta = reviewsResponse?.result?.meta
  const totalPages = meta?.totalPages || 1

  // Handle local searching/filtering
  const filteredReviews = reviewsList.filter((review) => {
    // Rating Filter
    if (activeRatingFilter !== null && review.rating !== activeRatingFilter) {
      return false
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const commentText = (review.comment || review.content || '').toLowerCase()
      const userName = (review.userName || '').toLowerCase()
      if (!commentText.includes(q) && !userName.includes(q)) {
        return false
      }
    }
    return true
  })

  // Statistics calculation from up to 100 fetched reviews
  const statsList = allReviewsForStats?.result?.data || []
  const totalStatsCount = statsList.length
  const averageRating = totalStatsCount > 0
    ? (statsList.reduce((sum, r) => sum + r.rating, 0) / totalStatsCount).toFixed(1)
    : '5.0'

  const getRatingPercent = (stars: number) => {
    if (totalStatsCount === 0) return stars === 5 ? 100 : 0
    const count = statsList.filter((r) => r.rating === stars).length
    return Math.round((count / totalStatsCount) * 100)
  }

  const getRatingCount = (stars: number) => {
    return statsList.filter((r) => r.rating === stars).length
  }

  // Check login
  const isLoggedIn = typeof window !== 'undefined' && !!getAccessToken()

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoggedIn) {
      toast.error('Vui lòng đăng nhập để gửi đánh giá!')
      router.push('/auth/sign-in')
      return
    }

    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá!')
      return
    }

    try {
      await submitMutation.mutateAsync({
        productId: product.id,
        productVariantId: selectedVariantId || undefined,
        rating,
        content: content.trim(),
        tags: selectedTags,
      })

      toast.success('Gửi đánh giá thành công! Đang chờ kiểm duyệt.')
      
      // Reset form states
      setContent('')
      setSelectedVariantId('')
      setSelectedTags([])
      setRating(5)
      setIsOpenModal(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá!')
    }
  }

  return (
    <div className="bg-white py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Summary & Filters */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Summary Block */}
          <div className="flex items-center gap-6 bg-[#FBF8F3] p-6 border border-neutral-200/35 rounded-sm">
            <div className="text-center shrink-0">
              <span className="text-5xl font-black block leading-none text-black font-heading">{averageRating}</span>
              <div className="flex items-center justify-center gap-0.5 mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      'w-3.5 h-3.5 stroke-[1.2]',
                      s <= Math.round(Number(averageRating)) ? 'fill-black text-black' : 'text-neutral-200 fill-none'
                    )}
                  />
                ))}
              </div>
              <p className="text-[9px] text-neutral-400 font-bold mt-2.5 uppercase tracking-widest">
                {totalStatsCount} Đánh giá
              </p>
            </div>

            <div className="flex-1 flex flex-col gap-2 border-l border-neutral-200/50 pl-6">
              {[5, 4, 3, 2, 1].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setActiveRatingFilter(activeRatingFilter === stars ? null : stars)}
                  className={cn(
                    'flex items-center gap-2.5 w-full text-left p-0.5 transition-colors hover:text-black',
                    activeRatingFilter === stars ? 'text-black font-bold' : 'text-neutral-500'
                  )}
                >
                  <span className="text-[10px] font-black w-2.5">{stars}</span>
                  <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#5c4e43] rounded-full" style={{ width: `${getRatingPercent(stars)}%` }} />
                  </div>
                  <span className="text-[9px] text-neutral-400 font-bold w-12 text-right">
                    {getRatingPercent(stars)}%
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Filters & Search */}
          <div className="flex flex-col gap-6 bg-[#FBF8F3] p-6 border border-neutral-200/35 rounded-sm">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Tìm kiếm đánh giá..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-neutral-200/60 focus:border-black rounded-sm py-2.5 pl-11 pr-4 text-xs font-semibold transition-all outline-none"
              />
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Bộ lọc đánh giá</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveRatingFilter(null)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-sm text-[10px] font-black tracking-wider uppercase transition-all border cursor-pointer',
                    activeRatingFilter === null
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-neutral-500 border-neutral-200 hover:border-black hover:text-black'
                  )}
                >
                  Tất cả ({totalStatsCount})
                </button>
                {[5, 4, 3, 2, 1].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setActiveRatingFilter(stars)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-sm text-[10px] font-black tracking-wider uppercase transition-all border flex items-center gap-1 cursor-pointer',
                      activeRatingFilter === stars
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-neutral-500 border-neutral-200 hover:border-black hover:text-black'
                    )}
                  >
                    {stars} ★ ({getRatingCount(stars)})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Write Review Button */}
          <button
            onClick={() => {
              if (!isLoggedIn) {
                toast.warning('Vui lòng đăng nhập để viết đánh giá!')
                router.push('/auth/sign-in')
                return
              }
              setIsOpenModal(true)
            }}
            className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-3 rounded-sm shadow-sm cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            Viết đánh giá của bạn
          </button>
        </div>

        {/* Right: Review List */}
        <div className="lg:col-span-8 flex flex-col">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-[#FBF8F3] rounded-sm border border-neutral-200/35">
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Đang tải đánh giá...</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-[#FBF8F3] rounded-sm border border-neutral-200/35 text-center px-6">
              <MessageSquare className="w-10 h-10 text-neutral-300 mb-4" />
              <p className="text-xs font-black uppercase tracking-widest text-neutral-700">Chưa có đánh giá nào</p>
              <p className="text-xs text-neutral-400 mt-2 font-medium">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="py-6 first:pt-0 last:pb-0 relative overflow-hidden group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FBF8F3] rounded-full flex items-center justify-center font-bold text-sm text-neutral-800 border border-neutral-200/35">
                        {(review.userName || review.user?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-black">{review.userName || review.user?.name || 'Người dùng'}</p>
                        <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5">
                          {review.createdAt ? format(new Date(review.createdAt), 'dd/MM/yyyy HH:mm') : 'Vừa xong'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={cn(
                            'w-3.5 h-3.5 stroke-[1.2]',
                            s <= review.rating ? 'fill-black text-black' : 'text-neutral-200 fill-none'
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {(review.productVariant || review.variant) && (
                    <div className="mb-3.5 text-[9px] font-black text-neutral-500 uppercase tracking-widest bg-[#FBF8F3] py-1 px-2.5 border border-neutral-200/35 rounded-sm w-fit">
                      Phân loại: <span className="text-black">
                        {review.productVariant?.name || review.variant?.label || review.variant?.sku}
                      </span>
                    </div>
                  )}

                  <p className="text-xs text-neutral-600 leading-relaxed mb-4 font-semibold">
                    {review.comment || review.content}
                  </p>

                  {review.tags && review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {review.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 bg-neutral-50 text-[9px] font-bold text-neutral-500 rounded-sm border border-neutral-200/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Admin Replies Bubble */}
                  {((review.replies && review.replies.length > 0) || review.reply) && (
                    <div className="flex flex-col gap-3.5 pl-5 border-l border-[#5c4e43] mt-5 bg-[#FBF8F3] p-4 rounded-sm border border-l-0 border-neutral-200/35">
                      <p className="text-[9px] font-black uppercase text-[#5c4e43] tracking-widest">
                        Phản hồi từ quản trị viên
                      </p>
                      {review.replies && review.replies.map((reply) => (
                        <div key={reply.id} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-xs text-black">
                              {reply.adminName || 'Quản trị viên'}
                            </span>
                            <span className="text-[9px] text-neutral-400 font-bold">
                              {reply.createdAt ? format(new Date(reply.createdAt), 'dd/MM/yyyy HH:mm') : ''}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 leading-relaxed font-semibold">
                            {reply.content}
                          </p>
                        </div>
                      ))}
                      {review.reply && (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-xs text-black">
                              {review.reply.repliedBy?.name || 'Quản trị viên'}
                            </span>
                            <span className="text-[9px] text-gray-400 font-bold">
                              {review.reply.createdAt ? format(new Date(review.reply.createdAt), 'dd/MM/yyyy HH:mm') : ''}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 leading-relaxed font-semibold">
                            {review.reply.content}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2 pt-6">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="w-10 h-10 rounded-sm bg-white text-neutral-400 text-xs font-bold hover:bg-neutral-50 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center border border-neutral-200 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={cn(
                        'w-10 h-10 rounded-sm text-xs font-black transition-all border cursor-pointer',
                        page === p
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-neutral-400 border-neutral-200 hover:bg-neutral-50 hover:text-black'
                      )}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="w-10 h-10 rounded-sm bg-white text-neutral-400 text-xs font-bold hover:bg-neutral-50 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center border border-neutral-200 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modern Dialog/Modal for Submitting Review */}
      {isOpenModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center">
          {/* Overlay background */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsOpenModal(false)} />

          {/* Modal Container */}
          <div className="relative bg-white w-full max-w-lg mx-4 rounded-sm shadow-2xl overflow-hidden border border-neutral-200/50 animate-in fade-in zoom-in-95 duration-200 z-110">
            <div className="flex justify-between items-center border-b border-neutral-100 px-6 py-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-2">
                <MessageSquare className="w-4.5 h-4.5 text-black" />
                Viết đánh giá sản phẩm
              </h3>
              <button
                onClick={() => setIsOpenModal(false)}
                className="text-neutral-400 hover:text-black transition-colors rounded-full p-1 hover:bg-neutral-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 space-y-5">
              {/* Product Card Info */}
              <div className="flex items-center gap-4 bg-[#FBF8F3] p-4 rounded-sm border border-neutral-200/35">
                {product.thumbnail && (
                  <img
                    src={product.thumbnail.url}
                    alt={product.name}
                    className="w-12 h-12 rounded-sm object-cover border border-neutral-200/50"
                  />
                )}
                <div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400">Đánh giá cho</span>
                  <h4 className="font-black text-xs text-black line-clamp-1">{product.name}</h4>
                </div>
              </div>

              {/* Star Rating Selector */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  Mức độ hài lòng *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setHoveredRating(s)}
                      onMouseLeave={() => setHoveredRating(null)}
                      className="p-0.5 transition-transform active:scale-90 cursor-pointer"
                    >
                      <Star
                        className={cn(
                          'w-7 h-7 transition-colors stroke-[1.2]',
                          s <= (hoveredRating !== null ? hoveredRating : rating)
                            ? 'fill-black text-black'
                            : 'text-neutral-200 fill-none'
                        )}
                      />
                    </button>
                  ))}
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#5c4e43] ml-2">
                    {(hoveredRating !== null ? hoveredRating : rating) === 5
                      ? 'Rất tốt'
                      : (hoveredRating !== null ? hoveredRating : rating) === 4
                      ? 'Tốt'
                      : (hoveredRating !== null ? hoveredRating : rating) === 3
                      ? 'Bình thường'
                      : (hoveredRating !== null ? hoveredRating : rating) === 2
                      ? 'Tệ'
                      : 'Rất tệ'}
                  </span>
                </div>
              </div>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    Phân loại biến thể đã mua (Tùy chọn)
                  </label>
                  <select
                    value={selectedVariantId}
                    onChange={(e) => setSelectedVariantId(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-2.5 text-xs font-semibold text-black focus:border-black outline-none transition-all"
                  >
                    <option value="">-- Chọn biến thể (Size/Màu) --</option>
                    {product.variants.map((v) => {
                      const name = v.attributes?.map((a) => a.value).join(' / ') || `SKU: ${v.sku}`
                      return (
                        <option key={v.id} value={v.id}>
                          {name}
                        </option>
                      )
                    })}
                  </select>
                </div>
              )}

              {/* Tags Selector */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  Nhãn đánh giá nhanh
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={cn(
                          'px-3.5 py-1.5 rounded-sm text-[9px] font-black tracking-wider uppercase transition-all border cursor-pointer',
                          isSelected
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-neutral-500 border-neutral-200 hover:border-black hover:text-black'
                        )}
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Review Content Content/Comment */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  Nội dung đánh giá *
                </label>
                <textarea
                  rows={4}
                  placeholder="Hãy chia sẻ nhận xét của bạn về sản phẩm này nhé..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-sm px-4 py-3 text-xs font-semibold text-black focus:border-black outline-none transition-all resize-none"
                  required
                />
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-6 py-2.5 border border-neutral-200 text-neutral-500 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-50 transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="px-8 py-2.5 bg-black text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {submitMutation.isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductReviews
