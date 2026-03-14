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
    const response = await https.get<ApiResponse<FolderType[]>>(
      '/media/folder-getAll',
    )

    return response.data
  },
  fetchFolderCreate: async (payload: FolderInputType) => {
    const response: ApiResponse<FolderType> = await https.post(
      '/media/create',
      payload,
    )
    return response
  },
  fetchFolderUpdate: async (payload: FolderUpdateType) => {
    const response: ApiResponse<FolderType> = await https.put(
      '/media/folder-update',
      payload,
    )
    return response
  },
  fetchFolderDelete: async (id: string) => {
    const response: ApiResponse<any> = await https.delete(`/media/delete/${id}`)
    return response
  },
  // ======= MEDIA ITEM SETTING ====== //
  fetchMediFileList: async (params?: MediaFileQuery) => {
    const { folderId, page = 1, limit = 20 } = params || {}
    const response = await https.get<ApiResponse<MediaFileQueryResponse>>(
      `/media/get-media`,
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
      '/media/upload-multiple',
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
    const response: ApiResponse<any> = await https.post(
      `/media/delete-single`,
      { id: id },
    )
    return response
  },
  fetchMediaDeleteMutiple: async (payload: MediaFileDelete) => {
    const response: ApiResponse<any> = await https.post(
      '/media/delete-multiple',
      payload,
    )
    return response
  },
}
