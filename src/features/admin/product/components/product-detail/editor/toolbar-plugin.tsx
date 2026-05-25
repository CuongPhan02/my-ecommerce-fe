'use client'

import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { mergeRegister } from '@lexical/utils'
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  $insertNodes,
} from 'lexical'
import {
  $getNearestNodeOfType,
} from '@lexical/utils'
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from '@lexical/list'
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Image,
  Undo,
  Redo,
} from 'lucide-react'
import { Button } from '~/components/ui/core/button'
import { MediaPickerModal } from '~/features/admin/media/components'
import { MediaItem } from '~/features/admin/media/types'
import { $createImageNode } from './image-node'

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isList, setIsList] = useState(false)
  const [isOrderedList, setIsOrderedList] = useState(false)

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))

      const anchorNode = selection.anchor.getNode()
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow()
      const parent = element.getParent()
      
      if ($isListNode(parent)) {
        const listType = parent.getListType()
        setIsList(listType === 'bullet')
        setIsOrderedList(listType === 'number')
      } else {
        setIsList(false)
        setIsOrderedList(false)
      }
    }
  }, [])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar()
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
    )
  }, [editor, $updateToolbar])

  const formatBulletList = () => {
    if (!isList) {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
  }

  const formatNumberedList = () => {
    if (!isOrderedList) {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
  }

  const handleSelectImages = (items: MediaItem[]) => {
    if (items.length > 0) {
      editor.update(() => {
        items.forEach((item) => {
          const imageNode = $createImageNode(item.url, item.altText || '')
          $insertNodes([imageNode])
        })
      })
    }
  }

  return (
    <div className='flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 dark:bg-muted/50 dark:border-gray-800 rounded-t-lg sticky top-0 z-10'>
      {/* History */}
      <Button
        type='button'
        variant='ghost'
        size='icon'
        disabled={!canUndo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        className='h-8 w-8 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
        title='Hoàn tác'
      >
        <Undo className='h-4 w-4' />
      </Button>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        disabled={!canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        className='h-8 w-8 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
        title='Làm lại'
      >
        <Redo className='h-4 w-4' />
      </Button>

      <div className='h-4 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1' />

      {/* Formatting */}
      <Button
        type='button'
        variant={isBold ? 'secondary' : 'ghost'}
        size='icon'
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        className={`h-8 w-8 ${
          isBold
            ? 'bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground'
            : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
        }`}
        title='Chữ đậm'
      >
        <Bold className='h-4 w-4' />
      </Button>
      <Button
        type='button'
        variant={isItalic ? 'secondary' : 'ghost'}
        size='icon'
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        className={`h-8 w-8 ${
          isItalic
            ? 'bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground'
            : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
        }`}
        title='Chữ nghiêng'
      >
        <Italic className='h-4 w-4' />
      </Button>
      <Button
        type='button'
        variant={isUnderline ? 'secondary' : 'ghost'}
        size='icon'
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        className={`h-8 w-8 ${
          isUnderline
            ? 'bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground'
            : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
        }`}
        title='Gạch chân'
      >
        <Underline className='h-4 w-4' />
      </Button>

      <div className='h-4 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1' />

      {/* Lists */}
      <Button
        type='button'
        variant={isList ? 'secondary' : 'ghost'}
        size='icon'
        onClick={formatBulletList}
        className={`h-8 w-8 ${
          isList
            ? 'bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground'
            : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
        }`}
        title='Danh sách không thứ tự'
      >
        <List className='h-4 w-4' />
      </Button>
      <Button
        type='button'
        variant={isOrderedList ? 'secondary' : 'ghost'}
        size='icon'
        onClick={formatNumberedList}
        className={`h-8 w-8 ${
          isOrderedList
            ? 'bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground'
            : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
        }`}
        title='Danh sách có thứ tự'
      >
        <ListOrdered className='h-4 w-4' />
      </Button>

      <div className='h-4 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1' />

      {/* Alignments */}
      <Button
        type='button'
        variant='ghost'
        size='icon'
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
        className='h-8 w-8 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
        title='Căn lề trái'
      >
        <AlignLeft className='h-4 w-4' />
      </Button>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
        className='h-8 w-8 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
        title='Căn giữa'
      >
        <AlignCenter className='h-4 w-4' />
      </Button>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
        className='h-8 w-8 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
        title='Căn lề phải'
      >
        <AlignRight className='h-4 w-4' />
      </Button>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
        className='h-8 w-8 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
        title='Căn đều hai bên'
      >
        <AlignJustify className='h-4 w-4' />
      </Button>

      <div className='h-4 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1' />

      {/* Media Image Integration */}
      <MediaPickerModal
        multiple
        onSelect={handleSelectImages}
        trigger={
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='h-8 w-8 text-primary hover:text-primary-foreground hover:bg-primary/20 dark:text-primary-foreground'
            title='Chèn hình ảnh từ Media Server'
          >
            <Image className='h-4 w-4' />
          </Button>
        }
      />
    </div>
  )
}
