import { ApiResponse } from '~/@types/api';
import { https } from '~/config/https';

export interface DashboardData {
  stats: {
    totalRevenue: number;
    totalRevenueFormatted: string;
    newOrdersCount: number;
    totalProducts: number;
    activeVouchers: number;
  };
  revenueOverview: {
    name: string;
    total: number;
  }[];
  recentSales: {
    id: string;
    totalAmount: number;
    totalAmountFormatted: string;
    status: string;
    createdAt: string;
    customer: {
      name: string;
      email: string;
      avatarUrl: string | null;
    };
  }[];
  salesByCategory: any[];
  notifications: any[];
  trafficData: any[];
}

export const _dashboardApi = {
  getDashboardData: async () => {
    const res = await https.get<ApiResponse<DashboardData>>('/dashboard');
    return res.data;
  },
};
