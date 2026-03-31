import type { IUseCase } from '@/application/interfaces'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import { UserRole } from '@/domain/value-objects/UserRole'
import { UserMapper } from '../../mappers/UserMapper'
import type { UserResponseDTO } from '../../dtos/UserDTO'

interface FindOrCreateConsumerInput {
  email: string
}

export class FindOrCreateConsumerUseCase
  implements IUseCase<FindOrCreateConsumerInput, UserResponseDTO>
{
  constructor(private userRepo: IUserRepository) {}

  async execute(input: FindOrCreateConsumerInput): Promise<UserResponseDTO> {
    const existing = await this.userRepo.findByEmail(input.email)
    if (existing) {
      return UserMapper.toDTO(existing)
    }

    const user = await this.userRepo.create({
      email: input.email,
      name: input.email.split('@')[0] ?? 'Bezoeker',
      role: UserRole.CONSUMER,
    })

    return UserMapper.toDTO(user)
  }
}
