import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { _refundApi } from './refund.api';
import { RefundParams, ApproveRefundInput, RejectRefundInput } from './refund.types';
import { toast } from 'react-toastify';

export const _refundService = {
  useRefunds: (params: RefundParams) => {
    return useQuery({
      queryKey: ['refunds', params],
      queryFn: () => _refundApi.fetchRefunds(params),
    });
  },

  useRefund: (id: string) => {
    return useQuery({
      queryKey: ['refund', id],
      queryFn: () => _refundApi.fetchRefund(id),
      enabled: !!id,
    });
  },

  useApproveRefund: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: ApproveRefundInput }) =>
        _refundApi.approveRefund(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['refunds'] });
        queryClient.invalidateQueries({ queryKey: ['refund'] });
        toast.success('Refund request approved');
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to approve refund');
      },
    });
  },

  useRejectRefund: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: RejectRefundInput }) =>
        _refundApi.rejectRefund(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['refunds'] });
        queryClient.invalidateQueries({ queryKey: ['refund'] });
        toast.success('Refund request rejected');
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to reject refund');
      },
    });
  },
};
