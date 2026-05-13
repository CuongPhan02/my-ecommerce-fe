export interface Brand {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface BrandParams {
  page?: number
  limit?: number
  search?: string | null
  sort?: 'newest' | 'oldest' | string | null
}

export type TableMeta = {
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}
