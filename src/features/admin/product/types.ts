export type Variant = {
  price: number
}

export type Product = {
  id: string
  name: string
  imageUrl: string
  category: { name: string }
  brand: { name: string }
  stock: number
  isFeatured: boolean
  isActive: boolean
  updatedAt: string
  variants: Variant[]
}

export type TableMeta = {
  updateProductStatus: (
    productId: string,
    columnId: 'isActive' | 'isFeatured',
    value: boolean
  ) => void
}
