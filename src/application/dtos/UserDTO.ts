import type { UserRole } from '@/domain/value-objects/UserRole'

export interface UserResponseDTO {
  id: string
  name: string | null
  email: string
  role: UserRole
  image: string | null
  createdAt: Date
  updatedAt: Date
  emailVerified: Date | null
}

export interface UserStatsDTO {
  total: number
  admins: number
  businesses: number
  consumers: number
  newThisMonth: number
}

export interface PaginatedUsersDTO {
  users: UserResponseDTO[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface UserDetailDTO extends UserResponseDTO {
  business: {
    id: string
    name: string
    status: string
  } | null
  recentClaims: {
    id: string
    claimCode: string
    status: string
    claimedAt: Date
  }[]
}
