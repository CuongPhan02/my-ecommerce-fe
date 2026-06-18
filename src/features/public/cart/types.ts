export interface CartAttribute {
  id: string
  value: string
  name: string
  attributeValue?: {
    id: string
    value: string
    name: string | null
    attributeId: string
    attribute: {
      id: string
      name: string
    }
  }
}

export interface CartVariant {
  id: string
  sku: string
  price: number
  priceFormatted: string
  stockQuantity: number
  attributes: CartAttribute[]
}

export interface CartProduct {
  id: string
  name: string
  slug: string
  thumbnailUrl: string
}

export interface CartItem {
  id: string
  quantity: number
  productVariantId: string
  variant: CartVariant
  product: CartProduct
}

export interface Cart {
  id: string
  userId: string
  createdAt: string
  updatedAt: string
  items: CartItem[]
}

export interface ShippingMethod {
  id: string
  name: string
  fee: number
  estimatedDays: string | null
  isActive: boolean
}

export interface ShippingConfig {
  enableShipping: boolean
}

export interface AddToCartPayload {
  productVariantId: string
  quantity: number
}

export interface UpdateCartItemPayload {
  quantity: number
}

export interface CreateOrderPayload {
  shippingAddressId?: string
  couponCode?: string
  paymentMethod: 'COD' | 'VNPAY'
  shippingName: string
  shippingPhone: string
  shippingEmail: string
  street: string
  province: string
  city: string
  note?: string
}

export interface CreatePaymentUrlPayload {
  orderId: string
  language: string
  bankCode?: string
}

