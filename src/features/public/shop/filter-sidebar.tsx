'use client'

import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, SlidersHorizontal, Truck, RotateCcw } from 'lucide-react'
import { useQueryState, parseAsString, parseAsArrayOf, parseAsInteger } from 'nuqs'
import { cn } from '~/lib/utils'
import RangeSlider from '~/components/ui/core/range-slider'

interface FilterOption {
  label: string
  value: string
  count?: number
}

interface FilterGroup {
  id: string
  title: string
  options: FilterOption[]
}

interface FilterSidebarProps {
  categories?: { id: string; name: string }[]
  brands?: { id: string; name: string }[]
  collections?: { id: string; name: string }[]
  attributes?: { id: string; name: string; values: { id: string; value: string; name?: string | null }[] }[]
}

const colorHexMap: Record<string, string> = {
  'Trắng': '#FFFFFF',
  'Đen': '#000000',
  'Be': '#F5EFE6',
  'Kem': '#FFFDD0',
  'Xám': '#9E9E9E',
  'Nâu': '#8B4513',
  'Hồng': '#FFC0CB',
  'Xanh rêu': '#556B2F',
  'Xanh lá': '#4CAF50',
  'Xanh dương': '#2196F3',
  'Xanh biển': '#03A9F4',
  'Cam': '#FF9800',
  'Đỏ': '#F44336',
  'Vàng': '#FFEB3B',
  'white': '#FFFFFF',
  'black': '#000000',
  'beige': '#F5EFE6',
  'cream': '#FFFDD0',
  'grey': '#9E9E9E',
  'gray': '#9E9E9E',
  'brown': '#8B4513',
  'pink': '#FFC0CB',
  'sage': '#8F9779',
  'green': '#4CAF50',
  'blue': '#2196F3',
  'orange': '#FF9800',
  'red': '#F44336',
  'yellow': '#FFEB3B',
}

