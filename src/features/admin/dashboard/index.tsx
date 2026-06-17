'use client'
import { Button } from '~/components/ui/core/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'

import { RecentSales } from './recent-sales'
import { Overview } from './OverviewCard'
import { AnalyticsTab } from './analytics-tab'
import { ReportsTab } from './reports-tab'
import { NotificationsTab } from './notifications-tab'

import { CreditCard, ShoppingCart, ShoppingBag, Tag, Loader2 } from 'lucide-react'
import { _dashboardService } from './dashboard.query'
import { toast } from 'react-toastify'
import { exportDashboardToCSV } from './utils/export-report'

const DashboardPage = () => {
  const { data: dashRes, isLoading } = _dashboardService.useDashboardData()
  const data = dashRes?.result

  const handleDownloadReport = () => {
    if (!data) {
      toast.error('Không tìm thấy dữ liệu để xuất báo cáo!')
      return
    }
    try {
      exportDashboardToCSV(data)
      toast.success('Xuất báo cáo thành công!')
    } catch (error) {
      console.error('Export report error:', error)
      toast.error('Có lỗi xảy ra khi xuất báo cáo!')
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Đang tải dữ liệu dashboard...</p>
      </div>
    )
  }

  return (
    <div className='flex-1 space-y-6'>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className='text-3xl font-black uppercase tracking-tight'>Bảng điều khiển</h1>
        <div className='flex items-center space-x-2'>
          <Button 
            onClick={handleDownloadReport}
            className="rounded-xl font-bold text-xs uppercase tracking-widest"
          >
            Tải xuống báo cáo
          </Button>
        </div>
      </div>
      
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <Card className='rounded-2xl transition-all duration-200 hover:shadow-md border-muted/50'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-[10px] font-black uppercase tracking-widest text-gray-500'>
                  Tổng doanh thu
                </CardTitle>
                <CreditCard className='text-primary h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-black text-slate-900 dark:text-slate-50'>
                  {data?.stats.totalRevenueFormatted}
                </div>
                <p className='text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1 mt-1 uppercase'>
                  <span>↑</span> +12.5% so với tháng trước
                </p>
              </CardContent>
            </Card>
            <Card className='rounded-2xl transition-all duration-200 hover:shadow-md border-muted/50'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-[10px] font-black uppercase tracking-widest text-gray-500'>Đơn hàng mới</CardTitle>
                <ShoppingCart className='text-primary h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-black text-slate-900 dark:text-slate-50'>
                  +{data?.stats.newOrdersCount} đơn
                </div>
                <p className='text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1 mt-1 uppercase'>
                  <span>↑</span> trong tháng này
                </p>
              </CardContent>
            </Card>
            <Card className='rounded-2xl transition-all duration-200 hover:shadow-md border-muted/50'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-[10px] font-black uppercase tracking-widest text-gray-500'>Tổng sản phẩm</CardTitle>
                <ShoppingBag className='text-primary h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-black text-slate-900 dark:text-slate-50'>
                  {data?.stats.totalProducts} sản phẩm
                </div>
                <p className='text-muted-foreground text-[10px] font-bold mt-1 uppercase tracking-widest'>
                  Đang kinh doanh
                </p>
              </CardContent>
            </Card>
            <Card className='rounded-2xl transition-all duration-200 hover:shadow-md border-muted/50'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-[10px] font-black uppercase tracking-widest text-gray-500'>
                  Voucher hoạt động
                </CardTitle>
                <Tag className='text-primary h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-black text-slate-900 dark:text-slate-50'>
                  {data?.stats.activeVouchers} Voucher
                </div>
                <p className='text-amber-600 dark:text-amber-400 text-[10px] font-bold mt-1 uppercase tracking-widest'>
                  Sẵn sàng áp dụng
                </p>
              </CardContent>
            </Card>
      </div>
      
      <AnalyticsTab data={data?.salesByCategory} trafficData={data?.trafficData} />
      
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <Card className='col-span-1 lg:col-span-4 rounded-2xl'>
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest">Tổng quan doanh thu</CardTitle>
          </CardHeader>
          <CardContent className='ps-2'>
            <Overview data={data?.revenueOverview} />
          </CardContent>
        </Card>
        <Card className='col-span-1 lg:col-span-3 rounded-2xl'>
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest">Doanh số gần đây</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest">
              Giao dịch mới nhất trên hệ thống.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales data={data?.recentSales} />
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <div className='col-span-1 lg:col-span-4'>
          <ReportsTab orders={data?.recentSales} />
        </div>
        <div className='col-span-1 lg:col-span-3'>
          <NotificationsTab notifications={data?.notifications} />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

