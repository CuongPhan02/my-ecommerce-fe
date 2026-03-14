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

export const LoadingUiMediaList = ({ count }: { count: number }) => {
  return (
    <div className='grid grid-cols-2 w-full sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          className='h-[200px] min-w-[120px] w-full rounded-xl'
        />
      ))}
    </div>
  )
}
