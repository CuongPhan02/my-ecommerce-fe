'use client'

import React, { useState } from 'react'
import { ArrowLeft, MessageSquare, ChevronDown } from 'lucide-react'
import { Link } from 'next-view-transitions'

const FAQS = [
  {
    q: 'LUNÉ có giao hàng toàn quốc không và phí ship tính như thế nào?',
    a: 'Dạ có, LUNÉ giao hàng toàn quốc. Phí ship đồng giá 30.000 VNĐ cho mọi đơn hàng. Đặc biệt LUNÉ miễn phí vận chuyển đối với toàn bộ các đơn hàng có giá trị từ 500.000 VNĐ trở lên ạ.'
  },
  {
    q: 'Tôi có được thử hàng trước khi thanh toán không?',
    a: 'Dạ, đối với hình thức ship COD, anh/chị được kiểm tra sản phẩm xem đúng mẫu mã và kích thước đã đặt không trước khi thanh toán. Tuy nhiên do lý do an toàn vận chuyển, LUNÉ chưa hỗ trợ thử hàng tại chỗ ạ.'
  },
  {
    q: 'Tôi muốn thay đổi địa chỉ hoặc hủy đơn hàng đã đặt thì làm thế nào?',
    a: 'Anh/chị vui lòng liên hệ bộ phận hỗ trợ khách hàng qua hotline 1900 1234 hoặc nhắn tin trực tiếp cho Chatbot trong vòng 30 phút kể từ lúc đặt hàng để được đổi địa chỉ hoặc hủy đơn kịp thời trước khi đơn được giao cho đơn vị vận chuyển ạ.'
  }
]

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <main className="bg-white text-[#231f20] min-h-screen py-16 px-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5c4e43] hover:text-black transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
        </Link>

        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-[#FBF8F3] border border-solid border-[#e8e0d6] rounded-full flex items-center justify-center text-[#5c4e43] mx-auto shadow-sm">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-heading font-black uppercase tracking-wider text-black">
            Câu hỏi thường gặp (FAQ)
          </h1>
          <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">
            Giải đáp thắc mắc của bạn
          </p>
        </div>

        <hr className="border-neutral-100" />

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div key={idx} className="border border-solid border-neutral-100 rounded-lg overflow-hidden bg-[#FBF8F3]">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full py-4 px-5 text-left font-bold text-xs uppercase tracking-wider text-black flex justify-between items-center hover:bg-[#FAF6F0] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[200px] border-t border-solid border-neutral-200/40' : 'max-h-0'}`}>
                  <p className="p-5 text-xs text-neutral-600 font-medium leading-relaxed bg-white">
                    {faq.a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
