'use client'

import React, { useState } from 'react'
import { _profileService } from '~/features/public/profile/profile.query'
import { AUTH_QUERY } from '~/features/public/auth/auth.query'
import { User, MapPin, Plus, Trash2, CheckCircle2, Package, Settings, LogOut } from 'lucide-react'
import { Button } from '~/components/ui/core/button'
import { toast } from 'react-toastify'
import { ConfirmModal } from '~/components/shared/confirm-modal'
import { AddressModal } from '~/features/public/profile/address-modal'
import { CreateAddressPayload, Address } from '~/features/public/profile/types'
import { cn } from '~/lib/utils'
import { OrderHistory } from '~/features/public/profile/order-history'

const ProfilePage = () => {
  const { data: profileRes } = AUTH_QUERY.useMe()
  const { data: addressesRes } = _profileService.useMyAddresses()
  const deleteAddressMutation = _profileService.useDeleteAddress()
  const setDefaultAddressMutation = _profileService.useSetDefaultAddress()
  const createAddressMutation = _profileService.useCreateAddress()
  const updateAddressMutation = _profileService.useUpdateAddress()
  
  const user = profileRes?.result
  const addresses = addressesRes?.result || []
  
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'ORDERS'>('PROFILE')
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  const handleDeleteAddress = async () => {
    if (addressToDelete) {
      try {
        await deleteAddressMutation.mutateAsync(addressToDelete)
        toast.success('Xóa địa chỉ thành công')
      } catch (error) {
        toast.error('Không thể xóa địa chỉ')
      }
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddressMutation.mutateAsync(id)
      toast.success('Đã đặt làm mặc định')
    } catch (error) {
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
    } catch (error) {
      toast.error('Lưu địa chỉ thất bại')
    }
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pt-24 pb-16">
      <div className="main-container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-80 flex flex-col gap-6">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 relative overflow-hidden group">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-gray-300" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Settings className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">{user?.name}</h2>
              <p className="text-xs font-bold text-gray-400 mt-1">{user?.email}</p>
              
              <div className="w-full h-px bg-gray-50 my-6" />
              
              <div className="w-full space-y-2">
                <button 
                  onClick={() => setActiveTab('PROFILE')}
                  className={cn(
                    "w-full flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                    activeTab === 'PROFILE' ? "bg-black text-white" : "text-gray-400 hover:text-black hover:bg-gray-50"
                  )}
                >
                  <User className="w-4 h-4" />
                  Thông tin cá nhân
                </button>
                <button 
                  onClick={() => setActiveTab('ORDERS')}
                  className={cn(
                    "w-full flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                    activeTab === 'ORDERS' ? "bg-black text-white" : "text-gray-400 hover:text-black hover:bg-gray-50"
                  )}
                >
                  <Package className="w-4 h-4" />
                  Đơn hàng của tôi
                </button>
                <button className="w-full flex items-center gap-3 px-6 py-3 text-red-500 hover:bg-red-50 rounded-xl text-xs font-black uppercase tracking-widest transition-all mt-4">
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {activeTab === 'PROFILE' ? (
              <>
                {/* Profile Info Card */}
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black uppercase tracking-tight">Cài đặt tài khoản</h3>
                    <Button variant="outline" className="rounded-xl font-black text-[10px] uppercase tracking-widest border-gray-100">Chỉnh sửa</Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Họ và tên</label>
                      <p className="text-sm font-bold p-4 bg-gray-50 rounded-2xl border border-gray-50">{user?.name}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</label>
                      <p className="text-sm font-bold p-4 bg-gray-50 rounded-2xl border border-gray-50">{user?.email}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Số điện thoại</label>
                      <p className="text-sm font-bold p-4 bg-gray-50 rounded-2xl border border-gray-50">{user?.phone || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                </div>

                {/* Address Management Card */}
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight">Sổ địa chỉ</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Quản lý địa chỉ nhận hàng của bạn</p>
                    </div>
                    <Button 
                      onClick={handleOpenAddModal}
                      className="rounded-xl font-black text-[10px] uppercase tracking-widest bg-black hover:bg-primary transition-all"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm địa chỉ mới
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                      <div 
                        key={addr.id} 
                        className={cn(
                          "p-6 rounded-3xl border transition-all relative group flex flex-col justify-between",
                          addr.isDefault ? "bg-blue-50/30 border-blue-200 shadow-blue-50/50" : "bg-white border-gray-100 hover:border-gray-300"
                        )}
                      >
                        <div>
                          {addr.isDefault && (
                            <div className="absolute top-6 right-6 flex items-center gap-1.5 text-blue-600">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Mặc định</span>
                            </div>
                          )}
                          
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                              addr.isDefault ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
                            )}>
                              <MapPin className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-black text-gray-900 leading-tight pr-12">{addr.receiverName}</p>
                              <p className="text-[10px] font-bold text-gray-500">{addr.phone}</p>
                              <p className="text-[11px] font-medium text-gray-400 mt-2">{addr.street}</p>
                              <p className="text-[10px] font-bold text-gray-400">{addr.city}, {addr.province}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
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
                        <MapPin className="w-12 h-12 text-gray-200 mb-4" />
                        <p className="text-sm font-bold text-gray-400">Bạn chưa có địa chỉ nào trong sổ địa chỉ.</p>
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
        description="Bạn có chắc chắn muốn xóa địa chỉ này khỏi sổ địa chỉ? Hành động này không thể hoàn tác."
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
