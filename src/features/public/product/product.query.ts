import { useQuery } from '@tanstack/react-query'
import { _publicProductApi } from './product.api'

export const _productService = {
  useProductDetail: (idOrSlug: string) => {
    return useQuery({
      queryKey: ['product', idOrSlug],
      queryFn: () => _publicProductApi.getProductDetail(idOrSlug),
      enabled: !!idOrSlug
    })
  }
}
