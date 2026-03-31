import type { IUseCase } from '@/application/interfaces'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import type { IBusinessRepository } from '@/domain/repositories/IBusinessRepository'
import type { IClaimRepository } from '@/domain/repositories/IClaimRepository'
import { UserNotFoundError } from '@/domain/errors'
import { UserMapper } from '../../mappers/UserMapper'
import type { UserDetailDTO } from '../../dtos/UserDTO'

export class GetUserByIdUseCase implements IUseCase<string, UserDetailDTO> {
  constructor(
    private userRepo: IUserRepository,
    private businessRepo: IBusinessRepository,
    private claimRepo: IClaimRepository,
  ) {}

  async execute(userId: string): Promise<UserDetailDTO> {
    const user = await this.userRepo.findById(userId)
    if (!user) throw new UserNotFoundError(userId)

    const [business, claims] = await Promise.all([
      this.businessRepo.findByUserId(userId),
      this.claimRepo.findByUserId(userId, { take: 10 }),
    ])

    return {
      ...UserMapper.toDTO(user),
      business: business
        ? {
            id: business.id,
            name: business.name,
            status: business.status,
          }
        : null,
      recentClaims: claims.map((claim) => ({
        id: claim.id,
        claimCode: claim.claimCode,
        status: claim.status,
        claimedAt: claim.claimedAt,
      })),
    }
  }
}
