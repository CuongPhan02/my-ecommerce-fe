import { Product } from '../product/types'

export interface Collection {
  id: string
  name: string
  slug: string
  description?: string | null
  imageUrl?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CollectionDetail extends Collection {
  products: Product[]
}

export interface CollectionParams {
  page?: number
  limit?: number
  search?: string | null
}

export interface AddProductsToCollectionParams {
  collectionId: string
  productIds: string[]
}
