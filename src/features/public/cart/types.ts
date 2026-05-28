export interface CartAttribute {
  id: string
  value: string
  name: string
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

export interface AddToCartPayload {
  productVariantId: string
  quantity: number
}

export interface UpdateCartItemPayload {
  quantity: number
}
