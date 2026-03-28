import type { BusinessStatus } from '@/domain/value-objects/BusinessStatus'

export interface BusinessRegistrationDTO {
  userId: string
  name: string
  description?: string
  address?: string
  city?: string
  postalCode?: string
  province?: string
  phone?: string
  website?: string
  categoryIds: string[]
}

export interface BusinessResponseDTO {
  id: string
  userId: string
  name: string
  description: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  province: string | null
  phone: string | null
  website: string | null
  status: BusinessStatus
  verifiedAt: Date | null
  verificationNotes: string | null
  logo: string | null
  categoryIds: string[]
  createdAt: Date
  updatedAt: Date
}
