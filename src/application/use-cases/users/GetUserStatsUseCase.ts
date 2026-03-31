import type { IUseCase } from '@/application/interfaces'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import type { UserStatsDTO } from '../../dtos/UserDTO'

export class GetUserStatsUseCase implements IUseCase<void, UserStatsDTO> {
  constructor(private userRepo: IUserRepository) {}

  async execute(): Promise<UserStatsDTO> {
    const [roleCounts, newThisMonth] = await Promise.all([
      this.userRepo.countByRole(),
      this.userRepo.countRecent(30),
    ])

    return {
      total: roleCounts.total,
      admins: roleCounts.admins,
      businesses: roleCounts.businesses,
      consumers: roleCounts.consumers,
      newThisMonth,
    }
  }
}
