'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/core/dialog'
import { Button } from '~/components/ui/core/button'
import { AlertTriangle, Info } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
  isLoading?: boolean
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'default',
  isLoading = false,
}: ConfirmModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-8'>
        <DialogHeader className='flex flex-col items-center justify-center text-center gap-4'>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            variant === 'destructive' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
          }`}>
            {variant === 'destructive' ? (
              <AlertTriangle className='w-8 h-8' />
            ) : (
              <Info className='w-8 h-8' />
            )}
          </div>
          <div className='space-y-2'>
            <DialogTitle className='text-xl font-black uppercase tracking-tight'>
              {title}
            </DialogTitle>
            <DialogDescription className='text-sm font-medium text-gray-500 leading-relaxed'>
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className='flex flex-col sm:flex-row gap-3 pt-6'>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={isLoading}
            className='flex-1 py-6 rounded-2xl font-black text-[10px] uppercase tracking-widest border-gray-100 hover:bg-gray-50'
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={() => {
              onConfirm()
              onClose()
            }}
            disabled={isLoading}
            className={`flex-1 py-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg ${
              variant === 'destructive' 
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
                : 'bg-black hover:bg-primary shadow-black/5'
            }`}
          >
            {isLoading ? 'Đang xử lý...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
