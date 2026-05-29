export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type Payment = {
  id: string;
  method: string;
  status: PaymentStatus;
  amount: number;
  amountFormatted: string;
  transactionId?: string | null;
  createdAt: string;
};

export type ShippingAddress = {
  id: string;
  street: string;
  city: string;
  province: string;
  postalCode?: string | null;
  country: string;
};

export type OrderItem = {
  id: string;
  quantity: number;
  priceAtPurchase: number;
  priceAtPurchaseFormatted: string;
  variant: {
    id: string;
    sku: string;
    price: number;
    priceFormatted: string;
  } | null;
  product: {
    id: string;
    name: string;
    slug: string;
    thumbnail: {
      url: string;
      altText?: string | null;
    } | null;
  } | null;
};

export type Order = {
  id: string;
  totalAmount: number;
  totalAmountFormatted: string;
  status: OrderStatus;
  discountAmount: number;
  discountAmountFormatted: string;
  createdAt: string;
  updatedAt: string;
  customer: Customer | null;
  payment: Payment | null;
  shippingAddress?: ShippingAddress | null;
  items?: OrderItem[];
};

export type OrderParams = {
  page?: number;
  limit?: number;
  search?: string | null;
  status?: OrderStatus | null;
  paymentStatus?: PaymentStatus | null;
  sort?: 'newest' | 'oldest' | 'amount_asc' | 'amount_desc' | null;
};

export type UpdateOrderInput = {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
};
