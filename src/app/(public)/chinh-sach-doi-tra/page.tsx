'use client'

import React from 'react'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { Link } from 'next-view-transitions'

export default function ReturnPolicyPage() {
  return (
    <main className="bg-white text-[#231f20] min-h-screen py-16 px-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5c4e43] hover:text-black transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
        </Link>

        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-[#FBF8F3] border border-solid border-[#e8e0d6] rounded-full flex items-center justify-center text-[#5c4e43] mx-auto shadow-sm">
            <RefreshCw className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-heading font-black uppercase tracking-wider text-black">
            Chính sách đổi trả
          </h1>
          <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">
            Quyền lợi tối đa cho khách hàng LUNÉ
          </p>
        </div>

        <hr className="border-neutral-100" />

        <div className="space-y-6 text-sm text-neutral-600 font-medium leading-relaxed">
          <p>
            Tại LUNÉ, chúng tôi trân trọng sự hài lòng của khách hàng trên từng sản phẩm. Do đó, chúng tôi áp dụng chính sách đổi trả dễ dàng và linh hoạt nhằm bảo vệ tối đa quyền lợi mua sắm của bạn.
          </p>

          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-black text-base">1. Điều kiện đổi trả</h3>
            <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-500">
              <li>Sản phẩm được đổi trả trong vòng <strong>7 ngày</strong> kể từ ngày nhận hàng thành công.</li>
              <li>Sản phẩm còn nguyên nhãn mác, tag treo, chưa qua sử dụng, giặt là hoặc có mùi lạ.</li>
              <li>Có hóa đơn mua hàng hoặc thông tin đặt hàng trùng khớp trên hệ thống LUNÉ.</li>
            </ul>

            <h3 className="font-bold text-black text-base">2. Các trường hợp được đổi trả</h3>
            <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-500">
              <li>Sản phẩm bị lỗi kỹ thuật từ nhà sản xuất (đứt chỉ, rách vải, hỏng khóa kéo).</li>
              <li>Sản phẩm giao không đúng size, đúng mẫu mã như khách hàng đã đặt.</li>
              <li>Khách hàng muốn đổi size hoặc đổi sang mẫu khác có giá trị tương đương hoặc cao hơn.</li>
            </ul>

            <h3 className="font-bold text-black text-base">3. Quy trình thực hiện</h3>
            <p className="text-xs text-neutral-500">
              Bước 1: Liên hệ bộ phận CSKH qua Hotline hoặc Chatbot để xác nhận yêu cầu đổi trả.<br />
              Bước 2: Gửi sản phẩm về địa chỉ kho của LUNÉ.<br />
              Bước 3: LUNÉ nhận hàng, kiểm tra điều kiện và thực hiện đổi hàng mới hoặc hoàn tiền trong vòng 3-5 ngày làm việc.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
