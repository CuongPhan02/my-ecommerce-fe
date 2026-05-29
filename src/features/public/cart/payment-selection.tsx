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
      <h2 className="text-2xl font-black uppercase tracking-tight">Hình thức thanh toán</h2>
      
      <div className="flex flex-col gap-3">
        {paymentMethods.map((method) => {
          const isSelected = value === method.id
          return (
            <label
              key={method.id}
              className={cn(
                "flex items-center gap-4 p-5 border-2 rounded-2xl transition-all group select-none relative",
                !method.enabled 
                  ? "border-gray-100 bg-gray-50/50 opacity-60 cursor-not-allowed"
                  : isSelected 
                    ? "border-black bg-gray-50 shadow-sm cursor-pointer" 
                    : "border-gray-100 hover:border-gray-200 cursor-pointer"
              )}
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="payment"
                  disabled={!method.enabled}
                  className={cn(
                    "peer appearance-none w-5 h-5 border-2 rounded-full transition-all",
                    !method.enabled 
                      ? "border-gray-200 bg-gray-100" 
                      : "border-gray-200 checked:border-black cursor-pointer"
                  )}
                  checked={isSelected}
                  onChange={() => method.enabled && onChange(method.id)}
                />
                {method.enabled && (
                  <div className={cn(
                    "absolute w-2.5 h-2.5 bg-black rounded-full transition-all scale-0 peer-checked:scale-100 pointer-events-none"
                  )} />
                )}
              </div>
              
              <div className="text-2xl w-10 flex justify-center">{method.icon}</div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={cn("font-black text-sm", !method.enabled ? "text-gray-400" : "text-black")}>{method.name}</p>
                  {!method.enabled && (
                    <span className="text-[8px] font-black uppercase tracking-wider bg-gray-200/60 text-gray-500 px-2 py-0.5 rounded">
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

