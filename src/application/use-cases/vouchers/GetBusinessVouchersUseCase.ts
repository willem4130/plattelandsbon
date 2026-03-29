import type { IUseCase } from '@/application/interfaces'
import type { IVoucherRepository } from '@/domain/repositories/IVoucherRepository'
import type { IBusinessRepository } from '@/domain/repositories/IBusinessRepository'
import { BusinessNotFoundError } from '@/domain/errors'
import { VoucherMapper } from '../../mappers/VoucherMapper'
import type { VoucherResponseDTO } from '../../dtos/VoucherDTO'

export class GetBusinessVouchersUseCase
  implements IUseCase<string, VoucherResponseDTO[]>
{
  constructor(
    private voucherRepo: IVoucherRepository,
    private businessRepo: IBusinessRepository,
  ) {}

  async execute(userId: string): Promise<VoucherResponseDTO[]> {
    const business = await this.businessRepo.findByUserId(userId)
    if (!business) throw new BusinessNotFoundError(userId)

    const vouchers = await this.voucherRepo.findByBusinessId(business.id)
    return vouchers.map(VoucherMapper.toDTO)
  }
}
