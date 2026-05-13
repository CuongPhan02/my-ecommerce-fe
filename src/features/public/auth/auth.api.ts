import { ApiResponse } from '~/@types/api'
import { https } from '~/config/https'
import {
  SignInSchemaType,
  SignUpSchemaType,
  VerifyEmailSchemaType,
  ForgotPasswordSchemaType,
  ResetPasswordSchemaType,
  GoogleLoginSchemaType,
} from './auth.validate'

export const AUTH_API = {
  login: async (payload: SignInSchemaType) => {
    const response = await https.post<ApiResponse<any>>('/auth/login', payload)
    return response.data
  },
  register: async (payload: SignUpSchemaType) => {
    const response = await https.post<ApiResponse<any>>(
      '/auth/register',
      payload,
    )
    return response.data
  },
  logout: async () => {
    const response = await https.post<ApiResponse<any>>('/auth/logout')
    return response.data
  },
  verifyEmail: async (payload: VerifyEmailSchemaType) => {
    const response = await https.post<ApiResponse<any>>(
      '/auth/verify-email',
      payload,
    )
    return response.data
  },
  forgotPassword: async (payload: ForgotPasswordSchemaType) => {
    const response = await https.post<ApiResponse<any>>(
      '/auth/forgot-password',
      payload,
    )
    return response.data
  },
  resetPassword: async (payload: ResetPasswordSchemaType) => {
    const response = await https.post<ApiResponse<any>>(
      '/auth/reset-password',
      payload,
    )
    return response.data
  },
  loginWithGoogle: async (payload: GoogleLoginSchemaType) => {
    const response = await https.post<ApiResponse<any>>('/auth/google', payload)
    return response.data
  },
  getMe: async () => {
    const response = await https.get<ApiResponse<any>>('/auth/me')
    return response.data
  },
}
