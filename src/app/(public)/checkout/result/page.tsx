'use client'

import React, { Suspense, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, XCircle, AlertCircle, ShoppingBag, ArrowRight, PhoneCall, RefreshCw, Package, MapPin } from 'lucide-react'
import { _orderService } from '~/features/public/order/order.query'
import { _cartService } from '~/features/public/cart/cart.query'
import Image from 'next/image'
import { cn } from '~/lib/utils'

// VNPAY response code translations
const getVNPAYErrorMessage = (code: string | null): string => {
  if (!code) return 'Giao dịch thanh toán thất bại. Vui lòng thử lại hoặc sử dụng phương thức khác.'
  
  switch (code) {
    case '07':
      return 'Giao dịch bị nghi ngờ gian lận. Vui lòng liên hệ ngân hàng của bạn để được hỗ trợ.'
    case '09':
      return 'Thẻ hoặc tài khoản của bạn chưa đăng ký dịch vụ Internet Banking. Vui lòng đăng ký tại ngân hàng.'
    case '10':
      return 'Xác thực thông tin thẻ/tài khoản không chính xác quá 3 lần. Vui lòng thử lại sau.'
    case '11':
      return 'Đã hết hạn chờ thanh toán trên hệ thống. Vui lòng thực hiện lại giao dịch.'
    case '12':
      return 'Thẻ hoặc tài khoản thanh toán của bạn đang bị khóa.'
    case '51':
      return 'Tài khoản của bạn không đủ số dư để thực hiện giao dịch này.'
    case '75':
      return 'Hệ thống ngân hàng thanh toán đang bảo trì. Vui lòng thử lại sau vài phút.'
    default:
      return `Giao dịch thất bại (Mã lỗi: ${code}). Vui lòng thử lại hoặc chọn phương thức thanh toán khác.`
  }
}

