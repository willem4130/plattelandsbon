import type { IUseCase } from '@/application/interfaces'
import type { IVoucherRepository } from '@/domain/repositories/IVoucherRepository'
import { VoucherNotFoundError } from '@/domain/errors'
import { DomainError } from '@/domain/errors'
import { VoucherMapper } from '../../mappers/VoucherMapper'
import type { VoucherResponseDTO } from '../../dtos/VoucherDTO'

export interface SubmitVoucherInput {
  voucherId: string
  businessId: string
}

export class SubmitVoucherUseCase
  implements IUseCase<SubmitVoucherInput, VoucherResponseDTO>
{
  constructor(private voucherRepo: IVoucherRepository) {}

  async execute(input: SubmitVoucherInput): Promise<VoucherResponseDTO> {
    const voucher = await this.voucherRepo.findById(input.voucherId)
    if (!voucher) throw new VoucherNotFoundError(input.voucherId)
    if (voucher.businessId !== input.businessId) {
      throw new DomainError('Voucher does not belong to this business')
    }
    if (voucher.status !== 'DRAFT') {
      throw new DomainError(`Voucher cannot be submitted (status: ${voucher.status})`)
    }

    const updated = await this.voucherRepo.updateStatus(input.voucherId, 'PENDING')
    return VoucherMapper.toDTO(updated)
  }
}
