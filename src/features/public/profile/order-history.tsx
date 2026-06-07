'use client'

import React, { useState } from 'react'
import { _orderService } from '~/features/public/order/order.query'
import {
  Package,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
  ShoppingBag,
  MessageSquare,
  RotateCcw,
  Loader2,
  BadgeCheck,
  CircleDot,
  MapPin,
  User,
  Phone,
  Mail,
  ExternalLink,
  X,
  ChevronRight,
  Receipt,
  ArrowUpRight,
} from 'lucide-react'
import { cn } from '~/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { Button } from '~/components/ui/core/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/core/dialog'
import { Textarea } from '~/components/ui/core/textarea'
import { OrderDetail } from '~/features/public/order/types'
import { motion, AnimatePresence } from 'motion/react'

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING: {
    label: 'Chờ xác nhận',
    color: 'text-[#5c4e43]',
    bgColor: 'bg-[#FAF6F0]',
    borderColor: 'border-[#5c4e43]/20',
    icon: Clock,
    step: 0,
  },
  PROCESSING: {
    label: 'Đang xử lý',
    color: 'text-[#231f20]',
    bgColor: 'bg-[#FBF8F3]',
    borderColor: 'border-[#231f20]/20',
    icon: Package,
    step: 1,
  },
  SHIPPED: {
    label: 'Đang giao hàng',
    color: 'text-[#5c4e43]',
    bgColor: 'bg-[#FAF6F0]',
    borderColor: 'border-[#5c4e43]/20',
    icon: Truck,
    step: 2,
  },
  DELIVERED: {
    label: 'Đã giao hàng',
    color: 'text-neutral-800',
    bgColor: 'bg-neutral-50',
    borderColor: 'border-neutral-200',
    icon: CheckCircle2,
    step: 3,
  },
  CANCELLED: {
    label: 'Đã hủy',
    color: 'text-neutral-400',
    bgColor: 'bg-neutral-50',
    borderColor: 'border-neutral-100',
    icon: XCircle,
    step: -1,
  },
  RETURNED: {
    label: 'Đã hoàn trả',
    color: 'text-neutral-400',
    bgColor: 'bg-neutral-50',
    borderColor: 'border-neutral-100',
    icon: AlertCircle,
    step: -1,
  },
}

