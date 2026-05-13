'use client'

import React, { useState } from 'react'
import { Star, Search, Filter, MessageSquare, ThumbsUp, Camera } from 'lucide-react'
import { cn } from '~/lib/utils'

const mockReviews = [
  {
    id: 1,
    user: 'Phạm Tiến Đạt',
    date: '01/12/2025',
    rating: 5,
    size: 'M',
    color: 'Đen',
    comment: 'Áo Nỉ chui đầu Lifewear mềm mại, giữ ấm tốt, thiết kế đơn giản dễ phối và thoải mái khi mặc.',
    tags: ['Sản phẩm đẹp', 'Giá tốt', 'Đóng gói đẹp', 'Giao hàng nhanh'],
    likes: 12
  },
  {
    id: 2,
    user: 'Chu Văn Thái',
    date: '13/11/2025',
    rating: 4,
    size: 'L',
    color: 'Xám',
    comment: 'Form áo hơi rộng so với mình nhưng chất nỉ rất thích, mặc mùa đông thì tuyệt vời.',
    tags: ['Chất lượng cao', 'Giao hàng nhanh'],
    likes: 5
  }
]

const ProductReviews = () => {
  const [activeFilter, setActiveFilter] = useState('all')

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
                <span className="text-7xl font-black block leading-none">4.9</span>
                <div className="flex items-center justify-center gap-1 mt-2">
                   {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-black text-black" />)}
                </div>
                <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-widest">Dựa trên 1.2k đánh giá</p>
              </div>
              
              <div className="flex-1 flex flex-col gap-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-xs font-black w-3">{stars}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-black rounded-full" 
                        style={{ width: `${stars === 5 ? 85 : stars === 4 ? 12 : 1}%` }} 
                      />
                    </div>
                    <span className="text-xs text-gray-400 font-bold w-10">{stars === 5 ? '85%' : stars === 4 ? '12%' : '1%'}</span>
                  </div>
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
                    className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-black rounded-xl py-3 pl-12 pr-4 text-sm font-medium transition-all"
                  />
               </div>
               
               <div className="flex flex-col gap-4">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500">Phân loại xếp hạng</p>
                  <div className="flex flex-wrap gap-2">
                    {['Tất cả', '5 Sao', '4 Sao', '3 Sao', '2 Sao', '1 Sao', 'Có hình ảnh'].map((f) => (
                      <button 
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-xs font-bold transition-all border",
                          activeFilter === f ? "bg-black text-white border-black" : "bg-gray-50 text-gray-500 border-transparent hover:border-gray-200"
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            {/* Write Review Button */}
            <button className="w-full py-4 bg-white border-2 border-black rounded-2xl font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3">
              <MessageSquare className="w-5 h-5" />
              Viết đánh giá của bạn
            </button>
          </div>

          {/* Right: Review List */}
          <div className="lg:col-span-8 flex flex-col gap-6">
             {mockReviews.map((review) => (
               <div key={review.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-black text-lg">
                         {review.user.charAt(0)}
                       </div>
                       <div>
                         <p className="font-black text-sm">{review.user}</p>
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{review.date}</p>
                       </div>
                    </div>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => <Star key={s} className={cn("w-3 h-3 fill-current", s <= review.rating ? "text-black" : "text-gray-200")} />)}
                    </div>
                  </div>

                  <div className="flex gap-4 mb-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <span>Kích thước: <span className="text-black">{review.size}</span></span>
                    <span>Màu sắc: <span className="text-black">{review.color}</span></span>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed mb-6 font-medium">
                    {review.comment}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {review.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-50 text-[10px] font-bold text-gray-500 rounded-full border border-gray-100">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black transition-colors group">
                        <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Hữu ích ({review.likes})
                      </button>
                      <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        Phản hồi
                      </button>
                    </div>
                    <button className="text-[10px] font-black text-gray-300 hover:text-red-500 transition-colors uppercase tracking-widest">Báo cáo</button>
                  </div>
               </div>
             ))}
             
             {/* Pagination */}
             <div className="flex justify-center mt-8 gap-2">
                <button className="w-10 h-10 rounded-full bg-black text-white text-sm font-bold shadow-lg">1</button>
                <button className="w-10 h-10 rounded-full bg-white text-gray-400 text-sm font-bold hover:bg-gray-100 transition-all">2</button>
                <button className="w-10 h-10 rounded-full bg-white text-gray-400 text-sm font-bold hover:bg-gray-100 transition-all">3</button>
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductReviews
