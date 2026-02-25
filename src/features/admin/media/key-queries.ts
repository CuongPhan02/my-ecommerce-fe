export const mediaKeys = {
  folder: ['folder'] as const,
  fileList: (params?: { folderId?: string; page?: number; limit?: number }) =>
    ['media', 'fileList', params] as const,
  lists: (filters: any) => [...mediaKeys.folder, 'list', filters] as const,
  details: (id: string) => [...mediaKeys.folder, 'detail', id] as const,
}

export const userKeys = {
  all: ['users'] as const,
  lists: (filters: any) => [...userKeys.all, 'list', filters] as const,
  details: (id: string) => [...userKeys.all, 'detail', id] as const,
}
