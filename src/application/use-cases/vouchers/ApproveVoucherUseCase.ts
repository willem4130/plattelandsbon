import type { IUseCase } from '@/application/interfaces'
import type { IVoucherRepository } from '@/domain/repositories/IVoucherRepository'
import type { IDomainEventBus } from '@/domain/events'
import { createVoucherApprovedEvent } from '@/domain/events'
import { VoucherNotFoundError, DomainError } from '@/domain/errors'
import { VoucherStatus } from '@/domain/value-objects/VoucherStatus'
import { VoucherMapper } from '../../mappers/VoucherMapper'
import type { VoucherResponseDTO } from '../../dtos/VoucherDTO'

export interface ApproveVoucherInput {
  voucherId: string
  approvedBy: string
}

export class ApproveVoucherUseCase
  implements IUseCase<ApproveVoucherInput, VoucherResponseDTO>
{
  constructor(
    private voucherRepo: IVoucherRepository,
    private eventBus: IDomainEventBus,
  ) {}

  async execute(input: ApproveVoucherInput): Promise<VoucherResponseDTO> {
    const voucher = await this.voucherRepo.findById(input.voucherId)
    if (!voucher) throw new VoucherNotFoundError(input.voucherId)
    if (!voucher.canBeApproved()) {
      throw new DomainError(`Voucher cannot be approved (status: ${voucher.status})`)
    }

    const updated = await this.voucherRepo.updateStatus(input.voucherId, VoucherStatus.ACTIVE)

    await this.eventBus.publish(
      createVoucherApprovedEvent(input.voucherId, voucher.businessId, input.approvedBy, voucher.title),
    )

    return VoucherMapper.toDTO(updated)
  }
}
