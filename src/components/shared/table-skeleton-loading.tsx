import { Skeleton } from '~/components/ui/core/skeleton'

interface TableSkeletonProps {
  rowCount: number
  colCount: number
}

export const TableSkeletonLoading = ({
  rowCount,
  colCount,
}: TableSkeletonProps) => {
  const skeletonRows = Array.from({ length: rowCount }, (_, rowIndex) => (
    <tr key={rowIndex} className='border-t'>
      {Array.from({ length: colCount }, (_, colIndex) => (
        <td key={colIndex} className='p-3 align-middle'>
          <Skeleton className='h-5 min-[100px] rounded-md bg-primary/20' />
        </td>
      ))}
    </tr>
  ))

  return <>{skeletonRows}</>
}
