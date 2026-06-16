'use client'

import React, { useState, useEffect, useRef } from 'react'
import { _profileService } from '~/features/public/profile/profile.query'
import { AUTH_QUERY } from '~/features/public/auth/auth.query'
import {
  User,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  Package,
  LogOut,
  Pencil,
  Save,
  X,
  Camera,
  Phone,
  Mail,
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
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ảnh đại diện không được vượt quá 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Chỉ chấp nhận file định dạng hình ảnh')
      return
    }

    try {
      setIsUploadingAvatar(true)
      const formData = new FormData()
      formData.append('files', file)

      const response = await https.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const uploadedUrl = response.data?.result?.url
      if (!uploadedUrl) {
        throw new Error('Không nhận được URL ảnh từ server')
      }

      await updateProfileMutation.mutateAsync({
        avatarUrl: uploadedUrl,
      })

      toast.success('Cập nhật ảnh đại diện thành công!')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Không thể tải ảnh đại diện lên')
    } finally {
      setIsUploadingAvatar(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

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
        await updateAddressMutation.mutateAsync({
          id: editingAddress.id,
          payload: data,
        })
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
    <div className='bg-[#FAF9F6] min-h-screen pt-28 pb-20'>
      <div className='main-container mx-auto px-4'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Sidebar */}
          <div className='w-full lg:w-72 flex flex-col gap-4 shrink-0'>
            <div className='bg-white rounded-sm p-6 border border-neutral-200/60 shadow-xs flex flex-col items-center text-center'>
              {/* Avatar */}
              <div
                className='relative mb-4 cursor-pointer group'
                onClick={handleAvatarClick}
                title='Thay đổi ảnh đại diện'
              >
                <div className='w-20 h-20 rounded-full overflow-hidden border border-neutral-200 shadow-sm bg-[#FBF8F3] flex items-center justify-center relative'>
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name || ''}
                      width={80}
                      height={80}
                      className='object-cover w-full h-full'
                    />
                  ) : (
                    <User className='w-9 h-9 text-neutral-400' />
                  )}

                  {/* Uploading Overlay */}
                  {isUploadingAvatar && (
                    <div className='absolute inset-0 bg-black/50 flex items-center justify-center z-10'>
                      <div className='w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin' />
                    </div>
                  )}
                </div>

                {/* Hover Camera Overlay */}
                {!isUploadingAvatar && (
                  <div className='absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 z-10'>
                    <Camera className='w-5 h-5 text-white' />
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  type='file'
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept='image/*'
                  className='hidden'
                  disabled={isUploadingAvatar}
                />
              </div>

              <h2 className='text-sm font-bold uppercase tracking-widest text-[#231f20] leading-tight'>
                {user?.name}
              </h2>
              <p className='text-[10px] font-semibold text-neutral-400 mt-1 truncate max-w-full uppercase tracking-wider'>
                {user?.email}
              </p>

              {/* Role badge */}
              {user?.role && (
                <span
                  className={cn(
                    'mt-2 text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-sm border',
                    user.role === 'ADMIN' ||
                      user.role === 'SUPER_ADMIN' ||
                      user.role === 'STAFF'
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-[#FAF6F0] text-[#5c4e43] border-neutral-200/50',
                  )}
                >
                  {user.role}
                </span>
              )}

              <div className='w-full h-px bg-neutral-100 my-5' />

              <div className='w-full space-y-1'>
                <button
                  onClick={() => setActiveTab('PROFILE')}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer',
                    activeTab === 'PROFILE'
                      ? 'bg-[#231f20] text-white'
                      : 'text-neutral-400 hover:text-[#231f20] hover:bg-[#FBF8F3]',
                  )}
                >
                  <User className='w-4 h-4 shrink-0' />
                  Thông tin cá nhân
                </button>
                <button
                  onClick={() => setActiveTab('ORDERS')}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer',
                    activeTab === 'ORDERS'
                      ? 'bg-[#231f20] text-white'
                      : 'text-neutral-400 hover:text-[#231f20] hover:bg-[#FBF8F3]',
                  )}
                >
                  <Package className='w-4 h-4 shrink-0' />
                  Đơn hàng của tôi
                </button>
                <button
                  onClick={handleLogout}
                  className='w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50/50 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all mt-2 cursor-pointer'
                >
                  <LogOut className='w-4 h-4 shrink-0' />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='flex-1 space-y-6 min-w-0'>
            {activeTab === 'PROFILE' ? (
              <>
                {/* ─── Profile Info Card ─── */}
                <div className='bg-white rounded-sm p-8 border border-neutral-200/60 shadow-xs'>
                  <div className='flex justify-between items-center mb-6'>
                    <h3 className='text-base font-bold uppercase tracking-wider text-[#231f20]'>
                      Thông tin cá nhân
                    </h3>
                    {!isEditingProfile ? (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setIsEditingProfile(true)}
                        className='rounded-sm font-bold text-[10px] uppercase tracking-widest border-neutral-200 hover:bg-[#FAF6F0] text-[#231f20] gap-1.5'
                      >
                        <Pencil className='w-3.5 h-3.5' />
                        Chỉnh sửa
                      </Button>
                    ) : (
                      <div className='flex gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={handleCancelEdit}
                          className='rounded-sm font-bold text-[10px] uppercase tracking-widest border-neutral-200 hover:bg-neutral-50 text-neutral-600 gap-1.5'
                          disabled={updateProfileMutation.isPending}
                        >
                          <X className='w-3.5 h-3.5' />
                          Hủy
                        </Button>
                        <Button
                          size='sm'
                          onClick={handleSaveProfile}
                          className='rounded-sm font-bold text-[10px] uppercase tracking-widest bg-[#231f20] hover:bg-[#5c4e43] text-white gap-1.5 border-none'
                          disabled={updateProfileMutation.isPending}
                        >
                          <Save className='w-3.5 h-3.5' />
                          {updateProfileMutation.isPending
                            ? 'Đang lưu...'
                            : 'Lưu'}
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    {/* Name */}
                    <div className='space-y-2'>
                      <label className='text-[9px] font-bold uppercase tracking-widest text-[#5c4e43] flex items-center gap-1.5'>
                        <User className='w-3 h-3' />
                        Họ và tên
                      </label>
                      {isEditingProfile ? (
                        <input
                          type='text'
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className='w-full text-xs font-semibold px-4 py-3 bg-white border border-neutral-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#231f20] focus:border-[#231f20] transition-all text-[#231f20]'
                          placeholder='Nhập họ và tên...'
                        />
                      ) : (
                        <p className='text-xs font-semibold px-4 py-3 bg-[#FBF8F3] rounded-sm border border-neutral-200/60 text-[#231f20]'>
                          {user?.name || '—'}
                        </p>
                      )}
                    </div>

                    {/* Email (read-only) */}
                    <div className='space-y-2'>
                      <label className='text-[9px] font-bold uppercase tracking-widest text-[#5c4e43] flex items-center gap-1.5'>
                        <Mail className='w-3 h-3' />
                        Email
                      </label>
                      <p className='text-xs font-semibold px-4 py-3 bg-[#FBF8F3] rounded-sm border border-neutral-200/60 text-neutral-400'>
                        {user?.email}
                      </p>
                      {isEditingProfile && (
                        <p className='text-[9px] text-neutral-400 font-semibold pl-1 uppercase tracking-wider'>
                          Email không thể thay đổi
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className='space-y-2'>
                      <label className='text-[9px] font-bold uppercase tracking-widest text-[#5c4e43] flex items-center gap-1.5'>
                        <Phone className='w-3 h-3' />
                        Số điện thoại
                      </label>
                      {isEditingProfile ? (
                        <input
                          type='tel'
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className='w-full text-xs font-semibold px-4 py-3 bg-white border border-neutral-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#231f20] focus:border-[#231f20] transition-all text-[#231f20]'
                          placeholder='Nhập số điện thoại...'
                        />
                      ) : (
                        <p
                          className={cn(
                            'text-xs font-semibold px-4 py-3 bg-[#FBF8F3] rounded-sm border border-neutral-200/60 text-[#231f20]',
                            !user?.phone && 'text-neutral-400 italic',
                          )}
                        >
                          {user?.phone || 'Chưa cập nhật'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Hint about address auto-fill */}
                  {isEditingProfile && (
                    <div className='mt-5 p-4 bg-[#FBF8F3] rounded-sm border border-neutral-200/60 flex gap-3 items-start'>
                      <MapPin className='w-4 h-4 text-[#5c4e43] mt-0.5 shrink-0' />
                      <p className='text-xs text-[#5c4e43] font-semibold leading-relaxed'>
                        Tên và số điện thoại của bạn sẽ được gợi ý tự động khi
                        thêm địa chỉ giao hàng mới.
                      </p>
                    </div>
                  )}
                </div>

                {/* ─── Address Book Card ─── */}
                <div className='bg-white rounded-sm p-8 border border-neutral-200/60 shadow-xs'>
                  <div className='flex justify-between items-center mb-6'>
                    <div>
                      <h3 className='text-base font-bold uppercase tracking-wider text-[#231f20]'>
                        Sổ địa chỉ
                      </h3>
                      <p className='text-[9px] font-semibold uppercase tracking-widest text-neutral-400 mt-1'>
                        Quản lý địa chỉ nhận hàng của bạn
                      </p>
                    </div>
                    <Button
                      onClick={handleOpenAddModal}
                      size='sm'
                      className='rounded-sm font-bold text-[10px] uppercase tracking-widest bg-[#231f20] hover:bg-[#5c4e43] transition-all gap-1.5 border-none text-white cursor-pointer'
                    >
                      <Plus className='w-4 h-4' />
                      Thêm mới
                    </Button>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={cn(
                          'p-5 rounded-sm border transition-all relative group flex flex-col justify-between',
                          addr.isDefault
                            ? 'bg-[#FBF8F3] border-[#231f20]'
                            : 'bg-white border-neutral-200 hover:border-neutral-400',
                        )}
                      >
                        <div>
                          {addr.isDefault && (
                            <div className='absolute top-1 right-2 p-1 rounded-lg flex bg-green-600 items-center gap-1 text-white'>
                              <CheckCircle2 className='w-3.5 h-3.5' />
                              <span className='text-[9px] font-black uppercase tracking-widest'>
                                Mặc định
                              </span>
                            </div>
                          )}

                          <div className='flex items-start gap-3'>
                            <div
                              className={cn(
                                'w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0',
                                addr.isDefault
                                  ? 'bg-[#231f20] text-white'
                                  : 'bg-neutral-50 border border-neutral-200/50 text-neutral-400',
                              )}
                            >
                              <MapPin className='w-4 h-4' />
                            </div>
                            <div className='space-y-0.5 min-w-0'>
                              <p className='text-xs font-bold text-[#231f20] leading-tight pr-16'>
                                {addr.receiverName}
                              </p>
                              <p className='text-[9px] font-semibold text-neutral-400'>
                                {addr.phone}
                              </p>
                              <p className='text-[10px] font-semibold text-neutral-500 mt-1.5'>
                                {addr.street}
                              </p>
                              <p className='text-[9px] font-semibold text-neutral-400'>
                                {addr.city}, {addr.province}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className='flex items-center gap-4 mt-5 pt-4 border-t border-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity'>
                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSetDefault(addr.id)}
                              className='text-[10px] font-bold uppercase tracking-widest text-[#5c4e43] hover:underline border-none bg-transparent cursor-pointer'
                            >
                              Đặt mặc định
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEditModal(addr)}
                            className='text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-[#231f20] border-none bg-transparent cursor-pointer'
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => setAddressToDelete(addr.id)}
                            className='text-[10px] font-bold uppercase tracking-widest text-red-600 hover:underline ml-auto border-none bg-transparent cursor-pointer flex items-center gap-1'
                          >
                            <Trash2 className='w-3.5 h-3.5' />
                          </button>
                        </div>
                      </div>
                    ))}

                    {addresses.length === 0 && (
                      <div className='col-span-full py-12 flex flex-col items-center justify-center text-center bg-[#FAF6F0] rounded-sm border border-dashed border-neutral-200'>
                        <MapPin className='w-10 h-10 text-neutral-300 mb-3' />
                        <p className='text-xs font-bold text-neutral-400 uppercase tracking-wider'>
                          Bạn chưa có địa chỉ nào.
                        </p>
                        <button
                          onClick={handleOpenAddModal}
                          className='mt-4 text-[9px] font-bold uppercase tracking-widest text-[#5c4e43] hover:underline border-none bg-transparent cursor-pointer'
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
        title='Xóa địa chỉ'
        description='Bạn có chắc chắn muốn xóa địa chỉ này? Hành động này không thể hoàn tác.'
        variant='destructive'
        confirmText='Xóa ngay'
        isLoading={deleteAddressMutation.isPending}
      />

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={handleSaveAddress}
        address={editingAddress}
        isLoading={
          createAddressMutation.isPending || updateAddressMutation.isPending
        }
      />
    </div>
  )
}

export default ProfilePage
