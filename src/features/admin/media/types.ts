export interface FolderType {
  id: string
  name: string
  parentId: string | null
}

export interface FolderInputType {
  name: string
  parentId: string | null
}

export interface FolderUpdateType {
  id: string
  name: string
}

export interface FolderDeleteType {
  id: string
}

export interface MediaFileQuery {
  folderId?: string
  page?: number
  limit?: number
}

export interface MediaFileQuery {
  folderId?: string
  page?: number
  limit?: number
}

export interface MediaItem {
  id: string
  fileName: string
  url: string
  fileType: string
  size: string
  altText: string
  createdAt: string
  updatedAt: string
  folderId: string
  fileId: string
}

export interface MediaFileQueryResponse {
  items: MediaItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type FileItem = {
  file: File
  id: string
  preview: string
}

export interface MediaFileDelete {
  Ids: string[]
}
