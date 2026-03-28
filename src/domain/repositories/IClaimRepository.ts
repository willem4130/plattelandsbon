import { VoucherClaim } from '../entities/VoucherClaim'
import { ClaimStatus } from '../value-objects/ClaimStatus'

export interface IClaimRepository {
  findById(id: string): Promise<VoucherClaim | null>
  findByClaimCode(code: string): Promise<VoucherClaim | null>
  findByUserId(userId: string): Promise<VoucherClaim[]>
  findByVoucherId(voucherId: string): Promise<VoucherClaim[]>
  create(data: {
    voucherId: string
    userId: string
    claimCode: string
    expiresAt?: Date
  }): Promise<VoucherClaim>
  updateStatus(id: string, status: ClaimStatus): Promise<VoucherClaim>
}
