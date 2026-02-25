export type ApiResponse<T> = {
  data: {
    success: boolean
    message: string
    result: T
  }
}
