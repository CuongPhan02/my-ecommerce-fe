'use client'

import React from 'react'
import {
  DecoratorNode,
  DOMConversionMap,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical'

export type SerializedImageNode = Spread<
  {
    altText: string
    src: string
  },
  SerializedLexicalNode
>

export class ImageNode extends DecoratorNode<React.ReactNode> {
  __src: string
  __altText: string

  static getType(): string {
    return 'image'
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__key)
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src, altText } = serializedNode
    return new ImageNode(src, altText).updateFromJSON(serializedNode)
  }

  constructor(src: string, altText: string, key?: NodeKey) {
    super(key)
    this.__src = src
    this.__altText = altText
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img')
    element.setAttribute('src', this.__src)
    element.setAttribute('alt', this.__altText)
    element.style.maxWidth = '100%'
    element.style.height = 'auto'
    element.style.borderRadius = '0.5rem'
    element.style.display = 'block'
    element.style.margin = '1rem auto'
    element.className = 'editor-image rounded-lg max-w-full my-2'
    return { element }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => {
        if (node instanceof HTMLImageElement) {
          return {
            conversion: () => {
              const src = node.getAttribute('src') || ''
              const altText = node.getAttribute('alt') || ''
              return {
                node: new ImageNode(src, altText),
              }
            },
            priority: 0,
          }
        }
        return null
      },
    }
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      src: this.__src,
      altText: this.__altText,
    }
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span')
    span.className = 'inline-block my-2 w-full text-center relative group'
    return span
  }

  updateDOM(): false {
    return false
  }

  decorate(): React.ReactNode {
    return (
      <span className="relative inline-block group max-w-full my-2">
        <img
          src={this.__src}
          alt={this.__altText}
          className='max-w-full h-auto rounded-lg mx-auto border transition-all duration-300 group-hover:shadow-md'
        />
      </span>
    )
  }
}

export function $createImageNode(src: string, altText: string): ImageNode {
  return new ImageNode(src, altText)
}

export function $isImageNode(
  node: LexicalNode | null | undefined,
): node is ImageNode {
  return node instanceof ImageNode
}
