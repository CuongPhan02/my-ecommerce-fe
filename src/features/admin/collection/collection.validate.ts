import { z } from 'zod'

export const collectionSchema = z.object({
  name: z.string().min(1, 'Tên là bắt buộc'),
  slug: z.string().min(1, 'Slug là bắt buộc'),
  description: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  isActive: z.boolean(),
  isHomeActive: z.boolean().optional(),
})

export type CollectionSchemaType = z.infer<typeof collectionSchema>
