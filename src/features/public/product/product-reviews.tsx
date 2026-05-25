'use client'

import React, { useState } from 'react'
import { Star, Search, MessageSquare, ThumbsUp, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Product } from '~/features/admin/product/types'
import { _productService } from './product.query'
import { getAccessToken } from '~/config/https'
import { toast } from 'react-toastify'
import { format } from 'date-fns'

interface ProductReviewsProps {
  product: Product
}

const ProductReviews = ({ product }: ProductReviewsProps) => {
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
    <section className="bg-gray-50 py-20">
      <div className="main-container mx-auto px-4">
        <h2 className="text-3xl font-black uppercase tracking-tight mb-12">ĐÁNH GIÁ SẢN PHẨM</h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Summary & Filters */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            {/* Summary */}
            <div className="flex items-center gap-8">
              <div className="text-center">
                <span className="text-7xl font-black block leading-none">{averageRating}</span>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        'w-4 h-4 fill-black text-black',
                        s <= Math.round(Number(averageRating)) ? 'fill-black text-black' : 'text-gray-200 fill-none'
                      )}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-widest">
                  Dựa trên {totalStatsCount} đánh giá
                </p>
              </div>

              <div className="flex-1 flex flex-col gap-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setActiveRatingFilter(activeRatingFilter === stars ? null : stars)}
                    className={cn(
                      'flex items-center gap-3 w-full text-left p-1 rounded-lg transition-colors hover:bg-gray-100',
                      activeRatingFilter === stars ? 'bg-gray-100 font-bold' : ''
                    )}
                  >
                    <span className="text-xs font-black w-3">{stars}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: `${getRatingPercent(stars)}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 font-bold w-12 text-right">
                      {getRatingPercent(stars)}% ({getRatingCount(stars)})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Filters */}
            <div className="flex flex-col gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm đánh giá..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-black rounded-xl py-3 pl-12 pr-4 text-sm font-medium transition-all outline-none"
                />
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-xs font-black uppercase tracking-widest text-gray-500">Phân loại xếp hạng</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveRatingFilter(null)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-xs font-bold transition-all border',
                      activeRatingFilter === null
                        ? 'bg-black text-white border-black shadow-lg shadow-black/10'
                        : 'bg-gray-50 text-gray-500 border-transparent hover:border-gray-200'
                    )}
                  >
                    Tất cả ({totalStatsCount})
                  </button>
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <button
                      key={stars}
                      onClick={() => setActiveRatingFilter(stars)}
                      className={cn(
                        'px-4 py-2 rounded-lg text-xs font-bold transition-all border flex items-center gap-1',
                        activeRatingFilter === stars
                          ? 'bg-black text-white border-black shadow-lg shadow-black/10'
                          : 'bg-gray-50 text-gray-500 border-transparent hover:border-gray-200'
                      )}
                    >
                      {stars} <Star className="w-3 h-3 fill-current" /> ({getRatingCount(stars)})
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
                  return
                }
                setIsOpenModal(true)
              }}
              className="w-full py-4 bg-white border-2 border-black rounded-2xl font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3 shadow-lg shadow-black/5 active:scale-[0.98]"
            >
              <MessageSquare className="w-5 h-5" />
              Viết đánh giá của bạn
            </button>
          </div>

          {/* Right: Review List */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Đang tải đánh giá...</p>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 text-center px-6">
                <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-lg font-black uppercase tracking-tight text-gray-700">Chưa có đánh giá nào</p>
                <p className="text-sm text-gray-400 mt-2 font-medium">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
              </div>
            ) : (
              <>
                {filteredReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-black text-lg text-black border border-gray-200">
                          {review.userName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-black text-sm">{review.userName || 'Người dùng'}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            {review.createdAt ? format(new Date(review.createdAt), 'dd/MM/yyyy HH:mm') : 'Mới đây'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={cn(
                              'w-3 h-3 fill-current',
                              s <= review.rating ? 'text-black' : 'text-gray-200 fill-none'
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    {review.productVariant && (
                      <div className="flex gap-4 mb-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50 py-1.5 px-3 rounded-lg w-fit">
                        <span>Biến thể: <span className="text-black">{review.productVariant.name}</span></span>
                      </div>
                    )}

                    <p className="text-sm text-gray-700 leading-relaxed mb-6 font-medium">
                      {review.comment || review.content}
                    </p>

                    {review.tags && review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {review.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-gray-50 text-[10px] font-bold text-gray-500 rounded-full border border-gray-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Admin Replies Bubble */}
                    {review.replies && review.replies.length > 0 && (
                      <div className="flex flex-col gap-4 pl-6 border-l-2 border-black mt-6 bg-gray-50/50 p-4 rounded-r-2xl">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                          Phản hồi từ quản trị viên
                        </p>
                        {review.replies.map((reply) => (
                          <div key={reply.id} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-xs text-black">
                                {reply.adminName || 'Quản trị viên'}
                              </span>
                              <span className="text-[9px] text-gray-400 font-bold">
                                {reply.createdAt ? format(new Date(reply.createdAt), 'dd/MM/yyyy') : ''}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                              {reply.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="w-10 h-10 rounded-full bg-white text-gray-400 text-sm font-bold hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center border"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={cn(
                          'w-10 h-10 rounded-full text-sm font-bold transition-all border',
                          page === p
                            ? 'bg-black text-white border-black shadow-lg shadow-black/10'
                            : 'bg-white text-gray-400 hover:bg-gray-100'
                        )}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                      className="w-10 h-10 rounded-full bg-white text-gray-400 text-sm font-bold hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center border"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modern Dialog/Modal for Submitting Review */}
      {isOpenModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center">
          {/* Overlay background */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsOpenModal(false)} />

          {/* Modal Container */}
          <div className="relative bg-white w-full max-w-lg mx-4 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200 z-110">
            <div className="flex justify-between items-center border-b border-gray-100 px-6 py-5">
              <h3 className="text-lg font-black uppercase tracking-tight text-black flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-black" />
                Viết đánh giá sản phẩm
              </h3>
              <button
                onClick={() => setIsOpenModal(false)}
                className="text-gray-400 hover:text-black transition-colors rounded-full p-1 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
              {/* Product Card Info */}
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                {product.thumbnail && (
                  <img
                    src={product.thumbnail.url}
                    alt={product.name}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                  />
                )}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Đánh giá cho</span>
                  <h4 className="font-black text-sm text-black line-clamp-1">{product.name}</h4>
                </div>
              </div>

              {/* Star Rating Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500">
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
                      className="p-1 transition-transform active:scale-90"
                    >
                      <Star
                        className={cn(
                          'w-8 h-8 transition-colors',
                          s <= (hoveredRating !== null ? hoveredRating : rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-200 fill-none'
                        )}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">
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
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500">
                    Phân loại biến thể đã mua (Tùy chọn)
                  </label>
                  <select
                    value={selectedVariantId}
                    onChange={(e) => setSelectedVariantId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-black focus:bg-white focus:border-black outline-none transition-all"
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
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500">
                  Nhãn đánh giá nhanh
                </label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-bold transition-all border',
                          isSelected
                            ? 'bg-black text-white border-black shadow-md shadow-black/10'
                            : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'
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
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500">
                  Nội dung đánh giá *
                </label>
                <textarea
                  rows={4}
                  placeholder="Hãy chia sẻ nhận xét của bạn về sản phẩm này nhé..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium text-black focus:bg-white focus:border-black outline-none transition-all resize-none"
                  required
                />
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-6 py-3 border-2 border-gray-200 text-gray-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 active:scale-[0.98] transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="px-8 py-3 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitMutation.isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductReviews
