import z from 'zod'
import { PHONE_REGEX } from '~/constants'

export const signInSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ.' }),
  password: z
    .string()
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' }),
})

export type SignInSchemaType = z.infer<typeof signInSchema>

export const signUpSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ.' }),
  password: z
    .string()
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' }),
  name: z.string().nullable(),
  phone: z.string().regex(PHONE_REGEX, 'Số điện thoại không hợp lệ!'),
  address: z.string().nullable(),
  urlRedirect: z.string().optional(),
})

export type SignUpSchemaType = z.infer<typeof signUpSchema>

export const verifyEmailSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ.' }),
  token: z.string(),
})

export type VerifyEmailSchemaType = z.infer<typeof verifyEmailSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ.' }),
  urlRedirect: z.string(),
})

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ.' }),
  password: z
    .string()
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' }),
  token: z.string(),
})

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>

export const googleLoginSchema = z.object({
  code: z.string(),
  urlRedirect: z.string().optional(),
  isMobile: z.boolean().optional(),
})

export type GoogleLoginSchemaType = z.infer<typeof googleLoginSchema>
