'use client'

import React from 'react'
import { cn } from '~/lib/utils'

import { ShippingMethod } from './types'

interface ShippingFormProps {
  values: {
    shippingName: string
    shippingPhone: string
    shippingEmail: string
    street: string
    province: string
    city: string
    note: string
    shippingMethodId?: string
  }
  onChange: (field: string, value: string) => void
  errors?: Record<string, string>
  shippingMethods?: ShippingMethod[]
  enableShipping?: boolean
}

const ShippingForm = ({ values, onChange, errors = {}, shippingMethods = [], enableShipping = false }: ShippingFormProps) => {
  return (
    <div className='flex flex-col gap-8'>
      <h2 className='text-xl font-black uppercase tracking-tight text-[#231f20]'>
        Thông tin vận chuyển
      </h2>

      {enableShipping && shippingMethods.length > 0 && (
        <div className='flex flex-col gap-4 mb-4'>
          <h3 className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
            Phương thức vận chuyển
          </h3>
          <div className='grid grid-cols-1 gap-3'>
            {shippingMethods.map((method) => (
              <label 
                key={method.id} 
                className={cn(
                  'flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-all',
                  values.shippingMethodId === method.id 
                    ? 'border-[#5c4e43] bg-[#FBF8F3]' 
                    : 'border-neutral-200 hover:border-[#5c4e43]/50'
                )}
              >
                <div className='flex items-center gap-3'>
                  <input
                    type='radio'
                    name='shippingMethod'
                    value={method.id}
                    checked={values.shippingMethodId === method.id}
                    onChange={() => onChange('shippingMethodId', method.id)}
                    className='w-4 h-4 accent-[#5c4e43] cursor-pointer'
                  />
                  <div>
                    <p className='text-xs font-black text-[#231f20]'>{method.name}</p>
                    {method.estimatedDays && (
                      <p className='text-[10px] text-gray-500 font-semibold'>Thời gian: {method.estimatedDays}</p>
                    )}
                  </div>
                </div>
                <div className='text-xs font-black text-[#5c4e43]'>
                  {method.fee === 0 ? 'Miễn phí' : `${method.fee.toLocaleString('vi-VN')}đ`}
                </div>
              </label>
            ))}
          </div>
          {errors.shippingMethodId && (
            <p className='text-red-500 text-[10px] font-bold uppercase tracking-wider'>
              {errors.shippingMethodId}
            </p>
          )}
        </div>
      )}

      <div className='flex items-start gap-3 p-4 bg-[#FBF8F3] rounded-sm border border-[#e8dfd5]/65 mb-2'>
        <div className='pt-1'>
          <input
            type='checkbox'
            defaultChecked
            className='w-4 h-4 accent-[#5c4e43] cursor-pointer'
          />
        </div>
        <p className='text-[10px] text-gray-500 font-semibold leading-relaxed'>
          Bằng việc ấn nút đặt hàng, bạn xác nhận là đã đọc và hiểu về{' '}
          <span className='text-[#5c4e43] font-black hover:underline cursor-pointer'>
            chính sách bảo mật
          </span>{' '}
          dữ liệu cá nhân của LUNÉ.{' '}
          <span className='text-[#5c4e43] font-black hover:underline cursor-pointer'>
            Tại đây
          </span>
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='flex flex-col gap-2'>
          <label className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
            Họ tên
          </label>
          <input
            type='text'
            value={values.shippingName}
            onChange={(e) => onChange('shippingName', e.target.value)}
            placeholder='Nhập họ tên của bạn'
            className={cn(
              'w-full py-3 px-5 border rounded-sm text-xs font-bold placeholder:font-medium placeholder:text-gray-300 focus:border-[#5c4e43] focus:outline-none transition-all bg-white',
              errors.shippingName
                ? 'border-red-500 focus:border-red-500'
                : 'border-neutral-200',
            )}
          />
          {errors.shippingName && (
            <p className='text-red-500 text-[10px] font-bold uppercase tracking-wider'>
              {errors.shippingName}
            </p>
          )}
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
            Số điện thoại
          </label>
          <input
            type='tel'
            value={values.shippingPhone}
            onChange={(e) => onChange('shippingPhone', e.target.value)}
            placeholder='Nhập số điện thoại'
            className={cn(
              'w-full py-3 px-5 border rounded-sm text-xs font-bold placeholder:font-medium placeholder:text-gray-300 focus:border-[#5c4e43] focus:outline-none transition-all bg-white',
              errors.shippingPhone
                ? 'border-red-500 focus:border-red-500'
                : 'border-neutral-200',
            )}
          />
          {errors.shippingPhone && (
            <p className='text-red-500 text-[10px] font-bold uppercase tracking-wider'>
              {errors.shippingPhone}
            </p>
          )}
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <label className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
          Email
        </label>
        <input
          type='email'
          value={values.shippingEmail}
          onChange={(e) => onChange('shippingEmail', e.target.value)}
          placeholder='Nhập email của bạn'
          className={cn(
            'w-full py-3 px-5 border rounded-sm text-xs font-bold placeholder:font-medium placeholder:text-gray-300 focus:border-[#5c4e43] focus:outline-none transition-all bg-white',
            errors.shippingEmail
              ? 'border-red-500 focus:border-red-500'
              : 'border-neutral-200',
          )}
        />
        {errors.shippingEmail && (
          <p className='text-red-500 text-[10px] font-bold uppercase tracking-wider'>
            {errors.shippingEmail}
          </p>
        )}
      </div>

      <div className='flex flex-col gap-2'>
        <label className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
          Địa chỉ (tòa nhà, tên đường...)
        </label>
        <input
          type='text'
          value={values.street}
          onChange={(e) => onChange('street', e.target.value)}
          placeholder='Nhập địa chỉ'
          className={cn(
            'w-full py-3 px-5 border rounded-sm text-xs font-bold placeholder:font-medium placeholder:text-gray-300 focus:border-[#5c4e43] focus:outline-none transition-all bg-white',
            errors.street
              ? 'border-red-500 focus:border-red-500'
              : 'border-neutral-200',
          )}
        />
        {errors.street && (
          <p className='text-red-500 text-[10px] font-bold uppercase tracking-wider'>
            {errors.street}
          </p>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='flex flex-col gap-2'>
          <label className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
            Tỉnh / Thành phố
          </label>
          <input
            type='text'
            value={values.province}
            onChange={(e) => onChange('province', e.target.value)}
            placeholder='Ví dụ: Hà Nội'
            className={cn(
              'w-full py-3 px-5 border rounded-sm text-xs font-bold placeholder:font-medium placeholder:text-gray-300 focus:border-[#5c4e43] focus:outline-none transition-all bg-white',
              errors.province
                ? 'border-red-500 focus:border-red-500'
                : 'border-neutral-200',
            )}
          />
          {errors.province && (
            <p className='text-red-500 text-[10px] font-bold uppercase tracking-wider'>
              {errors.province}
            </p>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <label className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
            Quận / Huyện
          </label>
          <input
            type='text'
            value={values.city}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder='Ví dụ: Đống Đa'
            className={cn(
              'w-full py-3 px-5 border rounded-sm text-xs font-bold placeholder:font-medium placeholder:text-gray-300 focus:border-[#5c4e43] focus:outline-none transition-all bg-white',
              errors.city
                ? 'border-red-500 focus:border-red-500'
                : 'border-neutral-200',
            )}
          />
          {errors.city && (
            <p className='text-red-500 text-[10px] font-bold uppercase tracking-wider'>
              {errors.city}
            </p>
          )}
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <label className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
          Ghi chú (Tùy chọn)
        </label>
        <textarea
          value={values.note}
          onChange={(e) => onChange('note', e.target.value)}
          placeholder='Ví dụ: Giao giờ hành chính'
          className='w-full py-3 px-5 border rounded-sm text-xs font-bold placeholder:font-medium placeholder:text-gray-300 focus:border-[#5c4e43] focus:outline-none transition-all min-h-[100px] resize-none bg-white border-neutral-200'
        />
      </div>
    </div>
  )
}

export default ShippingForm
