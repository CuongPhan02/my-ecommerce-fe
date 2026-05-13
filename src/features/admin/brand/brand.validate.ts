import { z } from 'zod'

export const brandSchema = z.object({
  name: z.string().min(1, 'Tên là bắt buộc'),
  slug: z.string().min(1, 'Slug là bắt buộc'),
  logoUrl: z.string().nullable().default(null),
  isActive: z.boolean().default(true),
})

export type BrandSchemaType = z.infer<typeof brandSchema>
