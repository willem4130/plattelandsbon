import type { IBusinessRepository } from '@/domain/repositories/IBusinessRepository'
import { BusinessAlreadyExistsError } from '@/domain/errors'
import { BusinessMapper } from '../../mappers/BusinessMapper'
import type { BusinessRegistrationDTO, BusinessResponseDTO } from '../../dtos/BusinessDTO'

export class RegisterBusinessUseCase {
  constructor(private businessRepo: IBusinessRepository) {}

  async execute(input: BusinessRegistrationDTO): Promise<BusinessResponseDTO> {
    const existing = await this.businessRepo.findByUserId(input.userId)
    if (existing) {
      throw new BusinessAlreadyExistsError(input.userId)
    }

    const business = await this.businessRepo.create({
      userId: input.userId,
      name: input.name,
      description: input.description,
      address: input.address,
      city: input.city,
      postalCode: input.postalCode,
      province: input.province,
      phone: input.phone,
      website: input.website,
      categoryIds: input.categoryIds,
    })

    return BusinessMapper.toDTO(business)
  }
}
