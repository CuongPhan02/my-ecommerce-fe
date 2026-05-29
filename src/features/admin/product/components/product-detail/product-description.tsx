'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import { Label } from '~/components/ui/core/label'
import { Textarea } from '~/components/ui/core/textarea'
import { ProductSchemaType } from '../../product.validate'

// Lexical imports
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { ListNode, ListItemNode } from '@lexical/list'

// Lexical custom components
import { ImageNode } from './editor/image-node'
import ToolbarPlugin from './editor/toolbar-plugin'
import HtmlPlugin from './editor/html-plugin'

const ProductDescription = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ProductSchemaType>()

  const descriptionValue = watch('description') || ''

  const handleDescriptionChange = (html: string) => {
    setValue('description', html, { shouldValidate: true })
  }

  // Lexical Editor Initial Configuration
  const initialConfig = {
    namespace: 'ProductDescriptionEditor',
    theme: {
      paragraph: 'mb-3 leading-relaxed text-gray-700 dark:text-gray-300 text-[15px]',
      text: {
        bold: 'font-bold text-gray-900 dark:text-white',
        italic: 'italic',
        underline: 'underline',
      },
      list: {
        ul: 'list-disc pl-6 mb-3 space-y-1',
        ol: 'list-decimal pl-6 mb-3 space-y-1',
        listitem: 'text-gray-700 dark:text-gray-300 text-[15px]',
      },
    },
    onError: (error: Error) => {
      console.error('Lexical Editor Error:', error)
    },
    nodes: [
      ListNode,
      ListItemNode,
      ImageNode,
    ],
  }

  return (
    <Card className='bg-muted shadow-none border border-gray-100 dark:border-gray-800' id='product-description'>
      <CardHeader>
        <CardTitle className='text-lg font-bold text-gray-800 dark:text-white'>Mô tả sản phẩm</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Tóm tắt ngắn gọn */}
        <div className='flex flex-col gap-3'>
          <Label className='font-semibold text-gray-700 dark:text-gray-200'>
            Tóm tắt <span className='text-destructive'>*</span>
          </Label>
          <Textarea
            {...register('summary')}
            placeholder='Tóm tắt ngắn gọn về sản phẩm (Ví dụ: chất liệu, form dáng, tính năng nổi bật...)'
            className='min-h-[100px] bg-white dark:bg-zinc-950 border border-gray-200 dark:border-gray-800 focus-visible:ring-1 focus-visible:ring-primary'
            aria-invalid={errors.summary && errors.summary.message ? true : false}
          />
          {errors.summary && (
            <p className='text-red-500 text-sm font-medium mt-1'>{errors.summary.message}</p>
          )}
        </div>

        {/* Trình soạn thảo văn bản giàu tính năng (Lexical Editor) */}
        <div className='flex flex-col gap-3'>
          <Label className='font-semibold text-gray-700 dark:text-gray-200'>
            Mô tả chi tiết <span className='text-destructive'>*</span>
          </Label>
          
          <div className='flex flex-col border border-gray-200 dark:border-gray-850 rounded-lg shadow-sm overflow-hidden bg-white dark:bg-zinc-950'>
            <LexicalComposer initialConfig={initialConfig}>
              <ToolbarPlugin />
              
              <div className='relative min-h-[300px] flex flex-col'>
                <RichTextPlugin
                  contentEditable={
                    <ContentEditable 
                      className='flex-1 min-h-[300px] p-5 focus:outline-none text-gray-800 dark:text-gray-200 custom-scrollbar overflow-y-auto' 
                    />
                  }
                  placeholder={
                    !descriptionValue ? (
                      <div className='absolute top-5 left-5 text-gray-400 dark:text-gray-500 pointer-events-none text-sm select-none'>
                        Nhập mô tả chi tiết sản phẩm...
                      </div>
                    ) : null
                  }
                  ErrorBoundary={LexicalErrorBoundary}
                />
                <HistoryPlugin />
                <ListPlugin />
                <HtmlPlugin 
                  value={descriptionValue} 
                  onChange={handleDescriptionChange} 
                />
              </div>
            </LexicalComposer>
          </div>

          {errors.description && (
            <p className='text-red-500 text-sm font-medium mt-1'>{errors.description.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductDescription
