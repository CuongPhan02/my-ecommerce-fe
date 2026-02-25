import { create } from 'zustand'

interface UiState {
  isGlobalLoading: boolean
  setLoading: (state: boolean) => void
  uploadProgress: Record<string, number> // key = fileId, value = %
  setUploadProgress: (fileId: string, percent: number) => void
  clearUploadProgress: (fileId?: string) => void
}

export const useUiStore = create<UiState>((set) => ({
  isGlobalLoading: false,
  uploadProgress: {},
  setLoading: (state) => set({ isGlobalLoading: state }),
  setUploadProgress: (fileId, percent) =>
    set((state) => ({
      uploadProgress: { ...state.uploadProgress, [fileId]: percent },
    })),
  clearUploadProgress: (fileId) =>
    set((state) => {
      if (!fileId) return { uploadProgress: {} }
      const copy = { ...state.uploadProgress }
      delete copy[fileId]
      return { uploadProgress: copy }
    }),
}))