function CheckoutResultContent() {
  const searchParams = useSearchParams()
  
  const orderId = searchParams.get('orderId')
  const successParam = searchParams.get('success')
  const responseCode = searchParams.get('responseCode')
  
  const isSuccess = successParam === 'true'

  const { data: orderRes } = _orderService.useTrackOrder(orderId || '')
  const order = orderRes?.result

  const clearCartMutation = _cartService.useClearCart()
  const hasCleared = useRef(false)

  useEffect(() => {
    if (isSuccess && !hasCleared.current) {
      hasCleared.current = true
      clearCartMutation.mutate()
    }
  }, [isSuccess, clearCartMutation])

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-16 px-4 md:py-24 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-none border border-neutral-200/80 shadow-xl overflow-hidden transition-all duration-300">
        
        {/* Header Visual Banner */}
        <div className="relative bg-[#231f20] py-12 px-6 text-center flex flex-col items-center justify-center gap-4">
          <div className="relative">
            {isSuccess ? (
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 bg-[#FAF6F0] text-[#231f20] rounded-none flex items-center justify-center shadow-lg relative z-10 border border-neutral-200">
                  <CheckCircle2 className="w-9 h-9 stroke-[2]" />
                </div>
              </div>
            ) : (
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 bg-red-950 text-red-500 rounded-none flex items-center justify-center shadow-lg relative z-10 border border-red-550/20">
                  <XCircle className="w-9 h-9 stroke-[2]" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 mt-4">
            <h1 className={cn(
              "text-xl md:text-2xl font-bold uppercase tracking-[0.2em]",
              isSuccess ? 'text-[#FAF6F0]' : 'text-red-500'
            )}>
              {isSuccess ? 'Đặt hàng thành công' : 'Thanh toán thất bại'}
            </h1>
            <p className={cn(
              "text-[10px] font-bold uppercase tracking-widest",
              isSuccess ? 'text-[#FAF6F0]/60' : 'text-white/50'
            )}>
              {isSuccess ? 'Cảm ơn bạn đã lựa chọn mua sắm cùng LUNÉ' : 'Giao dịch chưa được hoàn tất'}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 md:px-10 pb-12 pt-8 space-y-8">
          
          {/* Status Box */}
          {isSuccess ? (
            <div className="space-y-8">
              {/* Order Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#FBF8F3] rounded-none p-6 space-y-4 border border-neutral-200/60 flex flex-col justify-between">
                  <div className="flex justify-between items-center pb-4 border-b border-neutral-200/50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Mã đơn hàng</span>
                    <span className="text-xs font-bold text-[#231f20] bg-white px-3 py-1 border border-neutral-200 rounded-none shadow-xs">
                      #{orderId || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Trạng thái</span>
                    <span className={cn(
                      "text-[10px] font-bold px-2.5 py-0.5 border uppercase tracking-wider rounded-none",
                      order?.payment?.status === 'COMPLETED' 
                        ? 'text-green-700 bg-green-50 border-green-200' 
                        : 'text-amber-700 bg-amber-50 border-amber-200'
                    )}>
                      {order?.payment?.status === 'COMPLETED' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                    </span>
                  </div>
                </div>

                <div className="bg-[#FBF8F3] rounded-none p-6 space-y-3 border border-neutral-200/60">
                  <div className="flex items-center gap-2 pb-1.5 border-b border-neutral-200/50">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Địa chỉ giao hàng</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-[#231f20]">{order?.customer?.name}</p>
                    <p className="text-neutral-500 font-medium leading-relaxed">
                      {order?.shippingAddress?.street}, {order?.shippingAddress?.city}, {order?.shippingAddress?.province}
                    </p>
                    <p className="text-[11px] text-[#231f20] font-bold tracking-wider mt-1">{order?.customer?.phone}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-neutral-400" />
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Sản phẩm của bạn</h3>
                </div>
                
                <div className="bg-white border border-neutral-200 rounded-none overflow-hidden">
                  <div className="divide-y divide-neutral-100">
                    {order?.items?.map((item) => (
                      <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-neutral-50/50 transition-colors">
                        <div className="w-16 h-16 relative rounded-none overflow-hidden bg-neutral-50 flex-shrink-0 border border-neutral-200">
                          <Image
                            src={item.product.thumbnail?.url || '/placeholder.png'}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold uppercase tracking-tight text-[#231f20] truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-[10px] font-medium text-neutral-400 mt-1 uppercase tracking-widest">
                            Số lượng: {item.quantity} × {item.priceAtPurchaseFormatted}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-[#231f20]">
                            {item.priceAtPurchaseFormatted}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-[#FBF8F3] p-6 space-y-3 border-t border-neutral-100">
                    <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      <span>Tạm tính</span>
                      <span className="font-semibold text-neutral-600">{order?.totalAmountFormatted}</span>
                    </div>
                    {(order?.discountAmount ?? 0) > 0 && (
                      <div className="flex justify-between items-center text-[10px] font-bold text-red-500 uppercase tracking-widest">
                        <span>Giảm giá</span>
                        <span>-{order?.discountAmountFormatted}</span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-neutral-200 flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#231f20]">Tổng thanh toán</span>
                      <span className="text-lg font-bold text-[#231f20]">
                        {order?.totalAmountFormatted}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Notification */}
              <div className="bg-[#FBF8F3] border-l-4 border-[#5c4e43] rounded-none p-5 flex items-start gap-3.5">
                <AlertCircle className="w-4 h-4 text-[#5c4e43] flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#5c4e43]">Thông tin vận chuyển</h4>
                  <p className="text-xs text-[#231f20] font-medium leading-relaxed">
                    Đơn hàng sẽ được bàn giao cho đơn vị vận chuyển và giao tới tay bạn trong vòng 1-3 ngày làm việc tới. Một email xác nhận chi tiết đã được gửi tới hòm thư của bạn.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-[#FBF8F3] border border-neutral-200 rounded-none p-6 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-neutral-200/50">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">Chi tiết lỗi</span>
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-none uppercase tracking-wider">
                    Lỗi {responseCode || 'unknown'}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 font-semibold leading-relaxed">
                  {getVNPAYErrorMessage(responseCode)}
                </p>
              </div>

              <div className="bg-[#FBF8F3] border-l-4 border-neutral-400 rounded-none p-5 flex items-start gap-3.5">
                <AlertCircle className="w-4 h-4 text-neutral-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-700">Làm thế nào để tiếp tục?</h4>
                  <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                    Bạn có thể quay lại giỏ hàng để chọn phương thức thanh toán khác (như thanh toán COD) hoặc thử thanh toán lại với ngân hàng khác qua VNPAY. Đừng ngần ngại liên hệ hotline của chúng tôi nếu bạn cần hỗ trợ.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {isSuccess ? (
              <>
                <Link 
                  href="/shop" 
                  className="flex-1 py-4 bg-[#231f20] text-white hover:bg-[#5c4e43] rounded-none font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2 group transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Tiếp tục mua sắm
                </Link>
                <Link 
                  href="/" 
                  className="flex-1 py-4 bg-white text-[#231f20] hover:bg-[#FAF6F0] rounded-none font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2 transition-all border border-[#231f20]/20"
                >
                  Về trang chủ
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/cart" 
                  className="flex-1 py-4 bg-[#231f20] text-white hover:bg-[#5c4e43] rounded-none font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2 transition-all"
                >
                  <RefreshCw className="w-4 h-4 hover:rotate-180 transition-transform duration-500" />
                  Quay lại giỏ hàng
                </Link>
                <a 
                  href="tel:19002727"
                  className="flex-1 py-4 bg-white text-[#231f20] hover:bg-[#FAF6F0] rounded-none font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2 transition-all border border-[#231f20]/20"
                >
                  <PhoneCall className="w-4 h-4" />
                  Gọi tổng đài hỗ trợ
                </a>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default function CheckoutResultPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#FAF6F0] min-h-screen py-16 px-4 md:py-24 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-none border border-neutral-200/80 shadow-xl overflow-hidden p-12 text-center flex flex-col items-center justify-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 bg-[#FBF8F3] text-[#231f20] rounded-none flex items-center justify-center border border-neutral-200 relative z-10">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-[#231f20]">
              Đang tải kết quả
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Vui lòng chờ trong giây lát
            </p>
          </div>
        </div>
      </div>
    }>
      <CheckoutResultContent />
    </Suspense>
  )
}
