import { ApiResponse } from '~/@types/api';
import { https } from '~/config/https';
import { 
  InventoryStockItem, 
  InventoryQuery, 
  ImportStockPayload, 
  AdjustStockPayload, 
  InventoryTransaction,
  PaginationMeta,
} from './types';

export const _inventoryApi = {
  getStockList: async (params?: InventoryQuery) => {
    const res = await https.get<ApiResponse<{ data: InventoryStockItem[] } & PaginationMeta>>('/inventory', { params });
    return res.data;
  },

  importStock: async (payload: ImportStockPayload) => {
    const res = await https.post<ApiResponse<any>>('/inventory/import', payload);
    return res.data;
  },

  adjustStock: async (payload: AdjustStockPayload) => {
    const res = await https.post<ApiResponse<any>>('/inventory/adjust', payload);
    return res.data;
  },

  getTransactions: async (params?: { page?: number; limit?: number; type?: string; productVariantId?: string }) => {
    const res = await https.get<ApiResponse<{ data: InventoryTransaction[] } & PaginationMeta>>('/inventory/transactions', { params });
    return res.data;
  }
};

