import { ApiResponse } from '~/@types/api';
import { https } from '~/config/https';
import { Refund, RefundParams, ApproveRefundInput, RejectRefundInput } from './refund.types';

export type RefundListResponse = {
  data: Refund[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export const _refundApi = {
  fetchRefunds: async (params: RefundParams) => {
    const res = await https.get<ApiResponse<RefundListResponse>>('/refunds', {
      params,
    });
    return res.data;
  },

  fetchRefund: async (id: string) => {
    const res = await https.get<ApiResponse<Refund>>(`/refunds/${id}`);
    return res.data;
  },

  approveRefund: async (id: string, data: ApproveRefundInput) => {
    const res = await https.put<ApiResponse<Refund>>(`/refunds/${id}/approve`, data);
    return res.data;
  },

  rejectRefund: async (id: string, data: RejectRefundInput) => {
    const res = await https.put<ApiResponse<Refund>>(`/refunds/${id}/reject`, data);
    return res.data;
  },
};
