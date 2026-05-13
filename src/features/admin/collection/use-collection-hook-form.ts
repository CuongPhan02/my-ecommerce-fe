'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { collectionSchema, CollectionSchemaType } from './collection.validate'

export const useCollectionHookForm = () => {
  return useForm<CollectionSchemaType>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: null,
      imageUrl: null,
      isActive: true,
    },
  })
}
