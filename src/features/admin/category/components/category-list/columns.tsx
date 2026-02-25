import { IconEdit, IconTrash } from '@tabler/icons-react'
import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '~/components/ui/core/checkbox'
import { Category, TableMeta } from '../../types'
import { Switch } from '~/components/ui/core/switch'

export const columns: ColumnDef<Category>[] = [
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
    accessorKey: 'metaImage',
    header: 'Meta Image',
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <img
          src={row.original.metaImage}
          alt={row.original.name}
          className='h-12 w-12 rounded object-cover'
        />
      )
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'parent.name',
    header: 'Parent',
  },

  {
    accessorKey: 'isActive',
    header: 'Status',
    enableSorting: false,
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta
      return (
        <Switch
          checked={row.original.isActive}
          onCheckedChange={(value) => {
            meta.updateProductStatus(row.original.id, 'isActive', value)
          }}
          aria-label='Toggle product status'
        />
      )
    },
  },
  {
    accessorKey: 'isFeatured',
    header: 'Featured',
    enableSorting: false,
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta
      return (
        <Switch
          checked={row.original.isFeatured}
          onCheckedChange={(value) => {
            meta.updateProductStatus(row.original.id, 'isFeatured', value)
          }}
          aria-label='Toggle featured status'
        />
      )
    },
  },
  {
    accessorKey: 'Action',
    header: 'Action',
    cell: () => (
      <div className='flex items-center gap-3'>
        <div className='border border-red-500 text-red-500 p-2 rounded-xl cursor-pointer'>
          <IconTrash />
        </div>
        <div className='border bg-primary p-2 text-white rounded-xl cursor-pointer'>
          <IconEdit />
        </div>
      </div>
    ),
  },
]
