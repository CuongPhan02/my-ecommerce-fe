'use client'

import React, { useState, useEffect } from 'react'
import CartItem from '~/features/public/cart/cart-item'
import ShippingForm from '~/features/public/cart/shipping-form'
import PaymentSelection from '~/features/public/cart/payment-selection'
import CartSummary from '~/features/public/cart/cart-summary'
import StickyCheckoutBar from '~/features/public/cart/sticky-checkout-bar'
import { Info, X, ShoppingBag, Loader2, MapPin, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { _cartService } from '~/features/public/cart/cart.query'
import { _profileService } from '~/features/public/profile/profile.query'
import { _voucherService } from '~/features/public/voucher/voucher.query'
import { toast } from 'react-toastify'
import { ConfirmModal } from '~/components/shared/confirm-modal'
import { AUTH_QUERY } from '~/features/public/auth/auth.query'
import { cn } from '~/lib/utils'
import { Voucher } from '~/features/public/voucher/types'

export default function CartPage() {
  const router = useRouter()
  const { data: cartData, isLoading, isError } = _cartService.useCart()
  const { data: addressesRes } = _profileService.useMyAddresses()
  const { data: profileRes } = AUTH_QUERY.useMe()

  const updateCartItemMutation = _cartService.useUpdateCartItem()
  const removeCartItemMutation = _cartService.useRemoveCartItem()
  const clearCartMutation = _cartService.useClearCart()
  const createOrderMutation = _cartService.useCreateOrder()
  const createPaymentUrlMutation = _cartService.useCreatePaymentUrl()
  const applyVoucherMutation = _voucherService.useApplyVoucher()

  const [shippingValues, setShippingValues] = useState({
    shippingName: '',
    shippingPhone: '',
    shippingEmail: '',
    street: '',
    province: '',
    city: '',
    note: '',
  })

  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [couponCode, setCouponCode] = useState('')
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showAddressList, setShowAddressList] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false)
  const [itemToRemove, setItemToRemove] = useState<string | null>(null)

  const cart = cartData?.result
  const addresses = addressesRes?.result || []
  const user = profileRes?.result

  // Auto-fill form with default address or user info
  useEffect(() => {
    if (user && !isInitialized) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0]

      setShippingValues({
        shippingName: defaultAddr?.receiverName || user.name || '',
        shippingEmail: user.email || '',
        shippingPhone: defaultAddr?.phone || user.phone || '',
        street: defaultAddr?.street || '',
        city: defaultAddr?.city || '',
        province: defaultAddr?.province || '',
        note: '',
      })
      setIsInitialized(true)
    }
  }, [user, addresses, isInitialized])

  const handleSelectAddress = (addr: any) => {
    setShippingValues(prev => ({
      ...prev,
      shippingName: addr.receiverName,
      shippingPhone: addr.phone,
      street: addr.street,
      city: addr.city,
      province: addr.province,
    }))
    setShowAddressList(false)
    toast.info('Đã áp dụng địa chỉ đã chọn')
  }
  const cartItems = cart?.items || []
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.variant.price * item.quantity,
    0,
  )

  let discount = 0
  if (appliedVoucher) {
    if (appliedVoucher.type === 'PERCENTAGE') {
      discount = (subtotal * appliedVoucher.discountValue) / 100
    } else if (appliedVoucher.type === 'FIXED') {
      discount = appliedVoucher.discountValue
    }
  }
  const finalTotal = Math.max(0, subtotal - discount)

  const isSubmitting =
    createOrderMutation.isPending ||
    createPaymentUrlMutation.isPending ||
    clearCartMutation.isPending

  const handleApplyVoucher = async (code: string) => {
    if (!code) {
      setAppliedVoucher(null)
      setCouponCode('')
      return
    }

    try {
      const res = await applyVoucherMutation.mutateAsync({
        code,
        orderValue: subtotal
      })

      if (res?.result) {
        setAppliedVoucher(res.result)
        setCouponCode(res.result.code)
        toast.success(`Đã áp dụng mã ${res.result.code}`)
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể áp dụng mã này'
      toast.error(msg)
      setAppliedVoucher(null)
      setCouponCode('')
    }
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    updateCartItemMutation.mutate({
      itemId,
      payload: { quantity: newQuantity },
    })
  }

  const handleRemoveItem = (itemId: string) => {
    setItemToRemove(itemId)
  }

  const handleClearCart = () => {
    setIsClearCartModalOpen(true)
  }

  const handleShippingChange = (field: string, value: string) => {
    setShippingValues((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev }
        delete copy[field]
        return copy
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!shippingValues.shippingName.trim()) {
      newErrors.shippingName = 'Họ tên không được để trống'
    } else if (shippingValues.shippingName.trim().length < 2) {
      newErrors.shippingName = 'Họ tên phải có ít nhất 2 ký tự'
    }

    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/
    if (!shippingValues.shippingPhone.trim()) {
      newErrors.shippingPhone = 'Số điện thoại không được để trống'
    } else if (!phoneRegex.test(shippingValues.shippingPhone.trim())) {
      newErrors.shippingPhone = 'Số điện thoại không hợp lệ (ví dụ: 0987654321)'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!shippingValues.shippingEmail.trim()) {
      newErrors.shippingEmail = 'Email không được để trống'
    } else if (!emailRegex.test(shippingValues.shippingEmail.trim())) {
      newErrors.shippingEmail = 'Email không hợp lệ (ví dụ: customer@gmail.com)'
    }

    if (!shippingValues.street.trim()) {
      newErrors.street = 'Địa chỉ chi tiết không được để trống'
    }

    if (!shippingValues.province.trim()) {
      newErrors.province = 'Tỉnh / Thành phố không được để trống'
    }

    if (!shippingValues.city.trim()) {
      newErrors.city = 'Quận / Huyện không được để trống'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOrder = async () => {
    if (!validateForm()) {
      toast.warning('Vui lòng điền đầy đủ và chính xác thông tin vận chuyển!')
      return
    }

    try {
      const payload = {
        shippingAddressId: undefined,
        couponCode: couponCode || undefined,
        paymentMethod: paymentMethod as 'COD' | 'VNPAY',
        shippingName: shippingValues.shippingName,
        shippingPhone: shippingValues.shippingPhone,
        shippingEmail: shippingValues.shippingEmail,
        street: shippingValues.street,
        province: shippingValues.province,
        city: shippingValues.city,
        note: shippingValues.note || undefined,
      }

      const orderRes = await createOrderMutation.mutateAsync(payload)
      const orderId =
        orderRes?.result?.id || orderRes?.result?.orderId || orderRes?.result

      if (!orderId) {
        throw new Error('Không nhận được mã đơn hàng từ hệ thống')
      }

      if (paymentMethod === 'VNPAY') {
        const paymentRes = await createPaymentUrlMutation.mutateAsync({
          orderId: String(orderId),
          language: 'vn',
        })
        const paymentUrl =
          paymentRes?.result?.paymentUrl ||
          (typeof paymentRes?.result === 'string'
            ? paymentRes.result
            : undefined)
        if (paymentUrl) {
          window.location.href = paymentUrl
        } else {
          throw new Error('Không tạo được đường dẫn thanh toán VNPAY')
        }
      } else {
        await clearCartMutation.mutateAsync()
        router.push(`/checkout/result?orderId=${orderId}&success=true`)
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.'
      toast.error(`Đã xảy ra lỗi: ${message}`)
    }
  }

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4'>
        <Loader2 className='w-10 h-10 animate-spin text-primary' />
        <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>
          Đang tải giỏ hàng...
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center'>
        <h2 className='text-2xl font-black uppercase tracking-tight text-red-500'>
          Đã xảy ra lỗi
        </h2>
        <p className='text-sm font-medium text-gray-500 max-w-md'>
          Không thể tải giỏ hàng của bạn vào lúc này. Vui lòng thử lại sau.
        </p>
        <Link
          href='/shop'
          className='bg-[#231f20] text-white px-8 py-3 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-[#5c4e43] transition-all shadow-md'
        >
          Quay lại cửa hàng
        </Link>
      </div>
    )
  }

  return (
    <div className='bg-[#FAF9F6] min-h-screen pb-24'>
      {/* Top Banner */}
      <div className='bg-[#FBF8F3] border-b border-[#e8dfd5]/60'>
        <div className='main-container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6'>
          <div className='flex-1'>
            <h1 className='text-2xl font-black uppercase tracking-tight text-[#231f20] mb-2'>
              Giỏ hàng & Thanh toán
            </h1>
            <p className='text-xs font-semibold text-[#5c4e43]/85 uppercase tracking-widest flex items-center gap-2'>
              <span className='w-2 h-2 bg-[#3d7a5c] rounded-full animate-pulse' />
              Có {cartItems.length > 0 ? cartItems.length * 2 : 4} người đang
              thêm cùng sản phẩm giống bạn vào giỏ hàng.
            </p>
          </div>
          <div className='bg-[#231f20] text-white p-6 rounded-sm flex items-center gap-6 shadow-md'>
            <div>
              <p className='text-xs font-black uppercase tracking-widest mb-1'>
                Gia nhập LUNÉ CLUB ngay
              </p>
              <p className='text-[10px] opacity-80 font-medium'>
                Nhận ngay Voucher -15% cho đơn hàng đầu tiên
              </p>
            </div>
            <button className='bg-white text-[#231f20] px-5 py-3 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-[#FAF6F0] transition-all border-none cursor-pointer'>
              Tham gia
            </button>
          </div>
        </div>
      </div>

      <div className='main-container mx-auto px-4 py-12'>
        {cartItems.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-24 gap-6 bg-white border border-[#e8dfd5]/60 rounded-sm shadow-xs max-w-2xl mx-auto'>
            <div className='w-16 h-16 bg-[#FBF8F3] rounded-sm flex items-center justify-center text-neutral-300 border border-[#e8dfd5]/60'>
              <ShoppingBag className='w-8 h-8' />
            </div>
            <div className='text-center space-y-2'>
              <h2 className='text-lg font-black uppercase tracking-tight text-[#231f20]'>
                Giỏ hàng trống
              </h2>
              <p className='text-xs text-neutral-500 font-semibold max-w-sm mx-auto leading-relaxed'>
                Giỏ hàng của bạn đang trống. Hãy quay lại cửa hàng và chọn các
                sản phẩm yêu thích của bạn!
              </p>
            </div>
            <Link
              href='/shop'
              className='bg-[#231f20] text-white px-8 py-3.5 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-[#5c4e43] transition-all shadow-xs duration-200'
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 items-start'>
            {/* Left Column: Form & Payment Steps */}
            <div className='lg:col-span-8 flex flex-col gap-10'>
              {/* Step indicator */}
              <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-200/50 pb-4">
                <span className="text-black">01. Giỏ hàng & Thanh toán</span>
                <span>/</span>
                <span>02. Xác nhận</span>
                <span>/</span>
                <span>03. Hoàn tất</span>
              </div>

              {/* Step 1: Cart Items */}
              <div className="bg-white border border-[#e8dfd5]/55 rounded-sm p-6 md:p-8 flex flex-col gap-6 shadow-xs">
                <div className='flex items-center justify-between border-b border-neutral-100 pb-4'>
                  <div className='flex items-center gap-3'>
                    <div className="w-6 h-6 rounded-full bg-[#5c4e43] text-white flex items-center justify-center text-xs font-black">1</div>
                    <h2 className='text-xs font-black uppercase tracking-widest text-[#231f20]'>
                      Sản phẩm trong giỏ hàng ({cartItems.length})
                    </h2>
                  </div>
                  <button
                    onClick={handleClearCart}
                    className='text-[9px] font-bold text-neutral-400 hover:text-red-500 transition-colors uppercase tracking-widest cursor-pointer border-none bg-transparent'
                  >
                    Xóa tất cả
                  </button>
                </div>

                <div className='bg-[#FBF8F3] border border-[#e8dfd5]/65 p-4 rounded-sm flex items-center justify-between group'>
                  <div className='flex items-center gap-3 text-[10px] font-bold text-[#5c4e43] uppercase tracking-widest'>
                    <Info className='w-4 h-4' />
                    Yên tâm 60 ngày đổi trả - Freeship đơn từ 200k
                  </div>
                  <button className='text-neutral-400 hover:text-[#5c4e43] transition-colors border-none bg-transparent cursor-pointer'>
                    <X className='w-4 h-4' />
                  </button>
                </div>

                {/* Item List */}
                <div className='flex flex-col divide-y divide-neutral-100'>
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={(q) => handleUpdateQuantity(item.id, q)}
                      onRemove={() => handleRemoveItem(item.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Step 2: Shipping Form */}
              <div className="bg-white border border-[#e8dfd5]/55 rounded-sm p-6 md:p-8 shadow-xs">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 mb-6">
                  <div className="w-6 h-6 rounded-full bg-[#5c4e43] text-white flex items-center justify-center text-xs font-black">2</div>
                  <h2 className='text-xs font-black uppercase tracking-widest text-[#231f20]'>
                    Thông tin giao hàng
                  </h2>
                </div>
                <ShippingForm
                  values={shippingValues}
                  onChange={handleShippingChange}
                  errors={errors}
                />
              </div>

              {/* Step 3: Payment Selection */}
              <div className="bg-white border border-[#e8dfd5]/55 rounded-sm p-6 md:p-8 shadow-xs">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 mb-6">
                  <div className="w-6 h-6 rounded-full bg-[#5c4e43] text-white flex items-center justify-center text-xs font-black">3</div>
                  <h2 className='text-xs font-black uppercase tracking-widest text-[#231f20]'>
                    Phương thức thanh toán
                  </h2>
                </div>
                <PaymentSelection
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                />
              </div>
            </div>

            {/* Right Column: Address Selection & Cart Summary */}
            <div className='lg:col-span-4 flex flex-col gap-8 lg:sticky lg:top-28'>
              {/* Address Selection Dropdown for logged in users */}
              {user && addresses.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowAddressList(!showAddressList)}
                    className="w-full flex items-center justify-between p-5 bg-[#FBF8F3] border border-[#e8dfd5]/65 rounded-sm hover:bg-[#FAF6F0] transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#5c4e43] text-white rounded-sm flex items-center justify-center shadow-xs">
                        <MapPin className="w-4.5 h-4.5" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#5c4e43]">Sổ địa chỉ</p>
                        <p className="text-xs font-black text-[#231f20]">Chọn từ địa chỉ đã lưu</p>
                      </div>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-[#5c4e43] transition-transform duration-300", showAddressList && "rotate-180")} />
                  </button>

                  {showAddressList && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#e8dfd5]/60 rounded-sm shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="p-2 max-h-80 overflow-y-auto no-scrollbar">
                        {addresses.map((addr) => (
                          <button
                            key={addr.id}
                            onClick={() => handleSelectAddress(addr)}
                            className="w-full text-left p-4 hover:bg-[#FBF8F3] rounded-sm transition-all border border-transparent hover:border-neutral-100 flex items-start gap-4"
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 mt-1",
                              addr.isDefault ? "bg-[#5c4e43] text-white" : "bg-neutral-100 text-neutral-400"
                            )}>
                              <MapPin className="w-4.5 h-4.5" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs font-black text-[#231f20]">{addr.receiverName} • {addr.phone}</p>
                              <p className="text-[10px] font-bold text-neutral-400">{addr.street}</p>
                              <p className="text-[10px] font-bold text-neutral-400">{addr.city}, {addr.province}</p>
                              {addr.isDefault && (
                                <span className="text-[8px] font-black uppercase tracking-widest text-[#5c4e43]">Mặc định</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Summary & Voucher */}
              <CartSummary
                subtotal={subtotal}
                total={finalTotal}
                discountAmount={discount}
                onApplyVoucher={handleApplyVoucher}
                isApplyingVoucher={applyVoucherMutation.isPending}
                appliedVoucherCode={appliedVoucher?.code}
                onOrder={handleOrder}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        )}
      </div>

      {cartItems.length > 0 && (
        <StickyCheckoutBar
          total={finalTotal}
          paymentMethod={paymentMethod}
          couponCode={couponCode}
          isSubmitting={isSubmitting}
          onOrder={handleOrder}
        />
      )}

      {/* Confirm Modals */}
      <ConfirmModal
        isOpen={isClearCartModalOpen}
        onClose={() => setIsClearCartModalOpen(false)}
        onConfirm={() => clearCartMutation.mutate()}
        title="Xóa giỏ hàng"
        description="Bạn có chắc chắn muốn xóa toàn bộ sản phẩm khỏi giỏ hàng? Hành động này không thể hoàn tác."
        variant="destructive"
        confirmText="Xóa toàn bộ"
        isLoading={clearCartMutation.isPending}
      />

      <ConfirmModal
        isOpen={!!itemToRemove}
        onClose={() => setItemToRemove(null)}
        onConfirm={() => {
          if (itemToRemove) {
            removeCartItemMutation.mutate(itemToRemove)
          }
        }}
        title="Xóa sản phẩm"
        description="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
        variant="destructive"
        confirmText="Xóa ngay"
        isLoading={removeCartItemMutation.isPending}
      />
    </div>
  )
}
