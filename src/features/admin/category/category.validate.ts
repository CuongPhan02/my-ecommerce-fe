import z from 'zod'

export const categorySchema = z.object({
  name: z.string().min(2, {
    message: 'Tên danh mục phải có ít nhất 2 ký tự.',
  }),
  slug: z.string().min(2, {
    message: 'Slug phải có ít nhất 2 ký tự.',
  }),
  parentId: z.string().optional().nullable(),
})

export type CategorySchemaType = z.infer<typeof categorySchema>
