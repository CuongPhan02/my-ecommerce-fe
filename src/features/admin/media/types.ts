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

export interface MediaItem {
  id: string
  fileName: string
  url: string
  fileType: FileType
  size: string
  altText: string
  createdAt: string
  updatedAt: string
  folderId: string
  fileId: string
  folder: {
    id: string
    name: string
    parentId: string | null
  }
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
  ids: string[]
}

export const FILE_TYPE = ['IMAGE', 'VIDEO', 'DOCUMENT', 'OTHER'] as const
export type FileType = (typeof FILE_TYPE)[number]

export type DisplayItem = {
  clientId?: string
  preview?: string
  fileId: string
  altText: string
  url?: string
  id?: string
  mediaType?: FileType
}
