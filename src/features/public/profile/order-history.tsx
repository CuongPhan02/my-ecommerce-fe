'use client'

import React, { useState } from 'react'
import { _orderService } from '~/features/public/order/order.query'
import {
  Package, Calendar, CreditCard, CheckCircle2, Clock, Truck,
  XCircle, AlertCircle, ShoppingBag, MessageSquare, RotateCcw,
  Loader2, ChevronDown, ChevronUp, BadgeCheck, CircleDot
} from 'lucide-react'
import { cn } from '~/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { Button } from '~/components/ui/core/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '~/components/ui/core/dialog'
import { Textarea } from '~/components/ui/core/textarea'
import { OrderDetail } from '~/features/public/order/types'

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING:    { label: 'Chờ xác nhận',   color: 'text-amber-600',  bgColor: 'bg-amber-50',   borderColor: 'border-amber-200',  icon: Clock,        step: 0 },
  PROCESSING: { label: 'Đang xử lý',     color: 'text-blue-600',   bgColor: 'bg-blue-50',    borderColor: 'border-blue-200',   icon: Package,      step: 1 },
  SHIPPED:    { label: 'Đang giao hàng', color: 'text-purple-600', bgColor: 'bg-purple-50',  borderColor: 'border-purple-200', icon: Truck,        step: 2 },
  DELIVERED:  { label: 'Đã giao hàng',   color: 'text-green-600',  bgColor: 'bg-green-50',   borderColor: 'border-green-200',  icon: CheckCircle2, step: 3 },
  CANCELLED:  { label: 'Đã hủy',         color: 'text-red-600',    bgColor: 'bg-red-50',     borderColor: 'border-red-200',    icon: XCircle,      step: -1 },
  RETURNED:   { label: 'Đã hoàn trả',    color: 'text-gray-600',   bgColor: 'bg-gray-100',   borderColor: 'border-gray-200',   icon: AlertCircle,  step: -1 },
}

const TIMELINE_STEPS = [
  { key: 'PENDING',    label: 'Đặt hàng',      icon: CircleDot },
  { key: 'PROCESSING', label: 'Xác nhận',       icon: BadgeCheck },
  { key: 'SHIPPED',    label: 'Đang giao',      icon: Truck },
  { key: 'DELIVERED',  label: 'Đã nhận hàng',  icon: CheckCircle2 },
]

// ─── Refund Reason Options ────────────────────────────────────────────────────
const REFUND_REASONS = [
  'Sản phẩm không đúng mô tả / sai màu sắc / sai kích thước',
  'Sản phẩm bị lỗi, hỏng khi nhận hàng',
  'Sản phẩm không như mong đợi',
  'Giao hàng sai sản phẩm',
  'Thay đổi quyết định, không muốn mua nữa',
  'Khác',
]

