import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/components/ui/core/avatar'

export function RecentSales({ data }: { data?: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="py-10 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
        Chưa có giao dịch nào
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {data.map((sale) => (
        <div key={sale.id} className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src={sale.customer?.avatarUrl || ''} alt='Avatar' />
            <AvatarFallback className="font-bold text-[10px] uppercase">
              {sale.customer?.name?.substring(0, 2) || 'NA'}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm leading-none font-black uppercase tracking-tight'>{sale.customer?.name}</p>
              <p className='text-muted-foreground text-[11px] font-medium'>
                {sale.customer?.email}
              </p>
            </div>
            <div className='font-black text-emerald-600 dark:text-emerald-400 text-sm'>
              +{sale.totalAmountFormatted}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
