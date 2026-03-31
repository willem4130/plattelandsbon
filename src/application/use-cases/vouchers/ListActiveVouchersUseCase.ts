import type { IUseCase } from '@/application/interfaces'
import type { IVoucherRepository } from '@/domain/repositories/IVoucherRepository'
import type { IBusinessRepository } from '@/domain/repositories/IBusinessRepository'
import type { ICategoryRepository } from '@/domain/repositories/ICategoryRepository'
import { VoucherStatus } from '@/domain/value-objects/VoucherStatus'
import type { VoucherBrowseDTO } from '../../dtos/BrowseDTO'

export class ListActiveVouchersUseCase implements IUseCase<void, VoucherBrowseDTO[]> {
  constructor(
    private voucherRepo: IVoucherRepository,
    private businessRepo: IBusinessRepository,
    private categoryRepo: ICategoryRepository,
  ) {}

  async execute(): Promise<VoucherBrowseDTO[]> {
    const vouchers = await this.voucherRepo.findByStatus(VoucherStatus.ACTIVE)

    const uniqueBusinessIds = [...new Set(vouchers.map((v) => v.businessId))]

    const [businesses, categories] = await Promise.all([
      this.businessRepo.findByIds(uniqueBusinessIds),
      this.categoryRepo.findAll(),
    ])

    const businessMap = new Map(businesses.map((b) => [b.id, b]))
    const categoryMap = new Map(categories.map((c) => [c.id, c]))

    return vouchers.map((voucher) => {
      const business = businessMap.get(voucher.businessId)
      const businessCategoryIds = business?.categoryIds ?? []
      const categorySlugs = businessCategoryIds
        .map((id) => categoryMap.get(id)?.slug)
        .filter((slug): slug is string => slug !== undefined)

      return {
        id: voucher.id,
        title: voucher.title,
        description: voucher.description,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        discountDescription: voucher.discountDescription,
        terms: voucher.terms,
        slug: voucher.slug,
        businessId: voucher.businessId,
        businessName: business?.name ?? 'Onbekend bedrijf',
        city: business?.city ?? null,
        categories: categorySlugs,
        maxClaims: voucher.maxClaims,
        claimsCount: voucher.claimsCount,
        startDate: voucher.startDate,
        endDate: voucher.endDate,
      }
    })
  }
}
