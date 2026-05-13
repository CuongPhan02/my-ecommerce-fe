'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '~/lib/utils'

interface FilterGroup {
  id: string
  title: string
  options: { label: string; value: string; count?: number }[]
}

const filterGroups: FilterGroup[] = [
  {
    id: 'category',
    title: 'Danh mục',
    options: [
      { label: 'Áo Thun Nam', value: 'ao-thun' },
      { label: 'Áo Sơ Mi Nam', value: 'so-mi' },
      { label: 'Áo Polo Nam', value: 'polo' },
      { label: 'Áo Khoác Nam', value: 'ao-khoac' },
      { label: 'Áo Tank Top Nam', value: 'tank-top' },
      { label: 'Áo Sweater - Len & Nỉ', value: 'sweater' },
    ]
  },
  {
    id: 'gender',
    title: 'Giới tính',
    options: [
      { label: 'Nam', value: 'nam' },
      { label: 'Nữ', value: 'nu' },
    ]
  },
  {
    id: 'size',
    title: 'Kích thước',
    options: [
      { label: 'S', value: 's' },
      { label: 'M', value: 'm' },
      { label: 'L', value: 'l' },
      { label: 'XL', value: 'xl' },
      { label: '2XL', value: '2xl' },
      { label: '3XL', value: '3xl' },
    ]
  },
  {
    id: 'color',
    title: 'Màu sắc',
    options: [
      { label: 'Đen', value: 'black' },
      { label: 'Trắng', value: 'white' },
      { label: 'Xanh Navy', value: 'navy' },
      { label: 'Xám', value: 'gray' },
      { label: 'Be', value: 'beige' },
    ]
  },
  {
    id: 'price',
    title: 'Giá',
    options: [
      { label: 'Dưới 200.000đ', value: 'under-200' },
      { label: '200.000đ - 500.000đ', value: '200-500' },
      { label: 'Trên 500.000đ', value: 'over-500' },
    ]
  }
]

const FilterSidebar = () => {
  const [openGroups, setOpenGroups] = useState<string[]>(['category', 'size', 'color'])

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="flex items-center justify-between mb-8 pb-4 border-b">
        <h2 className="text-xl font-black uppercase tracking-tight">Bộ lọc</h2>
        <span className="text-xs text-gray-400 font-bold">168 kết quả</span>
      </div>

      <div className="space-y-6">
        {filterGroups.map((group) => (
          <div key={group.id} className="border-b pb-6 last:border-0">
            <button
              onClick={() => toggleGroup(group.id)}
              className="flex items-center justify-between w-full mb-4 group"
            >
              <h3 className="font-bold text-sm text-gray-800 uppercase tracking-wider group-hover:text-black transition-colors">
                {group.title}
              </h3>
              {openGroups.includes(group.id) ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {openGroups.includes(group.id) && (
              <div className="space-y-3">
                {group.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-full checked:bg-black checked:border-black transition-all cursor-pointer"
                      />
                      <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <span className="text-sm text-gray-500 group-hover:text-black transition-colors font-medium">
                      {option.label}
                    </span>
                    {option.count && (
                      <span className="text-[10px] text-gray-400 ml-auto font-bold">({option.count})</span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}

export default FilterSidebar
