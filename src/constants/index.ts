export const DEFAULT_FOLDER_MEDIA = 'all'
// export const API_BASE_URL = 'https://my-ecommerce-be.onrender.com/api'
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000/api'

export const PHONE_REGEX = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
)

export const SETTING_AUTH = {
  URL_REDIRECT: process.env.NEXT_PUBLIC_URL_REDIRECT || 'http://localhost:3000/auth',
}

export const GOOGLE_CLIENT_ID =
  '636900907268-r4khn6i1be4jjr5b69vme5vljgcdd01a.apps.googleusercontent.com'
