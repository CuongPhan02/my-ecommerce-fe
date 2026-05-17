export type ReviewStatus = 'PENDING' | 'APPROVED' | 'HIDDEN'

export interface Review {
  id: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  size?: string
  color?: string
  tags?: string[]
  likes: number
  status: ReviewStatus
  productId: string
  productTitle: string
  productThumbnail?: string
  createdAt: string
  replies?: ReviewReply[]
}

export interface ReviewReply {
  id: string
  adminName: string
  content: string
  createdAt: string
}

export interface ReviewParams {
  page?: number
  limit?: number
  search?: string | null
  status?: ReviewStatus | null
  rating?: number | null
  sort?: string | null
}

export type ReviewTableMeta = {
  onView: (review: Review) => void
  onUpdateStatus: (id: string, status: ReviewStatus) => void
  onDelete: (id: string) => void
}
