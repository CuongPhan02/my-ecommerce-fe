import { z } from 'zod'

export const AttributeValidate = z.object({
  name: z.string().min(1, {
    message: 'Tên thuộc tính không được để trống.',
  }),
  values: z
    .array(
      z.object({
        id: z.string().optional(),
        value: z.string().min(1, 'Giá trị không được để trống.'),
        name: z.string().optional(),
      })
    )
    .min(1, {
      message: 'Phải có ít nhất 1 giá trị cho thuộc tính này.',
    }),
})

export type AttributeSchemaType = z.infer<typeof AttributeValidate>
