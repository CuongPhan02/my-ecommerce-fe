'use client'

import React from 'react'
import { ChevronDown, Info } from 'lucide-react'
import { cn } from '~/lib/utils'

const ShippingForm = () => {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-2xl font-black uppercase tracking-tight">Thông tin vận chuyển</h2>

      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100 mb-2">
        <div className="pt-1"><input type="checkbox" defaultChecked className="w-4 h-4 accent-black" /></div>
        <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
           Bằng việc ấn nút đặt hàng, bạn xác nhận là đã đọc và hiểu về <span className="text-blue-600 font-bold hover:underline cursor-pointer">chính sách bảo mật</span> dữ liệu cá nhân của Coolmate. <span className="text-blue-600 font-bold hover:underline cursor-pointer">Tại đây</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Họ tên</label>
          <div className="flex border rounded-2xl overflow-hidden focus-within:border-black transition-all">
             <button className="flex items-center gap-2 px-4 bg-gray-50 border-r text-sm font-bold">
                Anh/Chị
                <ChevronDown className="w-3.5 h-3.5" />
             </button>
             <input 
               type="text" 
               placeholder="Nhập họ tên của bạn" 
               className="flex-1 py-3.5 px-4 text-sm font-bold placeholder:font-medium placeholder:text-gray-300 focus:outline-none"
             />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Số điện thoại</label>
          <input 
            type="tel" 
            placeholder="Nhập số điện thoại" 
            className="w-full py-3.5 px-6 border rounded-2xl text-sm font-bold placeholder:font-medium placeholder:text-gray-300 focus:border-black focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</label>
        <input 
          type="email" 
          placeholder="Nhập email của bạn" 
          className="w-full py-3.5 px-6 border rounded-2xl text-sm font-bold placeholder:font-medium placeholder:text-gray-300 focus:border-black focus:outline-none transition-all"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Địa chỉ (tòa nhà, tên đường...)</label>
        <input 
          type="text" 
          placeholder="Nhập địa chỉ" 
          className="w-full py-3.5 px-6 border rounded-2xl text-sm font-bold placeholder:font-medium placeholder:text-gray-300 focus:border-black focus:outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tỉnh / Thành phố</label>
          <button className="flex items-center justify-between py-3.5 px-6 border rounded-2xl text-sm font-bold text-gray-300 focus:border-black hover:border-gray-300 transition-all">
             Chọn Tỉnh/Thành phố
             <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quận / Huyện</label>
          <button className="flex items-center justify-between py-3.5 px-6 border rounded-2xl text-sm font-bold text-gray-300 focus:border-black hover:border-gray-300 transition-all disabled:opacity-50" disabled>
             Chọn Quận/Huyện
             <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ghi chú (Tùy chọn)</label>
        <textarea 
          placeholder="Ví dụ: Giao giờ hành chính" 
          className="w-full py-3.5 px-6 border rounded-2xl text-sm font-bold placeholder:font-medium placeholder:text-gray-300 focus:border-black focus:outline-none transition-all min-h-[100px] resize-none"
        />
      </div>
    </div>
  )
}

export default ShippingForm
