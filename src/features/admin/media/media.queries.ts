import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  FileItem,
  FolderInputType,
  FolderUpdateType,
  MediaFileDelete,
  MediaFileQuery,
} from './types'

import { mediaKeys } from './key-queries'
import { _mediaApi } from './media.api'

export const _mediaService = {
  // ======= MEDIA FOLDER SETTING ====== //
  useMediaFolder: () => {
    return useQuery({
      queryKey: mediaKeys.folder,
      queryFn: () => _mediaApi.fetchFolderMedia(),
      enabled: true,
    })
  },
  useMediaFolderCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (payload: FolderInputType) =>
        _mediaApi.fetchFolderCreate(payload),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: mediaKeys.folder }),
    })
  },
  useMediaFolderUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (payload: FolderUpdateType) =>
        _mediaApi.fetchFolderUpdate(payload),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: mediaKeys.folder }),
    })
  },
  useMediaFolderDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (id: string) => _mediaApi.fetchFolderDelete(id),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: mediaKeys.folder }),
    })
  },
  // ======= MEDIA ITEM SETTING ====== //
  useMediaFileList: (params?: MediaFileQuery) => {
    return useQuery({
      queryKey: mediaKeys.fileList(params),
      queryFn: () => _mediaApi.fetchMediFileList(params),
      staleTime: 1000 * 30, // cache 30s
    })
  },
  useMediaUploadFiles: () => {
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
    })
  },
  useMediaDeleteSingle: () => {
    return useMutation({
      mutationFn: (id: string) => _mediaApi.fetchMediaDeleteSingle(id),
    })
  },
  useMediaDeletes: () => {
    return useMutation({
      mutationFn: (ids: MediaFileDelete) =>
        _mediaApi.fetchMediaDeleteMutiple(ids),
    })
  },
}
