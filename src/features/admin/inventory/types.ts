export interface InventoryStockItem {
  id: string;
  sku: string;
  price: number;
  purchasePrice: number | null;
  stockQuantity: number;
  lowStockQuantity: number;
  product: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
  priceFormatted: string;
  purchasePriceFormatted: string;
}

export interface InventoryTransaction {
  id: string;
  type: 'IMPORT' | 'ADJUST' | 'EXPORT';
  quantity: number;
  purchasePrice: number | null;
  purchasePriceFormatted: string | null;
  supplier: string | null;
  reason: string | null;
  createdAt: string;
  productVariant: {
    id: string;
    sku: string;
  };
  creator: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface InventoryQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_STOCK';
  sort?: 'desc' | 'asc';
}

export interface ImportStockPayload {
  productVariantId: string;
  quantity: number;
  purchasePrice: number;
  supplier: string;
}

export interface AdjustStockPayload {
  productVariantId: string;
  quantity: number;
  reason: string;
}
