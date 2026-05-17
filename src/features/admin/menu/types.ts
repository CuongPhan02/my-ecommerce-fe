export type MenuType = 'MAIN_LINK' | 'SUB_LINK' | 'CUSTOM_LINK'
export type CategoryType = 'CATEGORY_GROUP' | 'COLLECTION_GROUP' | 'BRAND_GROUP' | null

export interface MegaMenuConfig {
  categories?: { id: string; name: string; slug: string; parentId: string | null }[]
  collections?: { id: string; name: string; slug: string; description: string | null; imageUrl: string | null; isActive: boolean; createdAt: string; updatedAt: string }[]
  attributes?: { id: string; name: string; values: any[] }[]
}

export interface Menu {
  id: string
  type: MenuType
  label: string
  href: string | null
  categoryType: CategoryType
  displayOrder: number
  parentId: string | null
  metadata: any | null
  isActive: boolean
  isSystem: boolean
  isMegaMenu: boolean
  createdAt: string
  updatedAt: string
  children: Menu[]
  megaMenu: MegaMenuConfig | null
}

export interface MenuInput {
  type: MenuType
  label: string
  href: string | null
  categoryType: CategoryType
  displayOrder: number
  parentId: string | null
  metadata: any | null
  isActive: boolean
  isMegaMenu?: boolean
  megaMenu?: MegaMenuConfig | null
}
