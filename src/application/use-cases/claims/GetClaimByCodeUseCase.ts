import type { IUseCase } from '@/application/interfaces'
import type { IClaimRepository } from '@/domain/repositories/IClaimRepository'

export interface ClaimLookupDTO {
  id: string
  claimCode: string
  status: string
  claimedAt: Date
  expiresAt: Date | null
  isRedeemable: boolean
  isExpired: boolean
}

export class GetClaimByCodeUseCase implements IUseCase<string, ClaimLookupDTO | null> {
  constructor(private claimRepo: IClaimRepository) {}

  async execute(code: string): Promise<ClaimLookupDTO | null> {
    const claim = await this.claimRepo.findByClaimCode(code)
    if (!claim) return null

    return {
      id: claim.id,
      claimCode: claim.claimCode,
      status: claim.status,
      claimedAt: claim.claimedAt,
      expiresAt: claim.expiresAt,
      isRedeemable: claim.isRedeemable(),
      isExpired: claim.isExpired(),
    }
  }
}
