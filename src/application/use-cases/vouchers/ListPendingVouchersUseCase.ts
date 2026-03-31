import type { IUseCase } from '@/application/interfaces'
import type { IVoucherRepository } from '@/domain/repositories/IVoucherRepository'
import { VoucherStatus } from '@/domain/value-objects/VoucherStatus'
import { VoucherMapper } from '../../mappers/VoucherMapper'
import type { VoucherResponseDTO } from '../../dtos/VoucherDTO'

export class ListPendingVouchersUseCase
  implements IUseCase<void, VoucherResponseDTO[]>
{
  constructor(private voucherRepo: IVoucherRepository) {}

  async execute(): Promise<VoucherResponseDTO[]> {
    const vouchers = await this.voucherRepo.findByStatus(VoucherStatus.PENDING)
    return vouchers.map(VoucherMapper.toDTO)
  }
}
