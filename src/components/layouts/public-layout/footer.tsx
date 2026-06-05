'use client'

import React from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Youtube, Music, ChevronUp } from 'lucide-react'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="w-full select-none text-neutral-800">
      
      {/* 1. Top Newsletter Banner (Cream Background) */}
      <div className="bg-[#FBF8F3] border-t border-b border-neutral-200/40 py-10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-1">
            <h3 className="font-heading tracking-[0.15em] text-lg font-black text-black uppercase">
              Đăng ký nhận tin
            </h3>
            <p className="text-xs text-neutral-500 font-medium">
              Nhận ngay 10% ưu đãi cho đơn hàng đầu tiên
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="flex items-center w-full max-w-md">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 bg-white border border-neutral-200 rounded-l-none py-3 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all text-neutral-900 placeholder-neutral-400 font-medium shadow-sm"
            />
            <button
              type="submit"
              className="bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 transition-colors shrink-0"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </div>

      {/* 2. Main Footer Links & Info (White Background) */}
      <div className="bg-white py-14">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12">
            
            {/* Column 1: Brand & Socials (4 columns) */}
            <div className="lg:col-span-4 space-y-4 text-left">
              <h2 className="font-heading tracking-[0.2em] text-2xl font-black text-black">
                L U N É
              </h2>
              <p className="text-xs text-neutral-500 font-medium leading-relaxed max-w-xs">
                Thời trang tối giản, tinh tế và bền vững. Dành cho những người phụ nữ hiện đại.
              </p>
              
              <div className="flex items-center gap-4 text-neutral-500 pt-2">
                <a href="#" className="hover:text-black transition-colors" aria-label="Facebook">
                  <Facebook className="w-4 h-4 stroke-[1.5]" />
                </a>
                <a href="#" className="hover:text-black transition-colors" aria-label="Instagram">
                  <Instagram className="w-4 h-4 stroke-[1.5]" />
                </a>
                <a href="#" className="hover:text-black transition-colors" aria-label="TikTok">
                  <Music className="w-4 h-4 stroke-[1.5]" />
                </a>
                <a href="#" className="hover:text-black transition-colors" aria-label="YouTube">
                  <Youtube className="w-4 h-4 stroke-[1.5]" />
                </a>
              </div>
            </div>

            {/* Columns 2-5: Nav columns (8 columns total) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
              
              {/* Column 2: VỀ CHÚNG TÔI */}
              <div className="space-y-4 text-left">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-black">
                  Về chúng tôi
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/about" className="text-xs text-neutral-500 hover:text-black transition-colors">
                      Giới thiệu
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-xs text-neutral-500 hover:text-black transition-colors">
                      Story
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-xs text-neutral-500 hover:text-black transition-colors">
                      Hoạt động thiện nguyện
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-xs text-neutral-500 hover:text-black transition-colors">
                      Tuyển dụng
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-xs text-neutral-500 hover:text-black transition-colors">
                      Liên hệ
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: HỖ TRỢ */}
              <div className="space-y-4 text-left">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-black">
                  Hỗ trợ
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-xs text-neutral-500 hover:text-black transition-colors">
                      Hướng dẫn mua hàng
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-xs text-neutral-500 hover:text-black transition-colors">
                      Chính sách đổi trả
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-xs text-neutral-500 hover:text-black transition-colors">
                      Chính sách bảo mật
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-xs text-neutral-500 hover:text-black transition-colors">
                      Điều khoản sử dụng
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-xs text-neutral-500 hover:text-black transition-colors">
                      Câu hỏi thường gặp
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 4: THÔNG TIN */}
              <div className="space-y-4 text-left">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-black">
                  Thông tin
                </h3>
                <ul className="space-y-2 text-xs text-neutral-500 font-medium leading-relaxed">
                  <li>Hotline: 1900 1234</li>
                  <li>Email: hello@lune.vn</li>
                  <li>Thời gian: 8:00 - 22:00</li>
                  <li>T2 - CN</li>
                </ul>
              </div>

              {/* Column 5: THANH TOÁN */}
              <div className="space-y-4 text-left">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-black">
                  Thanh toán
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <div className="border border-neutral-200 rounded px-2 py-1 text-[8px] font-black text-blue-800 tracking-wider bg-white select-none">VISA</div>
                  <div className="border border-neutral-200 rounded px-2 py-1 text-[8px] font-black text-red-600 tracking-wider bg-white select-none">MC</div>
                  <div className="border border-neutral-200 rounded px-2 py-1 text-[8px] font-black text-pink-600 tracking-wider bg-white select-none">MOMO</div>
                  <div className="border border-neutral-200 rounded px-2 py-1 text-[8px] font-black text-blue-600 tracking-wider bg-white select-none">VNPAY</div>
                  <div className="border border-neutral-200 rounded px-2 py-1 text-[8px] font-black text-neutral-600 tracking-wider bg-white select-none">COD</div>
                </div>
              </div>

            </div>
          </div>

          {/* Footer Copyright Bottom Bar */}
          <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-neutral-400 font-medium">
            <p>© 2025 LUNÉ. All rights reserved.</p>
            <p>Thiết kế bởi <span className="font-bold text-neutral-600">LUNÉ Team</span></p>
          </div>

        </div>
      </div>

      {/* Floating Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3.5 z-50">
        <button className="w-12 h-12 bg-[#25d366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200">
          <span className="font-black text-xs tracking-tighter uppercase font-heading">Zalo</span>
        </button>
        <button 
          onClick={scrollToTop}
          className="w-12 h-12 bg-white text-neutral-800 border border-neutral-100 rounded-full flex items-center justify-center shadow-lg hover:bg-black hover:text-white hover:border-black transition-all duration-200 group"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

    </footer>
  )
}

export default Footer
