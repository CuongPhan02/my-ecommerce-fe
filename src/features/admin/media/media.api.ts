/* eslint-disable @typescript-eslint/no-explicit-any */

import { https } from '~/config/https'

import {
  FileItem,
  FolderInputType,
  FolderType,
  FolderUpdateType,
  MediaFileDelete,
  MediaFileQuery,
  MediaFileQueryResponse,
} from './types'
import { ApiResponse } from '~/@types/api'

export const _mediaApi = {
  // ======= MEDIA FOLDER SETTING ====== //
  fetchFolderMedia: async () => {
    const response =
      await https.get<ApiResponse<FolderType[]>>('/media/folders')

    return response.data
  },
  fetchFolderCreate: async (payload: FolderInputType) => {
    const response: ApiResponse<FolderType> = await https.post(
      '/media/folders',
      payload,
    )
    return response
  },
  fetchFolderUpdate: async (payload: FolderUpdateType) => {
    const response: ApiResponse<FolderType> = await https.put(
      '/media/folders',
      payload,
    )
    return response
  },
  fetchFolderDelete: async (id: string) => {
    const response: ApiResponse<any> = await https.delete(
      `/media/folders/${id}`,
    )
    return response
  },
  // ======= MEDIA ITEM SETTING ====== //
  fetchMediFileList: async (params?: MediaFileQuery) => {
    const { folderId, page = 1, limit = 20 } = params || {}
    const response = await https.get<ApiResponse<MediaFileQueryResponse>>(
      `/media`,
      {
        params: {
          ...(folderId ? { folderId } : {}),
          page,
          limit,
        },
      },
    )
    return response.data
  },
  fetchMediaUpload: async (
    files: FileItem[],
    folderId: string | undefined,
    onProgress?: (fileId: string, percent: number) => void,
  ) => {
    const formData = new FormData()

    files.forEach((file) => {
      formData.append('files', file.file)
    })
    const response: ApiResponse<any> = await https.post(
      '/media/upload',
      formData,
      {
        params: { ...(folderId ? { folderId } : {}) },
        onUploadProgress: (event: any) => {
          const percent = Math.round((event.loaded * 100) / event.total)
          if (onProgress) {
            files.forEach((file) => {
              onProgress(file.id, percent)
            })
          }
        },
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    )

    return response
  },
  fetchMediaDeleteSingle: async (id: string) => {
    const response: ApiResponse<any> = await https.post(`/media`, { id: id })
    return response
  },
  fetchMediaDeleteMutiple: async (payload: MediaFileDelete) => {
    const response: ApiResponse<any> = await https.post(
      '/media/delete-many',
      payload,
    )
    return response
  },
}
