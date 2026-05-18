import { ColumnDef } from '@tanstack/react-table'
import { User, UserTableMeta } from '../../types'
import { Checkbox } from '~/components/ui/core/checkbox'
import { IconEdit, IconTrash, IconUserShield, IconUser } from '@tabler/icons-react'
import { Badge } from '~/components/ui/core/badge'
import { Switch } from '~/components/ui/core/switch'
import { format } from 'date-fns'

export const columns: ColumnDef<User>[] = [
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
    accessorKey: 'fullName',
    header: 'Họ và tên',
    cell: ({ row }) => (
      <div className='flex items-center gap-3'>
        <div className='h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary'>
           {row.original.fullName.charAt(0)}
        </div>
        <div className='flex flex-col'>
          <span className='font-bold text-sm'>{row.original.fullName}</span>
          <span className='text-[10px] text-muted-foreground'>{row.original.email}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'phone',
    header: 'Số điện thoại',
    cell: ({ row }) => row.original.phone || 'N/A',
  },
  {
    accessorKey: 'role',
    header: 'Vai trò',
    cell: ({ row }) => {
      const role = row.original.role
      return (
        <Badge
          variant={role === 'SUPER_ADMIN' ? 'destructive' : role === 'ADMIN' ? 'warning' : 'secondary'}
          className='text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full'
        >
          {role}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row, table }) => {
      const meta = table.options.meta as UserTableMeta
      const isActive = row.original.status === 'ACTIVE'
      return (
        <Switch
          checked={isActive}
          onCheckedChange={(checked) => {
            meta.onUpdateStatus(row.original.id, checked ? 'ACTIVE' : 'BLOCKED')
          }}
        />
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Ngày tham gia',
    cell: ({ row }) => {
      return (
        <span className='text-sm text-muted-foreground'>
          {format(new Date(row.original.createdAt), 'dd/MM/yyyy')}
        </span>
      )
    },
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row, table }) => {
      const meta = table.options.meta as UserTableMeta
      return (
        <div className='flex items-center gap-3'>
          <div
            className='border border-red-500 text-red-500 p-2 rounded-xl cursor-pointer hover:bg-red-50 transition-colors'
            onClick={() => meta.onDelete(row.original.id)}
            title='Xóa người dùng'
          >
            <IconTrash size={18} />
          </div>
          <div
            className='border bg-primary p-2 text-white rounded-xl cursor-pointer hover:opacity-90 transition-opacity'
            onClick={() => meta.onEdit(row.original)}
            title='Chỉnh sửa'
          >
            <IconEdit size={18} />
          </div>
        </div>
      )
    },
  },
]
