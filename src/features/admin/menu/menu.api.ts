import { https } from '~/config/https'
import { ApiResponse } from '~/@types/api'
import { Menu, MenuInput } from './types'
import { mockMenus } from './menu.mock'

export const _menuApi = {
  fetchMenus: async () => {
    const res = await https.get<ApiResponse<Menu[]>>('/navigate/tree')
    return res.data
  },

  fetchMenuById: async (id: string) => {
    const res = await https.get<ApiResponse<Menu>>(`/navigate/${id}`)
    return res.data
  },

  createMenu: async (data: MenuInput) => {
    const res = await https.post<ApiResponse<Menu>>('/navigate', data)
    return res.data
  },

  updateMenu: async (id: string, data: Partial<MenuInput>) => {
    const res = await https.put<ApiResponse<Menu>>(`/navigate/${id}`, data)
    return res.data
  },

  deleteMenu: async (id: string) => {
    const res = await https.delete<ApiResponse<null>>(`/navigate/${id}`)
    return res.data
  }
}
