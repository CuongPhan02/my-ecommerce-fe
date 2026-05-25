'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useQueryState, parseAsString, parseAsArrayOf, parseAsInteger } from 'nuqs'
import { cn } from '~/lib/utils'

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

  const [openGroups, setOpenGroups] = useState<string[]>(['categoryId', 'brandIds', 'collectionId', 'price', ...attributes.map(a => `attribute_${a.id}`)])

  // URL States
  const [categoryId, setCategoryId] = useQueryState('categoryId', parseAsString.withOptions({ history: 'push', shallow: false }))
  const [collectionId, setCollectionId] = useQueryState('collectionId', parseAsString.withOptions({ history: 'push', shallow: false }))
  const [brandIds, setBrandIds] = useQueryState('brandIds', parseAsArrayOf(parseAsString).withDefault([]).withOptions({ history: 'push', shallow: false }))
  const [attributeValueIds, setAttributeValueIds] = useQueryState('attributeValueIds', parseAsArrayOf(parseAsString).withDefault([]).withOptions({ history: 'push', shallow: false }))
  
  const [minPrice, setMinPrice] = useQueryState('minPrice', parseAsInteger.withOptions({ history: 'push', shallow: false }))
  const [maxPrice, setMaxPrice] = useQueryState('maxPrice', parseAsInteger.withOptions({ history: 'push', shallow: false }))

  const [localMinPrice, setLocalMinPrice] = useState<string>(minPrice?.toString() || '')
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(maxPrice?.toString() || '')

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  const handleApplyPrice = () => {
    setMinPrice(localMinPrice ? parseInt(localMinPrice, 10) : null)
    setMaxPrice(localMaxPrice ? parseInt(localMaxPrice, 10) : null)
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
    <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] overflow-y-auto pr-4 pb-10 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
      <div className="flex items-center justify-between mb-8 pb-4 border-b">
        <h2 className="text-xl font-black uppercase tracking-tight">Bộ lọc</h2>
      </div>

      <div className="space-y-6">
        {filterGroups.map((group) => (
          <div key={group.id} className="border-b pb-6 last:border-0">
            <button
              onClick={() => toggleGroup(group.id)}
              className="flex items-center justify-between w-full mb-4 group outline-none"
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
                          className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-full checked:bg-black checked:border-black transition-all cursor-pointer"
                        />
                        <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                      <span className={cn(
                        "text-sm group-hover:text-black transition-colors font-medium",
                        isChecked ? "text-black" : "text-gray-500"
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
        ))}

        {/* Price Range Filter */}
        <div className="border-b pb-6 last:border-0">
          <button
            onClick={() => toggleGroup('price')}
            className="flex items-center justify-between w-full mb-4 group outline-none"
          >
            <h3 className="font-bold text-sm text-gray-800 uppercase tracking-wider group-hover:text-black transition-colors">
              Giá
            </h3>
            {openGroups.includes('price') ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          
          {openGroups.includes('price') && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Từ"
                  value={localMinPrice}
                  onChange={(e) => setLocalMinPrice(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-black transition-colors"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Đến"
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-black transition-colors"
                />
              </div>
              <button
                onClick={handleApplyPrice}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-black text-sm font-bold rounded-lg transition-colors"
              >
                Áp dụng
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default FilterSidebar

