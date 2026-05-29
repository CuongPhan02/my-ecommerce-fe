export type RefundStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSING';

export type Refund = {
  id: string;
  code: string;
  orderId: string;
  userId: string;
  reason: string;
  status: RefundStatus;
  amount: number;
  amountFormatted: string;
  refundMethod?: string | null;
  rejectReason?: string | null;
  internalNote?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  } | null;
};

export type RefundParams = {
  page?: number;
  limit?: number;
  search?: string | null;
  status?: RefundStatus | null;
  sort?: 'desc' | 'asc' | null;
};

export type ApproveRefundInput = {
  refundMethod: string;
  internalNote?: string;
};

export type RejectRefundInput = {
  rejectReason: string;
};
