import { Business } from '@/domain/entities/Business'
import type { BusinessResponseDTO } from '../dtos/BusinessDTO'

export class BusinessMapper {
  static toDTO(entity: Business): BusinessResponseDTO {
    return {
      id: entity.id,
      userId: entity.userId,
      name: entity.name,
      description: entity.description,
      address: entity.address,
      city: entity.city,
      postalCode: entity.postalCode,
      province: entity.province,
      phone: entity.phone,
      website: entity.website,
      status: entity.status,
      verifiedAt: entity.verifiedAt,
      verificationNotes: entity.verificationNotes,
      logo: entity.logo,
      categoryIds: entity.categoryIds,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }
}
