export interface Voucher {
  id: string
  code: string
  description: string
  type: 'FIXED' | 'PERCENTAGE' | 'FREE_SHIPPING'
  discountValue: number
  minOrderValue: number
  usageLimit: number
  usedCount: number
  isActive: boolean
  expirationDate: string
  createdAt?: string
  updatedAt?: string
}

export interface VoucherParams {
  page?: number
  limit?: number
  search?: string
  type?: 'FIXED' | 'PERCENTAGE' | 'FREE_SHIPPING'
  isActive?: boolean
}
