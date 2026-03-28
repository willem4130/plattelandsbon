import { VoucherClaim } from '../entities/VoucherClaim'
import { ClaimStatus } from '../value-objects/ClaimStatus'
import type { TransactionContext, PaginationOptions } from '../types'

export interface IClaimRepository {
  findById(id: string, tx?: TransactionContext): Promise<VoucherClaim | null>
  findByClaimCode(code: string, tx?: TransactionContext): Promise<VoucherClaim | null>
  findByUserId(userId: string, options?: PaginationOptions, tx?: TransactionContext): Promise<VoucherClaim[]>
  findByVoucherId(voucherId: string, options?: PaginationOptions, tx?: TransactionContext): Promise<VoucherClaim[]>
  create(data: {
    voucherId: string
    userId: string
    claimCode: string
    expiresAt?: Date
  }, tx?: TransactionContext): Promise<VoucherClaim>
  updateStatus(id: string, status: ClaimStatus, tx?: TransactionContext): Promise<VoucherClaim>
}
