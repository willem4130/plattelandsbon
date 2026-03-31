export interface VoucherBrowseDTO {
  id: string
  title: string
  description: string
  discountType: string
  discountValue: number | null
  discountDescription: string | null
  terms: string | null
  slug: string | null
  businessId: string
  businessName: string
  city: string | null
  categories: string[]
  maxClaims: number | null
  claimsCount: number
  startDate: Date
  endDate: Date
}

export interface BusinessBrowseDTO {
  id: string
  name: string
  description: string | null
  city: string | null
  province: string | null
  phone: string | null
  website: string | null
  categories: string[]
  categoryNames: string[]
  activeVoucherCount: number
}

export interface VoucherDetailDTO {
  id: string
  title: string
  description: string
  discountType: string
  discountValue: number | null
  discountDescription: string | null
  terms: string | null
  minimumPurchase: number | null
  slug: string | null
  status: string
  startDate: Date
  endDate: Date
  maxClaims: number | null
  claimsCount: number
  remainingClaims: number | null
  businessId: string
  businessName: string
  city: string | null
}
