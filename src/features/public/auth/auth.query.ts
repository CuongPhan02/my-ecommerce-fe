import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import {
  SignInSchemaType,
  SignUpSchemaType,
  VerifyEmailSchemaType,
  ForgotPasswordSchemaType,
  ResetPasswordSchemaType,
  GoogleLoginSchemaType,
} from './auth.validate'
import { AUTH_API } from './auth.api'

export const AUTH_QUERY_KEY = {
  login: ['AUTH', 'LOGIN'] as const,
  register: ['AUTH', 'REGISTER'] as const,
  logout: ['AUTH', 'LOGOUT'] as const,
  verifyEmail: ['AUTH', 'VERIFY_EMAIL'] as const,
  forgotPassword: ['AUTH', 'FORGOT_PASSWORD'] as const,
  resetPassword: ['AUTH', 'RESET_PASSWORD'] as const,
  loginWithGoogle: ['AUTH', 'LOGIN_WITH_GOOGLE'] as const,
  me: ['AUTH', 'ME'] as const,
}

export const AUTH_QUERY = {
  useMe: () => {
    return useQuery({
      queryKey: AUTH_QUERY_KEY.me,
      queryFn: () => AUTH_API.getMe(),
    })
  },
  useLogin: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: async (payload: SignInSchemaType) =>
        await AUTH_API.login(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEY.login] })
      },
    })
  },
  useRegister: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: async (payload: SignUpSchemaType) =>
        await AUTH_API.register(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEY.register] })
      },
    })
  },
  useLogout: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: async () => await AUTH_API.logout(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEY.logout] })
      },
    })
  },
  useVerifyEmail: () => {
    return useMutation({
      mutationFn: async (payload: VerifyEmailSchemaType) =>
        await AUTH_API.verifyEmail(payload),
      onSuccess: () => {
        // No specific invalidation needed, maybe just toast success in component
      },
    })
  },
  useForgotPassword: () => {
    return useMutation({
      mutationFn: async (payload: ForgotPasswordSchemaType) =>
        await AUTH_API.forgotPassword(payload),
    })
  },
  useResetPassword: () => {
    return useMutation({
      mutationFn: async (payload: ResetPasswordSchemaType) =>
        await AUTH_API.resetPassword(payload),
    })
  },
  useLoginWithGoogle: (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: async (payload: GoogleLoginSchemaType) =>
        await AUTH_API.loginWithGoogle(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [AUTH_QUERY_KEY.loginWithGoogle],
        })
      },
    })
  },
}
