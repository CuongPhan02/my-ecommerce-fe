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

import { CreditCard, ShoppingCart, ShoppingBag, Tag } from 'lucide-react'

const DashboardPage = () => {
  return (
    <div className='flex-1 space-y-6'>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Bảng điều khiển</h1>
        <div className='flex items-center space-x-2'>
          <Button>Tải xuống báo cáo</Button>
        </div>
      </div>
      
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <Card className='transition-all duration-200 hover:shadow-md border-muted/50'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Tổng doanh thu
                </CardTitle>
                <CreditCard className='text-primary h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-slate-900 dark:text-slate-50'>184.230.000 ₫</div>
                <p className='text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-1 mt-1'>
                  <span>↑</span> +12.5% so với tháng trước
                </p>
              </CardContent>
            </Card>
            <Card className='transition-all duration-200 hover:shadow-md border-muted/50'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Đơn hàng mới</CardTitle>
                <ShoppingCart className='text-primary h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-slate-900 dark:text-slate-50'>+1,432 đơn</div>
                <p className='text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-1 mt-1'>
                  <span>↑</span> +8.2% so với tháng trước
                </p>
              </CardContent>
            </Card>
            <Card className='transition-all duration-200 hover:shadow-md border-muted/50'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Tổng sản phẩm</CardTitle>
                <ShoppingBag className='text-primary h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-slate-900 dark:text-slate-50'>342 sản phẩm</div>
                <p className='text-muted-foreground text-xs font-medium mt-1'>
                  15 danh mục / 8 thương hiệu
                </p>
              </CardContent>
            </Card>
            <Card className='transition-all duration-200 hover:shadow-md border-muted/50'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Voucher & Khuyến mãi
                </CardTitle>
                <Tag className='text-primary h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-slate-900 dark:text-slate-50'>6 Voucher</div>
                <p className='text-amber-600 dark:text-amber-400 text-xs font-medium mt-1'>
                  3 chương trình sắp hết hạn
                </p>
              </CardContent>
            </Card>
      </div>
      
      <AnalyticsTab />
      
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <Card className='col-span-1 lg:col-span-4'>
          <CardHeader>
            <CardTitle>Tổng quan doanh thu</CardTitle>
          </CardHeader>
          <CardContent className='ps-2'>
            <Overview />
          </CardContent>
        </Card>
        <Card className='col-span-1 lg:col-span-3'>
          <CardHeader>
            <CardTitle>Doanh số gần đây</CardTitle>
            <CardDescription>
              Bạn đã thực hiện 265 giao dịch trong tháng này.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <div className='col-span-1 lg:col-span-4'>
          <ReportsTab />
        </div>
        <div className='col-span-1 lg:col-span-3'>
          <NotificationsTab />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
