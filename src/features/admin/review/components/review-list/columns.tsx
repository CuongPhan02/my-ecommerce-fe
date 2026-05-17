import { ColumnDef } from '@tanstack/react-table'
import { Review, ReviewTableMeta } from '../../types'
import { Checkbox } from '~/components/ui/core/checkbox'
import { Star, Eye, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { Badge } from '~/components/ui/core/badge'
import { cn } from '~/lib/utils'
import { format } from 'date-fns'

export const columns: ColumnDef<Review>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? 'indeterminate'
              : false
        }
        onCheckedChange={(val) => table.toggleAllRowsSelected(!!val)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'productTitle',
    header: 'Sản phẩm',
    cell: ({ row }) => (
      <div className='flex items-center gap-3 max-w-[250px]'>
        {row.original.productThumbnail && (
          <img
            src={row.original.productThumbnail}
            alt={row.original.productTitle}
            className='h-10 w-10 rounded-md object-cover flex-shrink-0'
          />
        )}
        <div className='truncate font-medium' title={row.original.productTitle}>
          {row.original.productTitle}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'userName',
    header: 'Người dùng',
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-medium'>{row.original.userName}</span>
        {row.original.size && (
          <span className='text-[10px] text-muted-foreground uppercase'>
            Size: {row.original.size} | Màu: {row.original.color}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'rating',
    header: 'Đánh giá',
    cell: ({ row }) => (
      <div className='flex items-center gap-1'>
        <span className='font-bold text-sm'>{row.original.rating}</span>
        <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
      </div>
    ),
  },
  {
    accessorKey: 'comment',
    header: 'Nội dung',
    cell: ({ row }) => (
      <div className='max-w-[300px] truncate text-sm text-muted-foreground'>
        {row.original.comment}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge
          variant={
            status === 'APPROVED'
              ? 'success'
              : status === 'HIDDEN'
                ? 'destructive'
                : 'secondary'
          }
          className='capitalize'
        >
          {status === 'APPROVED' ? 'Đã duyệt' : status === 'HIDDEN' ? 'Đã ẩn' : 'Chờ duyệt'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Ngày tạo',
    cell: ({ row }) => {
      return (
        <span className='text-sm text-muted-foreground'>
          {format(new Date(row.original.createdAt), 'dd/MM/yyyy HH:mm')}
        </span>
      )
    },
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row, table }) => {
      const meta = table.options.meta as ReviewTableMeta
      const status = row.original.status

      return (
        <div className='flex items-center gap-2'>
          <button
            onClick={() => meta.onView(row.original)}
            className='p-2 hover:bg-muted rounded-full transition-colors text-blue-500'
            title='Xem chi tiết & Phản hồi'
          >
            <Eye size={18} />
          </button>
          
          {status !== 'APPROVED' && (
            <button
              onClick={() => meta.onUpdateStatus(row.original.id, 'APPROVED')}
              className='p-2 hover:bg-muted rounded-full transition-colors text-green-500'
              title='Duyệt'
            >
              <CheckCircle size={18} />
            </button>
          )}

          {status !== 'HIDDEN' && (
            <button
              onClick={() => meta.onUpdateStatus(row.original.id, 'HIDDEN')}
              className='p-2 hover:bg-muted rounded-full transition-colors text-orange-500'
              title='Ẩn'
            >
              <XCircle size={18} />
            </button>
          )}

          <button
            onClick={() => meta.onDelete(row.original.id)}
            className='p-2 hover:bg-muted rounded-full transition-colors text-red-500'
            title='Xóa'
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    },
  },
]
