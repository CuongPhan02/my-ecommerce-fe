import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/core/card'
import { Switch } from '~/components/ui/core/switch'
import { Label } from '~/components/ui/core/label'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/core/table'
import { Truck, Plus, Trash, Edit2, Check, X } from 'lucide-react'
import { _settingsService } from '../settings.query'
import { ShippingMethod } from '../types'

export function ShippingSettings() {
  const { data: configData } = _settingsService.useShippingConfig()
  const updateConfigMutation = _settingsService.useUpdateShippingConfig()

  const { data: methodsData } = _settingsService.useShippingMethods()
  const createMethodMutation = _settingsService.useCreateShippingMethod()
  const updateMethodMutation = _settingsService.useUpdateShippingMethod()
  const deleteMethodMutation = _settingsService.useDeleteShippingMethod()

  const [enableShipping, setEnableShipping] = useState(false)
  const [methods, setMethods] = useState<ShippingMethod[]>([])
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<ShippingMethod>>({})

  useEffect(() => {
    if (configData?.result) {
      setEnableShipping(configData.result.enableShipping)
    }
  }, [configData])

  useEffect(() => {
    if (methodsData?.result) {
      setMethods(methodsData.result)
    }
  }, [methodsData])

  const handleConfigChange = (checked: boolean) => {
    setEnableShipping(checked)
    updateConfigMutation.mutate({ enableShipping: checked })
  }

  const handleAddMethod = () => {
    createMethodMutation.mutate({
      name: 'Phương thức mới',
      fee: 0,
      estimatedDays: '1-3 ngày',
      isActive: true,
    })
  }

  const handleEdit = (method: ShippingMethod) => {
    setEditingId(method.id)
    setEditForm({
      name: method.name,
      fee: method.fee,
      estimatedDays: method.estimatedDays,
      isActive: method.isActive,
    })
  }

  const handleSaveEdit = async () => {
    if (!editingId) return
    await updateMethodMutation.mutateAsync({ id: editingId, data: editForm })
    setEditingId(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa phương thức vận chuyển này?')) {
      deleteMethodMutation.mutate(id)
    }
  }

  const handleToggleActive = (method: ShippingMethod, checked: boolean) => {
    updateMethodMutation.mutate({ id: method.id, data: { isActive: checked } })
  }

  return (
    <div className='space-y-6'>
      <Card className='rounded-3xl border border-gray-100 shadow-sm'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Truck className='h-5 w-5 text-primary' /> Cấu hình vận chuyển
          </CardTitle>
          <CardDescription>Bật/tắt tính năng tính phí vận chuyển khi khách đặt hàng.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between rounded-2xl border p-4 bg-gray-50/50'>
            <div className='space-y-0.5'>
              <Label className='text-base font-bold'>Kích hoạt tính phí vận chuyển</Label>
              <p className='text-muted-foreground text-xs'>
                Nếu tắt, tất cả đơn hàng sẽ được miễn phí vận chuyển.
              </p>
            </div>
            <Switch 
              checked={enableShipping}
              onCheckedChange={handleConfigChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card className='rounded-3xl border border-gray-100 shadow-sm'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle>Phương thức vận chuyển</CardTitle>
            <CardDescription>Quản lý các loại phí giao hàng theo đơn vị vận chuyển.</CardDescription>
          </div>
          <Button onClick={handleAddMethod} className='rounded-xl' size='sm'>
            <Plus className='h-4 w-4 mr-2' /> Thêm mới
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên phương thức</TableHead>
                <TableHead>Phí (VNĐ)</TableHead>
                <TableHead>Thời gian dự kiến</TableHead>
                <TableHead>Hoạt động</TableHead>
                <TableHead className='text-right'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {methods.map((method) => (
                <TableRow key={method.id}>
                  <TableCell>
                    {editingId === method.id ? (
                      <Input 
                        value={editForm.name} 
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className='h-8 rounded-lg'
                      />
                    ) : (
                      method.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === method.id ? (
                      <Input 
                        type='number'
                        value={editForm.fee} 
                        onChange={(e) => setEditForm({ ...editForm, fee: Number(e.target.value) })}
                        className='h-8 rounded-lg'
                      />
                    ) : (
                      method.fee.toLocaleString('vi-VN')
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === method.id ? (
                      <Input 
                        value={editForm.estimatedDays || ''} 
                        onChange={(e) => setEditForm({ ...editForm, estimatedDays: e.target.value })}
                        className='h-8 rounded-lg'
                      />
                    ) : (
                      method.estimatedDays || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId !== method.id && (
                      <Switch 
                        checked={method.isActive}
                        onCheckedChange={(c) => handleToggleActive(method, c)}
                      />
                    )}
                  </TableCell>
                  <TableCell className='text-right'>
                    {editingId === method.id ? (
                      <div className='flex justify-end gap-2'>
                        <Button variant='ghost' size='icon' onClick={handleSaveEdit} className='h-8 w-8 text-green-600'>
                          <Check className='h-4 w-4' />
                        </Button>
                        <Button variant='ghost' size='icon' onClick={handleCancelEdit} className='h-8 w-8 text-gray-500'>
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    ) : (
                      <div className='flex justify-end gap-2'>
                        <Button variant='ghost' size='icon' onClick={() => handleEdit(method)} className='h-8 w-8 text-blue-600'>
                          <Edit2 className='h-4 w-4' />
                        </Button>
                        <Button variant='ghost' size='icon' onClick={() => handleDelete(method.id)} className='h-8 w-8 text-red-600'>
                          <Trash className='h-4 w-4' />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {methods.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className='text-center text-muted-foreground py-8'>
                    Chưa có phương thức vận chuyển nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
