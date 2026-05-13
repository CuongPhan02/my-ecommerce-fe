import { ApiResponse } from '~/@types/api'
import { https } from '~/config/https'
import { Collection, CollectionDetail, CollectionParams } from './types'
import { CollectionSchemaType } from './collection.validate'

export const _collectionApi = {
  getCollections: async (params: CollectionParams) => {
    const res = await https.get<
      ApiResponse<{
        data: Collection[]
        meta: { total: number; page: number; limit: number; totalPages: number }
      }>
    >('/collections', { params })
    return res.data
  },

  getCollection: async (id: string) => {
    const res = await https.get<ApiResponse<CollectionDetail>>(
      `/collections/${id}`,
    )
    return res.data
  },

  createCollection: async (data: CollectionSchemaType) => {
    const res = await https.post<ApiResponse<Collection>>('/collections', data)
    return res.data
  },

  updateCollection: async (id: string, data: Partial<CollectionSchemaType>) => {
    const res = await https.put<ApiResponse<Collection>>(
      `/collections/${id}`,
      data,
    )
    return res.data
  },

  deleteCollection: async (id: string) => {
    const res = await https.delete<ApiResponse<null>>(`/collections/${id}`)
    return res.data
  },

  addProducts: async (collectionId: string, productIds: string[]) => {
    const res = await https.post<ApiResponse<null>>(
      `/collections/${collectionId}/products`,
      { productIds },
    )
    return res.data
  },
}
