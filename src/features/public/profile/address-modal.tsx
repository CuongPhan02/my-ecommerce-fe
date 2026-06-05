'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AUTH_QUERY } from '~/features/public/auth/auth.query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/core/dialog'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import { Checkbox } from '~/components/ui/core/checkbox'
import { MapPin, User, Phone, Home, Globe, Landmark } from 'lucide-react'
import { Address, CreateAddressPayload } from './types'
import { cn } from '~/lib/utils'

const addressSchema = z.object({
  receiverName: z.string().min(1, 'Họ tên người nhận là bắt buộc'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  street: z.string().min(1, 'Địa chỉ chi tiết là bắt buộc'),
  city: z.string().min(1, 'Quận/Huyện là bắt buộc'),
  province: z.string().min(1, 'Tỉnh/Thành phố là bắt buộc'),
  postalCode: z.string().min(1, 'Mã bưu chính là bắt buộc'),
  country: z.string().min(1, 'Quốc gia là bắt buộc'),
  isDefault: z.boolean(),
})

type AddressFormValues = z.infer<typeof addressSchema>

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CreateAddressPayload) => void
  address?: Address | null
  isLoading?: boolean
}

export const AddressModal = ({
  isOpen,
  onClose,
  onSave,
  address,
  isLoading = false,
}: AddressModalProps) => {
  const { data: meData } = AUTH_QUERY.useMe()
  const me = meData?.result
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      receiverName: '',
      phone: '',
      street: '',
      city: '',
      province: '',
      postalCode: '100000',
      country: 'Việt Nam',
      isDefault: false,
    },
  })

  useEffect(() => {
    if (address) {
      reset({
        receiverName: address.receiverName,
        phone: address.phone,
        street: address.street,
        city: address.city,
        province: address.province,
        postalCode: address.postalCode,
        country: address.country,
        isDefault: address.isDefault,
      })
    } else {
      // Auto-fill from profile for new address
      reset({
        receiverName: me?.name || '',
        phone: me?.phone || '',
        street: '',
        city: '',
        province: '',
        postalCode: '100000',
        country: 'Việt Nam',
        isDefault: false,
      })
    }
  }, [address, reset, isOpen, me])

  const onSubmit = (data: AddressFormValues) => {
    onSave(data)
  }

  const isDefault = watch('isDefault')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className='bg-black p-8 text-white'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center'>
                <MapPin className='w-6 h-6' />
              </div>
              <div>
                <DialogTitle className='text-xl font-black uppercase tracking-tight'>
                  {address ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                </DialogTitle>
                <DialogDescription className='text-white/60 text-[10px] font-black uppercase tracking-widest mt-1'>
                  Cung cấp thông tin giao hàng chính xác
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className='p-8 space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2'>
                  <User className='w-3 h-3' /> Họ tên người nhận
                </label>
                <Input
                  {...register('receiverName')}
                  placeholder='Nhập họ tên'
                  className='rounded-xl font-bold py-6 bg-gray-50 border-gray-100 focus:bg-white transition-all'
                />
                {errors.receiverName && (
                  <p className='text-[10px] font-bold text-red-500 uppercase tracking-wider'>
                    {errors.receiverName.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2'>
                  <Phone className='w-3 h-3' /> Số điện thoại
                </label>
                <Input
                  {...register('phone')}
                  placeholder='Nhập số điện thoại'
                  className='rounded-xl font-bold py-6 bg-gray-50 border-gray-100 focus:bg-white transition-all'
                />
                {errors.phone && (
                  <p className='text-[10px] font-bold text-red-500 uppercase tracking-wider'>
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2'>
                <Home className='w-3 h-3' /> Địa chỉ chi tiết (Tòa nhà, số nhà,
                đường)
              </label>
              <Input
                {...register('street')}
                placeholder='Nhập địa chỉ'
                className='rounded-xl font-bold py-6 bg-gray-50 border-gray-100 focus:bg-white transition-all'
              />
              {errors.street && (
                <p className='text-[10px] font-bold text-red-500 uppercase tracking-wider'>
                  {errors.street.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2'>
                  <Landmark className='w-3 h-3' /> Tỉnh / Thành phố
                </label>
                <Input
                  {...register('province')}
                  placeholder='Ví dụ: Hà Nội'
                  className='rounded-xl font-bold py-6 bg-gray-50 border-gray-100 focus:bg-white transition-all'
                />
                {errors.province && (
                  <p className='text-[10px] font-bold text-red-500 uppercase tracking-wider'>
                    {errors.province.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2'>
                  <Landmark className='w-3 h-3' /> Quận / Huyện
                </label>
                <Input
                  {...register('city')}
                  placeholder='Ví dụ: Đống Đa'
                  className='rounded-xl font-bold py-6 bg-gray-50 border-gray-100 focus:bg-white transition-all'
                />
                {errors.city && (
                  <p className='text-[10px] font-bold text-red-500 uppercase tracking-wider'>
                    {errors.city.message}
                  </p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2'>
                  Mã bưu chính
                </label>
                <Input
                  {...register('postalCode')}
                  placeholder='100000'
                  className='rounded-xl font-bold py-6 bg-gray-50 border-gray-100 focus:bg-white transition-all'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2'>
                  <Globe className='w-3 h-3' /> Quốc gia
                </label>
                <Input
                  {...register('country')}
                  placeholder='Việt Nam'
                  className='rounded-xl font-bold py-6 bg-gray-50 border-gray-100 focus:bg-white transition-all'
                />
              </div>
            </div>

            <div
              className={cn(
                'flex items-center space-x-3 p-4 rounded-2xl border transition-all cursor-pointer',
                isDefault
                  ? 'bg-blue-50 border-blue-100'
                  : 'bg-gray-50 border-transparent hover:border-gray-200',
              )}
              onClick={() => setValue('isDefault', !isDefault)}
            >
              <Checkbox
                id='isDefault'
                checked={isDefault}
                onCheckedChange={(checked) => setValue('isDefault', !!checked)}
                className='w-5 h-5 rounded-lg border-2'
              />
              <label
                htmlFor='isDefault'
                className='text-[10px] font-black uppercase tracking-widest text-gray-600 cursor-pointer select-none'
              >
                Đặt làm địa chỉ mặc định
              </label>
            </div>
          </div>

          <DialogFooter className='p-8 bg-gray-50 flex flex-col sm:flex-row gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isLoading}
              className='flex-1 py-6 rounded-2xl font-black text-[10px] uppercase tracking-widest border-gray-200 hover:bg-white'
            >
              Hủy bỏ
            </Button>
            <Button
              type='submit'
              disabled={isLoading}
              className='flex-1 py-6 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-black hover:bg-primary transition-all shadow-xl shadow-black/10'
            >
              {isLoading ? 'Đang lưu...' : 'Lưu địa chỉ'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
