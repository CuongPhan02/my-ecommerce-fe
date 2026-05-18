'use client'
import React, { useState, useMemo } from 'react'
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
  SelectLabel,
} from '~/components/ui/core/select'
import { Label } from '~/components/ui/core/label'
import { Switch } from '~/components/ui/core/switch'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/core/avatar'
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
} from '@tabler/icons-react'

// Staff interface definition
interface Staff {
  id: string
  name: string
  email: string
  phone: string
  role: 'Admin' | 'Sales' | 'Editor' | 'Inventory'
  status: 'ACTIVE' | 'BLOCKED'
  avatar: string
  lastLogin: string
}

// Initial mock dataset
const INITIAL_STAFFS: Staff[] = [
  {
    id: 'STF-001',
    name: 'Nguyễn Quản Trị',
    email: 'admin@ecommerce.com',
    phone: '0987654321',
    role: 'Admin',
    status: 'ACTIVE',
    avatar: 'NQ',
    lastLogin: '2026-05-18 08:30',
  },
  {
    id: 'STF-002',
    name: 'Trần Bán Hàng',
    email: 'sales@ecommerce.com',
    phone: '0912345678',
    role: 'Sales',
    status: 'ACTIVE',
    avatar: 'TB',
    lastLogin: '2026-05-18 09:15',
  },
  {
    id: 'STF-003',
    name: 'Lê Nội Dung',
    email: 'content@ecommerce.com',
    phone: '0905556677',
    role: 'Editor',
    status: 'BLOCKED',
    avatar: 'LN',
    lastLogin: '2026-05-10 14:00',
  },
  {
    id: 'STF-004',
    name: 'Phạm Kho Vận',
    email: 'warehouse@ecommerce.com',
    phone: '0944332211',
    role: 'Inventory',
    status: 'ACTIVE',
    avatar: 'PK',
    lastLogin: '2026-05-17 16:45',
  },
]

