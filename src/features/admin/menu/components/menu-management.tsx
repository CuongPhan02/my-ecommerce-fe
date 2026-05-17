'use client'
import React, { useState } from 'react'
import { Plus, Trash2, Edit, ChevronDown, ChevronRight, Settings, LayoutGrid, Link as LinkIcon, Lock } from 'lucide-react'
import { Button } from '~/components/ui/core/button'
import { _menuService } from '../menu.query'
import { Menu, MenuType, CategoryType } from '../types'
import { Badge } from '~/components/ui/core/badge'
import HeadingSectionAdmin from '~/components/shared/heading-section-admin'
import { ScrollArea } from '~/components/ui/core/scroll-area'
import MenuFormDialog from './menu-form-dialog'

const MenuManagement = () => {
  const { data: menusData, isLoading } = _menuService.useMenus()
  const deleteMutation = _menuService.useDeleteMenu()
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [parentId, setParentId] = useState<string | null>(null)

  const menus = menusData?.result || []

  const handleAdd = (pId: string | null = null) => {
    setParentId(pId)
    setSelectedMenu(null)
    setIsFormOpen(true)
  }

  const handleEdit = (menu: Menu) => {
    setSelectedMenu(menu)
    setParentId(menu.parentId)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa menu này và tất cả menu con?')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-8'>
        <HeadingSectionAdmin title='Quản lý Menu & Điều hướng' />
        <Button onClick={() => handleAdd()} className='rounded-2xl gap-2 shadow-lg shadow-primary/20'>
          <Plus size={18} /> Thêm Menu Chính
        </Button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
        <div className='lg:col-span-8'>
          <ScrollArea className='h-[calc(100vh-250px)] rounded-3xl border bg-white p-6 shadow-sm'>
             {isLoading ? (
               <div className='flex items-center justify-center h-full text-muted-foreground'>Đang tải...</div>
             ) : (
               <div className='flex flex-col gap-2'>
                 {menus.map((menu: Menu) => (
                   <MenuItem 
                    key={menu.id} 
                    menu={menu} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                    onAddChild={handleAdd}
                  />
                 ))}
               </div>
             )}
          </ScrollArea>
        </div>

        <div className='lg:col-span-4 flex flex-col gap-6'>
           <div className='bg-white p-6 rounded-3xl border shadow-sm'>
              <h3 className='font-bold text-lg mb-4 flex items-center gap-2'>
                 <Settings size={20} className='text-primary' /> Hướng dẫn
              </h3>
              <ul className='text-sm text-muted-foreground flex flex-col gap-3'>
                 <li className='flex gap-2'>
                    <div className='w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0' />
                    <span>Bạn có thể tạo tối đa 3 cấp menu để tối ưu trải nghiệm người dùng.</span>
                 </li>
                 <li className='flex gap-2'>
                    <div className='w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0' />
                    <span><strong>Mega Menu</strong> cho phép hiển thị danh mục và bộ sưu tập dưới dạng lưới rộng.</span>
                 </li>
                 <li className='flex gap-2'>
                    <div className='w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0' />
                    <span>Menu hệ thống <Lock size={12} className='inline' /> không thể xóa nhưng có thể chỉnh sửa nội dung.</span>
                 </li>
              </ul>
           </div>
        </div>
      </div>

      <MenuFormDialog 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        selectedMenu={selectedMenu}
        parentId={parentId}
      />
    </div>
  )
}

const MenuItem = ({ 
  menu, 
  onEdit, 
  onDelete, 
  onAddChild,
  level = 0 
}: { 
  menu: Menu, 
  onEdit: (m: Menu) => void, 
  onDelete: (id: string) => void,
  onAddChild: (id: string) => void,
  level?: number 
}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = menu.children && menu.children.length > 0

  return (
    <div className='flex flex-col'>
      <div className={`
        group flex items-center justify-between p-3 rounded-2xl border border-transparent 
        hover:border-primary/20 hover:bg-primary/5 transition-all
        ${level > 0 ? 'ml-8' : 'bg-gray-50/50'}
      `}>
        <div className='flex items-center gap-3'>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-1 hover:bg-gray-200 rounded-lg transition-colors ${!hasChildren && 'invisible'}`}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          
          <div className={`p-2 rounded-xl ${menu.isMegaMenu ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
            {menu.isMegaMenu ? <LayoutGrid size={18} /> : <LinkIcon size={18} />}
          </div>

          <div className='flex flex-col'>
            <div className='flex items-center gap-2'>
              <span className='font-bold text-sm capitalize'>{menu.label}</span>
              {menu.isSystem && <Lock size={12} className='text-muted-foreground' />}
              {!menu.isActive && <Badge variant='secondary' className='text-[8px] px-1 py-0'>Hidden</Badge>}
            </div>
            <span className='text-[10px] text-muted-foreground truncate max-w-[200px]'>
              {menu.href || (menu.categoryType ? `Group: ${menu.categoryType}` : 'No link')}
            </span>
          </div>
        </div>

        <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
          <Button variant='ghost' size='sm' onClick={() => onAddChild(menu.id)} className='h-8 w-8 p-0 rounded-full text-green-600'>
            <Plus size={16} />
          </Button>
          <Button variant='ghost' size='sm' onClick={() => onEdit(menu)} className='h-8 w-8 p-0 rounded-full text-blue-600'>
            <Edit size={16} />
          </Button>
          {!menu.isSystem && (
            <Button variant='ghost' size='sm' onClick={() => onDelete(menu.id)} className='h-8 w-8 p-0 rounded-full text-red-600'>
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className='flex flex-col gap-2 mt-2'>
          {menu.children.map(child => (
            <MenuItem 
              key={child.id} 
              menu={child} 
              onEdit={onEdit} 
              onDelete={onDelete} 
              onAddChild={onAddChild}
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MenuManagement
