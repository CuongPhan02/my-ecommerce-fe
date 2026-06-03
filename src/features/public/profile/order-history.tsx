'use client'

import React from 'react'
import { _orderService } from '~/features/public/order/order.query'
import { Package, Calendar, CreditCard, ChevronRight, CheckCircle2, Clock, Truck, XCircle, AlertCircle, ShoppingBag, MessageSquare } from 'lucide-react'
import { cn } from '~/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { Button } from '~/components/ui/core/button'

const statusConfig = {
  PENDING: { label: 'Chờ xác nhận', color: 'text-amber-600', bgColor: 'bg-amber-50', icon: Clock },
  PROCESSING: { label: 'Đang xử lý', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: Package },
  SHIPPED: { label: 'Đang giao hàng', color: 'text-purple-600', bgColor: 'bg-purple-50', icon: Truck },
  DELIVERED: { label: 'Đã giao hàng', color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircle2 },
  CANCELLED: { label: 'Đã hủy', color: 'text-red-600', bgColor: 'bg-red-50', icon: XCircle },
  RETURNED: { label: 'Đã hoàn trả', color: 'text-gray-600', bgColor: 'bg-gray-50', icon: AlertCircle },
}

export const OrderHistory = () => {
  const { data: ordersRes, isLoading } = _orderService.useMyOrders()
  const confirmReceiptMutation = _orderService.useConfirmReceipt()
  
  const orders = ordersRes?.result?.data || []

  const handleConfirmReceipt = async (orderId: string) => {
    try {
      await confirmReceiptMutation.mutateAsync(orderId)
      toast.success('Xác nhận nhận hàng thành công. Bạn đã có thể đánh giá sản phẩm!')
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Thao tác thất bại')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-100 rounded-[2rem] animate-pulse" />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] p-12 border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-200" />
        </div>
        <h3 className="text-xl font-black uppercase tracking-tight">Chưa có đơn hàng nào</h3>
        <p className="text-sm font-bold text-gray-400 mt-2 max-w-xs uppercase tracking-widest">
          Bắt đầu mua sắm để lấp đầy lịch sử đơn hàng của bạn ngay hôm nay!
        </p>
        <Link 
          href="/shop" 
          className="mt-8 px-8 py-4 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-black/5"
        >
          Khám phá cửa hàng
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => {
        const config = statusConfig[order.status]
        const StatusIcon = config.icon

        return (
          <div 
            key={order.id} 
            className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 group"
          >
            {/* Order Header */}
            <div className="px-8 py-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", config.bgColor, config.color)}>
                  <StatusIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mã đơn hàng</p>
                  <p className="text-sm font-black text-gray-900 uppercase">#{order.id}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 md:gap-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-bold text-gray-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest", config.bgColor, config.color)}>
                  {config.label}
                </div>
              </div>
            </div>

            {/* Order Items Summary */}
            <div className="px-8 py-6 space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                      <Image 
                        src={item.product.thumbnail?.url || '/placeholder.png'} 
                        alt={item.product.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black uppercase tracking-tight text-gray-900 truncate">{item.product.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                        {item.quantity} x {item.priceAtPurchaseFormatted}
                      </p>
                    </div>
                  </div>
                  
                  {order.status === 'DELIVERED' && (
                    <Link 
                      href={`/product/${item.product.slug}#reviews`}
                      className="h-9 px-4 bg-white hover:bg-black hover:text-white text-black border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Viết đánh giá
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Order Footer */}
            <div className="px-8 py-6 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Tổng thanh toán</p>
                  <p className="text-lg font-black text-black leading-none">{order.totalAmountFormatted}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {order.status === 'SHIPPED' && (
                  <Button 
                    onClick={() => handleConfirmReceipt(order.id)}
                    disabled={confirmReceiptMutation.isPending}
                    className="flex-1 sm:flex-none h-11 px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-600/20"
                  >
                    Xác nhận đã nhận hàng
                  </Button>
                )}
                <Link 
                  href={`/checkout/result?orderId=${order.id}&success=true`}
                  className="flex-1 sm:flex-none h-11 px-6 bg-white hover:bg-gray-50 text-black border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center shadow-sm"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
