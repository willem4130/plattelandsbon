import type { IUseCase } from '@/application/interfaces'
import type { IVoucherRepository } from '@/domain/repositories/IVoucherRepository'
import type { IDomainEventBus } from '@/domain/events'
import { createVoucherRejectedEvent } from '@/domain/events'
import { VoucherNotFoundError, DomainError } from '@/domain/errors'
import { VoucherStatus } from '@/domain/value-objects/VoucherStatus'
import { VoucherMapper } from '../../mappers/VoucherMapper'
import type { VoucherResponseDTO } from '../../dtos/VoucherDTO'

export interface RejectVoucherInput {
  voucherId: string
  reason?: string
  rejectedBy: string
}

export class RejectVoucherUseCase
  implements IUseCase<RejectVoucherInput, VoucherResponseDTO>
{
  constructor(
    private voucherRepo: IVoucherRepository,
    private eventBus: IDomainEventBus,
  ) {}

  async execute(input: RejectVoucherInput): Promise<VoucherResponseDTO> {
    const voucher = await this.voucherRepo.findById(input.voucherId)
    if (!voucher) throw new VoucherNotFoundError(input.voucherId)
    if (!voucher.canBeRejected()) {
      throw new DomainError(`Voucher cannot be rejected (status: ${voucher.status})`)
    }

    const updated = await this.voucherRepo.updateStatus(
      input.voucherId,
      VoucherStatus.REJECTED,
      input.reason,
    )

    await this.eventBus.publish(
      createVoucherRejectedEvent(input.voucherId, voucher.businessId, input.rejectedBy, voucher.title, input.reason),
    )

    return VoucherMapper.toDTO(updated)
  }
}
