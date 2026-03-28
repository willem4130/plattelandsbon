import type { IUseCase } from '@/application/interfaces'
import type { IBusinessRepository } from '@/domain/repositories/IBusinessRepository'
import type { BusinessStatus } from '@/domain/value-objects/BusinessStatus'
import { BusinessMapper } from '../../mappers/BusinessMapper'
import type { BusinessResponseDTO } from '../../dtos/BusinessDTO'

export class ListBusinessesUseCase
  implements IUseCase<BusinessStatus | undefined, BusinessResponseDTO[]>
{
  constructor(private businessRepo: IBusinessRepository) {}

  async execute(status?: BusinessStatus): Promise<BusinessResponseDTO[]> {
    const businesses = status
      ? await this.businessRepo.findByStatus(status)
      : await this.businessRepo.findAll()

    return businesses.map(BusinessMapper.toDTO)
  }
}
