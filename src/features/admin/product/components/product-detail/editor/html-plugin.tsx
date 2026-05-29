'use client'

import { useEffect, useRef } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html'
import { $getRoot, $insertNodes } from 'lexical'

interface HtmlPluginProps {
  value: string
  onChange: (html: string) => void
}

export default function HtmlPlugin({ value, onChange }: HtmlPluginProps) {
  const [editor] = useLexicalComposerContext()
  const isFirstRender = useRef(true)
  const lastValueRef = useRef(value)

  // 1. Load initial HTML or handle external value reset/change
  useEffect(() => {
    if (!editor) return

    // If it's first render or the value changed externally (e.g., form reset or loading a new product)
    if (isFirstRender.current || value !== lastValueRef.current) {
      isFirstRender.current = false
      lastValueRef.current = value

      editor.update(() => {
        const root = $getRoot()
        root.clear()

        if (value) {
          const parser = new DOMParser()
          const dom = parser.parseFromString(value, 'text/html')
          const nodes = $generateNodesFromDOM(editor, dom)
          root.select()
          $insertNodes(nodes)
        }
      })
    }
  }, [editor, value])

  // 2. Track changes and notify parent of HTML updates
  useEffect(() => {
    if (!editor) return

    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const htmlString = $generateHtmlFromNodes(editor, null)
        if (htmlString !== lastValueRef.current) {
          lastValueRef.current = htmlString
          onChange(htmlString)
        }
      })
    })
  }, [editor, onChange])

  return null
}