export function StaffList() {
  const [staffs, setStaffs] = useState<Staff[]>(INITIAL_STAFFS)

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

  // Dialog States
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null)
  const [staffToToggle, setStaffToToggle] = useState<Staff | null>(null)

  // Form Field States
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<'Admin' | 'Sales' | 'Editor' | 'Inventory'>('Sales')
  const [status, setStatus] = useState<'ACTIVE' | 'BLOCKED'>('ACTIVE')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // KPI statistics calculation
  const stats = useMemo(() => {
    const total = staffs.length
    const admins = staffs.filter((s) => s.role === 'Admin').length
    const active = staffs.filter((s) => s.status === 'ACTIVE').length
    const blocked = staffs.filter((s) => s.status === 'BLOCKED').length
    return { total, admins, active, blocked }
  }, [staffs])

  // Populate form fields for Edit or Create
  const handleOpenForm = (staff?: Staff) => {
    if (staff) {
      setSelectedStaff(staff)
      setName(staff.name)
      setEmail(staff.email)
      setPhone(staff.phone)
      setRole(staff.role)
      setStatus(staff.status)
    } else {
      setSelectedStaff(null)
      setName('')
      setEmail('')
      setPhone('')
      setRole('Sales')
      setStatus('ACTIVE')
    }
    setIsFormOpen(true)
  }

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error('Vui lòng điền đầy đủ và đúng định dạng các trường bắt buộc!')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      toast.error('Địa chỉ email không hợp lệ!')
      return
    }

    if (selectedStaff) {
      // Update
      setStaffs((prev) =>
        prev.map((s) =>
          s.id === selectedStaff.id
            ? {
                ...s,
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                role,
                status,
              }
            : s
        )
      )
      toast.success('Cập nhật tài khoản nhân viên thành công!')
    } else {
      // Create new
      const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

      const newStaff: Staff = {
        id: `STF-${Math.floor(100 + Math.random() * 900)}`,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role,
        status,
        avatar: initials || 'NV',
        lastLogin: 'Chưa từng đăng nhập',
      }
      setStaffs((prev) => [newStaff, ...prev])
      toast.success('Đã thêm nhân viên mới thành công!')
    }
    setIsFormOpen(false)
  }

  // Handle Deletion Confirmation
  const confirmDelete = () => {
    if (staffToDelete) {
      setStaffs((prev) => prev.filter((s) => s.id !== staffToDelete.id))
      toast.success(`Đã gỡ bỏ nhân sự ${staffToDelete.name} khỏi hệ thống.`)
      setStaffToDelete(null)
    }
  }

  // Handle status toggle (Block / Unblock)
  const confirmToggleStatus = () => {
    if (staffToToggle) {
      const nextStatus = staffToToggle.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE'
      setStaffs((prev) =>
        prev.map((s) =>
          s.id === staffToToggle.id ? { ...s, status: nextStatus } : s
        )
      )
      toast.success(
        nextStatus === 'ACTIVE'
          ? `Mở khóa thành công tài khoản ${staffToToggle.name}`
          : `Đã khóa truy cập tài khoản ${staffToToggle.name}`
      )
      setStaffToToggle(null)
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
  const getRoleBadge = (role: 'Admin' | 'Sales' | 'Editor' | 'Inventory') => {
    switch (role) {
      case 'Admin':
        return (
          <div className='flex items-center gap-1 text-blue-600 font-extrabold text-xs bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1'>
            <IconShield size={14} className='fill-blue-50' />
            <span>Admin</span>
          </div>
        )
      case 'Sales':
        return (
          <div className='flex items-center gap-1 text-emerald-600 font-extrabold text-xs bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1'>
            <IconCircleDot size={14} />
            <span>Kinh doanh</span>
          </div>
        )
      case 'Editor':
        return (
          <div className='flex items-center gap-1 text-violet-600 font-extrabold text-xs bg-violet-50 border border-violet-100 rounded-lg px-2.5 py-1'>
            <IconCircleDot size={14} />
            <span>Nội dung</span>
          </div>
        )
      case 'Inventory':
        return (
          <div className='flex items-center gap-1 text-amber-600 font-extrabold text-xs bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1'>
            <IconCircleDot size={14} />
            <span>Kho hàng</span>
          </div>
        )
    }
  }

  // Filtered & Sorted list
  const filteredStaffs = useMemo(() => {
    return staffs.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phone.includes(searchTerm)
      const matchesRole = roleFilter === 'all' || s.role === roleFilter
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [staffs, searchTerm, roleFilter, statusFilter])

  // Pagination calculation
  const totalPages = Math.ceil(filteredStaffs.length / itemsPerPage) || 1
  const paginatedStaffs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredStaffs.slice(start, start + itemsPerPage)
  }, [filteredStaffs, currentPage])

  return (
    <div className='flex flex-col gap-6 w-full max-w-[1400px] mx-auto p-4 md:p-6'>
      {/* Title block */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-primary shadow-sm shadow-indigo-100'>
            <IconUsers size={24} />
          </div>
          <div>
            <h1 className='text-2xl font-black text-slate-900 tracking-tight'>Quản lý nhân sự</h1>
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
              <p className='text-xs font-black text-slate-400 uppercase tracking-widest'>Tổng nhân sự</p>
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
              <p className='text-xs font-black text-slate-400 uppercase tracking-widest'>Quản trị viên (Admin)</p>
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
              <p className='text-xs font-black text-slate-400 uppercase tracking-widest'>Đang hoạt động</p>
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
              <p className='text-xs font-black text-slate-400 uppercase tracking-widest'>Tài khoản đang khóa</p>
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
              <CardTitle className='text-lg font-bold text-slate-900'>Nhân sự & Phân quyền</CardTitle>
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
                  onChange={(e) => setSearchTerm(e.target.value)}
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

              {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
                <Button
                  variant='ghost'
                  onClick={() => {
                    setSearchTerm('')
                    setRoleFilter('all')
                    setStatusFilter('all')
                    setCurrentPage(1)
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
                <Label className='text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 mb-1'>Vai trò quản lý</Label>
                <Select value={roleFilter} onValueChange={(val) => { setRoleFilter(val); setCurrentPage(1); }}>
                  <SelectTrigger className='bg-white h-11 border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary'>
                    <SelectValue placeholder='Chọn vai trò' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='all'>Tất cả vai trò</SelectItem>
                      <SelectItem value='Admin'>Quản trị viên (Admin)</SelectItem>
                      <SelectItem value='Sales'>Kinh doanh (Sales)</SelectItem>
                      <SelectItem value='Editor'>Biên tập viên (Editor)</SelectItem>
                      <SelectItem value='Inventory'>Quản lý kho (Inventory)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Status filter */}
              <div className='flex flex-col gap-1'>
                <Label className='text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 mb-1'>Trạng thái tài khoản</Label>
                <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
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
                  <tr className='border-b border-slate-100/80'>
                    <th className='p-4 font-bold text-slate-900 border-b w-[280px]'>Nhân sự</th>
                    <th className='p-4 font-bold text-slate-900 border-b'>Liên hệ</th>
                    <th className='p-4 font-bold text-slate-900 border-b'>Cấp bậc / Vai trò</th>
                    <th className='p-4 font-bold text-slate-900 border-b'>Trạng thái hoạt động</th>
                    <th className='p-4 font-bold text-slate-900 border-b'>Đăng nhập lần cuối</th>
                    <th className='p-4 font-bold text-slate-900 border-b text-right'>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStaffs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className='text-center py-20 bg-white'>
                        <div className='flex flex-col items-center gap-4 text-slate-400'>
                          <IconUsers size={48} className='opacity-20' />
                          <p className='text-sm font-semibold'>Không tìm thấy tài khoản nhân sự phù hợp</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedStaffs.map((staff) => (
                      <tr
                        key={staff.id}
                        className='border-b border-slate-100/60 hover:bg-slate-50/50 transition-colors'
                      >
                        {/* Member */}
                        <td className='p-4 align-middle'>
                          <div className='flex items-center gap-3'>
                            <Avatar className='h-10 w-10 border border-indigo-100 shadow-sm'>
                              <AvatarFallback className='bg-indigo-50 font-black text-indigo-700 text-xs'>
                                {staff.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col gap-0.5'>
                              <span className='font-extrabold text-slate-800 text-sm'>{staff.name}</span>
                              <span className='text-[10px] text-slate-400 font-bold uppercase tracking-wide'>{staff.id}</span>
                            </div>
                          </div>
                        </td>

                        {/* Contact details */}
                        <td className='p-4 align-middle text-xs font-semibold text-slate-600 space-y-1'>
                          <div className='flex items-center gap-1.5'>
                            <IconMail size={14} className='text-slate-400' />
                            <span>{staff.email}</span>
                          </div>
                          <div className='flex items-center gap-1.5'>
                            <IconPhone size={14} className='text-slate-400' />
                            <span>{staff.phone}</span>
                          </div>
                        </td>

                        {/* Role */}
                        <td className='p-4 align-middle'>
                          {getRoleBadge(staff.role)}
                        </td>

                        {/* Status */}
                        <td className='p-4 align-middle text-xs'>
                          {getStatusBadge(staff.status)}
                        </td>

                        {/* Last Login */}
                        <td className='p-4 align-middle text-xs font-bold text-slate-500'>
                          {staff.lastLogin}
                        </td>

                        {/* Actions */}
                        <td className='p-4 align-middle text-right'>
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
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>

          {/* Pagination component */}
          {filteredStaffs.length > 0 && (
            <div className='flex items-center justify-between py-5 px-6 border-t border-slate-100/60 bg-slate-50/10'>
              <div className='text-xs font-bold text-slate-500'>
                Hiển thị {paginatedStaffs.length} nhân viên (Trang {currentPage}/{totalPages})
              </div>
              <div className='flex items-center gap-1.5'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className='bg-white shadow-sm rounded-xl font-bold text-xs h-9'
                >
                  Trước
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className='bg-white shadow-sm rounded-xl font-bold text-xs h-9'
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 1. ADD / EDIT STAFF DIALOG FORM */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className='bg-white/95 backdrop-blur-xl border border-slate-100 rounded-3xl max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200'>
          <DialogHeader>
            <div className='flex items-center gap-3 mb-2'>
              <div className='h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-primary'>
                <IconUserPlus size={24} />
              </div>
              <div>
                <DialogTitle className='text-xl font-extrabold text-slate-900'>
                  {selectedStaff ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản nhân sự'}
                </DialogTitle>
                <DialogDescription className='text-xs text-slate-400 font-medium'>
                  {selectedStaff ? `Mã ID: ${selectedStaff.id}` : 'Tạo thông tin đăng nhập và cấp quyền hệ thống.'}
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
                className='h-11 bg-slate-50/50 border-slate-200 rounded-xl text-sm font-semibold focus:bg-white'
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
                className='h-11 bg-slate-50/50 border-slate-200 rounded-xl text-sm font-semibold focus:bg-white'
                required
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
                className='h-11 bg-slate-50/50 border-slate-200 rounded-xl text-sm font-semibold focus:bg-white'
                required
              />
            </div>

            {/* Role select */}
            <div className='flex flex-col gap-1.5'>
              <Label className='text-xs font-bold text-slate-600 pl-1'>Cấp quyền / Phân hệ vai trò</Label>
              <Select value={role} onValueChange={(val) => setRole(val as any)}>
                <SelectTrigger className='bg-slate-50/50 h-11 border-slate-200 rounded-xl text-sm font-semibold focus:bg-white'>
                  <SelectValue placeholder='Chọn phân vai trò' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value='Admin'>Quản trị viên cấp cao (Admin)</SelectItem>
                    <SelectItem value='Sales'>Chăm sóc khách hàng & Sales</SelectItem>
                    <SelectItem value='Editor'>Biên tập viên nội dung (Editor)</SelectItem>
                    <SelectItem value='Inventory'>Quản trị viên thủ kho (Inventory)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Initial status switch (only toggle status during addition/edit) */}
            <div className='flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100/80 my-2'>
              <div className='flex flex-col gap-0.5'>
                <span className='text-xs font-bold text-slate-800'>Trạng thái tài khoản</span>
                <span className='text-[10px] text-slate-400 font-medium'>
                  {status === 'ACTIVE'
                    ? 'Cho phép đăng nhập và sử dụng hệ thống ngay.'
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
        <DialogContent className='bg-white/95 backdrop-blur-xl border border-red-100 rounded-3xl max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200'>
          <DialogHeader>
            <div className='flex items-center gap-3 mb-2'>
              <div className='h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shadow-sm'>
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
            <div className='bg-red-50/50 p-4 rounded-2xl border border-red-100/50 space-y-2 my-2 text-sm text-slate-700'>
              <div className='flex items-center gap-2'>
                <span className='font-bold text-slate-900'>Họ và tên:</span>
                <span className='font-extrabold text-slate-800'>{staffToDelete.name}</span>
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
                ⚠️ Lưu ý: Hành động này sẽ thu hồi toàn bộ quyền đăng nhập ngay lập tức. Các nhật ký hoạt động cũ của nhân viên này vẫn sẽ được lưu trữ để đối soát.
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
        <DialogContent className='bg-white/95 backdrop-blur-xl border border-blue-50 rounded-3xl max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200'>
          <DialogHeader>
            <div className='flex items-center gap-3 mb-2'>
              <div className='h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm'>
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
              <div className='bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 space-y-2'>
                <div className='flex items-center gap-2'>
                  <span className='font-bold text-slate-900'>Nhân sự:</span>
                  <span className='font-extrabold text-slate-800'>{staffToToggle.name}</span>
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
                    ⛔ Khi khóa tài khoản (BLOCKED), nhân sự sẽ bị ngắt kết nối phiên đăng nhập hiện tại ngay lập tức và KHÔNG THỂ truy cập trang quản trị.
                  </span>
                ) : (
                  <span className='text-emerald-600 font-semibold'>
                    ✅ Khi mở khóa hoạt động (ACTIVE), tài khoản sẽ được đăng nhập và sử dụng mọi phân hệ chức năng tương thích bình thường.
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
              {staffToToggle?.status === 'ACTIVE' ? 'Khóa truy cập tài khoản' : 'Mở khóa hoạt động'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
