import { Skeleton } from '~/components/ui/core/skeleton'

export const LoadingUiFolder = () => {
  return (
    <div className='flex items-center gap-3.5'>
      <Skeleton className='h-[70px] min-w-[120px] rounded-xl' />
      <Skeleton className='h-[70px] min-w-[120px] rounded-xl' />
      <Skeleton className='h-[70px] min-w-[120px] rounded-xl' />
      <Skeleton className='h-[70px] min-w-[120px] rounded-xl' />
      <Skeleton className='h-[70px] min-w-[120px] rounded-xl' />
      <Skeleton className='h-[70px] min-w-[120px] rounded-xl' />
      <Skeleton className='h-[70px] min-w-[120px] rounded-xl' />
    </div>
  )
}
