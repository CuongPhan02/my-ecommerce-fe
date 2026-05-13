'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '~/lib/utils'

const paymentMethods = [
  { id: 'cod', name: 'Thanh toán khi nhận hàng', desc: 'Kiểm tra hàng trước khi thanh toán', icon: '🚚' },
  { id: 'zalopay', name: 'Thanh toán qua Zalopay', desc: 'Hỗ trợ mọi hình thức thanh toán', icon: '💳' },
  { id: 'applepay', name: 'Apple Pay', desc: 'Hoạt động qua cổng thanh toán ZaloPay', icon: '🍎' },
  { id: 'momo', name: 'Ví Momo', desc: 'Thanh toán qua ứng dụng MoMo', icon: '📱' },
  { id: 'vnpay', name: 'Ví điện tử VNPAY', desc: 'Quét QR để thanh toán', icon: '🏦' },
]

const PaymentSelection = () => {
  const [selected, setSelected] = useState('cod')

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-2xl font-black uppercase tracking-tight">Hình thức thanh toán</h2>
      
      <div className="flex flex-col gap-3">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={cn(
              "flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all group",
              selected === method.id ? "border-black bg-gray-50 shadow-sm" : "border-gray-100 hover:border-gray-200"
            )}
          >
            <div className="relative flex items-center justify-center">
              <input
                type="radio"
                name="payment"
                className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-full checked:border-black transition-all"
                checked={selected === method.id}
                onChange={() => setSelected(method.id)}
              />
              <div className={cn(
                "absolute w-2.5 h-2.5 bg-black rounded-full transition-all scale-0 peer-checked:scale-100"
              )} />
            </div>
            
            <div className="text-2xl w-10 flex justify-center">{method.icon}</div>
            
            <div className="flex-1">
              <p className="font-black text-sm">{method.name}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{method.desc}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl">
        <p className="text-xs text-gray-500 font-medium leading-relaxed italic">
          Nếu bạn không hài lòng với sản phẩm của chúng tôi? Bạn hoàn toàn có thể trả lại sản phẩm. 
          <span className="text-blue-600 font-bold hover:underline cursor-pointer ml-1">Tìm hiểu thêm Tại đây</span>
        </p>
      </div>
    </div>
  )
}

export default PaymentSelection
