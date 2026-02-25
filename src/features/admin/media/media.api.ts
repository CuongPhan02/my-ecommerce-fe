/* eslint-disable @typescript-eslint/no-explicit-any */

import https from '~/config/https'
import { ApiResponse } from '~/types/apiConfig'
import {
  FileItem,
  FolderInputType,
  FolderType,
  FolderUpdateType,
  MediaFileDelete,
  MediaFileQuery,
  MediaFileQueryResponse,
} from './types'

export const _mediaApi = {
  // ======= MEDIA FOLDER SETTING ====== //
  fetchFolderMedia: async () => {
    const response: ApiResponse<FolderType[]> = await https.get(
      '/media-folder/folder-getAll'
    )

    return response.data
  },
  fetchFolderCreate: async (payload: FolderInputType) => {
    const response: ApiResponse<FolderType> = await https.post(
      '/media-folder/create',
      payload
    )
    return response
  },
  fetchFolderUpdate: async (payload: FolderUpdateType) => {
    const response: ApiResponse<FolderType> = await https.put(
      '/media-folder/folder-update',
      payload
    )
    return response
  },
  fetchFolderDelete: async (id: string) => {
    const response: ApiResponse<any> = await https.delete(
      `/media-folder/delete/${id}`
    )
    return response
  },
  // ======= MEDIA ITEM SETTING ====== //
  fetchMediFileList: async (params?: MediaFileQuery) => {
    const { folderId, page = 1, limit = 20 } = params || {}
    const response: ApiResponse<MediaFileQueryResponse> = await https.get(
      `/media-file/getMedia`,
      {
        params: {
          ...(folderId ? { folderId } : {}),
          page,
          limit,
        },
      }
    )
    return response
  },
  fetchMediaUpload: async (
    files: FileItem[],
    folderId: string | undefined,
    onProgress?: (fileId: string, percent: number) => void
  ) => {
    const formData = new FormData()

    files.map((file) => {
      formData.append('files', file.file)
    })
    const response: ApiResponse<any> = await https.post(
      '/media-file/uploads',
      formData,
      {
        params: { ...(folderId ? { folderId } : {}) },
        onUploadProgress: (event: any) => {
          const percent = Math.round((event.loaded * 100) / event.total)
          if (onProgress) {
            files.map((file) => {
              onProgress(file.id, percent)
            })
          }
        },
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )

    return response
  },
  fetchMediaDeleteSingle: async (id: string) => {
    const response: ApiResponse<FolderType> = await https.delete(
      `/media-file/media-delete-single/${id}`
    )
    return response
  },
  fetchMediaDeleteMutiple: async (payload: MediaFileDelete) => {
    const response: ApiResponse<FolderType> = await https.post(
      '/media-file/media-delete-multiple',
      payload
    )
    return response
  },
}
