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
import { useMemo, useState, useEffect } from 'react'
import { ScrollArea, ScrollBar } from '~/components/ui/core/scroll-area'
import { columns } from './user-list/columns'
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  SearchIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Button } from '~/components/ui/core/button'
import { User, UserParams, UserTableMeta, UserStatus, UserRole } from '../types'
import { TableToolbar } from './user-list/table-toolbar'
import { _userService } from '../user.query'
import HeadingSectionAdmin from '~/components/shared/heading-section-admin'
import { TableSkeletonLoading } from '~/components/shared/table-skeleton-loading'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/core/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from '~/components/ui/core/select'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import { Badge } from '~/components/ui/core/badge'
import { toast } from 'react-toastify'
import {
  IconAlertTriangle,
  IconUser,
  IconMail,
  IconPhone,
  IconShield,
  IconDeviceFloppy,
  IconSquareRoundedX,
  IconUserCheck,
  IconUserX,
  IconInfoCircle,
  IconTrash,
} from '@tabler/icons-react'

const UserTable = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  // States for custom confirmation Dialogs
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [statusToChange, setStatusToChange] = useState<{
    user: User
    status: UserStatus
  } | null>(null)

  // Local Form States for Add/Edit Dialog
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<UserRole>('CUSTOMER')
  const [status, setStatus] = useState<UserStatus>('ACTIVE')
  const [password, setPassword] = useState('')

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

  const sortActive = sorting[0]
  const allowedSortKeys = ['createdAt', 'name', 'email', 'staffCode', 'lastLogin']
  const targetId = sortActive ? (sortActive.id === 'fullName' ? 'name' : sortActive.id) : 'createdAt'
  const sortByVal = allowedSortKeys.includes(targetId) ? targetId : 'createdAt'
  const sortVal = sortActive ? (sortActive.desc ? 'desc' : 'asc') : 'desc'

  const params: UserParams = {
    page: pageIndex + 1,
    limit: pageSize,
    search: debouncedSearch || null,
    role:
      (columnFilters.find((f) => f.id === 'role')?.value as UserRole) || null,
    status:
      (columnFilters.find((f) => f.id === 'status')?.value as UserStatus) ||
      null,
    sort: sortVal as any,
    sortBy: sortByVal as any,
  }

  const { data: usersData, isLoading } = _userService.useUsers(params)

  const updateStatusMutation = _userService.useUpdateUserStatus()
  const updateRoleMutation = _userService.useUpdateUserRole()
  const deleteUserMutation = _userService.useDeleteUser()
  const createUserMutation = _userService.useCreateUser()
  const updateUserMutation = _userService.useUpdateUser()
  const bulkDeleteMutation = _userService.useBulkDeleteUsers()

  const data = (usersData?.result as any)?.data || []
  const pageCount = (usersData?.result as any)?.meta?.totalPages || 0
  const totalItems = (usersData?.result as any)?.meta?.total || 0

  // Effect to populate form when edit or add is triggered
  useEffect(() => {
    if (selectedUser) {
      setFullName(selectedUser.fullName)
      setEmail(selectedUser.email)
      setPhone(selectedUser.phone || '')
      setRole(selectedUser.role)
      setStatus(selectedUser.status)
      setPassword('')
    } else {
      setFullName('')
      setEmail('')
      setPhone('')
      setRole('CUSTOMER')
      setStatus('ACTIVE')
      setPassword('')
    }
  }, [selectedUser, isModalOpen])

  const handleUpdateStatus = (id: string, newStatus: UserStatus) => {
    const user = data.find((u: any) => u.id === id)
    if (user) {
      setStatusToChange({ user, status: newStatus })
    }
  }

  const confirmStatusChange = async () => {
    if (statusToChange) {
      try {
        await updateStatusMutation.mutateAsync({
          id: statusToChange.user.id,
          status: statusToChange.status,
        })
      } catch (err) {
        // Error toast will be handled in hook
      } finally {
        setStatusToChange(null)
      }
    }
  }

  const handleUpdateRole = async (id: string, targetRole: UserRole) => {
    await updateRoleMutation.mutateAsync({ id, role: targetRole })
  }

  const handleDelete = (id: string) => {
    const user = data.find((u: any) => u.id === id)
    if (user) {
      setUserToDelete(user)
    }
  }

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUserMutation.mutateAsync(userToDelete.id)
      } catch (err) {
        // Handled in hook
      } finally {
        setUserToDelete(null)
      }
    }
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim()) {
      toast.error('Họ tên và Email không được bỏ trống!')
      return
    }

    if (!selectedUser && !password) {
      toast.error('Vui lòng nhập mật khẩu cho tài khoản mới!')
      return
    }

    try {
      if (selectedUser) {
        await updateUserMutation.mutateAsync({
          ...selectedUser,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          role,
          status,
        })
      } else {
        await createUserMutation.mutateAsync({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          role,
          status,
          password: password,
        } as any)
      }
      setIsModalOpen(false)
    } catch (err) {
      // Toast handles error
    }
  }

  const table = useReactTable<User>({
    data,
    columns,
    pageCount,
    meta: {
      onEdit: handleEdit,
      onUpdateStatus: handleUpdateStatus,
      onUpdateRole: handleUpdateRole,
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
          onDelete={async () => {
            if (selectedRows.length > 0) {
              const confirmMsg = `Bạn có chắc chắn muốn xóa ${selectedRows.length} người dùng đã chọn?`
              if (window.confirm(confirmMsg)) {
                const ids = selectedRows.map((row) => row.original.id)
                try {
                  await bulkDeleteMutation.mutateAsync(ids)
                  table.resetRowSelection()
                } catch (err) {
                  // Handled by toast
                }
              }
            }
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
                                  <ChevronsUpDown
                                    size={14}
                                    className='opacity-30'
                                  />
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

        <div className='flex items-center justify-between py-6 px-2 flex-wrap gap-4 border-t border-slate-100 bg-white rounded-b-2xl mt-0.5 shadow-sm'>
          <div className='flex items-center gap-4 flex-wrap'>
            <div className='text-sm font-medium text-slate-500'>
              Hiển thị từ {totalItems === 0 ? 0 : pageIndex * pageSize + 1} đến{' '}
              {Math.min((pageIndex + 1) * pageSize, totalItems)} trong tổng số{' '}
              <span className='font-bold text-slate-700'>{totalItems}</span> người dùng
            </div>

            <div className='flex items-center gap-2'>
              <span className='text-xs font-semibold text-slate-400'>Số dòng:</span>
              <Select
                value={String(pageSize)}
                onValueChange={(val) => {
                  table.setPageSize(Number(val))
                }}
              >
                <SelectTrigger className='h-8 w-[70px] bg-slate-50 border-gray-200 text-xs font-bold rounded-lg focus:ring-0 focus:ring-offset-0 focus:bg-white'>
                  <SelectValue placeholder={String(pageSize)} />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  <SelectItem value='5'>5</SelectItem>
                  <SelectItem value='10'>10</SelectItem>
                  <SelectItem value='20'>20</SelectItem>
                  <SelectItem value='50'>50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='flex items-center gap-1.5'>
            {/* First Page Button */}
            <Button
              variant='outline'
              size='icon'
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className='h-8 w-8 rounded-lg bg-white border-gray-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm'
              title='Trang đầu'
            >
              <ChevronsLeft size={16} />
            </Button>

            {/* Previous Page Button */}
            <Button
              variant='outline'
              size='icon'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className='h-8 w-8 rounded-lg bg-white border-gray-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm'
              title='Trang trước'
            >
              <ChevronLeft size={16} />
            </Button>

            {/* Numeric Page Buttons */}
            {Array.from({ length: pageCount }).map((_, index) => {
              const isFirst = index === 0
              const isLast = index === pageCount - 1
              const isNear = Math.abs(index - pageIndex) <= 1

              if (isFirst || isLast || isNear) {
                return (
                  <Button
                    key={index}
                    variant={pageIndex === index ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => table.setPageIndex(index)}
                    className={`h-8 w-8 rounded-lg text-xs font-black ${
                      pageIndex === index
                        ? 'bg-primary text-white hover:bg-primary/95 shadow-md shadow-primary/20'
                        : 'bg-white hover:bg-slate-50 border-gray-200 text-slate-600 shadow-sm'
                    }`}
                  >
                    {index + 1}
                  </Button>
                )
              }

              if (
                (index === 1 && pageIndex > 2) ||
                (index === pageCount - 2 && pageIndex < pageCount - 3)
              ) {
                return (
                  <span
                    key={index}
                    className='text-slate-400 text-xs px-1 select-none font-bold'
                  >
                    ...
                  </span>
                )
              }

              return null
            })}

            {/* Next Page Button */}
            <Button
              variant='outline'
              size='icon'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className='h-8 w-8 rounded-lg bg-white border-gray-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm'
              title='Trang sau'
            >
              <ChevronRight size={16} />
            </Button>

            {/* Last Page Button */}
            <Button
              variant='outline'
              size='icon'
              onClick={() => table.setPageIndex(pageCount - 1)}
              disabled={!table.getCanNextPage()}
              className='h-8 w-8 rounded-lg bg-white border-gray-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm'
              title='Trang cuối'
            >
              <ChevronsRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* 1. ADD / EDIT USER DIALOG MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='bg-white/95 backdrop-blur-xl border border-gray-100 rounded-3xl max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200'>
          <DialogHeader>
            <div className='flex items-center gap-3 mb-2'>
              <div className='h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-primary'>
                <IconUser size={24} />
              </div>
              <div>
                <DialogTitle className='text-xl font-extrabold text-slate-900'>
                  {selectedUser ? 'Cập nhật tài khoản' : 'Thêm tài khoản mới'}
                </DialogTitle>
                <DialogDescription className='text-xs text-slate-400'>
                  {selectedUser
                    ? `ID: ${selectedUser.id}`
                    : 'Điền đầy đủ thông tin để tạo tài khoản người dùng.'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className='space-y-4 my-2'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Họ và tên */}
              <div className='flex flex-col gap-1.5'>
                <Label
                  htmlFor='fullName'
                  className='text-xs font-bold text-slate-600 pl-1'
                >
                  Họ và tên <span className='text-red-500'>*</span>
                </Label>
                <div className='relative'>
                  <IconUser
                    size={16}
                    className='absolute left-3.5 top-3.5 text-slate-400'
                  />
                  <Input
                    id='fullName'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder='Nguyễn Văn A'
                    className='pl-10 h-11 bg-slate-50/50 border-gray-200 rounded-xl text-sm font-medium focus:bg-white'
                    required
                  />
                </div>
              </div>

              {/* Số điện thoại */}
              <div className='flex flex-col gap-1.5'>
                <Label
                  htmlFor='phone'
                  className='text-xs font-bold text-slate-600 pl-1'
                >
                  Số điện thoại
                </Label>
                <div className='relative'>
                  <IconPhone
                    size={16}
                    className='absolute left-3.5 top-3.5 text-slate-400'
                  />
                  <Input
                    id='phone'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder='09xxxxxxxx'
                    className='pl-10 h-11 bg-slate-50/50 border-gray-200 rounded-xl text-sm font-medium focus:bg-white'
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className='flex flex-col gap-1.5'>
              <Label
                htmlFor='email'
                className='text-xs font-bold text-slate-600 pl-1'
              >
                Địa chỉ Email <span className='text-red-500'>*</span>
              </Label>
              <div className='relative'>
                <IconMail
                  size={16}
                  className='absolute left-3.5 top-3.5 text-slate-400'
                />
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='example@gmail.com'
                  className='pl-10 h-11 bg-slate-50/50 border-gray-200 rounded-xl text-sm font-medium focus:bg-white'
                  required
                />
              </div>
            </div>

            {/* Password (Only when adding new user) */}
            {!selectedUser && (
              <div className='flex flex-col gap-1.5'>
                <Label
                  htmlFor='password'
                  className='text-xs font-bold text-slate-600 pl-1'
                >
                  Mật khẩu đăng nhập <span className='text-red-500'>*</span>
                </Label>
                <div className='relative'>
                  <IconShield
                    size={16}
                    className='absolute left-3.5 top-3.5 text-slate-400'
                  />
                  <Input
                    id='password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Nhập mật khẩu (tối thiểu 6 ký tự)'
                    className='pl-10 h-11 bg-slate-50/50 border-gray-200 rounded-xl text-sm font-medium focus:bg-white'
                    required
                  />
                </div>
              </div>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Vai trò */}
              <div className='flex flex-col gap-1.5'>
                <Label className='text-xs font-bold text-slate-600 pl-1'>
                  Vai trò hệ thống
                </Label>
                <Select
                  value={role}
                  onValueChange={(val) => setRole(val as UserRole)}
                >
                  <SelectTrigger className='bg-slate-50/50 h-11 border-gray-200 rounded-xl text-sm font-semibold focus:bg-white'>
                    <SelectValue placeholder='Chọn vai trò' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Phân quyền</SelectLabel>
                      <SelectItem value='CUSTOMER'>
                        Khách hàng (CUSTOMER)
                      </SelectItem>
                      <SelectItem value='STAFF'>
                        Nhân viên (STAFF)
                      </SelectItem>
                      <SelectItem value='VENDOR'>
                        Đối tác (VENDOR)
                      </SelectItem>
                      <SelectItem value='SALES'>
                        Kinh doanh (SALES)
                      </SelectItem>
                      <SelectItem value='EDITOR'>
                        Biên tập (EDITOR)
                      </SelectItem>
                      <SelectItem value='INVENTORY'>
                        Thủ kho (INVENTORY)
                      </SelectItem>
                      <SelectItem value='ADMIN'>
                        Quản trị viên (ADMIN)
                      </SelectItem>
                      <SelectItem value='SUPER_ADMIN'>
                        Super Admin (SUPER_ADMIN)
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Trạng thái */}
              <div className='flex flex-col gap-1.5'>
                <Label className='text-xs font-bold text-slate-600 pl-1'>
                  Trạng thái hoạt động
                </Label>
                <Select
                  value={status}
                  onValueChange={(val) => setStatus(val as UserStatus)}
                >
                  <SelectTrigger className='bg-slate-50/50 h-11 border-gray-200 rounded-xl text-sm font-semibold focus:bg-white'>
                    <SelectValue placeholder='Chọn trạng thái' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Trạng thái</SelectLabel>
                      <SelectItem value='ACTIVE'>
                        Đang hoạt động (ACTIVE)
                      </SelectItem>
                      <SelectItem value='BLOCKED'>Đã khóa (BLOCKED)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className='pt-4 border-t border-slate-100 flex items-center justify-end gap-2 flex-wrap'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsModalOpen(false)}
                className='gap-2 rounded-xl h-11 font-bold'
              >
                <IconSquareRoundedX size={18} /> Hủy
              </Button>
              <Button
                type='submit'
                className='gap-2 rounded-xl h-11 font-bold bg-primary hover:opacity-90 shadow-lg shadow-primary/20'
              >
                <IconDeviceFloppy size={18} /> Lưu thông tin
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. CUSTOM DELETE CONFIRMATION DIALOG */}
      <Dialog
        open={!!userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <DialogContent className='bg-white/95 backdrop-blur-xl border border-red-100 rounded-3xl max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200'>
          <DialogHeader>
            <div className='flex items-center gap-3 mb-2'>
              <div className='h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500'>
                <IconAlertTriangle size={24} />
              </div>
              <div>
                <DialogTitle className='text-lg font-extrabold text-slate-900'>
                  Xóa vĩnh viễn tài khoản?
                </DialogTitle>
                <DialogDescription className='text-xs text-slate-400'>
                  Xác nhận xóa tài khoản người dùng khỏi hệ thống.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {userToDelete && (
            <div className='bg-red-50/50 p-4 rounded-2xl border border-red-100/50 space-y-2 my-2 text-sm text-slate-700'>
              <div className='flex items-center gap-2'>
                <span className='font-bold text-slate-900'>Họ và tên:</span>
                <span>{userToDelete.fullName}</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='font-bold text-slate-900'>Email:</span>
                <span>{userToDelete.email}</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='font-bold text-slate-900'>Vai trò:</span>
                <Badge
                  variant='secondary'
                  className='text-[10px] rounded-full px-2 py-0.5'
                >
                  {userToDelete.role}
                </Badge>
              </div>
              <p className='text-xs text-red-600 font-semibold pt-2 border-t border-red-100/80'>
                ⚠️ Lưu ý: Hành động này là phá hủy và KHÔNG THỂ HOÀN TÁC. Tất cả
                thông tin cá nhân và liên kết của người dùng sẽ bị loại bỏ hoàn
                toàn.
              </p>
            </div>
          )}

          <DialogFooter className='pt-2 flex gap-2'>
            <Button
              variant='outline'
              onClick={() => setUserToDelete(null)}
              className='rounded-xl h-11 font-bold flex-1'
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={confirmDelete}
              className='bg-red-500 text-white hover:bg-red-600 rounded-xl h-11 font-bold flex-1 gap-2 shadow-lg shadow-red-500/20'
            >
              <IconTrash size={18} /> Đồng ý xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. CUSTOM STATUS SWITCH CONFIRMATION DIALOG */}
      <Dialog
        open={!!statusToChange}
        onOpenChange={(open) => !open && setStatusToChange(null)}
      >
        <DialogContent className='bg-white/95 backdrop-blur-xl border border-blue-50 rounded-3xl max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200'>
          <DialogHeader>
            <div className='flex items-center gap-3 mb-2'>
              <div className='h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500'>
                <IconInfoCircle size={24} />
              </div>
              <div>
                <DialogTitle className='text-lg font-extrabold text-slate-900'>
                  Thay đổi trạng thái tài khoản?
                </DialogTitle>
                <DialogDescription className='text-xs text-slate-400'>
                  Cập nhật quyền truy cập và hoạt động của người dùng.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {statusToChange && (
            <div className='space-y-4 my-2 text-sm text-slate-700'>
              <div className='bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 space-y-2'>
                <div className='flex items-center gap-2'>
                  <span className='font-bold text-slate-900'>Họ và tên:</span>
                  <span>{statusToChange.user.fullName}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='font-bold text-slate-900'>Email:</span>
                  <span className='text-xs text-slate-500'>
                    {statusToChange.user.email}
                  </span>
                </div>
                <div className='flex items-center gap-3 pt-2 border-t border-blue-100/80'>
                  <div className='flex items-center gap-1'>
                    <span className='text-xs font-semibold text-slate-400'>
                      Hiện tại:
                    </span>
                    <Badge
                      variant='outline'
                      className='text-[10px] rounded-full px-2 py-0.5'
                    >
                      {statusToChange.user.status}
                    </Badge>
                  </div>
                  <span className='text-blue-500 font-bold'>➜</span>
                  <div className='flex items-center gap-1'>
                    <span className='text-xs font-semibold text-slate-900'>
                      Thay đổi:
                    </span>
                    <Badge className='text-[10px] bg-blue-600 text-white rounded-full px-2 py-0.5'>
                      {statusToChange.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className='text-xs text-slate-500 leading-relaxed px-1'>
                {statusToChange.status === 'BLOCKED' ? (
                  <span className='text-amber-600 font-medium'>
                    ⛔ Khi bị khóa (BLOCKED), người dùng này sẽ KHÔNG THỂ đăng
                    nhập vào hệ thống, các phiên đăng nhập hiện tại sẽ bị vô
                    hiệu hóa lập tức.
                  </span>
                ) : (
                  <span className='text-emerald-600 font-medium'>
                    ✅ Khi kích hoạt (ACTIVE), người dùng này sẽ được khôi phục
                    đầy đủ quyền đăng nhập và thực hiện các tính năng trên
                    website bình thường.
                  </span>
                )}
              </div>
            </div>
          )}

          <DialogFooter className='pt-2 flex gap-2'>
            <Button
              variant='outline'
              onClick={() => setStatusToChange(null)}
              className='rounded-xl h-11 font-bold flex-1'
            >
              Bỏ qua
            </Button>
            <Button
              onClick={confirmStatusChange}
              className='bg-blue-600 text-white hover:bg-blue-700 rounded-xl h-11 font-bold flex-1 gap-2 shadow-lg shadow-blue-600/20'
            >
              {statusToChange?.status === 'ACTIVE' ? (
                <>
                  <IconUserCheck size={18} /> Kích hoạt tài khoản
                </>
              ) : (
                <>
                  <IconUserX size={18} /> Khóa tài khoản
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UserTable
