import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { _brandApi } from './brand.api'
import { BrandSchemaType } from './brand.validate'
import { BrandParams } from './types'

export const BRAND_QUERY_KEY = {
  ALL: ['BRANDS'] as const,
  LIST: (params?: BrandParams) =>
    [...BRAND_QUERY_KEY.ALL, 'LIST', params] as const,
  DETAIL: (id: string) => [...BRAND_QUERY_KEY.ALL, 'DETAIL', id] as const,
}

export const _brandService = {
  useBrands: (params?: BrandParams) => {
    return useQuery({
      queryKey: BRAND_QUERY_KEY.LIST(params),
      queryFn: () => _brandApi.fetchBrands(params),
    })
  },

  useBrand: (id: string) => {
    return useQuery({
      queryKey: BRAND_QUERY_KEY.DETAIL(id),
      queryFn: () => _brandApi.fetchBrandById(id),
      enabled: !!id,
    })
  },

  useBrandCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (payload: BrandSchemaType) =>
        _brandApi.createBrand(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: BRAND_QUERY_KEY.ALL })
      },
    })
  },

  useBrandUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: BrandSchemaType }) =>
        _brandApi.updateBrand(id, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: BRAND_QUERY_KEY.ALL })
      },
    })
  },

  useBrandDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (id: string) => _brandApi.deleteBrand(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: BRAND_QUERY_KEY.ALL })
      },
    })
  },

  useBrandsDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (ids: string[]) => _brandApi.deleteBrands(ids),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: BRAND_QUERY_KEY.ALL })
      },
    })
  },
}
