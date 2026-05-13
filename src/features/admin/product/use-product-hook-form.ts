import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ProductSchemaType, ProductValidate } from './product.validate'

export function useProductHookForm(defaultValues?: Partial<ProductSchemaType>) {
  return useForm<ProductSchemaType>({
    resolver: zodResolver(ProductValidate) as any,
    defaultValues: {
      type: 'SINGLE',
      isFeatured: false,
      isRefunded: false,
      hasWarranty: false,
      disableShipping: false,
      categoryId: undefined,
      brandId: undefined,
      discountType: undefined,
      collectionIds: [],
      mediaIds: [],
      tags: [],
      variants: [],
      ...defaultValues,
    },
  })
}
