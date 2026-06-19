'use client'

import React from 'react'
import { ArrowLeft, Shield } from 'lucide-react'
import { Link } from 'next-view-transitions'

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white text-[#231f20] min-h-screen py-16 px-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5c4e43] hover:text-black transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
        </Link>

        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-[#FBF8F3] border border-solid border-[#e8e0d6] rounded-full flex items-center justify-center text-[#5c4e43] mx-auto shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-heading font-black uppercase tracking-wider text-black">
            Chính sách bảo mật
          </h1>
          <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">
            Bảo vệ thông tin cá nhân của bạn tại LUNÉ
          </p>
        </div>

        <hr className="border-neutral-100" />

        <div className="space-y-6 text-sm text-neutral-600 font-medium leading-relaxed">
          <p>
            LUNÉ cam kết bảo vệ tuyệt đối quyền riêng tư và thông tin cá nhân của khách hàng khi truy cập và mua sắm tại hệ thống website của chúng tôi.
          </p>

          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-black text-base">1. Thu thập thông tin</h3>
            <p className="text-xs text-neutral-500">
              Chúng tôi thu thập các thông tin cơ bản khi bạn đăng ký tài khoản hoặc đặt hàng bao gồm: Họ tên, số điện thoại, email, địa chỉ nhận hàng và lịch sử giao dịch. Thông tin này nhằm giúp việc xử lý đơn hàng và giao hàng diễn ra thuận lợi nhất.
            </p>

            <h3 className="font-bold text-black text-base">2. Sử dụng thông tin</h3>
            <p className="text-xs text-neutral-500">
              Thông tin cá nhân thu thập được chỉ sử dụng nội bộ tại LUNÉ cho các mục đích: Xác nhận đơn hàng, liên hệ giao nhận, cải tiến chất lượng dịch vụ chăm sóc khách hàng và gửi các thông tin ưu đãi độc quyền (nếu bạn đăng ký nhận newsletter).
            </p>

            <h3 className="font-bold text-black text-base">3. Bảo mật thanh toán</h3>
            <p className="text-xs text-neutral-500">
              Mọi dữ liệu giao dịch thẻ tín dụng hoặc chuyển khoản qua các cổng liên kết như VNPAY, MOMO đều được mã hóa bằng chuẩn bảo mật SSL cao cấp nhất của các ngân hàng đối tác, LUNÉ hoàn toàn không lưu trữ thông tin số thẻ hay mật khẩu thanh toán của bạn.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
