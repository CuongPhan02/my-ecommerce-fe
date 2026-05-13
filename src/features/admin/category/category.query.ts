import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { _categoryApi, CategoryParams } from './category.api'
import { CategorySchemaType } from './category.validate'

export const CATEGORY_QUERY_KEY = {
  ALL: ['CATEGORIES'] as const,
  LIST: (params?: CategoryParams) =>
    [...CATEGORY_QUERY_KEY.ALL, 'LIST', params] as const,
  DETAIL: (id: string) => [...CATEGORY_QUERY_KEY.ALL, 'DETAIL', id] as const,
}

export const _categoryService = {
  useCategories: (params?: CategoryParams) => {
    return useQuery({
      queryKey: CATEGORY_QUERY_KEY.LIST(params),
      queryFn: () => _categoryApi.fetchCategories(params),
    })
  },

  useCategory: (id: string) => {
    return useQuery({
      queryKey: CATEGORY_QUERY_KEY.DETAIL(id),
      queryFn: () => _categoryApi.fetchCategoryById(id),
      enabled: !!id,
    })
  },

  useCategoryCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (payload: CategorySchemaType) =>
        _categoryApi.createCategory(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY.ALL })
      },
    })
  },

  useCategoryUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: CategorySchemaType }) =>
        _categoryApi.updateCategory(id, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY.ALL })
      },
    })
  },

  useCategoryDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (id: string) => _categoryApi.deleteCategory(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY.ALL })
      },
    })
  },

  useCategoriesDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (ids: string[]) => _categoryApi.deleteCategories(ids),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY.ALL })
      },
    })
  },
}
