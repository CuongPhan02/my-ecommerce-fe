import { ProductListResponse } from '~/features/admin/product/product.api'
import { API_BASE_URL } from '~/constants'

export type ShopFilters = {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  brandId?: string
  brandIds?: string[]
  collectionId?: string
  attributeValueIds?: string[]
  minPrice?: number
  maxPrice?: number
  sort?: string
}

export const shopApi = {
  fetchProducts: async (filters: ShopFilters): Promise<ProductListResponse> => {
    // Construct query parameters
    const params = new URLSearchParams()
    
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())
    if (filters.search) params.append('search', filters.search)
    if (filters.categoryId) params.append('categoryId', filters.categoryId)
    if (filters.brandId) params.append('brandId', filters.brandId)
    if (filters.collectionId) params.append('collectionId', filters.collectionId)
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
    if (filters.sort) params.append('sort', filters.sort)
    
    if (filters.brandIds && filters.brandIds.length > 0) {
      filters.brandIds.forEach(id => params.append('brandIds[]', id))
    }
    
    if (filters.attributeValueIds && filters.attributeValueIds.length > 0) {
      filters.attributeValueIds.forEach(id => params.append('attributeValueIds[]', id))
    }

    const res = await fetch(`${API_BASE_URL}/products?${params.toString()}`, {
      // Using next 14 fetch options for SSR caching if desired
      // cache: 'no-store' is safe for dynamic filter pages
      cache: 'no-store'
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch products')
    }
    
    const json = await res.json()
    return json.result as ProductListResponse
  },
  
  fetchCategories: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/categories?limit=100`, { cache: 'no-store' })
      if (!res.ok) return []
      const json = await res.json()
      return json.data || json.result?.data || []
    } catch {
      return []
    }
  },
  
  fetchBrands: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/brands?limit=100`, { cache: 'no-store' })
      if (!res.ok) return []
      const json = await res.json()
      return json.data || json.result?.data || []
    } catch {
      return []
    }
  },
  
  fetchCollections: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/collections?limit=100`, { cache: 'no-store' })
      if (!res.ok) return []
      const json = await res.json()
      return json.data || json.result?.data || []
    } catch {
      return []
    }
  },
  
  fetchAttributes: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/attributes/all`, { cache: 'no-store' })
      if (!res.ok) return []
      const json = await res.json()
      return json.data || json.result || []
    } catch {
      return []
    }
  },
  
  fetchNewArrivals: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/new-arrivals?limit=4`, { cache: 'no-store' })
      if (!res.ok) return []
      const json = await res.json()
      return json.data || json.result?.data || json.result || []
    } catch {
      return []
    }
  },
}
