'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, XCircle, AlertCircle, ShoppingBag, ArrowRight, PhoneCall, RefreshCw, Package, MapPin, CreditCard } from 'lucide-react'
import { _orderService } from '~/features/public/order/order.query'
import Image from 'next/image'

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

  const { data: orderRes, isLoading: isOrderLoading } = _orderService.useTrackOrder(orderId || '')
  const order = orderRes?.result

  return (
    <div className="bg-gray-50/50 min-h-screen py-16 px-4 md:py-24 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-100/50 overflow-hidden transition-all duration-300">
        
        {/* Header Visual Banner */}
        <div className={`relative py-12 px-6 text-center flex flex-col items-center justify-center gap-4 ${
          isSuccess 
            ? 'bg-gradient-to-b from-green-50/80 to-transparent' 
            : 'bg-gradient-to-b from-red-50/80 to-transparent'
        }`}>
          
          {/* Animated Circle Check / Cross */}
          <div className="relative">
            {isSuccess ? (
              <div className="relative flex items-center justify-center">
                {/* Pulse rings */}
                <div className="absolute w-24 h-24 bg-green-500/10 rounded-full animate-ping duration-1000" />
                <div className="absolute w-20 h-20 bg-green-500/20 rounded-full animate-pulse" />
                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 relative z-10">
                  <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                </div>
              </div>
            ) : (
              <div className="relative flex items-center justify-center">
                <div className="absolute w-20 h-20 bg-red-500/10 rounded-full animate-pulse" />
                <div className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 relative z-10">
                  <XCircle className="w-9 h-9 stroke-[2.5]" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 mt-4">
            <h1 className={`text-2xl md:text-3xl font-black uppercase tracking-tight ${
              isSuccess ? 'text-green-600' : 'text-red-500'
            }`}>
              {isSuccess ? 'Đặt hàng thành công' : 'Thanh toán thất bại'}
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              {isSuccess ? 'Cảm ơn bạn đã lựa chọn mua sắm cùng chúng tôi' : 'Giao dịch chưa được hoàn tất'}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-8 pb-12 pt-4 space-y-8">
          
          {/* Status Box */}
          {isSuccess ? (
            <div className="space-y-8">
              {/* Order Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-3xl p-6 space-y-4 border border-gray-100">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200/60">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mã đơn hàng</span>
                    <span className="text-sm font-black text-black bg-white px-4 py-1.5 rounded-full border shadow-sm">
                      #{orderId || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Trạng thái</span>
                    <span className="text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-lg uppercase tracking-wider">
                      {order?.payment?.status === 'COMPLETED' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-3xl p-6 space-y-4 border border-gray-100">
                  <div className="flex items-center gap-3 pb-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Địa chỉ giao hàng</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-900">{order?.customer?.name}</p>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                      {order?.shippingAddress?.street}, {order?.shippingAddress?.city}, {order?.shippingAddress?.province}
                    </p>
                    <p className="text-[11px] text-gray-500 font-medium">{order?.customer?.phone}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-gray-400" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sản phẩm của bạn</h3>
                </div>
                
                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
                  <div className="divide-y divide-gray-50">
                    {order?.items?.map((item) => (
                      <div key={item.id} className="p-4 flex items-center gap-4">
                        <div className="w-16 h-16 relative rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                          <Image
                            src={item.product.thumbnail?.url || '/placeholder.png'}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-black uppercase tracking-tight text-gray-900 truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                            Số lượng: {item.quantity} × {item.priceAtPurchaseFormatted}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-gray-900">
                            {item.priceAtPurchaseFormatted}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-50/50 p-6 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      <span>Tạm tính</span>
                      <span>{order?.totalAmountFormatted}</span>
                    </div>
                    {(order?.discountAmount ?? 0) > 0 && (
                      <div className="flex justify-between items-center text-[10px] font-bold text-red-500 uppercase tracking-widest">
                        <span>Giảm giá</span>
                        <span>-{order?.discountAmountFormatted}</span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-900">Tổng thanh toán</span>
                      <span className="text-lg font-black text-black">
                        {order?.totalAmountFormatted}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/50 border border-blue-50 rounded-3xl p-6 flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-blue-900">Thông tin vận chuyển</h4>
                  <p className="text-xs text-blue-950 font-medium leading-relaxed">
                    Đơn hàng sẽ được bàn giao cho đơn vị vận chuyển và giao tới tay bạn trong vòng 1-3 ngày làm việc tới. Một email xác nhận chi tiết đã được gửi tới hòm thư của bạn.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-red-50/30 rounded-3xl p-6 md:p-8 space-y-4 border border-red-100/50">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Chi tiết lỗi</span>
                  <span className="text-xs font-black text-red-500 bg-red-50 px-3 py-1 rounded-full uppercase tracking-widest">
                    Lỗi {responseCode || 'unknown'}
                  </span>
                </div>

                <p className="text-sm text-gray-600 font-semibold leading-relaxed">
                  {getVNPAYErrorMessage(responseCode)}
                </p>
              </div>

              <div className="bg-gray-50 border rounded-3xl p-6 flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-700">Làm thế nào để tiếp tục?</h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
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
                  className="flex-1 py-4 bg-black text-white hover:bg-primary rounded-2xl font-black text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2 group transition-all shadow-xl shadow-black/5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Tiếp tục mua sắm
                </Link>
                <Link 
                  href="/" 
                  className="flex-1 py-4 bg-gray-50 text-black hover:bg-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2 transition-all border border-gray-100"
                >
                  Về trang chủ
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/cart" 
                  className="flex-1 py-4 bg-black text-white hover:bg-primary rounded-2xl font-black text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2 transition-all shadow-xl shadow-black/5"
                >
                  <RefreshCw className="w-4 h-4 hover:rotate-180 transition-transform duration-500" />
                  Quay lại giỏ hàng
                </Link>
                <a 
                  href="tel:19002727"
                  className="flex-1 py-4 bg-gray-50 text-black hover:bg-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2 transition-all border border-gray-100"
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
      <div className="bg-gray-50/50 min-h-screen py-16 px-4 md:py-24 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-100/50 overflow-hidden p-12 text-center flex flex-col items-center justify-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-20 h-20 bg-gray-200/20 rounded-full animate-pulse" />
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center relative z-10">
              <RefreshCw className="w-7 h-7 animate-spin" />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <h1 className="text-xl font-black uppercase tracking-tight text-gray-700">
              Đang tải kết quả
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
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
