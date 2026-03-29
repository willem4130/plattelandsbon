import type { DiscountType } from '@/domain/value-objects/DiscountType'
import type { VoucherStatus } from '@/domain/value-objects/VoucherStatus'

export interface CreateVoucherDTO {
  title: string
  description: string
  discountType: DiscountType
  discountValue?: number
  discountDescription?: string
  terms?: string
  minimumPurchase?: number
  startDate: Date
  endDate: Date
  maxClaims?: number
  image?: string
}

export interface VoucherResponseDTO {
  id: string
  businessId: string
  title: string
  description: string
  discountType: DiscountType
  discountValue: number | null
  discountDescription: string | null
  terms: string | null
  minimumPurchase: number | null
  startDate: Date
  endDate: Date
  maxClaims: number | null
  claimsCount: number
  status: VoucherStatus
  image: string | null
  slug: string | null
  isClaimable: boolean
  remainingClaims: number | null
  createdAt: Date
  updatedAt: Date
}
