import type { IUseCase } from '@/application/interfaces'
import type { IBusinessRepository } from '@/domain/repositories/IBusinessRepository'
import { BusinessStatus } from '@/domain/value-objects/BusinessStatus'
import {
  BusinessNotFoundError,
  BusinessCannotBeVerifiedError,
} from '@/domain/errors'
import { BusinessMapper } from '../../mappers/BusinessMapper'
import type { BusinessResponseDTO } from '../../dtos/BusinessDTO'

export interface VerifyBusinessInput {
  businessId: string
  approve: boolean
  notes?: string
}

export class VerifyBusinessUseCase
  implements IUseCase<VerifyBusinessInput, BusinessResponseDTO>
{
  constructor(private businessRepo: IBusinessRepository) {}

  async execute(input: VerifyBusinessInput): Promise<BusinessResponseDTO> {
    const business = await this.businessRepo.findById(input.businessId)
    if (!business) {
      throw new BusinessNotFoundError(input.businessId)
    }

    if (!business.canBeVerified() && input.approve) {
      throw new BusinessCannotBeVerifiedError(input.businessId, business.status)
    }
    if (!business.canBeRejected() && !input.approve) {
      throw new BusinessCannotBeVerifiedError(input.businessId, business.status)
    }

    const newStatus = input.approve
      ? BusinessStatus.VERIFIED
      : BusinessStatus.REJECTED

    const updated = await this.businessRepo.updateStatus(
      input.businessId,
      newStatus,
      input.notes,
    )

    return BusinessMapper.toDTO(updated)
  }
}
