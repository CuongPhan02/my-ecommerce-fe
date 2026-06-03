'use client'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

const data = [
  { name: 'Thg 1', total: 12000000 },
  { name: 'Thg 2', total: 15500000 },
  { name: 'Thg 3', total: 10200000 },
  { name: 'Thg 4', total: 14800000 },
  { name: 'Thg 5', total: 18400000 },
  { name: 'Thg 6', total: 16100000 },
  { name: 'Thg 7', total: 13900000 },
  { name: 'Thg 8', total: 15200000 },
  { name: 'Thg 9', total: 19800000 },
  { name: 'Thg 10', total: 22400000 },
  { name: 'Thg 11', total: 28500000 },
  { name: 'Thg 12', total: 35000000 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value
    const formattedValue = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value)
    return (
      <div className='bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 backdrop-blur-md rounded-xl p-3 shadow-lg flex flex-col gap-1 text-xs'>
        <p className='font-semibold text-slate-800 dark:text-slate-100'>{label}</p>
        <p className='text-primary font-bold'>{formattedValue}</p>
      </div>
    )
  }
  return null
}

export function Overview({ data }: { data?: { name: string; total: number }[] }) {
  if (!data) return null;

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
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
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }} />
        <Bar
          dataKey='total'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
