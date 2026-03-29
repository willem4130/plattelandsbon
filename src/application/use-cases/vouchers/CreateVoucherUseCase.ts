import type { IUseCase } from '@/application/interfaces'
import type { IVoucherRepository } from '@/domain/repositories/IVoucherRepository'
import type { IBusinessRepository } from '@/domain/repositories/IBusinessRepository'
import { BusinessNotFoundError, BusinessNotVerifiedError, DomainError } from '@/domain/errors'
import { VoucherMapper } from '../../mappers/VoucherMapper'
import type { CreateVoucherDTO, VoucherResponseDTO } from '../../dtos/VoucherDTO'
import { SlugService } from '@/domain/services/SlugService'

export class CreateVoucherUseCase
  implements IUseCase<CreateVoucherDTO & { userId: string }, VoucherResponseDTO>
{
  constructor(
    private voucherRepo: IVoucherRepository,
    private businessRepo: IBusinessRepository,
  ) {}

  async execute(input: CreateVoucherDTO & { userId: string }): Promise<VoucherResponseDTO> {
    if (input.startDate >= input.endDate) {
      throw new DomainError('Start date must be before end date')
    }

    const business = await this.businessRepo.findByUserId(input.userId)
    if (!business) throw new BusinessNotFoundError(input.userId)
    if (!business.canCreateVouchers()) throw new BusinessNotVerifiedError(business.id)

    let slug = SlugService.generate(input.title)
    const existingSlug = await this.voucherRepo.findBySlug(slug)
    if (existingSlug) {
      slug = SlugService.makeUnique(slug)
    }

    const voucher = await this.voucherRepo.create({
      businessId: business.id,
      title: input.title,
      description: input.description,
      discountType: input.discountType,
      discountValue: input.discountValue,
      discountDescription: input.discountDescription,
      terms: input.terms,
      minimumPurchase: input.minimumPurchase,
      startDate: input.startDate,
      endDate: input.endDate,
      maxClaims: input.maxClaims,
      image: input.image,
      slug,
      status: 'DRAFT',
    })

    return VoucherMapper.toDTO(voucher)
  }
}
