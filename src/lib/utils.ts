import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomId(length = 6) {
  return Math.random().toString(36).substring(2, 2 + length)
}

export function generateSlug(text: string, randomId?: string) {
  const baseSlug = text
    .toLowerCase()
    .normalize('NFD') // Chuẩn hóa Unicode
    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu tiếng Việt
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '') // Xóa ký tự đặc biệt
    .replace(/(\s+)/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, '-') // Gom nhiều dấu gạch ngang thành 1
    .replace(/^-+|-+$/g, '') // Xóa dấu gạch ngang ở đầu và cuối

  if (!baseSlug) return ''

  return randomId ? `${baseSlug}-${randomId}` : baseSlug
}
