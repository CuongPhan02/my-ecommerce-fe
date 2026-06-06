'use client'

import React from 'react'
import { cn } from '~/lib/utils'

const paymentMethods = [
  { id: 'COD', name: 'Thanh toán khi nhận hàng', desc: 'Kiểm tra hàng trước khi thanh toán', icon: '🚚', enabled: true },
  { id: 'zalopay', name: 'Thanh toán qua Zalopay', desc: 'Hỗ trợ mọi hình thức thanh toán', icon: '💳', enabled: false },
  { id: 'applepay', name: 'Apple Pay', desc: 'Hoạt động qua cổng thanh toán ZaloPay', icon: '🍎', enabled: false },
  { id: 'momo', name: 'Ví Momo', desc: 'Thanh toán qua ứng dụng MoMo', icon: '📱', enabled: false },
  { id: 'VNPAY', name: 'Ví điện tử VNPAY', desc: 'Quét QR để thanh toán', icon: '🏦', enabled: true },
]

interface PaymentSelectionProps {
  value: string
  onChange: (value: string) => void
}

const PaymentSelection = ({ value, onChange }: PaymentSelectionProps) => {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-xl font-black uppercase tracking-tight text-[#231f20]">Hình thức thanh toán</h2>
      
      <div className="flex flex-col gap-3">
        {paymentMethods.map((method) => {
          const isSelected = value === method.id
          return (
            <label
              key={method.id}
              className={cn(
                "flex items-center gap-4 p-5 border rounded-sm transition-all group select-none relative",
                !method.enabled 
                  ? "border-[#e8dfd5]/30 bg-neutral-50/50 opacity-60 cursor-not-allowed"
                  : isSelected 
                    ? "border-[#5c4e43] bg-[#FBF8F3] shadow-xs cursor-pointer" 
                    : "border-neutral-200 hover:border-[#e8dfd5] cursor-pointer"
              )}
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="payment"
                  disabled={!method.enabled}
                  className={cn(
                    "peer appearance-none w-5 h-5 border rounded-full transition-all",
                    !method.enabled 
                      ? "border-neutral-200 bg-neutral-100" 
                      : "border-neutral-300 checked:border-[#5c4e43] cursor-pointer"
                  )}
                  checked={isSelected}
                  onChange={() => method.enabled && onChange(method.id)}
                />
                {method.enabled && (
                  <div className={cn(
                    "absolute w-2.5 h-2.5 bg-[#5c4e43] rounded-full transition-all scale-0 peer-checked:scale-100 pointer-events-none"
                  )} />
                )}
              </div>
              
              <div className="text-2xl w-10 flex justify-center">{method.icon}</div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={cn("font-black text-sm", !method.enabled ? "text-gray-400" : "text-black")}>{method.name}</p>
                  {!method.enabled && (
                    <span className="text-[8px] font-black uppercase tracking-wider bg-neutral-200/60 text-gray-500 px-2 py-0.5 rounded-sm">
                      Chưa hỗ trợ
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{method.desc}</p>
              </div>
            </label>
          )
        })}
      </div>

      <div className="bg-[#FBF8F3] border border-[#e8dfd5]/65 p-6 rounded-sm">
        <p className="text-xs text-gray-500 font-semibold leading-relaxed italic">
          Nếu bạn không hài lòng với sản phẩm của chúng tôi? Bạn hoàn toàn có thể trả lại sản phẩm. 
          <span className="text-[#5c4e43] font-black hover:underline cursor-pointer ml-1">Tìm hiểu thêm Tại đây</span>
        </p>
      </div>
    </div>
  )
}

export default PaymentSelection

