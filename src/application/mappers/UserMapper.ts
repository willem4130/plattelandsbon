import type { User } from '@/domain/entities/User'
import type { UserResponseDTO } from '../dtos/UserDTO'

export class UserMapper {
  static toDTO(entity: User): UserResponseDTO {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      role: entity.role,
      image: entity.image,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      emailVerified: entity.emailVerified,
    }
  }
}
