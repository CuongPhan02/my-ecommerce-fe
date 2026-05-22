import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/components/ui/core/avatar'

export function RecentSales() {
  return (
    <div className='space-y-8'>
      <div className='flex items-center gap-4'>
        <Avatar className='h-9 w-9'>
          <AvatarImage src='/avatars/01.png' alt='Avatar' />
          <AvatarFallback>NA</AvatarFallback>
        </Avatar>
        <div className='flex flex-1 flex-wrap items-center justify-between'>
          <div className='space-y-1'>
            <p className='text-sm leading-none font-medium'>Nguyễn Văn An</p>
            <p className='text-muted-foreground text-sm'>
              an.nguyen@email.com
            </p>
          </div>
          <div className='font-bold text-emerald-600 dark:text-emerald-400'>+2.500.000 ₫</div>
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <Avatar className='flex h-9 w-9 items-center justify-center space-y-0 border'>
          <AvatarImage src='/avatars/02.png' alt='Avatar' />
          <AvatarFallback>TB</AvatarFallback>
        </Avatar>
        <div className='flex flex-1 flex-wrap items-center justify-between'>
          <div className='space-y-1'>
            <p className='text-sm leading-none font-medium'>Trần Thị Bình</p>
            <p className='text-muted-foreground text-sm'>
              binh.tran@email.com
            </p>
          </div>
          <div className='font-bold text-emerald-600 dark:text-emerald-400'>+1.200.500 ₫</div>
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <Avatar className='h-9 w-9'>
          <AvatarImage src='/avatars/03.png' alt='Avatar' />
          <AvatarFallback>LC</AvatarFallback>
        </Avatar>
        <div className='flex flex-1 flex-wrap items-center justify-between'>
          <div className='space-y-1'>
            <p className='text-sm leading-none font-medium'>Lê Văn Cường</p>
            <p className='text-muted-foreground text-sm'>
              cuong.le@email.com
            </p>
          </div>
          <div className='font-bold text-emerald-600 dark:text-emerald-400'>+450.000 ₫</div>
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <Avatar className='h-9 w-9'>
          <AvatarImage src='/avatars/04.png' alt='Avatar' />
          <AvatarFallback>PD</AvatarFallback>
        </Avatar>
        <div className='flex flex-1 flex-wrap items-center justify-between'>
          <div className='space-y-1'>
            <p className='text-sm leading-none font-medium'>Phạm Minh Đức</p>
            <p className='text-muted-foreground text-sm'>duc.pham@email.com</p>
          </div>
          <div className='font-bold text-emerald-600 dark:text-emerald-400'>+7.210.000 ₫</div>
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <Avatar className='h-9 w-9'>
          <AvatarImage src='/avatars/05.png' alt='Avatar' />
          <AvatarFallback>HE</AvatarFallback>
        </Avatar>
        <div className='flex flex-1 flex-wrap items-center justify-between'>
          <div className='space-y-1'>
            <p className='text-sm leading-none font-medium'>Hoàng Thu Em</p>
            <p className='text-muted-foreground text-sm'>
              em.hoang@email.com
            </p>
          </div>
          <div className='font-bold text-emerald-600 dark:text-emerald-400'>+550.000 ₫</div>
        </div>
      </div>
    </div>
  )
}
