export interface Voucher {
  id: string
  code: string
  description: string | null
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING'
  discountValue: number
  discountValueFormatted: string
  minOrderValue: number
  minOrderValueFormatted: string
  usageLimit: number | null
  usedCount: number
  isActive: boolean
  expirationDate: string | null
  createdAt: string
  updatedAt: string
}

export interface ApplyVoucherPayload {
  code: string
  orderValue: number
}
