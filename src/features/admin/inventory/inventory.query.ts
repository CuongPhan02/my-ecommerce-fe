import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { _inventoryApi } from './inventory.api';
import { InventoryQuery, ImportStockPayload, AdjustStockPayload } from './types';

export const _inventoryService = {
  useStockList: (params?: InventoryQuery) => {
    return useQuery({
      queryKey: ['admin-inventory-stock', params],
      queryFn: () => _inventoryApi.getStockList(params),
    });
  },

  useImportStock: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (payload: ImportStockPayload) => _inventoryApi.importStock(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-inventory-stock'] });
        queryClient.invalidateQueries({ queryKey: ['admin-inventory-transactions'] });
      },
    });
  },

  useAdjustStock: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (payload: AdjustStockPayload) => _inventoryApi.adjustStock(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-inventory-stock'] });
        queryClient.invalidateQueries({ queryKey: ['admin-inventory-transactions'] });
      },
    });
  },

  useExportStock: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (payload: any) => _inventoryApi.exportStock(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-inventory-stock'] });
        queryClient.invalidateQueries({ queryKey: ['admin-inventory-transactions'] });
      },
    });
  },

  useTransactions: (params?: { page?: number; limit?: number; type?: string; productVariantId?: string }) => {
    return useQuery({
      queryKey: ['admin-inventory-transactions', params],
      queryFn: () => _inventoryApi.getTransactions(params),
    });
  }
};
