'use client'

import React, { useState, useEffect, useRef } from 'react'
import { _profileService } from '~/features/public/profile/profile.query'
import { AUTH_QUERY } from '~/features/public/auth/auth.query'
import {
  User, MapPin, Plus, Trash2, CheckCircle2, Package,
  LogOut, Pencil, Save, X, Camera, Phone, Mail
} from 'lucide-react'
import { Button } from '~/components/ui/core/button'
import { toast } from 'react-toastify'
import { ConfirmModal } from '~/components/shared/confirm-modal'
import { AddressModal } from '~/features/public/profile/address-modal'
import { CreateAddressPayload, Address } from '~/features/public/profile/types'
import { cn } from '~/lib/utils'
import { OrderHistory } from '~/features/public/profile/order-history'
import { useAuthStore } from '~/store/auth-store'
import { useRouter } from 'next/navigation'
import { https, logout } from '~/config/https'
import Image from 'next/image'

const ProfilePage = () => {
  const router = useRouter()
  const { data: profileRes } = AUTH_QUERY.useMe()
  const { data: addressesRes } = _profileService.useMyAddresses()
  const deleteAddressMutation = _profileService.useDeleteAddress()
  const setDefaultAddressMutation = _profileService.useSetDefaultAddress()
  const createAddressMutation = _profileService.useCreateAddress()
  const updateAddressMutation = _profileService.useUpdateAddress()
  const updateProfileMutation = _profileService.useUpdateProfile()

  const { logout: logoutStore } = useAuthStore()

  const user = profileRes?.result
  const addresses = addressesRes?.result || []

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'ORDERS'>('PROFILE')
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')

  // Sync edit fields when user data loads
  useEffect(() => {
    if (user) {
      setEditName(user.name || '')
      setEditPhone(user.phone || '')
    }
  }, [user])

  const handleLogout = async () => {
    try {
      await https.post('/auth/logout')
    } catch (e) {
      // ignore
    } finally {
      logoutStore()
      logout()
      router.push('/')
    }
  }

  const handleCancelEdit = () => {
    setEditName(user?.name || '')
    setEditPhone(user?.phone || '')
    setIsEditingProfile(false)
  }

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      toast.error('Họ tên không được để trống')
      return
    }
    try {
      await updateProfileMutation.mutateAsync({
        name: editName.trim(),
        phone: editPhone.trim() || undefined,
      })
      toast.success('Cập nhật thông tin thành công!')
      setIsEditingProfile(false)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Cập nhật thất bại')
    }
  }

  const handleDeleteAddress = async () => {
    if (addressToDelete) {
      try {
        await deleteAddressMutation.mutateAsync(addressToDelete)
        toast.success('Xóa địa chỉ thành công')
      } catch {
        toast.error('Không thể xóa địa chỉ')
      }
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddressMutation.mutateAsync(id)
      toast.success('Đã đặt làm mặc định')
    } catch {
      toast.error('Thao tác thất bại')
    }
  }

  const handleOpenAddModal = () => {
    setEditingAddress(null)
    setIsAddressModalOpen(true)
  }

  const handleOpenEditModal = (addr: Address) => {
    setEditingAddress(addr)
    setIsAddressModalOpen(true)
  }

  const handleSaveAddress = async (data: CreateAddressPayload) => {
    try {
      if (editingAddress) {
        await updateAddressMutation.mutateAsync({ id: editingAddress.id, payload: data })
        toast.success('Cập nhật địa chỉ thành công')
      } else {
        await createAddressMutation.mutateAsync(data)
        toast.success('Thêm địa chỉ mới thành công')
      }
      setIsAddressModalOpen(false)
    } catch {
      toast.error('Lưu địa chỉ thất bại')
    }
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pt-24 pb-16">
      <div className="main-container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <div className="w-full lg:w-72 flex flex-col gap-4 shrink-0">
            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                  {user?.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.name || ''}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <User className="w-9 h-9 text-gray-300" />
                  )}
                </div>
              </div>

              <h2 className="text-base font-black uppercase tracking-tight leading-tight">{user?.name}</h2>
              <p className="text-[11px] font-bold text-gray-400 mt-1 truncate max-w-full">{user?.email}</p>

              {/* Role badge */}
              {user?.role && (
                <span className={cn(
                  "mt-2 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                  user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'STAFF'
                    ? "bg-indigo-50 text-indigo-600"
                    : "bg-gray-100 text-gray-500"
                )}>
                  {user.role}
                </span>
              )}

              <div className="w-full h-px bg-gray-50 my-5" />

              <div className="w-full space-y-1">
                <button
                  onClick={() => setActiveTab('PROFILE')}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                    activeTab === 'PROFILE' ? "bg-black text-white" : "text-gray-400 hover:text-black hover:bg-gray-50"
                  )}
                >
                  <User className="w-4 h-4 shrink-0" />
                  Thông tin cá nhân
                </button>
                <button
                  onClick={() => setActiveTab('ORDERS')}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                    activeTab === 'ORDERS' ? "bg-black text-white" : "text-gray-400 hover:text-black hover:bg-gray-50"
                  )}
                >
                  <Package className="w-4 h-4 shrink-0" />
                  Đơn hàng của tôi
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all mt-2"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6 min-w-0">
            {activeTab === 'PROFILE' ? (
              <>
                {/* ─── Profile Info Card ─── */}
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black uppercase tracking-tight">Thông tin cá nhân</h3>
                    {!isEditingProfile ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingProfile(true)}
                        className="rounded-xl font-black text-[10px] uppercase tracking-widest border-gray-200 gap-1.5"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Chỉnh sửa
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                          className="rounded-xl font-black text-[10px] uppercase tracking-widest border-gray-200 gap-1.5"
                          disabled={updateProfileMutation.isPending}
                        >
                          <X className="w-3.5 h-3.5" />
                          Hủy
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveProfile}
                          className="rounded-xl font-black text-[10px] uppercase tracking-widest bg-black hover:bg-primary gap-1.5"
                          disabled={updateProfileMutation.isPending}
                        >
                          <Save className="w-3.5 h-3.5" />
                          {updateProfileMutation.isPending ? 'Đang lưu...' : 'Lưu'}
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                        <User className="w-3 h-3" />
                        Họ và tên
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full text-sm font-bold px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
                          placeholder="Nhập họ và tên..."
                        />
                      ) : (
                        <p className="text-sm font-bold px-4 py-3 bg-gray-50 rounded-2xl border border-gray-50">
                          {user?.name || '—'}
                        </p>
                      )}
                    </div>

                    {/* Email (read-only) */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                        <Mail className="w-3 h-3" />
                        Email
                      </label>
                      <p className="text-sm font-bold px-4 py-3 bg-gray-50 rounded-2xl border border-gray-50 text-gray-500">
                        {user?.email}
                      </p>
                      {isEditingProfile && (
                        <p className="text-[10px] text-gray-400 font-medium pl-1">Email không thể thay đổi</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                        <Phone className="w-3 h-3" />
                        Số điện thoại
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full text-sm font-bold px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
                          placeholder="Nhập số điện thoại..."
                        />
                      ) : (
                        <p className={cn(
                          "text-sm font-bold px-4 py-3 bg-gray-50 rounded-2xl border border-gray-50",
                          !user?.phone && "text-gray-400 italic"
                        )}>
                          {user?.phone || 'Chưa cập nhật'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Hint about address auto-fill */}
                  {isEditingProfile && (
                    <div className="mt-5 p-4 bg-blue-50/60 rounded-2xl border border-blue-100 flex gap-3 items-start">
                      <MapPin className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-blue-600 font-semibold leading-relaxed">
                        Tên và số điện thoại của bạn sẽ được gợi ý tự động khi thêm địa chỉ giao hàng mới.
                      </p>
                    </div>
                  )}
                </div>

                {/* ─── Address Book Card ─── */}
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight">Sổ địa chỉ</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
                        Quản lý địa chỉ nhận hàng của bạn
                      </p>
                    </div>
                    <Button
                      onClick={handleOpenAddModal}
                      size="sm"
                      className="rounded-xl font-black text-[10px] uppercase tracking-widest bg-black hover:bg-primary transition-all gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm mới
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={cn(
                          "p-5 rounded-3xl border transition-all relative group flex flex-col justify-between",
                          addr.isDefault
                            ? "bg-blue-50/30 border-blue-200 shadow-sm shadow-blue-50/50"
                            : "bg-white border-gray-100 hover:border-gray-300"
                        )}
                      >
                        <div>
                          {addr.isDefault && (
                            <div className="absolute top-5 right-5 flex items-center gap-1 text-blue-600">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span className="text-[9px] font-black uppercase tracking-widest">Mặc định</span>
                            </div>
                          )}

                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                              addr.isDefault ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
                            )}>
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <p className="text-xs font-black text-gray-900 leading-tight pr-16">{addr.receiverName}</p>
                              <p className="text-[10px] font-bold text-gray-500">{addr.phone}</p>
                              <p className="text-[11px] font-medium text-gray-400 mt-1.5">{addr.street}</p>
                              <p className="text-[10px] font-bold text-gray-400">{addr.city}, {addr.province}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSetDefault(addr.id)}
                              className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline"
                            >
                              Đặt mặc định
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEditModal(addr)}
                            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => setAddressToDelete(addr.id)}
                            className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline ml-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {addresses.length === 0 && (
                      <div className="col-span-full py-12 flex flex-col items-center justify-center text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <MapPin className="w-10 h-10 text-gray-200 mb-3" />
                        <p className="text-sm font-bold text-gray-400">Bạn chưa có địa chỉ nào.</p>
                        <button
                          onClick={handleOpenAddModal}
                          className="mt-4 text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                        >
                          + Thêm địa chỉ đầu tiên
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <OrderHistory />
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!addressToDelete}
        onClose={() => setAddressToDelete(null)}
        onConfirm={handleDeleteAddress}
        title="Xóa địa chỉ"
        description="Bạn có chắc chắn muốn xóa địa chỉ này? Hành động này không thể hoàn tác."
        variant="destructive"
        confirmText="Xóa ngay"
        isLoading={deleteAddressMutation.isPending}
      />

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={handleSaveAddress}
        address={editingAddress}
        isLoading={createAddressMutation.isPending || updateAddressMutation.isPending}
      />
    </div>
  )
}

export default ProfilePage
