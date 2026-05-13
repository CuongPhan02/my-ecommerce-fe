import { IconEdit, IconTrash } from '@tabler/icons-react'
import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '~/components/ui/core/checkbox'
import { Brand, TableMeta } from '../../types'

export const columns: ColumnDef<Brand, any>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      return (
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
      )
    },
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
    accessorKey: 'logoUrl',
    header: 'Logo',
    cell: ({ row }) => {
      const logo = row.original.logoUrl
      return logo ? (
        <img
          src={logo}
          alt={row.original.name}
          className='h-10 w-10 rounded object-contain bg-white border'
        />
      ) : (
        <div className='h-10 w-10 rounded bg-muted flex items-center justify-center text-[10px] text-muted-foreground'>
          Không có Logo
        </div>
      )
    },
  },
  {
    accessorKey: 'name',
    header: 'Tên',
  },
  {
    accessorKey: 'slug',
    header: 'Đường dẫn (Slug)',
  },
  {
    accessorKey: 'isActive',
    header: 'Trạng thái',
    cell: ({ row }) => (
      <div
        className={`px-2 py-1 rounded-full text-xs w-fit ${row.original.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
      >
        {row.original.isActive ? 'Hoạt động' : 'Không hoạt động'}
      </div>
    ),
  },
  {
    accessorKey: 'Action',
    header: 'Hành động',
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta
      return (
        <div className='flex items-center gap-3'>
          <div
            className='border border-red-500 text-red-500 p-2 rounded-xl cursor-pointer hover:bg-red-50 transition-colors'
            onClick={() => meta.onDelete(row.original.id)}
          >
            <IconTrash size={18} />
          </div>
          <div
            className='border bg-primary p-2 text-white rounded-xl cursor-pointer hover:opacity-90 transition-opacity'
            onClick={() => meta.onEdit(row.original.id)}
          >
            <IconEdit size={18} />
          </div>
        </div>
      )
    },
  },
]
