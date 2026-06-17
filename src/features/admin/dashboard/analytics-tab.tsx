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

// Hardcoded data removed, will use dynamic data from props

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

const translateMonth = (month: string) => {
  const mapping: Record<string, string> = {
    'Jan': 'Thg 1',
    'Feb': 'Thg 2',
    'Mar': 'Thg 3',
    'Apr': 'Thg 4',
    'May': 'Thg 5',
    'Jun': 'Thg 6',
    'Jul': 'Thg 7',
    'Aug': 'Thg 8',
    'Sep': 'Thg 9',
    'Oct': 'Thg 10',
    'Nov': 'Thg 11',
    'Dec': 'Thg 12'
  }
  return mapping[month] || month
}

const colors = [
  '#3b82f6', // blue
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#f43f5e', // rose
  '#06b6d4', // cyan
]

export function AnalyticsTab({ data, trafficData = [] }: { data?: any[], trafficData?: any[] }) {
  const formattedData = React.useMemo(() => {
    if (!data) return []
    return data.map((item: any) => ({
      ...item,
      name: translateMonth(item.name)
    }))
  }, [data])

  const categoryKeys = React.useMemo(() => {
    const keys = new Set<string>()
    formattedData.forEach((item: any) => {
      Object.keys(item).forEach((key) => {
        if (key !== 'name') keys.add(key)
      })
    })
    return Array.from(keys)
  }, [formattedData])

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
          <CardDescription>Xu hướng mua sắm năm nay.</CardDescription>
        </CardHeader>
        <CardContent>
          {formattedData.length === 0 || categoryKeys.length === 0 ? (
            <div className="h-[350px] flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest text-xs">
              Chưa có dữ liệu doanh thu
            </div>
          ) : (
            <ResponsiveContainer width='100%' height={350}>
              <AreaChart data={formattedData}>
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
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)} Tr`}
                />
                <RechartsTooltip content={<CustomCategoryTooltip />} />
                {categoryKeys.map((key, index) => (
                  <Area
                    key={key}
                    type='monotone'
                    dataKey={key}
                    name={key}
                    stackId='1'
                    stroke={colors[index % colors.length]}
                    fill={colors[index % colors.length]}
                    fillOpacity={0.15}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
