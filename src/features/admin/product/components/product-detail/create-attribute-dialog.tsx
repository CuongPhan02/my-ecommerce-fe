'use client'

import React, { useState } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import { Badge } from '~/components/ui/core/badge'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/core/dialog'
import { _attributeService } from '../../attribute.query'

interface CreateAttributeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (attributeName: string) => void
}

export function CreateAttributeDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateAttributeDialogProps) {
  const [name, setName] = useState('')
  const [valueInput, setValueInput] = useState('')
  const [values, setValues] = useState<string[]>([])
  
  const createMutation = _attributeService.useCreateAttribute()

  const handleAddValue = () => {
    const trimmed = valueInput.trim()
    if (!trimmed) return
    
    // Support bulk adding using comma, semicolon or newline
    const newVals = trimmed
      .split(/[,\n;]+/)
      .map((v) => v.trim())
      .filter((v) => v.length > 0 && !values.includes(v))

    if (newVals.length > 0) {
      setValues([...values, ...newVals])
    }
    setValueInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddValue()
    }
  }

  const handleRemoveValue = (valToRemove: string) => {
    setValues(values.filter((v) => v !== valToRemove))
  }

  const handleSave = async () => {
    if (!name.trim()) return
    if (values.length === 0) return

    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        values,
      })
      onSuccess?.(name.trim())
      onOpenChange(false)
      // Reset form fields
      setName('')
      setValues([])
      setValueInput('')
    } catch (err) {
      console.error('Failed to create attribute:', err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-6 rounded-2xl border shadow-2xl bg-background">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            Tạo thuộc tính mới
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Tên thuộc tính */}
          <div className="space-y-2">
            <Label htmlFor="attr-name" className="text-sm font-semibold">
              Tên thuộc tính <span className="text-red-500">*</span>
            </Label>
            <Input
              id="attr-name"
              placeholder="Ví dụ: Màu sắc, Kích thước, Dung lượng..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white dark:bg-muted/50"
              autoFocus
            />
          </div>

          {/* Nhập các giá trị */}
          <div className="space-y-2">
            <Label htmlFor="attr-values" className="text-sm font-semibold">
              Giá trị thuộc tính <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="attr-values"
                placeholder="Nhập giá trị và nhấn Enter (hoặc phân tách bằng dấu phẩy)..."
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-white dark:bg-muted/50"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddValue}
                className="shrink-0 px-3 bg-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Gợi ý: Bạn có thể nhập nhiều giá trị phân tách bằng dấu phẩy, dấu chấm phẩy hoặc phím Enter.
            </p>
          </div>

          {/* Danh sách các giá trị đã thêm */}
          {values.length > 0 && (
            <div className="space-y-2 pt-1">
              <Label className="text-xs text-muted-foreground font-semibold">
                Các giá trị đã thêm ({values.length}):
              </Label>
              <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto p-3 rounded-lg border bg-muted/40 custom-scrollbar">
                {values.map((val) => (
                  <Badge
                    key={val}
                    variant="secondary"
                    className="flex items-center gap-1.5 py-1 px-2.5 text-xs bg-white border font-medium shadow-xs"
                  >
                    <span>{val}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveValue(val)}
                      className="text-muted-foreground hover:text-red-500 rounded-full transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 border-t flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 w-full bg-white"
            disabled={createMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="flex-1 w-full"
            disabled={!name.trim() || values.length === 0 || createMutation.isPending}
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              'Lưu thuộc tính'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
