'use client'

import React from 'react'
import CartItem from '~/features/public/cart/cart-item'
import ShippingForm from '~/features/public/cart/shipping-form'
import PaymentSelection from '~/features/public/cart/payment-selection'
import CartSummary from '~/features/public/cart/cart-summary'
import StickyCheckoutBar from '~/features/public/cart/sticky-checkout-bar'
import { Info, X, ShoppingBag, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { _cartService } from '~/features/public/cart/cart.query'

export default function CartPage() {
  const { data: cartData, isLoading, isError } = _cartService.useCart()
  const updateCartItemMutation = _cartService.useUpdateCartItem()
  const removeCartItemMutation = _cartService.useRemoveCartItem()
  const clearCartMutation = _cartService.useClearCart()

  const cart = cartData?.result
  const cartItems = cart?.items || []
  const subtotal = cartItems.reduce((acc, item) => acc + (item.variant.price * item.quantity), 0)

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    updateCartItemMutation.mutate({ itemId, payload: { quantity: newQuantity } })
  }

  const handleRemoveItem = (itemId: string) => {
    removeCartItemMutation.mutate(itemId)
  }

  const handleClearCart = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ sản phẩm khỏi giỏ hàng?')) {
      clearCartMutation.mutate()
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Đang tải giỏ hàng...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
        <h2 className="text-2xl font-black uppercase tracking-tight text-red-500">Đã xảy ra lỗi</h2>
        <p className="text-sm font-medium text-gray-500 max-w-md">Không thể tải giỏ hàng của bạn vào lúc này. Vui lòng thử lại sau.</p>
        <Link href="/shop" className="bg-black text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-md">
          Quay lại cửa hàng
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Top Banner */}
      <div className="bg-gray-50 border-b">
         <div className="main-container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
               <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Giỏ hàng</h1>
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                 Có {cartItems.length > 0 ? cartItems.length * 2 : 4} người đang thêm cùng sản phẩm giống bạn vào giỏ hàng.
               </p>
            </div>
            <div className="bg-blue-600 text-white p-6 rounded-3xl flex items-center gap-6 shadow-xl shadow-blue-600/20">
               <div>
                  <p className="text-sm font-black uppercase tracking-widest mb-1">Gia nhập COOLCLUB ngay</p>
                  <p className="text-[10px] opacity-80 font-medium">Nhận ngay Voucher -15% cho đơn hàng đầu tiên</p>
               </div>
               <button className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
                  Tham gia
               </button>
            </div>
         </div>
      </div>

      <div className="main-container mx-auto px-4 py-12">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-black uppercase tracking-tight mb-2">Giỏ hàng trống</h2>
              <p className="text-sm text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
                Giỏ hàng của bạn đang trống. Hãy quay lại cửa hàng và chọn các sản phẩm yêu thích của bạn!
              </p>
            </div>
            <Link href="/shop" className="bg-black text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-lg hover:scale-105 duration-200">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
            {/* Left Column: Form & Payment */}
            <div className="lg:col-span-7 flex flex-col gap-16">
              <ShippingForm />
              <div className="h-px bg-gray-100" />
              <PaymentSelection />
            </div>

            {/* Right Column: Cart items & Summary */}
            <div className="lg:col-span-5 flex flex-col gap-10">
              {/* Cart Header */}
              <div className="flex flex-col gap-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-5 h-5 accent-black cursor-pointer" />
                      <span className="text-sm font-black uppercase tracking-widest">Tất cả sản phẩm ({cartItems.length})</span>
                    </div>
                    <button 
                      onClick={handleClearCart}
                      className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                    >
                      Xóa tất cả
                    </button>
                 </div>

                 <div className="bg-blue-50/50 border border-blue-50 p-4 rounded-2xl flex items-center justify-between group">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                       <Info className="w-4 h-4" />
                       Yên tâm 60 ngày đổi trả - Freeship đơn từ 200k
                    </div>
                    <button className="text-blue-300 hover:text-blue-600 transition-colors"><X className="w-4 h-4" /></button>
                 </div>
              </div>

              {/* Item List */}
              <div className="flex flex-col">
                 {cartItems.map((item) => (
                   <CartItem 
                     key={item.id} 
                     item={item} 
                     onUpdateQuantity={(q) => handleUpdateQuantity(item.id, q)}
                     onRemove={() => handleRemoveItem(item.id)}
                   />
                 ))}
              </div>

              {/* Summary & Voucher */}
              <CartSummary subtotal={subtotal} />
            </div>
          </div>
        )}
      </div>

      {cartItems.length > 0 && <StickyCheckoutBar total={subtotal} />}
    </div>
  )
}
