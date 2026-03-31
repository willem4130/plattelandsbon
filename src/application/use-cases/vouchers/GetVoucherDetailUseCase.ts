import type { IUseCase } from '@/application/interfaces'
import type { IVoucherRepository } from '@/domain/repositories/IVoucherRepository'
import type { IBusinessRepository } from '@/domain/repositories/IBusinessRepository'
import { VoucherNotFoundError } from '@/domain/errors'
import type { VoucherDetailDTO } from '../../dtos/BrowseDTO'

export class GetVoucherDetailUseCase implements IUseCase<string, VoucherDetailDTO> {
  constructor(
    private voucherRepo: IVoucherRepository,
    private businessRepo: IBusinessRepository,
  ) {}

  async execute(voucherId: string): Promise<VoucherDetailDTO> {
    const voucher = await this.voucherRepo.findById(voucherId)
    if (!voucher) throw new VoucherNotFoundError(voucherId)

    const business = await this.businessRepo.findById(voucher.businessId)

    return {
      id: voucher.id,
      title: voucher.title,
      description: voucher.description,
      discountType: voucher.discountType,
      discountValue: voucher.discountValue,
      discountDescription: voucher.discountDescription,
      terms: voucher.terms,
      minimumPurchase: voucher.minimumPurchase,
      slug: voucher.slug,
      status: voucher.status,
      startDate: voucher.startDate,
      endDate: voucher.endDate,
      maxClaims: voucher.maxClaims,
      claimsCount: voucher.claimsCount,
      remainingClaims: voucher.remainingClaims(),
      businessId: voucher.businessId,
      businessName: business?.name ?? 'Onbekend bedrijf',
      city: business?.city ?? null,
    }
  }
}
