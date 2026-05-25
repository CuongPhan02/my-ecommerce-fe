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

  // 1. Load initial HTML once when editor is ready
  useEffect(() => {
    if (!editor || !isFirstRender.current) return
    isFirstRender.current = false

    if (value) {
      editor.update(() => {
        // Clear current root nodes
        const root = $getRoot()
        root.clear()

        // Parse HTML to DOM
        const parser = new DOMParser()
        const dom = parser.parseFromString(value, 'text/html')
        
        // Generate Lexical nodes from DOM
        const nodes = $generateNodesFromDOM(editor, dom)
        
        // Select and insert
        root.select()
        $insertNodes(nodes)
      })
    }
  }, [editor])

  // 2. Track changes and notify parent of HTML updates
  useEffect(() => {
    if (!editor) return

    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const htmlString = $generateHtmlFromNodes(editor, null)
        onChange(htmlString)
      })
    })
  }, [editor, onChange])

  return null
}
