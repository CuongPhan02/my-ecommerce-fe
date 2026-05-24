import { z } from 'zod'

const preprocessNumber = z.preprocess(
  (val) => {
    if (val === '' || val === undefined || val === null) return 0
    const parsed = Number(val)
    return isNaN(parsed) ? 0 : parsed
  },
  z.number().default(0)
)

export const ProductValidate = z.object({
  name: z.string().min(2, {
    message: 'Tên sản phẩm phải có ít nhất 2 ký tự.',
  }),
  description: z
    .string()
    .min(10, {
      message: 'Mô tả phải có ít nhất 10 ký tự.',
    })
    .optional(),
  slug: z.string().refine((value) => value !== '', {
    message: 'Đường dẫn (Slug) là bắt buộc',
  }),
  categoryId: z.string().refine((value) => value !== '', {
    message: 'Danh mục là bắt buộc',
  }),
  brandId: z.string().refine((value) => value !== '', {
    message: 'Thương hiệu là bắt buộc',
  }),
  type: z.enum(['SINGLE', 'VARIANT']).default('SINGLE'),
  summary: z.string().optional(),
  tags: z.array(z.string()).optional(),
  thumbnailId: z.string().nullable().optional(),
  isFeatured: z.boolean().default(false),
  isRefunded: z.boolean().default(false),
  hasWarranty: z.boolean().default(false),
  disableShipping: z.boolean().default(false),
  stock: preprocessNumber.optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaImageId: z.string().nullable().optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']).default('PERCENTAGE'),
  discountValue: preprocessNumber.optional(),
  discountStartDate: z.string().nullable().optional(),
  discountEndDate: z.string().nullable().optional(),
  mediaIds: z.array(z.string()).optional(),
  collectionIds: z.array(z.string()).optional(),
  // UI ONLY
  options: z
    .array(
      z.object({
        name: z.string(),
        values: z.array(z.string()),
      }),
    )
    .optional(),
  thumbnail: z.any().optional(),
  media: z.array(z.any()).optional(),
  metaImage: z.any().optional(),
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        sku: z.string(),
        price: preprocessNumber,
        stock: preprocessNumber,
        purchasePrice: preprocessNumber,
        attributes: z.array(
          z.object({
            name: z.string(),
            value: z.string(),
          }),
        ),
      }),
    )
    .optional(),
  unit: z.string().optional(),
  condition: z.string().optional(),
})

export type ProductSchemaType = z.infer<typeof ProductValidate>