const TIMELINE_STEPS = [
  { key: 'PENDING', label: 'Đặt hàng', icon: CircleDot },
  { key: 'PROCESSING', label: 'Xác nhận', icon: BadgeCheck },
  { key: 'SHIPPED', label: 'Đang giao', icon: Truck },
  { key: 'DELIVERED', label: 'Đã nhận hàng', icon: CheckCircle2 },
]

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
      <div
        className={cn(
          'flex items-center gap-3 px-5 py-3 rounded-sm border',
          config.bgColor,
          config.borderColor,
        )}
      >
        <config.icon className={cn('w-4 h-4', config.color)} />
        <span
          className={cn(
            'text-xs font-bold uppercase tracking-widest',
            config.color,
          )}
        >
          Đơn hàng {config.label}
        </span>
      </div>
    )
  }
  const currentStep = config.step
  return (
    <div className='flex items-center w-full'>
      {TIMELINE_STEPS.map((step, idx) => {
        const isCompleted = idx < currentStep
        const isActive = idx === currentStep
        const StepIcon = step.icon
        return (
          <React.Fragment key={step.key}>
            <div className='flex flex-col items-center gap-1.5 flex-shrink-0'>
              <div
                className={cn(
                  'w-8 h-8 rounded-sm flex items-center justify-center border transition-all',
                  isCompleted
                    ? 'bg-[#5c4e43] border-[#5c4e43] text-white'
                    : isActive
                      ? 'bg-[#231f20] border-[#231f20] text-white scale-105 shadow-sm'
                      : 'bg-[#FBF8F3] border-neutral-200 text-neutral-400',
                )}
              >
                <StepIcon className='w-3.5 h-3.5' />
              </div>
              <span
                className={cn(
                  'text-[9px] font-bold uppercase tracking-widest whitespace-nowrap',
                  isCompleted || isActive
                    ? 'text-[#231f20]'
                    : 'text-neutral-400',
                )}
              >
                {step.label}
              </span>
            </div>
            {idx < TIMELINE_STEPS.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-1 mb-5 transition-all',
                  idx < currentStep ? 'bg-[#5c4e43]' : 'bg-neutral-200',
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ─── Refund Modal ─────────────────────────────────────────────────────────────
function RefundModal({
  order,
  isOpen,
  onClose,
}: {
  order: OrderDetail
  isOpen: boolean
  onClose: () => void
}) {
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
      toast.success(
        'Yêu cầu đổi trả / hoàn tiền đã được gửi! Chúng tôi sẽ xem xét trong 1-3 ngày làm việc.',
      )
      onClose()
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Không thể gửi yêu cầu hoàn tiền',
      )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-lg rounded-sm border border-neutral-200 bg-white shadow-2xl p-0 overflow-hidden'>
        <div className='px-8 pt-8 pb-6 bg-[#231f20] text-white border-b border-[#231f20]'>
          <DialogHeader className='space-y-2'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-white/10 rounded-sm flex items-center justify-center'>
                <RotateCcw className='w-5 h-5 text-white' />
              </div>
              <div>
                <DialogTitle className='text-base font-bold uppercase tracking-widest text-[#FAF6F0]'>
                  Yêu cầu Đổi trả & Hoàn tiền
                </DialogTitle>
                <DialogDescription className='text-[10px] font-medium text-white/60 uppercase tracking-widest mt-0.5'>
                  Đơn hàng #{order.id.slice(-8).toUpperCase()}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>
        <div className='px-8 py-6 space-y-5 max-h-[60vh] overflow-y-auto'>
          <div className='bg-[#FBF8F3] border border-neutral-100 rounded-sm p-4 space-y-3'>
            <p className='text-[9px] font-bold uppercase tracking-widest text-neutral-400'>
              Sản phẩm trong đơn
            </p>
            {order.items.slice(0, 2).map((item) => (
              <div key={item.id} className='flex items-center gap-3'>
                <div className='w-10 h-10 relative rounded-none overflow-hidden bg-white border border-neutral-200 flex-shrink-0'>
                  <Image
                    src={item.product.thumbnail?.url || '/placeholder.png'}
                    alt={item.product.name}
                    fill
                    className='object-cover'
                  />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-xs font-bold text-neutral-800 truncate'>
                    {item.product.name}
                  </p>
                  <p className='text-[10px] text-neutral-400 font-medium'>
                    x{item.quantity} · {item.priceAtPurchaseFormatted}
                  </p>
                </div>
              </div>
            ))}
            {order.items.length > 2 && (
              <p className='text-[10px] font-bold text-neutral-400'>
                +{order.items.length - 2} sản phẩm khác
              </p>
            )}
            <div className='pt-2 border-t border-neutral-200 flex justify-between items-center'>
              <span className='text-[10px] font-bold uppercase tracking-widest text-neutral-400'>
                Số tiền hoàn trả
              </span>
              <span className='text-sm font-bold text-[#231f20]'>
                {order.totalAmountFormatted}
              </span>
            </div>
          </div>
          <div className='space-y-2'>
            <p className='text-[10px] font-bold uppercase tracking-widest text-neutral-500'>
              Lý do yêu cầu *
            </p>
            <div className='space-y-2'>
              {REFUND_REASONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedReason(r)}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-none border text-xs font-medium transition-colors',
                    selectedReason === r
                      ? 'bg-[#231f20] text-white border-[#231f20]'
                      : 'bg-[#FBF8F3] text-neutral-600 border-neutral-200 hover:border-[#231f20]',
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
            {selectedReason === 'Khác' && (
              <Textarea
                placeholder='Mô tả chi tiết lý do của bạn (tối thiểu 10 ký tự)...'
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                rows={3}
                className='mt-2 rounded-none border-neutral-200 bg-[#FBF8F3] text-xs font-medium resize-none focus:border-[#231f20] focus-visible:ring-0 focus-visible:ring-offset-0'
              />
            )}
          </div>
          <div className='flex gap-2 p-3 bg-[#FAF6F0] rounded-sm border border-[#5c4e43]/20'>
            <AlertCircle className='w-4 h-4 text-[#5c4e43] flex-shrink-0 mt-0.5' />
            <p className='text-[10px] font-medium text-[#5c4e43] leading-relaxed'>
              Sau khi gửi yêu cầu, đội ngũ chúng tôi sẽ liên hệ để xác nhận
              trong vòng <strong>1-3 ngày làm việc</strong>.
            </p>
          </div>
        </div>
        <DialogFooter className='px-8 pb-8 flex flex-col sm:flex-row gap-3'>
          <Button
            variant='outline'
            onClick={onClose}
            className='flex-1 rounded-none font-bold text-[10px] uppercase tracking-widest border-neutral-200 h-11 hover:bg-neutral-50 bg-white'
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || createRefundMutation.isPending}
            className='flex-1 rounded-none font-bold text-[10px] uppercase tracking-widest bg-[#231f20] hover:bg-[#5c4e43] h-11 text-white shadow-none disabled:opacity-50'
          >
            {createRefundMutation.isPending ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin mr-2' />
                Đang gửi...
              </>
            ) : (
              'Gửi yêu cầu'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Order Detail Modal ───────────────────────────────────────────────────────
function OrderDetailModal({
  orderId,
  isOpen,
  onClose,
  onRefund,
  onConfirmReceipt,
  isConfirming,
}: {
  orderId: string | null
  isOpen: boolean
  onClose: () => void
  onRefund: (order: OrderDetail) => void
  onConfirmReceipt: (orderId: string) => void
  isConfirming: boolean
}) {
  const { data: orderRes, isLoading } = _orderService.useOrderDetail(orderId)
  const order = orderRes?.result

  const config = order ? STATUS_CONFIG[order.status] : null

  const PAYMENT_METHOD_LABEL: Record<string, string> = {
    COD: 'Thanh toán khi nhận hàng',
    VNPAY: 'VNPay',
    STRIPE: 'Stripe',
    BANK_TRANSFER: 'Chuyển khoản ngân hàng',
  }

  const PAYMENT_STATUS_CONFIG: Record<
    string,
    { label: string; color: string }
  > = {
    PENDING: { label: 'Chờ thanh toán', color: 'text-amber-600' },
    COMPLETED: { label: 'Đã thanh toán', color: 'text-green-600' },
    FAILED: { label: 'Thất bại', color: 'text-red-600' },
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl w-full rounded-sm border border-neutral-200 shadow-2xl p-0 overflow-hidden max-h-[92vh] flex flex-col'>
        {/* ── Header ── */}
        <div className='bg-gray-30 px-8 py-6 flex items-center justify-between shrink-0'>
          <div className='flex items-center gap-4'>
            <div className='w-10 h-10 rounded-sm bg-white/10 flex items-center justify-center'>
              <Receipt className='w-5 h-5 text-black' />
            </div>
            <div>
              <p className='text-[10px] font-bold uppercase tracking-widest text-black/50 mb-0.5'>
                Chi tiết đơn hàng
              </p>
              {order && (
                <p className='text-sm font-bold text-black uppercase tracking-widest'>
                  #{order.id.slice(-12)}
                </p>
              )}
            </div>
          </div>
          {order && config && (
            <span
              className={cn(
                'px-3 py-1 rounded-sm text-[9px] font-bold uppercase tracking-widest border',
                config.bgColor,
                config.color,
                config.borderColor,
              )}
            >
              {config.label}
            </span>
          )}
        </div>

        {/* ── Body ── */}
        <div className='overflow-y-auto flex-1 px-8 py-6 space-y-6'>
          {isLoading ? (
            <div className='space-y-4 py-8'>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='h-16 bg-[#FBF8F3] border border-neutral-100 rounded-sm animate-pulse'
                />
              ))}
            </div>
          ) : !order ? (
            <div className='py-16 flex flex-col items-center gap-3 text-neutral-400'>
              <AlertCircle className='w-10 h-10' />
              <p className='font-bold text-sm'>Không tìm thấy đơn hàng</p>
            </div>
          ) : (
            <>
              {/* ── Status Timeline ── */}
              <div className='bg-[#FBF8F3] border border-neutral-100 rounded-sm px-5 py-5'>
                <p className='text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4'>
                  Trạng thái đơn hàng
                </p>
                <OrderStatusTimeline status={order.status} />
              </div>

              {/* ── Product Items ── */}
              <div>
                <p className='text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3'>
                  Sản phẩm ({order.items.length})
                </p>
                <div className='space-y-3'>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className='flex items-center gap-4 p-4 bg-white border border-neutral-200 rounded-none hover:border-[#231f20] transition-colors'
                    >
                      <div className='w-16 h-16 relative rounded-none overflow-hidden bg-[#FBF8F3] border border-neutral-100 flex-shrink-0'>
                        <Image
                          src={
                            item.product.thumbnail?.url || '/placeholder.png'
                          }
                          alt={item.product.name}
                          fill
                          className='object-cover'
                        />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h4 className='text-xs font-bold text-[#231f20] truncate'>
                          {item.product.name}
                        </h4>
                        <p className='text-[10px] font-medium text-neutral-400 mt-0.5 uppercase tracking-widest'>
                          SKU: {item.variant?.sku}
                        </p>
                        <p className='text-[10px] font-medium text-neutral-500 mt-1'>
                          {item.quantity} × {item.priceAtPurchaseFormatted}
                        </p>
                      </div>
                      <div className='shrink-0 text-right'>
                        <p className='text-sm font-bold text-[#231f20]'>
                          {(
                            item.priceAtPurchase * item.quantity
                          ).toLocaleString('vi-VN')}{' '}
                          ₫
                        </p>
                        {order.status === 'DELIVERED' && (
                          <Link
                            href={`/product/${item.product.id}#reviews`}
                            onClick={onClose}
                            className='mt-1.5 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[#5c4e43] hover:text-[#231f20] hover:underline'
                          >
                            <MessageSquare className='w-3 h-3' />
                            Đánh giá
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Two column info ── */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {/* Shipping Address */}
                <div className='bg-[#FBF8F3] border border-neutral-100 rounded-sm p-5 space-y-3'>
                  <p className='text-[10px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5'>
                    <MapPin className='w-3 h-3 text-[#5c4e43]' /> Địa chỉ giao
                    hàng
                  </p>
                  {order.shippingAddress && (
                    <div className='space-y-1'>
                      <p className='text-xs font-bold text-[#231f20]'>
                        {order.customer?.name}
                      </p>
                      <p className='text-[11px] font-medium text-neutral-500'>
                        {order.customer?.phone}
                      </p>
                      <p className='text-[11px] font-medium text-neutral-500 leading-relaxed'>
                        {order.shippingAddress.street},{' '}
                        {order.shippingAddress.city},{' '}
                        {order.shippingAddress.province},{' '}
                        {order.shippingAddress.country}
                      </p>
                    </div>
                  )}
                </div>

                {/* Payment Info */}
                <div className='bg-[#FBF8F3] border border-neutral-100 rounded-sm p-5 space-y-3'>
                  <p className='text-[10px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5'>
                    <CreditCard className='w-3 h-3 text-[#5c4e43]' /> Thanh toán
                  </p>
                  {order.payment && (
                    <div className='space-y-2'>
                      <div className='flex justify-between items-center'>
                        <span className='text-[10px] font-medium text-neutral-500'>
                          Phương thức
                        </span>
                        <span className='text-[11px] font-bold text-[#231f20]'>
                          {PAYMENT_METHOD_LABEL[order.payment.method] ||
                            order.payment.method}
                        </span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-[10px] font-medium text-neutral-500'>
                          Trạng thái
                        </span>
                        <span
                          className={cn(
                            'text-[11px] font-bold',
                            PAYMENT_STATUS_CONFIG[order.payment.status]?.color,
                          )}
                        >
                          {PAYMENT_STATUS_CONFIG[order.payment.status]?.label}
                        </span>
                      </div>
                      {order.payment.transactionId && (
                        <div className='flex justify-between items-center'>
                          <span className='text-[10px] font-medium text-neutral-500'>
                            Mã GD
                          </span>
                          <span className='text-[10px] font-mono font-bold text-neutral-600'>
                            {order.payment.transactionId.slice(-10)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Order Summary ── */}
              <div className='bg-[#231f20] rounded-sm p-5 space-y-3'>
                <p className='text-[10px] font-bold uppercase tracking-widest text-white/50'>
                  Tóm tắt đơn hàng
                </p>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span className='text-xs font-medium text-white/60'>
                      Tạm tính
                    </span>
                    <span className='text-xs font-bold text-[#FAF6F0]'>
                      {(
                        order.totalAmount + (order.discountAmount || 0)
                      ).toLocaleString('vi-VN')}{' '}
                      ₫
                    </span>
                  </div>
                  {(order.discountAmount || 0) > 0 && (
                    <div className='flex justify-between'>
                      <span className='text-xs font-medium text-white/60'>
                        Giảm giá
                      </span>
                      <span className='text-xs font-bold text-green-400'>
                        -{order.discountAmountFormatted}
                      </span>
                    </div>
                  )}
                  <div className='h-px bg-white/20' />
                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-bold text-white uppercase tracking-wider'>
                      Tổng cộng
                    </span>
                    <span className='text-lg font-bold text-[#FAF6F0]'>
                      {order.totalAmountFormatted}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Date ── */}
              <div className='flex items-center gap-2 text-neutral-400'>
                <Calendar className='w-4 h-4' />
                <span className='text-xs font-medium'>
                  Đặt hàng lúc{' '}
                  {new Date(order.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
            </>
          )}
        </div>

        {/* ── Footer Actions ── */}
        {order && (
          <div className='shrink-0 px-8 py-5 border-t border-neutral-100 bg-[#FBF8F3] flex flex-col sm:flex-row gap-3'>
            {order.status === 'SHIPPED' && (
              <Button
                onClick={() => onConfirmReceipt(order.id)}
                disabled={isConfirming}
                className='flex-1 h-11 bg-[#5c4e43] hover:bg-[#231f20] text-[#FAF6F0] rounded-sm text-[10px] font-bold uppercase tracking-widest transition-colors shadow-none'
              >
                {isConfirming ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  '✓ Xác nhận đã nhận hàng'
                )}
              </Button>
            )}
            {order.status === 'DELIVERED' && (
              <Button
                variant='outline'
                onClick={() => onRefund(order)}
                className='flex-1 h-11 border-neutral-200 text-[#5c4e43] hover:bg-neutral-50 rounded-sm text-[10px] font-bold uppercase tracking-widest bg-white'
              >
                <RotateCcw className='w-3.5 h-3.5 mr-1.5' />
                Đổi trả / Hoàn tiền
              </Button>
            )}
            <Button
              variant='outline'
              onClick={onClose}
              className='flex-1 h-11 border-neutral-200 text-neutral-600 hover:bg-neutral-50 rounded-sm text-[10px] font-bold uppercase tracking-widest bg-white'
            >
              Đóng
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── Main OrderHistory Component ──────────────────────────────────────────────
export const OrderHistory = () => {
  const { data: ordersRes, isLoading } = _orderService.useMyOrders()
  const confirmReceiptMutation = _orderService.useConfirmReceipt()

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [refundOrder, setRefundOrder] = useState<OrderDetail | null>(null)

  const orders = ordersRes?.result?.data || []

  const handleConfirmReceipt = async (orderId: string) => {
    try {
      await confirmReceiptMutation.mutateAsync(orderId)
      toast.success(
        'Xác nhận nhận hàng thành công! Bạn có thể đánh giá sản phẩm ngay bây giờ.',
      )
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Thao tác thất bại')
    }
  }

  if (isLoading) {
    return (
      <div className='space-y-4'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className='h-40 bg-[#FBF8F3] border border-neutral-100 rounded-sm animate-pulse'
          />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className='bg-white rounded-sm p-12 border border-neutral-200 flex flex-col items-center text-center'>
        <div className='w-20 h-20 bg-[#FBF8F3] border border-neutral-100 rounded-none flex items-center justify-center mb-6'>
          <ShoppingBag className='w-10 h-10 text-neutral-300' />
        </div>
        <h3 className='text-xl font-bold uppercase tracking-widest text-[#231f20]'>
          Chưa có đơn hàng nào
        </h3>
        <p className='text-xs font-medium text-neutral-400 mt-2 max-w-xs uppercase tracking-widest'>
          Bắt đầu mua sắm để lấp đầy lịch sử đơn hàng của bạn!
        </p>
        <Link
          href='/shop'
          className='mt-8 px-8 py-4 bg-[#231f20] text-white rounded-none text-xs font-bold uppercase tracking-widest hover:bg-[#5c4e43] transition-colors'
        >
          Khám phá cửa hàng
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className='space-y-4'>
        {orders.map((order) => {
          const config =
            STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]
          const StatusIcon = config.icon

          return (
            <motion.div
              key={order.id}
              layout
              className='bg-white rounded-sm border border-neutral-200 overflow-hidden hover:border-neutral-400 transition-colors'
            >
              {/* Order Header */}
              <div className='px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 bg-[#FBF8F3]'>
                {/* Left: status icon + order id */}
                <div className='flex items-center gap-4'>
                  <div
                    className={cn(
                      'w-10 h-10 rounded-sm flex items-center justify-center shrink-0 border',
                      config.bgColor,
                      config.color,
                      config.borderColor,
                    )}
                  >
                    <StatusIcon className='w-5 h-5' />
                  </div>
                  <div>
                    <p className='text-[9px] font-bold uppercase tracking-widest text-neutral-400'>
                      Mã đơn hàng
                    </p>
                    <p className='text-sm font-bold text-[#231f20] uppercase tracking-wider'>
                      #{order.id.slice(-12)}
                    </p>
                  </div>
                </div>

                {/* Right: date + badge + CTA */}
                <div className='flex flex-wrap items-center gap-3'>
                  <div className='flex items-center gap-1.5'>
                    <Calendar className='w-3.5 h-3.5 text-neutral-300' />
                    <span className='text-[11px] font-medium text-neutral-400'>
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  <span
                    className={cn(
                      'px-3 py-1 rounded-sm text-[9px] font-bold uppercase tracking-widest border',
                      config.bgColor,
                      config.color,
                      config.borderColor,
                    )}
                  >
                    {config.label}
                  </span>

                  <button
                    onClick={() => setSelectedOrderId(order.id)}
                    className='flex items-center gap-1.5 px-4 py-2 bg-white border border-neutral-200 hover:bg-[#231f20] hover:border-[#231f20] hover:text-white text-neutral-700 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all duration-200 group'
                  >
                    Xem chi tiết
                    <ArrowUpRight className='w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                  </button>
                </div>
              </div>

              {/* Product Preview (max 3) */}
              <div className='px-6 py-4 flex items-center justify-between gap-4 border-b border-neutral-100'>
                <div className='flex items-center gap-2 flex-wrap'>
                  {order.items?.slice(0, 3).map((item, idx) => (
                    <div key={item.id} className='relative'>
                      <div className='w-12 h-12 rounded-none overflow-hidden border border-neutral-200 bg-[#FBF8F3]'>
                        <Image
                          src={
                            item.product.thumbnail?.url || '/placeholder.png'
                          }
                          alt={item.product.name}
                          width={48}
                          height={48}
                          className='object-cover w-full h-full'
                        />
                      </div>
                      {idx === 2 && (order.items?.length || 0) > 3 && (
                        <div className='absolute inset-0 bg-black/60 flex items-center justify-center'>
                          <span className='text-white text-[9px] font-bold'>
                            +{(order.items?.length || 0) - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className='ml-2 flex flex-col'>
                    <span className='text-[10px] font-medium text-neutral-400'>
                      {order.items?.length} sản phẩm
                    </span>
                    <span className='text-sm font-bold text-[#231f20]'>
                      {order.totalAmountFormatted}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status bar at bottom */}
              <div className='px-6 py-4 bg-[#FBF8F3]/50'>
                <OrderStatusTimeline status={order.status} />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ── Order Detail Modal ── */}
      <OrderDetailModal
        orderId={selectedOrderId}
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        onRefund={(order) => {
          setSelectedOrderId(null)
          setRefundOrder(order)
        }}
        onConfirmReceipt={handleConfirmReceipt}
        isConfirming={confirmReceiptMutation.isPending}
      />

      {/* ── Refund Modal ── */}
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
