import { z } from 'zod'

export const voucherSchema = z.object({
  code: z
    .string()
    .min(1, 'Mã voucher là bắt buộc')
    .max(50, 'Mã voucher không được vượt quá 50 ký tự')
    .regex(/^[A-Z0-9_-]+$/, 'Mã voucher chỉ được chứa ký tự hoa, số, gạch ngang và gạch dưới'),
  description: z.string().min(1, 'Mô tả là bắt buộc'),
  type: z.enum(['FIXED', 'PERCENTAGE', 'FREE_SHIPPING']),
  discountValue: z.coerce.number().min(1, 'Giá trị giảm phải lớn hơn 0'),
  minOrderValue: z.coerce.number().min(0, 'Giá trị đơn tối thiểu không được âm'),
  usageLimit: z.coerce.number().min(1, 'Giới hạn lượt dùng phải lớn hơn 0'),
  isActive: z.boolean().default(true),
  expirationDate: z.string().min(1, 'Hạn sử dụng là bắt buộc'),
})

export type VoucherSchemaType = z.infer<typeof voucherSchema>
