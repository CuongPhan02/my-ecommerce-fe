'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  ColumnDef,
} from '@tanstack/react-table'
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Checkbox } from '~/components/ui/core/checkbox'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import { Badge } from '~/components/ui/core/badge'
import { Input } from '~/components/ui/core/input'
import { Button } from '~/components/ui/core/button'
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
} from '~/components/ui/core/select'
import { Label } from '~/components/ui/core/label'
import { Switch } from '~/components/ui/core/switch'
import { Avatar, AvatarFallback } from '~/components/ui/core/avatar'
import { ScrollArea, ScrollBar } from '~/components/ui/core/scroll-area'
import { toast } from 'react-toastify'
import {
  IconUsers,
  IconShield,
  IconSearch,
  IconAdjustmentsHorizontal,
  IconUserPlus,
  IconTrash,
  IconEdit,
  IconUserCheck,
  IconUserOff,
  IconAlertTriangle,
  IconInfoCircle,
  IconMail,
  IconPhone,
  IconFilterOff,
  IconShieldCheck,
  IconCircleDot,
  IconLock,
} from '@tabler/icons-react'
import { TableSkeletonLoading } from '~/components/shared/table-skeleton-loading'
import { _userService } from '../user/user.query'
import { User, UserParams, UserStatus, UserRole } from '../user/types'

