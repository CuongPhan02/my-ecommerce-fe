export interface Address {
  id: string
  receiverName: string
  phone: string
  street: string
  city: string
  province: string
  postalCode: string
  country: string
  isDefault: boolean
}

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string | null
  avatarUrl: string | null
  role: string
  profile: {
    firstName: string
    lastName: string
    bio: string
    birthday: string
  }
}

export interface CreateAddressPayload {
  receiverName: string
  phone: string
  street: string
  city: string
  province: string
  postalCode: string
  country: string
  isDefault?: boolean
}

export interface UpdateAddressPayload extends Partial<CreateAddressPayload> {}
