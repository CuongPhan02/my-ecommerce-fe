import { useQuery } from '@tanstack/react-query'
import { _publicProductApi, _publicCollectionApi } from './home.api'

export const _homeService = {
  useNewArrivals: () => {
    return useQuery({
      queryKey: ['products', 'new-arrivals'],
      queryFn: () => _publicProductApi.getNewArrivals(),
    })
  },

  useFlashSales: () => {
    return useQuery({
      queryKey: ['products', 'flash-sales'],
      queryFn: () => _publicProductApi.getFlashSales(),
    })
  },

  useCollections: () => {
    return useQuery({
      queryKey: ['collections', 'public'],
      queryFn: () => _publicCollectionApi.getCollections(),
    })
  }
}
