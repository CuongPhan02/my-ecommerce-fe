export type Variant = {
  attributes: {
    attributeValue: {
      attribute: {
        id: string
        name: string
      }
    }
    attributeId: string
    id: string
    value: string
  }[]
  attributeValueId: string
  productVariantId: string
  id: string
  price: number
  productId: string
  purchasePrice: number
  sku: string
  stockQuantity: number
}

export type AttributeValue = {
  id: string
  value: string
  attributeId: string
}

export type ProductAttribute = {
  id: string
  name: string
  values: AttributeValue[]
  createdAt: string
  updatedAt: string
}

export type ProductAttributeInput = {
  name: string
  values: string[]
}

export type CollectionItem = {
  collection: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    description: string | null
    imageUrl: string | null
    slug: string
  }
  collectionId: string
  displayOrder: number
  productId: string
}

export type Product = {
  id: string
  name: string
  slug: string
  description?: string
  brand: { id: string; name: string }
  brandId: string
  category: { id: string; name: string }
  categoryId: string
  collections: CollectionItem[]
  createdAt: string
  updatedAt: string
  disableShipping: boolean
  discountEndDate: null | string
  discountStartDate: null | string
  discountType: 'PERCENTAGE' | 'FIXED' | null
  discountValue: number | null
  hasWarranty: boolean
  thumbnail: {
    id: string
    altText: string
    fileId: string
    fileName: string
    fileType: string
    size: number
    url: string
    createdAt: string
    updatedAt: string
  }
  thumbnailId: string
  images: {
    id: string
    url: string
    mediaId: string
    productId: string
    displayOrder: number
    media: {
      id: string
      altText: string
      fileId: string
      fileName: string
      fileType: string
      size: number
      url: string
      createdAt: string
      updatedAt: string
    }
  }[]
  isFeatured: boolean
  isRefunded: boolean
  metaDescription: string
  metaImage: {
    id: string
    altText: string
    fileId: string
    fileName: string
    fileType: string
    size: number
    url: string
    createdAt: string
    updatedAt: string
  }
  metaImageId: string
  metaTitle: string
  options: {
    name: string
    values: string[]
  }[]
  summary?: string
  type: 'SINGLE' | 'VARIANT'
  stock: number
  isActive: boolean
  unit?: string
  condition?: string
  tags: string[]
  variants: Variant[]
}

export type ProductParams = {
  page?: number
  limit?: number
  search?: string | null
  categoryId?: string | null
  brandId?: string | null
  minPrice?: number | null
  maxPrice?: number | null
  sort?: string | null
}

export type TableMeta = {
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  updateProductStatus: (
    productId: string,
    columnId: 'isActive' | 'isFeatured',
    value: boolean,
  ) => void
}
