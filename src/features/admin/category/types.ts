export type Category = {
  id: string
  metaImage: string
  name: string
  parent: {
    name: string
  }
  icon: null | string
  isFeatured: boolean
  isActive: boolean
}

export type TableMeta = {
  updateProductStatus: (
    productId: string,
    columnId: 'isActive' | 'isFeatured',
    value: boolean
  ) => void
}
