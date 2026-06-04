import { ApiResponse } from '~/@types/api';
import { https } from '~/config/https';
import { Order, OrderParams, UpdateOrderInput } from './types';

export type OrderListResponse = {
  data: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export const _orderApi = {
  fetchOrders: async (params: OrderParams) => {
    const res = await https.get<ApiResponse<OrderListResponse>>('/orders', {
      params,
    });
    return res.data;
  },

  fetchOrder: async (id: string) => {
    const res = await https.get<ApiResponse<Order>>(`/orders/${id}`);
    return res.data;
  },

  updateOrder: async (id: string, data: UpdateOrderInput) => {
    const res = await https.put<ApiResponse<Order>>(`/orders/${id}`, data);
    return res.data;
  },
};
