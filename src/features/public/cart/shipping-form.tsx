'use client'

import React from 'react'
import { cn } from '~/lib/utils'

interface ShippingFormProps {
  values: {
    shippingName: string
    shippingPhone: string
    shippingEmail: string
    street: string
    province: string
    city: string
    note: string
  }
  onChange: (field: string, value: string) => void
  errors?: Record<string, string>
}

const ShippingForm = ({ values, onChange, errors = {} }: ShippingFormProps) => {
  return (
    <div className='flex flex-col gap-8'>
      <h2 className='text-2xl font-black uppercase tracking-tight'>
        Thông tin vận chuyển
      </h2>

      <div className='flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100 mb-2'>
        <div className='pt-1'>
          <input
            type='checkbox'
            defaultChecked
            className='w-4 h-4 accent-black cursor-pointer'
          />
        </div>
        <p className='text-[10px] text-gray-500 font-medium leading-relaxed'>
          Bằng việc ấn nút đặt hàng, bạn xác nhận là đã đọc và hiểu về{' '}
          <span className='text-blue-600 font-bold hover:underline cursor-pointer'>
            chính sách bảo mật
          </span>{' '}
          dữ liệu cá nhân của Coolmate.{' '}
          <span className='text-blue-600 font-bold hover:underline cursor-pointer'>
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
              'w-full py-3.5 px-6 border rounded-2xl text-sm font-bold placeholder:font-medium placeholder:text-gray-300 focus:border-black focus:outline-none transition-all bg-white',
              errors.shippingName
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200',
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
              'w-full py-3.5 px-6 border rounded-2xl text-sm font-bold placeholder:font-medium placeholder:text-gray-300 focus:border-black focus:outline-none transition-all bg-white',
              errors.shippingPhone
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200',
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
            'w-full py-3.5 px-6 border rounded-2xl text-sm font-bold placeholder:font-medium placeholder:text-gray-300 focus:border-black focus:outline-none transition-all bg-white',
            errors.shippingEmail
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-200',
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
            'w-full py-3.5 px-6 border rounded-2xl text-sm font-bold placeholder:font-medium placeholder:text-gray-300 focus:border-black focus:outline-none transition-all bg-white',
            errors.street
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-200',
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
              'w-full py-3.5 px-6 border rounded-2xl text-sm font-bold placeholder:font-medium placeholder:text-gray-300 focus:border-black focus:outline-none transition-all bg-white',
              errors.province
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200',
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
              'w-full py-3.5 px-6 border rounded-2xl text-sm font-bold placeholder:font-medium placeholder:text-gray-300 focus:border-black focus:outline-none transition-all bg-white',
              errors.city
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200',
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
          className='w-full py-3.5 px-6 border rounded-2xl text-sm font-bold placeholder:font-medium placeholder:text-gray-300 focus:border-black focus:outline-none transition-all min-h-[100px] resize-none bg-white border-gray-200'
        />
      </div>
    </div>
  )
}

export default ShippingForm
