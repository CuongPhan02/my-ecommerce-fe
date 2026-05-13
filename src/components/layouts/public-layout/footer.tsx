'use client'

import React from 'react'
import Link from 'next/link'
import { Phone, Mail, Facebook, Instagram, Youtube, ArrowRight, ChevronUp } from 'lucide-react'
import { cn } from '~/lib/utils'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerLinks = [
    {
      title: 'COOLCLUB',
      links: [
        { label: 'Tài khoản CoolClub', href: '#' },
        { label: 'Đăng ký thành viên', href: '#' },
        { label: 'Ưu đãi & Đặc quyền', href: '#' },
      ],
      extra: [
        { title: 'TÀI LIỆU - TUYỂN DỤNG', links: [
          { label: 'Tuyển dụng', href: '#' },
          { label: 'Đăng ký bản quyền', href: '#' },
        ]}
      ]
    },
    {
      title: 'CHÍNH SÁCH',
      links: [
        { label: 'Chính sách đổi trả tại cửa hàng', href: '#' },
        { label: 'Chính sách đổi trả 60 ngày online', href: '#' },
        { label: 'Chính sách khuyến mãi', href: '#' },
        { label: 'Chính sách bảo mật', href: '#' },
        { label: 'Chính sách giao hàng', href: '#' },
      ],
      extra: [
        { title: 'COOLMATE.ME', links: [
          { label: 'Lịch sử thay đổi website', href: '#' },
        ]}
      ]
    },
    {
      title: 'CHĂM SÓC KHÁCH HÀNG',
      links: [
        { label: 'Trải nghiệm mua sắm 100% hài lòng', href: '#' },
        { label: 'Hỏi đáp - FAQs', href: '#' },
      ],
      extra: [
        { title: 'KIẾN THỨC MẶC ĐẸP', links: [
          { label: 'Hướng dẫn chọn size', href: '#' },
          { label: 'Blog', href: '#' },
        ]}
      ]
    },
    {
      title: 'VỀ COOLMATE',
      links: [
        { label: 'Quy tắc ứng xử của Coolmate', href: '#' },
        { label: 'Coolmate 101', href: '#' },
        { label: 'DVKH xuất sắc', href: '#' },
        { label: 'Câu chuyện về Coolmate', href: '#' },
        { label: 'Nhà máy', href: '#' },
        { label: 'Care & Share', href: '#' },
        { label: 'Cam kết bền vững', href: '#' },
        { label: 'Tầm nhìn 2030', href: '#' },
      ]
    }
  ]

  return (
    <footer className="bg-black text-white py-16">
      <div className="main-container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 border-b border-white/10 pb-16">
          {/* Left: Feedback */}
          <div className="lg:col-span-5">
            <h2 className="text-2xl md:text-3xl font-black mb-6 tracking-tight uppercase">COOLMATE lắng nghe bạn!</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-md">
              Chúng tôi luôn trân trọng và mong đợi nhận được mọi ý kiến đóng góp từ khách hàng 
              để có thể nâng cấp trải nghiệm dịch vụ và sản phẩm tốt hơn nữa.
            </p>
            <button className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-primary hover:text-white transition-all group">
              ĐÓNG GÓP Ý KIẾN
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Center: Contact */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/5 rounded-2xl">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase font-bold tracking-wider">Hotline</p>
                <p className="text-lg font-black">1900.272737 - 028.7777.2737</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/5 rounded-2xl">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase font-bold tracking-wider">Email</p>
                <p className="text-lg font-black">Cool@coolmate.me</p>
              </div>
            </div>
          </div>

          {/* Right: Socials */}
          <div className="lg:col-span-3 flex justify-start lg:justify-end gap-3">
             {[Facebook, Instagram, Youtube, Mail, Instagram].map((Icon, idx) => (
               <Link key={idx} href="#" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                 <Icon className="w-6 h-6" />
               </Link>
             ))}
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-16">
          {footerLinks.map((col, idx) => (
            <div key={idx} className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <h3 className="font-black text-sm tracking-widest uppercase">{col.title}</h3>
                <div className="flex flex-col gap-2">
                  {col.links.map((link, lIdx) => (
                    <Link key={lIdx} href={link.href} className="text-gray-400 text-sm hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              {col.extra && col.extra.map((extra, eIdx) => (
                <div key={eIdx} className="flex flex-col gap-4">
                  <h3 className="font-black text-sm tracking-widest uppercase">{extra.title}</h3>
                  <div className="flex flex-col gap-2">
                    {extra.links.map((link, lIdx) => (
                      <Link key={lIdx} href={link.href} className="text-gray-400 text-sm hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Address Column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <h3 className="font-black text-sm tracking-widest uppercase">ĐỊA CHỈ LIÊN HỆ</h3>
            <div className="flex flex-col gap-6 text-xs text-gray-400 leading-relaxed">
              <p>
                <span className="text-white font-bold block mb-1">Cửa hàng:</span>
                B2-R4, Tầng B2, Vincom Center, 191 Bà Triệu, Hai Bà Trưng, Hà Nội
              </p>
              <p>
                <span className="text-white font-bold block mb-1">Văn phòng Hà Nội:</span>
                Tầng 3-4, Tòa nhà BMM, Km2, Đường Phùng Hưng, Phường Phúc La, Quận Hà Đông, Hà Nội
              </p>
              <p>
                <span className="text-white font-bold block mb-1">Trung tâm vận hành Hà Nội:</span>
                Lô C8, KCN Lại Yên, Xã Lại Yên, Huyện Hoài Đức, Hà Nội
              </p>
              <p>
                <span className="text-white font-bold block mb-1">Văn phòng & Trung tâm vận hành TP.HCM:</span>
                Lô C3, Đường D2, KCN Cát Lái, Thạnh Mỹ Lợi, TP. Thủ Đức, TP. Hồ Chí Minh
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <p className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">
              @ CÔNG TY TNHH FASTECH ASIA
            </p>
            <p className="text-[10px] text-gray-600 mt-1">
              Mã số doanh nghiệp: 0108617038. Giấy chứng nhận đăng ký doanh nghiệp do Sở Kế hoạch và Đầu tư TP Hà Nội cấp lần đầu ngày 20/02/2019.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
             {/* Simple trust badges/logos placeholders */}
             <div className="h-10 w-24 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-[10px] font-bold text-gray-500 italic">NCSC</div>
             <div className="h-10 w-24 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-[10px] font-bold text-gray-500 italic">DMCA</div>
             <div className="h-10 w-24 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-[10px] font-bold text-gray-500 italic">BỘ CÔNG THƯƠNG</div>
          </div>
        </div>
      </div>

      {/* Floating Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
         <button className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
           <span className="font-bold text-xs tracking-tighter">Zalo</span>
         </button>
         <button 
           onClick={scrollToTop}
           className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:bg-primary hover:text-white transition-all group"
         >
           <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
         </button>
      </div>
    </footer>
  )
}

export default Footer
