import z from 'zod'
import { PHONE_REGEX } from '~/constants'

export const signInSchema = z.object({
  email: z.email({ message: 'Email is invalid.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
})

export type SignInSchemaType = z.infer<typeof signInSchema>

export const signUpSchema = z.object({
  email: z.email({ message: 'Email is invalid.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
  name: z.string().nullable(),
  phone: z.string().regex(PHONE_REGEX, 'Invalid Number!'),
  address: z.string().nullable(),
  urlRedirect: z.string().optional(),
})

export type SignUpSchemaType = z.infer<typeof signUpSchema>

export const verifyEmailSchema = z.object({
  email: z.string().email(),
  token: z.string(),
})

export type VerifyEmailSchemaType = z.infer<typeof verifyEmailSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
  urlRedirect: z.string(),
})

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
  token: z.string(),
})

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>

export const googleLoginSchema = z.object({
  code: z.string(),
  urlRedirect: z.string().optional(),
  isMobile: z.boolean().optional(),
})

export type GoogleLoginSchemaType = z.infer<typeof googleLoginSchema>
