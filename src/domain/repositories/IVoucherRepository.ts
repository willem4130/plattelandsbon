import { Voucher } from '../entities/Voucher'
import { VoucherStatus } from '../value-objects/VoucherStatus'

export interface VoucherSearchFilters {
  status?: VoucherStatus
  categoryId?: string
  city?: string
  query?: string
  limit?: number
  offset?: number
}

export interface IVoucherRepository {
  findById(id: string): Promise<Voucher | null>
  findBySlug(slug: string): Promise<Voucher | null>
  findByBusinessId(businessId: string): Promise<Voucher[]>
  findByStatus(status: VoucherStatus): Promise<Voucher[]>
  search(filters: VoucherSearchFilters): Promise<{ vouchers: Voucher[]; total: number }>
  create(data: {
    businessId: string
    title: string
    description: string
    discountType: string
    discountValue?: number
    discountDescription?: string
    terms?: string
    minimumPurchase?: number
    startDate: Date
    endDate: Date
    maxClaims?: number
    image?: string
    slug: string
    status?: VoucherStatus
  }): Promise<Voucher>
  updateStatus(
    id: string,
    status: VoucherStatus,
    reason?: string,
  ): Promise<Voucher>
  incrementClaimCount(id: string): Promise<void>
}
