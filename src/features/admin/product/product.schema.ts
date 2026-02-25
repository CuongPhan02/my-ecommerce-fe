import { z } from 'zod'

export const ProductSchema = z.object({
  name: z.string().min(2, {
    message: 'Product name must be at least 2 characters.',
  }),
  category: z.string('Please select a category.'),
  brand: z.string('Please select a brand.'),
  unit: z.string('Please select a unit.'),
  condition: z.string('Please select a condition.'),
  tags: z.string().optional(),
})

export type ProductSchemaType = z.infer<typeof ProductSchema>
