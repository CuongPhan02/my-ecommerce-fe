import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { _orderApi } from './order.api';
import { OrderParams, UpdateOrderInput } from './types';
import { toast } from 'react-toastify';

export const _orderService = {
  useOrders: (params: OrderParams) => {
    return useQuery({
      queryKey: ['orders', params],
      queryFn: () => _orderApi.fetchOrders(params),
    });
  },

  useOrder: (id: string) => {
    return useQuery({
      queryKey: ['order', id],
      queryFn: () => _orderApi.fetchOrder(id),
      enabled: !!id,
    });
  },

  useUpdateOrder: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateOrderInput }) =>
        _orderApi.updateOrder(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['order'] });
        toast.success('Order updated successfully');
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update order');
      },
    });
  },
};
