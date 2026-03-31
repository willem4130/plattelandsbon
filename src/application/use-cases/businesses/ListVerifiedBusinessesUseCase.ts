import type { IUseCase } from '@/application/interfaces'
import type { IBusinessRepository } from '@/domain/repositories/IBusinessRepository'
import type { ICategoryRepository } from '@/domain/repositories/ICategoryRepository'
import type { IVoucherRepository } from '@/domain/repositories/IVoucherRepository'
import { BusinessStatus } from '@/domain/value-objects/BusinessStatus'
import type { BusinessBrowseDTO } from '../../dtos/BrowseDTO'

export class ListVerifiedBusinessesUseCase implements IUseCase<void, BusinessBrowseDTO[]> {
  constructor(
    private businessRepo: IBusinessRepository,
    private categoryRepo: ICategoryRepository,
    private voucherRepo: IVoucherRepository,
  ) {}

  async execute(): Promise<BusinessBrowseDTO[]> {
    const businesses = await this.businessRepo.findByStatus(BusinessStatus.VERIFIED)

    const businessIds = businesses.map((b) => b.id)

    const [categories, voucherCountMap] = await Promise.all([
      this.categoryRepo.findAll(),
      this.voucherRepo.countActiveByBusinessIds(businessIds),
    ])

    const categoryMap = new Map(categories.map((c) => [c.id, c]))

    return businesses.map((business) => {
      const categorySlugs = business.categoryIds
        .map((id) => categoryMap.get(id)?.slug)
        .filter((slug): slug is string => slug !== undefined)

      const categoryNames = business.categoryIds
        .map((id) => categoryMap.get(id)?.name)
        .filter((name): name is string => name !== undefined)

      return {
        id: business.id,
        name: business.name,
        description: business.description,
        city: business.city,
        province: business.province,
        phone: business.phone,
        website: business.website,
        categories: categorySlugs,
        categoryNames,
        activeVoucherCount: voucherCountMap.get(business.id) ?? 0,
      }
    })
  }
}
