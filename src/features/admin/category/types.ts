export type Category = {
  id: string
  name: string
  slug: string
  parentId: string | null
  parent: {
    id: string
    name: string
    slug: string
  } | null
  metaImage?: string
  icon?: null | string
  isFeatured?: boolean
  isActive?: boolean
}

export type TableMeta = {
  updateProductStatus: (
    productId: string,
    columnId: 'isActive' | 'isFeatured',
    value: boolean
  ) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}
