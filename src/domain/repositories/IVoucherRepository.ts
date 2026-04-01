import { Voucher } from '../entities/Voucher'
import type { DiscountType } from '../value-objects/DiscountType'
import { VoucherStatus } from '../value-objects/VoucherStatus'
import type { TransactionContext, PaginationOptions } from '../types'

export interface VoucherSearchFilters {
  status?: VoucherStatus
  categoryId?: string
  city?: string
  query?: string
  limit?: number
  offset?: number
}

export interface IVoucherRepository {
  findById(id: string, tx?: TransactionContext): Promise<Voucher | null>
  findBySlug(slug: string, tx?: TransactionContext): Promise<Voucher | null>
  findByBusinessId(businessId: string, options?: PaginationOptions, tx?: TransactionContext): Promise<Voucher[]>
  findByStatus(status: VoucherStatus, options?: PaginationOptions, tx?: TransactionContext): Promise<Voucher[]>
  search(filters: VoucherSearchFilters, tx?: TransactionContext): Promise<{ vouchers: Voucher[]; total: number }>
  create(data: {
    businessId: string
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
    slug: string
    status?: VoucherStatus
  }, tx?: TransactionContext): Promise<Voucher>
  updateStatus(
    id: string,
    status: VoucherStatus,
    reason?: string,
    tx?: TransactionContext,
  ): Promise<Voucher>
  incrementClaimCount(id: string, tx?: TransactionContext): Promise<boolean>
  countActiveByBusinessIds(businessIds: string[], tx?: TransactionContext): Promise<Map<string, number>>
}
