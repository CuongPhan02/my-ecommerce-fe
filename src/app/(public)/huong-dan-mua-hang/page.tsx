'use client'

import React from 'react'
import { ArrowLeft, HelpCircle } from 'lucide-react'
import { Link } from 'next-view-transitions'

export default function BuyingGuidePage() {
  return (
    <main className="bg-white text-[#231f20] min-h-screen py-16 px-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5c4e43] hover:text-black transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
        </Link>

        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-[#FBF8F3] border border-solid border-[#e8e0d6] rounded-full flex items-center justify-center text-[#5c4e43] mx-auto shadow-sm">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-heading font-black uppercase tracking-wider text-black">
            Hướng dẫn mua hàng
          </h1>
          <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">
            Mua sắm dễ dàng cùng LUNÉ
          </p>
        </div>

        <hr className="border-neutral-100" />

        <div className="space-y-6 text-sm text-neutral-600 font-medium leading-relaxed">
          <p>
            Để mang đến cho bạn trải nghiệm mua sắm tuyệt vời nhất, LUNÉ hỗ trợ việc đặt mua sản phẩm vô cùng nhanh chóng qua các bước đơn giản sau:
          </p>

          <div className="space-y-6 pt-4">
            <div className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <h3 className="font-bold text-black text-sm uppercase tracking-wider">Chọn sản phẩm</h3>
                <p className="text-xs text-neutral-500 mt-1">Duyệt qua danh mục của chúng tôi, chọn kích thước, màu sắc và thêm sản phẩm yêu thích vào giỏ hàng.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <h3 className="font-bold text-black text-sm uppercase tracking-wider">Kiểm tra giỏ hàng</h3>
                <p className="text-xs text-neutral-500 mt-1">Bấm vào biểu tượng giỏ hàng ở góc trên cùng bên phải, điều chỉnh số lượng nếu cần và bấm chọn Tiến hành thanh toán.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <h3 className="font-bold text-black text-sm uppercase tracking-wider">Điền thông tin giao hàng</h3>
                <p className="text-xs text-neutral-500 mt-1">Nhập đầy đủ thông tin nhận hàng, số điện thoại, địa chỉ cụ thể và chọn đơn vị vận chuyển phù hợp.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">4</span>
              <div>
                <h3 className="font-bold text-black text-sm uppercase tracking-wider">Chọn phương thức thanh toán</h3>
                <p className="text-xs text-neutral-500 mt-1">LUNÉ hỗ trợ nhiều phương thức linh hoạt như: COD (Thanh toán khi nhận hàng), Thẻ tín dụng/ATM hoặc ví MOMO, VNPAY.</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-100 text-center text-xs text-neutral-500">
            Cần hỗ trợ trực tiếp? Bạn có thể chat trực tiếp với trợ lý ảo <strong className="text-black">LUNÉ AI</strong> hoặc gọi hotline: <strong className="text-black">1900 1234</strong>.
          </div>
        </div>
      </div>
    </main>
  )
}