// ─── Order Status Timeline ────────────────────────────────────────────────────
function OrderStatusTimeline({ status }: { status: string }) {
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]

  if (status === 'CANCELLED' || status === 'RETURNED') {
    return (
      <div className={cn(
        'mx-8 mb-0 px-5 py-3 rounded-2xl flex items-center gap-3 border',
        config.bgColor, config.borderColor
      )}>
        <config.icon className={cn('w-4 h-4', config.color)} />
        <span className={cn('text-xs font-black uppercase tracking-widest', config.color)}>
          Đơn hàng {config.label}
        </span>
      </div>
    )
  }

  const currentStep = config.step

  return (
    <div className="mx-8 mb-0 pb-6">
      <div className="flex items-center">
        {TIMELINE_STEPS.map((step, idx) => {
          const isCompleted = idx < currentStep
          const isActive = idx === currentStep
          const StepIcon = step.icon

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all',
                  isCompleted ? 'bg-green-500 border-green-500 text-white' :
                  isActive    ? 'bg-black border-black text-white scale-110 shadow-lg' :
                                'bg-white border-gray-200 text-gray-300'
                )}>
                  <StepIcon className="w-3.5 h-3.5" />
                </div>
                <span className={cn(
                  'text-[9px] font-black uppercase tracking-wider whitespace-nowrap',
                  isCompleted || isActive ? 'text-gray-800' : 'text-gray-300'
                )}>
                  {step.label}
                </span>
              </div>
              {idx < TIMELINE_STEPS.length - 1 && (
                <div className={cn(
                  'flex-1 h-0.5 mx-1 mb-5 transition-all',
                  idx < currentStep ? 'bg-green-400' : 'bg-gray-100'
                )} />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

// ─── Refund Modal ─────────────────────────────────────────────────────────────
interface RefundModalProps {
  order: OrderDetail
  isOpen: boolean
  onClose: () => void
}

function RefundModal({ order, isOpen, onClose }: RefundModalProps) {
  const [selectedReason, setSelectedReason] = useState('')
  const [customReason, setCustomReason] = useState('')
  const createRefundMutation = _orderService.useCreateRefund()

  const reason = selectedReason === 'Khác' ? customReason : selectedReason
  const canSubmit = reason.trim().length >= 10

  const handleSubmit = async () => {
    if (!canSubmit) return
    try {
      await createRefundMutation.mutateAsync({
        orderId: order.id,
        reason: reason.trim(),
        amount: order.totalAmount,
      })
      toast.success('Yêu cầu đổi trả / hoàn tiền đã được gửi! Chúng tôi sẽ xem xét trong 1-3 ngày làm việc.')
      onClose()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Không thể gửi yêu cầu hoàn tiền')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-3xl border border-gray-100 bg-white shadow-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 bg-gradient-to-br from-orange-50 to-red-50 border-b border-orange-100">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <DialogTitle className="text-base font-black uppercase tracking-tight text-gray-900">
                  Yêu cầu Đổi trả & Hoàn tiền
                </DialogTitle>
                <DialogDescription className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  Đơn hàng #{order.id.slice(-8).toUpperCase()}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-8 py-6 space-y-5">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Sản phẩm trong đơn</p>
            {order.items.slice(0, 2).map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-10 h-10 relative rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                  <Image
                    src={item.product.thumbnail?.url || '/placeholder.png'}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate">{item.product.name}</p>
                  <p className="text-[10px] text-gray-400 font-semibold">x{item.quantity} · {item.priceAtPurchaseFormatted}</p>
                </div>
              </div>
            ))}
            {order.items.length > 2 && (
              <p className="text-[10px] font-bold text-gray-400">+{order.items.length - 2} sản phẩm khác</p>
            )}
            <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Số tiền hoàn trả</span>
              <span className="text-sm font-black text-orange-600">{order.totalAmountFormatted}</span>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Lý do yêu cầu *</p>
            <div className="space-y-2">
              {REFUND_REASONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedReason(r)}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-xl border text-xs font-semibold transition-all',
                    selectedReason === r
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'
                  )}
                >
                  {r}
                </button>
              ))}
            </div>

            {selectedReason === 'Khác' && (
              <Textarea
                placeholder="Mô tả chi tiết lý do của bạn (tối thiểu 10 ký tự)..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                rows={3}
                className="mt-2 rounded-xl border-gray-200 text-xs font-semibold resize-none focus:border-black"
              />
            )}
          </div>

          {/* Note */}
          <div className="flex gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] font-semibold text-amber-700 leading-relaxed">
              Sau khi gửi yêu cầu, đội ngũ chúng tôi sẽ liên hệ để xác nhận trong vòng <strong>1-3 ngày làm việc</strong>. Hoàn tiền sẽ được xử lý sau khi xác nhận.
            </p>
          </div>
        </div>

        <DialogFooter className="px-8 pb-8 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-xl font-black text-[10px] uppercase tracking-widest border-gray-100 h-11 hover:bg-gray-50"
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || createRefundMutation.isPending}
            className="flex-1 rounded-xl font-black text-[10px] uppercase tracking-widest bg-black hover:bg-gray-900 h-11 text-white shadow-lg disabled:opacity-50"
          >
            {createRefundMutation.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" />Đang gửi...</>
            ) : (
              'Gửi yêu cầu'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main OrderHistory Component ──────────────────────────────────────────────
export const OrderHistory = () => {
  const { data: ordersRes, isLoading } = _orderService.useMyOrders()
  const confirmReceiptMutation = _orderService.useConfirmReceipt()
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [refundOrder, setRefundOrder] = useState<OrderDetail | null>(null)

  const orders = ordersRes?.result?.data || []

  const handleConfirmReceipt = async (orderId: string) => {
    try {
      await confirmReceiptMutation.mutateAsync(orderId)
      toast.success('Xác nhận nhận hàng thành công! Bạn có thể đánh giá sản phẩm ngay bây giờ.')
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
    <>
      <div className="space-y-6">
        {orders.map((order) => {
          const config = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]
          const StatusIcon = config.icon
          const isExpanded = expandedOrderId === order.id
          const canRefund = order.status === 'DELIVERED'

          return (
            <div
              key={order.id}
              className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300"
            >
              {/* Order Header */}
              <div className="px-8 py-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', config.bgColor, config.color)}>
                    <StatusIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mã đơn hàng</p>
                    <p className="text-sm font-black text-gray-900 uppercase">#{order.id.slice(-12)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 md:gap-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className={cn('px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest', config.bgColor, config.color)}>
                    {config.label}
                  </div>
                  <button
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {isExpanded ? 'Thu gọn' : 'Chi tiết'}
                  </button>
                </div>
              </div>

              {/* Order Status Timeline */}
              <div className="pt-6">
                <OrderStatusTimeline status={order.status} />
              </div>

              {/* Order Items — collapsible */}
              {isExpanded && (
                <div className="px-8 py-4 space-y-4 border-t border-gray-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {order.items?.map((item) => (
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
                            {item.quantity} × {item.priceAtPurchaseFormatted}
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
              )}

              {/* Order Footer */}
              <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Tổng thanh toán</p>
                    <p className="text-lg font-black text-black leading-none">{order.totalAmountFormatted}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap justify-end">
                  {/* Xác nhận nhận hàng */}
                  {order.status === 'SHIPPED' && (
                    <Button
                      onClick={() => handleConfirmReceipt(order.id)}
                      disabled={confirmReceiptMutation.isPending}
                      className="flex-1 sm:flex-none h-10 px-5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-600/20"
                    >
                      {confirmReceiptMutation.isPending
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : 'Xác nhận đã nhận hàng'
                      }
                    </Button>
                  )}

                  {/* Yêu cầu đổi trả */}
                  {canRefund && (
                    <Button
                      variant="outline"
                      onClick={() => setRefundOrder(order)}
                      className="flex-1 sm:flex-none h-10 px-5 border-orange-200 text-orange-600 hover:bg-orange-50 rounded-xl text-[10px] font-black uppercase tracking-widest"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                      Đổi trả / Hoàn tiền
                    </Button>
                  )}

                  <Link
                    href={`/checkout/result?orderId=${order.id}&success=true`}
                    className="flex-1 sm:flex-none h-10 px-5 bg-white hover:bg-gray-50 text-black border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center shadow-sm"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Refund Modal */}
      {refundOrder && (
        <RefundModal
          order={refundOrder}
          isOpen={!!refundOrder}
          onClose={() => setRefundOrder(null)}
        />
      )}
    </>
  )
}
