'use client'

import React from 'react'
import { ArrowLeft, FileText } from 'lucide-react'
import { Link } from 'next-view-transitions'

export default function TermsOfUsePage() {
  return (
    <main className="bg-white text-[#231f20] min-h-screen py-16 px-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5c4e43] hover:text-black transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
        </Link>

        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-[#FBF8F3] border border-solid border-[#e8e0d6] rounded-full flex items-center justify-center text-[#5c4e43] mx-auto shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-heading font-black uppercase tracking-wider text-black">
            Điều khoản sử dụng
          </h1>
          <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">
            Quy định chung khi truy cập website LUNÉ
          </p>
        </div>

        <hr className="border-neutral-100" />

        <div className="space-y-6 text-sm text-neutral-600 font-medium leading-relaxed">
          <p>
            Chào mừng bạn đến với website của LUNÉ. Khi bạn truy cập, đăng ký tài khoản hoặc tiến hành mua hàng tại website của chúng tôi, đồng nghĩa với việc bạn đồng ý tuân thủ và chịu ràng buộc bởi các điều khoản sử dụng dưới đây.
          </p>

          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-black text-base">1. Quyền sở hữu trí tuệ</h3>
            <p className="text-xs text-neutral-500">
              Toàn bộ nội dung, hình ảnh thiết kế, logo, văn bản và mã nguồn trên website này đều thuộc quyền sở hữu trí tuệ độc quyền của LUNÉ. Nghiêm cấm mọi hành vi sao chép, phân phối hoặc sử dụng lại nội dung cho mục đích thương mại khi chưa được LUNÉ đồng ý bằng văn bản.
            </p>

            <h3 className="font-bold text-black text-base">2. Trách nhiệm người dùng</h3>
            <p className="text-xs text-neutral-500">
              Khách hàng chịu trách nhiệm bảo mật tài khoản đăng nhập của mình và cam kết cung cấp các thông tin liên hệ, giao hàng chính xác khi đặt hàng. Không sử dụng các phần mềm can thiệp trái phép làm ảnh hưởng đến hoạt động và bảo mật hệ thống.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
