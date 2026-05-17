export interface TreeNode {
  id: string
  parentId: string | null
  [key: string]: any
  children?: TreeNode[]
}

/**
 * Builds a tree structure from a flat array of items.
 * @param items Flat array of items with `id` and `parentId`
 * @returns Array of root nodes with children
 */
export function buildTree<T extends TreeNode>(items: T[]): T[] {
  const map = new Map<string, T>()
  const roots: T[] = []

  // Initialize the map with copies of items to avoid mutating originals
  // and ensure children array is initialized
  items.forEach((item) => {
    map.set(item.id, { ...item, children: [] })
  })

  map.forEach((item) => {
    if (item.parentId && map.has(item.parentId)) {
      const parent = map.get(item.parentId)
      parent?.children?.push(item)
    } else {
      roots.push(item)
    }
  })

  // Sort roots and children by displayOrder if it exists
  const sortByOrder = (a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0)
  
  const sortTree = (node: T) => {
    if (node.children && node.children.length > 0) {
      node.children.sort(sortByOrder)
      node.children.forEach((child) => sortTree(child as T))
    }
  }

  roots.sort(sortByOrder)
  roots.forEach(sortTree)

  return roots
}
