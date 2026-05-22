import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'

const trafficData = [
  { name: 'Thứ 2', visitors: 4200, pageViews: 8400 },
  { name: 'Thứ 3', visitors: 3800, pageViews: 7600 },
  { name: 'Thứ 4', visitors: 5100, pageViews: 11200 },
  { name: 'Thứ 5', visitors: 4600, pageViews: 9800 },
  { name: 'Thứ 6', visitors: 4900, pageViews: 10400 },
  { name: 'Thứ 7', visitors: 6800, pageViews: 14500 },
  { name: 'Chủ Nhật', visitors: 7500, pageViews: 16800 },
]

const salesByCategoryData = [
  { name: 'Thg 1', mensFashion: 14000000, womensFashion: 24000000, accessories: 12000000 },
  { name: 'Thg 2', mensFashion: 16000000, womensFashion: 28000000, accessories: 11000000 },
  { name: 'Thg 3', mensFashion: 11000000, womensFashion: 20000000, accessories: 9000000 },
  { name: 'Thg 4', mensFashion: 15000000, womensFashion: 26000000, accessories: 13000000 },
  { name: 'Thg 5', mensFashion: 19000000, womensFashion: 32000000, accessories: 15000000 },
  { name: 'Thg 6', mensFashion: 18000000, womensFashion: 30000000, accessories: 14000000 },
  { name: 'Thg 7', mensFashion: 22000000, womensFashion: 38000000, accessories: 18000000 },
]

const CustomTrafficTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 backdrop-blur-md rounded-xl p-3 shadow-lg flex flex-col gap-2 text-xs'>
        <p className='font-bold text-slate-800 dark:text-slate-100 mb-1 border-b pb-1 border-slate-100 dark:border-slate-800'>{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className='flex items-center justify-between gap-4'>
            <span className='flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300'>
              <span className='w-2 h-2 rounded-full' style={{ backgroundColor: entry.stroke || entry.color }} />
              {entry.name}:
            </span>
            <span className='font-bold text-slate-900 dark:text-slate-100'>{entry.value.toLocaleString('vi-VN')}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const CustomCategoryTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 backdrop-blur-md rounded-xl p-3 shadow-lg flex flex-col gap-2 text-xs'>
        <p className='font-bold text-slate-800 dark:text-slate-100 mb-1 border-b pb-1 border-slate-100 dark:border-slate-800'>{label}</p>
        {payload.map((entry: any, index: number) => {
          const formattedValue = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
          }).format(entry.value)
          return (
            <div key={index} className='flex items-center justify-between gap-4'>
              <span className='flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300'>
                <span className='w-2 h-2 rounded-full' style={{ backgroundColor: entry.fill || entry.color }} />
                {entry.name}:
              </span>
              <span className='font-bold text-slate-900 dark:text-slate-100'>{formattedValue}</span>
            </div>
          )
        })}
      </div>
    )
  }
  return null
}

export function AnalyticsTab() {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
      <Card className='col-span-4 border-muted/50 shadow-sm'>
        <CardHeader>
          <CardTitle>Lưu lượng truy cập (Tuần)</CardTitle>
          <CardDescription>
            Số lượng khách truy cập và lượt xem trang.
          </CardDescription>
        </CardHeader>
        <CardContent className='pl-2'>
          <ResponsiveContainer width='100%' height={350}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='rgba(0,0,0,0.05)' />
              <XAxis
                dataKey='name'
                stroke='#888888'
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke='#888888'
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <RechartsTooltip content={<CustomTrafficTooltip />} />
              <Line
                type='monotone'
                dataKey='visitors'
                name='Khách truy cập'
                stroke='#3b82f6'
                strokeWidth={2.5}
                activeDot={{ r: 6 }}
              />
              <Line
                type='monotone'
                dataKey='pageViews'
                name='Lượt xem trang'
                stroke='#94a3b8'
                strokeWidth={2}
                strokeDasharray='4 4'
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className='col-span-3 border-muted/50 shadow-sm'>
        <CardHeader>
          <CardTitle>Doanh số theo danh mục</CardTitle>
          <CardDescription>Xu hướng mua sắm 7 tháng qua.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={350}>
            <AreaChart data={salesByCategoryData}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='rgba(0,0,0,0.05)' />
              <XAxis
                dataKey='name'
                stroke='#888888'
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke='#888888'
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value / 1000000} Tr`}
              />
              <RechartsTooltip content={<CustomCategoryTooltip />} />
              <Area
                type='monotone'
                dataKey='mensFashion'
                name='Thời trang Nam'
                stackId='1'
                stroke='#3b82f6'
                fill='#3b82f6'
                fillOpacity={0.15}
              />
              <Area
                type='monotone'
                dataKey='womensFashion'
                name='Thời trang Nữ'
                stackId='1'
                stroke='#ec4899'
                fill='#ec4899'
                fillOpacity={0.15}
              />
              <Area
                type='monotone'
                dataKey='accessories'
                name='Phụ kiện & Khác'
                stackId='1'
                stroke='#f59e0b'
                fill='#f59e0b'
                fillOpacity={0.15}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
