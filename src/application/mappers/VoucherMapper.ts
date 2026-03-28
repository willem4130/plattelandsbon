import { Voucher } from '@/domain/entities/Voucher'
import type { VoucherResponseDTO } from '../dtos/VoucherDTO'

export class VoucherMapper {
  static toDTO(entity: Voucher): VoucherResponseDTO {
    return {
      id: entity.id,
      businessId: entity.businessId,
      title: entity.title,
      description: entity.description,
      discountType: entity.discountType,
      discountValue: entity.discountValue,
      discountDescription: entity.discountDescription,
      terms: entity.terms,
      minimumPurchase: entity.minimumPurchase,
      startDate: entity.startDate,
      endDate: entity.endDate,
      maxClaims: entity.maxClaims,
      claimsCount: entity.claimsCount,
      status: entity.status,
      image: entity.image,
      slug: entity.slug,
      isClaimable: entity.isClaimable(),
      remainingClaims: entity.remainingClaims(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }
}
