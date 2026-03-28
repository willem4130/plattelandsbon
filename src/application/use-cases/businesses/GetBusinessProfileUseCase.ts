import type { IUseCase } from '@/application/interfaces'
import type { IBusinessRepository } from '@/domain/repositories/IBusinessRepository'
import { BusinessNotFoundError } from '@/domain/errors'
import { BusinessMapper } from '../../mappers/BusinessMapper'
import type { BusinessResponseDTO } from '../../dtos/BusinessDTO'

export type GetBusinessProfileInput =
  | { by: 'id'; id: string }
  | { by: 'userId'; userId: string }

export class GetBusinessProfileUseCase
  implements IUseCase<GetBusinessProfileInput, BusinessResponseDTO | null>
{
  constructor(private businessRepo: IBusinessRepository) {}

  async execute(input: GetBusinessProfileInput): Promise<BusinessResponseDTO | null> {
    if (input.by === 'id') {
      const business = await this.businessRepo.findById(input.id)
      if (!business) throw new BusinessNotFoundError(input.id)
      return BusinessMapper.toDTO(business)
    }

    const business = await this.businessRepo.findByUserId(input.userId)
    return business ? BusinessMapper.toDTO(business) : null
  }
}
