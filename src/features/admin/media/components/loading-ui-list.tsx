import { Skeleton } from '~/components/ui/core/skeleton'

export const LoadingUiFolder = () => {
  return (
    <div className='flex flex-col gap-1 w-full px-1 py-1'>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 py-2.5 px-3 rounded-lg border border-transparent w-full">
          <Skeleton className='h-4 w-4 rounded-sm shrink-0' />
          <Skeleton className='h-4 flex-1 rounded-md' />
        </div>
      ))}
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
