import { useQuery } from '@tanstack/react-query';
import { _dashboardApi } from './dashboard.api';

export const _dashboardService = {
  useDashboardData: () => {
    return useQuery({
      queryKey: ['admin-dashboard'],
      queryFn: () => _dashboardApi.getDashboardData(),
    });
  },
};
