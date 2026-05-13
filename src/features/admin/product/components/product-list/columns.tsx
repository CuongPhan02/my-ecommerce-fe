import { IconEdit, IconTrash } from '@tabler/icons-react'
import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '~/components/ui/core/checkbox'
import { CollectionItem, Product, TableMeta, Variant } from '../../types'
import { Switch } from '~/components/ui/core/switch'

export const columns: ColumnDef<Product>[] = [
  {
    id: 'select',

    header: ({ table }) => {
      return (
        // table.getIsAllPageRowsSelected() → check nếu tất cả các hàng hiện tại được chọn.
        // row.getIsSelected() → kiểm tra checkbox riêng cho từng row.
        // row.toggleSelected() → bật/tắt chọn dòng tương ứng.
        // indeterminate → hiển thị trạng thái “chọn một phần” khi chưa chọn hết.
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
    accessorKey: 'thumbnail.url',
    header: 'Hình ảnh',
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <>
          {row.original?.thumbnail?.url ? (
            <img
              src={row.original.thumbnail.url}
              alt={row.original.name}
              className='h-12 w-12 rounded object-cover'
            />
          ) : (
            <div className='h-12 w-12 rounded bg-muted flex items-center justify-center p-2 text-center'>
              <span className='text-muted-foreground text-[10px]'>
                Không có ảnh
              </span>
            </div>
          )}
        </>
      )
    },
  },
  {
    accessorKey: 'name',
    header: 'Tên sản phẩm',
    cell: ({ row }) => {
      return <div className='max-w-[300px] truncate'>{row.original.name}</div>
    },
  },
  {
    accessorKey: 'category.name',
    header: 'Danh mục',
  },
  {
    accessorKey: 'brand.name',
    header: 'Thương hiệu',
  },
  {
    accessorKey: 'collections.name',
    header: 'Bộ sưu tập',
    cell: ({ row }) => {
      const collections = row.original.collections || []

      if (collections.length === 0) return 'Không có bộ sưu tập'
      return collections
        .map((c: CollectionItem) => c.collection.name)
        .join(', ')
    },
  },
  {
    header: 'Giá',
    cell: ({ row }) => {
      const prices = row.original.variants?.map((v: Variant) => v.price) || []
      if (prices.length === 0) return 'N/A'

      const min = Math.min(...prices)
      const max = Math.max(...prices)
      const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      })
      return min === max
        ? formatter.format(min)
        : `${formatter.format(min)} - ${formatter.format(max)}`
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Trạng thái',
    enableSorting: false,
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta
      return (
        <Switch
          checked={row.original.isActive}
          onCheckedChange={(value) => {
            meta.updateProductStatus(row.original.id, 'isActive', value)
          }}
          aria-label='Bật/tắt trạng thái sản phẩm'
        />
      )
    },
  },
  {
    accessorKey: 'isFeatured',
    header: 'Nổi bật',
    enableSorting: false,
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta
      return (
        <Switch
          checked={row.original.isFeatured}
          onCheckedChange={(value) => {
            meta.updateProductStatus(row.original.id, 'isFeatured', value)
          }}
          aria-label='Bật/tắt trạng thái nổi bật'
        />
      )
    },
  },
  {
    accessorKey: 'actions',
    header: 'Hành động',
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta
      return (
        <div className='flex items-center gap-3'>
          <div
            className='border border-red-500 text-red-500 p-2 rounded-xl cursor-pointer hover:bg-red-50'
            onClick={() => meta.onDelete(row.original.id)}
          >
            <IconTrash size={18} />
          </div>
          <div
            className='border bg-primary p-2 text-white rounded-xl cursor-pointer hover:opacity-90'
            onClick={() => meta.onEdit(row.original.id)}
          >
            <IconEdit size={18} />
          </div>
        </div>
      )
    },
  },
]