const FilterSidebar = ({
  categories = [],
  brands = [],
  collections = [],
  attributes = [],
}: FilterSidebarProps) => {
  // Construct dynamic filter groups
  const filterGroups: FilterGroup[] = []

  if (categories.length > 0) {
    filterGroups.push({
      id: 'categoryId',
      title: 'Danh mục',
      options: categories.map((c) => ({ label: c.name, value: c.id })),
    })
  }

  if (collections.length > 0) {
    filterGroups.push({
      id: 'collectionId',
      title: 'Bộ sưu tập',
      options: collections.map((c) => ({ label: c.name, value: c.id })),
    })
  }

  if (brands.length > 0) {
    filterGroups.push({
      id: 'brandIds',
      title: 'Thương hiệu',
      options: brands.map((b) => ({ label: b.name, value: b.id })),
    })
  }

  attributes.forEach((attr) => {
    if (attr.values.length > 0) {
      filterGroups.push({
        id: `attribute_${attr.id}`,
        title: attr.name,
        options: attr.values.map((v) => ({ label: v.name || v.value, value: v.id })),
      })
    }
  })

  const [openGroups, setOpenGroups] = useState<string[]>([
    'categoryId',
    'brandIds',
    'collectionId',
    'price',
    ...attributes.map(a => `attribute_${a.id}`)
  ])

  // URL States
  const [categoryId, setCategoryId] = useQueryState('categoryId', parseAsString.withOptions({ history: 'push', shallow: false }))
  const [collectionId, setCollectionId] = useQueryState('collectionId', parseAsString.withOptions({ history: 'push', shallow: false }))
  const [brandIds, setBrandIds] = useQueryState('brandIds', parseAsArrayOf(parseAsString).withDefault([]).withOptions({ history: 'push', shallow: false }))
  const [attributeValueIds, setAttributeValueIds] = useQueryState('attributeValueIds', parseAsArrayOf(parseAsString).withDefault([]).withOptions({ history: 'push', shallow: false }))
  
  const [minPrice, setMinPrice] = useQueryState('minPrice', parseAsInteger.withOptions({ history: 'push', shallow: false }))
  const [maxPrice, setMaxPrice] = useQueryState('maxPrice', parseAsInteger.withOptions({ history: 'push', shallow: false }))

  // Reusable price range state
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice || 0,
    maxPrice || 3000000,
  ])

  // Sync range with URL parameters
  useEffect(() => {
    setPriceRange([minPrice || 0, maxPrice || 3000000])
  }, [minPrice, maxPrice])

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  const handleApplyPrice = () => {
    setMinPrice(priceRange[0] > 0 ? priceRange[0] : null)
    setMaxPrice(priceRange[1] < 3000000 ? priceRange[1] : null)
  }

  const handleCheckboxChange = (groupId: string, value: string, isChecked: boolean) => {
    if (groupId === 'categoryId') {
      setCategoryId(isChecked ? null : value)
    } else if (groupId === 'collectionId') {
      setCollectionId(isChecked ? null : value)
    } else if (groupId === 'brandIds') {
      if (isChecked) {
        setBrandIds(brandIds.filter(id => id !== value) || null)
      } else {
        setBrandIds([...brandIds, value])
      }
    } else if (groupId.startsWith('attribute_')) {
      if (isChecked) {
        setAttributeValueIds(attributeValueIds.filter(id => id !== value) || null)
      } else {
        setAttributeValueIds([...attributeValueIds, value])
      }
    }
  }

  const isOptionChecked = (groupId: string, value: string) => {
    if (groupId === 'categoryId') return categoryId === value
    if (groupId === 'collectionId') return collectionId === value
    if (groupId === 'brandIds') return brandIds.includes(value)
    if (groupId.startsWith('attribute_')) return attributeValueIds.includes(value)
    return false
  }

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] overflow-y-auto pr-4 pb-10 scrollbar-none no-scrollbar">
      
      {/* Title */}
      <div className="flex items-center gap-2 mb-8 pb-4 border-b border-neutral-100">
        <SlidersHorizontal className="w-4 h-4 text-black stroke-[1.8]" />
        <h2 className="text-[12px] font-black uppercase tracking-widest text-black">Bộ lọc</h2>
      </div>

      <div className="space-y-6">
        {filterGroups.map((group) => (
          <div key={group.id} className="border-b border-neutral-100 pb-6 last:border-0">
            <button
              onClick={() => toggleGroup(group.id)}
              className="flex items-center justify-between w-full mb-4 group outline-none"
            >
              <h3 className="font-black text-[11px] text-[#231f20] uppercase tracking-widest group-hover:text-black transition-colors">
                {group.title}
              </h3>
              {openGroups.includes(group.id) ? (
                <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              )}
            </button>

            {openGroups.includes(group.id) && (
              <div className="space-y-3">
                {/* 1. Render colors dynamically as circles */}
                {group.title.toLowerCase().includes('màu') ? (
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {group.options.map((option) => {
                      const isChecked = isOptionChecked(group.id, option.value)
                      const hex = colorHexMap[option.label] || option.label || '#E5E7EB'
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleCheckboxChange(group.id, option.value, isChecked)}
                          className={cn(
                            "w-6 h-6 rounded-full border border-neutral-200 transition-all cursor-pointer relative flex items-center justify-center hover:scale-110",
                            isChecked && "ring-1 ring-black ring-offset-2"
                          )}
                          style={{ backgroundColor: hex }}
                          title={option.label}
                          type="button"
                        />
                      )
                    })}
                  </div>
                ) : (group.title.toLowerCase().includes('kích thước') || group.title.toLowerCase().includes('size')) ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {group.options.map((option) => {
                      const isChecked = isOptionChecked(group.id, option.value)
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleCheckboxChange(group.id, option.value, isChecked)}
                          className={cn(
                            "h-8 px-3 border text-[10px] font-bold tracking-wider uppercase transition-all flex items-center justify-center min-w-[36px]",
                            isChecked 
                              ? "border-black bg-black text-white" 
                              : "border-neutral-200 bg-white text-neutral-600 hover:border-black"
                          )}
                          type="button"
                        >
                          {option.label}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {group.options.map((option) => {
                      const isChecked = isOptionChecked(group.id, option.value)

                      return (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="relative flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleCheckboxChange(group.id, option.value, isChecked)}
                              className="peer appearance-none w-4 h-4 border-2 border-neutral-200 rounded-none checked:bg-black checked:border-black transition-all cursor-pointer"
                            />
                            <div className="absolute w-1.5 h-1.5 bg-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                          </div>
                          <span className={cn(
                            "text-xs group-hover:text-black transition-colors font-medium",
                            isChecked ? "text-black font-semibold" : "text-neutral-500"
                          )}>
                            {option.label}
                          </span>
                          {option.count && (
                            <span className="text-[10px] text-gray-400 ml-auto font-bold">({option.count})</span>
                          )}
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Price Range Filter */}
        <div className="border-b border-neutral-100 pb-6 last:border-0">
          <button
            onClick={() => toggleGroup('price')}
            className="flex items-center justify-between w-full mb-4 group outline-none"
          >
            <h3 className="font-black text-[11px] text-[#231f20] uppercase tracking-widest group-hover:text-black transition-colors">
              Khoảng giá
            </h3>
            {openGroups.includes('price') ? (
              <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            )}
          </button>
          
          {openGroups.includes('price') && (
            <div className="space-y-4 pt-1">
              <RangeSlider
                min={0}
                max={3000000}
                value={priceRange}
                onChange={setPriceRange}
                step={50000}
              />
              
              <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500 pt-1">
                <span>{priceRange[0].toLocaleString('vi-VN')}đ</span>
                <span>{priceRange[1].toLocaleString('vi-VN')}đ</span>
              </div>

              <button
                onClick={handleApplyPrice}
                className="w-full py-3 bg-black hover:bg-neutral-800 text-white text-[11px] font-black uppercase tracking-widest transition-colors mt-2"
              >
                Áp dụng
              </button>
            </div>
          )}
        </div>

        {/* Brand Benefit Badges inside sidebar */}
        <div className="space-y-3 pt-6 border-t border-neutral-100">
          <div className="flex items-center gap-3.5 bg-[#FBF8F3] p-4 border border-neutral-200/35">
            <Truck className="w-5 h-5 text-neutral-600 stroke-[1.2]" />
            <div className="text-left space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-wider text-black">Miễn phí vận chuyển</p>
              <p className="text-[9px] font-semibold text-neutral-500">cho đơn hàng từ 800.000đ</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 bg-[#FBF8F3] p-4 border border-neutral-200/35">
            <RotateCcw className="w-5 h-5 text-neutral-600 stroke-[1.2]" />
            <div className="text-left space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-wider text-black">Đổi trả dễ dàng</p>
              <p className="text-[9px] font-semibold text-neutral-500">trong vòng 7 ngày</p>
            </div>
          </div>
        </div>

      </div>
    </aside>
  )
}

export default FilterSidebar
