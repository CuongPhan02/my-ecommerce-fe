import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  FileItem,
  FolderInputType,
  FolderUpdateType,
  MediaFileDelete,
  MediaFileQuery,
} from './types'

import { _mediaApi } from './media.api'

export const MEDIA_QUERY_KEY = {
  FOLDER: ['MEDIA', 'FOLDER'] as const,
  FILE_LIST: (params?: { folderId?: string; page?: number; limit?: number }) =>
    ['MEDIA', 'FILE_LIST', params] as const,
  LISTS: (filters: any) =>
    [...MEDIA_QUERY_KEY.FOLDER, 'LIST', filters] as const,
  DETAILS: (id: string) => [...MEDIA_QUERY_KEY.FOLDER, 'DETAIL', id] as const,
}

export const USER_QUERY_KEY = {
  ALL: ['USERS'] as const,
  LISTS: (filters: any) => [...USER_QUERY_KEY.ALL, 'LIST', filters] as const,
  DETAILS: (id: string) => [...USER_QUERY_KEY.ALL, 'DETAIL', id] as const,
}

export const _mediaService = {
  // ======= MEDIA FOLDER SETTING ====== //
  useMediaFolder: () => {
    return useQuery({
      queryKey: MEDIA_QUERY_KEY.FOLDER,
      queryFn: () => _mediaApi.fetchFolderMedia(),
      enabled: true,
    })
  },
  useMediaFolderCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (payload: FolderInputType) =>
        _mediaApi.fetchFolderCreate(payload),
      // 1. NGAY TRƯỚC KHI GỌI API: Cập nhật UI ngay lập tức (Optimistic Update)
      onMutate: async (newFolder) => {
        // Hủy các query đang chạy dở để tránh ghi đè dữ liệu giả
        await queryClient.cancelQueries({ queryKey: MEDIA_QUERY_KEY.FOLDER })

        // Lưu lại dữ liệu cũ để dự phòng trường hợp API lỗi (Rollback)
        const previousFolders = queryClient.getQueryData(MEDIA_QUERY_KEY.FOLDER)

        // Cập nhật ngầm dữ liệu trong cache của React Query, giả vờ data đã thêm thành công
        queryClient.setQueryData(MEDIA_QUERY_KEY.FOLDER, (old: any) => {
          if (!old) return old
          return {
            ...old,
            result: [
              ...old.result,
              {
                id: Date.now().toString(), // Tạo một id tạm thời để render key
                name: newFolder.name,
                parentId: newFolder.parentId,
              },
            ],
          }
        })

        // Trả về dữ liệu cũ để chuyển xuống onError nếu cần
        return { previousFolders }
      },
      // 2. NẾU API LỖI: Hoàn nguyên (Rollback) lại dữ liệu cũ từ `previousFolders`
      onError: (err, newFolder, context) => {
        if (context?.previousFolders) {
          queryClient.setQueryData(
            MEDIA_QUERY_KEY.FOLDER,
            context.previousFolders,
          )
        }
      },
      // 3. CUỐI CÙNG (Dù lỗi hay thành công): Luôn gọi lệnh fetch lại API để đồng bộ dữ liệu chuẩn trên server
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY.FOLDER })
      },
    })
  },
  useMediaFolderUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (payload: FolderUpdateType) =>
        _mediaApi.fetchFolderUpdate(payload),
      onMutate: async (updatedFolder) => {
        await queryClient.cancelQueries({ queryKey: MEDIA_QUERY_KEY.FOLDER })
        const previousFolders = queryClient.getQueryData(MEDIA_QUERY_KEY.FOLDER)
        queryClient.setQueryData(MEDIA_QUERY_KEY.FOLDER, (old: any) => {
          if (!old) return old
          return {
            ...old,
            result: old.result.map((folder: any) =>
              folder.id === updatedFolder.id
                ? { ...folder, name: updatedFolder.name }
                : folder,
            ),
          }
        })
        return { previousFolders }
      },
      onError: (err, newFolder, context) => {
        if (context?.previousFolders) {
          queryClient.setQueryData(
            MEDIA_QUERY_KEY.FOLDER,
            context.previousFolders,
          )
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY.FOLDER })
      },
    })
  },
  useMediaFolderDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (id: string) => _mediaApi.fetchFolderDelete(id),
      onMutate: async (idToDelete) => {
        await queryClient.cancelQueries({ queryKey: MEDIA_QUERY_KEY.FOLDER })
        const previousFolders = queryClient.getQueryData(MEDIA_QUERY_KEY.FOLDER)
        queryClient.setQueryData(MEDIA_QUERY_KEY.FOLDER, (old: any) => {
          if (!old) return old
          return {
            ...old,
            result: old.result.filter(
              (folder: any) => folder.id !== idToDelete,
            ),
          }
        })
        return { previousFolders }
      },
      onError: (err, newFolder, context) => {
        if (context?.previousFolders) {
          queryClient.setQueryData(
            MEDIA_QUERY_KEY.FOLDER,
            context.previousFolders,
          )
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY.FOLDER })
      },
    })
  },
  // ======= MEDIA ITEM SETTING ====== //
  useMediaFileList: (params?: MediaFileQuery) => {
    return useQuery({
      queryKey: MEDIA_QUERY_KEY.FILE_LIST(params),
      queryFn: () => _mediaApi.fetchMediFileList(params),
      staleTime: 1000 * 30, // cache 30s
    })
  },
  useMediaUploadFiles: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({
        files,
        folderId,
        onProgress,
      }: {
        files: FileItem[]
        folderId?: string
        onProgress?: (fileId: string, percent: number) => void
      }) => _mediaApi.fetchMediaUpload(files, folderId, onProgress),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['MEDIA', 'FILE_LIST'] })
      },
    })
  },
  useMediaDeleteSingle: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (id: string) => _mediaApi.fetchMediaDeleteSingle(id),
      onMutate: async (idToDelete) => {
        await queryClient.cancelQueries({ queryKey: ['MEDIA', 'FILE_LIST'] })
        const previousData = queryClient.getQueriesData({
          queryKey: ['MEDIA', 'FILE_LIST'],
        })

        queryClient.setQueriesData(
          { queryKey: ['MEDIA', 'FILE_LIST'] },
          (old: any) => {
            if (!old) return old
            return {
              ...old,
              result: {
                ...old.result,
                items: old.result.items.filter(
                  (item: any) =>
                    item.id !== idToDelete && item.fileId !== idToDelete,
                ),
              },
            }
          },
        )
        return { previousData }
      },
      onError: (err, variables, context) => {
        if (context?.previousData) {
          context.previousData.forEach(([queryKey, data]) => {
            queryClient.setQueryData(queryKey, data)
          })
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['MEDIA', 'FILE_LIST'] })
      },
    })
  },
  useMediaDeletes: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (ids: MediaFileDelete) =>
        _mediaApi.fetchMediaDeleteMutiple(ids),
      onMutate: async (payload) => {
        await queryClient.cancelQueries({ queryKey: ['MEDIA', 'FILE_LIST'] })
        const previousData = queryClient.getQueriesData({
          queryKey: ['MEDIA', 'FILE_LIST'],
        })

        queryClient.setQueriesData(
          { queryKey: ['MEDIA', 'FILE_LIST'] },
          (old: any) => {
            if (!old) return old
            return {
              ...old,
              result: {
                ...old.result,
                items: old.result.items.filter(
                  (item: any) =>
                    !payload.ids.includes(item.id) &&
                    !payload.ids.includes(item.fileId),
                ),
              },
            }
          },
        )
        return { previousData }
      },
      onError: (err, variables, context) => {
        if (context?.previousData) {
          context.previousData.forEach(([queryKey, data]) => {
            queryClient.setQueryData(queryKey, data)
          })
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['MEDIA', 'FILE_LIST'] })
      },
    })
  },
}