export function StaffList() {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  // Dialog States
  const [selectedStaff, setSelectedStaff] = useState<User | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [staffToDelete, setStaffToDelete] = useState<User | null>(null)
  const [staffToToggle, setStaffToToggle] = useState<User | null>(null)

  // Form Field States
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<UserRole>('STAFF')
  const [status, setStatus] = useState<UserStatus>('ACTIVE')
  const [password, setPassword] = useState('')

  // Pagination State
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })

  const pagination = useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize],
  )

  // Sorting conversion
  const sortActive = sorting[0]
  const allowedSortKeys = ['createdAt', 'name', 'email', 'staffCode', 'lastLogin']
  const targetId = sortActive ? (sortActive.id === 'fullName' ? 'name' : sortActive.id) : 'createdAt'
  const sortByVal = allowedSortKeys.includes(targetId) ? targetId : 'createdAt'
  const sortVal = sortActive ? (sortActive.desc ? 'desc' : 'asc') : 'desc'

  const params: UserParams = {
    page: pageIndex + 1,
    limit: pageSize,
    search: searchTerm || null,
    role: roleFilter !== 'all' ? (roleFilter as UserRole) : null,
    status: statusFilter !== 'all' ? (statusFilter as UserStatus) : null,
    sort: sortVal as any,
    sortBy: sortByVal as any,
    isSystem: true,
  }

  // 1. Fetch system users for statistics (using limit 1000 to cover all and allow accurate KPI calculations)
  const { data: allStaffData } = _userService.useUsers({
    isSystem: true,
    page: 1,
    limit: 1000,
  })

  // 2. Fetch paginated system users for Table
  const { data: usersData, isLoading } = _userService.useUsers(params)

  // Mutation services
  const updateStatusMutation = _userService.useUpdateUserStatus()
  const deleteUserMutation = _userService.useDeleteUser()
  const createUserMutation = _userService.useCreateUser()
  const updateUserMutation = _userService.useUpdateUser()
  const bulkDeleteMutation = _userService.useBulkDeleteUsers()

  const data = (usersData?.result as any)?.data || []
  const pageCount = (usersData?.result as any)?.meta?.totalPages || 0
  const totalItems = (usersData?.result as any)?.meta?.total || 0

  // Calculate live statistics
  const stats = useMemo(() => {
    const list = (allStaffData?.result as any)?.data || []
    const total = list.length
    const admins = list.filter(
      (s: any) => s.role === 'ADMIN' || s.role === 'SUPER_ADMIN',
    ).length
    const active = list.filter((s: any) => s.status === 'ACTIVE').length
    const blocked = list.filter((s: any) => s.status === 'BLOCKED').length
    return { total, admins, active, blocked }
  }, [allStaffData])

  // Populate form fields for Edit or Create
  const handleOpenForm = (staff?: User) => {
    if (staff) {
      setSelectedStaff(staff)
      setName(staff.fullName)
      setEmail(staff.email)
      setPhone(staff.phone || '')
      setRole(staff.role)
      setStatus(staff.status)
      setPassword('')
    } else {
      setSelectedStaff(null)
      setName('')
      setEmail('')
      setPhone('')
      setRole('STAFF')
      setStatus('ACTIVE')
      setPassword('')
    }
    setIsFormOpen(true)
  }

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc!')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      toast.error('Địa chỉ email không hợp lệ!')
      return
    }

    if (!selectedStaff && !password) {
      toast.error('Vui lòng nhập mật khẩu cho tài khoản nhân viên mới!')
      return
    }

    try {
      if (selectedStaff) {
        await updateUserMutation.mutateAsync({
          id: selectedStaff.id,
          fullName: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role,
          status,
          createdAt: selectedStaff.createdAt,
        })
      } else {
        await createUserMutation.mutateAsync({
          fullName: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role,
          status,
          password,
        } as any)
      }
      setIsFormOpen(false)
    } catch (err) {
      // Errors handled by React Query toasts
    }
  }

  // Handle Deletion Confirmation
  const confirmDelete = async () => {
    if (staffToDelete) {
      try {
        await deleteUserMutation.mutateAsync(staffToDelete.id)
      } catch (err) {
        // Handled
      } finally {
        setStaffToDelete(null)
      }
    }
  }

  // Handle status toggle (Block / Unblock)
  const confirmToggleStatus = async () => {
    if (staffToToggle) {
      try {
        const nextStatus = staffToToggle.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE'
        await updateStatusMutation.mutateAsync({
          id: staffToToggle.id,
          status: nextStatus,
        })
      } catch (err) {
        // Handled
      } finally {
        setStaffToToggle(null)
      }
    }
  }

  // Helper to get status badges
  const getStatusBadge = (status: 'ACTIVE' | 'BLOCKED') => {
    if (status === 'ACTIVE') {
      return (
        <Badge className='bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 gap-1 rounded-full px-3 py-1 font-bold'>
          ● Đang hoạt động
        </Badge>
      )
    }
    return (
      <Badge className='bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 gap-1 rounded-full px-3 py-1 font-bold'>
        ● Đang khóa
      </Badge>
    )
  }

  // Helper to get role icon/badge colors
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return (
          <div className='flex items-center gap-1 text-red-600 font-extrabold text-xs bg-red-50 border border-red-100 rounded-lg px-2.5 py-1 w-fit'>
            <IconShield size={14} className='fill-red-50' />
            <span>Super Admin</span>
          </div>
        )
      case 'ADMIN':
        return (
          <div className='flex items-center gap-1 text-blue-600 font-extrabold text-xs bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1 w-fit'>
            <IconShield size={14} className='fill-blue-50' />
            <span>Admin</span>
          </div>
        )
      case 'STAFF':
        return (
          <div className='flex items-center gap-1 text-cyan-600 font-extrabold text-xs bg-cyan-50 border border-cyan-100 rounded-lg px-2.5 py-1 w-fit'>
            <IconCircleDot size={14} />
            <span>Nhân viên</span>
          </div>
        )
      case 'SALES':
        return (
          <div className='flex items-center gap-1 text-emerald-600 font-extrabold text-xs bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1 w-fit'>
            <IconCircleDot size={14} />
            <span>Kinh doanh</span>
          </div>
        )
      case 'EDITOR':
        return (
          <div className='flex items-center gap-1 text-violet-600 font-extrabold text-xs bg-violet-50 border border-violet-100 rounded-lg px-2.5 py-1 w-fit'>
            <IconCircleDot size={14} />
            <span>Nội dung</span>
          </div>
        )
      case 'INVENTORY':
        return (
          <div className='flex items-center gap-1 text-amber-600 font-extrabold text-xs bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1 w-fit'>
            <IconCircleDot size={14} />
            <span>Thủ kho</span>
          </div>
        )
      default:
        return (
          <div className='flex items-center gap-1 text-slate-600 font-extrabold text-xs bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1 w-fit'>
            <IconCircleDot size={14} />
            <span>{role}</span>
          </div>
        )
    }
  }

  // Define columns array for Tanstack React Table
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
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
            className='translate-y-[2px]'
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='Select row'
            className='translate-y-[2px]'
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'fullName',
        header: 'Nhân sự',
        cell: ({ row }) => {
          const initials =
            row.original.fullName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2) || 'NV'

          return (
            <div className='flex items-center gap-3'>
              <Avatar className='h-10 w-10 border border-indigo-100 shadow-sm'>
                <AvatarFallback className='bg-indigo-50 font-black text-indigo-700 text-xs'>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col gap-0.5'>
                <span className='font-extrabold text-slate-800 text-sm'>
                  {row.original.fullName}
                </span>
                <span className='text-[10px] text-slate-400 font-bold uppercase tracking-wide'>
                  {row.original.staffCode || row.original.id.substring(0, 8)}
                </span>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'email',
        header: 'Liên hệ',
        cell: ({ row }) => (
          <div className='text-xs font-semibold text-slate-600 space-y-1'>
            <div className='flex items-center gap-1.5'>
              <IconMail size={14} className='text-slate-400' />
              <span>{row.original.email}</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <IconPhone size={14} className='text-slate-400' />
              <span>{row.original.phone || 'N/A'}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Cấp bậc / Vai trò',
        cell: ({ row }) => getRoleBadge(row.original.role),
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái hoạt động',
        cell: ({ row }) => getStatusBadge(row.original.status),
      },
      {
        accessorKey: 'lastLogin',
        header: 'Đăng nhập lần cuối',
        cell: ({ row }) => (
          <span className='text-xs font-bold text-slate-500'>
            {row.original.lastLogin ? row.original.lastLogin : 'Chưa từng đăng nhập'}
          </span>
        ),
      },
      {
        id: 'actions',
        header: () => <div className='text-right'>Thao tác</div>,
        cell: ({ row }) => {
          const staff = row.original
          return (
            <div className='flex justify-end items-center gap-1'>
              {/* Toggle Lock / Unlock */}
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setStaffToToggle(staff)}
                className={`rounded-xl hover:bg-slate-100 ${
                  staff.status === 'ACTIVE'
                    ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50'
                    : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
                title={staff.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
              >
                {staff.status === 'ACTIVE' ? (
                  <IconUserOff size={18} />
                ) : (
                  <IconUserCheck size={18} />
                )}
              </Button>

              {/* Edit */}
              <Button
                variant='ghost'
                size='icon'
                onClick={() => handleOpenForm(staff)}
                className='rounded-xl hover:bg-slate-100 text-blue-500 hover:text-blue-600 hover:bg-blue-50'
                title='Chỉnh sửa thông tin'
              >
                <IconEdit size={18} />
              </Button>

              {/* Delete */}
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setStaffToDelete(staff)}
                className='rounded-xl hover:bg-slate-100 text-rose-500 hover:text-rose-600 hover:bg-rose-50'
                title='Xóa khỏi hệ thống'
              >
                <IconTrash size={18} />
              </Button>
            </div>
          )
        },
        enableSorting: false,
      },
    ],
    [],
  )

  const table = useReactTable<User>({
    data,
    columns,
    pageCount,
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

  const handleBulkDelete = async () => {
    if (selectedRows.length > 0) {
      const confirmMsg = `Bạn có chắc chắn muốn xóa ${selectedRows.length} nhân viên đã chọn?`
      if (window.confirm(confirmMsg)) {
        const ids = selectedRows.map((row) => row.original.id)
        try {
          await bulkDeleteMutation.mutateAsync(ids)
          table.resetRowSelection()
        } catch (err) {
          // Handled
        }
      }
    }
  }

  return (
    <div className='flex flex-col gap-6 w-full max-w-[1400px] mx-auto p-4 md:p-6'>
      {/* Title block */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-primary shadow-sm shadow-indigo-100'>
            <IconUsers size={24} />
          </div>
          <div>
            <h1 className='text-2xl font-black text-slate-900 tracking-tight'>
              Quản lý nhân sự
            </h1>
            <p className='text-sm text-slate-400 font-medium'>
              Điều hành tài khoản thành viên hệ thống và phân chia cấp độ vai trò.
            </p>
          </div>
        </div>
        <Button
          onClick={() => handleOpenForm()}
          className='rounded-xl bg-primary hover:opacity-90 font-bold gap-2 px-5 py-5 shadow-lg shadow-primary/20 transition-all self-start sm:self-auto'
        >
          <IconUserPlus size={20} /> Thêm nhân viên mới
        </Button>
      </div>

      {/* KPI Stats summary widgets */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card className='rounded-3xl border border-slate-100/60 shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all'>
          <CardContent className='p-6 flex items-center justify-between'>
            <div className='space-y-1.5'>
              <p className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                Tổng nhân sự
              </p>
              <h3 className='text-3xl font-extrabold text-slate-900'>{stats.total}</h3>
            </div>
            <div className='h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:scale-105 transition-transform'>
              <IconUsers size={22} />
            </div>
          </CardContent>
        </Card>

        <Card className='rounded-3xl border border-slate-100/60 shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all'>
          <CardContent className='p-6 flex items-center justify-between'>
            <div className='space-y-1.5'>
              <p className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                Ban quản trị
              </p>
              <h3 className='text-3xl font-extrabold text-blue-600'>{stats.admins}</h3>
            </div>
            <div className='h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-105 transition-transform'>
              <IconShieldCheck size={22} />
            </div>
          </CardContent>
        </Card>

        <Card className='rounded-3xl border border-slate-100/60 shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all'>
          <CardContent className='p-6 flex items-center justify-between'>
            <div className='space-y-1.5'>
              <p className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                Đang hoạt động
              </p>
              <h3 className='text-3xl font-extrabold text-emerald-600'>{stats.active}</h3>
            </div>
            <div className='h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-transform'>
              <IconUserCheck size={22} />
            </div>
          </CardContent>
        </Card>

        <Card className='rounded-3xl border border-slate-100/60 shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all'>
          <CardContent className='p-6 flex items-center justify-between'>
            <div className='space-y-1.5'>
              <p className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                Tài khoản đang khóa
              </p>
              <h3 className='text-3xl font-extrabold text-rose-500'>{stats.blocked}</h3>
            </div>
            <div className='h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 group-hover:scale-105 transition-transform'>
              <IconUserOff size={22} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main card list */}
      <Card className='rounded-3xl border border-slate-100/80 shadow-md bg-white overflow-hidden'>
        <CardHeader className='pb-3 border-b border-slate-100/60 bg-slate-50/30'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
            <div>
              <CardTitle className='text-lg font-bold text-slate-900'>
                Nhân sự & Phân quyền
              </CardTitle>
              <CardDescription className='text-xs text-slate-400 font-medium'>
                Danh sách chi tiết tài khoản điều hành các phân hệ chức năng thương mại.
              </CardDescription>
            </div>

            {/* Filters panel triggers */}
            <div className='flex items-center gap-2 flex-wrap'>
              <div className='relative flex-1 sm:flex-none min-w-[240px]'>
                <IconSearch size={16} className='absolute left-3.5 top-3.5 text-slate-400' />
                <Input
                  type='search'
                  placeholder='Tìm theo tên, email, sđt...'
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
                  }}
                  className='pl-10 h-11 bg-white border-slate-200 rounded-xl text-sm font-semibold'
                />
              </div>

              <Button
                variant={isFilterDrawerOpen ? 'default' : 'outline'}
                onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
                className='h-11 rounded-xl font-bold gap-2'
              >
                <IconAdjustmentsHorizontal size={18} />
                Bộ lọc nâng cao
              </Button>

              {selectedRows.length > 0 && (
                <Button
                  onClick={handleBulkDelete}
                  className='bg-rose-500 hover:bg-rose-600 text-white h-11 rounded-xl font-bold gap-2 shadow-lg shadow-rose-500/20 animate-in fade-in duration-200'
                >
                  <IconTrash size={18} />
                  Xóa ({selectedRows.length}) đã chọn
                </Button>
              )}

              {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
                <Button
                  variant='ghost'
                  onClick={() => {
                    setSearchTerm('')
                    setRoleFilter('all')
                    setStatusFilter('all')
                    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
                  }}
                  className='h-11 rounded-xl text-xs font-black text-rose-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 gap-1'
                >
                  <IconFilterOff size={16} /> Xóa lọc
                </Button>
              )}
            </div>
          </div>

          {/* Collapsible Filter Drawer */}
          {isFilterDrawerOpen && (
            <div className='mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-4 duration-200'>
              {/* Role filter */}
              <div className='flex flex-col gap-1'>
                <Label className='text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 mb-1'>
                  Vai trò quản lý
                </Label>
                <Select
                  value={roleFilter}
                  onValueChange={(val) => {
                    setRoleFilter(val)
                    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
                  }}
                >
                  <SelectTrigger className='bg-white h-11 border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary'>
                    <SelectValue placeholder='Chọn vai trò' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='all'>Tất cả vai trò</SelectItem>
                      <SelectItem value='SUPER_ADMIN'>
                        Quản trị tối cao (Super Admin)
                      </SelectItem>
                      <SelectItem value='ADMIN'>Quản trị viên (Admin)</SelectItem>
                      <SelectItem value='STAFF'>Nhân viên (Staff)</SelectItem>
                      <SelectItem value='SALES'>Kinh doanh (Sales)</SelectItem>
                      <SelectItem value='EDITOR'>Biên tập viên (Editor)</SelectItem>
                      <SelectItem value='INVENTORY'>Quản lý kho (Inventory)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Status filter */}
              <div className='flex flex-col gap-1'>
                <Label className='text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 mb-1'>
                  Trạng thái tài khoản
                </Label>
                <Select
                  value={statusFilter}
                  onValueChange={(val) => {
                    setStatusFilter(val)
                    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
                  }}
                >
                  <SelectTrigger className='bg-white h-11 border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary'>
                    <SelectValue placeholder='Chọn trạng thái' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='all'>Tất cả trạng thái</SelectItem>
                      <SelectItem value='ACTIVE'>Đang hoạt động</SelectItem>
                      <SelectItem value='BLOCKED'>Đang tạm khóa</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className='p-0'>
          <ScrollArea className='w-full overflow-hidden'>
            <div className='min-h-[300px]'>
              <table className='text-sm text-left w-full border-collapse whitespace-nowrap'>
                <thead className='bg-slate-50 dark:bg-muted'>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className='border-b border-slate-100/80'>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className='p-4 font-bold text-slate-900 border-b first:w-[50px] last:text-right'
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
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {isLoading ? (
                    <TableSkeletonLoading rowCount={pageSize} colCount={columns.length} />
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className='text-center py-20 bg-white'>
                        <div className='flex flex-col items-center gap-4 text-slate-400'>
                          <IconUsers size={48} className='opacity-20' />
                          <p className='text-sm font-semibold'>
                            Không tìm thấy tài khoản nhân sự phù hợp
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => {
                      const isSelected = row.getIsSelected()
                      return (
                        <tr
                          key={row.id}
                          className={`border-b transition-all duration-200 ${
                            isSelected
                              ? 'bg-indigo-50/40 hover:bg-indigo-50/60 dark:bg-indigo-950/10 dark:hover:bg-indigo-950/20 border-l-4 border-l-primary shadow-sm'
                              : 'hover:bg-slate-50/50 transition-colors'
                          }`}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className='p-4 align-middle'>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
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

          {/* Pagination component */}
          {totalItems > 0 && (
            <div className='flex items-center justify-between py-5 px-6 border-t border-slate-100/60 bg-slate-50/10 flex-wrap gap-4'>
              <div className='text-xs font-bold text-slate-500'>
                Hiển thị từ {pageIndex * pageSize + 1} đến{' '}
                {Math.min((pageIndex + 1) * pageSize, totalItems)} trong tổng số{' '}
                <span className='font-black text-slate-700'>{totalItems}</span> nhân viên
              </div>
              <div className='flex items-center gap-1.5'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  className='bg-white shadow-sm rounded-xl font-bold text-xs h-9 w-9 p-0'
                >
                  <ChevronsLeft size={16} />
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className='bg-white shadow-sm rounded-xl font-bold text-xs h-9 w-9 p-0'
                >
                  <ChevronLeft size={16} />
                </Button>
                <span className='text-xs font-bold text-slate-600 px-2'>
                  Trang {pageIndex + 1} / {pageCount}
                </span>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className='bg-white shadow-sm rounded-xl font-bold text-xs h-9 w-9 p-0'
                >
                  <ChevronRight size={16} />
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  className='bg-white shadow-sm rounded-xl font-bold text-xs h-9 w-9 p-0'
                >
                  <ChevronsRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 1. ADD / EDIT STAFF DIALOG FORM */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className='bg-white/98 backdrop-blur-2xl border border-slate-100 rounded-3xl max-w-md p-6 shadow-2xl shadow-slate-900/25 animate-in fade-in zoom-in-95 duration-200 ring-4 ring-slate-900/5'>
          <DialogHeader>
            <div className='flex items-center gap-3 mb-2'>
              <div className='h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-primary border border-indigo-100/50 shadow-sm'>
                <IconUserPlus size={24} />
              </div>
              <div>
                <DialogTitle className='text-xl font-extrabold text-slate-900'>
                  {selectedStaff ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản nhân sự'}
                </DialogTitle>
                <DialogDescription className='text-xs text-slate-400 font-medium'>
                  {selectedStaff
                    ? `Mã số nhân sự: ${selectedStaff.staffCode || selectedStaff.id}`
                    : 'Tạo thông tin đăng nhập và cấp quyền hệ thống.'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className='space-y-4 my-2 text-slate-700'>
            {/* Full Name */}
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='staffName' className='text-xs font-bold text-slate-600 pl-1'>
                Họ và tên nhân sự <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='staffName'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='VD: Nguyễn Văn A'
                className='h-11 bg-slate-50/50 border-slate-200 rounded-xl text-sm font-semibold focus:bg-white transition-all duration-200'
                required
              />
            </div>

            {/* Email Address */}
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='staffEmail' className='text-xs font-bold text-slate-600 pl-1'>
                Địa chỉ email (Đăng nhập) <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='staffEmail'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='VD: email@company.com'
                className='h-11 bg-slate-50/50 border-slate-200 rounded-xl text-sm font-semibold focus:bg-white transition-all duration-200'
                required
                disabled={!!selectedStaff}
              />
            </div>

            {/* Contact Phone */}
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='staffPhone' className='text-xs font-bold text-slate-600 pl-1'>
                Số điện thoại liên lạc <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='staffPhone'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder='VD: 09xxxxxxxx'
                className='h-11 bg-slate-50/50 border-slate-200 rounded-xl text-sm font-semibold focus:bg-white transition-all duration-200'
                required
              />
            </div>

            {/* Password (Only show on Create) */}
            {!selectedStaff && (
              <div className='flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-200'>
                <Label
                  htmlFor='staffPassword'
                  className='text-xs font-bold text-slate-600 pl-1 flex items-center gap-1'
                >
                  <IconLock size={12} />
                  Mật khẩu tài khoản <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='staffPassword'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Nhập mật khẩu truy cập'
                  className='h-11 bg-slate-50/50 border-slate-200 rounded-xl text-sm font-semibold focus:bg-white transition-all duration-200'
                  required
                />
              </div>
            )}

            {/* Role select */}
            <div className='flex flex-col gap-1.5'>
              <Label className='text-xs font-bold text-slate-600 pl-1'>
                Cấp quyền / Phân hệ vai trò
              </Label>
              <Select value={role} onValueChange={(val) => setRole(val as UserRole)}>
                <SelectTrigger className='bg-slate-50/50 h-11 border-slate-200 rounded-xl text-sm font-semibold focus:bg-white transition-all duration-200'>
                  <SelectValue placeholder='Chọn phân vai trò' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value='SUPER_ADMIN'>
                      Quản trị tối cao (Super Admin)
                    </SelectItem>
                    <SelectItem value='ADMIN'>Quản trị viên (Admin)</SelectItem>
                    <SelectItem value='STAFF'>Nhân viên hệ thống (Staff)</SelectItem>
                    <SelectItem value='SALES'>Kinh doanh & Bán hàng (Sales)</SelectItem>
                    <SelectItem value='EDITOR'>Biên tập nội dung (Editor)</SelectItem>
                    <SelectItem value='INVENTORY'>Thủ kho & Kho vận (Inventory)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Initial status switch (only toggle status during addition/edit) */}
            <div className='flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100/80 my-2'>
              <div className='flex flex-col gap-0.5'>
                <span className='text-xs font-bold text-slate-800'>Trạng thái hoạt động</span>
                <span className='text-[10px] text-slate-400 font-medium'>
                  {status === 'ACTIVE'
                    ? 'Cho phép đăng nhập và sử dụng hệ thống.'
                    : 'Tạm ngưng kích hoạt tài khoản này.'}
                </span>
              </div>
              <Switch
                checked={status === 'ACTIVE'}
                onCheckedChange={(checked) => setStatus(checked ? 'ACTIVE' : 'BLOCKED')}
              />
            </div>

            <DialogFooter className='pt-4 border-t border-slate-100 flex items-center justify-end gap-2 flex-wrap'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsFormOpen(false)}
                className='gap-2 rounded-xl h-11 font-bold'
              >
                Hủy bỏ
              </Button>
              <Button
                type='submit'
                className='gap-2 rounded-xl h-11 font-bold bg-primary hover:opacity-90 shadow-lg shadow-primary/20'
              >
                Lưu tài khoản
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. CUSTOM DELETE CONFIRMATION DIALOG */}
      <Dialog open={!!staffToDelete} onOpenChange={(open) => !open && setStaffToDelete(null)}>
        <DialogContent className='bg-white/98 backdrop-blur-2xl border border-red-100 rounded-3xl max-w-md p-6 shadow-2xl shadow-red-950/15 animate-in fade-in zoom-in-95 duration-200 ring-4 ring-red-500/5'>
          <DialogHeader>
            <div className='flex items-center gap-3 mb-2'>
              <div className='h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shadow-sm border border-red-100/50'>
                <IconAlertTriangle size={24} />
              </div>
              <div>
                <DialogTitle className='text-lg font-extrabold text-slate-900'>
                  Xóa tài khoản nhân viên?
                </DialogTitle>
                <DialogDescription className='text-xs text-slate-400 font-medium'>
                  Gỡ bỏ hoàn toàn nhân sự khỏi hệ thống quản lý.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {staffToDelete && (
            <div className='bg-red-50/30 p-4 rounded-2xl border border-red-100/50 space-y-2 my-2 text-sm text-slate-700'>
              <div className='flex items-center gap-2'>
                <span className='font-bold text-slate-900'>Họ và tên:</span>
                <span className='font-extrabold text-slate-800'>{staffToDelete.fullName}</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='font-bold text-slate-900'>Email tài khoản:</span>
                <span className='font-semibold text-slate-600'>{staffToDelete.email}</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='font-bold text-slate-900'>Cấp quyền quản lý:</span>
                <span>{getRoleBadge(staffToDelete.role)}</span>
              </div>
              <p className='text-xs text-red-600 font-semibold pt-2 border-t border-red-100/80 leading-relaxed'>
                ⚠️ Lưu ý: Hành động này sẽ thu hồi toàn bộ quyền đăng nhập ngay lập tức. Các nhật
                ký hoạt động cũ của nhân viên này vẫn sẽ được lưu trữ để đối soát.
              </p>
            </div>
          )}

          <DialogFooter className='pt-2 flex gap-2'>
            <Button
              variant='outline'
              onClick={() => setStaffToDelete(null)}
              className='rounded-xl h-11 font-bold flex-1'
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={confirmDelete}
              className='bg-red-500 text-white hover:bg-red-600 rounded-xl h-11 font-bold flex-1 gap-2 shadow-lg shadow-red-500/20'
            >
              Đồng ý xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. CUSTOM STATUS CONFIRMATION DIALOG */}
      <Dialog open={!!staffToToggle} onOpenChange={(open) => !open && setStaffToToggle(null)}>
        <DialogContent className='bg-white/98 backdrop-blur-2xl border border-blue-100 rounded-3xl max-w-md p-6 shadow-2xl shadow-blue-950/15 animate-in fade-in zoom-in-95 duration-200 ring-4 ring-blue-500/5'>
          <DialogHeader>
            <div className='flex items-center gap-3 mb-2'>
              <div className='h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm border border-blue-100/50'>
                <IconInfoCircle size={24} />
              </div>
              <div>
                <DialogTitle className='text-lg font-extrabold text-slate-900'>
                  Thay đổi trạng thái tài khoản nhân sự?
                </DialogTitle>
                <DialogDescription className='text-xs text-slate-400 font-medium'>
                  Điều chỉnh tính đăng nhập khả dụng của nhân viên.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {staffToToggle && (
            <div className='space-y-4 my-2 text-sm text-slate-700'>
              <div className='bg-blue-50/30 p-4 rounded-2xl border border-blue-100/50 space-y-2'>
                <div className='flex items-center gap-2'>
                  <span className='font-bold text-slate-900'>Nhân sự:</span>
                  <span className='font-extrabold text-slate-800'>{staffToToggle.fullName}</span>
                </div>
                <div className='flex items-center gap-3 pt-2 border-t border-blue-100/80'>
                  <div className='flex items-center gap-1.5'>
                    <span className='text-xs font-semibold text-slate-400'>Hiện tại:</span>
                    <Badge variant='outline' className='text-[10px] rounded-full font-bold uppercase'>
                      {staffToToggle.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm khóa'}
                    </Badge>
                  </div>
                  <span className='text-blue-500 font-bold'>➜</span>
                  <div className='flex items-center gap-1.5'>
                    <span className='text-xs font-semibold text-slate-900'>Thay đổi:</span>
                    <Badge className='text-[10px] bg-blue-600 text-white rounded-full font-bold uppercase'>
                      {staffToToggle.status === 'ACTIVE' ? 'Đang khóa' : 'Đang hoạt động'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className='text-xs text-slate-500 leading-relaxed px-1 font-medium'>
                {staffToToggle.status === 'ACTIVE' ? (
                  <span className='text-amber-600 font-semibold'>
                    ⛔ Khi khóa tài khoản (BLOCKED), nhân sự sẽ bị ngắt kết nối phiên đăng nhập hiện
                    tại ngay lập tức và KHÔNG THỂ truy cập trang quản trị.
                  </span>
                ) : (
                  <span className='text-emerald-600 font-semibold'>
                    ✅ Khi mở khóa hoạt động (ACTIVE), tài khoản sẽ được đăng nhập và sử dụng mọi
                    phân hệ chức năng tương thích bình thường.
                  </span>
                )}
              </div>
            </div>
          )}

          <DialogFooter className='pt-2 flex gap-2'>
            <Button
              variant='outline'
              onClick={() => setStaffToToggle(null)}
              className='rounded-xl h-11 font-bold flex-1'
            >
              Hủy
            </Button>
            <Button
              onClick={confirmToggleStatus}
              className='bg-blue-600 text-white hover:bg-blue-700 rounded-xl h-11 font-bold flex-1 gap-2 shadow-lg shadow-blue-600/20'
            >
              {staffToToggle?.status === 'ACTIVE'
                ? 'Khóa truy cập tài khoản'
                : 'Mở khóa hoạt động'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
