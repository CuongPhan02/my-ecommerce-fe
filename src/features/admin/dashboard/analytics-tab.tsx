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
  { name: 'T2', visitors: 4000, pageViews: 2400 },
  { name: 'T3', visitors: 3000, pageViews: 1398 },
  { name: 'T4', visitors: 2000, pageViews: 9800 },
  { name: 'T5', visitors: 2780, pageViews: 3908 },
  { name: 'T6', visitors: 1890, pageViews: 4800 },
  { name: 'T7', visitors: 2390, pageViews: 3800 },
  { name: 'CN', visitors: 3490, pageViews: 4300 },
]

const salesByCategoryData = [
  { name: 'Thg 1', electronics: 4000, clothing: 2400, shoes: 2400 },
  { name: 'Thg 2', electronics: 3000, clothing: 1398, shoes: 2210 },
  { name: 'Thg 3', electronics: 2000, clothing: 9800, shoes: 2290 },
  { name: 'Thg 4', electronics: 2780, clothing: 3908, shoes: 2000 },
  { name: 'Thg 5', electronics: 1890, clothing: 4800, shoes: 2181 },
  { name: 'Thg 6', electronics: 2390, clothing: 3800, shoes: 2500 },
  { name: 'Thg 7', electronics: 3490, clothing: 4300, shoes: 2100 },
]

export function AnalyticsTab() {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
      <Card className='col-span-4'>
        <CardHeader>
          <CardTitle>Lưu lượng truy cập (Tuần)</CardTitle>
          <CardDescription>
            Số lượng khách truy cập và lượt xem trang.
          </CardDescription>
        </CardHeader>
        <CardContent className='pl-2'>
          <ResponsiveContainer width='100%' height={350}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
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
              <RechartsTooltip />
              <Line
                type='monotone'
                dataKey='visitors'
                name='Khách truy cập'
                stroke='hsl(var(--primary))'
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line
                type='monotone'
                dataKey='pageViews'
                name='Lượt xem trang'
                stroke='hsl(var(--muted-foreground))'
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className='col-span-3'>
        <CardHeader>
          <CardTitle>Doanh số theo danh mục</CardTitle>
          <CardDescription>Xu hướng mua sắm 7 tháng qua.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={350}>
            <AreaChart data={salesByCategoryData}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
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
              <RechartsTooltip />
              <Area
                type='monotone'
                dataKey='electronics'
                name='Điện tử'
                stackId='1'
                stroke='#8884d8'
                fill='#8884d8'
              />
              <Area
                type='monotone'
                dataKey='clothing'
                name='Quần áo'
                stackId='1'
                stroke='#82ca9d'
                fill='#82ca9d'
              />
              <Area
                type='monotone'
                dataKey='shoes'
                name='Giày dép'
                stackId='1'
                stroke='#ffc658'
                fill='#ffc658'
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
