import type { IBusinessRepository } from '@/domain/repositories/IBusinessRepository'
import { BusinessNotFoundError } from '@/domain/errors'
import { BusinessMapper } from '../../mappers/BusinessMapper'
import type { BusinessResponseDTO } from '../../dtos/BusinessDTO'

export class GetBusinessProfileUseCase {
  constructor(private businessRepo: IBusinessRepository) {}

  async executeById(id: string): Promise<BusinessResponseDTO> {
    const business = await this.businessRepo.findById(id)
    if (!business) throw new BusinessNotFoundError(id)
    return BusinessMapper.toDTO(business)
  }

  async executeByUserId(userId: string): Promise<BusinessResponseDTO | null> {
    const business = await this.businessRepo.findByUserId(userId)
    return business ? BusinessMapper.toDTO(business) : null
  }
}
