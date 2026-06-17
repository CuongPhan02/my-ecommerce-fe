export interface OrderItem {
  id: string
  quantity: number
  priceAtPurchase: number
  priceAtPurchaseFormatted: string
  variant: {
    id: string
    sku: string
    price: number
    priceFormatted: string
  }
  product: {
    id: string
    name: string
    slug: string
    thumbnail: {
      url: string
      altText: string | null
    }
  }
}

export interface OrderDetail {
  id: string
  totalAmount: number
  totalAmountFormatted: string
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED'
  discountAmount: number
  discountAmountFormatted: string
  couponId: string | null
  createdAt: string
  updatedAt: string
  customer: {
    id: string
    name: string
    email: string
    phone: string
  }
  shippingAddress: {
    id: string
    street: string
    city: string
    province: string
    postalCode: string
    country: string
  }
  payment: {
    id: string
    method: string
    status: 'PENDING' | 'COMPLETED' | 'FAILED'
    amount: number
    amountFormatted: string
    transactionId: string | null
    createdAt: string
  }
  items: OrderItem[]
  refundRequest?: {
    id: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    reason: string
    rejectReason: string | null
  } | null
}
