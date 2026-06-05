'use client'

import React from 'react'
import { Truck, RotateCcw, Award, Headphones } from 'lucide-react'

const benefits = [
  {
    icon: Truck,
    title: 'Miễn phí vận chuyển',
    desc: 'Cho đơn hàng từ 800.000đ',
  },
  {
    icon: RotateCcw,
    title: 'Đổi trả dễ dàng',
    desc: 'Trong vòng 7 ngày',
  },
  {
    icon: Award,
    title: 'Sản phẩm chất lượng',
    desc: 'Được chọn lọc kỹ lưỡng',
  },
  {
    icon: Headphones,
    title: 'Hỗ trợ tận tâm',
    desc: '24/7 cho mọi khách hàng',
  },
]

export default function BenefitsSection() {
  return (
    <section className='bg-[#FBF8F3] border-y border-neutral-200/50 py-8 md:py-10 select-none'>
      <div className='max-w-[1400px] mx-auto px-6 md:px-12'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 divide-y sm:divide-y-0 lg:divide-x divide-neutral-200/60'>
          {benefits.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className='flex flex-col items-center text-center p-4 lg:p-2 gap-3 transition-transform duration-300 hover:scale-[1.02] sm:first:pt-0 sm:pt-4 lg:pt-0'
              >
                <div className='w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-neutral-800 border border-neutral-100'>
                  <Icon className='w-5 h-5 stroke-[1.5]' />
                </div>
                <div className='space-y-1'>
                  <h3 className='text-xs font-black uppercase tracking-wider text-neutral-900'>
                    {item.title}
                  </h3>
                  <p className='text-[11px] font-medium text-neutral-500'>
                    {item.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
