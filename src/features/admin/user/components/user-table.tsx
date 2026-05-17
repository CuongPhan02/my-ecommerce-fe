'use client'
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { ScrollArea, ScrollBar } from '~/components/ui/core/scroll-area'
import { columns } from './user-list/columns'
import { ArrowDown, ArrowUp, ChevronsUpDown, SearchIcon } from 'lucide-react'
import { Button } from '~/components/ui/core/button'
import { User, UserParams, UserTableMeta, UserStatus, UserRole } from '../types'
import { TableToolbar } from './user-list/table-toolbar'
import { _userService } from '../user.query'
import HeadingSectionAdmin from '~/components/shared/heading-section-admin'
import { TableSkeletonLoading } from '~/components/shared/table-skeleton-loading'

const UserTable = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const pagination = useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize],
  )

  const debouncedSearch =
    (columnFilters.find((f) => f.id === 'search')?.value as string) || ''

  const params: UserParams = {
    page: pageIndex + 1,
    limit: pageSize,
    search: debouncedSearch || null,
    role: (columnFilters.find((f) => f.id === 'role')?.value as UserRole) || null,
    status: (columnFilters.find((f) => f.id === 'status')?.value as UserStatus) || null,
    sort: (columnFilters.find((f) => f.id === 'sort')?.value as string) || 'newest',
  }

  const { data: usersData, isLoading } = _userService.useUsers(params)

  const updateStatusMutation = _userService.useUpdateUserStatus()
  const updateRoleMutation = _userService.useUpdateUserRole()
  const deleteUserMutation = _userService.useDeleteUser()

  const data = (usersData?.result as any)?.data || []
  const pageCount = (usersData?.result as any)?.meta?.totalPages || 0

  const handleUpdateStatus = async (id: string, status: UserStatus) => {
    await updateStatusMutation.mutateAsync({ id, status })
  }

  const handleUpdateRole = async (id: string, role: UserRole) => {
    await updateRoleMutation.mutateAsync({ id, role })
  }

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
      await deleteUserMutation.mutateAsync(id)
    }
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const table = useReactTable<User>({
    data,
    columns,
    pageCount,
    meta: {
      onEdit: handleEdit,
      updateUserStatus: handleUpdateStatus,
      updateUserRole: handleUpdateRole,
      onDelete: handleDelete,
    } as UserTableMeta,
    state: {
      columnFilters,
      sorting,
      pagination,
    },
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  })

  const selectedRows = table.getSelectedRowModel().rows

  return (
    <>
      <div className='w-full'>
        <div className='mb-6'>
          <HeadingSectionAdmin title={' Quản lý người dùng'} />
        </div>

        <TableToolbar
          filterValue={debouncedSearch}
          setFilter={(key, value) => {
            const otherFilters = columnFilters.filter((f) => f.id !== key)
            setColumnFilters(
              value !== null
                ? [...otherFilters, { id: key, value }]
                : otherFilters,
            )
          }}
          onReset={() => {
            setColumnFilters([])
            setPagination({ pageIndex: 0, pageSize: 10 })
          }}
          selectedRows={selectedRows}
          onDelete={() => {
             // Bulk delete
          }}
          onAdd={() => {
            setSelectedUser(null)
            setIsModalOpen(true)
          }}
        />

        <ScrollArea className='w-full rounded-2xl border overflow-hidden shadow-sm bg-white'>
          <div className='min-h-[400px]'>
            <table className='text-sm text-left w-full border-collapse whitespace-nowrap'>
              <thead className='bg-gray-50 dark:bg-muted'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <th
                          key={header.id}
                          className='p-4 font-semibold text-slate-900 dark:text-slate-100 border-b'
                        >
                          <div
                            className={
                              header.column.getCanSort()
                                ? 'flex items-center gap-2 cursor-pointer select-none'
                                : ''
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {header.column.getCanSort() && (
                              <span className='ml-1 text-slate-400'>
                                {header.column.getIsSorted() === 'asc' ? (
                                  <ArrowUp size={14} />
                                ) : header.column.getIsSorted() === 'desc' ? (
                                  <ArrowDown size={14} />
                                ) : (
                                  <ChevronsUpDown size={14} className='opacity-30' />
                                )}
                              </span>
                            )}
                          </div>
                        </th>
                      )
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {isLoading ? (
                  <TableSkeletonLoading
                    rowCount={pageSize}
                    colCount={columns.length}
                  />
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className='text-center py-20'>
                       <div className='flex flex-col items-center gap-4 text-muted-foreground'>
                          <SearchIcon size={40} className='opacity-20' />
                          <p>Không tìm thấy người dùng nào</p>
                       </div>
                    </td>
                  </tr>
                ) : (
                  table?.getRowModel()?.rows?.map((row) => {
                    return (
                      <tr
                        key={row.id}
                        className='border-b hover:bg-gray-50 transition-colors'
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className='p-4 align-middle'>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        ))}
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>

        <div className='flex items-center justify-between py-6 px-2'>
          <div className='text-sm font-medium text-slate-500'>
            Hiển thị {data.length} người dùng (Trang {pageIndex + 1}/{pageCount})
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className='bg-white shadow-sm rounded-xl'
            >
              Trước
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className='bg-white shadow-sm rounded-xl'
            >
              Sau
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserTable
