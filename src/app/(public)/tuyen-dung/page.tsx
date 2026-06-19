'use client'

import React from 'react'
import { motion } from 'motion/react'
import { Briefcase, ArrowLeft } from 'lucide-react'
import { Link } from 'next-view-transitions'

export default function RecruitmentPage() {
  return (
    <main className="bg-white text-[#231f20] min-h-screen py-16 px-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5c4e43] hover:text-black transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
        </Link>

        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-[#FBF8F3] border border-solid border-[#e8e0d6] rounded-full flex items-center justify-center text-[#5c4e43] mx-auto shadow-sm">
            <Briefcase className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-heading font-black uppercase tracking-wider text-black">
            Cơ hội nghề nghiệp
          </h1>
          <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">
            Gia nhập đội ngũ LUNÉ
          </p>
        </div>

        <hr className="border-neutral-100" />

        <div className="space-y-6 text-sm text-neutral-600 font-medium leading-relaxed">
          <p>
            Chào mừng bạn đến với trang tuyển dụng của LUNÉ. Chúng tôi luôn tìm kiếm những tài năng trẻ năng động, sáng tạo và có cùng niềm đam mê thời trang tối giản để cùng nhau xây dựng thương hiệu thời trang cao cấp của Việt Nam.
          </p>
          <p>
            Hiện tại, chúng tôi đang tuyển dụng các vị trí sau tại văn phòng TP. Hồ Chí Minh:
          </p>
          
          <div className="space-y-4 pt-4">
            <div className="border border-solid border-neutral-100 rounded-lg p-5 bg-[#FBF8F3] hover:border-neutral-300 transition-all">
              <h3 className="font-bold text-black text-base">1. Nhân viên thiết kế thời trang (Fashion Designer)</h3>
              <p className="text-xs text-[#5c4e43] font-semibold mt-1">Số lượng: 01 | Phòng Thiết Kế</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                <li>Phác thảo ý tưởng và thiết kế các bộ sưu tập mới của LUNÉ.</li>
                <li>Lựa chọn chất liệu vải và theo dõi quy trình may mẫu.</li>
                <li>Yêu cầu: Có tối thiểu 1 năm kinh nghiệm thiết kế thời trang nữ tối giản.</li>
              </ul>
            </div>

            <div className="border border-solid border-neutral-100 rounded-lg p-5 bg-[#FBF8F3] hover:border-neutral-300 transition-all">
              <h3 className="font-bold text-black text-base">2. Nhân viên bán hàng (Store Consultant)</h3>
              <p className="text-xs text-[#5c4e43] font-semibold mt-1">Số lượng: 03 | Bộ Phận Bán Lẻ</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                <li>Tư vấn sản phẩm và phối đồ cho khách hàng tại cửa hàng.</li>
                <li>Hỗ trợ sắp xếp, trưng bày sản phẩm theo quy chuẩn của LUNÉ.</li>
                <li>Yêu cầu: Ngoại hình ưa nhìn, giao tiếp tốt, yêu thích thời trang.</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-100 text-center">
            <p className="text-xs font-bold text-black uppercase tracking-wider">Cách thức ứng tuyển</p>
            <p className="text-xs text-neutral-500 mt-1">
              Vui lòng gửi CV và Portfolio của bạn về email: <strong className="text-black">hr@lune.vn</strong> với tiêu đề [Ứng Tuyển] - [Vị Trí] - [Tên của bạn]
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
